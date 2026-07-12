---
name: ugc-talking-head-ref
description: >-
  Generate PFM's locked 9:16 UGC talking-head character REFERENCE IMAGES — the "person
  mid-sentence talking to a phone on a stand" look — via NB Pro. Produces the still that
  feeds ugc-talking-head-veo for clip generation. Use when an editor says "talking head
  ref", "make a talking head character", "UGC character reference", "iphone tripod look",
  "talking to camera reference", or needs a new/swapped presenter for a UGC creative
  (finance bro, car-seat mom, kitchen dad). Locked look (2026-06-11, Finance Bro build):
  paused-video mid-speech frame, tight OG framing, clean modern iPhone look — NOT a posed
  portrait, NOT grainy, NO phone/UI artifacts. NOT for: model-sheet character masters
  (pfm-character-master), b-roll batches (hig-flow), broadcast/news stills
  (nano-banana-prompting broadcast mode), or firing the Veo clips (ugc-talking-head-veo).
---

# UGC Talking-Head Reference — the locked look

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


One deliverable: a 9:16 still that reads as **a paused frame from a vertical video of a person mid-sentence, talking straight into a camera fixed on a stand**. This image becomes the `--image` ref for every Veo clip of that character, so everything about it (framing, energy, setting) propagates into the whole creative.

Locked on the Finance Bro build (2026-06-11) after a full failure tour: grain → phone-in-frame → app chrome → posing portraits. Every rule below exists because its violation shipped a bad batch that day. **Do not freelance around them.**

## The five hard rules

1. **NEVER name the device.** No "phone", "iPhone", "tripod", "selfie", "filming himself" anywhere in the positive description — the model renders the named device INTO the frame (phones on desks, tripods in shot, recursive phone screens). The tripod-iPhone feel comes entirely from camera-character words: *"locked-off fixed camera at [desk/counter/dash] height, slightly below the eye line, perfectly still framing."*
2. **The UI-negative stack is mandatory and untrimmable.** "Slimming the prompt" by cutting it produced record buttons, status bars, full Instagram chrome, and phone-bezel mockups. It rides on every fire, verbatim (see template).
3. **Mid-SPEECH, never posing.** The subject is a frozen instant of talking: *"caught mid-word, mouth open forming a syllable, eyebrows mid-expression, an in-between instant of real speech exactly like a paused video — not smiling for a photo, not posing."* Any charm direction ("easy grin", "eyes sparkling", "confident gesture at the lens") produces a portrait — a person posing for a photoshoot, instantly fake.
4. **Clean modern iPhone look — zero grain vocabulary.** Never write "sensor noise", "film grain", "compression artifacts", "soft focus", "motion blur". Modern phone video is crisp, bright, slightly HDR. The video-ness comes from the paused-frame lead and the locked-off camera, not from degradation words.
5. **Tight framing, room as a sliver.** Subject fills the frame chest-up, head near the top edge, arm's-length distance. **Do NOT itemize the room** — listing desk props pulls the camera wide into a scene shot. Environment is *"only a sliver behind the shoulders"* plus at most *"a hint of [two props] at the very bottom edge of frame."*

## 🎙 Realism mode — podcast / set-based UGC (LOCKED 2026-06-12, overrides rules 1·4·5)

When the brief wants a REAL podcast / sit-down look (not a tight car-seat selfie), the inspiration is a candid screenshot from a real YouTube podcast (Whatever / On Purpose / Jay Shetty). That look needs the OPPOSITE of three of the hard rules above — **for this mode only**, reverse them:

- **Rule 5 reversed — SHOW the set with depth.** Bookshelf + framed prints + clutter, or a dark acoustic-foam wall, softly defocused behind. The lived-in set IS the realism here; the inspo shots all have rich backgrounds. (Tight car-seat / kitchen selfie UGC still keeps Rule 5's sliver.)
- **Rule 4 reversed — use real-skin + soft-compression vocabulary.** "visible pores, faint redness, natural under-eye texture, no airbrushing" + "slightly soft naturalistic video look with gentle compression, like a paused podcast clip." The blanket no-texture ban over-corrected into AI wax.
- **Anchor phrase** (replaces Rule 1's iPhone framing language): *"Candid still frame pulled from a real YouTube podcast video upload, vertical 9:16 crop of a wider multi-camera shot."* Still an outcome marker, not a device — Rule 1's device ban holds ("no phone/tripod/camera in frame" stays in negatives).
- Keep: relaxed/slouched candid body caught mid-word, big generic condenser mic on boom+shock-mount dead-foreground with a BLANK windscreen (no brand text — watch for stray YouTube play-button plaques on shelves), flat practical lighting (not beauty light), off-camera eye-line, and the full caption/UI/logo negative stack.

**Engine (LOCKED 2026-06-12):** a 4-engine bake-off (NB Pro / Seedream 4.5 / Z Image / Soul V2, same prompt) proved the AI-gloss was the PROMPT, not the engine — every engine rendered real once the reversals were applied. Sam's locked podcast engine is **Z Image** (`z_image`, text-to-image, 9:16; he passed over the more "relatable" NB Pro and the prettier Seedream for it). Fire text-to-image (no anchor ref — you're inventing the presenter), default ~4 takes/character, editor tags picks. Full detail: `feedback_ugc_podcast_realism_lock` memory. Built on `06.11.26 - Podcast - A+S - Stop the Nonsense - Woman`.

## Step zero — anchor on the sibling (do this BEFORE writing any prompt)

If the request is a character swap / variation of an existing creative (it almost always is), **find the source look first and anchor on it** — do not reconstruct it from words:

1. Pull the OG / sibling project's `Elements/Footage/Reference/` refs, or extract a mid-speech frame from its source video (`ffmpeg -ss <t> -i <src> -frames:v 1`). Pick a frame where the subject is peak mid-word.
2. Copy it into the new project's Reference as `OG_Framing_Anchor_<scene>_<hex>.png`, upload → UUID, and pass it `--image` on every take.
3. Scope it in the prompt: *"Recreate this exact shot from the reference image: same tight vertical framing, same camera position, same [scene] setting, same caught mid-word energy, same clean vertical video look. But the person is a completely different [woman/man]: [IDENTITY]. Do not copy the reference person's face, hair, or clothing. Ignore any text in the reference."*

Text-only reconstruction of an existing look burned an hour on the Finance Bro build; the anchor one-shotted the Woman build (3/3 QC pass, first round). **No sibling available?** Fall back to the locked text template below — and hold the north star Sam set (2026-06-11): *the image looks like someone sitting in front of their camera, and the framing and quality are that of an iPhone camera.* Every text-only prompt gets graded against that sentence before firing.

## Watchdog — never let a fire go silent (added after the 20-minute stall, 2026-06-11)

The midday shared queue can sit fires for 10–20 minutes, and the editor must never be the one to notice. When launching a backgrounded fire batch, ALSO launch a parallel monitor task — `sleep 480` — in the same breath. When the monitor's completion notification fires before the batch is done: read the batch's interim output, count returned takes, check `higgsfield generate list` for queue state, and REPORT to the editor unprompted ("2/4 back, queue is jammed, ~N min more"). A second monitor follows if it's still running. Single-take API errors (HTTP 502s happen): refire that take once, disclose it; never silently deliver a short count.

## Scene families — one skill, one backbone, swappable scene blocks

The five hard rules are format-level and never change. What changes per family is the scene block + eye-line:

| | **UGC** (office desk / car seat / kitchen) | **Podcast** (two-person interview format) |
|---|---|---|
| Eye-line | Straight into the lens | **Off-camera at the unseen host/interviewer** — never at the lens |
| Angle | Front-on, camera slightly below eye level | 3/4 profile toward the off-frame host |
| Scene props | None (sliver of environment only) | **Large studio condenser mic in a shock mount, foreground, slightly out of focus + over-ear headphones ON** — these are scene props, allowed; the capture-device ban is about the camera filming them |
| Light | Clean daylight, plain | Moody produced studio — warm lamp + cool wash, acoustic foam panels and studio monitors softly defocused behind |
| Wardrobe | Per character | Casual tee / relaxed (podcast-guest energy) |
| Keep generic | — | A generic anonymous studio — NOT a recognizable famous-podcast set (no branded set pieces, no neon logo walls) |

Podcast pairs (guest + host) = two separate single refs, one per person, same studio described both times — not a two-shot. Match the existing PFM podcast refs (e.g. Stop the Nonsense `Reference_1/2.jpeg`) via the Step-zero anchor whenever the family already exists.

**Pair eye-line geometry + the BOTH-DIRECTIONS standard (locked 2026-06-12, Stop the Nonsense Woman realism build):** a podcast cut only reads as a conversation when guest and host face OPPOSITE ways. **LOCKED DELIVERABLE — every podcast hero ships in BOTH orientations:** the original AND an `ffmpeg -vf hflip` mirror, named `..._MIRRORED_<hex>.png` with a FRESH unique 4-hex per file (don't reuse the source's hex — `$RANDOM` in a shell loop can repeat; generate hexes in Python/`uuid`). Don't try to predict which way each clip needs, and don't fight eye-direction in the prompt — "mirrored" language and a pre-flipped anchor both failed historically on NB Pro's sticky profile prior. Just generate the hero, then flip it: hflip is lossless on AI faces and hands you the other direction for free. So a locked podcast character SET = **{guest, guest_MIRRORED, host, host_MIRRORED}** — four files per pair, both people available looking either way. On the realism build, **Z Image** rendered guest-looks-right + host-looks-left *natively* (already a correct facing pair straight out of the gen); the mirrors then provide the reverse angle for each. Full Lucid handoff (📁/🔗/🦊) on the folder at handoff.

## The locked prompt template (UGC family)

Swap only the [BRACKETED] pieces. Everything else verbatim.

> Extracted video frame from a paused vertical recording of [WHO — e.g. "a finance influencer", "a young mom"] mid-sentence, talking straight to the camera from [WHERE — e.g. "behind his office desk", "the driver's seat of her parked car"]. [IDENTITY — age, hair, facial state, wardrobe in one sentence; no jewelry beyond what the character demands]. He/She is caught mid-word, mouth open forming a syllable, eyebrows raised mid-expression, an in-between instant of real speech exactly like a paused video — not smiling for a photo, not posing. [BODY — leaning into the conversation, one hand frozen mid-gesture]. The camera is fixed and locked-off at [SURFACE] height, slightly below the eye line, perfectly still framing. He/She fills the frame chest-up, head near the top edge. Behind the shoulders only a sliver of [SETTING]: [ONE soft out-of-focus depth cue] and a hint of [TWO props] at the very bottom of frame. Clean modern vertical video look, slightly off-center.
>
> Not a portrait, not a posed photo, no presentational smile at the lens, no finger guns, no thumbs up. No phone visible anywhere in the image, no tripod in frame, no recording device in frame. No status bar, no record button, no recording interface, no app or social media chrome, no phone bezel or screen border framing the image, no captions, no text overlays, no watermarks. A clean full-bleed image. No visible brand names or logos.

Add scene-specific brand-clean negatives per `feedback_pfm_brand_clean_rules` (vehicles → no automaker badges, kitchens → no appliance brands, etc.).

## Fire mechanics

- **Model:** `nano_banana_2` (this CLI's NB Pro) · `--aspect_ratio 9:16` · `--resolution 1k` · ~2 cr/image
- **No count param exists** — one image per call. For N takes, fire N calls **in parallel** (3s stagger, ThreadPool/`&`), NEVER sequentially — sequential stacks the shared-workspace queue wait N times. Midday queue can be 5–15 min; `--wait-timeout 20m`.
- **Downloads by the fire's own `--json` URL only.** The Higgsfield account is shared across editors — `generate list` interleaves everyone's jobs. NEVER recover a lost take by "newest undownloaded" (it grabs a teammate's gen). Lost JSON = match by prompt via the job, or refire.
- **Filenames:** `<Character>_UGC_Ref_<Variant>_v<NN>_<4hex>.png` → `Elements/Footage/Reference/`. Never overwrite; iterate v-numbers.
- **Default 4 takes** for a new character (editor picks a hero), count=1 per call.

## Show first, QC second (RULE-5 — locked 2026-06-30)

**Show every gen the instant it lands — 📲 CloudFront + widget (`job_display`/`show_generations`) — before download, QC, or picks. QC verdicts come AFTER the reveal, below it, never as a gate.** Every take surfaces to the editor the moment its `result_url` exists, labeled (v-number). Never hold takes for a QC read; never deliver only "the passes" — the editor is the creative director and sees raw gens first.

THEN, below the reveal, add the skill's recommendation: build a contact strip (`ffmpeg ... hstack`), read it, and verdict each take against the five rules — phone/UI artifacts, posing, wide framing, grain — with honest per-take verdicts. The editor picks; the verdicts are advice, not a filter.

Every handoff message carries the Lucid handoff block (📁 raw path + 🔗 LinkYourFile + 🦊 Fox.io) — including mid-iteration drops.

## The pose rule — the hero ref's pose is EVERY clip's opening frame (Sam, 2026-06-11, Granny build)

This ref seeds frame-to-video: every 8s Veo clip of the creative OPENS from this exact body position. A frozen dramatic gesture (hand cupped beside the mouth, finger point, raised fist) means all 8 clips boot identically — instantly reads as AI on a stringout. Therefore, in the HERO ref:

- **Energy lives in the FACE only**: mouth open mid-word, eyebrows mid-expression, slight lean toward the lens.
- **Hands and body start NEUTRAL**: resting naturally in the lap / on the chair arm / loosely on the desk — "a natural resting body position that a video could continue from in any direction."
- Dramatic-gesture takes are still worth generating during exploration (they sell the character to the editor) — but once a gesture-take wins, refire it pose-neutralized with the winning take as the identity anchor: *"The exact same woman from the reference image, same outfit, same setting, same framing. Change ONLY her pose: hands lowered and relaxed, resting naturally in her lap... energy carried entirely in her face."* Identity-locked pose edits converge in one round.

## Iteration grammar

The editor will iterate wardrobe/look. Change ONLY the [IDENTITY] sentence; never touch the speech, camera, framing, or negative blocks. Glasses off = also append "No glasses of any kind." Keep prior takes; new fires get fresh v-numbers.

## Downstream

Hero picked → hand to **`ugc-talking-head-veo`** (writes the Veo master + dialogue manifest around this exact ref). The ref's filename gets named in the request's 🤖 Asset Generation section if the project is AGF-staged.
