---
name: sd2.5-ugc-skit
description: >-
  SD2.5 UGC SKIT — PFM's no-seam chain method for NARRATIVE first-person/handheld skits on
  Seedance 2.5 (story beats, recurring cast, one storyline, shot like someone's iPhone).
  Locks are FILES + STAMPS (no SCENE_BIBLE): script → cast masters → environment → populated
  master still(s), then clips chain off real pixels with the stamped master riding every fire.
  Use on: "sd2.5 skit", "run the skit chain", "ugc skit flow", a narrative POV skit on
  Seedance 2.5. Group-interview UGC routes to sd2.5-interview-flow; keyframe-per-gen
  Veo/NB-class continuous skits route to ag.scene.flow.continuous. Editor-invoked only.
---

# sd2.5-ugc-skit — the no-seam chain for narrative POV skits

> Born 2026-08-13 on the HOA Karen Garage Sale build (Home - Forms, 9:16, 3 hooks / 2 body
> chains). Machinery is byte-copied from the proven sd2.5-interview-flow (House Party Seniors
> 08-11, 12/12 clean); this skill adapts the chain to scripted narrative with story cuts.
> LOCAL only until Sam ships via x.sync. Maintainer: Sam.

## 🔴 CHECKLIST — read TOP OF FILE, every run

1. **Editor-invoked, per-creative.** Never applies itself to a project.
2. **FOUR locks, in order, each behind the editor's explicit approval — recorded as FILES,
   not YAML:** ① script (as-written canon copied to `Elements/Prompts/SCRIPT_v*_LOCKED.md`,
   dash grep = 0) → ② cast masters (`pfm-character-master`, one take approved per character,
   auto-saved to the central library) → ③ environment (9:16 hero look + 16:9 wide geography
   master; wide = the scene-bible image) → ④ **populated master still(s)** — cast composited
   into the locked environment; one per divergent chain state (e.g. dry + wet). The editor
   stamps each populated master: `<file>.stamped`, touched ONLY on their explicit approval.
   `chain_fire.py` refuses unstamped plates.
3. **Every clip fire carries TWO anchors:** `--start` = the verified raw last-frame rip of
   the prior APPROVED take (continuity), `--plate` = the chain's stamped populated master
   (identity, drift correction). A divergent-state chain NEVER rides another state's master
   (wet chain rides the wet stamp). Ref aspect == render aspect: fires ride the 9:16 crop of
   the stamped master, stamp carried to the crop.
4. **Story cuts re-anchor; continuous beats chain.** A gen that opens after a story cut
   (time/space jump) starts from its own keyframe — ONE gpt_image_2 edit off the stamped
   master (never NB Pro for edits-off-a-ref; hook-enforced). A gen continuing the prior
   moment starts from the prior take's last-frame rip. The script's numbered gens are the
   only sanctioned cut points.
5. **Prompts are LOCKED per-gen files in `Elements/Prompts/`, gated by
   `scripts/skit_prompt_lint.py --duration N`.** Refusals: em/en dash · missing REAL-TIME
   SPEED block · slow-mo pacing words · missing AIR RULE on dialogue · "starting
   immediately" · duration < 8s · duration < line + 4s air · unpinned voice gender (off-
   screen defined characters also pin ethnicity + register) · screen art without a PHONE
   SCALE block · duration more than 1s over the word floor (DUR-SLACK — `--sparse-ok` is
   the editor's explicit sparse-beat escape). No improvised fire-time prompts, ever.
   Seam-chained fires ride LEAN prompts (chain_fire caps 6k chars).
6. **`.fire_mode` is the editor's call, per chain folder** — `stepwise` (each take approved
   before the next seams off it; the default for a first run) or `continuous` (hands-off
   behind the hard gates). chain_fire refuses without it; never pre-write it.
7. **All hard gates inherit unchanged** via `scripts/chain_fire.py`: plate blur gate
   (deep-focus law — every plate/keyframe prompt carries the sharp-front-to-back clause, no
   bokeh), cut gate, opt-in travel gate, 4–30s duration bounds, one auto-refire then STOP,
   next-vN in place (never overwrite, never relocate a prior take).
8. **A NEW creative's first continuous seam: offer the editor an A/B** — `video_extension`
   mode vs last-frame chain on the same seam; the editor's pick sets the method for the
   rest. Last-frame is the plan of record until an A/B says otherwise. (Pick a true
   continuous seam — a story-cut seam tests nothing.)
9. **🔴 NO AUTOMATIC QC · stream every gen the instant it lands** (📲 + 📁/🔗 pair, 🦊 on
   delivery, no verdict attached). Editor silence or "move on" = approval. Claude never
   reads pixels unless the editor asks. Editor stitches; Claude never assembles.
10. **Craft laws inherit:** nano-banana-prompting for every image prompt (camera-roll mode
    for the iPhone look), brand-clean negatives, phone screens HTML-rendered and composited
    (never diffusion text), 9:16 default, one-off/refire defaults (cheapest rung, count 1),
    2 takes for a new character master, kid-master upload moderation workaround (carry the
    kid via prose if the upload trips).
11. **🔴 Gen shape (Sam, locked 2026-08-17): splits must be EARNED · durations sized to the
    floor · opens WIDER.** Adjacent script gens sharing one spot and one continuous
    conversation with no camera or state change are ONE gen — run the merge check before
    writing any prompt (two unearned splits both got merged by Sam on HOA Karen: gens 3+4
    and 9+10). Duration = the lint floor (words/2.5 + 4s), never padded — the model
    delivers ~185wpm and turns slack into dead air; the lint refuses floor+2 or more
    without `--sparse-ok`. Chain openers and cut keyframes frame WIDER than feels right:
    default further away, step the camera back in the opening second (three consecutive
    "further away" corrections on HOA Karen).
12. **🔴 Prompts are built from `PROMPT_TEMPLATE.md` (locked 2026-08-18)** — fixed blocks
    verbatim, slots per gen: a character ANCHOR sentence for every cast member in frame
    (position + business + stay-pin), a CAMERA-STATE pin on every spoken line ("on camera
    and lips visibly moving" / "heard off camera" — lint refuses a bare quote), and the
    SEAM-TYPE check before writing (framing differs from the prior take's end → it is a
    CUT with its own keyframe; prose cannot re-frame a continuous seam). Register per
    character derives from the ARC, not copied from the last prompt.

13. **🔴 Recast/variant creative: the parent build's approved frames ARE the shot design
    (Sam, locked 2026-08-19, DMV Indian populated-master miss).** When the creative is a
    recast or variant of an existing build, the populated master and every keyframe are
    written FROM the parent's approved frame: open it FIRST, pass it as a composition
    reference riding the compose, and copy its camera position, blocking, facing, and
    room population verbatim — never re-stage from the script or from imagination.
    Compose NATIVE in the delivery aspect (a POV frame with foreground anchors cannot be
    recovered by cropping a wide). Population is copied from the reference, never
    invented — no "realism" extras.

14. **Vendor-fail triage (locked 2026-08-19, DMV Indian outage).** A Seedance fire that
    dies with bare "failed" carries NO reason on the CLI/API — moderation kills and infra
    failures look identical there, and the web UI's generic "Something went wrong" is NOT
    the nsfw badge. Before touching any dialogue: (a) check whether OTHER jobs on the
    workspace are completing, then (b) run the definitive test — refire a KNOWN-GOOD
    recipe (a prompt + inputs that already landed). Control fails → vendor infra, hold
    and ping support with job IDs; control lands → this clip's inputs/content are
    implicated, and only then does the isolation A/B / reword path open (still
    editor-gated, as-written-first law).

## The flow

| # | Stage | Fires with | Editor gate |
|---|---|---|---|
| 0 | scaffold + script lock | scaffold_project.sh, script byte-copy | approve script |
| 1 | cast masters | pfm-character-master (gpt_image_2, 2 takes) | pick per character |
| 2 | environment | NB Pro fresh stills: 9:16 hero, then 16:9 wide off it | approve look, then wide |
| 3 | populated masters | NB Pro compose (env + cast refs, scoped); state variants via ONE gpt_image_2 edit | **stamp each** |
| 4 | clips | `chain_fire.py --start <rip> --plate <stamped 9:16> --duration N` per gen; keyframes via gpt_image_2 edit at story cuts | stepwise per take |

```bash
python3 ~/.claude/skills/sd2.5-ugc-skit/scripts/skit_prompt_lint.py <gen_prompt.txt> --duration 12
python3 ~/.claude/skills/sd2.5-ugc-skit/scripts/chain_fire.py --prompt <gen_prompt.txt> \
  --start <prior_take_LASTFRAME.png> --plate <stamped 9:16 master> \
  --duration 12 --outdir <Chain folder> --clip g03
```

## Not for

Group-interview UGC (sd2.5-interview-flow) · keyframe-per-gen Veo/NB continuous skits
(ag.scene.flow.continuous) · multi-angle ensemble coverage (ag.scene.flow full) · b-roll
batches (type skills) · real shoots.
