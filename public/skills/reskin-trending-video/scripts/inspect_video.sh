#!/usr/bin/env bash
# inspect_video.sh — inspect a reference clip before reskinning it.
# Prints metadata, extracts evenly-spaced frames, and builds a contact sheet
# so you can view the whole clip in one image and describe it back accurately.
#
# Usage:
#   bash inspect_video.sh /path/to/clip.mp4 [out_dir]
#
# Output:
#   <out_dir>/frames/             individual extracted frames
#   <out_dir>/contact_sheet.jpg   tiled overview (Read this in Claude)
#
# Requires: ffmpeg, ffprobe (both already installed for PFM QC), and ImageMagick
# `montage` (optional — if missing, Read the frames individually).

set -euo pipefail

VID="${1:?Usage: inspect_video.sh <video> [out_dir]}"
OUT="${2:-/tmp/vidinspect}"
FRAMES="$OUT/frames"

mkdir -p "$FRAMES"

echo "== METADATA =="
ffprobe -v error \
  -show_entries format=duration,size:stream=width,height,r_frame_rate,codec_name \
  -of default=noprint_wrappers=1 "$VID"

# Pull duration to size the sampling rate so we always get ~16-20 frames
DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VID")
# fps so that frames ~= 18 across the clip (floor at a sane minimum)
FPS=$(awk -v d="$DUR" 'BEGIN { f = 18.0 / (d>0?d:18); if (f>4) f=4; if (f<0.3) f=0.3; printf "%.3f", f }')

echo
echo "== EXTRACTING FRAMES (fps=$FPS) =="
ffmpeg -v error -i "$VID" -vf "fps=$FPS,scale=480:-1" "$FRAMES/f_%03d.jpg"
COUNT=$(ls "$FRAMES" | wc -l | tr -d ' ')
echo "extracted $COUNT frames to $FRAMES"

echo
echo "== CONTACT SHEET =="
if command -v montage >/dev/null 2>&1; then
  # square-ish grid
  COLS=$(awk -v n="$COUNT" 'BEGIN { c=int(sqrt(n)+0.999); if (c<3) c=3; print c }')
  montage "$FRAMES"/f_*.jpg -tile "${COLS}x" -geometry +4+4 "$OUT/contact_sheet.jpg"
  echo "contact sheet: $OUT/contact_sheet.jpg  (Read this image in Claude)"
else
  echo "montage not found — Read individual frames in $FRAMES"
  echo "  (install ImageMagick for a single contact sheet: brew install imagemagick)"
fi
