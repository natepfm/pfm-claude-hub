---
name: vsl-state-variations
description: PFM's per-state VSL asset-generation flow — produces both deliverables for a state variant of a winning VSL (the Chad-keynote "Average Auto State Cost Pitch" family): Phase 1 edit-swap slide images, then Phase 2 Veo Lite clips for every script line. Mirrors the locked Texas/Minnesota/Iowa templates. Use when an editor drops a Notion request titled "VSL - ... State Cost Pitch <State>" (or similar per-state VSL) alongside the shared VSL project folder, or says "run the VSL for <state>", "do the <state> VSL", "make the VSL slides and clips for <state>", "next VSL state". Sits downstream of an already-built broad/winner VSL (the Broad & Florida base slides + the keynote master prompt JSON must already exist in the project). NOT for: building the original winning VSL from scratch, non-VSL state batches (use notion-state-batches), or generic b-roll (use hig-flow) / one-off clips (use hvg-flow).
---

# VSL State Variations

Per-state variant of a winning VSL. Two deliverables per state, fired in order:
1. **Phase 1 — Slides** (edit-swap reference images, Nano Banana Pro)
2. **Phase 2 — Clips** (Veo Lite, one per script line)

**Execution model — same as hvg-flow/hig-flow:** run setup SILENTLY (cwd check, Notion
fetch + parse, sibling-state recon, ref upload, manifest), stop only at a consolidated
preflight before each spend (slides, then clips). Never fire without the preflight. Render
all confirmations as plain markdown chat — NOT `AskUserQuestion` cards (Sam dislikes them).

## Inputs / preconditions
- Notion state request (e.g. "VSL - Average Auto State Cost Pitch Iowa") with the per-line
  script + `Slide:` notes, and the state data (rate/city/names) in the copy.
- Shared VSL project folder already containing:
  - `Elements/Footage/Reference/Slide Images - Broad & Florida/` (edit-swap base slides)
  - `Elements/Footage/Reference/No Slide Reference Shots/` (Chad-on-stage pool, ~5 shots)
  - `Elements/Prompts/vsl_avg_state_<st>_master_prompt.json` (keynote master; all states
    byte-identical except the `dialogue` field — the helper embeds this template too)
- A sibling completed state (Texas, Minnesota, Iowa) to copy the line→slide convention from.
  **Always `ls` a sibling state's `Slide Images - <State>/` folder first** — it is the
  authoritative list of which lines get a slide vs. a pool shot.

> **Line count and slide set VARY per VSL — never assume.** The Average-Auto family happens
> to run 41 script lines → ~17 clips → 10 slide designs, but that is THIS VSL's shape, not a
> constant. A different VSL (different offer, different winner) has its own line count, its
> own set of slide-backed lines, and its own CTA layout. **Every run: read the brief's script
> + `Slide:` notes and the sibling state's slide folder to derive the actual line list and
> slide set for THIS VSL.** Build the manifests from that, not from a remembered number.

## Phase 1 — Slides
- Each **state-specific line** gets its own reference image, edit-swapped off the Broad &
  Florida base. To see which lines have a slide, list any sibling state's folder.
- Model: **Nano Banana Pro (`nano_banana_2`), 2k, count=2**, 16:9, edit-swap.
- Prompt: "keep composition/identity identical, change ONLY <tokens>, match
  font/weight/color/kerning/placement, preserve every other pixel."
- **Swap ALL tokens**: state, city, person name, rate, savings. (Name MUST match the VO —
  Texas left the client name unchanged as a bug; MN fixed Ryan→Adam; Iowa Ryan→Caleb.)
- Deliver to `Elements/Footage/Reference/Slide Images - <State>/`, filenames mirroring the
  broad folder pattern + state appended.
- **CTA slides are state-specific — do NOT skip or share them.** The CTA lines
  (L22/L23, L39/L40, L41) carry "<STATE> ZIP CODES" text and must be edit-swapped per
  state (FLORIDA → IOWA, etc.). Texas/Georgia/Iowa convention collapses them into 3 combined
  output files: `L22 & L23 - <State>`, `L39 & L40 - <State>`, `L41 - <State>` (bases:
  `L22 - Recalculate Photos`, `L39 - Tap Link CTA`, `L41 - Tap Link CTA v1`). Single token
  swap each: "FLORIDA ZIP CODES" → "<STATE> ZIP CODES". **Bug we hit twice:** Minnesota and
  Colorado originally shipped without these (frames still read FLORIDA — MN backfilled
  2026-05-29). Always confirm the state folder has all 3 CTA files before declaring Phase 1
  done. (Chad's body partially occludes the ZIP pill in the wide CTA frames — design, not defect.)
- Verify the text swaps by eye before Phase 2 — title-slide and CTA text rewrites are where
  Nano occasionally fumbles kerning. (This is a self-check, not a Sam-facing auto-QC.)
- **One take is enough.** count=2 is redundancy, not a requirement. If a design delivered
  ≥1 take (v1 OR v2), that design is COVERED — move on. Only re-fire a design when BOTH
  takes fail. Count coverage by unique design, not raw image count (19/20 with every design
  represented = done). A transient 502/timeout on a second take is a non-event — don't chase
  it. (See `feedback_count2_one_take_enough`.)

## Phase 2 — Clips
- Fire **all script lines for THIS VSL** (count varies per VSL — derive from the brief, do
  not assume 17) on **Veo Lite (`veo3_1_lite`), count=1**.
- `--generate_audio true` is MANDATORY (Lite default is false → silent).
- Reference frame per line:
  - Line **has a state slide** → use that slide (`--start-image <UUID>`).
  - Line **has no slide** → pull from `No Slide Reference Shots/` (cycle the pool).
- **Master prompt:** the keynote master, `dialogue` swapped per line, prefixed with
  `Veo video prompt: ` (CLI rejects a leading `{`). The helper embeds the master template.
- **Screen-lock** the master so the slide behind Chad doesn't animate/talk.
- **Talking on-screen photo fix (client/couple slides — L17/L19/L27/L28).** Veo sometimes
  animates the headshot ON the slide so the photo's mouth moves — stochastic, hits some
  takes not others (Nebraska L17 2026-05-29). On QC, if a slide photo's face moves, refire
  that line with a hardened **`screen_lock` block** in the master: state that the screen
  shows a "STILL PHOTOGRAPH … completely frozen, printed still image — does NOT move, blink,
  breathe, or speak … do NOT animate or lip-sync any face shown on the screen; only the live
  speaker on the stage floor moves." Also reword `action` to "ONLY Chad speaks; his mouth is
  the only mouth that moves in the entire frame." Fixed Nebraska L17 on the first attempt.
  (This is a pre-delivery quality regen → overwrite the bad v01, per visual-qc rule.)
- Resize any slide >1920px before using it as a Veo ref (slides are 2752×1536).
- **NSFW handling — escalate, don't just re-roll.** Chad trips Veo's stochastic NSFW filter
  ~20-30% (Iowa: 5 of 17 first pass; Nebraska: 2 holdouts). Blind back-to-back re-rolls waste attempts on the
  same hot window. The ladder:
  1. First pass: plain master, count=1, a few auto-retries.
  2. Still flagged → **re-fire with the SFW-reinforced master** (Iowa 2026-05-29 recovered
     4/5, 3 on first attempt). The diff: wardrobe `fitted ...turtleneck` →
     `professional relaxed-fit ...turtleneck`; add to subject `professionally dressed, fully
     clothed, conservative corporate keynote presenter`; add to style `broadcast-safe,
     family-friendly corporate keynote footage`. Dialogue + reference UUID stay identical so
     the clip still matches the editor's timeline. (The helper's `--sfw` flag does this.)
  3. Survives BOTH passes (Iowa: only L19, 7 total fails) → true hot-streak holdout →
     **flag it as a manual entry in the Notion comments** (house format, see
     `feedback_notion_manual_flag_comment_format`) and move on.
  Proof failures are stochastic not reference-caused: L39 and L40 use the SAME CTA slide;
  L39 passed first try, L40 needed the tweak. Same input, different dice.
  - **Recurring-holdout lines:** **L19** (client-after slide) and **L40** (CTA L39&L40 slide)
    run consistently hot — both flagged manual on Iowa AND Nebraska, surviving plain + SFW
    passes. Expect these two to need hand-firing most states; not worth burning >4+3 attempts
    on them. Fire the batch, run one SFW pass, flag L19/L40 if still down, move on. (If a
    future tweak reliably cracks them, update this.)
- Output: `Elements/Footage/Veo/<State>/` as `L<NN>_<st>_v01.mp4`.

## Firing engine — use the helper, don't hand-roll
`fire_veo.py` (ships with this skill) encodes every lesson below. Drive it with a JSON
manifest of `{out, ref_uuid_key, dialogue}` rows + a `{key: uuid}` ref map. Flags: `--sfw`
(SFW-reinforced master), `--attempts N`, `--workers N`, `--out-dir <Veo/State>`.
- Higgsfield CLI returns a **JSON array**; result is on `[0]` with key **`result_url`**
  (status `completed`). Parse `json[0]["result_url"]`, NOT the list itself. (This bug threw
  away 12 good images + caused a 45-min hang on 2026-05-29.)
- **Batch-level retry, never serial-long-timeout.** `--wait-timeout` ≤6m per job, fire in
  parallel via `ThreadPoolExecutor`, re-fire only stragglers in a 2nd pass.
- **Pre-upload refs serially**, capture UUIDs, pass UUIDs (not local paths) to `--start-image`
  / `--image` (avoids the CLI credential-store race). `max_workers` ≤16.
- **Lucid Link I/O:** download to `/tmp/<proj>_out/` then ONE bulk copy into the Lucid Link
  folder. Foreground `ls`/reads on Lucid Link dirs can hang — use background bash → `/tmp`.
- On a crashed run, recover from saved per-job result JSONs before re-firing (no double-spend).

## Known backfill debt
- **Minnesota:** CTA slides done (2026-05-29); remaining debt is the **L19 + L40 clip**
  hand-fires (NSFW hot-streak holdouts) — editor's manual job, flagged in Notion.
- **Colorado:** still missing its 3 CTA slides + any CTA-clip refire. Out of current scope.

## Cross-references
- `hig-flow` — Phase 1 image mechanics · `hvg-flow` — Phase 2 video mechanics
- `notion-state-batches`, `iterate-creative` — upstream request creation
- Memory: `project_average_state_vsl_flow`, `feedback_notion_manual_flag_comment_format`,
  `feedback_higgsfield_cli_concurrency_race`, `feedback_veo_lite_audio_flag_always`,
  `feedback_no_askuserquestion_in_pfm_flows`, `feedback_no_auto_qc_unless_asked`

## Provenance
Graduated from draft 2026-05-29 after a full end-to-end dogfood (Iowa: 20 slides + 16/17
clips, 1 manual flag). Built live across the Minnesota + Iowa runs.
