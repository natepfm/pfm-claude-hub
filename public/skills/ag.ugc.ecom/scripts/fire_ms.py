#!/usr/bin/env python3
"""fire_ms.py — the gated fire path for ag.ugc.ecom (Higgsfield Marketing Studio UGC).

Every law of this skill lives HERE as a refusal, not in prose (rules-ship-as-code):
  R1  720p LOCKED on every fire (Sam, 08.12.26). 1080p only via --allow-1080 "editor reason".
  R2  avatar_ids/product_ids are built as JSON arrays BY THIS SCRIPT (bare UUIDs silently
      pass `generate cost` then fail create — the script owns the syntax).
  R3  Exactly ONE style per line; empty or missing style refuses.
  R4  Word band scales with duration (2.0–2.9 w/s): at 7s → 14–20 words. Under-band lines
      refuse (merge into a neighbour — short lines attract garbled ad-libs); over-band
      refuses (silent truncation risk).
  R5  Digits/% in spoken dialogue refuse — write "Thirty-eight percent", captions carry
      the numeral.
  R6  Guard stack auto-appended to EVERY prompt (identity lock, product accuracy,
      no-branded-packaging, no-ad-lib, pacing). Manifest missing identity_block or
      product_accuracy_block refuses.
  R7  Refires land as the next vN IN PLACE, same folder — never overwrite, never relocate
      (locked 2026-07-17; supersedes the proposal's _superseded/ move).
  R8  Batch refuses without a .smoke_ok stamp (fire ONE, show it, editor says go,
      `--smoke-ok` records the go).
  R9  ≥20 items refuses without --preflight-confirmed (HARD RULE 3 — the Fire? card
      happens in chat first).
  R10 No automatic QC. This script downloads and reports; it never looks.

Usage:
  fire_ms.py <manifest.yaml> --line C2_H1_01 [--dry-run]
  fire_ms.py <manifest.yaml> --smoke-ok
  fire_ms.py <manifest.yaml> --batch [--preflight-confirmed] [--dry-run]
"""
import argparse
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import yaml

WPS_LOW, WPS_HIGH = 2.0, 2.9

REQUIRED_FIELDS = ["project_dir", "product_id", "avatar_id", "duration", "aspect",
                   "identity_block", "product_accuracy_block", "lines"]
REQUIRED_LINE_FIELDS = ["id", "hook", "style", "scene", "dialogue"]


def die(msg):
    print(f"🔴 REFUSED: {msg}", file=sys.stderr)
    sys.exit(1)


def load_manifest(path):
    p = Path(path)
    if not p.exists():
        die(f"manifest not found: {p}")
    m = yaml.safe_load(p.read_text())
    for f in REQUIRED_FIELDS:
        if not m.get(f):
            die(f"manifest missing required field: {f}")
    for ln in m["lines"]:
        for f in REQUIRED_LINE_FIELDS:
            if not ln.get(f):
                die(f"line {ln.get('id', '?')} missing required field: {f}  (R3: exactly one style, always)")
        if isinstance(ln["style"], (list, tuple)):
            die(f"line {ln['id']}: multiple styles — exactly ONE style per line (R3)")
    ids = [ln["id"] for ln in m["lines"]]
    if len(ids) != len(set(ids)):
        die("duplicate line ids in manifest")
    return m, p


def lint_line(ln, duration):
    words = len(ln["dialogue"].split())
    lo, hi = int(WPS_LOW * duration), int(WPS_HIGH * duration)
    if words < lo:
        die(f"line {ln['id']}: {words} words < {lo} minimum at {duration}s — MERGE it into a "
            f"neighbour beat; short lines leave dead air the model fills with garbled ad-libs (R4)")
    if words > hi:
        die(f"line {ln['id']}: {words} words > {hi} max at {duration}s — silent truncation risk; "
            f"split on a beat boundary (R4)")
    if re.search(r"[0-9%$]", ln["dialogue"]):
        die(f"line {ln['id']}: digits/%/$ in spoken dialogue — write numbers out "
            f"(\"Thirty-eight percent\"); captions carry the numeral (R5)")


def build_prompt(m, ln):
    unboxing = "unboxing" in ln["style"]
    packaging = ("Plain unbranded packaging only — no printed logos, no brand-marked boxes."
                 if unboxing else
                 "No cardboard boxes, no delivery cartons, no printed packaging.")
    blocks = [
        ln["scene"].strip(),
        "IDENTITY LOCK: " + m["identity_block"].strip() +
        " The same person in every shot — do not substitute a different person.",
        "PRODUCT ACCURACY: " + m["product_accuracy_block"].strip(),
        f"PACKAGING: {packaging} No hangtags, no swing tickets, no stickers or labels on the product.",
        f'She speaks these EXACT words verbatim, word for word, and nothing else: "{ln["dialogue"].strip()}" '
        "No additional words, no ad-libs, no appended phrases — when the line ends, she stops speaking.",
        "PACING: relaxed natural speaking pace; the full line is completed comfortably within the clip.",
    ]
    return "\n".join(blocks)


def next_version_path(out_dir, ln):
    out_dir.mkdir(parents=True, exist_ok=True)
    pat = re.compile(re.escape(f"{ln['id']}_{ln['style']}_v") + r"(\d+)\.mp4$")
    taken = [int(mm.group(1)) for f in out_dir.iterdir() if (mm := pat.match(f.name))]
    return out_dir / f"{ln['id']}_{ln['style']}_v{max(taken, default=0) + 1:02d}.mp4"


def fire_one(m, ln, resolution, dry_run):
    prompt = build_prompt(m, ln)
    out_dir = Path(m["project_dir"]) / "Elements" / "Footage" / "Veo" / ln["hook"]
    out_path = next_version_path(out_dir, ln)
    cmd = [
        "higgsfield", "generate", "create", "marketing_studio_video",
        "--prompt", prompt,
        "--mode", ln["style"],
        "--duration", str(m["duration"]),
        "--aspect_ratio", m["aspect"],
        "--resolution", resolution,          # R1: locked 720p unless --allow-1080
        "--generate_audio", "true",
        "--avatar_ids", json.dumps([m["avatar_id"]]),   # R2: JSON arrays, always
        "--product_ids", json.dumps([m["product_id"]]),
        "--wait", "--json",
    ]
    if dry_run:
        print(f"── DRY RUN {ln['id']} → {out_path.name} ──")
        print(prompt)
        print("CMD: " + " ".join(f"'{c}'" if " " in c else c for c in cmd))
        return ln["id"], None, out_path
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"🔴 {ln['id']} FIRE FAILED:\n{res.stderr.strip() or res.stdout.strip()}", file=sys.stderr)
        return ln["id"], None, out_path
    try:
        payload = json.loads(res.stdout)
    except json.JSONDecodeError:
        print(f"🔴 {ln['id']}: unparseable CLI output:\n{res.stdout[:500]}", file=sys.stderr)
        return ln["id"], None, out_path
    url = _extract_url(payload)
    if not url:
        print(f"🔴 {ln['id']}: job finished with no result_url — check job_display for vendor status",
              file=sys.stderr)
        return ln["id"], None, out_path
    subprocess.run(["curl", "-sf", "-o", str(out_path), url], check=True)
    sidecar = {"line": ln, "prompt": prompt, "engine": "marketing_studio_video",
               "resolution": resolution, "duration": m["duration"], "aspect": m["aspect"],
               "avatar_id": m["avatar_id"], "product_id": m["product_id"],
               "result_url": url, "take": out_path.stem.rsplit("_v", 1)[-1]}
    out_path.with_suffix(".json").write_text(json.dumps(sidecar, indent=2))
    return ln["id"], url, out_path


def _extract_url(payload):
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("result_url", "url") and isinstance(v, str) and v.startswith("http") \
                        and ".mp4" in v.split("?")[0]:
                    return v
                if (found := walk(v)):
                    return found
        elif isinstance(o, list):
            for i in o:
                if (found := walk(i)):
                    return found
        return None
    return walk(payload)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--line", help="fire one line by id")
    ap.add_argument("--batch", action="store_true", help="fire every line (needs .smoke_ok)")
    ap.add_argument("--smoke-ok", action="store_true",
                    help="record the editor's go after the smoke clip was approved")
    ap.add_argument("--allow-1080", metavar="REASON",
                    help="editor explicitly asked for 1080p on this fire; give their reason")
    ap.add_argument("--preflight-confirmed", action="store_true",
                    help="the ≥20-item Fire? card was confirmed in chat (HARD RULE 3)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    m, mpath = load_manifest(args.manifest)
    stamp = mpath.parent / ".smoke_ok"

    if args.smoke_ok:
        stamp.write_text("editor approved the smoke clip\n")
        print(f"✅ smoke stamp recorded: {stamp}")
        return

    resolution = "720p"
    if args.allow_1080:
        resolution = "1080p"
        print(f"⚠ 1080p override — editor reason: {args.allow_1080} (2× credits)")

    for ln in m["lines"]:
        lint_line(ln, m["duration"])

    if args.line:
        targets = [ln for ln in m["lines"] if ln["id"] == args.line]
        if not targets:
            die(f"no line with id {args.line} in manifest")
    elif args.batch:
        if not stamp.exists():
            die("batch fire without a smoke stamp — fire ONE line first (--line <id>), show it, "
                "and record the editor's go with --smoke-ok (R8)")
        targets = m["lines"]
        if len(targets) >= 20 and not args.preflight_confirmed:
            die(f"{len(targets)} items ≥ 20 — run the full preflight + Fire? card in chat, then "
                f"re-run with --preflight-confirmed (HARD RULE 3, R9)")
    else:
        die("pass --line <id>, --batch, or --smoke-ok")

    if args.dry_run:
        for ln in targets:
            fire_one(m, ln, resolution, dry_run=True)
        print(f"\n{len(targets)} line(s) linted clean. Cost note: 5 cr/s at 720p "
              f"({5 * m['duration']} cr/clip), 10 cr/s at 1080p.")
        return

    # Rule 5: concurrent fires, each streamed the instant it lands.
    with ThreadPoolExecutor(max_workers=min(8, len(targets))) as pool:
        futs = {pool.submit(fire_one, m, ln, resolution, False): ln["id"] for ln in targets}
        landed = failed = 0
        for fut in as_completed(futs):
            lid, url, out_path = fut.result()
            if url:
                landed += 1
                print(f"📲 {lid} landed → {url}\n   📁 {out_path}")
            else:
                failed += 1
    print(f"\n{landed} landed, {failed} failed, of {len(targets)} fired at {resolution}.")
    print("No QC was run (R10). Editor-invoked checks: audio-qc (transcript/levels) · "
          "visual-qc (filmstrip) — offer, never run.")


if __name__ == "__main__":
    main()
