---
name: vsl-state-variations
description: PFM's per-state VSL asset-generation flow — produces both deliverables for a state variant of a winning VSL (the Chad-keynote "Average Auto State Cost Pitch" family): Phase 1 edit-swap slide images, then Phase 2 Veo Lite clips for every script line. Mirrors the locked Texas/Minnesota/Iowa templates. Use when an editor drops a Notion request titled "VSL - ... State Cost Pitch <State>" (or similar per-state VSL) alongside the shared VSL project folder, or says "run the VSL for <state>", "do the <state> VSL", "make the VSL slides and clips for <state>", "next VSL state". Sits downstream of an already-built broad/winner VSL (the Broad & Florida base slides + the keynote master prompt JSON must already exist in the project). NOT for: building the original winning VSL from scratch, non-VSL state batches (use notion-state-batches), or generic b-roll (use hig-flow) / one-off clips (use hvg-flow).
---

> ## 🔴 Two-link Lucid handoff — MANDATORY at every download / save / report step
>
> Every time this skill saves, downloads, or reports an asset path — preflight Output, mid-flow "Saved as:" refire reports, intermediate Phase 1 / Phase 2 handoffs, final state delivery — render BOTH:
> - **📁 Path:** raw `/Volumes/ads/…` path in backticks (for Finder)
> - **🔗 Open:** clickable LinkYourFile link, built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`
> - **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.
>
> Never bare filenames. Never just a relative path. Never just a folder name without the clickable link. **A "Saved as: <filenames>" report with no links is a CLAUDE.md Hard-Rule-5 violation.** Build the link BEFORE rendering any report; same helper used everywhere.

---

# VSL State Variations

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Per-state variant of a winning VSL. Two deliverables per state, fired in order:
1. **Phase 1 — Slides** (edit-swap reference images, Nano Banana Pro)
2. **Phase 2 — Clips** (Veo Lite, one per script line)

**Execution model — same as hvg-flow/hig-flow:** run setup SILENTLY (cwd check, Notion
fetch + parse, sibling-state recon, ref upload, manifest), stop only at a consolidated
preflight before each spend (slides, then clips). **Status is hands-off — leave the request at "Requested" through gen + delivery** (do NOT flip it to "In Progress" on pickup; standing rule, see `feedback_notion_request_status_lifecycle` — Status moves → "Done" only on an explicit turn-in, handled by `notion-asset-delivery`). Never fire without the preflight. Render
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
- Model: **Nano Banana Pro (`nano_banana_2`), 2k, count=1**, 16:9, edit-swap. (2k for full-screen slide detail; count=1 per the universal default — Sam locked all VSL slides to count=1, 2026-05-30.)
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
- **Write the Excel manifest — REQUIRED deliverable, do not skip.** Like hig-flow/hvg-flow,
  every state ships a `.xlsx` audit alongside the JSON shot-list. After slides deliver, run
  the bundled adapter:
  `python3 <skill>/build_slide_manifest.py <Elements/Prompts/vsl_<state>_slides_image_shots.json> "<Slide Images - <State>>/vsl_<state>_slides_shots.xlsx"`
  It bridges the slide manifest → hig-flow's `build_xlsx.py` (Summary + Shots sheets, status
  by one-take-enough coverage). Matches Minnesota's `vsl_minnesota_slides_shots.xlsx`. (Missed
  on Iowa/Nebraska/Oregon — backfilled 2026-05-29; never skip again.)
- **One take per design (count=1 — all VSL slides, Sam locked 2026-05-30).** Each design
  fires once → one file. If it delivers, that design is COVERED — move on. If it fails
  (NSFW / 502 / timeout / bad text swap), re-fire just that design. Count coverage by unique
  design, not raw image count. (If you ever opt into count=2, one good take still covers the
  design — see `feedback_count2_one_take_enough`.)

## Phase 2 — Clips
- Fire **all script lines for THIS VSL** (count varies per VSL — derive from the brief, do
  not assume 17) on **Veo Lite (`veo3_1_lite`), count=1**.
- `--generate_audio true` is MANDATORY (Lite default is false → silent).
- Reference frame per line:
  - Line **has a state slide** → use that slide (`--start-image <UUID>`).
  - Line **has no slide** → pull from `No Slide Reference Shots/` (cycle the pool).
- **Master prompt:** the keynote master, `dialogue` swapped per line, prefixed with
  `Veo video prompt: ` (CLI rejects a leading `{`). The helper embeds the master template.
- **DEFAULT to the HARDENED static-screen master — not the original.** The original master's
  `"locked-off broadcast camera on long zoom, very subtle handheld sway"` is what Veo
  amplifies into the dominant artifact: the **slide background does a zoom-blur / particle-
  smear** push instead of holding still (Nebraska L1/L2/L22, NM L22, etc., 2026-05-29). The
  hardened master kills it at the source:
  - `camera_movement`: "ABSOLUTELY STATIC locked-off tripod shot. The camera does NOT move at
    all — no zoom, no push-in, no pull-out, no dolly, no pan, no handheld sway, no drift."
  - `screen_lock` block naming the on-screen slide as "a STATIC, FROZEN, projected still
    graphic … does NOT zoom, scale, pulse, shimmer, blur, dissolve, drift, or animate … NO
    particle effects, NO light sweeps, NO motion-blur … text pin-sharp, shown once, never
    duplicated. Any photo of a person on the screen is a frozen still — does NOT move, blink,
    or speak. Only the live speaker on the stage floor moves."
  - `action`: "He is the ONLY thing in the frame that moves."
  Verified ~4/5 on the 7-clip refire round (the lone miss was stochastic — a reroll fixed it).
  This SUPERSEDES the separate "talking on-screen photo fix" below — the hardened master folds
  that in (frozen-photo language covers L17/L19/L27/L28). `fire_veo.py` ships the hardened
  master as its default template.
- **Talking on-screen photo fix (client/couple slides — L17/L19/L27/L28).** Veo sometimes
  animates the headshot ON the slide so the photo's mouth moves — stochastic, hits some
  takes not others (Nebraska L17 2026-05-29). On QC, if a slide photo's face moves, refire
  that line with a hardened **`screen_lock` block** in the master: state that the screen
  shows a "STILL PHOTOGRAPH … completely frozen, printed still image — does NOT move, blink,
  breathe, or speak … do NOT animate or lip-sync any face shown on the screen; only the live
  speaker on the stage floor moves." Also reword `action` to "ONLY Chad speaks; his mouth is
  the only mouth that moves in the entire frame." Fixed Nebraska L17 on the first attempt.
  (This is a pre-delivery quality regen → overwrite the bad v01, per visual-qc rule.)
- **L2 numbers line — SPELL the per-year figure as thousands, never "[teen/ty] hundred."**
  Veo's TTS truncates "eighteen hundred" → spoken "eight hundred" / "800" (Whisper-confirmed
  on Oregon + NM L2, 2026-05-29 — it drops the "eigh-"). Brief copy says "eighteen hundred",
  "twenty three hundred", etc. — REWRITE the spoken dialogue to "one thousand eight hundred",
  "two thousand three hundred", "two thousand eight hundred", "one thousand four hundred", etc.
  Verified clean reads after the fix ("1,800 / 2,300 / 2,800 / 1,400"). This is a deliberate
  VO-wording change from the brief; the on-screen slide still shows the exact `$X,XXX` figure.
  Apply to EVERY state's L2 (the truncation is systematic, not random).
- **Whisper-verify the L2 read automatically — it's the one audio QC that works.** After Phase 2,
  transcribe each state's `L2_<st>_v01.mp4` (`whisper … --model base --language en`) and confirm
  the per-year number reads in full (e.g. "2,300", not "300"/"800"). Numbers truncation ships
  silently otherwise. (Whisper may mis-spell the demonym — e.g. "Arkinsons" for "Arkansans" —
  that's a transcription quirk, not necessarily a Veo defect; spot-listen to confirm.)
- **QC reality — filmstrips CANNOT catch motion artifacts.** The 5-frame filmstrip (visual-qc
  skill) catches static defects (text garble, composition) ONLY at full res, and is BLIND to
  the dominant failure modes here: zoom-blur, particle-smear, and talking-photo all live in the
  motion *between* sampled frames. A 5-frame "PASS" on these is a false pass (cost us on
  Nebraska L17, 2026-05-29). For motion artifacts, **a human watches the slide-backed clips**
  (L1/L1_2/L1_alt, L17/L19, L22/L39/L40/L41) — there is no reliable automated detector yet.
  Don't report a motion PASS you can't back up; deliver + hand the editor the paths to eyeball.
- Resize any slide >1920px before using it as a Veo ref (slides are 2752×1536).
- **NSFW handling — escalate, don't just re-roll.** Chad trips Veo's stochastic NSFW filter
  ~20-30% (Iowa: 5 of 17 first pass; Nebraska: 2 holdouts). Blind back-to-back re-rolls waste attempts on the
  same hot window. The ladder (TIGHTENED 2026-05-30 to save credits — **initial + 1 plain refire
  + 1 SFW refire = 3 swings total**, then flag; down from the old 3 plain + 2 SFW. The hot lines
  rarely recover late, so the extra attempts mostly burned credits on clips headed for manual):
  1. **Initial fire + 1 plain refire** = 2 plain attempts on the plain master (`--attempts 2`).
  2. Still flagged → **1 SFW-reinforced refire** (`--sfw --attempts 1`) (Iowa 2026-05-29 recovered
     4/5, 3 on first attempt — the SFW pass usually lands on attempt 1 when it works at all). The diff: wardrobe `fitted ...turtleneck` →
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
    passes. Expect these two to need hand-firing most states; not worth burning extra attempts
    on them. Fire the batch (1 plain), run one SFW pass (1 attempt), flag L19/L40 if still down,
    move on. (If a future tweak reliably cracks them, update this.)
- Output: deliver to `Elements/Footage/Veo/<State>/` as `L<NN>_<st>_v01.mp4`. **Every delivery report — Phase 1 slides, Phase 2 clips, any intermediate refire** — renders the two-link block (📁 Path + 🔗 Open via `linkyourfile.py`). NEVER a bare relative path or filename list. Same helper, same format, every time.
- **Two-link handoff (standing rule, `feedback_two_link_lucid_handoff`):** when reporting a delivered state, close with BOTH the raw Lucid **Path** (backticked, for Finder) AND a clickable **Open** link for the clips folder `Elements/Footage/Veo/<State>/` (and the slides folder when relevant) — build via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`, render as `[<State> ↗](url)`. Lucid `/Volumes/ads/…` paths only.

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

## Phase 3 — Visual QC (REQUIRED before declaring a state done)
**Filmstrip QC is NOT sufficient for this VSL** — learned the hard way 2026-05-30 (false-PASSED
5 Nebraska clips on 380px filmstrips, incl. a talking photo I declared "fixed, holding"). The
dominant failure mode here is Veo *animating the slide it should hold frozen*, and a sparse
5-frame strip at low res cannot see it. Two-part QC instead:

**Part A — motion_qc.py (automated, catches the wide artifacts).** Ships with this skill.
`python3 <skill>/motion_qc.py "<Veo/State>" --fps 4 --json out.json`. Dense-samples frames,
frame-diffs the SLIDE region (top ~60%, excluding Chad's center column) vs a static stage-floor
baseline. Verdicts: **FLAG** (slide_motion≥12 & ratio≥1.7, or ≥20) = zoom-blur / particle
dissolve / smear; **REVIEW** (slide_motion≥6.5 & ratio≥1.85) = mild text garble, eyeball it;
**OK**. Calibrated on Nebraska ground truth (cleanly separates the 15-25 artifacts from <7 clean
clips). Treat FLAG = refire, REVIEW = look at a full-res crop.
- **Known limit — does NOT catch the talking on-screen photo.** Tried a localized cell detector;
  it false-flags every clip because Chad stands *inside* the slide region and his gestures spike
  any local cell. Frame-diff cannot separate a small moving mouth from a moving presenter in the
  same zone. `cell_max` is emitted as INFO only, not a gate.

**Part B — human-eye pass on the 4 photo-slide clips only (L17/L19/L27/L28).** Open each, watch
the on-screen headshot/couple photo: if its mouth moves, it's a talking-photo → refire with the
hardened `screen_lock` master (see Phase 2). Bounded to 4 clips/state. Stochastic per-gen — L17
can animate while L19 (same person's portrait) doesn't; same dice as the NSFW/CTA holdouts.
*Hypothesis (unconfirmed):* a source headshot with any lip-parting primes Veo to animate it —
prefer explicitly closed-mouth client photos in Phase 1. Lowers odds, doesn't eliminate.

**Refire any FLAG/REVIEW/talking-photo with the hardened static-screen master, then re-QC —
ONE attempt, then flag manual** (set 2026-05-30; motion artifacts are stochastic and usually
clear on a single reseed, so 1 hardened refire is the cap — a clip that still won't hold frozen
after one hardened refire is a manual job, don't burn credits chasing it). Pre-delivery quality
regen → overwrite the bad v01 (per visual-qc rule). Don't ship a state until motion_qc is clean
(or its stubborn flags are manual-noted) and the 4 photo clips pass the eye.

## HOME-vertical variant (vs the Auto default above)
The skill also covers the **Average HOME State Cost Pitch** family (Vertical "Home - Forms"),
a separate project folder: `Home Insurance - Completed Creatives/.../05.07.25 - VSL - Average
Home State Pitch Variations`. Same Chad character + two-phase flow, but the Home convention
differs from Auto on several axes — verified on Montana 2026-05-30. **Apply ALL the Auto prompt
lessons (hardened static-screen master, L2 spelled-thousands, Whisper-verify, NSFW ladder,
talking-photo fix) to Home too — the pre-existing Home states (Texas etc.) predate those fixes,
so don't copy their old masters; carry the hardened ones over.**

Home-specific conventions to honor:
- **Base = Nebraska-Home**, not Florida. Edit-swap bases live in `Slide Images - Nebrask + Generic/`.
- **Title = "<State> Home Protection Summit 2026"** (not "Auto Insurance Conference"), with a
  **house icon** (not a car). Keep the house icon locked in the edit-swap.
- **ANNUAL rates**, not monthly. Slides read "$X,XXX PER YEAR" (the per-month figure is the
  smaller secondary number). Client/couple slides show yearly figures (e.g. $3,700/yr → $1,400/yr).
- **count=1 for CLIPS** (fire each line ONCE; the retry ladder is the only path to a 2nd
  attempt — initial → 1 plain refire → 1 SFW refire, then flag). CHANGED 2026-05-30: Home
  clips were briefly fired count=2 to match the pre-existing Home states, but Sam corrected it —
  **try to land a usable clip on the FIRST generation, don't auto-fire a redundant 2nd take.**
  Applies to BOTH Auto and Home clips. **Phase-1 SLIDES are now count=1 too** (Sam locked all
  VSL slides to count=1, 2026-05-30) — fire each design once; if Nano fumbles text, refire that design.
- **Filename convention:** `vsl_avg_home_state_pitch_<st>_L01_v01.mp4` (slug prefix, zero-padded
  L number, `_2`/`_alt` suffixes for the title variants) — NOT Auto's `L1_<st>_v01.mp4`.
- **Home baseline SCRIPT differs from Auto on ~18 of 41 lines** — pull the unchanged lines from
  the **Nebraska-HOME** original (`34f16771e7808184be25de9523380b1a`), NOT the Auto baseline.
  Home-specific lines: home discounts (claims-free / non-smoker / bundling), credit-score
  qualifier (L24), "homeowners" not "drivers", "every single year" not month, $369/yr threshold,
  "home insurance rate" CTA. The state brief lists only the ~12 state-changed lines; merge them
  over the Home-Nebraska baseline.
- **CTA slides ARE still state-specific** ("<STATE> ZIP CODES") — same as Auto, edit-swap the 3.
- **Master:** Home keynote setting ("home insurance industry keynote stage"), `generate_audio:true`
  with an explicit `audio_required` block. Use the hardened static-screen master adapted to the
  home setting (see Montana fire script 2026-05-30).

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
