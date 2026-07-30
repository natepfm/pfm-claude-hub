---
name: ugc-interview-flow-v2
description: >-
  EXPERIMENTAL V2 of the NO-CUTS UGC interview method — bounded clips (start AND end keyframe)
  off one locked plate, replacing the blind-pan chain. Use on: "run V2", "bounded clips",
  "ugc interview v2", "the no-cuts v2 test".
---

# UGC Interview Flow **V2** — the bounded-clip method

> **TEAM (pushed 2026-07-28, Sam's call, after the first live run).** `ugc-interview-flow` (V1)
> remains available but V2 is the go-forward method for no-cuts interviews. Built 2026-07-27 from
> two Mitchell Gamache drift write-ups (Auto Block Party British 07-24, SPANISH Home Baby Shower
> 07-27). **First live run 2026-07-28 (BlockPartySrBroad): mechanic PROVEN — 24/24 shipped clean,
> blind-pan class gone — but ~2× credit overage from process gaps. Every guard below exists
> because that post-mortem measured it; the next project is the validation pass for the guards.**

## 🔴 PRE-FIRE CHECKLIST — read TOP OF SKILL, run EVERY fire, no exceptions

Rules buried mid-skill get skipped under momentum (Sam, 07-28: fixes "buried somewhere in the
middle… that's why it's missing things"). So the laws live HERE, first, as a checklist — and each
one is ALSO enforced in code, so skipping the read still can't skip the law:

1. **NO hand-written clip prompts. Ever.** Every prompt comes from `scripts/build_prompts.py`
   (spec JSON in → guarded prompts out). Hand-writing is how guards silently vanish between
   clips — measured cost: ~half of 48 fires discarded. If a prompt needs something the builder
   can't say, extend the builder, then fire.
2. **Declare a `move` for every clip** — `hold` / `ease` / `reveal_keep` / `pullback3` only.
   Move TYPE is the real cut driver: scale-change pulls splice, scale-preserving pans never cut
   here. `fire_bounded.py` refuses undeclared-sanctioned moves.
3. **Full-cast pull-backs are BANNED as a first attempt.** The only sanctioned zoom-out is
   `pullback3` (≤3 characters in the end frame, slow glide). The builder AND the fire gate both
   refuse violations. (V2 c05 cut 5× in a row on the full-group pull — ~250+ credits.)
4. **Two cuts on the same endpoints+move = STOP.** The circuit breaker (`.cut_ledger.json` in the
   out dir) refuses a third identical roll — change the end frame or the move type. No gambling
   to attempt 5.
5. **Clean visual + bad audio = `labs-voice-swap`, never a visual re-roll.**
6. **Camera positions come from ONE panoramic plate, crop-then-extend — as the DEFAULT,** not the
   "purest form" option. 34 per-clip end-frame stills on one project was the tell.
7. **Every clip streams the instant it lands** (Rule 5), refires land as the next `vN` in place,
   and the editor stitches — Claude never assembles.
8. 🔴 **METHOD B IS THE DEFAULT for pan/pullback/push-in clips — fire SEAM-ONLY, no end image**
   (`seamOnly: true` + a prose `destination`). A *generated* end frame repaints the scene, so the
   render morphs between two backgrounds — that is the "background drift / background shift" class,
   and it cost most of 07-29. Editor, verbatim: **"stop reimagining the backgrounds."** Never
   generate a per-clip NB aim frame; never add an extra `--image` ref to a bounded clip (it fights
   the start frame — measured start diff 51.9 vs the clean 12–17 band).
9. 🔴 **Duration matches the line (10–12s), and pans are SMALL nudges.** A 15s clip over ~10s of
   dialogue leaves dead tail, and a full-person-width pan gives the model room to splice — those
   two settings, not prompt wording, are the real mid-clip-cut drivers. Editor also reads a big
   pan as *"too much panning."*
10. 🔴 **Placement comes from the MASTER PLATE, named explicitly.** Spell the left-to-right order
    in the destination (e.g. "P3 LEFT, P4 MIDDLE, OG RIGHT; OG stays rightmost; nobody to OG's
    right") + headcount negatives. Vague prose ("OG in the middle") re-orders the cast.
11. 🔴 **Stillness = the PEOPLE only.** Bodies planted, no walking/stepping/gesturing — but the
    **camera keeps its natural handheld UGC shake**. Never render a locked-off camera.
12. 🔴 **CANARY, then roll.** Prove a method on ONE clip and get the editor's read before firing
    the same method on all four versions — otherwise one defect lands four times.
13. 🔴 **A green gate is NOT a keeper.** The gate is mechanical only; read the filmstrip yourself
    and name content failures (subject turning around, wrong person, placement, screen legibility)
    before offering any pick.
15. 🔴 **EVERY dialogue beat for that clip ships in the prompt — NEVER truncate the script to fit
    the builder.** Count the beats in the request's Copy for the clip (host question, answer, mid-clip
    host interjection, the one-word button) and verify each appears. If the builder can't express a
    beat, EXTEND IT (`followUp` exists for exactly this) — measured 07-29: the c06 closer shipped
    missing "Wait, you can negotiate? / Always." because a tool limit silently edited the script.
    Script is law (Phase 0 #1); a tooling gap is never a licence to shorten a line.
    **ENFORCED IN CODE:** put the clip's verbatim beats in `"script": [...]` and `build_prompts.py`
    HARD-FAILS (exit 1, no prompt written) if the built prompt drops one — verified 07-29 by
    re-running the original mistake. A clip with no `script` list builds with a loud ⚠ UNVERIFIED.
14. 🔴 **CAST IDENTITY NEEDS REAL PIXELS, NEVER PROSE.** If a clip reveals anyone who is NOT already
    visible in its seam, the render WILL invent them (measured 07-29: a pullback off a tight single
    produced two fabricated men — wrong jackets, wrong faces). Prose wardrobe descriptions do not
    hold identity. Anchor it with a **REAL frame** — the approved earlier clip's last frame that
    contains those people (e.g. the c03 seam holding P3·P4·OG), passed as the `--end-image`.
    A real frame is NOT the banned generated aim frame: real footage carries the true faces AND the
    true background, so nothing repaints. Generated end frames stay banned (see #8).

16. 🔴 **REFERENCE-FIRST, and the EDITOR outranks the analysis tool.** Before building any clip that
    has a precedent (a reskin's parent build, or a clip the editor points at), WATCH it with
    `watch-video` and lift the measurable parameters — move type, move start/stop timecodes,
    static tail, start/end framing, dialogue beats and pause lengths — then encode those numbers.
    Then watch YOUR OWN output and diff it against the reference before showing the editor.
    🔴 When the analysis and the editor disagree about their own footage, **the editor is right**:
    on 07-29 Gemini reported the reference closer had "no parallax" and the editor said it was a
    forward camera move with visible parallax — believing the tool cost another roll.

## ⚡ THE FAST PATH — run this order, every time (proven 07-29)

Editor hands over: **the Notion request** + **the parent creative it reskins** (or a reference clip) + **the locked plates**. Then:

| Step | Who | Spend | Output |
|---|---|---|---|
| 0. **Reference-first** — read the parent's prompts, **WATCH its clips** (`watch-video`), lift measured values (duration, move type, move start/stop, static tail, framing, dialogue beats + pause lengths) | Claude | **0** | a measured recipe, not a guess |
| 1. **Specs** — one `spec.json` per version: cast from the plates, dialogue **verbatim from the request Copy** with EVERY beat in `script: [...]`, parent's measured values | Claude | **0** | 4 specs |
| 2. **Build** — `build_prompts.py` (hard-fails if a dialogue beat is missing) | Claude | **0** | guarded prompts |
| 3. **Canary** — fire ONE clip per move type (`ease` / `reveal_keep` / `pullback3` / `pushin1`), watch each, diff vs the reference, show the editor | Claude | ~4 gens | 4 approvals = the recipe locked |
| 4. **Roll** — fire the remaining clips on the approved recipe; seam each off the editor's APPROVED keeper (confirm the version by name) | Claude | ~20 gens | the set |
| 5. **Stamp loop** — show each landed clip (📁🔗🦊📲 + strip), editor stamps, next seam comes off the stamped take | both | refires only | keepers |
| 6. **Wrap** — rename `Creatives/` to the timeline names, `e.timeline.export` the `.drt`s, verify 1:1, then `/r.creative` | Claude | 0 | turn-in |

**Budget check:** a clean run is **~26–30 gens for 24 clips.** If you are past ~35, stop and ask what process step got skipped — on 07-29 it hit 58 because steps 0–3 were skipped.

**The editor's four decisions** are the canaries in step 3 and the stamps in step 5 — not forty micro-corrections.

## 🔴 ANTI-DRIFT LAW (added 07-30 from the Seedance 2.0 storyboard + CLI research)

The research's central finding matches this skill's own post-mortems from the other direction:
**drift is a workflow-topology problem before it is a model problem.** Six rules, five of them now
enforced in code rather than remembered:

1. **Pixels carry canon; prose specifies the delta.** The start frame owns identity, wardrobe, set,
   grade and blocking. The prompt should own what CHANGES over time.
2. 🔴 **ONE reference mode per clip — code-enforced.** Strict-start (`seamOnly`), strict start+end,
   and multimodal are DISTINCT provider scenarios. Mixing `--start-image` with generic `--image` is
   not a stronger start frame, it is a different mode: `fire_bounded.py` now **refuses** extra refs
   unless the clip declares `"multimodal": true`. Our own measurement agreed before the research did
   (start diff 51.9 vs the clean 12–17 band).
3. 🔴 **Shortest workable duration — code-enforced 4–15s.** Extra runway is where the model invents
   dead tails, a second camera move, unwanted dialogue, reframing and identity degradation. Match
   the duration to the beat: 4–5s insert · 5–6s one short line · 6–8s moderate dialogue or a
   controlled move · 8–10s two linked beats · 10–15s **exception only**. A 15s clip is the
   highest-drift configuration available — never buy it for a shorter beat.
4. 🔴 **Explicit render profile — no vendor defaults.** `mode` / `bitrate_mode` / `genre` /
   `generate_audio` are all now ordered explicitly (`std` · `high` · `auto` · per-shot). `high`
   bitrate quoted the SAME price as `standard` on 07-30, so it is free quality. A stray `genre`
   preset re-acts the performance — keep it `auto` unless the treatment is deliberately genre'd.
5. 🔴 **Provenance sidecar per clip — code-enforced.** Every landed take writes `<clip>.json`
   carrying the exact prompt, every ordered parameter, the reference mode, upload UUIDs, result URL,
   quoted cost and the gate report. "Which prompt made this?" must never be unanswerable again.
6. 🔴 **THE HOP RULE — the one this skill still violates by design.** Every generative step is a
   drift event; the research caps edit chains at **two hops** and rebuilds from clean canon on the
   third. **A 6-clip seam chain is a 6-hop chain** — c03 already sits at hop 3. Mitigations, in
   order of preference: re-anchor a mid-ladder clip to a crop-then-extend still off the MASTER PLATE
   instead of the previous take; QC identity/wardrobe against the plate (not against the previous
   clip) at every hop; rebuild from the plate the moment a face or garment starts moving.
   **Also: never blindly seam off the final encoded frame** — it is frequently motion-blurred,
   mid-blink or mid-phoneme. Extract several candidates near the end and seam off the latest CLEAN
   one.

**Cheap mechanic test before a risky shape:** `seedance_2_0_mini` at 720p/5s quoted **12.5 cr** vs
**67.5 cr** for a 15s standard clip. Prove a new handoff, move type or transition topology on Mini
before spending the full model on it. A Mini pass does not prove the full model reproduces the
performance — only that the mechanic is understandable.

**Protect a winning take.** If a 720p clip has the right face, performance, blocking and audio, do
NOT reroll it for resolution — route it through `bytedance_video_upscale` (1080p/2K/4K, `aigc`
preset). Rerolling gambles a won performance. The exception is on-screen TEXT legibility (the phone
closer): the model needs the pixels at generation time, so that still fires at 1080p.

## Move-type law (hard table — keyframe source + background language pair to the move)

| move | camera | end-frame source | background language | cut risk |
|---|---|---|---|---|
| `hold` | none | the seam itself | FROZEN allowed (only here) | none seen |
| `ease` | lateral, scale-preserving | shifted crop of the plate | "stable through the move" — NEVER frozen | none seen |
| `reveal_keep` | pan, constant scale | crop containing next person | same | none seen |
| `pullback3` | slow widen, ≤3 chars | crop of PLATE, ≤3 people | same | low (the 3-shot held first try) |
| `pushin1` | slow tighten to a SINGLE | prose (seam-only) | same | low (07-29 closer) |
| ~~full-cast pull~~ | — | — | — | **BANNED — 5-cut streak** |

Pairing a camera move with "pixel-for-pixel / frozen background" language is the contradiction
that pastes people into frozen frames (V4 c03, 3 burns). The builder makes that pairing
impossible — another reason prompts are never hand-written.

## Why V2 exists

V1 chains clips: each clip's start frame is the previous clip's last frame, and the **destination is
described in prose**. That makes every travel clip a **blind pan** — the model gets one starved
close-up plus a verbal instruction ("pan right and stop") with no coordinate system and no pixels for
what's off-frame. So it invents. Measured cost across two builds: **44 rolls for 24 finals (83%
overage), one clip alone eating 34% of all video rolls.**

Worse, the failures **recur**. Five drift classes solved on 07-24 were re-hit on 07-27 by the same
editor, because V1's fixes are *prose lessons* that live in a playbook, not guards that live in the
fire path.

**V2's thesis: make drift structurally impossible instead of asking the model to avoid it.**

## The mechanic — verified 2026-07-27

`higgsfield generate create` does **per-model media-role validation**, and it discriminates:

| Model | `--start-image` + `--end-image` | cr/clip |
|---|---|---|
| **seedance_2_0** | ✅ accepted | 22.5 |
| seedance_2_0_mini | ✅ accepted | 12.5 |
| kling3_0 | ✅ accepted | 10 |
| seedance1_5 | ✅ accepted | 4.8 |
| veo3_1 | ❌ *"Model accepts a single image input."* | — |
| nano_banana_2 | ❌ *"Model accepts only --image (no roles…)"* | — |

Verified through the **non-spending** `higgsfield generate cost` endpoint. Veo and NB Pro reject the
flag, so acceptance is meaningful — the backend knows which models take an end frame.

🔴 **Known limit:** this proves the role is *valid for the model*. It does **not** prove the render
visually honors the end frame. **That is what the first live test exists to answer.** Until a test
passes, every claim in this skill about drift reduction is a hypothesis, not a result.

---

## The pipeline

### Phase 0 — LOCK (zero video credits)

1. **Script is LAW.** Fetch the Notion request FIRST. The **request's Copy section is the canonical
   dialogue** — never the parent creative's master files, even on a reskin where the parent script is
   sitting right there looking authoritative. (This exact rule was violated on 07-27 and cost four
   c04 regens.) Verbatim, no paraphrase, dollar amounts spelled as words.
2. **ONE master plate per version** (NB Pro, 9:16 1k): entire cast head-to-toe in FINAL positions,
   FINAL wardrobe, FINAL environment, interview travels LEFT→RIGHT, closer far right, clear walking
   lane. Editor stamps the plate before anything downstream fires.
3. **Outfit IDs — written FROM THE RENDER, never from the plate's prompt.** For each cast member, a
   verbatim wardrobe + physical block ("the man in the faded blue work shirt, grey moustache, tan
   cap"). NB renders drift from their prompts; describing from prompt text makes the video model
   invent a person matching the words and skip the real one. Outfit IDs are pasted verbatim into
   every downstream prompt and **never paraphrased**. Wardrobe change = new ID.
4. **Reskin cast-divergence check.** If this is a reskin, pull the parent creative's plate and steer
   the new cast deliberately AWAY from its archetypes. Repeating a winner's script is the point;
   repeating its faces is the #1 visual AI tell ("son quintillizas o qué" — 445-comment analysis).

### Phase 1 — CAMERA POSITIONS as stills (cheap, editor-gated)

A 6-clip chain needs **7 camera positions** (`pos00`…`pos06`); clip *K* runs `pos(K-1) → pos(K)`.

Fire each position as a **still** off the locked plate (NB Pro, plate as `--image` + that position's
Outfit IDs). **~2 cr each — a whole version's camera plan is ~14 credits.** The editor approves all
seven stills before any video spend.

**This is where iteration belongs.** Every framing argument, every "that's the wrong person," every
"the house looks different" gets settled at 2 credits instead of 22.5.

**DEFAULT method (promoted 07-28 — per-clip still regeneration burned 34 NB fires in one
project):** generate **one wide panoramic plate** containing the whole cast line, then **crop**
9:16 windows for each position and NB-Pro-extend each crop back to full frame (the
crop-then-extend method, Mitchell 07-27). Positions are then literal crops of ONE image, so
geometry is consistent *by construction*, not by luck. Per-position bespoke stills are the
fallback for when a position genuinely can't be a crop, not the starting point.

### Phase 2 — BOUNDED FIRES (parallel, no chain)

Each clip fires `--start-image pos(K-1).png --end-image pos(K).png`.

**There is no chain.** All six clips fire simultaneously. Clip 4 does not inherit clip 3's mistakes.
A bad clip costs only itself — not the four downstream clips it used to poison.

    scripts/fire_bounded.py joblist.json --fire --project-root "<project>"

### Phase 3 — MECHANICAL GATE (in the fire path, not in a lesson)

    scripts/gate.py <clip.mp4> --start pos03.png --end pos04.png \
                    --expect-res 720x1280 --expect-duration 12

**Five checks, all deterministic** (requires `ffprobe` — see below):

| Check | What it catches |
|---|---|
| **start** endpoint | clip re-staged its opening frame (~30-50% of Seedance fires) |
| **end** endpoint | **landed on the wrong destination** — V1 never checked this, and it is exactly where the blind pan failed |
| **scene** | mid-clip hard cuts, via ffmpeg's **native scene detector** — exact timestamps, no threshold tuning |
| **spec** | Seedance quietly returned the wrong resolution / aspect / duration |
| **audio** | no audio stream, or a stream that is present but **silent** |

Scene thresholds, calibrated 2026-07-27: clean pan **0.023** · small positional hop **0.062** ·
real framing-snap cut **0.252** at the exact splice frame. `≥0.10` = FAIL (hard cut),
`0.04-0.10` = WARN (eyeball the strip), below = PASS. **11× separation** between clean and a
real cut.

🔴 **Never QC cuts off a 1fps filmstrip** — it misses them (Mitchell 07-24, re-hit 07-27 when the
later write-up reverted to `fps=1`). The native detector reads every frame.

A **filmstrip PNG** is emitted with every landing for the editor.

Mechanical failures auto-refire (max 3). **Creative misses never auto-refire** — they go to the
editor per STOP-ASSUMING.

> **Dependency:** `ffprobe`. Installed to `~/bin/ffprobe` on 2026-07-27 (evermeet.cx 8.1.2, the same
> source as `~/bin/ffmpeg`). It ships as a **separate download** from ffmpeg, which is why it was
> missing. The gate resolves it via `$PFM_FFPROBE` → `~/bin` → `PATH`, and degrades checks to SKIP
> rather than crashing if it is absent on another editor's Mac.

---

## Prompt anatomy — bounded clips need LESS prose, not more

With both endpoints given, roughly half of V1's prompt machinery becomes unnecessary **and actively
harmful** — a prose destination description now *fights* the end frame, the same way V1 learned a
cropped-wide ref fights a seam that already contains the face.

**DELETE from V1 prompts** (the end frame does this job better):
- ❌ destination description ("pan right to the two women in floral")
- ❌ direction + stop language ("ONE move to the RIGHT… and STOPS there")
- ❌ reveal-vs-push-in framing choice
- ❌ cropped-destination `--image` refs
- ❌ "no drifting LEFT" / "no going back to who already spoke" negatives
- ❌ identity/scene guard stacks defending against a hallucinated wide

**KEEP** (still stochastic, still needs prompting):
1. Format — "Amateur vertical iPhone video, one continuous handheld shot, no cuts."
2. Motion only — "the camera travels continuously from the first frame to the last frame in ONE
   unbroken move, eased at both ends, constant subtle handheld sway."
3. Dialogue verbatim, speakers **on camera, lips synced**.
4. **Off-camera host lock, naming the person by Outfit ID** — "the man in the faded blue work shirt
   does NOT say it, does NOT mouth it, does NOT move his lips at all during '¿Y usted, don?'"
   Generic "no one mouths the host line" is proven insufficient.
5. **Positive bystander direction** — "relaxed and alive, easy agreeing nods, warm little smiles,
   shifting weight… NOT stiff, frozen, robotic or statue-like; they just do not SPEAK the line."
   Directing non-speakers to "hold still, mouth closed" renders corpses.
6. Continuity bed — sway→sway across the join, ambience named positively, anti-haze stack (style
   rides the join), duration tightened to the dialogue + a mouth-busy closing action.
7. Negative wall — anti-cut, anti-passerby, anti-invention.

## What V2 fixes vs. what stays stochastic

**Structurally eliminated** (the end frame makes them impossible): wandering camera · panning the
wrong direction · overshooting the speaker · hallucinated extra people · swapped environment ·
wrong speaker delivering the line · destination-not-in-seam guessing.

**Still stochastic — budget re-rolls:** mid-clip jump cuts (intermittent Seedance behavior) ·
accent slips · audio garble · off-camera lip-lock · dead tails.

🔴 When the visual is clean but the audio is off, **conform in post (`labs-voice-swap`) — do not
re-roll the visual dice.**

## Carried forward from V1 (do not re-derive)

- **Phone-screen closer:** composite the lander into a **small phone mockup** first, then pass THAT
  as `--image` at 1080p `mode std` — the model sees "a phone," not "a full-screen app." Kills the
  ~1-in-3 full-frame lander splash. Recipe in `references/bounded-chain-method.md`.
- **Never the editor's job to comp a screen in post.** Garbled screen = re-fire at 1080p.
- **Spell years and numbers phonetically** — "twenty twenty-six" + negative on the prior year.
- **Proper nouns are traps**; swap to sayable words, editor's call.
- **Dead tails cost zero gens** — trim at the join, hand the editor the timecode.

## House laws that bind here

- 🔴 **Rule 5 — show every gen the instant it lands.** 📁 + 🔗 + 📲 + widget + gate number +
  filmstrip, per clip, before QC and before any pick. Never batch-wait, never QC-gate.
- 🔴 **Refires ADD the next `vN` in place** — never overwrite, rename, `rm`, or relocate a prior take.
- 🔴 **Claude NEVER assembles or concatenates.** The editor stitches. Deliverable = approved clips.
- 🔴 **STOP ASSUMING** — result lands → show it → STOP. The next iteration is the editor's call.
- 🔴 **DONE = a named check passed** (mp4 count on disk, gate exit 0, LinkYourFile resolves).
  Otherwise the word is "not verified."
- **Lucid handoff:** every folder mention carries 📁 + 🔗; deliveries add 🦊; shown assets add 📲.
- **9:16 default** unless the request explicitly says otherwise.
- **NY cuts only** need the synthetic-performers disclaimer (`add-ai-disclaimer`) — never gate a
  non-NY creative on it.
- **Fires ≥20 items need a full preflight + explicit Fire? confirmation.**

## Files

- `references/bounded-chain-method.md` — full craft: position planning, joblist schema, phone-mockup
  recipe, the complete V1→V2 drift ledger with per-project evidence.
- `scripts/build_prompts.py` — 🔴 THE canonical prompt builder (spec JSON → guarded prompts +
  clip-meta fragment). Every clip prompt comes from here; hand-writing is a violation of
  checklist #1. Refuses >3-character pullbacks at build time.
- `scripts/fire_bounded.py` — bounded parallel fire + PRE-FIRE GATE (move law + cut
  circuit-breaker via `.cut_ledger.json`) + auto-gate + Rule 5 streaming.
- `scripts/gate.py` — endpoint diffs, native jump-cut scan, filmstrip. A scene FAIL feeds the
  circuit-breaker ledger automatically.
