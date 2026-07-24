#!/bin/bash
# add_disclaimer.sh — burn the PFM AI-performer disclaimer onto finished video(s).
# Auto-detects aspect ratio per file and applies the locked PFM preset:
#   • VERTICAL  (H>W): two centered BOLD-italic lines low in frame, white 92% + soft shadow
#   • HORIZONTAL(W>=H): one regular-italic line across the very bottom (below the chyron), white 60%, no box
# Never touches the source. Normalizes output to clean H.264 (CRF 18), audio copied untouched.
#
# Usage:
#   add_disclaimer.sh <input_file>  <output_file>          # one video
#   add_disclaimer.sh <input_dir>   <output_dir>           # batch (mirrors subfolders, *.mp4/*.mov)
#   add_disclaimer.sh --preview <input_file> <out.png> [timestamp_seconds]   # 1 frame, no encode
#
# Locked text (verbatim, WITH the trailing period — do not paraphrase):
#   This advertisement contains synthetic performers created with artificial intelligence.
set -u

# Vertical line split matches the reference creative (break after "synthetic"); both end the sentence with a period.
DISCLAIMER_FULL="This advertisement contains synthetic performers created with artificial intelligence."
DISCLAIMER_L1="This advertisement contains synthetic"
DISCLAIMER_L2="performers created with artificial intelligence."

FONT_BOLD="/Library/Fonts/SF-Pro-Display-BoldItalic.otf"
[ -f "$FONT_BOLD" ] || FONT_BOLD="/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"
FONT_REG="/Library/Fonts/SF-Pro-Display-RegularItalic.otf"
[ -f "$FONT_REG" ] || FONT_REG="/System/Library/Fonts/Supplemental/Arial Italic.ttf"

PAR=4   # concurrent encodes for batch mode

# --- helpers ---------------------------------------------------------------
_round() { awk -v x="$1" 'BEGIN{printf "%d", (x<0?x-0.5:x+0.5)}'; }
_atleast1() { awk -v x="$1" 'BEGIN{v=(x<1?1:x); printf "%d", v+0.5}'; }

# echo "W H" coded video dimensions of $1
_dims() {
  local vline res
  vline=$(ffmpeg -i "$1" -hide_banner 2>&1 | grep -m1 "Video:")
  res=$(printf '%s' "$vline" | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1)
  printf '%s %s' "${res%x*}" "${res#*x}"
}

_has_audio() { ffmpeg -i "$1" -hide_banner 2>&1 | grep -q "Audio:" && echo 1 || echo 0; }

# echo the -vf drawtext filter string for a given WxH
_filter() {
  local W="$1" H="$2" s fs sx
  s=$(awk -v w="$W" -v h="$H" 'BEGIN{m=(w<h?w:h); printf "%.5f", m/1080.0}')
  if [ "$H" -gt "$W" ]; then
    # VERTICAL — two BOLD lines low in frame, white 92%, soft shadow
    fs=$(_round "$(awk -v s="$s" 'BEGIN{print 40*s}')")
    sx=$(_atleast1 "$(awk -v s="$s" 'BEGIN{print 2*s}')")
    local y1 y2
    y1=$(_round "$(awk -v H="$H" -v s="$s" 'BEGIN{print H-150*s}')")
    y2=$(_round "$(awk -v H="$H" -v s="$s" 'BEGIN{print H-98*s}')")
    printf "drawtext=fontfile='%s':text='%s':fontcolor=white@0.92:fontsize=%s:x=(w-text_w)/2:y=%s:shadowcolor=black@0.6:shadowx=%s:shadowy=%s," \
      "$FONT_BOLD" "$DISCLAIMER_L1" "$fs" "$y1" "$sx" "$sx"
    printf "drawtext=fontfile='%s':text='%s':fontcolor=white@0.92:fontsize=%s:x=(w-text_w)/2:y=%s:shadowcolor=black@0.6:shadowx=%s:shadowy=%s" \
      "$FONT_BOLD" "$DISCLAIMER_L2" "$fs" "$y2" "$sx" "$sx"
  else
    # HORIZONTAL (or square) — one regular-italic line across the very bottom, white 60%, no box
    fs=$(_round "$(awk -v s="$s" 'BEGIN{print 27*s}')")
    sx=$(_atleast1 "$(awk -v s="$s" 'BEGIN{print 1*s}')")
    local y
    y=$(_round "$(awk -v H="$H" -v s="$s" 'BEGIN{print H-42*s}')")
    printf "drawtext=fontfile='%s':text='%s':fontcolor=white@0.92:fontsize=%s:x=(w-text_w)/2:y=%s:shadowcolor=black@0.6:shadowx=%s:shadowy=%s" \
      "$FONT_REG" "$DISCLAIMER_FULL" "$fs" "$y" "$sx" "$sx"
  fi
}

# burn one video: _burn <src> <out>
_burn() {
  local src="$1" out="$2" W H vf
  [ "$src" = "$out" ] && { echo "REFUSE (in==out) $src"; return 1; }
  read -r W H < <(_dims "$src")
  [ -z "$W" ] || [ -z "$H" ] && { echo "FAIL (no dims) $src"; return 1; }
  vf=$(_filter "$W" "$H")
  mkdir -p "$(dirname "$out")"
  if [ "$(_has_audio "$src")" = "1" ]; then
    ffmpeg -y -i "$src" -hide_banner -loglevel error -vf "$vf" \
      -map 0:v:0 -map 0:a:0 -threads 4 -c:v libx264 -crf 18 -preset medium \
      -pix_fmt yuv420p -c:a copy -movflags +faststart "$out"
  else
    ffmpeg -y -i "$src" -hide_banner -loglevel error -vf "$vf" \
      -map 0:v:0 -threads 4 -c:v libx264 -crf 18 -preset medium \
      -pix_fmt yuv420p -movflags +faststart "$out"
  fi
}
export -f _burn _filter _dims _has_audio _round _atleast1
export FONT_BOLD FONT_REG DISCLAIMER_FULL DISCLAIMER_L1 DISCLAIMER_L2

# --- preview mode ----------------------------------------------------------
if [ "${1:-}" = "--preview" ]; then
  SRC="$2"; OUT="$3"; T="${4:-6}"
  read -r W H < <(_dims "$SRC")
  VF=$(_filter "$W" "$H")
  mkdir -p "$(dirname "$OUT")"
  ffmpeg -y -ss "$T" -i "$SRC" -frames:v 1 -vf "$VF" "$OUT" -hide_banner -loglevel error \
    && echo "PREVIEW ${W}x${H} -> $OUT" || echo "PREVIEW FAILED $SRC"
  exit $?
fi

# --- main ------------------------------------------------------------------
IN="${1:?usage: add_disclaimer.sh <input> <output>}"
OUT="${2:?usage: add_disclaimer.sh <input> <output>}"

if [ -f "$IN" ]; then
  if _burn "$IN" "$OUT"; then echo "OK   $IN"; else echo "FAIL $IN"; exit 1; fi
elif [ -d "$IN" ]; then
  SRCROOT="${IN%/}"; DESTROOT="${OUT%/}"
  export SRCROOT DESTROOT
  BATCH_LOG=$(mktemp /tmp/add_disclaimer_batch.XXXXXX)
  find "$SRCROOT" -type f \( -iname '*.mp4' -o -iname '*.mov' \) -print0 \
   | xargs -0 -P "$PAR" -n 1 bash -c '
       src="$0"; rel="${src#'"$SRCROOT"'/}"; out="'"$DESTROOT"'/${rel}"
       out="${out%.*}.mp4"
       if _burn "$src" "$out"; then echo "OK   $rel"; else echo "FAIL $rel"; fi' | tee "$BATCH_LOG"
  # --- G1/G6 gate: this is a COMPLIANCE re-export — tally, verify counts, refuse on any FAIL ---
  N_IN=$(find "$SRCROOT" -type f \( -iname '*.mp4' -o -iname '*.mov' \) | wc -l | tr -d ' ')
  N_OK=$(grep -c '^OK' "$BATCH_LOG" || true)
  N_FAIL=$(grep -c '^FAIL' "$BATCH_LOG" || true)
  rm -f "$BATCH_LOG"
  if [ "$N_FAIL" -gt 0 ] || [ "$N_OK" -ne "$N_IN" ]; then
    echo "❌ batch NOT verified: $N_OK/$N_IN burned, $N_FAIL FAIL — missing disclaimers may NOT ship. Fix + re-run."
    exit 1
  fi
  echo "✓ batch VERIFIED $N_OK/$N_IN burned, 0 FAIL"
else
  echo "input not found: $IN"; exit 1
fi
