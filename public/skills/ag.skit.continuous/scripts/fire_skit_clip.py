#!/usr/bin/env python3
"""fire_skit_clip.py — the ONLY sanctioned way to fire a clip in ag.skit.continuous.

Every law in SKILL.md's checklist is a refusal in here, because a behavioural rule that exists
only as prose is not done (CLAUDE.md: RULES SHIP AS CODE). The refusals, and the field evidence
that bought each one on the 08.03.26 DMV Single Mom build:

  L1  STATION MASTER      every clip starts on its station's master still. A video-derived frame
                          is refused unless the clip declares seam:{reason} AND the frame carries
                          a make_seam.sh sidecar. Seams compound darker/crunchier every hop; the
                          station fired off ONE clean still produced the cleanest clips in the spot.
  L2  720p DEFAULT        std_1080 refused without legibility_reason. 1080p is exactly 2x
                          (135 vs 67.5 cr/15s); ~19 needless 1080p fires = ~1,300 of ~3,869 credits.
  L3  ONE TAKE            a second fire needs --retry-reason CODE. Video is not a 2-takes-for-
                          options medium at 67.5 cr a roll.
  L4  vN IN PLACE         next take number, never an overwrite, never a relocation.
  L5  STATIC-FIRST        move must be declared; anything but `static` needs move_reason. A 15s
                          push-in melted a child into the mom's jeans and warped signage; the same
                          beat static was a keeper.
  L6  DURATION 4-15       ByteDance's range; long beats split instead.
  L7  NON-EMPTY PROMPT    an empty prompt fails SILENTLY (status failed, prompt:"") — 3 fires lost
                          to a heredoc that never ran.
  L8  OUTFIT ID VERBATIM  every on-camera character's Outfit ID must appear verbatim in the prompt.
                          Wardrobe drift on a big gesture (crew tee -> tank top) was both a
                          continuity break AND the real NSFW-upload trigger.
  L9  ASPECT MATCH        the reference's real pixel aspect must match the render aspect.
  L10 CHILD REF BLOCK     cast marked upload_blocked may not be passed as an image ref — moderation
                          refuses photoreal young children. Carry them in prose.
  L11 NSFW DIAGNOSIS      when an upload is refused, the FIRST suggestion is a wardrobe skin-drift
                          check, not a pixel-perturbation workaround. Eight perturbations were
                          tested and all failed; the filter is semantic. Fixing the drift fixed it.

Usage:
  fire_skit_clip.py <SKIT.yaml> --clip clip01 [--dry-run] [--retry-reason CODE]
  fire_skit_clip.py <SKIT.yaml> --clip clip01 --verdict pass|fail [--reason CODE]
"""
import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("ERROR: PyYAML required — pip3 install pyyaml")

# 720p standard is the house default. std_1080 is exactly 2x and must be justified per clip.
PROFILES = {
    "fast_proof": {"resolution": "720p",  "bitrate_mode": "standard", "mode": "fast"},
    "std_720":    {"resolution": "720p",  "bitrate_mode": "high",     "mode": "std"},
    "std_1080":   {"resolution": "1080p", "bitrate_mode": "high",     "mode": "std"},
}
MODEL = "seedance_2_0"
# Face-hiding moves held with zero melt on the source build; face-re-rendering moves are where
# drift lives. Every non-static move is still a deliberate purchase (move_reason).
MOVES = {"static", "follow_behind", "push_in", "ots", "pov_drift", "custom"}
RETRY_CODES = {"ID_DRIFT", "WARDROBE_DRIFT", "SET_DRIFT", "MELT_MORPH", "WRONG_CAMERA",
               "UNWANTED_CUT", "ACTION_FAILURE", "DIALOGUE_ERROR", "EXTRA_SPEECH",
               "AUDIO_DISTORTION", "SCREEN_ILLEGIBLE", "EASE_IN", "POLICY_FALSE_POSITIVE",
               "TECHNICAL"}
DUR_MIN, DUR_MAX = 4, 15


def die(msg):
    print("REFUSED: %s" % msg)
    sys.exit(1)


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def aspect_of(path):
    """Real pixel aspect as a float (w/h), or None when Pillow is unavailable."""
    try:
        from PIL import Image
    except ImportError:
        return None
    with Image.open(path) as im:
        w, h = im.size
    return w / float(h)


def upload(path, ctx=""):
    r = sh(["higgsfield", "upload", "create", str(path), "--json"])
    out = (r.stdout or "") + (r.stderr or "")
    if r.returncode != 0 or "NSFW" in out.upper():
        if "NSFW" in out.upper():
            # L11 — the diagnosis order matters. On the source build the block was chased through
            # CLI upload, MCP presigned upload, and 8 imperceptible perturbations (re-encode, faint
            # noise, 98% scale, 3% zoom, unsharp, jpeg-q12, level nudge, hflip). ALL blocked: the
            # filter is semantic, not pixel-level. The actual cause was a wardrobe drift into a
            # tank top — bare adult shoulders next to a held child. Fixing the drift fixed it on
            # the first try.
            die("upload refused as NSFW: %s%s\n"
                "  CHECK THIS FIRST: has the wardrobe DRIFTED to expose adult skin (tank top, bare\n"
                "  shoulders, open collar) — especially near a held or nearby child? That is the\n"
                "  documented trigger, and re-firing the source clip with the Outfit ID hard-locked\n"
                "  through the gesture is the real fix.\n"
                "  Pixel workarounds do NOT work — the filter is semantic; 8 perturbations were\n"
                "  tested and every one was blocked. If this is a seam frame, neighbouring frames\n"
                "  +/-0.5s vary and one may pass, but only after you have ruled out the drift."
                % (path, ctx))
        die("upload failed (%d) for %s: %s" % (r.returncode, path, out[:200]))
    try:
        return json.loads(r.stdout)["id"]
    except Exception:
        die("upload returned unparseable JSON for %s: %s" % (path, r.stdout[:200]))


def load(manifest):
    d = yaml.safe_load(Path(manifest).read_text()) or {}
    for key in ("skit", "cast", "stations", "clips"):
        if key not in d:
            die("manifest has no '%s:' section — see ag.skit.continuous/SKILL.md" % key)
    return d


def resolve(project, rel):
    p = Path(rel)
    return p if p.is_absolute() else project / rel


def save(manifest_path, doc):
    Path(manifest_path).write_text(yaml.safe_dump(doc, sort_keys=False, allow_unicode=True))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--clip", required=True)
    ap.add_argument("--dry-run", action="store_true",
                    help="run every refusal and quote the cost, spend nothing")
    ap.add_argument("--retry-reason", default=None,
                    help="required to fire a second take: " + ", ".join(sorted(RETRY_CODES)))
    ap.add_argument("--verdict", choices=["pass", "fail"])
    ap.add_argument("--reason", default=None, help="reason code, required with --verdict fail")
    a = ap.parse_args()

    manifest = Path(a.manifest)
    if not manifest.exists():
        die("no such manifest: %s" % manifest)
    # <project>/Elements/Prompts/SKIT.yaml
    project = manifest.parent.parent.parent
    doc = load(manifest)
    skit, cast, stations, clips = doc["skit"], doc["cast"], doc["stations"], doc["clips"]

    clip = next((c for c in clips if c.get("id") == a.clip), None)
    if not clip:
        die("clip '%s' not in the manifest" % a.clip)

    out_dir = project / "Elements/Footage/Clips"

    # ---- verdict mode -------------------------------------------------------
    if a.verdict:
        if a.verdict == "fail":
            if not a.reason:
                die("--verdict fail requires --reason: " + ", ".join(sorted(RETRY_CODES)))
            if a.reason not in RETRY_CODES:
                die("unknown reason '%s' — use one of: %s" % (a.reason, ", ".join(sorted(RETRY_CODES))))
            clip["qc"] = "clip_qc_fail"
            clip["qc_reason"] = a.reason
        else:
            clip["qc"] = "clip_qc_pass"
            clip.pop("qc_reason", None)
        save(manifest, doc)
        print("OK: %s -> %s%s" % (a.clip, clip["qc"], " (%s)" % a.reason if a.reason else ""))
        return

    # ---- L3 ONE TAKE --------------------------------------------------------
    existing = sorted(out_dir.glob("%s_v*.mp4" % a.clip)) if out_dir.exists() else []
    if existing and not a.retry_reason:
        die("%s already has %d take(s) on disk (%s).\n"
            "  ONE take per clip is the default — video is ~67.5 cr a fire and the\n"
            "  two-takes-for-options habit doubles project spend. Refire only on a real miss:\n"
            "  pass --retry-reason with one of: %s"
            % (a.clip, len(existing), ", ".join(p.name for p in existing), ", ".join(sorted(RETRY_CODES))))
    if a.retry_reason and a.retry_reason not in RETRY_CODES:
        die("unknown --retry-reason '%s' — use one of: %s" % (a.retry_reason, ", ".join(sorted(RETRY_CODES))))

    # ---- L5 STATIC-FIRST ----------------------------------------------------
    move = clip.get("move")
    if not move:
        die("clip %s declares no 'move' — one of %s. Static-first is the house default: a camera "
            "move is a deliberate per-clip purchase, not a freebie." % (a.clip, sorted(MOVES)))
    if move not in MOVES:
        die("clip %s has move '%s' — must be one of %s" % (a.clip, move, sorted(MOVES)))
    if move != "static" and not clip.get("move_reason"):
        die("clip %s buys a camera move (%s) with no move_reason.\n"
            "  A 15s push-in melted a child into the mom's jeans and warped background signage;\n"
            "  the identical beat shot static was the keeper. Face-HIDING moves (follow_behind,\n"
            "  ots) are nearly free — face-re-rendering moves are where drift lives. State why."
            % (a.clip, move))

    # ---- L6 DURATION --------------------------------------------------------
    try:
        dur = int(clip.get("duration"))
    except (TypeError, ValueError):
        die("clip %s has no integer duration" % a.clip)
    if not DUR_MIN <= dur <= DUR_MAX:
        die("clip %s duration %ss outside ByteDance's %d-%ds range — split the beat instead"
            % (a.clip, dur, DUR_MIN, DUR_MAX))

    # ---- L2 720p DEFAULT ----------------------------------------------------
    prof_name = clip.get("profile", "std_720")
    if prof_name not in PROFILES:
        die("clip %s has unknown profile '%s' — one of %s" % (a.clip, prof_name, sorted(PROFILES)))
    if prof_name == "std_1080" and not clip.get("legibility_reason"):
        die("clip %s asks for std_1080 with no legibility_reason.\n"
            "  1080p is EXACTLY 2x the credits (135 vs 67.5 per 15s). On the source build ~19\n"
            "  clips fired 1080p for 'screen legibility' when most did not need it — ~1,300 of\n"
            "  ~3,869 total credits, about a THIRD of the project. Step up only for a beat whose\n"
            "  fine on-screen text must be legible, and test 720p there first." % a.clip)
    prof = PROFILES[prof_name]

    # ---- L7 NON-EMPTY PROMPT ------------------------------------------------
    prompt = (clip.get("prompt") or "").strip()
    if not prompt:
        # An empty prompt does not error — it returns status "failed" with prompt:"" and burns the
        # round trip. Three fires were lost this way to a heredoc that never ran.
        die("clip %s has an empty prompt — this fails SILENTLY at the vendor (status 'failed', "
            "prompt:\"\"). Write the prompt into the manifest and verify it is non-empty." % a.clip)

    # ---- L8 OUTFIT ID VERBATIM ----------------------------------------------
    on_camera = clip.get("cast_on_camera") or []
    for name in on_camera:
        if name not in cast:
            die("clip %s lists '%s' in cast_on_camera but the manifest has no such cast entry" % (a.clip, name))
        oid = " ".join((cast[name].get("outfit_id") or "").split())
        if not oid:
            die("cast '%s' has no outfit_id — write it FROM the approved master render, not from "
                "the prompt that made it" % name)
        if oid not in " ".join(prompt.split()):
            die("clip %s does not carry %s's Outfit ID VERBATIM.\n"
                "  Paste the block unchanged — paraphrase is how wardrobe drifts, and a drift into\n"
                "  bare shoulders was both a continuity break and the real NSFW-upload trigger on\n"
                "  the source build. Hard-lock it through any big gesture (phone flip, reach, turn)."
                % (a.clip, name))

    # ---- L1 STATION MASTER --------------------------------------------------
    station_name = clip.get("station")
    if not station_name:
        die("clip %s declares no station" % a.clip)
    station = stations.get(station_name)
    if not station:
        die("clip %s references station '%s', which is not in the manifest" % (a.clip, station_name))
    seam = clip.get("seam") or {}
    if seam:
        if not seam.get("reason"):
            die("clip %s declares a seam with no reason.\n"
                "  Seams are an OPTION for one beat that genuinely needs unbroken camera motion —\n"
                "  never the spine. Every seam pulls from an already-darker, crunchier output, so\n"
                "  quality compounds downward across the chain; the station fired off ONE clean\n"
                "  still produced the cleanest clips in the entire source spot, at lower cost."
                % a.clip)
        start_rel = seam.get("frame")
        if not start_rel:
            die("clip %s declares a seam with no frame" % a.clip)
        start = resolve(project, start_rel)
        if not Path(str(start) + ".seam.json").exists():
            die("seam frame %s has no make_seam.sh sidecar.\n"
                "  A raw frame pulled straight out of an .mp4 carries the previous generation's\n"
                "  crunch and halos straight into the next render. Produce it with:\n"
                "    ~/.claude/skills/ag.skit.continuous/scripts/make_seam.sh <clip.mp4> <ts> <out.png>"
                % start)
    else:
        start_rel = station.get("master_still")
        if not start_rel:
            die("station '%s' has no master_still" % station_name)
        start = resolve(project, start_rel)
        if not start.exists():
            die("station master still missing on disk: %s" % start)
        # The architecture law, enforced: a station master that is itself a video-derived frame
        # silently reintroduces the seam chain this skill exists to replace.
        if "/Footage/Clips/" in str(start) or start.name.endswith("_frame1.png"):
            die("station '%s' points at a video-derived frame (%s).\n"
                "  A station master is a NATIVE still — a generated plate with the cast composited\n"
                "  in. Anchoring a station to a clip frame is the seam chain wearing a different\n"
                "  name, and it compounds the same way." % (station_name, start.name))
    if not start.exists():
        die("start image missing on disk: %s" % start)

    # ---- L9 ASPECT MATCH ----------------------------------------------------
    aspect = str(skit.get("aspect") or "9:16").strip()
    try:
        aw, ah = (float(x) for x in aspect.split(":"))
    except ValueError:
        die("skit.aspect '%s' is not W:H" % aspect)
    real = aspect_of(start)
    if real is not None and abs(real - aw / ah) > 0.02:
        die("start image %s is %.3f:1 but the skit renders %s (%.3f:1).\n"
            "  Ref aspect must equal render aspect — a mismatched plate stretches anatomy and\n"
            "  rescales the set." % (start.name, real, aspect, aw / ah))

    # ---- L10 CHILD REF BLOCK ------------------------------------------------
    ref_names = clip.get("image_refs") or []
    for name in ref_names:
        if name not in cast:
            die("clip %s lists '%s' in image_refs but there is no such cast entry" % (a.clip, name))
        if cast[name].get("upload_blocked"):
            die("clip %s passes '%s' as an image ref, but that cast member is marked "
                "upload_blocked.\n"
                "  Photoreal young children are refused by the upload moderation, so they cannot be\n"
                "  a reference at all. Carry them in PROSE via their Outfit ID — that held clean on\n"
                "  the source build (masters + Outfit IDs + one locked plate)." % (a.clip, name))

    audio = clip.get("generate_audio")
    if audio is None:
        die("clip %s has no explicit generate_audio — audio is a per-clip decision, never a default"
            % a.clip)
    audio = bool(audio)

    # ---- assemble the command ----------------------------------------------
    print("%s | %s %s %s/%s | %ss | move=%s | audio=%s | station=%s%s"
          % (a.clip, MODEL, prof_name, prof["resolution"], prof["bitrate_mode"], dur, move,
             audio, station_name, " | SEAM" if seam else ""))
    print("start image: %s" % start.name)

    quote = sh(["higgsfield", "generate", "cost", MODEL, "--prompt", prompt,
                "--aspect_ratio", aspect, "--duration", str(dur),
                "--resolution", prof["resolution"], "--bitrate_mode", prof["bitrate_mode"],
                "--generate_audio", "true" if audio else "false",
                "--mode", prof["mode"], "--json"])
    cost = "unquotable"
    try:
        cj = json.loads(quote.stdout)
        cost = cj.get("cost") or cj.get("credits") or cj.get("total") or cost
    except Exception:
        cost = (quote.stdout or quote.stderr).strip()[:80] or cost
    print("quoted cost: %s" % cost)

    if a.dry_run:
        print("DRY RUN — every check passed, nothing fired")
        return

    media = ["--start-image", upload(start, " (start image)")]
    for name in ref_names:
        m = resolve(project, cast[name]["master"])
        if not m.exists():
            die("master for '%s' missing on disk: %s" % (name, m))
        media += ["--image", upload(m, " (%s master)" % name)]

    cmd = ["higgsfield", "generate", "create", MODEL, "--prompt", prompt] + media + [
        "--aspect_ratio", aspect, "--duration", str(dur),
        "--resolution", prof["resolution"], "--bitrate_mode", prof["bitrate_mode"],
        "--generate_audio", "true" if audio else "false",
        "--mode", prof["mode"], "--wait", "--wait-timeout", "20m", "--json"]

    r = sh(cmd)
    try:
        res = json.loads(r.stdout)
        res = res if isinstance(res, list) else [res]
        job_id, url = res[0].get("id", ""), res[0].get("result_url") or ""
    except Exception:
        die("generate failed: %s" % (r.stdout or r.stderr)[:300])
    if not url:
        die("no result_url returned (job %s)" % job_id)

    # ---- L4 vN IN PLACE -----------------------------------------------------
    out_dir.mkdir(parents=True, exist_ok=True)
    take = 1 + max([int(p.stem.split("_v")[-1]) for p in out_dir.glob("%s_v*.mp4" % a.clip)
                    if p.stem.split("_v")[-1].isdigit()], default=0)
    out = out_dir / ("%s_v%02d.mp4" % (a.clip, take))
    if out.exists():
        die("refusing to overwrite %s — refires ADD the next vN in place" % out.name)

    sh(["curl", "-s", "-o", str(out), url])
    if not out.exists() or out.stat().st_size == 0:
        die("download failed: %s" % out)
    sh(["ffmpeg", "-y", "-i", str(out), "-vframes", "1", str(out.with_name(out.stem + "_frame1.png"))])

    out.with_suffix(".json").write_text(json.dumps({
        "clip": a.clip, "take": take, "engine": MODEL, "profile": prof_name,
        "resolution": prof["resolution"], "bitrate_mode": prof["bitrate_mode"], "mode": prof["mode"],
        "duration": dur, "aspect_ratio": aspect, "generate_audio": audio, "move": move,
        "move_reason": clip.get("move_reason", ""), "station": station_name,
        "start_image": str(start_rel), "seam": seam or None,
        "legibility_reason": clip.get("legibility_reason", ""),
        "retry_reason": a.retry_reason or "", "cast_on_camera": on_camera, "image_refs": ref_names,
        "job_id": job_id, "result_url": url, "quoted_cost": cost,
        "fired_at": datetime.now(timezone.utc).isoformat(),
        "dialogue": clip.get("dialogue", ""), "prompt": prompt, "qc": "fired_pending_qc",
    }, indent=2))

    clip["file"] = "Elements/Footage/Clips/%s" % out.name
    clip["take"] = take
    clip["qc"] = "fired_pending_qc"
    save(manifest, doc)

    print("URL=%s" % url)
    print("saved %s (+ sidecar, + frame1)" % out.name)
    print("manifest updated: %s qc=fired_pending_qc take=%d" % (a.clip, take))
    print("NOT a keeper until the editor says so — stream it now, then read it.")


if __name__ == "__main__":
    main()
