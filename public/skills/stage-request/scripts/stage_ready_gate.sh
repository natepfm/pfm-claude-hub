#!/usr/bin/env bash
# stage_ready_gate.sh — G7 PreToolUse hook (added 07.17.26).
# BLOCKS any Notion write that sets Asset Gen → Ready unless the stage-request
# Step 5.9 fresh-context verifier passed recently (marker ~/.claude/.stage_verified,
# valid 45 min). Arming an unverified stage to the mini is the 84-wrong-clips
# failure class — the verifier exists precisely because the stager can be wrong.
# On PASS the verifier (or the editor's explicit override) touches the marker:
#   touch ~/.claude/.stage_verified
INPUT=$(cat)
if printf '%s' "$INPUT" | grep -q '"Asset Gen"' && printf '%s' "$INPUT" | grep -q '"Ready"'; then
  M="$HOME/.claude/.stage_verified"
  if [ -f "$M" ]; then
    AGE=$(( $(date +%s) - $(stat -f%m "$M" 2>/dev/null || stat -c%Y "$M" 2>/dev/null || echo 0) ))
    if [ "$AGE" -le 2700 ]; then
      exit 0
    fi
  fi
  echo "G7 STAGE-READY GATE: blocked Asset Gen → Ready. The Step 5.9 fresh-context verifier has not passed in the last 45 min. Run the verifier subagent on this stage (it must return PASS), then: touch ~/.claude/.stage_verified ; and retry the flip. Never arm an unverified stage." >&2
  exit 2
fi
exit 0
