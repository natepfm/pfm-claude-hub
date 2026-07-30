#!/usr/bin/env python3
"""RETIRED 2026-07-30 — clip firing moved to ag.clip.flow.

Two fire_clip.py files with the same name and different laws is the fragmented-canon
failure this system exists to prevent. The canonical clip stage is now:

    ~/.claude/skills/ag.clip.flow/scripts/fire_clip.py

It carries laws this copy never had: shot-level audio, deliberate genre, a real
multishot gate, 4-15s duration validation, explicit bitrate, output to
Elements/Footage/Seedance, fired_pending_qc instead of a terminal "fired",
an auto-appended TIMING block with a duration refusal when a line cannot fit,
a native-stills anchor refusal (a frame extracted from compressed video is a
generational copy and shows visible mottle), reason-coded verdicts, cost quotes,
and JSON sidecars.

The original of this file is preserved at
~/.claude/_backups/fire_clip.py.scene-flow-retired-073026
"""
import sys

print("REFUSED: this fire_clip.py is RETIRED (2026-07-30). Clip firing lives in ag.clip.flow:\n"
      "    python3 ~/.claude/skills/ag.clip.flow/scripts/fire_clip.py <bible> --shot <ID>\n"
      "That version enforces shot-level audio, duration validation, the multishot gate,\n"
      "native-stills anchoring, fired_pending_qc, cost quotes and sidecars. Use it.")
sys.exit(1)
