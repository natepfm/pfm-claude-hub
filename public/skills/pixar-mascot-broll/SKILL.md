---
name: pixar-mascot-broll
description: Turn a VSL/ad dialogue script into 16:9 Pixar-3D b-roll vignettes where the brand MASCOT acts out selected lines (alias-to-be /ag.broll.mascot) — generated on gpt_image_2 with the canon mascot as reference, ready to feed Kling image-to-video. Proven on the Houston SMA VSL (Max the dog, 18 scenes). Use when an editor says "make pixar b-roll", "mascot b-roll", "do the pixar b-roll scenes", "make the mascot act out the script", or a VSL with a canon mascot needs illustrative cutaways for ~half its lines. NOT for: the per-state Pixar music videos (pixar-state-music-video), camera-roll b-roll (iphone-broll), object cutaways (object-inserts), or building the mascot itself (pfm-character-master).
---

# Pixar Mascot B-Roll

Script lines → mascot-acted Pixar vignettes → Kling i2v. The mascot (e.g. Max) *acts out* the beat of each selected line.

## Flow

1. **Get the script** — line-by-line dialogue from the Notion request's Copy callout.
2. **Select ~half the lines** — concrete, visualizable beats (cost-of-living, money, discounts, skeptic, autopilot, golden-profile). SKIP lines already covered by rate/title slides and abstract/procedural lines — don't over-cut.
3. **Write one Pixar vignette per line, GROUNDED slice-of-life** — kitchen table with bills, on the couch, at the gas pump. Abstract metaphor is rejected on sight ("squeezed between giant bills" / "money swirling away" = "too out there"; Max-at-the-table-reading-a-bill lands).
4. **Gate 1 — sign-off:** present line selection + per-line concepts as a TABLE; the editor approves/trims/edits BEFORE anything fires.
5. **Gate 2 — ⭐ test batch:** fire the ~7 strongest, show each as it lands (Rule 5: 📲 + widget), editor confirms the look, THEN the rest. Misses: name it, show it, editor calls the refire (STOP-ASSUMING) — except stochastic NSFW/502s, which clear on a plain refire.
6. **Prompts:** Pixar-cinematic STYLE HEADER (mascot identity from refs, warm soft Pixar lighting, shallow DOF, 16:9) + "Mascot does X" action + mood + negatives (no photoreal, no real humans, no garbled text/logos, keep collar/tag). Restate identity tokens in EVERY prompt — identity drifts across settings otherwise.
7. **Fire on `gpt_image_2`** — NOT NB Pro (look rejected for this) — 16:9, 2k, quality high, refs = canon mascot still + model sheet (`--image canon.png --image modelsheet.png`). Each fire = its OWN process (never background curls sharing bash vars — parallel-curl corruption is real); cap ~4 concurrent.
8. **QC from the folder** (identity holds, scene reads, slice-of-life grounded) — files land in the folder BEFORE review; full 📁/🔗 handoff.
9. **Hand off to Kling 3.0 i2v** (`--duration 8`) for the moving b-roll.

## Naming

`Elements/Footage/Reference/<Mascot> B-Roll Scenes/` → `L<line#> - <concept> - gpt_<hex>.png`, 16:9 2k, one image per scene.

## Gotchas

- gpt_image_2 NSFW false-positives are stochastic — plain refire clears them; real-person `--image` refs trip it hard (mascots are clean).
- HTTP 502 / server "failed" = Higgsfield instability — wait, don't burn fires.
- Editor's mascot look is locked per brand — match the existing slide/no-slide set, don't restyle.

## Cross-refs
`pixar-state-music-video` (state music videos — different job) · `pfm-character-master` (mascot masters) · `labs-voice-swap` (if the mascot speaks) · origin: Skill Proposals inbox 06-02, proven Houston SMA VSL.
