---
name: ag.storyboard
description: >-
  Render every first frame of a LOCKED scene as native 9:16 anchored singles fired through ag.scene.flow's gated fire_frame.py (stage-routed engines, camera-derived ref stacks), with locally-composited contact sheets for review — continuity proven BEFORE clip spend. Use on: 'storyboard this' / 'board the frames' when a scenelock exists. A WRITTEN coverage/cut plan from a script routes to wr.shotboard, not here.
---

# ag.storyboard — Anchored Singles (ONE method, unified 07.30.26)

Born 07.28.26 on Skit - Courtroom; rebuilt 07.30.26 per the Seedance anti-drift research after the skill accumulated three contradictory methods. **This file now carries exactly one method.** The old methods and the lessons they taught live in `references/RETIRED-METHODS-HISTORY.md` — history, never execution guidance.

## THE METHOD

> **Final clip anchors are native full-resolution 9:16 singles, fired one per shot through `ag.scene.flow/scripts/fire_frame.py`, which derives everything from the SCENE_BIBLE: the shot's assigned camera's approved 9:16 reference (spatial authority, image 1), the locked tableau (GRADE-ONLY authority, image 2 — never geometry, see law 3b), and the masters of exactly the characters in the shot — with a stage-routed engine, explicit REFERENCE ROLES in the assembled prompt, and a two-hop edit cap. Contact sheets are composited LOCALLY from approved singles for review. Generated multi-panel sheets and Shots grids are coverage previz only — never clip anchors.**

## 🔴 GATE 0 — the bible's five locks + a camera plan

No panel fires until `scene_bible.py status` shows all five locks approved AND every shot in the batch has a `camera:` assignment whose camera carries an approved `reference_frame_9x16`. A character or camera not in the bible → stop, lock it with the editor first.

## 🔴 THE LAWS (every one paid for on 07.27-30.26)

1. **Fire through the gate, never by hand.** `fire_frame.py` is the only fire path — it refuses missing cameras, missing 9:16 refs, missing masters, missing assembled prompts, and third-hop edits. Hand-typed `higgsfield generate` calls for storyboard frames are a violation even when "faster."
2. **Ref aspect == render aspect.** 9:16 renders take 9:16 references. Wide plates fed to tall renders stretch anatomy and rescale furniture (the S05/S13 proportion failures). The gate enforces this.
3. **Stage-routed engines, recorded in the bible.** `gpt_image_2` (7cr) is the DEFAULT for face-forward anchors (Sam's A/B, 07.30: superior skin/identity) · `nano_banana_2` (2cr) for edits, sheets, props and drafts · `flux_2 --model max` for geometry-critical re-angles · `seedream_v5_pro` for one-variable repairs on otherwise-approved frames · engine recorded per fire in the bible. Never assume one engine fits every stage; never pick by beauty over continuity.
3b. 🔴 **THE TABLEAU IS A GRADE AUTHORITY ONLY — NEVER GEOMETRY (Sam, locked 07.30.26).** The tableau was shot from ONE camera position; passing it as a world reference to a camera pointing a different direction makes two references assert mirrored room layouts, and the model splits the difference — doors slide off-centre, audiences get re-invented, walls drift (S17 v03). In every assembled prompt image 2 contributes light, exposure, contrast, palette and material feel and NOTHING else; **image 1 (the shot's camera reference) is the sole authority for room layout, wall/door positions, furniture and who sits where.** Enforced in `scene_bible.py`'s REFERENCE ROLES emitter — never restate the tableau as a world/set reference.
4. **Geography is room-relative, defined once** from one named camera direction; per-shot screen directions derive from that shot's camera. Person-relative wording is linted out by the bible.
5. **Eyelines direct by HEAD POSE, not pupils** ("head in three-quarter view facing the frame's RIGHT — nose toward the right edge, eyes following"). In performance edits, restate the eyeline as the FIRST correction.
6. **OTS panels name the foreground shoulder's frame side AND its owner by wardrobe** — the side derives from the eyeline lock (speaker looks frame-right → shoulder right foreground); an unowned dark shoulder renders as a phantom character.
7. **Props are declared per shot with a negative, and dialogue NEVER enters a frame prompt as quoted text** — the assembler converts it to mouth-state context (burned-caption bug, S15).
8. **Two-hop cap, tracked in the bible.** Hop 0 = approved canon/crop-as-reference · hop 1 = first render or single-change edit · hop 2 = one repair. A third change = rebuild from clean canon with every learned correction in ONE prompt; the gate refuses hop 3.
9. **Crops never create shots** — a re-framed crop is not composed for its aspect. Crops are reference extractions and QC aids only. (Native singles ARE the deliverables; camera 9:16 refs are cut FROM approved plates, which is legal reference use.)
10. **Look at every PNG before delivering it.** Read the file, compare against the shot spec, the camera's reference background, the population count, the prop state, and structure vs the env authority (jury tiers, wainscot lines). Report what you SEE — including failures — before the editor has to.

## Run it

1. **Gate 0** — `scene_bible.py status` all-green; cameras assigned + 9:16 refs approved.
2. **Per shot, in board order:** `scene_bible.py assemble --shot <ID>` (emits REFERENCE ROLES + verbatim canon + the shot's one delta) → `fire_frame.py <bible> --shot <ID>` (add `--engine` only for a routing exception; add `--extra-prompt` only for an editor-approved per-take correction).
3. **Stream every frame the instant it lands** (📲 + widget + your honest lint read). One shot first as a format proof when entering a new camera; never fire a long run blind.
4. **On the editor's approval:** `scene_bible.py qc --shot <ID> --verdict PASS`, set `start_frame`, and composite the running contact sheet locally (PIL) for review — the sheet is downstream of approvals, never generative.
5. **Repairs:** one-variable `seedream_v5_pro` edits via the gate (`--engine seedream_v5_pro`), counting a hop. Third change → rebuild.
6. Clips fire only after `fire-check` passes (qc_pass + start frame present) — through the clip gate, with Seedance `--start-image` strict mode.

Output → `Elements/Footage/Reference/Storyboard v3/Frame_S<xx>_v<NN>.png` (vN in place, never overwriting; superseded takes archived only on the editor's word). Standard Lucid handoff (📁/🔗/🦊/📲, folder-first).

## Where it sits

`wr.shotboard` (written coverage plan, board_lint-gated) → `ag.scene.flow` (bible: locks, cameras, assembly, fire gates) → **`ag.storyboard`** (approved native anchors) → Seedance clips off approved anchors → edit.

## Not for
NOT for: planning the shot list (`wr.shotboard`), locking canon (`ag.scene.flow` / `ag.scenelock`), single one-off frames outside a scene-flow project (`higgsfield-image-generation`), or firing clips. This skill produces APPROVED FRAMES; the editor triggers clip gen.
