---
name: ag.accentfix
description: >-
  Lock a character's ACCENT deterministically when Veo won't hold it: clone an ElevenLabs voice
  from the editor-approved accented takes (30s+ floor), TTS every failing line, lipsync onto the
  existing Veo picture via sync_so, landing as the next vN. Use on: "accent fix", "the accent
  isn't holding", "run the accent pipeline", "the accent keeps dropping", "accent voice swap".
---

# ag.accentfix — deterministic accent repair (TTS + lipsync)

## STATUS: built 2026-07-29 from Kaylee B's board proposal (proven run 07.28.26, Ravi Desai / Home Best State Podcast — 25 clips, 1,015 cr, 25/25 verified).

Veo cannot be prompted into holding a heavy accent. This skill stops the re-roll loop: take the
takes where the accent **did** land, clone a voice off them, TTS the failing lines in that voice,
and re-drive the existing picture's mouth with `sync_so`. The picture is kept; only the voice is
replaced. Every result lands as the next `vN` beside its prior take.

---

## 🔴 LAWS — read before anything fires

1. **TTS, never STS.** Speech-to-speech preserves the source's articulation, and *articulation IS
   the accent* — STS on an accentless take returns an accentless take in a new timbre. This is
   proven, not theoretical. Every line in this pipeline is synthesized fresh from text.
2. **The EDITOR's ear decides which takes hold the accent** — never your own read of a clip, never
   a QC tool's. You ask; they answer; that answer is the clone pool.
3. **≥30s of confirmed-accented audio is the clone floor.** An 8s single-take clone failed the
   editor's ear; the 104s / 13-take clone passed. `accent_voice.py pool` refuses below 30s.
4. **Two mandatory editor gates, both before spend:** (a) the **clone control test** — TTS the
   approved take's own line and A/B it against the original; (b) the **one-clip pipeline proof** —
   one real clip through sync_so, editor passes it, *then* the batch. Never batch on an unproven
   voice. `accent_voice.py sync` refuses a batch with no recorded proof.
5. **Never overwrite / rename / relocate a prior take.** Every result is the next `vN` in the
   clip's existing folder, prior takes untouched and where they were (house law, locked 07-17).
   The script refuses to write over an existing path.
6. **Rule 1 / 3 / 5 all apply** — `sync_so` is a credit-spending fire. A batch ≥20 clips needs the
   full preflight + Fire? card before spend. Stream each result the instant it lands.
7. **Digits get naturalized for the TTS text only** (per `wr.numbers` — `$369` → "three sixty
   nine"). The dialogue manifest keeps its digits. A wordy dollar read can blow an 8s clip by 4s.

---

## 🔴 What does NOT work — do not re-spend on these (~1,000 cr of proven dead ends, 07.28.26)

- **Prompt-level accent specs cap at ≈50% per take** on `veo3_1_lite`, even maximal ones
  (syllable-timing, retroflex T/D, tapped R, V/W softening, rising intonation). It is variance,
  not prompt quality. Rewriting the spec again is not the lever.
- **Full `veo3_1` (preview, quality high) is no better** — same accent drop at 2× the cost.
- **Token-targeted "anchor" language makes it WORSE.** Telling Veo the accent must hold "on the
  state name and the number" dropped the hit rate from ~50% to **11.5%** (measured, 26 clips) —
  Veo over-articulates the named tokens in clean neutral American.
- **Passing an approved take as `--video` reference is accepted but does NOT transfer voice.**
- **ElevenLabs STS cannot fix an accentless take** (see Law 1).
- **A clone from <30s of audio loses the accent** (see Law 3).
- **Line density is NOT the cause** — trimming lines did not fix the accent. Keep the request's
  copy verbatim; do not "fix" the script.
- **Metadata leakage hazard (Veo side):** never ship a master-prompt JSON's bookkeeping fields
  (`derived_from`, `notes`, `voice_lock`, `status`, `aspect`, `fire`…) as prompt text — Veo reads
  everything as prompt, and sibling character names in those fields read as *voice direction*.
  Send generative keys only: `shot_type, scene, character, dialogue, voice, audio, camera,
  lighting, duration, negative_prompt`.

---

## The pipeline

**1 — Collect the accent-passed takes.** Ask the editor which takes hold the accent. Need ≥30s
total; more is better. Put the strongest/approved take first — it anchors the clone.

**2 — Build the pool** (extract → mono 44.1k → concat, with the 30s floor enforced):

```bash
python3 ~/.claude/skills/ag.accentfix/accent_voice.py pool \
  --takes "<approved take 1.mp4>" "<take 2.mp4>" ... \
  --out ~/scratch/<char>_pool.wav
```

**3 — Clone** (ElevenLabs instant voice cloning; key from `~/.claude/.elevenlabs_key`):

```bash
python3 ~/.claude/skills/ag.accentfix/accent_voice.py clone \
  --pool ~/scratch/<char>_pool.wav --name "<Character> v<N> - <basis> pool"
```

Delete failed clones — keep the workspace clean.

**4 — Control test (MANDATORY).** TTS the approved take's own line in the clone; editor A/Bs it
against the original. Failure modes and their fixes:
- *"right accent, wrong person"* → try a native-accent **library** voice instead of the clone.
- *"no accent"* → the source pool is weaker than believed; re-pick takes with the editor.

```bash
python3 ~/.claude/skills/ag.accentfix/accent_voice.py tts \
  --voice-id <id> --text "<the approved take's own line>" --out ~/scratch/control.mp3
```

**5 — TTS every failing line** and measure each duration. Naturalize digits first (Law 7).

```bash
python3 ~/.claude/skills/ag.accentfix/accent_voice.py tts \
  --voice-id <id> --manifest <lines.json> --outdir ~/scratch/tts/
```
Passing settings: `eleven_multilingual_v2`, stability 0.5, similarity_boost 0.95, style 0.25,
speaker_boost on.

**6 — Pick each clip's video base:** the newest take at the project's **delivered** quality (match
the approved gen, e.g. Lite 1280×720 — do not upgrade resolution unless asked). The base take's
spoken words don't matter; the mouth gets re-driven.

**7 — Lipsync via `sync_so`.** The script plans, gates, and fires:

```bash
# plan only — prints the preflight (durations, sync_mode per clip, flags, cost) and fires nothing
python3 ~/.claude/skills/ag.accentfix/accent_voice.py sync --pairs <pairs.json>
# after the editor passes the one-clip proof AND confirms Fire?:
python3 ~/.claude/skills/ag.accentfix/accent_voice.py sync \
  --pairs <pairs.json> --proof-passed "<proof clip name>" --fire      # add --preflight-ok if ≥20
```

`sync_mode`: **`silence`** when audio ≤ clip length (pads the tail), **`bounce`** when slightly
over (stretches video). Anything **>10s over** is FLAGGED for a human call, never auto-fired.
~40–90 cr/clip.

**8 — Land + verify.** Next `vN` in the clip's existing state folder. Verify by disk count +
ffprobe (duration / audio / resolution), reconcile spend by balance delta.

---

## Inputs — what changes each run

- The character + which takes the editor passed as accented (the clone pool)
- The fail list (clip filenames needing the swap)
- The dialogue manifest (verbatim lines per clip)
- The delivered video quality to match (e.g. Lite 1280×720)
- Voice-setting tweaks if the control test asks for them

## Outputs + naming

- ElevenLabs voice: `<Character> v<N> - <basis> pool`
- Swapped clips: `<Char>_<Line>_<State/Shared>_16x9_v<NN>.mp4` — next `vN` in the clip's existing
  folder under `Elements/Footage/Veo/<State>/`
- TTS staging + plan json in the session scratchpad, **never** the project folder

## Handoff

Every delivery carries 📁 Path + 🔗 Open on the **containing folder**, 🦊 FoxView rail drop, and a
📲 Tappable per asset shown — plus the widget review. A 📲 never stands alone.

## Gotchas

- `sync_so`'s **cost endpoint is broken** (contradictory param errors) — price via balance delta on
  the first real clip.
- `--video` / `--audio` CLI media flags are **REJECTED** by sync_so; only the JSON object params
  work (the script builds them).
- TTS length varies per line — always measure before choosing sync_mode.
- Bounce-mode clips stretch the video slightly — spot-check their tails.
- The clone is **reusable across sibling projects** sharing the character (e.g. an Auto sibling) —
  build once, reuse. Name it so that's obvious.
- ElevenLabs quota: the limit that bites is the **workspace group's shared allocation** (10,000),
  not the plan balance and not a per-key cap. Minting a new key does not fix it; raising the group
  allocation does.

## Cross-references

`wr.numbers` (digit naturalization) · `qc.g` / `watch-video` (editor-invoked lip-sync check).

## Not for

NOT for: swapping a voice's timbre on a clip whose read is already right, fixing lip-sync on
unchanged audio, dubbing to another language, or rewriting the script to dodge the accent problem
(proven not to be the cause).
