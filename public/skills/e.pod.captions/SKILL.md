---
name: e.pod.captions
description: "PFM podcast caption engine (9:16 + 16:9, auto-detected) — take a finished exported creative (Palmier or DaVinci, no captions) and burn house-style captions onto it: Whisper word timestamps → 22-char single-line ALL-CAPS yellow-on-black chunks in Proxima Nova Black, pause-accurate, sentence-aware. Outputs burned mp4 + ProRes 4444 alpha overlay + editable SRT. Use when an editor says 'caption this', 'add captions', 'run the caption engine', 'podcast captions', or hands over an exported podcast creative that needs captions. Handles BOTH aspects — auto-detects orientation and applies the right calibrated preset. NOT for: DaVinci-native subtitles (/e.subs), writing scripts, or text hooks (e.pod.hooks)."
---

# e.pod.captions — PFM Podcast Caption Engine (9:16 + 16:9)

Born 07-22/23 from the Palmier eval's #1 gap (no editor-grade caption engine in Palmier) and
Sam's directive: *"take videos that I export out of Palmier and just caption them in our style,
as accurate as possible."* Proven on the full 6:22 DaughterRanOverFerrari export (373 captions).

## LOCAL-ONLY (Sam's machine) until sign-off. Both aspects live (Sam approved 9:16 + 16:9, 07-23).

Presets auto-select by orientation — both calibrated pixel-exact against real DaVinci exports:
- **9:16** (1080x1920): mid-frame box (top y=1008), 62.5px, 22-char lines, ls .5
- **16:9** (1920x1080): lower-third box (top y=693), 48px, 42-char lines, ls 2.4
  (fill y 704-736 + x-span verified against the MomRan Colorado export)
**16:9 creatives get NO text hook** (Sam, 07-23) — captions only; e.pod.hooks is 9:16-only.

## What it does

Input: a finished exported creative WITHOUT captions (Palmier or DaVinci export, 1080x1920/24).
Output (lands next to the input unless `--outdir`):
- `<name> - CAPTIONED.mp4` — captions burned, audio untouched
- `<name> - CAPTIONS ALPHA.mov` — the caption layer alone on transparency (ProRes 4444) —
  drops onto a DaVinci timeline above the cut
- `<name>.srt` — the same chunks as an editable DaVinci subtitle import (the "I want to
  tweak them by hand" path)
  🔴 The SRT is a WORKING artifact — write it to a scratch/work dir, NOT into the delivered
  `Creatives/` folder. SRTs are NOT submitted when a project is reported (Sam, 07-23).

## Run

```bash
python3 ~/.claude/skills/e.pod.captions/scripts/caption_video.py "<video>" \
    [--outdir DIR] [--model small.en] [--max-chars 22] [--alpha] [--fix ants=aunts]
```

Background it (a 6-min video ≈ **4-5 min wall**, and ~3 of that is transcription — captions
render batched, ~40 per Chrome launch, ~40s total; encode ~1.5 min). `--alpha` (ProRes 4444
overlay layer) is OFF by default — request it only when the editor wants the DaVinci layer;
it adds ~2 min + ~1GB. The workdir caches `words.json` + caption PNGs — re-runs only
re-render what changed (delete a cap_NNN.png to force it).

## The locked rules (don't re-derive; they were fought for)

**Style — sampled/calibrated against real DaVinci exports (TeenForced V2 + MomRanOverFerrari):**
ALL-CAPS, yellow `#FCE300`, black box at 60% opacity, snug padding (8/24/13/24), Proxima Nova
Black, font 62.5px, box top y=1008 (mid-frame, NOT lower-third), single line, `white-space:
nowrap` (a caption can NEVER wrap or exceed the frame — that was Sam's v2 complaint).

**Chunker:** greedy fill to 22 chars max; **a sentence end always closes the chunk** (orphan
tails like "LIKE." dragging the next caption early was Sam's flagged defect); captions hold
≤0.6s into a pause then drop; the next caption pops **exactly on its first word's Whisper
timestamp** (the "comes on the 'my'" rule, 07-22). Whisper's `Mm` + `-hmm` token split is
rejoined. Digits stay digits ("TURNED 16.") — matches house convention.

**Accuracy:** Whisper `small.en` (better than base; both cached locally). Number tokens are
normalized: `"$5" + ",000"` splits rejoin to `$5,000` (no space before a comma, ever), and
`Mm`+`-hmm` rejoins. **Transcript QC is part of the run:** skim the chunks.json (or the SRT)
for homophones and odd words — Whisper heard "ants" for "aunts" on DaughterFerrari — and fix
via `--fix ants=aunts` (repeatable; word-boundary, case-insensitive), then re-render just the
affected cap PNGs. When the creative has a dialogue manifest, diff the transcript against it —
that's the ground truth for names and numbers.

**Font (fixed 07-23):** REAL Proxima Nova Black, installed to `~/Library/Fonts` from the PFM
library at `/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/Fonts - PFM/Proxima Nova`
(`fonnts.com-Proxima_Nova_Black.otf` + `fonnts.com-ProximaNova-Black.ttf`). CSS family stack:
`'Proxima Nova Bl','ProximaNova-Black','Proxima Nova'`, weight 900. On a machine missing the
font, copy those two files from that Lucid folder first — the earlier Fontspring-DEMO install
watermarked `' - " ! $ % & ( ) /` and the digit `4`, so a wrong-font render is visibly wrong;
the retired substitution map lives in this file's history if ever needed.

## Verify before handing off (DONE = a check passed)

1. Extract 2-3 frames at caption times (`ffmpeg -ss T -frames:v 1`) — style + no DEMO splat.
2. Check one pause boundary: mid-pause frame has NO caption; next caption starts on its word.
3. Alpha stream really has alpha: `ffmpeg -i` shows `yuva444p`.
Full handoff: 📁 + 🔗 (+ 🦊 on delivery) + 📲 CloudFront of the burned mp4 (upload a
phone-sized re-encode if the full file times out).

## Pairs with

- **e.pod.hooks** — the text-hook overlay (separate skill; run it on the CAPTIONED output).
- **/e.subs** — DaVinci-native captions; use the `.srt` this skill emits when the editor
  wants hand-editable captions instead of burned ones.
- **lctovid-podcast-palmier / p.export** — produce the export this skill captions.
