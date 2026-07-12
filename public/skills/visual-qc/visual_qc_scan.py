#!/usr/bin/env python3
"""Visual QC scanner for Veo-generated mp4 clips.

For each delivered mp4:
  - Extracts 5 stills at 0s / 2s / 4s / 6s / 7.8s, scaled to ~480px wide
  - hstacks them into a single filmstrip PNG → <veo_root>/qc/strip_<slug>.png
    (or <veo_root>/qc/<STATE>/strip_<slug>.png for state-routed batches)
  - For caption-slide clips (project-specific L-numbers passed via --caption-clips),
    additionally extracts 4s / 6s / 7.8s at FULL native resolution →
    <veo_root>/qc/caption/<slug>_<t>s.png. These are for fine-text inspection
    that the 480px filmstrip can't resolve.

Writes a JSON index manifest to <veo_root>/qc/visual_qc_index_<YYYY-MM-DD>.json
listing every clip + its filmstrip path + caption frame paths (if applicable).

Claude consumes the index, Reads each filmstrip (and full-res frames for caption
clips), applies the pass/fail criteria from visual-qc/SKILL.md, and writes the
final visual_qc_report.md alongside the audio one.

Cross-skill ordering: this script generates ARTIFACTS only — the Claude-side
visual analysis is the second half of the workflow. Don't expect this script
to make pass/fail calls.

Usage:
    visual_qc_scan.py <veo_root> [--caption-clips L02,L17,...] [--workers 8]
                      [--exclude SUBSTR] [--strip-width 480] [--out <index.json>]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from pathlib import Path


def _resolve_ffmpeg() -> str:
    """Resolve ffmpeg binary path. Order: $PFM_FFMPEG env → ~/bin/ffmpeg → PATH."""
    env = os.environ.get("PFM_FFMPEG")
    if env and os.path.isfile(env):
        return env
    home_bin = os.path.expanduser("~/bin/ffmpeg")
    if os.path.isfile(home_bin):
        return home_bin
    on_path = shutil.which("ffmpeg")
    if on_path:
        return on_path
    print(
        "error: ffmpeg not found. Install via the PFM setup script:\n"
        '  bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup.sh"\n'
        "or set PFM_FFMPEG to its absolute path.",
        file=sys.stderr,
    )
    sys.exit(2)


FFMPEG = _resolve_ffmpeg()

# Sampling timestamps for the 5-frame filmstrip
STRIP_TIMESTAMPS = [0.0, 2.0, 4.0, 6.0, 7.8]
# Additional full-res frames for caption slides (later in clip — defects skew here)
CAPTION_TIMESTAMPS = [4.0, 6.0, 7.8]

# Filename patterns. Slugs look like:
#   denied_car_loan_L01_v01.mp4              (BASE / BROAD)
#   cybertruck_state_b1_FL_L02_v01.mp4       (state-routed)
L_NUMBER_PATTERN = re.compile(r"_L(\d+)(?:_v\d+)?\.mp4$")
STATE_PATTERN = re.compile(r"_([A-Z]{2})_L\d+(?:_v\d+)?\.mp4$")


def _extract_frame(clip_path: Path, timestamp: float, output_path: Path,
                   width: int | None = None) -> tuple[bool, str | None]:
    """Extract a single frame from clip at timestamp. width=None for full res.

    Uses -ss BEFORE -i for fast input seek — accurate enough for our sampling
    timestamps (0/2/4/6/7.8) on 8s clips.
    """
    cmd = [FFMPEG, "-y", "-ss", str(timestamp), "-i", str(clip_path),
           "-frames:v", "1"]
    if width:
        cmd.extend(["-vf", f"scale={width}:-1"])
    cmd.extend(["-loglevel", "error", str(output_path)])
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    except subprocess.TimeoutExpired:
        return False, f"ffmpeg timeout at {timestamp}s"
    if result.returncode != 0:
        return False, (result.stderr or "ffmpeg exited non-zero").strip()[:200]
    if not output_path.exists() or output_path.stat().st_size == 0:
        return False, f"ffmpeg produced no output at {timestamp}s"
    return True, None


def _hstack_frames(frame_paths: list[Path], output_path: Path) -> tuple[bool, str | None]:
    """hstack a list of frame PNGs into one filmstrip PNG via ffmpeg filter_complex."""
    inputs: list[str] = []
    for p in frame_paths:
        inputs.extend(["-i", str(p)])
    cmd = [FFMPEG, "-y", *inputs,
           "-filter_complex", f"hstack=inputs={len(frame_paths)}",
           "-loglevel", "error", str(output_path)]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    except subprocess.TimeoutExpired:
        return False, "hstack timeout"
    if result.returncode != 0:
        return False, (result.stderr or "hstack exited non-zero").strip()[:200]
    return True, None


def _get_line_number(clip_path: Path) -> str | None:
    """Extract zero-padded L-number from filename (e.g. '02' from '..._L02_v01.mp4')."""
    m = L_NUMBER_PATTERN.search(clip_path.name)
    return m.group(1).zfill(2) if m else None


def _get_state(clip_path: Path) -> str | None:
    """Extract 2-letter state abbrev from filename, or None for non-state batches."""
    m = STATE_PATTERN.search(clip_path.name)
    return m.group(1) if m else None


def _process_clip(clip_path: Path, qc_root: Path, caption_lnums: set[str],
                  strip_width: int, tmp_dir: Path) -> dict:
    """Generate filmstrip (+ caption full-res frames if applicable) for one clip."""
    slug = clip_path.stem  # filename without .mp4
    lnum = _get_line_number(clip_path)
    state = _get_state(clip_path)
    is_caption = lnum is not None and f"L{lnum}" in caption_lnums

    # Filmstrip lands in per-state subfolder for state-routed batches, else flat
    strip_dir = qc_root / state if state else qc_root
    strip_dir.mkdir(parents=True, exist_ok=True)

    # Extract 5 frames into per-clip tmp subfolder (avoids name collisions between clips)
    clip_tmp = tmp_dir / slug
    clip_tmp.mkdir(parents=True, exist_ok=True)

    frame_paths: list[Path] = []
    for i, t in enumerate(STRIP_TIMESTAMPS):
        frame_path = clip_tmp / f"f{i}.png"
        ok, err = _extract_frame(clip_path, t, frame_path, width=strip_width)
        if not ok:
            shutil.rmtree(clip_tmp, ignore_errors=True)
            return {
                "slug": slug,
                "clip_path": str(clip_path),
                "lnum": f"L{lnum}" if lnum else None,
                "state": state,
                "is_caption": is_caption,
                "status": "error",
                "error": f"frame extract @ {t}s failed: {err}",
            }
        frame_paths.append(frame_path)

    # hstack into filmstrip
    strip_path = strip_dir / f"strip_{slug}.png"
    ok, err = _hstack_frames(frame_paths, strip_path)

    # Clean up tmp frames regardless of hstack outcome
    shutil.rmtree(clip_tmp, ignore_errors=True)

    if not ok:
        return {
            "slug": slug,
            "clip_path": str(clip_path),
            "lnum": f"L{lnum}" if lnum else None,
            "state": state,
            "is_caption": is_caption,
            "status": "error",
            "error": f"hstack failed: {err}",
        }

    result: dict = {
        "slug": slug,
        "clip_path": str(clip_path),
        "filmstrip_path": str(strip_path),
        "lnum": f"L{lnum}" if lnum else None,
        "state": state,
        "is_caption": is_caption,
        "caption_frames": [],
        "status": "ready",
    }

    # If caption slide, extract full-res end frames
    if is_caption:
        caption_dir = qc_root / "caption"
        caption_dir.mkdir(parents=True, exist_ok=True)
        for t in CAPTION_TIMESTAMPS:
            cap_path = caption_dir / f"{slug}_{t}s.png"
            ok, err = _extract_frame(clip_path, t, cap_path, width=None)
            if ok:
                result["caption_frames"].append({
                    "timestamp": t,
                    "path": str(cap_path),
                })
            else:
                # Non-fatal — note in result so Claude knows
                result.setdefault("caption_errors", []).append(
                    f"full-res @ {t}s failed: {err}")

    return result


def _normalize_lnum(token: str) -> str:
    """Normalize 'L2' / 'L02' / '2' / '02' to 'L02'."""
    token = token.strip()
    if not token:
        return ""
    num = re.sub(r"^[Ll]", "", token)
    return f"L{num.zfill(2)}"


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Visual QC — extract per-clip filmstrips for Claude visual analysis.")
    ap.add_argument("veo_root",
                    help="Path to the Veo output folder (or a sub-folder).")
    ap.add_argument("--caption-clips", default="",
                    help="Comma-separated L-numbers that get full-res end-frame extraction "
                         "(e.g. L02,L17,L19). Project-specific.")
    ap.add_argument("--workers", type=int, default=8,
                    help="Parallel ffmpeg jobs (default 8).")
    ap.add_argument("--exclude", action="append", default=[],
                    help="Path substrings to skip (repeatable).")
    ap.add_argument("--strip-width", type=int, default=480,
                    help="Per-frame width before hstack (default 480).")
    ap.add_argument("--out", default=None,
                    help="Custom index JSON path.")
    args = ap.parse_args()

    veo_root = Path(args.veo_root).resolve()
    if not veo_root.exists():
        sys.stderr.write(f"error: {veo_root} does not exist\n")
        sys.exit(2)

    qc_root = veo_root / "qc"
    qc_root.mkdir(exist_ok=True)
    tmp_dir = qc_root / "_tmp"
    tmp_dir.mkdir(exist_ok=True)

    # Parse caption-clips list
    caption_lnums: set[str] = set()
    if args.caption_clips:
        for token in args.caption_clips.split(","):
            norm = _normalize_lnum(token)
            if norm:
                caption_lnums.add(norm)

    # Find all mp4s (skip qc/ subfolder to avoid feedback loop on re-scans)
    mp4s: list[Path] = []
    for p in veo_root.rglob("*.mp4"):
        rel = p.relative_to(veo_root)
        if "qc" in rel.parts:
            continue
        if any(excl in str(p) for excl in args.exclude):
            continue
        mp4s.append(p)

    if not mp4s:
        print(f"Found 0 mp4 files under {veo_root}")
        return

    print(f"Scanning {len(mp4s)} clips with {args.workers} workers...")
    print(f"Caption-slide L-numbers: {sorted(caption_lnums) if caption_lnums else '(none)'}")
    print(f"Filmstrip width: {args.strip_width}px (hstacked = ~{args.strip_width * 5}px wide)")
    print()

    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = {ex.submit(_process_clip, p, qc_root, caption_lnums,
                          args.strip_width, tmp_dir): p for p in mp4s}
        for i, f in enumerate(as_completed(futs), start=1):
            r = f.result()
            results.append(r)
            tag = "✓" if r["status"] == "ready" else "✗"
            caption_note = " [+caption]" if r.get("is_caption") and r["status"] == "ready" else ""
            err_note = f" — {r.get('error')}" if r.get("error") else ""
            print(f"  [{i}/{len(mp4s)}] {tag} {r['slug']}{caption_note}{err_note}")

    shutil.rmtree(tmp_dir, ignore_errors=True)

    # Sort results by (state, lnum, slug) for predictable Claude walk order
    def _sort_key(r: dict) -> tuple:
        return (r.get("state") or "", r.get("lnum") or "", r["slug"])
    results.sort(key=_sort_key)

    out_path = Path(args.out) if args.out else qc_root / f"visual_qc_index_{date.today().isoformat()}.json"
    with open(out_path, "w") as fh:
        json.dump({
            "scan_date": date.today().isoformat(),
            "veo_root": str(veo_root),
            "qc_root": str(qc_root),
            "caption_lnums": sorted(caption_lnums),
            "strip_width": args.strip_width,
            "clip_count": len(results),
            "results": results,
        }, fh, indent=2)

    ok = sum(1 for r in results if r["status"] == "ready")
    err = sum(1 for r in results if r["status"] == "error")
    cap = sum(1 for r in results if r.get("is_caption") and r["status"] == "ready")

    print()
    print(f"Done. {ok}/{len(results)} filmstrips ready, {err} errors, {cap} caption-slide clips with full-res end frames.")
    print(f"Filmstrips: {qc_root}{' (per-state subfolders)' if any(r.get('state') for r in results) else ''}")
    if cap:
        print(f"Caption full-res frames: {qc_root / 'caption'}")
    print(f"Index: {out_path}")
    print()
    print("Next: Claude walks the index, Reads each filmstrip (+ caption full-res for caption clips),")
    print("applies pass/fail criteria from visual-qc/SKILL.md, writes visual_qc_report_<date>.md.")


if __name__ == "__main__":
    main()
