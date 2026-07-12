# Structured layered prompts — social-proof batches + character-consistent scenes

> Mode 1 of `nano-banana-prompting`. Full content moved here verbatim in the 2026-07-09 split; the router in `SKILL.md` decides which mode applies. Shared cross-mode laws (CLI-only firing, brand-clean, image-as-reference) live in the router.

## Why this skill exists

Nano Banana Pro is wildly good but has two failure modes that kill PFM's use cases: the "AI look" (glossy skin, studio light, perfect bokeh, everyone smiling at camera) and reference drift (same character rendered with slightly different face/hair/outfit each run). Both are fixable with disciplined prompt structure. Social proof images especially — if they all look posed, lit, or framed the same way, the set reads as fake at a glance and the creative underperforms. This skill exists to produce images that pass the "would I scroll past this on Instagram?" test.

## The hard rules

### Rule 1. Always use the PFM prompt structure, in order

Write full sentences, not tag soup. Layer the prompt in this order:

1. **Camera declaration** — `Amateur iPhone photo/selfie, shot on iPhone [12/13/14/15/15 Pro], vertical 9:16 aspect.` **The house default aspect is 9:16 (locked 2026-06-17).** `vertical 4:3` appears in the two templates below as a deliberate per-template choice (the phone-photo-held-out look of a social-proof shot) — it is a per-template exception, never a general default. When a template's 4:3 isn't load-bearing for the shot, fire at 9:16.
2. **Subject + identity lock** — who they are, referencing the image: `the woman from the reference image` or `Child A from Image 1 with curly brown hair`.
3. **Action** — what they're doing, mid-motion preferred (`mid-laugh`, `mid-climb`, `mid-bite`).
4. **Setting** — specific, lived-in, with named props.
5. **Composition** — casually framed, slightly tilted, with edge-of-frame imperfections.
6. **Lighting** — natural/available light, no flash unless specifically wanted.
7. **Realism texture** — skin, noise, motion blur, white balance.
8. **Negative / kill-switch line** — the "not a professional photograph" closer.

### Rule 2. The kill-switch closer is mandatory

Every photorealistic prompt ends with a negative line. Baseline:

> Negative: not a professional photograph, no studio lighting, no shallow cinematic bokeh, no HDR, no color grade, no retouching, no rim lighting, no posed smiles at camera.

Drop or swap items only if the shot genuinely wants them. This one line does more to kill the "AI look" than any positive phrase.

### Rule 3. Reference people get numbered and re-described every time

When the user attaches reference images, refer to subjects explicitly (`the child in Image 1`, `the woman from Reference 2`) AND restate their hair, outfit, and distinguishing features inside the new prompt. Don't assume Nano Banana will carry them forward. For multi-person prompts (up to ~5 consistent people), describe spatial relationships: *"Child A on the swing, Child B kneeling beside her."*

Add the identity-lock line: *"Keep their facial features, hair, and outfits exactly the same as in the reference images."*

### Rule 4. Social-proof batches must vary on six axes

When generating batches of testimonial-style images (couples holding a phone, customers holding a document, etc.), every prompt in the set must differ across these axes so the set doesn't read as a template:

1. **Age** (20s through 70s represented across the batch)
2. **Ethnicity** (mix, not one demographic)
3. **Solo vs couple vs pair vs family**
4. **Setting** (kitchen, couch, car, porch, office, mall, mailbox, etc.)
5. **Lighting** (morning daylight, overcast, golden hour, tungsten, mixed)
6. **iPhone model** in the camera declaration (subtly changes color science)

If two prompts in a batch share more than two of these axes, rewrite one.

### Rule 5. Reference documents/screens must be locked verbatim

When a prompt includes a phone screen or printed document that must stay consistent, add an explicit lock instruction and only call out what changes:

> Keep the [document/phone UI] identical to the reference image — same logo, header, layout, tables, and fine print. Only change [specific value] to [new value].

For documents with multiple linked values (e.g., monthly and annual premium), update all of them so the doc stays internally consistent. Don't leave one value from the original reference when the other has been changed.

### Rule 6. "AI tells" to avoid and their antidotes

| AI tell | Antidote phrase |
|---|---|
| Glossy, flawless skin | `natural skin texture with visible pores`, `laugh lines`, `faint sheen`, `a small blemish` |
| Everyone smiling at camera | `subject not looking at camera`, `caught mid-action`, `candid not posed` |
| Perfect rule-of-thirds framing | `casually composed`, `slightly tilted horizon`, `cropped awkwardly at the edge`, `off-center` |
| Flawless bokeh / cinematic DOF | `no bokeh`, `no cinematic color grade`, `mild digital noise in shadows` |
| Studio rim lighting | `available light only`, `no flash`, `no studio lighting` |
| Symmetrical face | `one eye slightly more squinted than the other`, `asymmetrical smile` |
| Too-clean background | name a specific messy prop (`a half-eaten bagel`, `painter's tape on the baseboard`, `school art magneted to the fridge`) |

### Rule 7. One generation, then iterate conversationally

Nano Banana Pro is best treated as a conversational editor, not a one-shot slot machine. After the first render, follow up with targeted edits (`make the lighting dimmer and add slight lens flare from the window`) instead of rewriting the prompt from scratch. This preserves reference-character fidelity across iterations.

## Template — character-consistent scene

Use when the user wants the same reference person/people in a new situation.

> Amateur iPhone photo, shot on iPhone [model], vertical 9:16 aspect. [Subject description from reference — "the two children from the reference images" or "Child A with curly brown hair from Image 1 and Child B with blonde pigtails from Image 2"]. [Action, mid-motion]. Keep their facial features, hair, and outfits exactly the same as in the reference images.
>
> [Setting — lived-in, with named props]. [Specific background detail out of focus].
>
> [Lighting — natural, available, specific time of day]. [Realism texture — skin, noise, motion blur, white balance imperfection]. [Composition — tilted, cropped, edge-of-frame imperfection].
>
> [Mood closer — "unposed family moment," "candid sibling beat," etc.]
>
> Negative: not a professional photograph, no studio lighting, no shallow cinematic bokeh, no HDR, no color grade, no retouching, no rim lighting, no posed smiles at camera.

## Template — social-proof batch item

Use inside a batch of 10 (or whatever count). Rotate the six axes from Rule 4.

> Amateur iPhone selfie, shot on iPhone [model, varied across batch], vertical 4:3 *(deliberate per-template exception — the held-out phone-photo look; see Rule 1; house default elsewhere is 9:16)*. [Age + ethnicity + gender + outfit + hair — one concrete sentence]. [Expression — grinning, surprised, mid-laugh, "no way" face]. Holding [phone showing reference screen / printed reference document] toward the camera. Keep the [UI/document] identical to the reference image — same [logo, layout, fine print]. Only change [value] to **[new value]**.
>
> Background: [specific lived-in setting with two or three named props]. [Lighting — named source, named direction, specific temperature]. [Realism texture — skin, motion blur, noise, white balance]. [Composition — tilted, cropped, edge detail].
>
> Negative: not a professional photograph, no studio lighting, no shallow cinematic bokeh, no HDR, no color grade, no retouching, no rim lighting.

## Quick reference — phrases that reliably work

**Camera opener:** `Amateur iPhone photo/selfie, shot on iPhone 15 Pro, 26mm main lens, vertical 9:16 aspect.` (4:3 only where the template deliberately calls for it — see Rule 1.)

**Lighting (pick one):**
- `available natural daylight, slightly overcast, soft shadows`
- `mixed indoor tungsten and window daylight, warm color cast`
- `golden-hour warm side light, slight lens flare`
- `direct on-camera flash, harsh falloff into shadow, slight red-eye` (for indoor-night pop)

**Realism texture stack:**
> slightly soft focus, mild motion blur on hands, visible digital noise in shadows, natural skin texture with pores and blemishes, imperfect white balance leaning warm.

**Candid framing stack:**
> casually composed, subject not looking at camera, mid-action, slightly tilted horizon, cropped awkwardly at the edge, someone's arm partially in frame.

## Pitfalls

- Don't mix `cinematic` with `amateur snapshot` — the two style cues fight and Nano Banana splits the difference into an uncanny middle.
- Don't stack more than three adjectives on one noun.
- Don't skip the kill-switch negative line just because the positive prompt is detailed. The negative is what prevents the slide back into "AI look" on regeneration.
- Don't refer to reference subjects only by pronoun ("she in the reference"). Always: `the woman with [hair] in [outfit] from Image 1`.
