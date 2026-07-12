---
name: nano-banana-prompting
description: Write prompts for Google's Nano Banana Pro (Gemini 3 Pro Image). Three modes — (1) **structured layered prompts** for social-proof batches + character-consistent scenes (PFM rules 1-7, kill-switch closer); (2) **broadcast news / anchor / field-reporter** aesthetic (ENG camera, lavalier mics, off-camera eye line, anti-stock); (3) **iPhone camera-roll style** for character b-roll where authenticity beats polish (minimal ~700-char prompts, anchor phrases, anti-glossy; folds in the retired iphone-cameraroll-prompting skill). Use when an editor asks for Nano Banana / Gemini 3 Pro Image prompts, social-proof images, broadcast news shots, iPhone-style candids of reference people/kids, camera-roll or podcast story-ad b-roll, anti-AI-glossy output, reference-image consistency, or "make it look like a real phone snap / shot on iPhone".
---

# Nano Banana Pro Prompting — PFM (router)

How Power Fox Media writes prompts for Google's Nano Banana Pro (Gemini 3 Pro Image). Nano Banana Pro is wildly good but has two failure modes that kill PFM's use cases: the "AI look" (glossy skin, studio light, perfect bokeh, everyone smiling at camera) and reference drift (same character rendered with slightly different face/hair/outfit each run). Each mode below is a disciplined prompt structure that fixes both for its shot family.

**This file is the ROUTER.** Pick the mode from the trigger table, then load that mode's reference file — it holds the full craft (templates, tell/antidote tables, worked examples). Don't draft from the router alone.

## Which mode? (trigger table)

| The ask | Mode | Load |
|---|---|---|
| Social-proof batch (varied people holding a phone/document), character-consistent scene work with numbered refs, multi-person reference scenes | **1 — Structured layered** | `references/structured.md` |
| Anchor at a desk, field-reporter standup, sit-down news interview, news b-roll cutaway — anything that must read as a still from a REAL local news broadcast | **2 — Broadcast news** | `references/broadcast.md` |
| Character b-roll that must pass as a real photo from a real person's camera roll — podcast story-ad b-roll, candids of reference people/kids, "make it look like a real phone snap", anti-AI-glossy fights | **3 — iPhone camera-roll** | `references/camera-roll.md` |

Edge calls:
- **Camera-roll vs structured:** camera-roll when the character is the subject and authenticity outweighs polish (minimal ~700-char prompts); structured when it's a social-proof batch of unique people or a setting-driven shot (layered rules 1-7 + kill-switch closer).
- **Broadcast wins over both** for anything news-flavored — the iPhone-candid craft actively fights the broadcast aesthetic.
- **Modes never mix in one prompt.** `cinematic` + `amateur snapshot` cues fight and land in an uncanny middle.

## Shared cross-mode laws (apply in EVERY mode)

1. **CLI-only firing; MCP firing FORBIDDEN.** This skill is prompt-craft — the fire is always `higgsfield generate create nano_banana_2 ...` via a PFM execution skill. The Higgsfield MCP `generate_image` / `media_upload` / `media_confirm` tools are never used to fire; MCP is read-only inspection (and the post-gen widget review via `show_generations` / `job_display`). See `feedback_higgsfield_workflow.md`.
2. **House default aspect: 9:16 vertical (locked 2026-06-17)** — every mode, every fire, unless the editor explicitly asks otherwise or the format self-declares horizontal. The structured templates' `vertical 4:3` is a deliberate per-template exception, not a default (see `references/structured.md`).
3. **Brand-clean, always.** No third-party brand names, logos, readable signage, or carrier/retailer marks anywhere in frame; per-vertical negative stacks apply (insurance carriers, automaker badges, appliance brands, etc.). The full negative-block craft + the narrow subject-brand exception live in `references/camera-roll.md` ("Brand-name negative block"); the law itself applies to all three modes. See `feedback_pfm_brand_clean_rules`.
4. **Image-as-reference beats prose for anything recurring.** Recurring characters AND recurring settings are locked by passing a prior generation (or master) as a `--image` ref, scoped explicitly — *"use reference N ONLY for [identity/the kitchen], not pose/composition/lighting."* Re-describe identity in text as well (numbered refs, restated features). Mode files carry the per-mode phrasing; the mechanics live in `higgsfield-image-generation` ("image-as-reference trick").
5. **One negative closer, never a wall.** Every photorealistic prompt ends with a short negative line tuned to the mode (kill-switch / broadcast closer / anti-grade line). Stacking 10+ negatives backfires — the model reads them as a polished-photography shopping list.

## Per-mode pointers

### Mode 1 — Structured layered (`references/structured.md`)
The PFM prompt structure in order (camera → identity lock → action → setting → composition → lighting → realism texture → kill-switch closer), Rules 1-7, the six variation axes for social-proof batches, verbatim document/screen locks, the AI-tell/antidote table, both templates (character-consistent scene + social-proof batch item), quick-reference phrase banks, pitfalls.

### Mode 2 — Broadcast news (`references/broadcast.md`)
The negative-stacking trap (anti-stock negatives backfire — describe positively), the video-frame framing trap, broadcast ENG camera declaration, the prominent-people Veo block + upstream Nano Banana fixes, lavalier mics (the #1 broadcast tell), off-camera eye lines, reference scoping to identity-only, ordinary-person wardrobe palette, three templates (news interview subject / field-reporter standup / anchor at desk), broadcast tell/antidote table, the short broadcast closer.

### Mode 3 — iPhone camera-roll (`references/camera-roll.md`)
Minimal-beats-verbose (~700 chars), anchor phrases, imperfections used sparingly, words to avoid (polish triggers), the raw "straight-off-the-phone" variant (boring light + mundane clutter + default-processing language + anti-grade negative; the "camera roll"-in-prompt and date-stamp pitfalls), aspect defaults, the phone-screen problem (never character + visible screen in one image), brand-name negative blocks, reference discipline (masters + shirts, shirt rotation, recurring guests/settings), photo aging, selfie vs third-person framing, worked good/bad examples.

## Cross-references (PFM workflows)

This skill is **prompt-craft only** — it writes the prompt text. To actually fire a Nano Banana / NB Pro gen, hand off to one of the PFM execution skills:

- **`higgsfield-image-generation`** — CLI-driven, one-off image fires. Use for exploratory gens, character master creation, social-proof batches outside a Notion project.
- **`hig-flow`** — the b-roll pipeline + shared fire/deliver spine (`fire_batch.py`). B-roll routes type-first (`iphone-broll`, `jre-swap`, `social-proof-phone-quote`, `broadcast-news-stills`, `object-inserts`); those type skills load this skill for their prompt bodies.

The formerly-separate `iphone-cameraroll-prompting` skill was folded into Mode 3 on 2026-05-27. The three modes were split into `references/` on 2026-07-09 (this router replaced the monolith; content moved verbatim).

## Source material

- [Google — Prompting tips for Nano Banana Pro](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)
- [Google Cloud — Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
- [Google DeepMind — Gemini 3 Pro Image](https://deepmind.google/models/gemini-image/pro/)
- [Prompting.systems — Character consistency guide](https://prompting.systems/blog/nano-banana-pro-character-consistency-guide)
