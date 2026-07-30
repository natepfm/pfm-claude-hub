---
name: wr.shotboard
description: >-
  Turn a finished PFM script into a commercial-grade WRITTEN shot board — coverage plan, cut rhythm, gen-unit grouping, scene-frame prompt seeds — so AI-gen creatives cut like a real spot. Use on: 'shot board', 'shot list', 'plan the coverage', 'make it cut like a commercial'. RENDERED frame sheets of a locked scene route to ag.storyboard, not here.
---

# wr.shotboard — Commercial Shot Board for AI-Gen Creatives

## 🔴 CHECKLIST — every board, before it ships

1. **Gate 0 first**: locked script + locked environment + approved masters all exist, or STOP and name the gap.
2. **Draft the board** encoding the grammar + AI laws below. The Shot column uses ONLY the framing vocabulary: `WIDE / MS / MCU / CU / ECU / OTS / react / insert` (compounds like `MS→MCU` fine) — the lint parses it.
3. **🔴 RUN THE LINT — no delivery without it (added 07-29 after repeated skipped-rule boards on the Seedance creatives):**
   ```bash
   python3 ~/.claude/skills/wr.shotboard/scripts/board_lint.py "<project>/Elements/Prompts/SHOTBOARD.md"
   ```
   It machine-checks the greppable laws (axis/eyelines/screen directions stated, framing vocab, dialogue never on a bare wide, wides ≤2 and non-speaking, size change on every cut, punch-ins ≤2, gen-unit coverage, seeds + register block) and prints the judgment items as MANUAL — eyeball each one and say so. **Exit 1 = fix and re-run. The board ships only on exit 0**, and the delivery message names `board_lint PASS` (DONE = a check passed).
4. **Deliver** with the standard handoff (📁 + 🔗 on the Prompts folder). This skill fires NOTHING.

The maiden board itself carried a lint-catchable violation (S18→S19, two consecutive same-subject MCUs) through four review passes — that is why step 3 is not optional.

Maiden run: Skit - Courtroom, 07.27.26 (Sam: "looks like an expert cinematographer put this together"). This skill turns a locked script + locked environment + cast into the coverage plan that makes the final edit cut like a real commercial. It sits BETWEEN `wr.aiscript` (the script) and scene-frame/clip generation (`ag.` family): script → **shot board** → scene frames → clips → edit.

## Inputs (Gate 0 — all three must exist before boarding)
1. **The locked script** — numbered clips, from the request's Copy callout (ONE canon).
2. **The locked environment** — ideally a 360-sheet master + cropped angle plates (see `feedback_environment_lock_360_sheet_standard`: NB Pro 2×2 off the picked hero → crop Front/Back/Left/Right). If the env isn't locked yet, stop and lock it first — the board's axis and eyelines are DERIVED from the room's real geometry.
3. **The cast** — approved character masters for everyone on screen.

Missing one → name the gap and stop. A board built on an unlocked room gets invalidated the moment the room changes.

## The grammar (encode ALL of these in every board)

1. **One axis, never crossed (180° rule).** Draw the line of action between the two conversing characters. Camera stays on ONE side for the whole scene. Anchor the axis to the locked room's real geometry and STATE the resulting screen directions in the board header (e.g. "jury box always screen-left, windows screen-right, doors behind camera"). A new speaker pairing may define a new axis — state it.
2. **Eyeline lock.** Character A always looks frame-right; character B (and any later B-side speaker) always frame-left. Same eye height across all singles. Opposed eyelines = the conversation reads.
3. **Change size on every cut.** Never cut between near-identical framings of the same subject (CU → MS → MCU → ECU). The axial punch-in (same angle, tighter) is reserved for THE emphasis beat — one or two per spot, not a habit.
4. **Comedy cutting.** Cut ON the last word of the joke, straight into a reaction. Hold reactions ~1s — the laugh lives in the reaction shot. Repeated-line echoes (the "Nine years / Nine years" pattern) = escalating snap cuts, each tighter.
5. **Inserts & cutaways are the commercial feel.** Prop ECUs (the exhibit, the printouts), bystander reactions, silent deadpan beats. Target a cut every 3-4 seconds; the inserts are what get you there without churning the singles.
6. **Cold open tight.** Commercials open on the hook (a CU), not an establishing wide. The wide comes later, spent on ACTION (an entrance, a reveal), and there's usually only one.

## AI-production laws (layer on top — non-negotiable)
- **Dialogue lands ONLY on MCU or tighter.** Small faces fail lip-sync (`feedback_veo_wide_shot_lip_sync`). Wides = non-speaking action or back-to-camera moments only.
- **Two-speaker clips = OTS favoring the ANSWERER**; the asker is back-to-camera / off-screen — only one mouth ever has to sync.
- **Every clip ref = a SCENE FRAME** (character master composed into the env plate), never a bare master (`feedback_veo_ref_scene_frame_not_master`). Ref aspect == render aspect (`feedback_veo_ref_aspect_match`).
- **Commercial look language in every prompt seed:** camera on sticks / dolly energy, 35mm lens feel, eye level unless noted, the locked room's real light. Explicitly negative: no handheld shake, no phone-camera look. (Opposite of the iPhone-authentic b-roll house style — do not mix the two registers in one creative.)
- Compliance negatives ride along per project (e.g. the courtroom's no-flags/no-seals/no-bench set).

## Output — SHOTBOARD.md into `Elements/Prompts/`
One markdown file, this exact shape (match the maiden: `07.27.26 - Skit - Courtroom/Elements/Prompts/SHOTBOARD.md`):
1. **Header** — the grammar system as applied to THIS room (axis, screen directions, eyeline assignments).
2. **The board table** — `# | Beat | Shot | Framing & blocking | Cut logic`, one row per shot, script beats fully covered, cut-every-3-4s pace. Shot count typically ~2× the script's clip count.
3. **Gen-unit grouping** — map shots → gen units. Seedance 2.0 first (multi-shot internal cuts inside one ≤15s gen — group so internal cuts land on the comedy); Veo fallback = one shot per clip.
4. **Scene-frame prompt seeds** — a Common block (look + negatives) plus per-shot framing lines naming: framing, blocking, eyeline, which env plate (by camera direction), which master(s).

Deliver with the standard Lucid handoff (📁 + 🔗; 🦊 at delivery). The board is a WRITING deliverable — this skill fires NOTHING. Scene-frame gen is the editor's next call through the `ag.` path.

## Not for
NOT for: story beats (`wr.beats`), writing/rebalancing the script itself (`wr.aiscript`), single-clip Seedance prompt craft (`ugc-cinematic-prompt`), firing scene frames or clips (`ag.` family), or shot-listing REAL shoots (PFM's filmed story ads stay minimal-shot-list by design — see production-flow; this skill is for AI-GEN creatives only).
