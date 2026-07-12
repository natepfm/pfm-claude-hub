---
name: broadcast-news-stills
description: PFM's broadcast-news STILLS type skill — anchor-desk shots, field-reporter standups, sit-down local-TV interviews, and news b-roll cutaways that read as a still from a REAL local news broadcast, not a photo shoot. The b-roll counterpart for breaking-news / news-wrapper creatives. Owns the news-look craft (scene-not-frozen-frame framing, ENG-camera declaration, lavalier mics = the #1 tell, off-camera interview eye line, chyron-safe negative stack) and fires through the shared pipeline spine. Prompt BODIES come from `nano-banana-prompting` broadcast mode (single source — this skill doesn't duplicate it). Use when an editor says "news stills", "anchor shot", "anchor at the desk", "field reporter standup", "local news interview shot", "make the news b-roll", "broadcast interview still", "couch interview news look", or a breaking-news creative needs its anchor/reporter/interview stills. Default: Nano Banana Pro (`nano_banana_2`) 1k, count=1, 9:16 (16:9 only if the request is horizontal). NOT for: the LATU headline / phone-number lower-third strips (use `bn-lower-thirds`), the SaveMaxAuto EndCard-on-the-video-wall composite (use `anchor-wall-composite`), writing the news script (use `breaking-news-story-ads`), moving news clips (use `hvg-flow`), or a person holding a phone with a quote (use `social-proof-phone-quote`).
---

# Broadcast News Stills (PFM)

The b-roll TYPE skill for the news look — the still must read as a **frozen moment from a real local
TV broadcast**, not a professional photo. This is what feeds the breaking-news / news-wrapper
creatives (the LATU News family): the anchor at the desk, the field reporter on location, the
regular-people sit-down interview on their couch.

## Role — type skill, fires through the spine

This skill owns the **broadcast craft + the shot list**. It does NOT hand-roll firing — that's the
shared **pipeline spine** (`~/.claude/skills/hig-flow/fire_batch.py`; contract in
`hig-flow/PIPELINE-SPEC.md`): pre-upload → concurrent fire (Rule-5 streamed) → serial verified
download → manifest → 📁/🔗/🦊 handoff, with the AGF interlock wrapping it. **The prompt BODIES come
from `nano-banana-prompting` broadcast mode — load it and use its templates verbatim** (anchor-at-desk,
field-reporter standup, sit-down interview). This skill is the front door + the workflow; that skill is
the single source for the prose. Don't duplicate its templates here.

## The five broadcast locks (why a news still reads real)

Each is a defect that turns the still back into stock. Full prose + templates live in
`nano-banana-prompting` broadcast mode; these are the load-bearing anchors:

1. **Scene happening, NOT a frozen frame.** Describe *"a local TV news interview with a couple on their
   couch"* — never *"a paused video frame from a news broadcast"* (NB reads "paused frame" as glossy
   still with a video grade = a different flavor of stock).
2. **Broadcast ENG camera declaration.** *"Shot on a broadcast ENG camera — deeper depth of field than
   cinema, slight video softness, standard broadcast color grade."* Not cinema, not DSLR, not iPhone.
3. **Lavalier mic on everyone in frame — the #1 tell.** *"a small black lavalier microphone clipped to
   [garment] near the second button, thin black cable running down behind the clothing."* Real news
   crews mic everyone; stock never does. This is the single strongest broadcast-authentic signal.
4. **Eye line by role.** Anchors at the desk / reporters doing standups → locked on lens. Interview
   subjects → **off-camera** eye line (talking to an unseen interviewer, not the lens).
5. **Chyron-safe negatives.** *"No text on screen. No chyrons. No lower-third banners. No LIVE bug. No
   station logo. No watermarks. No other people in frame."* — the graphics are added in the edit
   (`bn-lower-thirds`) / composited later; the still stays clean.

## Config → the spine

The job list this skill hands `fire_batch.py` declares:

- `gen`: `{ "model": "nano_banana_2", "resolution": "1k", "count": 1, "aspect": "9:16" }` — 16:9 ONLY
  when the request/creative is horizontal (CTV / anchor-wall). Default 9:16 (locked 2026-06-17).
- `outDir`: the project's `Elements/Footage/Primary/News Stills/` (or the creative's convention).
- `naming`: `{nn}_{shot}_{hex}.png` — unique `{hex}` (DaVinci auto-group guard).
- `manifest`: `"md"`.
- Refs: a subject's character master when it must be a specific person (identity lock), else pure prose
  (vary age / ethnicity / setting per `feedback_social_proof_selfie_variety`). Anchors/reporters are
  usually recurring cast — reuse their masters from the Library.

## Flow

1. **Scope [SILENT].** Confirm cwd is the project. From the news script / brief, list the shots the
   creative needs — anchor desk intro, anchor + wall (if it has a video wall — the wall CONTENT is
   `anchor-wall-composite`, not here), field standup(s), sit-down interview(s), any news b-roll
   cutaway. Note which subjects reuse Library masters vs need one (build via `pfm-character-master`
   first — spec or photo mode; a wrong face multiplies).
2. **Shot list.** One row per still: `NN | shot type | subject + setting | ref (master or prose) | eye
   line`. Match each to its `nano-banana-prompting` broadcast template.
3. **Prompt craft [SILENT].** Pull the matching template from `nano-banana-prompting` broadcast mode,
   fill it (identity lock + ordinary wardrobe + lavalier + ENG declaration + chyron-safe negatives +
   brand-clean stack per `feedback_pfm_brand_clean_rules`). Write the shots into a job list.
4. **Preflight → Fire? → spine.** Dry-run the spine (no `--fire`) for the cost line, show the preflight
   (Rule 3 card if ≥20). On Fire?:

   ```bash
   python3 ~/.claude/skills/hig-flow/fire_batch.py "$JOBLIST" --fire --project-root "$(pwd)"
   ```

   Relay each `LANDED` line the instant it prints (Rule 5). The spine downloads + writes the `.md`
   manifest + prints the 📁/🔗/🦊 handoff.
5. **Offer QC — the editor decides refires.** Local fires are NEVER auto-QC'd; after the results land
   and are SHOWN (Rule 5), OFFER QC via a plain ask (AGF/mini keeps mandatory QC). The checklist is the
   five locks — especially lavalier present, eye line correct per role, no chyron/logo bleed, reads as
   broadcast not stock. When a still misses: name the miss in one line, SHOW it, STOP — re-firing as the
   next version is the editor's call, never self-initiated.

## What NOT to do

- ❌ Use the iPhone-candid template — it fights the broadcast look (`nano-banana-prompting` says so).
- ❌ "Paused video frame from a broadcast" phrasing — reads glossy-stock; describe the scene happening.
- ❌ Drop the lavalier — it's the #1 authenticity tell.
- ❌ Bake chyrons / lower-thirds / station logos into the still — those are the edit's job
  (`bn-lower-thirds`) / composite (`anchor-wall-composite`).
- ❌ Build the anchor's video-wall content here — that's `anchor-wall-composite`.
- ❌ Hand-roll the fire — build the job list, call the spine.

## Cross-references

- `nano-banana-prompting` — **broadcast mode = the single source for every prompt body** (load it).
- `hig-flow` / `PIPELINE-SPEC.md` — the fire/deliver spine this fires through.
- `bn-lower-thirds` — the LATU headline / phone-number strips added in the edit (not here).
- `anchor-wall-composite` — the SaveMaxAuto EndCard on the anchor's video wall (breaking-news only).
- `breaking-news-story-ads` — writes the news script/wrapper this produces stills for.
- `pfm-character-master` — build a recurring anchor/reporter/subject master first (spec or photo mode).
- Memory: `feedback_pfm_brand_clean_rules`, `feedback_social_proof_selfie_variety`,
  `feedback_broll_filename_unique_hash`, `feedback_broadcast_video_frame_look`.
