---
name: qc.storyboard
description: "Storyboard-panel QC against the SCENE_BIBLE — the gate between rendered boards and clip spend in ag.scene.flow: per-panel continuity, animation-readiness and editorial checks with a machine-readable PASS/FAIL verdict recorded into the bible. Use on: 'QC the storyboard', 'check the boards', 'run storyboard QC', or automatically as step 8 of ag.scene.flow. 🔴 EDITOR-INVOKED on standalone boards (local-fire zero-QC law applies); mandatory only INSIDE an ag.scene.flow run."
---

# qc.storyboard — the board gate (`qc.` family)

## 🔴 CHECKLIST — every run

1. **LOOK at every panel.** Read the actual PNGs. Never verdict from the prompt or from memory of what was asked for — describe what you SEE, flaws first.
2. **One verdict per shot, machine-recorded**: `scene_bible.py qc <bible> --shot S03 --verdict PASS|FAIL --reason "..."`. A FAIL without a reason is refused by the script — the reason is what makes the repair single-variable.
3. **Show the editor the panels + your verdicts together** (📁/🔗/📲 + widget), verdicts BELOW the images, never as a gate on the reveal (Rule 5).
4. **A FAIL repairs ONE panel, ONE variable** — approved panels are immutable pixels (ag.scenelock 0b). Never re-roll a sheet containing approved panels.
5. **Scope**: inside ag.scene.flow this gate is mandatory before any clip fire (`fire-check` enforces it). Outside a scene-flow project, run only when the editor asks.

## The rubric — check each panel against the BIBLE, not against taste

### Continuity (vs. bible locks)
- Identity matches the character master (face, hair, build)
- Wardrobe matches the Outfit ID block — item by item
- Room geometry matches `geography.room_relative` (walls, fixtures on correct sides)
- Character position + facing match their bible blocks
- Axis + screen direction match the shot's declared axis
- Eyeline matches
- Background population present per the verbatim block (empty jury = drift tell)
- Props/object state consistent with pixel authority — and with EVERY earlier approved frame that sees the same floor (continuity is timeline-wide)
- Grade/light matches the tableau (motivated key, falloff — not flat AI fill)
- **Shot size + composition match the card's `framing`** — an MCU that landed wide is a FAIL even if everything else is beautiful (the courtroom's proven failure mode)
- Nothing from `forbidden_on_camera` in frame; no invented set elements

### Animation-readiness (will this panel survive being a start frame?)
- Clear silhouette, plausible pose, clean hands/prop contact
- Mouth state appropriate for the dialogue (speaking shot ≠ sealed lips)
- Physical room in-frame for the planned motion; defined action vector
- No impossible limb intersections; stable background around limbs that will move
- Safe area clear for captions/CTA where the creative needs them
- End state achievable when the shot is a bounded clip (`end_frame_required: true`)

### Editorial (vs. the shot card)
- Panel serves the card's `beat`; contrasts with adjacent coverage; the cut into/out of it has a reason

## Verdict format

```
S03 — FAIL
Reason: requested MCU landed as a wide two-shot; framing does not match the card.
Repair: re-angle from approved blocking pixels — same room, people, grade; fix framing only.
```

Then record it: `python3 ~/.claude/skills/ag.scene.flow/scripts/scene_bible.py qc <bible> --shot S03 --verdict FAIL --reason "MCU landed wide"`. PASS verdicts record the same way — the bible's `qc_log` is the audit trail, and `fire-check` reads `status`, so an unrecorded pass blocks the fire.

## Not for

NOT for: video/motion QC (watch-video / qc.g), frame-defect scans on generated CLIPS (visual-qc), audio (qc.audio). This skill judges STORYBOARD PANELS against a SCENE_BIBLE before clip spend.
