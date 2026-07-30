---
name: ag.scene.flow
description: "PFM's LOCK-KEY orchestrator for multi-shot AI scene creatives (skits, scene-based spots with recurring cast + dialogue): ONE machine-readable SCENE_BIBLE.yaml drives the whole chain — script → cast/outfits → environment → tableau → blocking all LOCKED behind editor approvals, every shot prompt ASSEMBLED from verbatim blocks, no clip fires until qc.storyboard passes. Use on: 'run the scene flow', 'scene flow', 'lock-key flow', 'set up the scene bible'. Per-creative and editor-invoked ONLY — never applies itself to a project."
---

# ag.scene.flow — the lock-key scene flow (`ag.` asset-gen family)

## 🔴 CHECKLIST — every run, top of mind

1. **Editor-invoked, per-creative.** This flow exists only on projects Sam/an editor explicitly runs it on. Never suggest-and-start it yourself.
2. **The bible is the ONLY source of truth.** Every fact lives in `Elements/Prompts/SCENE_BIBLE.yaml` exactly once. Prompts are ASSEMBLED by `scene_bible.py assemble` — never hand-written, never edited after assembly. Found a fact that needs changing? Change the bible, re-validate, re-assemble.
3. **Locks turn IN ORDER, each behind the editor's approval**: script → cast → environment → tableau → blocking. Produce the stage's artifact → SHOW it (📁/🔗/📲 + widget) → STOP. Only after the editor approves do you run `lock`. The script refuses out-of-order locks; you never argue with it.
4. **Verbatim means verbatim.** Identity, outfit, environment, grade, geography blocks are pasted unchanged into every prompt (the assembler does this mechanically — the 40% consistency swing between copy-paste and casual rewording is measured, not folklore). You never retype or "improve" a locked block.
5. **≤3 negatives per shot.** Pixels carry the world; negatives are only for what pixels can't forbid. The lint refuses more.
6. **No clip fires without `fire-check` passing** — which requires a qc.storyboard PASS and a cropped start frame. No exceptions, including "it looks fine."
7. **All ag.scenelock craft laws still apply** — room-relative geography, anchored positions, body orientation, pixel authority, single-panel repair, LOOK at every sheet. This flow doesn't replace [ag.scenelock](../ag.scenelock/SKILL.md); it sequences it and makes its state machine-checkable.

## What this is

Born 07-28 from the Codex storyboard audit + best-practices research: PFM's craft was right, but production truth was fragmented across prose files, so superseded decisions kept re-entering prompts (the courtroom podium existed and didn't exist at the same time). The fix: **one canonical scene state, locks turned in a fixed order behind editor gates, prompts derived — never duplicated.**

The engine is `scripts/scene_bible.py`. The laws are refusals in that script, not paragraphs here.

## The flow

Stage artifacts come from the EXISTING skills — this flow only sequences them and records state:

| # | Lock | Built with | Editor approves | Then run |
|---|------|-----------|-----------------|----------|
| 0 | — | `scene_bible.py init --project <folder> --scene-id <id>` | — | — |
| 1 | script | wr.request / script canon | the locked script | `lock <bible> script --by Sam` |
| 2 | cast | pfm-character-master + Outfit IDs → filled into bible `cast:` | masters + outfits | `lock <bible> cast` |
| 3 | environment | ag.loc.360 / environment-location-builder → 360 sheet | hero + sheet | `lock <bible> environment` |
| 4 | tableau | ag.scenelock step 4 (populated master tableau) | the pick ("that's the world") | `lock <bible> tableau` |
| 5 | blocking | ag.scenelock step 4b (blocking plate) → positions/facing/axes into bible | the plate | `lock <bible> blocking` |
| 6 | shots | wr.shotboard → shot cards into bible `shots:` | the board | — |
| 7 | boards | ag.storyboard, panels prompted via `assemble --shot <ID>` | per-sheet | — |
| 8 | QC | [qc.storyboard](../qc.storyboard/SKILL.md) → `qc --shot <ID> --verdict ...` | — | — |
| 9 | crops | approved panels cropped → `start_frame:` filled | — | — |
| 10 | clips | fire ONLY after `fire-check --shot <ID>` exits 0 | Fire? per Rule 1/3 | — |

`status <bible>` prints the gate dashboard any time the editor asks "where are we."

As you fill each section, run `validate` — it lints for the drift patterns that burned the courtroom: person-relative geography, zone-not-anchor positions, missing facing, unknown characters, >3 negatives, empty framing.

## Repairs and iteration

- A failed panel/shot repairs as a **single variable** off approved pixels (ag.scenelock laws 0a/0b). Approved panels are immutable; sheets rebuild locally.
- A changed creative decision (prop added, wardrobe change, position move) is a **bible edit first** — then re-validate, re-assemble affected shots, and flag which already-approved frames the change contradicts (continuity is timeline-wide).
- Every QC verdict is recorded via `qc` so the bible's `qc_log` is the audit trail — no vibes, no unrecorded passes.

## Not for

NOT for: single-character talking heads (UGC/podcast skills), b-roll batches (type skills), one-off images, real shoots, or any creative the editor hasn't explicitly put through this flow. It layers ON TOP of ag.scenelock / wr.shotboard / ag.storyboard — it never replaces them, and running those skills solo (without a bible) remains fully valid for projects that don't need this.
