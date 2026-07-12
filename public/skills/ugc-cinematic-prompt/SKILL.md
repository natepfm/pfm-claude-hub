---
name: ugc-cinematic-prompt
description: Write detailed video generation prompts for Seedance 2.0 (max 15 seconds) using a strict 11-block structure — STYLE, ENVIRONMENT, CHARACTER, PRODUCT, CONTEXT, ENERGY, CAMERA, LIGHTING, PHYSICS, AUDIO, TIME STAMPS. Use this skill whenever the user asks for a "video prompt," "Seedance prompt," "UGC prompt," "cinematic prompt," "ad prompt," or mentions references like @INFLUENCER_IMAGE / @PRODUCT_IMAGE / @CHARACTER_IMAGE, or asks to prompt Seedance or Kling — those two models ONLY. Also trigger whenever the user describes a product, character, or scene and wants a video script/prompt for it, even casually ("make me a prompt for X," "prompt for a video of Y holding Z," "write me a video prompt"). The skill adapts to any requested style — cinematic, UGC, anime, claymation, horror, vlog, documentary, surreal, etc. — and follows whatever the user specifies. Always use this 11-block structure — never improvise a different format. The prompt is the deliverable; an optional Higgsfield CLI fire path lets the editor run it without leaving Claude. NOT for Veo prompts (Veo has its own locked prompt families — hvg-flow masters, ugc-talking-head-veo, podcast-guest-veo). Also NOT for: image prompts (use nano-banana-prompting), and the reskin workflow (inspect a reference clip → swap subject for a brand character) lives in reskin-trending-video, which defers HERE for the prompt body.
---

# Video Prompt Writer (Seedance 2.0)

Write detailed video generation prompts using a strict 11-block structure. The structure is fixed — the content adapts to whatever the user asks for.

**Target model: Seedance 2.0.** Maximum video length is **15 seconds** — hard limit.

This is the **prompt-body** skill for PFM video gens. `reskin-trending-video` (inspect a trending clip → swap its subject for a brand character) drives the surrounding workflow and defers here for the actual Seedance block. When you're called from a reskin, the reference tokens and exclusions come pre-decided — just write the body.

## Core principle — the user is authoritative

The skill has no default style. It does not force cinematic, prestige, mythic, UGC, or any other aesthetic. Whatever the user specifies — tone, style, camera perspective, character behavior, environment, audio feel, pacing — is the north star.

- If the user says "cinematic and moody," make it cinematic and moody.
- If the user says "chaotic TikTok UGC with jump cuts," make it that.
- If the user says "claymation style in a candy shop," make it claymation in a candy shop.
- If the user says nothing about style, infer the most fitting style from the product, character, and setting they described. Pick one and commit — do not hedge.

**Fill gaps intelligently.** When the user leaves a block unspecified, choose the option that best serves what they did specify. Make it coherent, confident, and matched to their stated style. Never contradict what the user provided.

## Step 1 — Check for video length

Look at the user's request. If they specified a duration (e.g., "8 second clip," "make it 15s"), use that.

**If no duration is given, ask once — a single, plain question in chat (or the question tool if one is available):**

> "How long should the video be? (5 / 8 / 10 / 12 / 15 seconds)"

If the user names something else, take their exact number. **Hard cap: 15 seconds maximum.** Seedance 2.0 cannot generate longer videos. If the user requests anything over 15 seconds, tell them about the 15s limit and default to 15s.

Do not ask anything else unless the user's brief is truly unusable (no product, no character, and no setting — all three missing). If just one or two are missing, fill them in intelligently based on the rest.

Once you have the duration, proceed to Step 2.

## Step 2 — Generate the prompt

Use the exact block labels below, in the exact order. Every block must be present. Write long descriptive paragraphs, not bullet points. The only list-like blocks are AUDIO (sound elements separated by periods) and TIME STAMPS (each beat has a time label + paragraph).

### The required structure

```
STYLE
[Describe the visual style the user asked for. Film stock, rendering technique, aesthetic
reference, color palette, texture, grade. If the user named a style, lead with it. If they
named a reference (a film, a creator, a platform aesthetic), honor it. If they said nothing,
pick the style that best fits the character + product + environment and commit.]

ENVIRONMENT
[Describe the world, location, time of day, weather, atmosphere, and where the final hero
shot happens within it. Use exactly what the user described; enrich it with concrete sensory
detail.]

CHARACTER
[Describe the person or figure. If @INFLUENCER_IMAGE / @CHARACTER_IMAGE / @PRODUCT_IMAGE
or any reference token is used, state that the character must remain exactly consistent with
the uploaded reference in facial structure, features, wardrobe, and identity. Describe
wardrobe, posture, and emotional register as the user specified — or as best fits their
brief. Match the vibe they asked for, not a fixed template.]

PRODUCT
[Describe the product. If @PRODUCT_IMAGE or similar is referenced, state that packaging
must remain exactly consistent with the uploaded reference. Describe packaging details, how
it sits in the hand at real-world scale, and how it catches light in the given environment.
If the brief has no product (e.g. a character-only reskin), keep the block but state the
in-scene hero object or "no product — character is the subject" rather than dropping it.]

CONTEXT
[Describe the narrative situation: what's happening, why, and the action flow around the
product. End the block with a single-line beat flow using arrows that maps the action
sequence — e.g., walking → stopping → picking up product → turning in light → hero shot.
The arrow flow is required; the specific beats come from the user's brief.]

ENERGY
[Describe the emotional tone. Use vocabulary that matches the user's requested style —
mythic/restrained for prestige, chaotic/fun for TikTok, eerie/slow for horror, warm/soft
for lifestyle, etc. Do not force a single register across all prompts.]

CAMERA
[Describe camera approach. If the user specified a perspective (front-camera selfie, drone,
handheld, locked tripod, anamorphic cinema), use that. Otherwise, choose what best fits
the style — multi-shot montage for prestige, single handheld take for UGC, whip-zooms for
chaotic edits, static wide for documentary. List shot types concretely.]

LIGHTING
[Describe the lighting. Match it to the environment and style. Naturalistic for realism,
stylized for fantasy/horror, blown-out for bright lifestyle, practicals-only for noir.
Describe how the product packaging catches light in the final shot.]

PHYSICS
[Describe movement, fabric behavior, hair, breath (if cold), how the hand reaches for the
product, how the packaging bends and reflects, and how the product fits naturally in one
hand at correct scale. Match the physicality to the style — grounded and weighted for
realism, exaggerated and bouncy for animation, jittery for shaky UGC.]

AUDIO
[List diegetic sounds (environmental, fabric, footsteps), product interaction sounds
(wrapper crinkle, tab hiss, cap twist), and any score or music cue. Separate elements
with periods. Match the audio style to the requested aesthetic — restrained score for
prestige, trending audio for TikTok, eerie drone for horror, etc.]

TIME STAMPS
[Beat-by-beat breakdown scaled to the chosen duration. See timing table below. Each
beat gets a time range and a 2–4 sentence description. The final beat always lands on
the hero product shot.]
```

### Timing table — scale beats to the chosen video length

Seedance 2.0 caps at 15 seconds. Use these beat counts:

| Duration | Number of beats | Typical segmentation |
|---|---|---|
| 5 seconds | 2 beats | 0–2s establish + character / 2–5s product reveal + hero |
| 8 seconds | 3 beats | 0–3s establish / 3–6s character + action / 6–8s product reveal + hero |
| 10 seconds | 4 beats | 0–3s establish / 3–6s character / 6–8s reach + reveal / 8–10s hero push in |
| 12 seconds | 4 beats | 0–3s establish / 3–6s character + close ups / 6–9s reach + reveal / 9–12s hero push in |
| 15 seconds | 5 beats | 0–3s establish / 3–6s tracking / 6–9s close ups / 9–12s reveal / 12–15s hero push in |
| Custom (≤15s) | Scale proportionally, always ending the final beat on the hero product shot | — |

**Shorter videos (5s, 8s)**: compress the establishing and character sections — the product reveal still gets its own dedicated beat. Don't sacrifice the hero shot to cram in more story.

## Rules — non-negotiable

- **Use the exact block labels** in ALL CAPS, in the given order: STYLE, ENVIRONMENT, CHARACTER, PRODUCT, CONTEXT, ENERGY, CAMERA, LIGHTING, PHYSICS, AUDIO, TIME STAMPS. Every block must be present every time.
- **Never add a VOICEOVER block.** Do not include a voiceover line, tagline, or closing line anywhere in the output. Only include one if the user explicitly asks for it — never by default.
- **Never add "alternate closing lines," brand taglines, or closing copy.** The prompt ends at the final TIME STAMPS beat.
- **Write in long descriptive paragraphs**, not bullet points. The only list-like blocks are AUDIO (elements separated by periods) and TIME STAMPS (time label + paragraph per beat).
- **Preserve reference tokens verbatim.** If the user writes `@INFLUENCER_IMAGE`, `@PRODUCT_IMAGE`, `@CHARACTER_IMAGE`, or any custom token, use their exact spelling.
- **Always include the arrow beat flow** in CONTEXT (e.g., `action → action → action → hero shot`).
- **Deliver the prompt in a single code block** so it's copy-pasteable directly into Seedance. No commentary inside the prompt.
- **Match the user's requested style exactly.** Do not default to "mythic prestige" or any other fixed register unless the user asked for it.

## Filling gaps

When the user leaves something unspecified, use this order of priority:

1. **Match what they did specify.** If they said "bright office" and "UGC selfie video," fill CHARACTER with casual office-appropriate posture, fill LIGHTING with warm office daylight, fill AUDIO with HVAC hum and ambient office sounds.
2. **Match the product.** Energy drink → kinetic. Perfume → slow and sensual. Gaming chair → bold and confident. Skincare → soft and clean.
3. **Match the character.** A stained glass figure → surreal with light refractions. A leather-clad biker → gritty with engine rumble. A toddler → bright and bouncy.
4. **If still ambiguous, pick one confident option and commit.** Do not hedge or offer multiple versions.

## Examples of inputs and how to handle them

- *"Write me a Seedance prompt for @INFLUENCER_IMAGE holding a coffee in a forest, cinematic"* → Ask length, then generate cinematic forest scene.
- *"UGC style, girl in a car drinking the energy drink"* → Ask length, then generate UGC selfie video in a car, kinetic audio, handheld camera.
- *"Anime style commercial for sneakers, rooftop at sunset"* → Ask length, then generate anime-rendered rooftop scene, cel-shaded lighting, stylized physics.
- *"Horror vibe, 8 seconds, figure in a hallway holding a bottle"* → Length known (8s), skip the question, generate horror hallway with 3 beats, eerie drone audio, slow dolly camera.
- *"Make a 30 second prompt..."* → Tell the user Seedance 2.0 caps at 15 seconds, default to 15s and proceed.

## What you are NOT asked to do

- Do not add a voiceover line, tagline, or brand closer.
- Do not add alternate closing lines.
- Do not offer multiple tonal variants unless the user explicitly asks. One concept per request.
- Do not force a cinematic, UGC, or prestige default — honor whatever style the user asked for.
- Do not add commentary inside the prompt block.

## Optional — fire it (Higgsfield CLI)

**The prompt is the deliverable.** Once it's written, offer to fire it — don't auto-fire. If the editor says yes, run it through the Higgsfield **CLI**, never the UI (PFM thesis: CLI for firing, MCP read-only inspection only — see `higgsfield-image-generation` and memory `feedback_higgsfield_workflow.md`).

- **Seedance 2.0** job-set-type: `seedance_2_0`. **Kling 3.0**: `kling3_0` (no underscore).
- Default **count=1** (opt into `--count 2` only for an A/B pick). Verified model IDs, costs, Kling params, and aspect-ratio defaults live in `hvg-flow/refs/model-lineup.md`.
- **Always verify model IDs + flags against the live CLI** before firing — `higgsfield model list`. The CLI's actual job-set-types occasionally differ from intuition.
- Download into the editor's project folder with PFM filename conventions (unique 4-char hex suffix so DaVinci doesn't auto-group). Follow the download + naming rules in `higgsfield-image-generation`.

For PFM brand-safe work (insurance / finance / home), apply the PFM creative rules before firing — no carrier or brand names/logos, no celebrities, "could save" not "will save," authority figure outside the carrier/agent space. Full rules in `6. Claude PFM/CLAUDE.md`. (General non-PFM prompts: skip — the user is authoritative.)

## Cross-references

- **Reskin workflow that calls this skill** → `reskin-trending-video`
- **Image prompts (not video)** → `nano-banana-prompting`
- **Model lineup / costs / CLI flags** → `hvg-flow/refs/model-lineup.md`
- **Higgsfield CLI firing conventions** → `higgsfield-image-generation`
