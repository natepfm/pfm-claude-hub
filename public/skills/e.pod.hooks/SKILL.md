---
name: e.pod.hooks
description: "PFM podcast text-hook overlay (9:16) — burn the house text hook onto a finished podcast creative. Locked text rule: Broad = 'DO NOT OWN A CAR IN / AMERICA', state variant = 'DO NOT OWN A CAR IN / <STATE>'. Style measured pixel-exact from the Car Chase Podcast V1 exports (red+white line 1, giant yellow width-locked line 2, Proxima Nova Black). Hook ends at the edit's first b-roll cut (auto-detected). Use when an editor says 'add the text hook', 'hook this', 'podcast text hooks', 'add the DO NOT hook', or after e.pod.captions on a creative that needs its hook. 9:16 ONLY for now. NOT for: captions (e.pod.captions), breaking-news chyrons, or writing hook copy."
---

# e.pod.hooks — PFM Podcast Text Hooks (9:16)

Split from the caption engine at Sam's direction (07-23): captions and hooks are two skills.

## LOCAL-ONLY (Sam's machine) until sign-off. 9:16 ONLY — **16:9 creatives get NO text hooks at all** (Sam, 07-23); this skill never runs on landscape cuts.

## 🔴 The locked text rule (Sam, 07-23)

- **Broad** → line 1 `DO NOT OWN A CAR IN`, line 2 `AMERICA`
- **State variant** → line 1 `DO NOT OWN A CAR IN`, line 2 `<STATE NAME>` (FLORIDA, TEXAS, …)

Line 2 (the state) fills a fixed TARGET width by **scaling FONT SIZE**, keeping natural
letter proportions — NEVER by `textLength`/glyph stretch (Sam, 07-23, escalated: "just
change the font size to make it fit"). Short states (TEXAS) render big, long states
(PENNSYLVANIA) render smaller, both the same width, none distorted. Target width 1000px,
line-2 vertical center y=399, max font 210px — measured from the state-hook reference set.
Width is measured with PIL `ImageFont.getbbox` on the real Proxima otf, then font scaled.

## 🔴 The hold rule (Sam, 07-23)

**The hook ends when the first b-roll image appears** — the edit's first hard cut. The script
auto-detects it (ffmpeg scene>0.25, verified: Car Chase Broad detected 6.34s vs the real
~6.3s drop). **Open question:** a creative that OPENS on b-roll detects a cut almost
immediately (DaughterFerrari: 1.62s) — the script prints a ⚠ when the cut is <3s; ASK the
editor and pass `--hold` rather than shipping a blink-hook.

## Style spec (measured from Car Chase Podcast V1, do not re-derive)

- Line 1: font 78px, `textLength` 872, baseline y=290; `DO NOT ` in **#FE2500**, rest white;
  black stroke 10, `paint-order: stroke fill`
- Line 2: **#FDF800** (hook yellow), black stroke 12, font-size-fit to 1000px width
  (natural proportions, NO textLength), TOP-anchored at y=332 (baseline = 332 + 0.691*font) so every state sits the same tight gap under line 1, max font 200
- Font: REAL Proxima Nova Black (installed 07-23 from `1. PFM Media Assets/Fonts - PFM/
  Proxima Nova` on Lucid; stack `'Proxima Nova Bl','ProximaNova-Black','Proxima Nova'`).
  Always QUOTE the family names in the SVG attribute — unquoted names silently fall back
  to serif. On a new machine, copy the Black otf/ttf from that Lucid folder first.

## Run

```bash
python3 ~/.claude/skills/e.pod.hooks/scripts/hook_video.py "<video>" \
    [--state Florida] [--hold 6.5] [--alpha] [--outdir DIR]
```

- Run on the **CAPTIONED output** of e.pod.captions (captions render under the hook, matching
  the references). `--state` defaults to America (Broad).
- `--alpha` also emits the hook layer as ProRes 4444 for DaVinci compositing.
- State batch: loop the state list, one call per state file.

## Verify before handing off

1. Frame at ~1s: hook present, both lines Proxima (serif = font-family quoting broke).
2. Geometry check: short vs long state (TEXAS vs PENNSYLVANIA) fill the SAME width
   at DIFFERENT font sizes, both natural (no stretch). Line-2 x-span ≈ 40-1045.
3. Frame after the detected cut: hook gone.
Full handoff: 📁 + 🔗 (+ 🦊 on delivery) + 📲.

## Pairs with

- **e.pod.captions** — run captions first, then this on its output.
- **lctovid-podcast-palmier / p.export** — the export that gets hooked.
