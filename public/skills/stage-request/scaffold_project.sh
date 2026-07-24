#!/usr/bin/env bash
# scaffold_project.sh — create a new PFM project folder with the FULL canonical folder template,
# every folder present even if empty. Mirrors the reference project "[Template] 06.00.26 - Name".
#
# Idempotent (mkdir -p): safe to run on an existing project to BACKFILL any missing folders —
# it never touches or overwrites anything already there.
#
# Usage: bash scaffold_project.sh "<absolute project folder path>"
set -e
DEST="${1:?usage: scaffold_project.sh \"<absolute project folder path>\"}"

mkdir -p \
  "$DEST/Creatives" \
  "$DEST/Creatives/Timelines" \
  "$DEST/Elements/Audio/Music" \
  "$DEST/Elements/Audio/SFX" \
  "$DEST/Elements/Audio/VO" \
  "$DEST/Elements/Footage/B-Roll" \
  "$DEST/Elements/Footage/Primary" \
  "$DEST/Elements/Footage/Reference" \
  "$DEST/Elements/Footage/Veo" \
  "$DEST/Elements/Graphics" \
  "$DEST/Elements/Prompts"

echo "✓ scaffolded full PFM template ($(find "$DEST" -type d | wc -l | tr -d ' ') folders) at:"
echo "  $DEST"
