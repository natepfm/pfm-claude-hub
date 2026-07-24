---
name: add-ai-disclaimer
description: >-
  Burn the PFM AI-performer disclaimer ("This advertisement contains synthetic performers created
  with artificial intelligence.") onto FINISHED video creatives — a re-export/compliance pass, NOT a
  generation flow. Auto-detects each file's aspect ratio and applies the locked PFM preset
  (2026-06-12): white italic at ~92% opacity with a soft shadow, held the full video duration, below
  any lower-third — VERTICAL 9:16 gets BOLD italic, TWO centered lines (break after "synthetic,"),
  low in frame; HORIZONTAL 16:9 gets regular-weight italic, ONE line across the very bottom strip.
  Re-encodes to clean H.264, copies
  audio untouched, never modifies the source. Use when an editor says "add the AI disclaimer", "add
  the disclaimer", "burn the disclaimer", "AI disclaimer re-export", "add the synthetic-performers
  disclaimer", "disclaimer these clips", "re-export with the disclaimer", or drops a Notion
  "... AI Disclaimer Re-Export" request with the finished cuts on Lucid. Handles a single file or a
  whole folder (batched, structure mirrored). NOT for: generating clips (hvg-flow) or images
  (hig-flow), writing the disclaimer into a NEW creative at assemble time (claude-editor handles
  that), or any edit beyond burning the disclaimer overlay.
---

# add-ai-disclaimer

Burns the PFM **AI-performer disclaimer** onto already-finished video creatives and re-exports them.
This is the tool behind the Car Chase / Car Repo "AI Disclaimer Re-Export" requests (Facebook rejects
the AI news-anchor hook unless the synthetic-performer disclaimer is on screen). It is a **re-export
pass on locked final cuts** — same exact video, the only change is the burned-in disclaimer.

**Locked text (verbatim — never paraphrase):**
> This advertisement contains synthetic performers created with artificial intelligence.

This is the disclaimer REQUIRED for NEW YORK creatives (CLAUDE.md HARD RULE #4 — NY-ONLY scope, corrected 2026-07-17; the burn itself runs on any file the editor asks for, but only NY cuts REQUIRE it). The
**presets below were locked by Sam on 2026-06-12** for the re-export use case — the vertical look is
matched to the **NY credit-debt podcast reference**: **bold** white italic, two centered lines, broken
after "synthetic," ending with the period. (An earlier thin/regular-italic @50% pass was re-burned to
this bold spec.)

## The two locked presets (Sam, 2026-06-12)

The skill reads each file's dimensions and picks the preset automatically — `H > W` → vertical,
`W >= H` → horizontal. All values scale proportionally from a 1080-short-side reference, so they hold
at 720p / 1080p / 4K.

| | **Vertical 9:16** | **Horizontal 16:9** |
|---|---|---|
| Lines | **Two** centered lines | **One** line, full sentence |
| Split | "This advertisement contains synthetic" / "performers created with artificial intelligence." | (single line, full sentence) |
| Position | low in frame — `y = H-150` (L1), `y = H-98` (L2) at 1080w | very bottom strip, below the chyron — `y = H-42` at 1080h |
| Size | `fontsize 40` (×scale) | `fontsize 27` (×scale) |
| Color | white **@0.92** | white **@0.92** |
| Background | none (soft shadow `2px@0.6` for legibility) | **none** (subtle 1px shadow) |
| Font | SF Pro Display **Bold** Italic | SF Pro Display Regular Italic |

Held for the **full video duration**. Why they differ: PFM 9:16 cuts have a dedicated black caption
safe-zone at the bottom (clean two-line drop-in); 16:9 cuts have a persistent full-width LATU chyron
and low captions, so the only clean spot is a single thin line in the strip *below* the chyron block.

## Engine

`add_disclaimer.sh` (in this skill folder) does the detection + burn. Encoding is locked:
`libx264 -crf 18 -preset medium -pix_fmt yuv420p`, audio **copied** if present (no audio → video-only,
no error), data/timecode tracks dropped, `+faststart`. Mixed-codec inputs (H.264 + HEVC) normalize to
one clean H.264 — fine and intended.

```bash
SCRIPT=~/.claude/skills/add-ai-disclaimer/add_disclaimer.sh

# one preview frame (no encode) — use this to get the editor's eyes BEFORE a horizontal batch
bash "$SCRIPT" --preview "<input.mp4>" "/tmp/preview.png" 40

# one video
bash "$SCRIPT" "<input.mp4>" "<output.mp4>"

# a whole folder (recurses, burns every .mp4/.mov, mirrors subfolders into the output dir, 4 parallel)
bash "$SCRIPT" "<input_dir>" "<output_dir>"
```

## Flow

### 1. Intake (silent)
- Resolve the **input** — a Notion "AI Disclaimer Re-Export" request points at the source batches; the
  finished cuts live in the project's `Creatives/` tree on Lucid. Or the editor names a file/folder
  directly. Confirm the path is inside `/Volumes/ads/…`.
- Resolve the **scope** — the request usually says "every vertical (9:16) video" (the FB-rejected feed
  cuts). Filter accordingly (e.g. `*9x16*` only). If it says all orientations, the skill handles both.
- **Inventory it** and surface the count, including any surprises (e.g. broad = 3 hook variants
  H1/H2/H3, not 1 — so "broad + 50 states" is 53 files, not 51). State the real number.

### 2. Output location (NO project-folder scaffolding)
The skill does **NOT** invent a dated project folder — that's the editor's call. Default output is a
sibling folder the editor names, or `<project>/Creatives/AI Disclaimer Re-Export (<orient>)/` mirroring
the source layout. **Never overwrite the source** — the engine refuses if `out == in`. Originals stay
untouched, always.

### 3. Preview gate — horizontal ALWAYS, vertical optional
- **Vertical**: the safe-zone placement is reliable across PFM 9:16 cuts — fine to render one preview
  for sign-off on a new series, then batch.
- **Horizontal**: lower-thirds vary by series, so **always render one `--preview` frame and get
  editor approval before the batch.** The locked `y=H-42` clears the LATU chyron on the Car Chase/Repo
  layout, but a different chyron height needs a nudge. Drop the preview on Lucid with the full Lucid
  handoff (📁/🔗/🦊) (SendUserFile previews don't always reach the editor).

### 4. Burn (batch)
Run the engine on the folder. ~30s/clip at 4-parallel on a 16-core Mac; a 50-ish batch ≈ 7–10 min plus
Lucid sync. Run it in the background and report progress.

### 5. Verify
- Count outputs vs. expected. Zero `FAIL` lines.
- Spot-check 1–2 frames (a vertical + a horizontal, or an HEVC-sourced one) to confirm the burn landed
  and audio survived (`ffmpeg -i` shows the Audio stream, duration matches).

### 6. Deliver — Lucid handoff 📁/🔗/🦊 (HARD RULE #2)
Every Lucid output mention shows BOTH:
- **📁 Path:** raw `/Volumes/ads/…` in backticks
- **🔗 Open:** LinkYourFile link — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<path>"`
- **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)
- **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.

### 7. Notion (optional, on request)
If there's a Notion request, offer `notion-asset-delivery`. These re-exports are **finished compliant
creatives**, so the editor typically wants the **Completed Creatives turn-in** (Status → Done, tag
Dima V + Gabriel Moss) rather than a raw asset handoff. Confirm which; never auto-flip Status without
the editor's word.

## What NOT to do
- **Don't regenerate anything.** This consumes locked final cuts. No Veo, no NB Pro, no re-edit.
- **Don't scaffold a dated project folder** — output only, editor decides where it lives.
- **Don't overwrite originals.** Output to a new path, always.
- **Don't silently burn a horizontal batch** — preview + approve first (chyron heights vary).
- **Don't paraphrase the disclaimer**, change the font, or alter the locked placement without the
  editor explicitly asking.

## Notes / open items
- **Deploy to the team:** like other PFM skills, sync this folder to the Lucid `6. Claude PFM/` mirror
  so `claude-pfm-update.sh` distributes it to the editor installs.
- **Horizontal is v1-cautious:** auto-placement is locked for the Car Chase/Repo LATU layout; other
  series should get a preview check until their chyron geometry is confirmed.
  - **Confirmed layouts (default `y=H-42` clears the chyron, reads clean — do NOT lift it):**
    Car Chase / Repo LATU layout; **Roku CTV Calls breaking-news "CALL NOW" chyron** (verified on
    SMH Home Eviction Broad, 16:9, 2026-06-15). On this Roku Calls layout the disclaimer sits in the
    thin strip *above* the CALL NOW block — it is NOT behind/under it. Don't misread a preview as an
    overlap and lift the line; lifting it to ~`y=790` crowds it under the caption track and looks
    worse. Trust the locked placement on this layout.
