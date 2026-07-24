---
name: environment-location-builder
description: Guide the user through creating a new AI-generated environment/location for video or image production — from a hero photo prompt to a full 360° location sheet (front / back / left / right views from the same spot). Use this skill whenever the user wants to create a place, location, environment, scene, or setting for AI generation ("vytvoř místo", "create a location", "environment prompt", "location sheet", "360 view of a place", "views to the left/right/behind"), wants a prompt for generating a photo of an environment, or uploads a location photo and wants surrounding views generated. Also trigger when the user mentions needing spatial consistency of a location across shots or camera flips in AI video. This skill NEVER generates images itself — it only writes prompts, provides the bundled layout template, and analyzes images the user provides.
---

# Environment Location Builder

> Maintainer: Drake

Guide the user step by step from "I want a location" to a complete 360° location sheet they can use as a spatial reference for AI video/image production. The point of the workflow: know exactly what the world looks like in front of, behind, left of, and right of the camera spot — so camera flips, pans and POV changes stay spatially consistent across generated shots.

## Hard rules

- **NEVER generate, render, draw, or create any image, diagram, schema, or visual of any kind** — not even helpful sketches. This skill produces text prompts only.
- The only image this skill hands out is the bundled layout template file: `assets/environment_sheet_template.png`. Share it via the file-presentation tool when the workflow reaches Step 3.
- You MAY analyze images the user uploads (reference photos, generated results) and describe/extract details from them.
- Deliver every prompt in a single copy-pasteable code block, no commentary inside the block.
- Keep the conversation in the user's language; keep all prompts in English.

## Workflow

### Step 1 — Capture the location brief

The user says what place they want (e.g. "front yard of a house in Houston at noon"). Collect what's known from their message; only ask about gaps that materially change the prompt (time of day, weather, mood, region/style). Don't interrogate — one short round of questions max, and skip it entirely if the brief is already usable.

If the user uploads a reference image at this step: analyze it and fold its concrete details (architecture, vegetation, colors, light direction, weather) into the hero prompt so the generated location matches the reference.

### Step 2 — Deliver the hero photo prompt

Fill this exact template — one bracket category per line, one empty line between categories:

```
[photo type: ...],

[environment/location: ...],

[camera angle: ...],

[spatial composition: ...],

[atmosphere: ...],

[colour tone: ...],

[lighting: ...],

[visual effects: ...],

[film stock: ...]
```

Authoring guidance for a good hero prompt:

- **Max quality, always.** The hero photo is a reference asset — never degrade it with "iPhone quality" or UGC styling even if the final video will be UGC. Default `[photo type]` to ultra-high-resolution photorealistic environment photography; default `[film stock]` to a full-frame digital cinema camera, 8K, neutral color profile. The lo-fi look belongs in the later video prompt, not in the reference.
- **Camera angle** should be an eye-level standing shot from the spot where action will later happen (this becomes the 0° anchor of the sheet).
- **Spatial composition** must name a clear foreground "stage" (open lawn, street, clearing…) plus a defined background.
- **Bake realism into the light.** Uniform direct sunlight on large flat surfaces (grass, sand, concrete) reads as fake. Add shadow-casting elements — trees with dappled shadows across the foreground, hard shadows under objects — and mirror that in `[visual effects]` (contrast between overexposed sunlit patches and shaded areas).
- Match the wealth/style level the user asked for — "average middle-class house" means modest and lived-in, not a real-estate showcase.

Then tell the user: generate the image with this prompt, and come back with the result when they want the location sheet.

### Step 3 — Offer the location sheet

When the user returns (with or without showing the generated hero photo — showing it is optional):

1. Present the bundled layout template `assets/environment_sheet_template.png` to the user via the file-presentation tool. Its 2×2 layout is: **top-left = Front 0° (matches reference), top-right = Back 180°, bottom-left = Left 90° CCW, bottom-right = Right 90° CW.**
2. Recommend generating the sheet with **Nano Banana Pro** — in testing it handles the spatial 360° logic best (other models tend to fail at inferring the unseen street/context).
3. Deliver the sheet prompt (Step 4). Token convention: `@img1` = the layout template, `@img2` = the user's generated hero photo.

### Step 4 — Deliver the location sheet prompt

Use this template. The PANEL CONTENT RULES block below is written for a house/front-yard location — **adapt the panel descriptions to the actual location type** (for a forest clearing, a street, an interior, a beach, etc., describe what plausibly fills each direction's frame). Keep the structure and the anti-gravitation constraints ("NOT visible at all", "ONLY as a partial sliver at the far edge, never centered") intact — they are what stops the model from re-centering the hero subject in every panel.

```
[IMAGE TYPE: Environment location sheet collage in **exactly** the same 2x2 panel layout as @img1 — top-left: front view 0°, top-right: back view 180°, bottom-left: left view 90° counter-clockwise, bottom-right: right view 90° clockwise. This is a documentary 360° location survey, not artistic framing — each panel is a strict compass direction.]

[SUBJECT: Use the uploaded input photo @img2 as the ONLY reference for the location. The top-left panel must replicate @img2 identically. The other three panels are shot from the exact same standing spot and camera height — only the camera rotates on a tripod, it never moves.]

[PANEL CONTENT RULES:
— TOP-LEFT (front, 0°): identical to @img2, main subject centered.
— TOP-RIGHT (back, 180°): directly opposite the main subject — whatever plausibly lies behind the photographer fills the frame. The main subject of @img2 is NOT visible at all.
— BOTTOM-LEFT (left, 90° CCW): looking sideways to the photographer's left — the leftward continuation of the world fills the frame. The main subject of @img2 may appear ONLY as a partial sliver at the far RIGHT edge of the panel, never centered.
— BOTTOM-RIGHT (right, 90° CW): looking sideways to the photographer's right — the rightward continuation of the world fills the frame. The main subject of @img2 may appear ONLY as a partial sliver at the far LEFT edge of the panel, never centered.]

[SPATIAL LOGIC: All four views form one coherent 360° space — whatever sits at the left edge of the front view continues at the right edge of the left view; whatever sits at the right edge of the front view continues at the left edge of the right view; the back view connects the outer edges of both side views.]

[ENVIRONMENT & LIGHTING: identical time of day, weather and sun position as @img2 across all four panels — shadow direction stays consistent relative to the world, not the camera (if the sun is on the right in the front view, it must be on the left in the back view).]

[CAMERA & FILM STOCK: shot on full-frame digital cinema camera, 35mm lens, f/8, deep focus, 8K resolution, neutral color profile, photorealistic architectural photography.]

[DETAILS: The main subject of @img2 appears fully in ONE panel only (top-left). Perfect consistency of all elements across every angle, no duplicated landmarks in impossible positions, no text, no watermarks.]
```

Before delivering, concretize the generic phrases for the user's location: replace "main subject" with the actual subject (the house, the lighthouse, the fountain…) and fill each panel's "whatever plausibly lies…" with concrete content (street and neighbors' houses across the street; dense treeline; ocean horizon; …). If the user showed you the hero photo, pull those specifics from what's actually visible at its frame edges.

### Step 5 — Review the result (optional)

If the user shows the generated sheet, analyze it:

- Does each side panel actually look sideways, or did the hero subject sneak back into center frame?
- Do frame edges connect between adjacent panels?
- Is shadow direction consistent with a rotating (not moving) camera?

## Troubleshooting

- **Side panels show the hero subject again (most common failure):** tighten PANEL CONTENT RULES — describe concretely what must fill each side frame and restate the sliver-only constraint. If it still fails, generate the sides in separate single-image passes (only left, only right) instead of the whole grid at once.
- **Lighting drifts between panels:** add an explicit sun position ("if the sun is on the right in the front view, it must be on the left in the back view" — already in the template; concretize it with the actual sun position from the hero photo).
- **The unseen context looks implausible:** the model needs more world description — add a sentence to SUBJECT describing what kind of area surrounds the location.
- **Flat, fake-looking ground in the hero photo:** add shadow-casting elements (trees, structures) with dappled shadows across the foreground — see Step 2 guidance.
