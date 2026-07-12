---
name: watch-video
description: "Let Claude ACTUALLY WATCH a video — real frames + audio, not stills — by delegating to Google Gemini's native video understanding. This is the QC sense PFM lacked: single-frame renders and audio-qc can't see MOTION, so questions like 'do the lips move while they listen?', 'does the retime stutter?', 'is there a screen in the background?', 'is there music under the dialogue?', 'is the lip-sync off?' always got handed back to the editor to scrub. Now Claude watches. Use when an editor says 'watch this clip', 'can you actually watch the video', 'does the mouth move', 'check the motion', 'watch it and tell me', 'QC the video visually', or when a gen/assembly QC needs motion or audio verification a filmstrip can't give. Runs via Bash (scripts/gemini_watch.py); needs a Gemini API key the editor places once. NOT for: audio-physics/dialogue transcription QC (audio-qc — cheaper, no key), still-image review (Read the PNG), or firing gens (higgsfield)."
---

# watch-video — Claude actually watches (Gemini video understanding)

The missing QC sense. `inspect_timeline`/frame renders = stills; `audio-qc` = audio physics + Whisper words. Neither sees **motion**. Gemini's video models process real frames + audio, so Claude can watch a clip and answer motion/audio questions. Built PFM-owned (a script, not a third-party MCP) so it ships through the normal skills channel and runs via Bash with no client restart.

## 🔴 TIER 2 ONLY — never a blanket per-clip pass (locked 2026-07-11, Sam)
PFM generates hundreds of clips/day; a Gemini call per generated clip is disproportionate to signal AND wall-clock (~90% of defects — silent/clipped/no-audio/wrong-words/music — are already caught FREE by `audio-qc`). So this is the **escalation + on-demand lens on top of audio-qc**, run ONLY where it changes a decision:
1. **Escalation** — watch just the clips `audio-qc` FLAGGED (`--files <those paths>`). Physics narrows hundreds → a handful; Gemini confirms the motion/on-screen thing physics can't see. `audio-qc` offers this at the end of its report.
2. **Named concern** — "check the R-series mouths", "any screens in the background", "is the lip-sync off" (`--preset` or `--ask`).
3. **Final picks** — watch the few takes the editor CHOSE before turn-in, not the pool they generated.
4. **Sample** — `--sample N` watches N random from a big batch as a spot-check, never all.
Cost stays proportional to decisions (cents/day), not clip count. audio-qc stays the automatic Tier-1 gate; this never runs automatically on a whole batch.

## The key — SHARED PowerFox key (team, locked 2026-07-11)
The whole team accesses ONE shared PowerFox Gemini key (project billing on the PowerFox Google account), placed at `~/.claude/.gemini_key` on each editor's machine (0600). This is a SECRET — distributed manually/securely, NOT through `x.sync` (which syncs skills, never keys). The script reads the file; Claude never handles the plaintext (a key pasted into chat is exposed — rotate it).
- Verify wiring, no spend: `python3 ~/.claude/skills/watch-video/scripts/gemini_watch.py --check`
- Setup gotchas the maiden run hit (07-11): the key's Google project needs the **Generative Language API enabled** (403 "API not used/disabled" → enable at console) AND **billing attached** (429 "quota" until then — consumer "Ultra" ≠ API quota; prepaid balance works fine). Model names use the **`-latest` aliases** (`gemini-pro-latest`/`gemini-flash-latest`) so they never go stale when Google rotates the lineup (hardcoded `gemini-3-pro`/`gemini-2.0-flash` 404'd mid-test).

## Use
```bash
# one clip, targeted question
python3 ~/.claude/skills/watch-video/scripts/gemini_watch.py --video "/abs/clip.mp4" --ask "your question"
# preset QC lens
python3 .../gemini_watch.py --video "/abs/clip.mp4" --preset mouth-hold
# escalation — watch exactly the clips audio-qc flagged
python3 .../gemini_watch.py --files "/abs/L23.mp4" "/abs/L11.mp4" --preset lipsync
# spot-check a big batch (N random, NOT all)
python3 .../gemini_watch.py --folder "/abs/dir" --sample 6 --preset describe
# named-glob batch
python3 .../gemini_watch.py --folder "/abs/dir" --glob "*R*.mp4" --preset mouth-hold
```
**Presets:** `mouth-hold` (lips move while listening?) · `retime` (playback stutter/judder?) · `screen-bg` (screen/TV in background?) · `music` (music under speech?) · `lipsync` (lips vs audio drift?) · `describe` (second-by-second). **Modes:** `--video` one · `--files` explicit set (escalation) · `--folder [--glob] [--sample N]` batch/spot-check.

Each answer starts YES/NO + timestamps by design, so Claude can act on it. Model auto-falls-back best→older via `-latest` aliases if one 404s. **Proven (maiden 07-11):** on `qvc_live_houston_Rlisten_F3a_v02.mp4` + `mouth-hold`, gemini-pro-latest returned `YES — 0:02-0:05: the man silently mouths words while the woman is speaking` — the exact R-series defect, unverifiable headless before, for ~a penny.

## Composition: audio-qc (Tier 1, auto/free) → watch-video (Tier 2, on-demand)
`audio-qc` runs automatically on every batch and catches the physics/words/music defects free. When it flags clips, it offers to escalate JUST those to a watch (`--files` the flagged set). watch-video also runs standalone on a named concern, the final picks, or a `--sample`. It is NOT the motion engine "for every clip" — see the Tier-2 lock above.

## Files
- `scripts/gemini_watch.py` — the whole tool (upload → wait ACTIVE → ask → answer; key from file/env; presets; folder batch; model fallback).
