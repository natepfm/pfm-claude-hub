#!/usr/bin/env python3
"""call-graphics fire script — Banner/EndCard gens from a brand's template library.

Brand-agnostic. Each brand resolves to its own template library + wordmark via the
BRANDS registry (or per-run --lib / --wordmark overrides). SMA and SMH ship registered;
add new brands to BRANDS. --brand defaults to SMA so existing calls keep working.

Usage:
  python3 fire.py --brand SMH --design "Apple Navy" --out "<project>/Elements/Graphics/<subfolder>" \
    --jobs '[{"piece":"Banner","variant":"Roku","phone":"1-833-338-5059"}, ...]' [--dry-run]

  # ad-hoc brand with no registry entry:
  python3 fire.py --lib "/path/to/<Brand>/Endcard & Banner Graphic Templates" \
    --wordmark "/path/to/wordmark.png" --design "Apple Navy" --out ... --jobs ...

piece: Banner | EndCard      variant: Roku | TD
phone: rendered EXACTLY as given — local "(XXX) XXX-XXXX" or toll-free "1-XXX-XXX-XXXX".
Model locked: gpt_image_2, 2k, 16:9, brand wordmark uploaded fresh as ref.
"""
import argparse, json, re, secrets, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Brand registry — each brand resolves to its template library + wordmark.
# Add a brand here (or override per-run with --lib / --wordmark).
BRANDS = {
    "SMA": {
        "lib": "/Volumes/ads/PFM MEDIA MASTER FOLDER/7. SMA Organic/SMA - Brand Folder/Endcard & Banner Graphic Templates",
        "wordmark": "/Volumes/ads/PFM MEDIA MASTER FOLDER/2. Client Media Assets/SMA - Brand Folder/Logos/savemaxauto-wordmark.png",
    },
    "SMH": {
        "lib": "/Volumes/ads/PFM MEDIA MASTER FOLDER/2. Client Media Assets/SaveMaxHomes - Client Assets/Endcard & Banner Graphic Templates",
        "wordmark": "/Volumes/ads/PFM MEDIA MASTER FOLDER/2. Client Media Assets/SaveMaxHomes - Client Assets/Logos/savemaxhomes-wordmark.png",
    },
}

# Accept the local parenthesized format "(206) 385-8286" OR a toll-free
# "1-833-338-5059" (also bare "833-338-5059"). Rendered EXACTLY as given.
PHONE_RE = re.compile(r"^(\(\d{3}\) \d{3}-\d{4}|1-\d{3}-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$")


def normalize_banner_height(path, target_pct=0.15, max_pct=0.165):
    """Banner bands GPT renders too tall get composited down to target_pct of frame height.
    Crop the band, uniform-downscale (no type squash), extend the flat background + hairline
    to full width by stretching the band's right edge column. Locked 2026-06-11 (Sam: the
    generated bands ran 23-40% — way too tall on screen; prompt-only fixes asymptote ~23%)."""
    import subprocess as sp
    r = sp.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)], capture_output=True, text=True)
    dims = [int(l.split(":")[1]) for l in r.stdout.splitlines() if "pixel" in l]
    W, H = dims[0], dims[1]
    r = sp.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"scale=1:{H}",
                "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True)
    rows = list(r.stdout)
    dark = [i for i, v in enumerate(rows) if v < 128]
    if not dark:
        print(f"    ⚠ no band detected in {path.name} — skipping normalization")
        return
    band_top = min(dark)
    band_h = H - band_top
    if band_h / H <= max_pct:
        print(f"    band already {band_h/H*100:.0f}% — no normalization needed")
        return
    target_h = round(H * target_pct)
    new_w = round(W * target_h / band_h)
    gap = W - new_w
    top_h = H - target_h
    tmp = str(path) + ".norm.png"
    fc = (f"[0:v]crop={W}:{min(600, band_top)}:0:0,scale={W}:{top_h}[top];"
          f"[0:v]crop={W}:{band_h}:0:{band_top},scale={new_w}:{target_h}[bandsrc];"
          f"[bandsrc]split[b1][b2];"
          f"[b2]crop=4:{target_h}:{new_w-8}:0,scale={gap}:{target_h}:flags=neighbor[edge];"
          f"[b1][edge]hstack=2[row];"
          f"[top][row]vstack=2")
    sp.run(["ffmpeg", "-y", "-v", "error", "-i", str(path), "-filter_complex", fc,
            "-frames:v", "1", tmp], check=True)
    Path(tmp).replace(path)
    print(f"    band normalized {band_h/H*100:.0f}% -> {target_pct*100:.0f}% of frame")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", default="SMA",
                    help=f"Brand key (registered: {', '.join(BRANDS)}). Default SMA. Resolves the template library + wordmark.")
    ap.add_argument("--design", required=True, help='Library design folder name, e.g. "Apple Navy"')
    ap.add_argument("--out", required=True, help="Output folder (project Elements/Graphics/<subfolder>)")
    ap.add_argument("--jobs", required=True, help='JSON list: [{"piece","variant","phone"}, ...]')
    ap.add_argument("--lib", help="Override the brand's template library path (ad-hoc brand not in BRANDS)")
    ap.add_argument("--wordmark", help="Override the brand's wordmark PNG path (ad-hoc brand not in BRANDS)")
    ap.add_argument("--dry-run", action="store_true", help="Print the plan, fire nothing")
    args = ap.parse_args()

    # Resolve brand -> template library + wordmark (CLI overrides win over the registry).
    reg = BRANDS.get(args.brand, {})
    lib_path = args.lib or reg.get("lib")
    wordmark_path = args.wordmark or reg.get("wordmark")
    if not lib_path or not wordmark_path:
        sys.exit(f"Brand '{args.brand}' not registered and no --lib/--wordmark given. "
                 f"Registered brands: {sorted(BRANDS)}")
    LIB = Path(lib_path)
    WORDMARK = Path(wordmark_path)
    if not WORDMARK.exists():
        sys.exit(f"{args.brand} wordmark not found: {WORDMARK}")

    design_md = LIB / args.design / "design.md"
    if not design_md.exists():
        available = sorted(p.name for p in LIB.iterdir() if (p / "design.md").exists()) if LIB.exists() else []
        sys.exit(f"Design '{args.design}' not found in the {args.brand} library ({LIB}). "
                 f"Designs with a design.md: {available}")
    blocks = re.findall(r"```\n(.*?)\n```", design_md.read_text(), re.DOTALL)
    assert len(blocks) == 2, f"{args.brand}/{args.design}/design.md: expected 2 prompt blocks, got {len(blocks)}"
    banner_tpl, endcard_tpl = blocks
    assert "THE STRIP — BOTTOM" in banner_tpl, "banner block is not the strip version — check design.md block order"
    templates = {"Banner": banner_tpl, "EndCard": endcard_tpl}

    jobs = json.loads(args.jobs)
    for j in jobs:
        assert j["piece"] in templates, f"bad piece: {j['piece']} (Banner|EndCard)"
        assert j["variant"] in ("Roku", "TD"), f"bad variant: {j['variant']} (Roku|TD)"
        assert PHONE_RE.match(j["phone"]), \
            f"phone '{j['phone']}' not in an accepted format ((XXX) XXX-XXXX or 1-XXX-XXX-XXXX)"
        j["prompt"] = templates[j["piece"]].replace("{PHONE}", j["phone"])
        j["last4"] = re.sub(r"\D", "", j["phone"])[-4:]
        j["label"] = f"{j['piece']}_{j['variant']}_{j['last4']}"

    out_dir = Path(args.out)
    print(f"Brand: {args.brand} | Design: {args.design} | Output: {out_dir} | {len(jobs)} fire(s) ≈ {len(jobs)*7} cr")
    for j in jobs:
        print(f"  • {j['piece']} {j['variant']} {j['phone']} ({len(j['prompt'])} chars)")
    if args.dry_run:
        print("DRY RUN — nothing fired.")
        return

    print(f"=== Pre-uploading {args.brand} wordmark ===")
    r = subprocess.run(["higgsfield", "upload", "create", str(WORDMARK), "--json"],
                       capture_output=True, text=True, check=True)
    wm_uuid = json.loads(r.stdout)["id"]
    print(f"  Wordmark: {wm_uuid}")

    def fire_one(job):
        cmd = [
            "higgsfield", "generate", "create", "gpt_image_2",
            "--prompt", job["prompt"],
            "--image", wm_uuid,
            "--aspect_ratio", "16:9", "--resolution", "2k",
            "--wait", "--wait-timeout", "15m", "--json",
        ]
        t0 = time.monotonic()
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=1020)
        Path("/tmp/hvg-flow-results").mkdir(exist_ok=True)
        Path(f"/tmp/hvg-flow-results/callgfx_{job['label']}.json").write_text(r.stdout or "")
        elapsed = time.monotonic() - t0
        try:
            data = json.loads(r.stdout)
            return (job, data[0]["status"], elapsed, data[0].get("result_url") or "")
        except Exception as e:
            return (job, f"PARSE_FAIL: {e}", elapsed, "")

    print(f"=== Firing {len(jobs)} graphic(s) (gpt_image_2, 2k, 16:9) ===")
    t_start = time.monotonic()
    results = []
    with ThreadPoolExecutor(max_workers=min(len(jobs), 16)) as ex:
        futs = [ex.submit(fire_one, j) for j in jobs]
        for fut in as_completed(futs):
            job, status, elapsed, url = fut.result()
            mark = "✓" if status == "completed" else "✗"
            print(f"  [{elapsed:6.1f}s] {mark} {job['label']} — {status}")
            results.append((job, status, url))
    print(f"=== Fire complete in {time.monotonic() - t_start:.1f}s ===")

    print("=== Downloading ===")
    out_dir.mkdir(parents=True, exist_ok=True)
    failed = 0
    for job, status, url in results:
        if status != "completed" or not url:
            failed += 1
            print(f"  ⚠ {job['label']} — {status}, not downloaded")
            continue
        fname = f"{job['piece']} {job['variant']} {job['last4']} - {args.design} - GPT_{secrets.token_hex(2)}.png"
        out = out_dir / fname
        urllib.request.urlretrieve(url, out)
        print(f"  ✓ {fname} ({out.stat().st_size} bytes)")
        if job["piece"] == "Banner":
            normalize_banner_height(out)
    if failed:
        sys.exit(f"{failed} fire(s) did not complete — refire those jobs")

if __name__ == "__main__":
    main()
