#!/bin/bash
# veo-life — 3-frame filmstrip for a 6s cinemagraph clip (0s / 3s / 5.8s, hstacked).
# Usage: bash filmstrip.sh <clip.mp4> <out_strip.png>
# Pass = three near-identical frames with only micro-shifts.
# NOTE: visual-qc is the single filmstrip owner — prefer delegating the QC pass to it
# (its 5-frame scanner + ✓/✗/🔍 criteria); this helper covers the quick 6s-clip strip.
set -euo pipefail
FF="${PFM_FFMPEG:-$HOME/bin/ffmpeg}"; command -v "$FF" >/dev/null 2>&1 || FF=ffmpeg
CLIP="$1"; OUT="$2"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
"$FF" -y -loglevel error -ss 0   -i "$CLIP" -frames:v 1 -vf scale=300:-1 "$TMP/a.png"
"$FF" -y -loglevel error -ss 3   -i "$CLIP" -frames:v 1 -vf scale=300:-1 "$TMP/b.png"
"$FF" -y -loglevel error -ss 5.8 -i "$CLIP" -frames:v 1 -vf scale=300:-1 "$TMP/c.png"
"$FF" -y -loglevel error -i "$TMP/a.png" -i "$TMP/b.png" -i "$TMP/c.png" -filter_complex hstack=3 "$OUT"
echo "$OUT"
