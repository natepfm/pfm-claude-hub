#!/usr/bin/env python3
"""Mechanical QC gate for V2 bounded clips.

Deterministic checks only — no model judgement. Exit 0 = all passed, 1 = at least one FAIL.
A FAIL is a MECHANICAL integrity failure. Creative misses are always the editor's call.

  1. START endpoint — frame 0 vs the start keyframe      (PIL mean abs diff)
  2. END   endpoint — last frame vs the end keyframe      (V1 never checked the LANDING,
                      which is exactly where the old blind pan failed)
  3. SCENE scan     — ffmpeg's native scene-change detector: the purpose-built cut finder.
                      Calibrated 2026-07-27 on synthetic clips:
                        clean pan            0.023
                        small positional hop 0.062
                        real framing snap    0.252  (exact timestamp, to the frame)
                      11x separation between clean and a real cut, no per-clip tuning.
                      🔴 A 1fps filmstrip MISSES mid-clip cuts (Mitchell 07-24, re-hit 07-27).
  4. SPEC           — did we get back what we ordered? resolution / duration / audio track.
                      Seedance silently returning 16:9 or a short clip is otherwise invisible.
  5. AUDIO          — stream present AND not effectively silent (mean volume floor).

Usage:
  gate.py clip.mp4 --start pos03.png --end pos04.png
                   [--expect-res 720x1280] [--expect-duration 12] [--outdir DIR] [--json]
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

try:
    from PIL import Image, ImageChops, ImageStat
except ImportError:
    sys.exit("ERROR: Pillow required — pip3 install Pillow")

# Endpoint diff thresholds (PIL mean abs diff, 0-255). ~20-22 is the V1-proven re-stage
# line; lively seams inflate it, so 20-24 is often a keeper — the strip is the tiebreak.
ENDPOINT_FAIL = 22.0
ENDPOINT_WARN = 18.0
# Native scene-score thresholds (see calibration above).
SCENE_FAIL = 0.10    # hard cut
SCENE_WARN = 0.04    # possible hop — worth an eyeball on the strip
# Below this mean volume (dBFS) a clip is effectively silent.
SILENCE_DBFS = -50.0
DUR_TOLERANCE = 0.6  # seconds


def _tool(name):
    """Resolve ffmpeg/ffprobe: explicit env override, then ~/bin, then PATH.
    ~/bin is checked because PFM Macs carry standalone evermeet builds there."""
    env = os.environ.get("PFM_FFMPEG" if name == "ffmpeg" else "PFM_FFPROBE")
    home = os.path.expanduser("~/bin/%s" % name)
    return env or (home if os.path.exists(home) else shutil.which(name))


FFMPEG = _tool("ffmpeg")
FFPROBE = _tool("ffprobe")


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


# ---- probe ------------------------------------------------------------------

def probe(video):
    """Format + stream facts. Returns {} if ffprobe is unavailable (checks then SKIP)."""
    if not FFPROBE:
        return {}
    r = run([FFPROBE, "-v", "error", "-show_format", "-show_streams", "-of", "json", video])
    try:
        d = json.loads(r.stdout)
    except json.JSONDecodeError:
        return {}
    out = {"duration": float(d.get("format", {}).get("duration") or 0)}
    for s in d.get("streams", []):
        if s.get("codec_type") == "video" and "width" not in out:
            out.update(width=s.get("width"), height=s.get("height"), vcodec=s.get("codec_name"))
            fr = s.get("avg_frame_rate") or "0/1"
            try:
                n, den = fr.split("/")
                out["fps"] = round(int(n) / int(den), 2) if int(den) else 0
            except (ValueError, ZeroDivisionError):
                out["fps"] = 0
        elif s.get("codec_type") == "audio":
            out["has_audio"] = True
            out["acodec"] = s.get("codec_name")
    out.setdefault("has_audio", False)
    return out


# ---- checks -----------------------------------------------------------------

def mean_abs_diff(a, b):
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        ib = ib.resize(ia.size, Image.LANCZOS)
    st = ImageStat.Stat(ImageChops.difference(ia, ib))
    return sum(st.mean) / len(st.mean)


def extract(video, out, tail=False):
    if tail:
        cmd = [FFMPEG, "-y", "-sseof", "-0.3", "-i", video, "-vsync", "0",
               "-vf", "reverse", "-frames:v", "1", out]
    else:
        cmd = [FFMPEG, "-y", "-ss", "0", "-i", video, "-frames:v", "1", out]
    run(cmd + ["-loglevel", "error"])
    return os.path.exists(out) and os.path.getsize(out) > 0


def endpoint_check(video, keyframe, which, tmp):
    if not keyframe or not os.path.exists(keyframe):
        return {"check": which, "status": "SKIP", "reason": "no keyframe supplied"}
    shot = os.path.join(tmp, "%s.png" % which)
    if not extract(video, shot, tail=(which == "end")):
        return {"check": which, "status": "FAIL", "reason": "frame extraction failed"}
    d = mean_abs_diff(shot, keyframe)
    status = "PASS" if d < ENDPOINT_WARN else ("WARN" if d < ENDPOINT_FAIL else "FAIL")
    return {"check": which, "status": status, "diff": round(d, 1)}


def scene_scan(video):
    """ffmpeg's native scene-change detector — exact cut timestamps, no threshold tuning."""
    if not FFPROBE:
        return {"check": "scene", "status": "SKIP", "reason": "ffprobe not installed"}
    r = run([FFPROBE, "-v", "error", "-f", "lavfi",
             "-i", "movie=%s,select='gte(scene\\,0)'" % video.replace("\\", "\\\\").replace(":", "\\:"),
             "-show_entries", "frame=pts_time:frame_tags=lavfi.scene_score", "-of", "csv=p=0"])
    hits = []
    for line in r.stdout.splitlines():
        parts = [p for p in line.strip().rstrip(",").split(",") if p]
        if len(parts) < 2:
            continue
        try:
            t, score = float(parts[0]), float(parts[1])
        except ValueError:
            continue
        if score >= SCENE_WARN:
            hits.append({"at_sec": round(t, 3), "scene": round(score, 3)})
    if not hits:
        return {"check": "scene", "status": "PASS", "peak": 0.0}
    peak = max(h["scene"] for h in hits)
    cuts = [h for h in hits if h["scene"] >= SCENE_FAIL]
    return {"check": "scene", "status": "FAIL" if cuts else "WARN",
            "peak": peak, "cuts": cuts, "suspect": [h for h in hits if h not in cuts]}


def spec_check(info, expect_res, expect_dur):
    if not info:
        return {"check": "spec", "status": "SKIP", "reason": "ffprobe not installed"}
    got = "%sx%s" % (info.get("width"), info.get("height"))
    problems = []
    if expect_res and got != expect_res:
        problems.append("resolution %s (ordered %s)" % (got, expect_res))
    if expect_dur and abs(info.get("duration", 0) - expect_dur) > DUR_TOLERANCE:
        problems.append("duration %.2fs (ordered %ss)" % (info.get("duration", 0), expect_dur))
    return {"check": "spec", "status": "FAIL" if problems else "PASS",
            "resolution": got, "duration": round(info.get("duration", 0), 2),
            "fps": info.get("fps"), "problems": problems}


def audio_check(video, info):
    if not info:
        return {"check": "audio", "status": "SKIP", "reason": "ffprobe not installed"}
    if not info.get("has_audio"):
        return {"check": "audio", "status": "FAIL", "reason": "no audio stream"}
    r = run([FFMPEG, "-i", video, "-af", "volumedetect", "-f", "null", "-", "-hide_banner"])
    m = re.search(r"mean_volume:\s*(-?\d+\.?\d*) dB", (r.stderr or "") + (r.stdout or ""))
    if not m:
        return {"check": "audio", "status": "WARN", "reason": "could not measure level"}
    mean = float(m.group(1))
    silent = mean < SILENCE_DBFS
    return {"check": "audio", "status": "FAIL" if silent else "PASS",
            "mean_dbfs": mean, "codec": info.get("acodec")}


def filmstrip(video, out, fps=2, cols=6, rows=4):
    run([FFMPEG, "-y", "-i", video, "-vf",
         "fps=%d,scale=320:-1,tile=%dx%d" % (fps, cols, rows), "-frames:v", "1",
         out, "-loglevel", "error"])
    return out if os.path.exists(out) else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--start", help="start keyframe PNG (pos N-1)")
    ap.add_argument("--end", help="end keyframe PNG (pos N)")
    ap.add_argument("--expect-res", help="e.g. 720x1280")
    ap.add_argument("--expect-duration", type=float)
    ap.add_argument("--outdir")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    if not os.path.exists(a.video):
        sys.exit("ERROR: no such video: %s" % a.video)
    if not FFMPEG:
        sys.exit("ERROR: ffmpeg not found (checked $PFM_FFMPEG, ~/bin, PATH)")

    outdir = a.outdir or os.path.dirname(os.path.abspath(a.video))
    base = os.path.splitext(os.path.basename(a.video))[0]
    info = probe(a.video)
    report = {"clip": os.path.basename(a.video), "probe": info, "checks": []}

    with tempfile.TemporaryDirectory() as tmp:
        report["checks"].append(endpoint_check(a.video, a.start, "start", tmp))
        report["checks"].append(endpoint_check(a.video, a.end, "end", tmp))
        report["checks"].append(scene_scan(a.video))
        report["checks"].append(spec_check(info, a.expect_res, a.expect_duration))
        report["checks"].append(audio_check(a.video, info))
        report["filmstrip"] = filmstrip(a.video, os.path.join(outdir, "%s_strip.png" % base))

    failed = [c for c in report["checks"] if c["status"] == "FAIL"]
    report["verdict"] = "FAIL" if failed else "PASS"

    if a.json:
        print(json.dumps(report, indent=2))
    else:
        d = info.get("duration", 0)
        print("── gate: %s (%.2fs %sx%s @%sfps) ──" % (
            report["clip"], d, info.get("width"), info.get("height"), info.get("fps")))
        for c in report["checks"]:
            extra = ""
            if "diff" in c:
                extra = " diff=%.1f" % c["diff"]
            elif c["check"] == "scene":
                extra = " peak=%.3f" % c.get("peak", 0)
                if c.get("cuts"):
                    extra += " CUT @ %s" % ", ".join("%.2fs" % x["at_sec"] for x in c["cuts"])
                elif c.get("suspect"):
                    extra += " suspect @ %s" % ", ".join("%.2fs" % x["at_sec"] for x in c["suspect"])
            elif c["check"] == "spec" and c.get("problems"):
                extra = " " + "; ".join(c["problems"])
            elif c["check"] == "audio" and "mean_dbfs" in c:
                extra = " mean=%.1fdB" % c["mean_dbfs"]
            if c.get("reason"):
                extra = " (%s)" % c["reason"]
            print("  %-7s %-5s%s" % (c["check"], c["status"], extra))
        if report["filmstrip"]:
            print("  strip   %s" % report["filmstrip"])
        print("  VERDICT %s" % report["verdict"])

    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
