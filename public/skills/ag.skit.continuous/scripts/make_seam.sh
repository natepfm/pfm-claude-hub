#!/bin/bash
# make_seam.sh — OPTIONAL seam-frame helper for ag.skit.continuous.
#
# Station master stills are the spine of this skill. A seam is the exception: one beat that
# genuinely needs unbroken camera motion. When you do take one, the frame cannot go into the next
# generation raw — Seedance renders each clip a notch darker and crunchier than its input, so a
# raw seam carries the previous generation's noise, oversharpen halos and blotchy skin forward and
# compounds them. This de-crunches it.
#
# 🔴 GRADE IS OFF BY DEFAULT (reversed 2026-08-03, Sam). Baking a colour grade into the seam bakes
# it into the OUTPUT clip — Seedance generates the whole clip off the start image — and Sam grades
# in POST, so a pre-baked look fights his grade. Set GRADE=1 only for a hand-picked hero STILL,
# never for a seam feeding a generation. (This is the counterweight law in practice: the earlier
# locked rule "bake the grade in" kept producing rejected output, so the RULE was wrong.)
#
# Rejected alternatives, measured: Topaz goes painterly. nlmeans cleans but waxes skin and smears
# hair. The smartblur chain below keeps hair strands and shirt texture real. Freckles and moles
# survive — that is content, not crunch.
#
# Writes <out>.seam.json alongside the frame; fire_skit_clip.py REFUSES a seam without it, so a
# raw grab cannot quietly become a start image.
#
# Usage:  make_seam.sh <input.mp4> <timestamp_sec> <output.png>
#         GRADE=1 make_seam.sh <input.mp4> <ts> <out.png>     # hand-picked hero still only
set -euo pipefail

if [ $# -lt 3 ]; then
  echo "usage: make_seam.sh <input.mp4> <timestamp_sec> <output.png>" >&2
  exit 2
fi
IN="$1"; TS="$2"; OUT="$3"
[ -f "$IN" ] || { echo "REFUSED: no such clip: $IN" >&2; exit 1; }

FFMPEG="${PFM_FFMPEG:-$( [ -x "$HOME/bin/ffmpeg" ] && echo "$HOME/bin/ffmpeg" || command -v ffmpeg )}"
[ -n "$FFMPEG" ] || { echo "REFUSED: ffmpeg not found (checked \$PFM_FFMPEG, ~/bin, PATH)" >&2; exit 1; }

# hqdn3d   -> kills grain/noise
# smartblur (negative threshold) -> de-halos the oversharpen overshoot, keeps real edges
# bilateral -> gentle edge-preserving skin/wall smooth
# scale     -> clarity headroom for the start image
DECRUNCH="hqdn3d=5:4:7:5,smartblur=luma_radius=3:luma_strength=0.55:luma_threshold=-28,bilateral=sigmaS=5:sigmaR=0.05"

if [ "${GRADE:-0}" = "1" ]; then
  GRADE_F=",curves=all='0/0.035 0.035/0.135 0.333/0.435 0.60/0.63 0.76/0.755 1/0.95',eq=saturation=1.15"
else
  GRADE_F=""
fi

"$FFMPEG" -y -ss "$TS" -i "$IN" -frames:v 1 \
  -vf "${DECRUNCH}${GRADE_F},scale=1440:2560:flags=lanczos" "$OUT" 2>/dev/null

[ -s "$OUT" ] || { echo "REFUSED: frame extraction produced nothing at ${TS}s" >&2; exit 1; }

cat > "${OUT}.seam.json" <<JSON
{
  "source_clip": "$(basename "$IN")",
  "timestamp_sec": "$TS",
  "decrunched": true,
  "graded": ${GRADE:-0},
  "filter": "${DECRUNCH}${GRADE_F}",
  "made_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
JSON

echo "seam -> $OUT"
echo "sidecar -> ${OUT}.seam.json"
if [ "${GRADE:-0}" = "1" ]; then
  echo "WARNING: GRADE=1 — this frame is graded. Do NOT feed it to a generation; hero stills only."
fi
# Picking the frame: never blind-grab the final encoded frame. Pull several candidates from the
# last ~1.5s, view them, and take the latest sharp one with no new foreground junk (a bystander
# walking in is common). If an upload is refused, read the NSFW note in fire_skit_clip.py first.
