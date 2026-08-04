---
name: ag.clip.flow
description: >-
  PFM's CLIP stage for ag.scene.flow creatives — turns APPROVED storyboard anchors into Seedance 2.0 clips through a gated fire script: one explicit reference mode per shot, compact motion prompts, shortest workable duration, shot-level audio, sidecar provenance, and fired_pending_qc instead of terminal "fired". Use on: 'fire the clips', 'run the clip flow', 'start the video stage', after every shot's frame is qc_pass.
---

# ag.clip.flow — Anchors → Seedance clips (controlled manufacturing, not ideation)

Born 07.30.26 from the Seedance/Higgsfield playbook research, after the frame stage proved that continuity is bought by DERIVING commands from canon instead of composing them by hand. This skill applies the same discipline to video. **The still frame carries the world; the clip prompt carries only what changes over time.**

## 🔴 GATE 0 — the frame is approved, or there is no clip

`fire_clip.py` refuses any shot that is not `qc_pass` with an existing `start_frame` on disk. If a frame is wrong, Seedance is not where you fix it — go back to `ag.storyboard`.

## 🔴 THE LAWS

1. **Fire through the gate, never by hand.** `~/.claude/skills/ag.clip.flow/scripts/fire_clip.py <bible> --shot <ID>`. It derives every flag from the shot's `video:` block. Hand-typed `higgsfield generate create seedance_2_0` for a scene-flow clip is a violation.
2. **ONE reference mode per shot, declared in canon.** `strict_start` (house default — dialogue, reaction, performance) · `strict_start_end` (bounded travel to an exact end composition) · `multimodal` (action/voice/style inheritance; never promises pixel-exact frame one). The gate REFUSES ambiguous mixtures — a `--start-image` plus generic `--image` is not a validated strict task.
3. 🔴 **EDIT HANDLES ARE CODE-ENFORCED (Sam, locked 07.30 after two violations).** Every dialogue clip opens and closes on ~1s of settled silence — the editor cuts breaking-news style, audio leading under the previous clip, and a clip that ends on the last word is uncuttable. The gate auto-appends the TIMING block to every dialogue prompt and REFUSES durations that can't hold line + 2s of air (ceil(words×0.4)+2, floor 5s). Never hand-author handles again; the gate owns them.
3b. **Shortest workable duration, validated 4–15s.** Insert/reaction 4–5 · one short line 5–6 · moderate dialogue or a controlled move 6–8. Extra seconds are runway for invented actions, dead tails, second camera moves and identity decay. The gate refuses out-of-range values.
4. **Audio is a per-shot decision, never a default.** `generate_audio` must be explicitly set in the shot's `video:` block. Silent inserts, reaction plates and post-VO shots generate no speech. (Hardcoded `true` produced phantom off-screen voices.)
5. **Genre is deliberate.** `auto` unless the creative wants a preset. Genre is free, so when delivery flatness is the risk, A/B it on ONE proof shot rather than blanket-defaulting either way.
6. **One shot per generation. Multi-shot is an explicit exception — and a SANCTIONED OPTION for reaction families (Sam opted in 08.01, best-practices audit §4).** Requires `multishot: true` in canon; the gate refuses internal cuts otherwise, and refuses a multishot prompt with no timestamped shot list. Exact identities, two-handers, eyelines, strict axis and clean dialogue cutting all demand separate fires. **When to OFFER the multishot option:** a family of NON-DIALOGUE reaction/cutaway beats in one room (gallery reactions, crowd coverage — the S25–S28 class), ≤5 beats, where cut rhythm matters more than per-beat framing control. One fire returns one continuous clip with hard cuts and auto-matched lighting/audio (single diffusion pass). The trade the editor accepts: no per-beat anchor approval — the editor judges the whole sequence. Field-documented failure modes: >5 beats compresses quality; identical framing across beats; long dialogue forces rushed pacing. Offer it, never default to it.
7. **One camera movement, or an explicitly locked camera.** Stated in the prompt's CAMERA block, singular.
8. **Rendered ≠ approved.** The gate writes `fired_pending_qc`. Only the editor's word moves a clip to `clip_qc_pass`. Reason-coded retries only (`ID_DRIFT`, `WRONG_CAMERA`, `UNWANTED_CUT`, `LIPSYNC_ERROR`, `EXTRA_SPEECH`, `END_FRAME_MISS`, …) — the next take changes only what addresses the named failure.
9. **Protect a winning take.** Never re-roll for resolution alone. Upscale an approved 720p through `bytedance_video_upscale`; a re-roll is a new stochastic performance that can lose what you already won.
10. **Provenance travels with the clip.** Every fire writes a JSON sidecar: prompt, engine, all parameters, reference mode, uploaded UUIDs, job id, result URL, quoted cost, take number, QC state.
11. **Prove before you multiply.** Fire ONE representative clip before each new family — new character, new camera, new voice mode, new reference mechanic, or any batch. **480p draft proofs are a SANCTIONED OPTION (Sam opted in 08.01):** when the proof question is motion/performance/camera (not fidelity), offer `--profile draft_480` for the proof fire and pay 720p only for proven prompts. 480p CANNOT answer small-face lip-sync or screen-legibility questions — those proofs stay at delivery resolution. Offer it, never default to it.
11b. **Reference-carry chaining — SUGGEST IT when the shot plan needs it (Sam 08.01).** When a creative calls for CONTINUOUS MOVEMENT across cuts (walk-and-talk, a character crossing the room over multiple shots) or a beat longer than the 15s per-gen ceiling, suggest chaining: feed clip N's last frame + the character master into clip N+1 ("continue from this frame, preserve identity and lighting") instead of independent per-shot anchors that can disagree mid-stride. Static-camera coverage (the house norm) does not need it — it is a trigger-based suggestion, never a default.
11c. **Batch fires by location/camera session (Sam adopted 08.01).** Fire all of one camera's / one room-direction's shots back-to-back in a single working session — even shots that sit far apart in the edit — and judge them against each other while the reference is fresh. The win is operational (ref-stack mistakes surface in minutes, takes are compared side by side), and it matches field practice ("generate all shots for a single location at once").
12. **Look at every clip.** First frame vs the anchor (identity, wardrobe, props, geometry, light), then motion, then audio. Report what you SEE, including failures, before the editor has to.

## The compact motion prompt

The anchor already carries identity, wardrobe, set, composition, colour, light and prop appearance. Do NOT restate the pixels. Five blocks:

```
SHOT           who is visible, framing, and the exact starting state shown in the anchor
ACTION         one continuous action, expression, body behaviour, and the dialogue
CAMERA         one movement, or an explicitly locked camera
AUDIO          dialogue, voice quality, ambience, effects, and whether music exists
PRESERVE       identity, wardrobe, set, prop, geography + what must not appear
```

ByteDance markup: `{spoken words}` · `<sound effect>` · `(music)` · `〖subtitle〗`. Name the speaker and voice quality. One language except proper nouns. For two-handers, state turn order and never let two mouths compete.

## Canon — the `video:` block per shot

```yaml
video:
  reference_mode: strict_start     # strict_start | strict_start_end | multimodal
  duration: 6                      # 4-15, shortest that holds the beat
  profile: std_720                 # mini_test | fast_proof | std_720 | std_1080
  generate_audio: true             # EXPLICIT, per shot
  genre: auto
  multishot: false
clip_prompt: |
  SHOT ...
expected_dialogue: "..."
expected_speaker: DEFENDANT
```

Profiles: `fast_proof` (seedance_2_0 fast — Sam-approved tier, good enough to judge performance and sometimes to keep) · `std_720` (std + high bitrate — the selection point) · `std_1080` (hero direct-final, ~2× cost). 🔴 **`std_1080` now REQUIRES a `legibility_reason` in the shot's `video:` block** (ported from ag.skit.continuous, 08-04): resolution is the biggest cost lever in the pipeline and 1080p is exactly 2× (135 vs 67.5 cr per 15s). On the DMV Single Mom build ~19 clips fired 1080p "for screen legibility" when most didn't need it — ~1,300 credits of a ~3,869-credit project, about a third of the spend. Step up only for a beat whose fine on-screen text must be legible, and test 720p there first. 🔴 **`mini_test` is BANNED** (Sam, 07.30: "I really hate mini") — the gate refuses it. Cheap probes use `fast_proof`.

🔴 **TIER BY SHOT SIZE (Sam, 07.30).** `fast_proof` holds up on TIGHT shots — MCU and closer, subject near camera, limited movement. It FAILS on wides and any shot where a face is far from camera AND moving: the face warps and a blotchy filter-like texture settles over the frame (S17's aisle walk, twice). So: distant or moving subjects → `std_720` minimum, never fast. Fast is for cheap probes of BLOCKING and TIMING, and for keepable tight singles.

**Vendor note (07.30):** `seedance_2_0` std mode failed 7 consecutive jobs with `status: failed` and an empty `result_url` while mini and fast succeeded on the identical anchor and prompt. When std fails repeatedly, probe with `fast_proof` before assuming a prompt problem — and never conclude "our fault" without checking `job_display` for the vendor's own status.

## Run it

1. `scene_bible.py status` — confirm the shot is `qc_pass` with an anchor.
2. Author the shot's `video:` block + `clip_prompt` into canon (SHOTS.yaml).
3. `fire_clip.py <bible> --shot <ID>` — prints the cost quote, fires, downloads, extracts frame one, writes the sidecar, sets `fired_pending_qc`.
4. Stream the clip to the editor (📲 + folder handoff) with your honest QC read.
5. On approval: `--verdict pass`; on failure: reason code, change only that.
6. Approved 720p heroes → upscale, QC the upscale separately for halos, shimmer and over-sharpening.

Output → `Elements/Footage/Seedance/S<xx>_v<NN>.mp4` (+ `.json` sidecar, + `_frame1.png`). Never `Elements/Footage/Veo` — Seedance output mislabelled as Veo is a provenance lie.

## Where it sits

`wr.shotboard` → `ag.scene.flow` (locks + cameras) → `ag.storyboard` (approved anchors) → **`ag.clip.flow`** (clips) → `qc.video` / `qc.audio` → edit.

## Not for
NOT for: frames (`ag.storyboard`), locks (`ag.scene.flow`), standalone Seedance concepts outside a scene-flow project (`ugc-cinematic-prompt` — its eleven-block format is for creating a world, not animating a locked one), or assembly.
