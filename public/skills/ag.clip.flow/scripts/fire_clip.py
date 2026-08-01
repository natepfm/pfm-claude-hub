#!/usr/bin/env python3
"""fire_clip.py — the ONLY sanctioned way to fire a Seedance clip in ag.clip.flow.

Derives every parameter from canon (SCENE_BIBLE.yaml + sibling SHOTS.yaml). Fixes the
seven P0 gaps found in the 07.30 Seedance playbook audit: shot-level audio, deliberate
genre, real multishot gate, validated duration, honest output directory, explicit
bitrate, and fired_pending_qc instead of a terminal "fired".

Usage:
  fire_clip.py <bible.yaml> --shot S07 [--profile std_720] [--dry-run] [--yes]
  fire_clip.py <bible.yaml> --shot S07 --verdict pass|fail [--reason CODE]

Refuses when: shot unknown · frame not qc_pass · start_frame missing on disk ·
no clip_prompt · no video block · reference mode invalid/ambiguous · duration outside
4-15 · multishot implied without multishot:true · audio decision absent · shots in
both canon files.
"""
import argparse, hashlib, json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from canon_io import canon_write  # vendored; see canon_io.py header

# 🔴 mini_test RETIRED (Sam, 07.30: "I really hate mini, let's never use mini"). Kept only so
# canon referencing it fails loudly instead of silently downgrading a shot to a rejected tier.
BANNED_PROFILES = {"mini_test": 'Sam banned Seedance mini 07.30 ("I really hate mini"). Use fast_proof for cheap probes — he approved that tier.'}
PROFILES = {
    "fast_proof": {"model": "seedance_2_0",      "resolution": "720p",  "bitrate_mode": "standard", "mode": "fast"},
    "std_720":    {"model": "seedance_2_0",      "resolution": "720p",  "bitrate_mode": "high",     "mode": "std"},
    "std_1080":   {"model": "seedance_2_0",      "resolution": "1080p", "bitrate_mode": "high",     "mode": "std"},
}
REF_MODES = {"strict_start", "strict_start_end", "multimodal"}
REASON_CODES = {"ID_DRIFT","WARDROBE_DRIFT","SET_DRIFT","PROP_DRIFT","WRONG_CAMERA","UNWANTED_CUT",
                "ACTION_FAILURE","END_FRAME_MISS","DIALOGUE_ERROR","LIPSYNC_ERROR","EXTRA_SPEECH",
                "AUDIO_DISTORTION","POLICY_FALSE_POSITIVE","TECHNICAL"}


def die(msg):
    print(f"REFUSED: {msg}")
    sys.exit(1)


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def upload(path):
    r = sh(["higgsfield", "upload", "create", str(path), "--json"])
    if r.returncode != 0:
        die(f"upload failed ({r.returncode}) for {path}: {(r.stderr or r.stdout)[:200]}")
    try:
        return json.loads(r.stdout)["id"]
    except Exception:
        die(f"upload returned unparseable JSON for {path}: {r.stdout[:200]}")


def load_canon(bible):
    d = yaml.safe_load(bible.read_text())
    shots_path = bible.parent / "SHOTS.yaml"
    inline = d.get("shots") or []
    external = []
    if shots_path.exists():
        sd = yaml.safe_load(shots_path.read_text()) or {}
        external = (sd.get("shots") if isinstance(sd, dict) else sd) or []
        if inline:
            die("shots exist in BOTH SCENE_BIBLE.yaml and SHOTS.yaml — one canon only.")
    return d, (external or inline), (shots_path if external else None)


def save_shots(bible, shots, shots_path, d, only_shot=None):
    """Persist shot state WITHOUT clobbering concurrent writers.

    🔴 The old version dumped the whole in-memory document, which silently reverted
    editor approvals recorded while a long batch held a stale copy (observed twice on
    Test 3, 07-31-26). A Seedance batch holds its copy for many minutes, so this path
    was the worst-exposed of the nine. canon_write re-reads under a lock and applies
    only the fields this process owns. Pass only_shot to scope the merge to one shot.
    """
    by_id = {s.get("id"): s for s in shots if isinstance(s, dict)}

    def _apply(doc):
        cur = doc.get("shots")
        if not isinstance(cur, list):
            doc["shots"] = shots
            return
        for c in cur:
            sid = c.get("id")
            if only_shot and sid != only_shot:
                continue
            src = by_id.get(sid)
            if src:
                c.update(src)
        have = {c.get("id") for c in cur}
        for sid, src in by_id.items():
            if sid not in have and (not only_shot or sid == only_shot):
                cur.append(src)

    canon_write(shots_path if shots_path else bible, _apply)


def sha8(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()[:8]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--shot", required=True)
    ap.add_argument("--profile", default=None, help="override canon profile")
    ap.add_argument("--dry-run", action="store_true", help="quote cost and print the command, fire nothing")
    ap.add_argument("--yes", action="store_true", help="skip the cost pause")
    ap.add_argument("--verdict", choices=["pass", "fail"], help="record editor QC on the latest take")
    ap.add_argument("--reason", default=None, help="reason code required with --verdict fail")
    a = ap.parse_args()

    bible = Path(a.bible)
    project = bible.parent.parent.parent
    d, shots, shots_path = load_canon(bible)
    shot = next((s for s in shots if s.get("id") == a.shot), None)
    if not shot:
        die(f"shot '{a.shot}' not in canon")

    # ---- verdict mode -------------------------------------------------------
    if a.verdict:
        if a.verdict == "fail":
            if not a.reason:
                die("--verdict fail requires --reason with a code: " + ", ".join(sorted(REASON_CODES)))
            if a.reason not in REASON_CODES:
                die(f"unknown reason code '{a.reason}' — use one of: " + ", ".join(sorted(REASON_CODES)))
            shot["clip_qc"] = "clip_qc_fail"
            shot["clip_qc_reason"] = a.reason
        else:
            shot["clip_qc"] = "clip_qc_pass"
            shot.pop("clip_qc_reason", None)
        save_shots(bible, shots, shots_path, d, only_shot=a.shot)
        print(f"OK: {a.shot} -> {shot['clip_qc']}" + (f" ({a.reason})" if a.reason else ""))
        return

    # ---- gate 0: frame approved --------------------------------------------
    if shot.get("status") != "qc_pass":
        die(f"shot {a.shot} frame is '{shot.get('status')}' — clips fire only from qc_pass frames")
    sf = shot.get("start_frame")
    if not sf:
        die(f"shot {a.shot} has no start_frame")
    start = project / sf
    if not start.exists():
        die(f"start frame missing on disk: {start}")
    # 🔴 ANCHORS ARE NATIVE STILLS (Sam, 07.30 — S02 v04 mottle): a frame extracted from a
    # compressed clip is a generational copy; Seedance amplifies its compression into blotch.
    # Video-derived frames are legal ONLY for deliberate continuous-shot chaining via
    # continuation_from in canon.
    if "_frame1" in start.name or "/Footage/Seedance/" in str(start):
        if not shot.get("continuation_from"):
            die(f"shot {a.shot} anchors to a video-extracted frame ({start.name}) — generational copy, "
                "mottle risk. Use the native storyboard anchor, or declare continuation_from in canon "
                "for a genuine continuous-shot chain.")

    # 🔴 ONE PLATE PER CAMERA (Sam, 07.31 — the S25/S26 cast swap): coverage of the SAME
    # camera setup animates from the SAME still. Two independent stills off one camera are
    # two rolls of the dice, and the model re-invents faces and front rows between them.
    # A performance difference (neutral vs gasp vs glance) belongs in the clip_prompt.
    # Deliberate exception: declare plate_variant_reason in canon.
    cam = shot.get("camera")
    if cam and not shot.get("plate_variant_reason"):
        siblings = {(s.get("start_frame") or ""): s.get("id")
                    for s in shots
                    if s.get("camera") == cam and s.get("id") != a.shot and s.get("start_frame")}
        others = {p: i for p, i in siblings.items() if p != sf}
        if others:
            listed = ", ".join(f"{i} -> {Path(p).name}" for p, i in sorted(others.items(), key=lambda x: x[1]))
            die(f"shot {a.shot} anchors to {Path(sf).name}, but camera {cam} already covers "
                f"{listed}. ONE PLATE PER CAMERA — same setup, same still, or the cast re-rolls "
                f"between shots. Point them at one anchor, or set plate_variant_reason in canon.")

    # ---- canon video block --------------------------------------------------
    v = shot.get("video") or {}
    if not v:
        die(f"shot {a.shot} has no video: block — author it in canon first (see ag.clip.flow SKILL.md)")
    ref_mode = v.get("reference_mode")
    if ref_mode not in REF_MODES:
        die(f"shot {a.shot} reference_mode must be one of {sorted(REF_MODES)}, got {ref_mode!r}")
    if "generate_audio" not in v:
        die(f"shot {a.shot} has no explicit generate_audio — audio is a per-shot decision, never a default")
    audio = bool(v["generate_audio"])
    # 🔴 NO LINE, NO AUDIO (Sam, 07.31 — S26 v01 invented a judge speaking offscreen): audio on a
    # shot with no scripted line lets the model fill the silence with speech that isn't in the
    # script. Reaction shots, cutaways and atmosphere run silent; gasps and room tone come from
    # the library in post. Deliberate exception: declare audio_reason in canon.
    if audio and not (shot.get("expected_dialogue") or "").strip() and not shot.get("audio_reason"):
        die(f"shot {a.shot} has generate_audio:true but no expected_dialogue — the model will invent "
            "speech to fill it. Silent clip, or set audio_reason in canon for a deliberate sound beat.")
    try:
        dur = int(v.get("duration"))
    except (TypeError, ValueError):
        die(f"shot {a.shot} has no integer duration")
    if not 4 <= dur <= 15:
        die(f"shot {a.shot} duration {dur}s outside ByteDance's 4-15s range")
    multishot = bool(v.get("multishot"))
    if not multishot and dur > 10:
        _dlg = (shot.get("expected_dialogue") or "").strip()
        _need = max(5, -(-len(_dlg.split()) * 7 // 20) + 2) if _dlg else 0
        if not (_dlg and v.get("generate_audio") and _need > 10):
            die(f"shot {a.shot} is {dur}s with multishot:false — durations over 10s invite internal cuts. "
                "Shorten it, or set multishot:true deliberately. (Exception: a single line whose word count needs >10s.)")
    genre = v.get("genre", "auto")
    prof_name = a.profile or v.get("profile") or "std_720"
    if prof_name in BANNED_PROFILES:
        die(f"profile '{prof_name}' is banned — {BANNED_PROFILES[prof_name]}")
    if prof_name not in PROFILES:
        die(f"unknown profile '{prof_name}' — one of {sorted(PROFILES)}")
    prof = PROFILES[prof_name]

    prompt = (shot.get("clip_prompt") or "").strip()
    if not prompt:
        die(f"shot {a.shot} has no clip_prompt — one shot, one camera movement, dialogue included HERE")

    # 🔴 EDIT HANDLES ARE LAW (Sam, twice on 07.30 — now code): every dialogue clip carries
    # ~1s of settled silence before the first word and after the last, and the duration must
    # FIT line + handles. Words at ~0.4s each + 2s of air, floored at 5s.
    dialogue = (shot.get("expected_dialogue") or "").strip()
    if dialogue and audio:
        need = max(5, -(-len(dialogue.split()) * 7 // 20) + 2)  # ceil(words*0.35)+2, ~2.9 words/s natural pace
        if dur < need:
            die(f"shot {a.shot}: {dur}s cannot hold {len(dialogue.split())} words plus edit handles — needs >= {need}s. Handles are law.")
        prompt += ("\n\nTIMING, NON-NEGOTIABLE (edit handles): the clip OPENS on a full second of settled "
                   "silence — the speaker breathing, present, mouth closed — BEFORE the first word. The spoken "
                   "line sits in the middle of the clip. After the final word the speaker closes their mouth "
                   "and HOLDS, still and silent, for the entire final second. The clip never ends on a word.")
    if multishot and "0.0" not in prompt:
        die(f"shot {a.shot} is multishot:true but the prompt has no timestamped shot list")

    # ---- reference mode -> media flags (no ambiguous mixtures) --------------
    media, refs = [], {"start_frame": str(sf), "start_sha8": sha8(start)}
    end = None
    if ref_mode == "strict_start":
        media = ["--start-image", upload(start)]
    elif ref_mode == "strict_start_end":
        ef = shot.get("end_frame")
        if not ef:
            die(f"shot {a.shot} is strict_start_end but has no end_frame")
        end = project / ef
        if not end.exists():
            die(f"end frame missing on disk: {end}")
        media = ["--start-image", upload(start), "--end-image", upload(end)]
        refs["end_frame"] = str(ef); refs["end_sha8"] = sha8(end)
    else:  # multimodal
        extra = v.get("reference_images") or []
        if not extra:
            die(f"shot {a.shot} is multimodal but declares no reference_images")
        media = []
        for r in extra:
            rp = Path(r) if str(r).startswith("/") else project / r
            if not rp.exists():
                die(f"multimodal reference missing on disk: {rp}")
            media += ["--image", upload(rp)]
        refs["reference_images"] = [str(x) for x in extra]

    cmd = ["higgsfield", "generate", "create", prof["model"], "--prompt", prompt] + media + [
        "--aspect_ratio", "9:16", "--duration", str(dur),
        "--resolution", prof["resolution"], "--bitrate_mode", prof["bitrate_mode"],
        "--generate_audio", "true" if audio else "false", "--genre", genre]
    if prof["mode"]:
        cmd += ["--mode", prof["mode"]]

    # ---- cost quote (non-spending) -----------------------------------------
    q = sh(["higgsfield", "generate", "cost", prof["model"], "--prompt", prompt,
            "--aspect_ratio", "9:16", "--duration", str(dur), "--resolution", prof["resolution"],
            "--bitrate_mode", prof["bitrate_mode"], "--generate_audio", "true" if audio else "false",
            "--genre", genre] + (["--mode", prof["mode"]] if prof["mode"] else []) + ["--json"])
    cost = "unknown"
    try:
        cj = json.loads(q.stdout)
        cost = cj.get("cost") or cj.get("credits") or cj.get("total") or q.stdout.strip()[:80]
    except Exception:
        cost = (q.stdout or q.stderr).strip()[:80] or "unquotable"

    print(f"{a.shot} | {prof_name} {prof['model']} {prof['resolution']}/{prof['bitrate_mode']} "
          f"| {dur}s | audio={audio} genre={genre} | ref={ref_mode} | multishot={multishot}")
    print(f"quoted cost: {cost}")
    if a.dry_run:
        print("DRY RUN — nothing fired")
        return

    out_dir = project / "Elements/Footage/Seedance"
    out_dir.mkdir(parents=True, exist_ok=True)
    take = 1 + max([int(p.stem.split("_v")[-1]) for p in out_dir.glob(f"{a.shot}_v*.mp4")], default=0)
    out = out_dir / f"{a.shot}_v{take:02d}.mp4"

    r = sh(cmd + ["--wait", "--wait-timeout", "20m", "--json"])
    try:
        res = json.loads(r.stdout)
        res = res if isinstance(res, list) else [res]
        job_id, url = res[0].get("id", ""), res[0].get("result_url") or ""
    except Exception:
        die(f"generate failed: {(r.stdout or r.stderr)[:300]}")
    if not url:
        die(f"no result_url returned (job {job_id})")
    sh(["curl", "-s", "-o", str(out), url])
    if not out.exists() or out.stat().st_size == 0:
        die(f"download failed: {out}")

    # first decoded frame, for anchor-fidelity comparison
    frame1 = out.with_name(out.stem + "_frame1.png")
    sh(["ffmpeg", "-y", "-i", str(out), "-vframes", "1", str(frame1)])

    sidecar = {"shot": a.shot, "take": take, "engine": prof["model"], "profile": prof_name,
               "mode": prof["mode"], "resolution": prof["resolution"], "bitrate_mode": prof["bitrate_mode"],
               "duration": dur, "aspect_ratio": "9:16", "generate_audio": audio, "genre": genre,
               "reference_mode": ref_mode, "multishot": multishot, "references": refs,
               "uploaded_uuids": [m for m in media if not m.startswith("--")],
               "job_id": job_id, "result_url": url, "quoted_cost": cost,
               "fired_at": datetime.now(timezone.utc).isoformat(), "clip_qc": "pending",
               "expected_dialogue": shot.get("expected_dialogue", ""),
               "expected_speaker": shot.get("expected_speaker", ""), "prompt": prompt}
    out.with_suffix(".json").write_text(json.dumps(sidecar, indent=2))

    shot["clip_file"] = f"Elements/Footage/Seedance/{out.name}"
    shot["clip_sidecar"] = f"Elements/Footage/Seedance/{out.stem}.json"
    shot["clip_qc"] = "fired_pending_qc"
    shot["clip_take"] = take
    save_shots(bible, shots, shots_path, d, only_shot=a.shot)

    print(f"URL={url}")
    print(f"saved {out.name} (+ sidecar, + frame1)")
    print(f"canon updated: {a.shot} clip_qc=fired_pending_qc take={take}")


if __name__ == "__main__":
    main()
