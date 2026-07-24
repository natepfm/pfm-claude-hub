---
name: visual-qc
description: PFM's visual QC skill for Veo-generated mp4 clips — catches background morphs, slide text garble, hallucinated overlays, and hard cuts that audio QC can't see. Per-clip 5-frame filmstrip extraction via ffmpeg (0s/2s/4s/6s/7.8s, scaled 480px wide, hstacked) + full-res end-frame extraction for caption-slide clips with fine on-screen text (rate text, name labels, ZIP codes, dollar amounts). Claude reads each filmstrip and calls ✓ / ✗ / 🔍 VERIFY per clip. Use this skill whenever an editor asks to "run visual QC", "visual QC", "filmstrip QC", "frame QC", "check the visuals", "verify the visuals", "QC the slides", "scan the visuals" — or after a Veo batch downloads and the editor wants a per-clip visual pass. Primarily used on VSL-style projects with per-line slide references where backgrounds must stay frozen. EDITOR-INVOKED ONLY on local fires (Sam 2026-07-20: local fires get NO QC and no QC offer — gen flows end with a passive availability line). Mandatory only inside the autonomous `agf`/mini cycle. NOT for: audio defects (use audio-qc), one-off image QC, podcast story-ad work without per-line slides (filmstrip overhead not worth it).
---

# Visual QC — PFM

## 🔴 QC LAW (Sam 2026-07-20)

**Local fires get NO QC and NO QC ask — this skill runs ONLY when the editor explicitly invokes it. Gen flows end with a passive availability line, nothing more. AGF/mini runs keep mandatory QC (autonomous, nobody watching).**

**This skill is the single filmstrip owner — veo-life delegates its clip QC here.**

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Per-clip visual quality check for Veo-generated mp4 clips. Catches background morphs, slide text garble, hallucinated overlays, and hard cuts that audio QC can't see. Built primarily for VSL-style projects with per-line slide reference images, where the LED screen and on-screen graphics MUST stay frozen across the 8s clip.

## When to invoke

This skill triggers on:
- Editor says "visual QC", "check the visuals", "run visual QC", "filmstrip QC", "frame QC", "verify the visuals"
- Editor invokes it after seeing the passive availability line in a gen flow's final report
- Editor wants per-clip frame analysis after a Veo batch downloads

Most useful for:
- VSL-style projects with per-line slide references (each L# has its own slide image)
- Any batch using Mode B / D / E references where backgrounds must stay locked
- Caption-heavy clips with rate text, name labels, ZIP codes, dollar amounts

Less useful for:
- Podcast story ads with one shared reference image and one speaker — the speaker IS the content, there's nothing else to morph
- Single-take ad-hoc fires (manual review is faster than running the scanner)

## What the scanner extracts (the 5-frame filmstrip)

For every delivered mp4 in the target folder, the scanner extracts 5 stills at fixed timestamps:

| Timestamp | Purpose |
|---|---|
| 0.0s | Open frame — does the ref image render cleanly? |
| 2.0s | Early-mid — has anything begun to morph? |
| 4.0s | Middle — peak risk for mid-clip drift |
| 6.0s | Late-mid — caption-slide defects often surface here |
| 7.8s | Near end — final state for comparison vs open |

Each frame is scaled to ~480px wide and hstacked into a single filmstrip PNG saved at `<veo_root>/qc/strip_<slug>.png`. State-routed batches get filmstrips in `<veo_root>/qc/<STATE>/strip_<slug>.png`.

**Why 5 (not 3 or 9):** earlier iterations used 3 frames and missed mid-clip morphs that surfaced between samples. 5 closes the blind spots without exploding context. Denser sampling on tight defects is handled by the caption-slide full-res extraction below.

### Caption-slide rule — full-res end frames

For clips with rate text, name labels, ZIP codes, dollar amounts, or other fine on-screen typography, the 480px filmstrip is too small to spot subtle text defects (a duplicated character, a stray label, a digit drift). The scanner additionally extracts the 4s / 6s / 7.8s frames at FULL native resolution (no scaling) to a separate set of PNGs under `<veo_root>/qc/caption/<slug>_<timestamp>s.png`.

Caption defects skew LATER in the clip — that's why end-frames matter most. The canonical L19 "hallucinated 'Jake' label appears at ~2s" defect was caught this way after the filmstrip alone missed it at 480px.

**How the scanner knows which clips are caption-slides:** pass `--caption-clips L02,L17,L19,L20,L27,L28,L22,L40,L41` (project-specific L-number list). The editor knows which slides have fine text; the scanner doesn't infer it.

## Pass criteria (what "✓" means)

A clip passes when the ONLY things that change across the 5 filmstrip frames are:
- The live speaker moving naturally (mouth, hands, weight shifts)
- The camera doing a slow, gentle pan or slow zoom (ambiguous cases → 🔍 VERIFY)

Everything else must stay frozen:
- The LED screen content behind the speaker
- Any inset photos (customer headshots, couple photos) — MUST remain static photos, not animate
- On-screen text / graphics (slide title, dollar amounts, ZIP codes, arrows, name labels)
- Stage, lighting, audience, backdrop

A noticeable pan across the same stage is fine. The reference image is treated as locked.

## Fail criteria (what "✗" means)

Any of these → flag with specific reason + approximate timestamp:

| Defect type | What it looks like |
|---|---|
| Background change | LED screen content morphs / inset photos start animating ("the guy in the photo starts talking") / new element appears mid-clip |
| Text morph / garble | Slide text drifts between frames (e.g. "PROTECTION SUMMIT" → "PROTECTION ACT", "INDIANA" → "INDIANAA") |
| Element disappearance | Part of the slide (a headline, a number) vanishes mid-clip |
| Hallucinated overlays | Text or labels appearing on the LED screen or inset photos that weren't in the source slide (the L19 "Jake" label is the canonical example) |
| Camera cut / sudden framing change | Hard scene change, fast zoom punch, whip pan |
| Hallucinated decorations | Particles, light orbs, lens flares, dust the source slide didn't have |

## 🔍 VERIFY — the third outcome

When stills are ambiguous but everything else looks stable and likely correct (typical case: speaker occludes a critical word on the slide for several frames, so the text can't be fully verified from the filmstrip), surface as `🔍 VERIFY`. The editor's eyes on the actual clip make the call.

**DON'T rationalize ambiguity away.** The L19 "Jake" label was missed once because someone talked themselves into "probably a reflection." If something ambiguous shows up — faint floating text, edge artifact, partial occlusion — flag it as VERIFY, don't bury it as ✓. The bias is to over-flag, not under-flag.

## Full SOP

### Standalone invocation (editor says "run visual QC" cold)

When invoked outside `hvg-flow` — i.e. the editor says "run visual QC", "filmstrip QC", "check the visuals", etc. without going through a gated flow — confirm the two things the scanner needs before firing:

1. **Veo folder path** — default suggestion is `<cwd>/Elements/Footage/Veo` if cwd is inside a PFM Lucid Link project (`/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/...`). If cwd is somewhere else, ask the editor for the absolute path.
2. **Caption-slide L-numbers** — comma-separated list of L-numbers whose slides have rate text / name labels / ZIP codes / dollar amounts that need full-res text inspection. Editor knows this; you don't. Default is `none` if the editor doesn't volunteer any.

Render the ask in plain markdown chat (NOT `AskUserQuestion` — see `feedback_no_askuserquestion_in_pfm_flows.md`):

> Visual QC on which folder? Default = `<cwd>/Elements/Footage/Veo` (or paste an absolute path).
>
> Any caption-slide L-numbers? (lines whose slides have rate text / name labels / ZIP codes / dollar amounts that need full-res text inspection) — reply with comma-separated list like `L02, L17, L19` or `none`.

Once the editor replies, jump straight to the command below. No further gates.

If cwd isn't a PFM project folder AND the editor didn't paste an absolute path → ask once more for the folder. Don't guess.

### Command

```bash
python3 ~/.claude/skills/visual-qc/visual_qc_scan.py \
  "<project>/Elements/Footage/Veo" \
  --caption-clips L02,L17,L19,L20,L27,L28,L22,L40,L41 \
  --workers 8
```

The scanner walks the target folder recursively, finds all mp4s (skipping anything under `qc/` to avoid feedback loops on re-runs), generates per-clip filmstrips + (for caption-slide clips) full-res end frames, and writes an index manifest to `<veo_root>/qc/visual_qc_index_<YYYY-MM-DD>.json`.

### Common flags

| Flag | When to use |
|---|---|
| `--caption-clips L02,L17,...` | Comma-separated L-numbers that get full-res end-frame extraction. Project-specific — editor knows which slides have fine text. Omit if no caption slides in the project. |
| `--workers 8` | Default ffmpeg parallelism. Lower to 4 if the machine is busy. Visual QC is more CPU-heavy than audio QC — 8 is safer than audio QC's 12. |
| `--exclude "Batch 6"` | Skip in-flight batches. Repeatable. |
| `--exclude "_v03"` | Skip re-fires while scanning originals. |
| `--strip-width 480` | Per-frame width before hstack (default 480). Bump to 720 for denser frame inspection at the cost of larger PNGs. |
| `--out <path>` | Custom index destination (default `<veo_root>/qc/visual_qc_index_<date>.json`). |

### After the scanner runs — Claude reads filmstrips and calls each clip

Once filmstrips are generated, **walk the index file and Read each filmstrip PNG**. For each clip:

1. Read the filmstrip PNG
2. Apply pass/fail criteria above
3. If the clip is in the caption-slide list (`is_caption: true` in the index entry), also Read each entry from `caption_frames` (full-res 4s / 6s / 7.8s PNGs)
4. Record the call: ✓ / ✗ / 🔍 VERIFY + reason + approximate timestamp for any defects

**Batching strategy for large batches (>50 clips):** see `references/scenarios.md`.

### Final report

After all clips are analyzed, write a markdown report to `<veo_root>/qc/visual_qc_report_<YYYY-MM-DD>.md` with:

- Summary: ✓ count, ✗ count, 🔍 VERIFY count
- ✗ section — per-clip slug + defect type + timestamp + filmstrip path
- 🔍 VERIFY section — per-clip slug + what's ambiguous + filmstrip path (editor must eyeball)
- ✓ section (collapsed) — full list for audit

Surface to the editor:
- One-liner counts
- Top defect concentrations (e.g. "L19 has 5/5 hallucinated-label defects across all states — script-level fix")
- Pointer to full report + filmstrip folder

## Regen workflow (after editor confirms a ✗)

When the editor confirms a defect is real:

- **Pre-delivery regen — overwrite IS OK, but ONLY pre-delivery** (the explicit and NARROW exception to `feedback_regen_no_overwrite.md`). Overwrite `<slug>_v01.mp4` ONLY while the clip is still inside visual-QC: before it enters any timeline, before the mini/flow fires it out, before a delivery comment is posted. 🔴 **The moment a clip is DELIVERED (fired + delivery comment posted / in the editor's hands), this exception is DEAD — version up to `_v02+`, NEVER overwrite.** And do NOT `rm` an existing clip to force an idempotent fire script to re-fire — that deletion IS the overwrite (this is exactly how the exception got misapplied to already-delivered pixar-avg L06/L07, 2026-07-13). When unsure whether a clip is delivered: assume delivered → version up.
- Default model: **Veo 3.1 Lite + `--generate_audio true`** at count=1 (matches the new default fire shape — see `feedback_default_count_1.md`)
- **2-retry cap.** Stop after 2 retries on the same clip and surface to the editor for a Fast escalation decision (don't burn credits in a regen loop)
- After regen, re-run visual-qc on just that clip (point the scanner at the single state subfolder, or wait for the editor's next batch QC pass)

Skipped lines (NSFW at cap) DON'T enter the regen loop — they feed the next decision round (Fast exception, fresh-session retry, etc.).

## Common scenarios

Five worked scenarios — chained from hvg-flow, cold invocation, single state/batch spot-check, re-scan after regens, "is it worth it for this project shape" — live in `references/scenarios.md`.

## Edge cases

- **ffmpeg not found** — same self-resolve as audio-qc: `$PFM_FFMPEG` → `~/bin/ffmpeg` → `which ffmpeg`. If none found, exits 2 with install hint.
- **Empty folder** — exits 0 with "Found 0 mp4 files."
- **qc/ subfolder already exists** — scanner cleans / overwrites prior filmstrips for the same scan date. To preserve both, pass `--out` with a custom path.
- **Clip < 8s** — adjusts sampling timestamps proportionally (5 evenly-spaced stills regardless of clip length).
- **Permission prompt** — first run prompts for the python3 + visual_qc_scan.py command. Approve once; the Lucid Link `settings.json` allowlist (`Bash(python3 *visual-qc/visual_qc_scan.py *)`) covers subsequent runs.

## Cross-references

- **`audio-qc`** — sibling skill (audio physics + dialogue verify)
- **`hvg-flow`** — its final report names this skill in the passive QC-availability line; the editor invokes it directly
- **`feedback_visual_qc_workflow.md`** — the canonical rule set (5-frame default, caption-slide rule, don't-rationalize, 2-retry cap, pre-delivery overwrite exception)
- **`feedback_regen_no_overwrite.md`** — visual-qc's pre-delivery overwrite is the documented exception
- **`feedback_default_count_1.md`** — regen default matches the count=1 fire shape

## What's NOT in this skill

- Audio defects (use `audio-qc`)
- Pre-Veo prompt validation (use `veo-script-writing`)
- DaVinci timeline-level visual checks (color, sync drift, etc.)
- Auto-regeneration — visual-qc never auto-regens. Editor confirms each defect first
- Inference of caption-slide L-numbers — editor passes them via `--caption-clips` (the editor knows which slides have fine text; the scanner doesn't infer)
