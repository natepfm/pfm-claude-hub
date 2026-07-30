#!/usr/bin/env python3
"""fire_clip.py — the ONLY sanctioned way to fire a Seedance clip in ag.scene.flow.

Implements the 07.30 anti-drift research's Seedance rules as refusals:
  - strict start mode: the shot's approved start_frame is passed via --start-image
    (the dedicated first-frame role), NEVER a generic --image;
  - refuses when fire-check would refuse (shot not qc_pass, no start_frame);
  - refuses when the start/end frame aspect != the scene's DECLARED aspect (bible scene.aspect);
  - --end-image only when the bible marks end_frame_required and an approved
    end_frame exists at matching aspect;
  - one clip per shot unit; multi-shot generation is opt-in via --allow-multishot
    (continuity-sensitive dialogue scenes should not use it);
  - after the render, extracts frame 1 and saves it beside the clip as
    <clip>_frame1.png for the mandatory anchor-comparison review — if frame one
    already broke identity/wardrobe/blocking, reject before reviewing motion.

Usage:
  fire_clip.py <bible.yaml> --shot S07 [--duration 8] [--resolution 1080p]
               [--mode std] [--genre comedy] [--allow-multishot]
"""
import argparse, json, subprocess, sys
from pathlib import Path

import yaml


def die(msg):
    print(f"REFUSED: {msg}")
    sys.exit(1)


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def aspect_ratio_of(spec):
    """"9:16" -> 0.5625. Any W:H the bible declares."""
    try:
        w, h = spec.split(":")
        return float(w) / float(h)
    except Exception:
        return 9 / 16


def aspect_matches(path, spec):
    """Frame aspect must equal the scene's DECLARED aspect (not a hardcoded 9:16)."""
    try:
        from PIL import Image
        w, h = Image.open(path).size
        return abs((w / h) - aspect_ratio_of(spec)) < 0.02
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--shot", required=True)
    ap.add_argument("--duration", default=None)
    ap.add_argument("--resolution", default="1080p")
    ap.add_argument("--mode", default="std")
    ap.add_argument("--genre", default="comedy")
    ap.add_argument("--allow-multishot", action="store_true")
    a = ap.parse_args()

    bible = Path(a.bible)
    project = bible.parent.parent.parent
    d = yaml.safe_load(bible.read_text())
    # 🔴 ASPECT IS DECLARED ONCE, in the bible, and every fire derives from it. Never
    # hardcoded here: a 16:9 creative (CTV / Roku / podcast) must fire 16:9 end to end.
    aspect = str((d.get("scene") or {}).get("aspect") or "9:16").strip()
    # 🔴 SHOTS may live in a sibling SHOTS.yaml (bible split, 07.30) — ONE CANON ONLY.
    shots_path = bible.parent / "SHOTS.yaml"
    inline = d.get("shots") or []
    external = []
    if shots_path.exists():
        sd = yaml.safe_load(shots_path.read_text()) or {}
        external = (sd.get("shots") if isinstance(sd, dict) else sd) or []
        if inline:
            die("shots exist in BOTH SCENE_BIBLE.yaml and SHOTS.yaml — one canon only. Delete the inline block.")
    all_shots = external or inline
    shot = next((s for s in all_shots if s.get("id") == a.shot), None)
    if not shot:
        die(f"shot '{a.shot}' not in bible")
    if shot.get("status") != "qc_pass":
        die(f"shot {a.shot} status is '{shot.get('status')}' — clips fire only on qc_pass (no clip before storyboard QC)")
    sf_rel = (shot.get("start_frame") or "").strip()
    if not sf_rel:
        die(f"shot {a.shot} has no approved start_frame")
    start = project / sf_rel
    if not start.exists():
        die(f"start frame missing on disk: {start}")
    if not aspect_matches(start, aspect):
        die(f"start frame is not {aspect} — Seedance start/end and output aspect must match the scene's declared aspect")

    end = None
    if shot.get("end_frame_required"):
        ef_rel = (shot.get("end_frame") or "").strip()
        if not ef_rel:
            die(f"shot {a.shot} requires an end frame but none is approved")
        end = project / ef_rel
        if not end.exists() or not aspect_matches(end, aspect):
            die(f"end frame missing or not {aspect}: {end}")

    prompt = (shot.get("clip_prompt") or "").strip()
    if not prompt:
        die(f"shot {a.shot} has no clip_prompt in the bible — one shot, one camera movement, dialogue included HERE (clips lip-sync; frames don't)")
    moves = sum(prompt.lower().count(w) for w in ["pan ", "orbit", "whip", "crane", "dolly", "push-in", "pull-back", "zoom"])
    if moves > 1:
        die(f"clip_prompt contains {moves} camera movements — one precision shot gets ONE camera movement")

    dur = str(a.duration or shot.get("duration") or 8)
    up = lambda p: json.loads(sh(["higgsfield", "upload", "create", str(p), "--json"]).stdout)["id"]
    cmd = ["higgsfield", "generate", "create", "seedance_2_0",
           "--prompt", prompt, "--start-image", up(start)]
    if end is not None:
        cmd += ["--end-image", up(end)]
    cmd += ["--aspect_ratio", aspect, "--duration", dur, "--resolution", a.resolution,
            "--mode", a.mode, "--genre", a.genre, "--generate_audio", "true",
            "--wait", "--wait-timeout", "20m", "--json"]
    r = sh(cmd)
    try:
        res = json.loads(r.stdout)
        res = res if isinstance(res, list) else [res]
        url = res[0].get("result_url") or ""
    except Exception:
        die(f"generate failed: {r.stdout[:300]} {r.stderr[:200]}")
    if not url:
        die("no result_url returned")
    print(f"URL={url}")

    out_dir = project / "Elements/Footage/Veo"
    out_dir.mkdir(parents=True, exist_ok=True)
    existing = sorted(out_dir.glob(f"{a.shot}_clip_v*.mp4"))
    next_v = 1 + max([int(p.stem.split("_v")[-1]) for p in existing], default=0)
    out = out_dir / f"{a.shot}_clip_v{next_v:02d}.mp4"
    sh(["curl", "-s", "-o", str(out), url])
    if not out.exists() or out.stat().st_size == 0:
        die(f"download failed: {out}")
    print(f"saved {out.name}")

    # first-render comparison gate: extract frame 1 for anchor comparison
    f1 = out.with_name(out.stem + "_frame1.png")
    sh(["ffmpeg", "-y", "-i", str(out), "-frames:v", "1", str(f1)])
    if f1.exists():
        print(f"frame1 extracted -> {f1.name} — COMPARE against {start.name} before reviewing motion")
    else:
        print("WARNING: frame1 extraction failed (ffmpeg missing?) — compare manually")

    shot["status"] = "fired"
    shot["clip_file"] = str(out.relative_to(project))
    if shots_path.exists() and external:
        sd_out = yaml.safe_load(shots_path.read_text()) or {}
        if isinstance(sd_out, dict): sd_out["shots"] = all_shots
        else: sd_out = all_shots
        yaml.safe_dump(sd_out, shots_path.open("w"), sort_keys=False, allow_unicode=True, width=100)
    yaml.safe_dump(d, bible.open("w"), sort_keys=False, allow_unicode=True, width=100)
    print("bible updated: status=fired")


if __name__ == "__main__":
    main()
