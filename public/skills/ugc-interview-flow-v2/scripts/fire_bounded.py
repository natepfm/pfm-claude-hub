#!/usr/bin/env python3
"""V2 bounded-clip fire helper.

Every clip fires with BOTH keyframes:  --start-image pos(K-1)  --end-image pos(K)

There is no chain. All clips fire in parallel — clip 4 does not wait on clip 3 and
does not inherit clip 3's mistakes. A bad clip costs only itself.

Guards live HERE, in the fire path, not in a playbook lesson:
  · a clip whose declared keyframes don't resolve is SKIPPED, never fired unbounded
  · every landing streams the instant it resolves (🔴 Rule 5 — no batch-waiting)
  · every download is gated by scripts/gate.py (endpoints + 3fps jump-cut scan)
  · mechanical gate failures auto-refire (max 3); creative misses go to the EDITOR
  · refires land as the next vN IN PLACE — prior takes are never overwritten or moved

Dry-run by default. Nothing spends without --fire.

Job list schema:
{
  "project": "07.27.26 - UGC Interview - SPANISH Home Baby Shower",
  "gen": {"model": "seedance_2_0", "resolution": "720p", "aspect": "9:16",
          "duration": 12, "estCostPerClip": 22.5},
  "outDir": "Elements/Footage/Veo/V4 - Middle-Age Hispanic Women - No Cuts",
  "clips": [
    {"clipId": "c04", "prompt": "...", "startImage": "…/pos03.png",
     "endImage": "…/pos04.png", "refs": [], "duration": 12, "resolution": "1080p"}
  ]
}
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
GATE = os.path.join(HERE, "gate.py")
LINKHELPER = os.path.expanduser("~/.claude/skills/notion-asset-delivery/linkyourfile.py")
UUID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I)
MAX_GATE_REFIRE = 3
# 🔴 CUT CIRCUIT-BREAKER (post-mortem 07-28): after this many mid-clip-cut gate failures on the
# SAME clip with the SAME endpoints+move, further fires are REFUSED until something changes.
# The 5-roll c05 gamble (~250+ cr on one doomed move) is the incident this exists to prevent —
# the signal was there after roll 2.
MAX_SAME_MOVE_CUTS = 2
LEDGER_NAME = ".cut_ledger.json"
# Sanctioned move types (must match build_prompts.py). pullback3 = the ONLY zoom-out, <=3 chars.
# pushin1 = the closer's forward walk-in to a single (added to the builder 07-29; this list was
# left behind, so the pre-fire gate refused every pushin1 clip — reconciled 07-30).
MOVES = ("hold", "ease", "reveal_keep", "pullback3", "pushin1")


def clip_sig(c):
    """Identity of an attempt: same endpoints + same move = the same gamble."""
    raw = "|".join([os.path.basename(c.get("startImage", "")),
                    os.path.basename(c.get("endImage", "")), c.get("move", "?")])
    return hashlib.sha1(raw.encode()).hexdigest()[:12]


def load_ledger(outdir):
    p = os.path.join(outdir, LEDGER_NAME)
    try:
        return json.load(open(p))
    except Exception:
        return {}


def save_ledger(outdir, led):
    try:
        json.dump(led, open(os.path.join(outdir, LEDGER_NAME), "w"), indent=1)
    except OSError:
        pass


def prefire_gate(jl, outdir):
    """Move-type law + circuit breaker, enforced BEFORE spend. Returns list of refusals.

    Move type is the real cut driver (measured 07-28: scale-change pulls splice, scale-preserving
    pans don't; endpoint PSNR does NOT discriminate — a clean lateral pan and the 5x-cut group
    pull measured 8.94 vs 8.92 dB). So the gate keys on the declared move, not pixels."""
    refusals = []
    led = load_ledger(outdir)
    for c in jl["clips"]:
        cid = c["clipId"]
        move = c.get("move")
        if move is None:
            log("  ⚠ %s: no 'move' declared in the joblist — legacy entry; the move law and the "
                "circuit breaker can't protect this clip. Regenerate the joblist via "
                "build_prompts.py." % cid)
            continue
        if move not in MOVES:
            refusals.append((cid, "move '%s' is not sanctioned %s" % (move, list(MOVES))))
            continue
        if move == "pullback3" and int(c.get("endFrameCount", 0) or 0) > 3:
            refusals.append((cid, "pullback with %s characters in the end frame — full-cast "
                             "pull-backs are BANNED as a first attempt (5-cut streak, V2 c05). "
                             "Use <=3 characters or reveal_keep." % c["endFrameCount"]))
            continue
        rec = led.get(cid)
        if rec and rec.get("sig") == clip_sig(c) and rec.get("cuts", 0) >= MAX_SAME_MOVE_CUTS:
            refusals.append((cid, "CIRCUIT BREAKER: %d mid-clip cuts already on this exact "
                             "endpoints+move. No identical re-roll — change the end frame or the "
                             "move type (the ledger resets automatically when you do)."
                             % rec["cuts"]))
    return refusals


def log(m):
    print(m, flush=True)


def abspath(root, p):
    return p if os.path.isabs(p) else os.path.normpath(os.path.join(root, p))


def load(path):
    with open(path, encoding="utf-8") as f:
        jl = json.load(f)
    for k in ("project", "gen", "outDir", "clips"):
        if k not in jl:
            sys.exit("ERROR: job list missing required key: %s" % k)
    if not jl["clips"]:
        sys.exit("ERROR: job list has zero clips")
    g = jl["gen"]
    g.setdefault("model", "seedance_2_0")
    g.setdefault("resolution", "720p")
    g.setdefault("aspect", "9:16")
    g.setdefault("duration", 10)
    g.setdefault("estCostPerClip", 22.5)
    # 🔴 EXPLICIT RENDER PROFILE (Seedance playbook 07-30). These were previously left unset and
    # silently took vendor defaults, so nothing recorded what was actually ordered. `high` bitrate
    # quoted the SAME price as `standard` in the 07-30 cost checks, so it is free quality. `genre`
    # must stay `auto` unless a deliberate treatment is wanted — a stray genre preset re-acts the
    # performance. `generate_audio` is a per-shot decision: dialogue clips true, silent plates false.
    g.setdefault("mode", "std")
    g.setdefault("bitrate_mode", "high")
    g.setdefault("genre", "auto")
    g.setdefault("generate_audio", True)
    for i, c in enumerate(jl["clips"]):
        # 🔴 endImage is required ONLY for a truly bounded clip. A clip that declares
        # "seamOnly": true is METHOD B (skill checklist #8) — the seam is the sole keyframe and the
        # destination is prose, because a GENERATED end frame repaints the scene and the render
        # morphs between two backgrounds ("stop reimagining the backgrounds", 07-29). The builder
        # has supported seamOnly since then; this fire path still hard-required both keyframes and
        # skipped every seam-only clip as "unbounded" — reconciled 07-30.
        need = ("clipId", "prompt", "startImage") if c.get("seamOnly") else \
               ("clipId", "prompt", "startImage", "endImage")
        for k in need:
            if k not in c:
                sys.exit("ERROR: clip %d missing required key: %s" % (i, k))
        c.setdefault("refs", [])
        # 🔴 DURATION RANGE (Seedance playbook 07-30): ByteDance documents 4–15s. Anything outside
        # is silently coerced or rejected upstream; anything at the ceiling buys the model narrative
        # runway it will fill with dead tails, a second camera move, or invented dialogue.
        d = int(c.get("duration", g["duration"]))
        if not 4 <= d <= 15:
            sys.exit("ERROR: clip %s duration %ss is outside Seedance's documented 4–15s range."
                     % (c["clipId"], d))
        # 🔴 ONE REFERENCE MODE ONLY (Seedance playbook 07-30 + skill checklist #8). Strict
        # boundary-frame generation and multimodal reference generation are DISTINCT provider
        # scenarios; mixing --start-image with generic --image is not a validated strict-start task.
        # Our own measurement agrees: an identity ref added to a bounded clip pushed the start diff
        # to 51.9 vs the clean 12–17 band. This was prose in the skill; now it is a refusal.
        if c["refs"] and not c.get("multimodal"):
            sys.exit("ERROR: clip %s declares %d extra --image ref(s) alongside a strict start "
                     "frame. That is a DIFFERENT reference mode, not a stronger start frame — it "
                     "fights the seam (measured start diff 51.9). Encode identity/wardrobe/set into "
                     "the start frame instead. Set \"multimodal\": true only for a deliberate, "
                     "role-labelled multimodal shot." % (c["clipId"], len(c["refs"])))
    return jl


# ---- upload (SERIAL — the CLI races on concurrent uploads) -------------------

def preupload(paths):
    """Upload every distinct local file once, serially. Returns {path: uuid}."""
    out = {}
    todo = [p for p in dict.fromkeys(paths) if not UUID_RE.match(p)]
    for p in todo:
        if not os.path.exists(p):
            log("  MISSING  %s" % p)
            continue
        r = subprocess.run(["higgsfield", "upload", "create", p, "--json"],
                           capture_output=True, text=True, timeout=300)
        uid = None
        if r.returncode == 0 and r.stdout.strip():
            try:
                d = json.loads(r.stdout)
                uid = d.get("id") or d.get("upload_id") or d.get("uuid")
            except json.JSONDecodeError:
                pass
        if uid:
            out[p] = uid
            log("  uploaded %s → %s" % (os.path.basename(p), uid[:8]))
        else:
            log("  UPLOAD FAILED %s" % os.path.basename(p))
    for p in paths:
        if UUID_RE.match(p):
            out[p] = p
    return out


VIDEO_EXT = (".mp4", ".mov", ".webm", ".m4v")


def extract_url(parsed):
    """Pull the RESULT video URL out of whatever shape the CLI returned.

    🔴 The CLI JSON also echoes the INPUT image URLs (the uploaded start/end keyframes). A naive
    'first url wins' grabs a keyframe .png and downloads it as the .mp4 — spec/audio gate FAIL,
    but a wasted fire. So: prefer a URL that is actually a video file, then result/output keys,
    only then anything else."""
    prio, other = [], []

    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, str) and v.startswith("http"):
                    (prio if k in ("result_url", "output_url") else other).append(v)
                else:
                    walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(parsed)
    vids = [u for u in (prio + other) if u.lower().split("?")[0].endswith(VIDEO_EXT)]
    if vids:
        return vids[0]
    return prio[0] if prio else (other[0] if other else None)


# ---- fire -------------------------------------------------------------------

def fire_all(jl, root, umap, workers=16):
    g = jl["gen"]
    jobs, results = [], {}

    for c in jl["clips"]:
        seam_only = bool(c.get("seamOnly"))
        keys = {"start": abspath(root, c["startImage"])}
        if not seam_only:
            keys["end"] = abspath(root, c["endImage"])
        missing = [n for n, p in keys.items() if p not in umap]
        if missing:
            # 🔴 A clip whose DECLARED keyframes don't resolve is a blind pan — the exact failure
            # V2 exists to remove. Skip it rather than silently degrade to V1 behaviour.
            # A seamOnly clip declares ONE keyframe by design, so only the seam must resolve.
            log("SKIPPED %s: %s keyframe unresolved — refusing to fire unbounded"
                % (c["clipId"], "+".join(missing)))
            results[c["clipId"]] = {"clip": c, "url": None, "skipped": True}
            continue
        c["_start"] = umap[keys["start"]]
        c["_end"] = None if seam_only else umap[keys["end"]]
        c["_refs"] = [umap[abspath(root, r)] for r in c["refs"] if abspath(root, r) in umap]
        jobs.append(c)

    def one(c):
        cmd = ["higgsfield", "generate", "create", g["model"],
               "--prompt", c["prompt"],
               "--start-image", c["_start"]]
        # seamOnly (Method B): NO end image — the destination is prose in the prompt.
        if c["_end"]:
            cmd += ["--end-image", c["_end"]]
        for r in c["_refs"]:
            cmd += ["--image", r]
        cmd += ["--aspect_ratio", c.get("aspect", g["aspect"]),
                "--resolution", c.get("resolution", g["resolution"]),
                "--duration", str(c.get("duration", g["duration"])),
                # Explicit render profile — never left to vendor defaults (playbook Gate 5).
                "--mode", str(c.get("mode", g["mode"])),
                "--bitrate_mode", str(c.get("bitrate_mode", g["bitrate_mode"])),
                "--genre", str(c.get("genre", g["genre"])),
                "--generate_audio",
                "true" if c.get("generate_audio", g["generate_audio"]) else "false",
                "--wait", "--wait-timeout", "10m", "--json"]
        c["_cmd_params"] = {
            "model": g["model"], "aspect_ratio": c.get("aspect", g["aspect"]),
            "resolution": c.get("resolution", g["resolution"]),
            "duration": c.get("duration", g["duration"]),
            "mode": c.get("mode", g["mode"]),
            "bitrate_mode": c.get("bitrate_mode", g["bitrate_mode"]),
            "genre": c.get("genre", g["genre"]),
            "generate_audio": bool(c.get("generate_audio", g["generate_audio"])),
            "reference_mode": "multimodal" if c.get("multimodal") else
                              ("strict_start" if c.get("seamOnly") else "strict_start_end"),
            "startImage": c["startImage"],
            "endImage": c.get("endImage"),
            "startUploadId": c["_start"], "endUploadId": c["_end"],
        }
        return subprocess.run(cmd, capture_output=True, text=True, timeout=700)

    log("── firing %d bounded clip(s) at %d workers ──" % (len(jobs), min(workers, 16)))
    with ThreadPoolExecutor(max_workers=min(workers, 16)) as ex:
        futs = {ex.submit(one, c): c for c in jobs}
        for fut in as_completed(futs):
            c = futs[fut]
            url, err = None, None
            try:
                res = fut.result()
                if res.returncode == 0 and res.stdout.strip():
                    url = extract_url(json.loads(res.stdout))
                else:
                    err = (res.stderr or res.stdout or "").strip()[:120]
            except Exception as e:
                err = str(e)[:120]
            results[c["clipId"]] = {"clip": c, "url": url}
            # 🔴 Rule 5 — emit the INSTANT it resolves. Claude tails this and reveals
            # per gen, before download, before QC, before any pick.
            log("LANDED %s: %s" % (c["clipId"], url or ("ERROR (%s)" % err if err else "FAILED")))
    return results


# ---- download (never overwrite — next vN in place) --------------------------

def next_version(outdir, project, clip_id, stem=None):
    """Next free vN for this clip. Prior takes are NEVER overwritten or relocated.

    A clip may carry an explicit `outStem` (e.g. "AutoBlockPartySrBroad_V1NC_clip04") so the
    download honours the project's own filename convention instead of the stripped default."""
    if not stem:
        stem = "%s_%s" % (re.sub(r"[^A-Za-z0-9]+", "", project)[:24] or "clip", clip_id)
    n = 1
    while os.path.exists(os.path.join(outdir, "%s_v%02d.mp4" % (stem, n))):
        n += 1
    return os.path.join(outdir, "%s_v%02d.mp4" % (stem, n))


def download(url, dest):
    r = subprocess.run(["curl", "-fsSL", "-o", dest, url], capture_output=True, text=True)
    return r.returncode == 0 and os.path.exists(dest) and os.path.getsize(dest) > 10000


SHORT_EDGE = {"480p": 480, "720p": 720, "1080p": 1080, "4k": 2160}


def expected_res(resolution, aspect):
    """What the ordered resolution+aspect should come back as, e.g. 720p 9:16 -> 720x1280."""
    s = SHORT_EDGE.get(str(resolution).lower())
    if not s or ":" not in str(aspect):
        return None
    try:
        w, h = (int(x) for x in str(aspect).split(":"))
    except ValueError:
        return None
    return "%dx%d" % (s, round(s * h / w)) if w <= h else "%dx%d" % (round(s * w / h), s)


def gate(video, start, end, res=None, duration=None):
    cmd = [sys.executable, GATE, video, "--start", start, "--json"]
    if end:
        cmd += ["--end", end]
    if res:
        cmd += ["--expect-res", res]
    if duration:
        cmd += ["--expect-duration", str(duration)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return r.returncode == 0, json.loads(r.stdout)
    except json.JSONDecodeError:
        return False, {"verdict": "ERROR", "raw": (r.stdout or r.stderr)[:200]}


def linkyourfile(path):
    if not os.path.exists(LINKHELPER):
        return None
    r = subprocess.run([sys.executable, LINKHELPER, path], capture_output=True, text=True)
    return r.stdout.strip() or None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("joblist")
    ap.add_argument("--fire", action="store_true", help="actually spend (else dry-run)")
    ap.add_argument("--project-root", default=os.getcwd())
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--no-gate", action="store_true", help="download without the mechanical gate")
    a = ap.parse_args()

    jl = load(a.joblist)
    root = a.project_root
    g = jl["gen"]
    outdir = abspath(root, jl["outDir"])
    n = len(jl["clips"])
    total = n * g["estCostPerClip"]

    log("PROJECT   %s" % jl["project"])
    log("MODEL     %s · %s · %s · %ss" % (g["model"], g["resolution"], g["aspect"], g["duration"]))
    n_seam = sum(1 for c in jl["clips"] if c.get("seamOnly"))
    log("CLIPS     %d (%d bounded start+end · %d seam-only, prose destination)"
        % (n, n - n_seam, n_seam))
    log("COST      ~%.1f credits (%.1f/clip)" % (total, g["estCostPerClip"]))
    log("OUT       %s" % outdir)
    link = linkyourfile(outdir)
    if link:
        log("OPEN      %s" % link)

    # 🔴 PRE-FIRE GATE — move law + circuit breaker, before any spend (dry-run shows it too).
    os.makedirs(outdir, exist_ok=True)
    refusals = prefire_gate(jl, outdir)
    if refusals:
        log("\n── PRE-FIRE GATE: %d clip(s) REFUSED ──" % len(refusals))
        for cid, why in refusals:
            log("  ✗ %s — %s" % (cid, why))
        refused_ids = {cid for cid, _ in refusals}
        jl["clips"] = [c for c in jl["clips"] if c["clipId"] not in refused_ids]
        if not jl["clips"]:
            sys.exit("All clips refused — nothing to fire.")
        log("  continuing with the %d clip(s) that passed." % len(jl["clips"]))

    if not a.fire:
        log("\n-- DRY RUN — nothing fired. Re-run with --fire to spend. --")
        for c in jl["clips"]:
            dest = "SEAM-ONLY (prose destination)" if c.get("seamOnly") \
                   else os.path.basename(c["endImage"])
            log("  %s  [%s]  %s → %s" % (c["clipId"], c.get("move", "no-move-declared"),
                                         os.path.basename(c["startImage"]), dest))
        return
    paths = []
    for c in jl["clips"]:
        paths += [abspath(root, c["startImage"])]
        if not c.get("seamOnly"):
            paths += [abspath(root, c["endImage"])]
        paths += [abspath(root, r) for r in c["refs"]]
    log("\n── uploading %d distinct input(s), serially ──" % len(dict.fromkeys(paths)))
    umap = preupload(paths)

    results = fire_all(jl, root, umap, a.workers)

    log("\n── downloading + gating ──")
    landed, failed_gate = [], []
    for cid, r in sorted(results.items()):
        if not r.get("url"):
            continue
        c = r["clip"]
        dest = next_version(outdir, jl["project"], cid, c.get("outStem"))
        if not download(r["url"], dest):
            log("  DOWNLOAD FAILED %s" % cid)
            continue
        landed.append(dest)
        if a.no_gate:
            log("  %s → %s (gate skipped)" % (cid, os.path.basename(dest)))
            continue
        # seamOnly has no end keyframe to diff against — gate.py degrades that check to SKIP.
        end_kf = None if c.get("seamOnly") else abspath(root, c["endImage"])
        ok, rep = gate(dest, abspath(root, c["startImage"]), end_kf,
                       res=expected_res(c.get("resolution", g["resolution"]),
                                        c.get("aspect", g["aspect"])),
                       duration=c.get("duration", g["duration"]))
        marks = " ".join("%s=%s" % (x["check"], x["status"]) for x in rep.get("checks", []))
        log("  %s → %s  [%s]  %s" % (cid, os.path.basename(dest), rep.get("verdict"), marks))
        # 🔴 PROVENANCE SIDECAR (playbook Gate 7). The exact prompt, every ordered parameter, the
        # reference mode, the upload UUIDs, the result URL, the quoted cost and the gate verdict.
        # 🔴 Written to a SEPARATE `.provenance/` dir, NEVER beside the mp4 (editor 07-30: "keep
        # these separate") — same rule as the QC strips going to a temp dir (post-mortem E2). The
        # footage folders hold ONLY the deliverable video takes.
        try:
            provdir = os.path.join(outdir, ".provenance")
            os.makedirs(provdir, exist_ok=True)
            side = os.path.join(provdir, os.path.splitext(os.path.basename(dest))[0] + ".json")
            json.dump({
                "clip": os.path.basename(dest),
                "clipId": cid,
                "project": jl["project"],
                "move": c.get("move"),
                "params": c.get("_cmd_params", {}),
                "quotedCostPerClip": g["estCostPerClip"],
                "resultUrl": r["url"],
                "prompt": c["prompt"],
                "gate": rep,
            }, open(side, "w"), indent=1)
        except Exception as e:                                   # never let bookkeeping kill a fire
            log("    ⚠ sidecar not written: %s" % str(e)[:80])
        # Circuit-breaker ledger: a SCENE-check failure on the same endpoints+move increments;
        # a pass (or any change of endpoints/move) resets. At MAX_SAME_MOVE_CUTS the pre-fire
        # gate refuses the identical re-roll.
        led = load_ledger(outdir)
        scene_cut = any(x.get("check") == "scene" and x.get("status") == "FAIL"
                        for x in rep.get("checks", []))
        sig = clip_sig(c)
        rec = led.get(cid, {})
        if scene_cut:
            cuts = (rec.get("cuts", 0) + 1) if rec.get("sig") == sig else 1
            led[cid] = {"sig": sig, "cuts": cuts}
            if cuts >= MAX_SAME_MOVE_CUTS:
                log("    🔴 %d cuts on this exact endpoints+move — the NEXT identical fire will "
                    "be refused. Change the end frame or the move type." % cuts)
        elif rec:
            led[cid] = {"sig": sig, "cuts": 0}
        save_ledger(outdir, led)
        if not ok:
            failed_gate.append(cid)

    log("\n── summary ──")
    log("  landed on disk : %d/%d" % (len(landed), n))
    if failed_gate:
        log("  gate FAILED    : %s" % ", ".join(failed_gate))
        log("  → mechanical failures. Refire is capped at %d and lands as the NEXT vN;" % MAX_GATE_REFIRE)
        log("    prior takes stay exactly where they are. Creative misses = editor's call.")
    log("  🔴 show every landed clip to the editor NOW (📁 🔗 📲 + filmstrip) before any pick.")


if __name__ == "__main__":
    main()
