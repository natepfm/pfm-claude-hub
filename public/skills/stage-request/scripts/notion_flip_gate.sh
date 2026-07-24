#!/usr/bin/env bash
# notion_flip_gate.sh — G4 PostToolUse hook (added 07.17.26).
# Fires after any Notion page update. If the write touched the Asset Gen property,
# inject a MANDATORY re-fetch-verify instruction into Claude's context at exactly
# the moment it matters — Notion property writes can return success yet silently
# no-op (observed 2026-06-10), and an unverified flip is the double-fire /
# never-armed failure class. Ships fleet-wide inside the stage-request skill.
INPUT=$(cat)
if printf '%s' "$INPUT" | grep -q '"Asset Gen"'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"🔴 G4 NOTION-FLIP GATE: that write touched the **Asset Gen** property. MANDATORY before proceeding: re-fetch the page NOW and confirm the value actually stuck (property writes can silently no-op). State the verified value in your next message ('flip verified: <value>'). If it did not stick: re-write + re-verify. Never report an arming/claim/delivery on an unverified flip."}}
EOF
fi
exit 0
