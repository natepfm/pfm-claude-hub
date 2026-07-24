#!/usr/bin/env bash
# download_parallel.sh — parallel download of Veo clips from Higgsfield results JSONs.
#
# Reads <slug>.json files from /tmp/hvg-flow-results/ (one per fired clip).
# For state-tagged slugs (e.g. cybertruck_state_b1_FL_L02_v01), auto-routes
# into a per-state subfolder inside the Veo dir.
#
# Args:
#   $1 = VEO_DIR (e.g. "Elements/Footage/Veo")
#   $2... = slug list (space-separated), e.g. "denied_car_loan_L01_v01 denied_car_loan_L01_v02"
#
# Usage from hvg-flow gate 10:
#   bash ~/.claude/skills/hvg-flow/download_parallel.sh \
#     "Elements/Footage/Veo" \
#     denied_car_loan_L01_v01 denied_car_loan_L01_v02 denied_car_loan_L02_v01 ...

set -u

VEO_DIR="$1"
shift
SLUG_VARS=("$@")

if [ ${#SLUG_VARS[@]} -eq 0 ]; then
  echo "ERROR: no slugs provided"
  echo "Usage: $0 <veo_dir> <slug1> [slug2 ...]"
  exit 1
fi

mkdir -p "$VEO_DIR"

for SLUG_VAR in "${SLUG_VARS[@]}"; do
  # If slug contains a 2-letter state token (e.g. cybertruck_state_b1_FL_L02_v01),
  # extract it and route into the per-state subfolder.
  STATE_ABBR=$(echo "$SLUG_VAR" | grep -oE '_[A-Z]{2}_L[0-9]+' | head -1 | grep -oE '[A-Z]{2}')

  if [ -n "$STATE_ABBR" ]; then
    OUT_DIR="$VEO_DIR/$STATE_ABBR"
    mkdir -p "$OUT_DIR"
  else
    OUT_DIR="$VEO_DIR"
  fi

  RESULT_JSON="/tmp/hvg-flow-results/${SLUG_VAR}.json"
  if [ ! -f "$RESULT_JSON" ]; then
    echo "FAILED: ${SLUG_VAR} (no result file at $RESULT_JSON)"
    continue
  fi

  URL=$(jq -r '.[0].result_url' "$RESULT_JSON")
  if [ "$URL" != "null" ] && [ -n "$URL" ]; then
    curl -sSL "$URL" -o "$OUT_DIR/${SLUG_VAR}.mp4" -w "${SLUG_VAR}: %{http_code}\n" &
  else
    echo "FAILED: ${SLUG_VAR} (no result_url in JSON)"
  fi
done
wait

# --- G1 gate: verify every expected mp4 actually landed (no silent shortfall) ---
MISSING=0
for SLUG_VAR in "${SLUG_VARS[@]}"; do
  STATE_ABBR=$(echo "$SLUG_VAR" | grep -oE '_[A-Z]{2}_L[0-9]+' | head -1 | grep -oE '[A-Z]{2}')
  if [ -n "$STATE_ABBR" ]; then OUT_DIR="$VEO_DIR/$STATE_ABBR"; else OUT_DIR="$VEO_DIR"; fi
  F="$OUT_DIR/${SLUG_VAR}.mp4"
  if [ ! -f "$F" ] || [ "$(stat -f%z "$F" 2>/dev/null || echo 0)" -lt 10000 ]; then
    echo "MISSING: ${SLUG_VAR} (expected $F)"
    MISSING=$((MISSING+1))
  fi
done

TOTAL=${#SLUG_VARS[@]}
if [ "$MISSING" -gt 0 ]; then
  echo "❌ download_parallel.sh: $((TOTAL-MISSING))/$TOTAL landed — $MISSING missing (listed above). NOT done."
  exit 1
fi
echo "✓ download_parallel.sh VERIFIED $TOTAL/$TOTAL on disk"
