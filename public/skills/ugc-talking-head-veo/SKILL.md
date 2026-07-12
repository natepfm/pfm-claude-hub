---
name: ugc-talking-head-veo
description: >-
  Write PFM's locked Veo master prompt + dialogue manifest for UGC TALKING-HEAD characters —
  the clip-generation half that consumes a ugc-talking-head-ref hero image. Use when an
  editor has a picked talking-head reference and says "write the veo master", "talking head
  prompts", "build the UGC master prompt", "prep the talking head fire", or a UGC
  character-swap request needs its gen package (master + per-clip dialogue) staged. Encodes
  the locked template (2026-06-11 Finance Bro build): paused-frame scene continuation,
  cold-open mid-sentence performance, voice lock with the clean/dry/close audio spec,
  voice-only audio, full timing+audio+UI negative stack, verbatim dialogue grouped to 6-8s
  clips. NOT for: writing the creative's script (it must already exist — veo-script-writing /
  the request's Copy), generating the reference image (ugc-talking-head-ref), or firing
  batches (hvg-flow / AGF fire the package this skill writes).
---

# UGC Talking-Head Veo Master — the locked template

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Input: a picked hero ref (from `ugc-talking-head-ref`) + a locked script (the request's Copy — the canon). Output: two files in the project's `Elements/Prompts/` that make the creative fire-ready with zero fire-time decisions:

1. `<slug>_dialogue.md` — the per-clip dialogue manifest
2. `<slug>_master.md` — the locked Veo prose master

## File 1 — the dialogue manifest

**The request's Copy is the canonical dialogue source.** Not parent masters, not change logs. Rules:

- **Verbatim, character-for-character** — contractions preserved, phrasing untouched. Spoken brand names in a locked running script stay (note them, don't editorialize).
- **Group source lines into 6–8s clips:** target 17–22 words, hard ceiling 30. Combine ADJACENT short lines without changing a word; split any line over 30 at its sentence break. A short closing line (12–15 words) may stand alone.
- **Permitted mechanical fixes only, each disclosed in the manifest header:** em/en dash → comma (no dashes in Veo lines, ever), ALL-CAPS words → normal case, a/an article fix before swapped values. Nothing else gets "fixed."
- **Out-of-scope flags:** reused clips (e.g. a closer from the OG project) and edit-time variants (text-hook cuts) are named in the header as NOT in gen scope.
- Format, one line per clip: `C<N> · <Character> — "<verbatim dialogue>"`

## File 2 — the Veo master

Swap only `[C{N}]` and `{LINE FROM MANIFEST}` per clip at fire time. Everything else verbatim. (CLI prompts keep the `Veo video prompt: ` prefix — the CLI rejects a leading bracket.)

> Veo video prompt: [C{N}] UGC talking head, vertical video. The [CHARACTER] from the reference image, [one-sentence identity echo matching the ref exactly — age, hair, wardrobe], [WHERE] exactly as in the reference. Locked-off fixed camera at [SURFACE] height slightly below the eye line, framing identical to the reference, no camera movement. He/She is already mid-sentence as the clip opens, first word lands on frame one. High energy, fast confident delivery, animated natural hand gestures, eyes to the lens the whole time.
>
> Dialogue, verbatim, single take: "{LINE FROM MANIFEST}"
>
> Voice: [energetic American male/female, age], [cadence — e.g. bright fast confident finance-influencer cadence], natural lip sync. The voice is clean, dry, and close, fully present with crisp consonants, energetic but controlled, never shouting. Audio is only the speaking voice.
>
> Negatives: silent pre-roll, breath-in pre-roll pause, musical sting before dialogue, score intro, music swell at cold open, background music, sound effects, ambient noise bed, second voice, echo, reverb, room tone bed, muffled voice, distorted audio, audio clipping, hiss, static, hum, plosive pops, mouth clicks, phone visible in frame, recording device in frame, tripod in frame, status bar, record button, app interface, captions, text overlays, watermarks, camera movement, zoom, second person in frame, brand names or logos.

### Why each block is load-bearing (don't trim)

- **"already mid-sentence as the clip opens, first word lands on frame one"** — kills Veo's auto-generated musical intro / breath-in pre-roll. UGC scope: voice only, NO ambient named (naming room tone adds mic/room artifacts; the news-segment rule about needing ambient does NOT apply here).
- **The audio-quality sentence** ("clean, dry, and close… never shouting") — added 2026-06-11: positive spec pushes Veo off its roomy distant render; the energy cap stops hyped delivery from clipping into harshness. Quality words only — never gear words (no "lavalier", no "podcast mic").
- **Artifact negatives** (muffled/clipping/hiss/plosives/mouth clicks) — ban the defects, not just the categories.
- **The visual no-device/no-UI tail** — same rule as the ref skill: named devices render in frame.

## Fire spec (what the package declares)

- `veo3_1_lite` + **`--generate_audio true` ALWAYS** (Lite ships silent without it) · 9:16 · 8s · count=1 per clip · 12 cr/clip
- Ref uploaded serially first → UUID; UUID (never a local path) passed `--image` on every clip; parallel fires within the wave
- **🔴 Hard Rule 5 — stream each clip the INSTANT it lands (batches <20):** the fire mechanism must expose per-clip results as they complete (per-clip backgrounded fires, or a pool reporting via `as_completed` printing each result URL immediately) — each landed clip goes to the editor at once (📲 tappable + widget), BEFORE download/QC/the next clip. Never one silent multi-clip `--wait` shell; never hold clips for a picked set. 20+ clips = one completion report.
- Output `Elements/Footage/Veo/` · `<Character>_C{N}_v01.mp4` · refires are v02+, never overwrite
- **Audio ceiling (A/B-tested 2026-06-11, Young Woman C1–C3):** Lite and `veo3_1` Fast produced the SAME voice quality on this template — do NOT pay the tier premium for audio. Extra voice-anatomy prompt spec showed no clear gain either. Lite + this template's locked audio block IS the prompt-side ceiling; anything better comes from post (Resolve voice isolation/EQ, or ElevenLabs speech-to-speech over the Veo read).

## Where this skill stops

It writes the package and (if the project is AGF-staged) the 🤖 section's Prompts entry. The FIRING is hvg-flow (editor-interactive), AGF (the mini), or stage-request route (b) — never this skill directly.
