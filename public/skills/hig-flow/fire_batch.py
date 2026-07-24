#!/usr/bin/env python3
"""PFM b-roll pipeline spine — fire + deliver ONE normalized job list.

This is the shared fire/deliver engine every b-roll TYPE skill calls (iphone-broll,
jre-swap, social-proof-phone-quote, broadcast-news-stills, object-inserts, and hig-flow's
own fallback drafter). The type skill owns the craft + writes the job list; this owns the
mechanics: pre-upload → concurrent fire (Rule-5 streamed) → serial verified download →
manifest → count verify → Lucid handoff (📁/🔗/🦊). See PIPELINE-SPEC.md for the contract.

    python3 fire_batch.py <joblist.json>            # DRY-RUN: plan + cost, spends nothing
    python3 fire_batch.py <joblist.json> --fire     # actually upload + generate + deliver
    python3 fire_batch.py <joblist.json> --fire --project-root /Volumes/ads/.../<project>

Default is DRY-RUN — bare invocation never spends a credit (matches Rule 3: no fire without
confirmation). The type skill shows its preflight, gets the editor's Fire?, THEN passes --fire.

What this does NOT do (Claude's job, around the call): the AGF `Asset Gen` interlock (Notion
MCP), and the per-gen 📲/widget reveal — this streams `LANDED <shotId>: <url>` to stdout and
Claude relays each line the instant it prints (Rule 5). Compatible with macOS system python3.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

HELPER = os.path.expanduser("~/.claude/skills/notion-asset-delivery/linkyourfile.py")
HERE = os.path.dirname(os.path.abspath(__file__))
UUID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I)
MODEL_DISPLAY = {
    "nano_banana_2": "Nano Banana Pro", "nano_banana_flash": "Nano Banana Flash",
    "gpt_image_2": "GPT Image 2", "flux_2": "Flux 2", "z_image": "Z Image",
}


def log(msg):
    print(msg, flush=True)


# ---- load + validate --------------------------------------------------------

def load_joblist(path):
    with open(path, encoding="utf-8") as f:
        jl = json.load(f)
    for key in ("project", "gen", "outDir", "shots"):
        if key not in jl:
            sys.exit("ERROR: job list missing required key: %s" % key)
    if not jl["shots"]:
        sys.exit("ERROR: job list has zero shots")
    jl.setdefault("naming", "{nn}_{shot}_{hex}.png")
    jl.setdefault("manifest", "none")
    jl["gen"].setdefault("count", 1)
    jl["gen"].setdefault("resolution", "1k")
    jl["gen"].setdefault("estCostPerImage", 5)
    for i, s in enumerate(jl["shots"]):
        if "shotId" not in s or "prompt" not in s:
            sys.exit("ERROR: shot %d missing shotId or prompt" % i)
        s.setdefault("refs", [])
        s.setdefault("aspect", jl["gen"].get("aspect", "9:16"))
    return jl


def abspath(root, p):
    return p if os.path.isabs(p) else os.path.normpath(os.path.join(root, p))


def unique_refs(jl, root):
    seen = {}
    for s in jl["shots"]:
        for r in s["refs"]:
            key = r if UUID_RE.match(r) else abspath(root, r)
            seen[key] = r
    return list(seen.keys())


# ---- ref preflight (resize oversize before upload) --------------------------

def maybe_resize(path):
    """Return a path safe to upload — resized copy if the original is >2000px or >3MB."""
    if UUID_RE.match(path):
        return path
    if not os.path.isfile(path):
        return path  # caller reports the miss
    too_big = os.path.getsize(path) > 3 * 1024 * 1024
    width = 0
    try:
        out = subprocess.run(["sips", "-g", "pixelWidth", path], capture_output=True, text=True)
        m = re.search(r"pixelWidth:\s*(\d+)", out.stdout)
        width = int(m.group(1)) if m else 0
    except Exception:
        pass
    if not too_big and 0 < width <= 2000:
        return path
    tmp = os.path.join("/tmp", "fireref_%s_%s" % (os.getpid(), os.path.basename(path)))
    subprocess.run(["sips", "-Z", "1920", path, "--out", tmp], capture_output=True, text=True)
    return tmp if os.path.isfile(tmp) else path


# ---- upload -----------------------------------------------------------------

def preupload(refs):
    """Serial upload (the auth race is real — never pool uploads). Returns {ref_key: uuid}."""
    uuid_map = {}
    for r in refs:
        if UUID_RE.match(r):
            uuid_map[r] = r
            continue
        if not os.path.isfile(r):
            log("  ⚠ ref not found, shots using it will fire ref-less: %s" % r)
            continue
        up = maybe_resize(r)
        res = subprocess.run(["higgsfield", "upload", "create", up, "--json"],
                             capture_output=True, text=True)
        try:
            uuid_map[r] = json.loads(res.stdout)["id"]
        except Exception:
            log("  ⚠ upload failed for %s: %s" % (r, (res.stderr or res.stdout)[:120]))
    return uuid_map


# ---- fire (Rule-5 streamed) -------------------------------------------------

def extract_urls(parsed):
    """Robust across CLI response shapes: top-level ARRAY (the `--wait --json` shape —
    result lives on [0], never the list itself; fire_veo lesson 2026-05-29),
    results[].rawUrl, result_url (str|list), url."""
    if isinstance(parsed, list):
        urls = []
        for item in parsed:
            urls += extract_urls(item)
        return urls
    if not isinstance(parsed, dict):
        return []
    if isinstance(parsed.get("results"), list):
        urls = [r.get("rawUrl") or r.get("url") for r in parsed["results"] if isinstance(r, dict)]
        urls = [u for u in urls if u]
        if urls:
            return urls
    ru = parsed.get("result_url") or parsed.get("url")
    if isinstance(ru, list):
        return [u for u in ru if u]
    return [ru] if ru else []


def fire_all(jl, root, uuid_map, workers=16, results_path=None):
    """Fire every shot×take concurrently; STREAM each result the instant it lands (Rule 5).

    Shots whose DECLARED refs didn't resolve (file missing / upload failed) are SKIPPED,
    never fired ref-less — a swap shot without its identity/scene ref is wrong-shape spend
    (the Ronald Curtis class). Every landing is also appended to results_path (JSONL) so a
    crashed run can recover its paid-for URLs instead of double-spending.
    """
    gen = jl["gen"]
    takes = ["%02d" % t for t in range(1, gen["count"] + 1)]

    results = {}
    jobs = []
    for s in jl["shots"]:
        keys = [r if UUID_RE.match(r) else abspath(root, r) for r in s["refs"]]
        missing = [k for k in keys if k not in uuid_map]
        if missing:
            log("SKIPPED %s: %d declared ref(s) unresolved — not firing ref-less (%s)" % (
                s["shotId"], len(missing), "; ".join(os.path.basename(m) for m in missing)))
            for t in takes:
                results["%s_v%s" % (s["shotId"], t)] = {"shot": s, "take": t, "url": None}
            continue
        s["_ref_uuids"] = [uuid_map[k] for k in keys]
        jobs += [(s, t) for t in takes]

    def fire_one(shot, take):
        img_flags = []
        for u in shot["_ref_uuids"]:
            img_flags += ["--image", u]
        cmd = ["higgsfield", "generate", "create", gen["model"],
               "--prompt", shot["prompt"], *img_flags,
               "--aspect_ratio", shot.get("aspect", "9:16"),
               "--resolution", gen["resolution"],
               "--wait", "--wait-timeout", "5m", "--json"]
        return subprocess.run(cmd, capture_output=True, text=True, timeout=360)

    results_fh = open(results_path, "a", encoding="utf-8") if results_path else None
    log("── firing %d job(s) at %d workers ──" % (len(jobs), min(workers, 16)))
    with ThreadPoolExecutor(max_workers=min(workers, 16)) as ex:
        futs = {ex.submit(fire_one, s, t): (s, t) for s, t in jobs}
        for fut in as_completed(futs):
            shot, take = futs[fut]
            key = "%s_v%s" % (shot["shotId"], take)
            err = None
            try:
                res = fut.result()
                parsed = json.loads(res.stdout) if res.returncode == 0 and res.stdout.strip() else None
            except Exception as e:
                parsed, err = None, str(e)[:80]
            urls = extract_urls(parsed) if parsed else []
            url = urls[0] if urls else None
            results[key] = {"shot": shot, "take": take, "url": url}
            if results_fh:  # crash-recovery record, flushed per landing (as_completed runs in main thread)
                results_fh.write(json.dumps({"key": key, "shotId": shot["shotId"], "take": take, "url": url}) + "\n")
                results_fh.flush()
            # 🔴 Rule 5: emit the instant it resolves — Claude tails this and reveals per gen.
            log("LANDED %s: %s" % (key, url or ("ERROR (%s)" % err if err else "FAILED")))
    if results_fh:
        results_fh.close()
    return results


# ---- download (serial + verify + retry) -------------------------------------

def render_name(pattern, jl, shot, idx, take):
    hexid = os.urandom(2).hex()
    first_char = ""
    if shot.get("char"):
        first_char = shot["char"]
    tokens = {
        "{slug}": jl["project"].get("slug", ""), "{nn}": "%02d" % idx,
        "{shot}": shot["shotId"], "{char}": first_char, "{hex}": hexid,
        "{state}": shot.get("state", ""), "{v}": "v%s" % take,
    }
    name = pattern
    for k, v in tokens.items():
        name = name.replace(k, v)
    # count>1 with no explicit {v} token → disambiguate takes so they don't collide
    if jl["gen"]["count"] > 1 and "{v}" not in pattern:
        base, ext = os.path.splitext(name)
        name = "%s_v%s%s" % (base, take, ext)
    return name


def download_all(jl, root, results):
    for idx, shot in enumerate(jl["shots"], 1):
        shot["_files"] = []
        out_dir = abspath(root, shot.get("outDir", jl["outDir"]))
        os.makedirs(out_dir, exist_ok=True)
        for t in range(1, jl["gen"]["count"] + 1):
            take = "%02d" % t
            r = results.get("%s_v%s" % (shot["shotId"], take))
            if not r or not r["url"]:
                continue
            fname = render_name(jl["naming"], jl, shot, idx, take)
            dest = os.path.join(out_dir, fname)
            ok = False
            for attempt in (1, 2):
                try:
                    # urlopen with explicit timeout — urlretrieve has none, and one hung CDN
                    # connection would wedge this serial loop forever (the AGF wedge class).
                    req = urllib.request.Request(r["url"], headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=180) as resp, open(dest, "wb") as fh:
                        fh.write(resp.read())
                    if os.path.isfile(dest) and os.path.getsize(dest) > 0:
                        ok = True
                        break
                except Exception:
                    time.sleep(2)
            if ok:
                shot["_files"].append(fname)
            else:
                log("  ⚠ download failed (kept URL): %s" % r["url"])
    return jl


# ---- manifest ---------------------------------------------------------------

def write_manifest(jl, root):
    kind = jl.get("manifest", "none")
    if kind == "none":
        return None
    out_dir = abspath(root, jl["outDir"])
    slug = jl["project"].get("slug", "batch")
    if kind == "xlsx":
        sys.path.insert(0, HERE)
        import build_xlsx
        gen = jl["gen"]
        cfg = {
            "project": {**jl["project"], "createdAt": jl["project"].get("createdAt", "")},
            "generation": {
                "modelDisplay": MODEL_DISPLAY.get(gen["model"], gen["model"]),
                "mcpModel": gen["model"], "resolution": gen["resolution"],
                "countPerPrompt": gen["count"], "estCostPerImage": gen["estCostPerImage"],
            },
            "shots": [{
                "shotId": s["shotId"], "lineMatch": s.get("lineMatch", ""),
                "description": s.get("description", ""), "references": s.get("refs", []),
                "aspectRatio": s.get("aspect", "9:16"), "style": s.get("style", ""),
                "prompt": s["prompt"], "status": _status(s, gen["count"]),
                "v01": (s.get("_files") or [""])[0],
                "v02": (s.get("_files") or ["", ""])[1] if len(s.get("_files") or []) > 1 else "",
                "notes": s.get("notes", ""),
            } for s in jl["shots"]],
        }
        path = os.path.join(out_dir, "%s_shots.xlsx" % slug)
        build_xlsx.build(cfg, path)
        return path
    # markdown manifest
    path = os.path.join(out_dir, "%s_shots.md" % slug)
    lines = ["# %s — b-roll manifest" % jl["project"].get("name", slug), "",
             "| # | shot | status | files | description |", "|---|---|---|---|---|"]
    for i, s in enumerate(jl["shots"], 1):
        lines.append("| %d | %s | %s | %s | %s |" % (
            i, s["shotId"], _status(s, jl["gen"]["count"]),
            "<br>".join(s.get("_files") or ["—"]), s.get("description", "").replace("|", "/")))
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    return path


def _status(shot, count):
    n = len(shot.get("_files") or [])
    if n == 0:
        return "✗"
    if n < count:
        return "Partial"
    return "✓"


# ---- handoff (📁/🔗/🦊) ------------------------------------------------------

def print_handoff(jl, root):
    out_dir = abspath(root, jl["outDir"])
    label = jl["project"].get("name") or os.path.basename(out_dir)
    log("")
    log("📁 Path: %s" % out_dir)
    if out_dir.startswith("/Volumes/ads/"):
        try:
            url = subprocess.run(["python3", HELPER, out_dir], capture_output=True, text=True).stdout.strip()
            if url:
                log("🔗 Open: %s" % url)
        except Exception:
            pass
        try:
            subprocess.run(["python3", HELPER, "--fox-drop", out_dir, label], capture_output=True, text=True)
            log("🦊 Fox.io: %s → From Claude rail" % label)
        except Exception:
            pass
    else:
        log("(Lucid handoff links apply only to /Volumes/ads paths — local output, Path only.)")


# ---- plan (dry-run) ---------------------------------------------------------

def plan(jl, root):
    gen = jl["gen"]
    n_shots = len(jl["shots"])
    n_images = n_shots * gen["count"]
    refs = unique_refs(jl, root)
    missing = [r for r in refs if not UUID_RE.match(r) and not os.path.isfile(r)]
    cost = n_images * gen["estCostPerImage"]
    log("── DRY RUN (no spend) — pass --fire to generate ──")
    log("Project : %s  [%s]" % (jl["project"].get("name", "?"), jl["project"].get("vertical", "")))
    log("Model   : %s  %s  count=%d  → %d image(s)" % (
        MODEL_DISPLAY.get(gen["model"], gen["model"]), gen["resolution"], gen["count"], n_images))
    log("Est cost: ~%d cr (@ %d cr/image)" % (cost, gen["estCostPerImage"]))
    log("Out dir : %s" % abspath(root, jl["outDir"]))
    log("Naming  : %s   Manifest: %s" % (jl["naming"], jl["manifest"]))
    log("Refs    : %d unique%s" % (len(refs), (" — ⚠ %d MISSING" % len(missing)) if missing else ""))
    for m in missing:
        log("            missing: %s" % m)
    log("Shots   :")
    for i, s in enumerate(jl["shots"], 1):
        log("  %2d. %-32s %s" % (i, s["shotId"], s.get("description", "")[:60]))
    log("── end plan — %d image(s), ~%d cr ──" % (n_images, cost))


# ---- main -------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("joblist")
    ap.add_argument("--fire", action="store_true", help="actually upload + generate (else dry-run)")
    ap.add_argument("--project-root", default=os.getcwd())
    ap.add_argument("--workers", type=int, default=16)
    args = ap.parse_args()

    root = os.path.abspath(args.project_root)
    jl = load_joblist(args.joblist)

    if not args.fire:
        plan(jl, root)
        return

    refs = unique_refs(jl, root)
    log("── pre-uploading %d unique ref(s) (serial) ──" % len(refs))
    uuid_map = preupload(refs)
    out_dir = abspath(root, jl["outDir"])
    os.makedirs(out_dir, exist_ok=True)
    results_path = os.path.join(out_dir, "_fire_results.jsonl")  # crash-recovery record
    results = fire_all(jl, root, uuid_map, workers=args.workers, results_path=results_path)
    download_all(jl, root, results)

    delivered = sum(len(s.get("_files") or []) for s in jl["shots"])
    planned = len(jl["shots"]) * jl["gen"]["count"]
    manifest = write_manifest(jl, root)

    log("")
    log("✅ %d/%d image(s) delivered" % (delivered, planned))
    fails = [s["shotId"] for s in jl["shots"] if not s.get("_files")]
    if manifest:
        log("📋 Manifest: %s" % os.path.basename(manifest))
    print_handoff(jl, root)
    if fails:
        log("❌ %d shot(s) with no file: %s" % (len(fails), ", ".join(fails)))
        log("❌ G1 gate: batch NOT complete — refire the missing shots before delivering.")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
