---
name: object-inserts
description: PFM's no-character ATMOSPHERE / OBJECT-INSERT b-roll type skill — the cutaway shots with no person in frame: a folded utility bill on a kitchen counter, a mailbox with a bill sticking out, hands on a steering wheel, keys on a table, a worn wallet, a coffee mug beside a laptop, a For-Sale sign, a gas pump display. The lived-in, anti-stock, shot-on-a-phone detail shots that give a story ad texture between the talking beats. No character master needed (that's the whole point — these are objects and settings, not people). Owns the lived-in anti-stock craft (worn/real not glossy, correct grain, no iOS UI chrome, aged-bill cues) and fires through the shared pipeline spine. Use when an editor says "object shots", "insert shots", "cutaway of the bill / the mailbox / the keys", "slice-of-life shots", "atmosphere b-roll", "detail shots", "the bill on the counter", "hands on the wheel", "no-people b-roll", or a creative needs its object/insert cutaways. Default: Nano Banana Pro (`nano_banana_2`) 1k, count=1, 9:16, iPhone camera-roll style (loads `nano-banana-prompting`). NOT for: any shot with a person (use `iphone-broll` for character b-roll, `social-proof-phone-quote` for held-phone shots, `broadcast-news-stills` for news), a phone SCREEN that must show a real quote page (that's `social-proof-phone-quote` / the gpt_image_2 quote-page step), or brand graphics / quote pages themselves (gpt_image_2).
---

# Object Inserts (PFM no-character atmosphere / detail b-roll)

The cutaway shots with **no person in frame** — the folded bill, the mailbox, the hands on the wheel,
the keys on the counter, the gas-pump total. They're the texture between a story ad's talking beats,
and they only work when they look **lived-in and shot on a phone**, never like glossy stock.

## Role — type skill, fires through the spine

This skill owns the **object/atmosphere craft + the shot list**. Firing is the shared **pipeline
spine** (`~/.claude/skills/hig-flow/fire_batch.py`; contract in `hig-flow/PIPELINE-SPEC.md`):
pre-upload → fire (Rule-5 streamed) → serial verified download → manifest → 📁/🔗/🦊 handoff, AGF
interlock wrapping it. Prompt bodies use `nano-banana-prompting` iPhone mode (minimal, anti-glossy) —
**without a person.** The defining trait vs every other b-roll skill: **no character master, no
identity ref** (an object insert has no face to hold). Refs are optional and only ever a **locked
environment plate** (so the same kitchen counter recurs across shots) — never a character.

## The craft (lived-in, anti-stock — the whole job)

The failure mode is stock-photo perfection: a pristine bill centered on a spotless granite island in
studio light. That reads fake and kills the authenticity the story ad is built on. The fixes:

- **Lived-in, anti-stock** (`feedback_b_roll_lived_in_anti_stock`) — worn surfaces, a little clutter at
  the edges, a coffee ring, a real cluttered counter, imperfect placement. The object sits in a life,
  not on a set.
- **iPhone camera-roll look** (`nano-banana-prompting` iPhone mode) — casual angle, slightly off-center,
  natural window light, no studio lighting, no glossy retouch. Clean grain dial (`feedback_iphone_broll_grain_dial`):
  enough to read as a phone snap, not a grain filter.
- **No iOS / UI chrome ON the image** (`feedback_no_ui_chrome_in_broll`) — the shot is what the camera
  saw, not a screenshot; no status bar, no app UI, no camera-app overlay.
- **Aged-bill / paper cues** (`feedback_folded_bill_aging_cue`) — a real bill has a fold crease, a
  slight curl, a used look; a crisp flat sheet reads printed-just-now. Fold and age it.
- **Brand-clean negatives** (`feedback_pfm_brand_clean_rules`) — no carrier/automaker/retailer logos, no
  readable brand names on packaging, no recognizable letterhead, per vertical.
- **Legible-but-generic text** — if the bill/sign shows a number the script names (a rate, a total),
  make it readable and correct, but keep the letterhead/brand generic and compliance-safe (monthly or
  yearly rates, "could" framing where it's a savings claim).

## Config → the spine

The job list this skill hands `fire_batch.py` declares:

- `gen`: `{ "model": "nano_banana_2", "resolution": "1k", "count": 1, "aspect": "9:16" }` (16:9 only if
  the creative is horizontal — locked 2026-06-17).
- `outDir`: the project's `Elements/Footage/Primary/B-Roll/` (flat) or the creative's convention.
- `naming`: `{nn}_{shot}_{hex}.png` — unique `{hex}` (DaVinci auto-group guard,
  `feedback_broll_filename_unique_hash`). No `{char}` token — there's no character.
- `manifest`: `"md"`.
- Refs: usually **none**. If a setting recurs (the same kitchen across several inserts), pass the
  locked environment plate as the only ref so the counter/room stays consistent.

## Flow

1. **Scope [SILENT].** Confirm cwd is the project. From the script beats, list the object/atmosphere
   cutaways the story needs (often the "what the line is about" inserts + slice-of-life texture). Note
   any setting that recurs → build/lock one empty env plate for it (reused as the ref).
2. **Shot list.** One row per insert: `NN | beat | object + surface + setting | env-plate ref? | prose
   cue (fold/age/clutter/light)`. No people. No identity refs.
3. **Prompt craft [SILENT].** `nano-banana-prompting` iPhone mode, no person, bake in the craft above
   (lived-in, aged cues, no UI chrome, brand-clean, correct-but-generic text). Write the shots into a
   job list.
4. **Preflight → Fire? → spine.** Dry-run the spine (no `--fire`) for the cost line; Rule 3 card if ≥20.
   On Fire?:

   ```bash
   python3 ~/.claude/skills/hig-flow/fire_batch.py "$JOBLIST" --fire --project-root "$(pwd)"
   ```

   Relay each `LANDED` line as it prints (Rule 5). The spine downloads + writes the `.md` manifest +
   prints the 📁/🔗/🦊 handoff.
5. **Offer QC — the editor decides refires.** Local fires are NEVER auto-QC'd; after the results land
   and are SHOWN (Rule 5), OFFER QC via a plain ask (AGF/mini keeps mandatory QC). The checklist: reads
   as a real phone snap (not stock), object correct and aged, any named number legible +
   compliance-safe, no logos, no UI chrome. When an insert misses: name the miss in one line, SHOW it,
   STOP — re-firing as the next version is the editor's call, never self-initiated.

## What NOT to do

- ❌ Put a person in the shot — the moment there's a face/hands-with-identity, it's `iphone-broll`
  (character b-roll) or `social-proof-phone-quote` (held phone). This skill is objects + atmosphere.
- ❌ Pass a character master as a ref — there's no identity to hold; refs are env plates only.
- ❌ Stock-photo perfection — pristine object, studio light, spotless surface. Lived-in or it's dead.
- ❌ A crisp flat bill — fold + age it (`feedback_folded_bill_aging_cue`).
- ❌ iOS/app UI chrome on the image (`feedback_no_ui_chrome_in_broll`).
- ❌ Readable brand names / carrier / automaker logos (brand-clean stack, every shot).
- ❌ Hand-roll the fire — build the job list, call the spine.

## Cross-references

- `hig-flow` / `PIPELINE-SPEC.md` — the fire/deliver spine this fires through.
- `nano-banana-prompting` — iPhone mode for the (person-less) prompt bodies.
- `iphone-broll` — the character b-roll sibling; its Mode B builds the WHOLE set (people + objects),
  this skill is the objects-only specialist for a targeted insert batch or a set with no people.
- `social-proof-phone-quote` — when the insert is a held phone showing a quote page.
- Memory: `feedback_b_roll_lived_in_anti_stock`, `feedback_folded_bill_aging_cue`,
  `feedback_no_ui_chrome_in_broll`, `feedback_iphone_broll_grain_dial`,
  `feedback_broll_filename_unique_hash`, `feedback_pfm_brand_clean_rules`.
