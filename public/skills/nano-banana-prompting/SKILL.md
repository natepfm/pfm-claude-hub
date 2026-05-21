---
name: nano-banana-prompting
description: Write prompts for Google's Nano Banana Pro (Gemini 3 Pro Image) for photorealistic social-proof images, character-consistent scenes, and iPhone-style candid photos. Use whenever the user asks for Nano Banana prompts, social proof images, iPhone-quality photos of reference people/kids, "amateur snapshot" style AI imagery, or batches of varied testimonial-style images (couples, customers, users holding phones/documents). Triggers on mentions of Nano Banana, Nano Banana Pro, Gemini 3 Pro Image, social proof images, iPhone selfie prompts, reference-image consistency, or "make it look like a real photo."
---

# Nano Banana Pro Prompting — PFM

This skill encodes how Power Fox Media writes prompts for Google's Nano Banana Pro (Gemini 3 Pro Image). It covers two workflows that come up constantly: **character-consistent scene prompts** (same people, new setting) and **social-proof batches** (varied people, same product/document in-hand).

## Why this skill exists

Nano Banana Pro is wildly good but has two failure modes that kill PFM's use cases: the "AI look" (glossy skin, studio light, perfect bokeh, everyone smiling at camera) and reference drift (same character rendered with slightly different face/hair/outfit each run). Both are fixable with disciplined prompt structure. Social proof images especially — if they all look posed, lit, or framed the same way, the set reads as fake at a glance and the creative underperforms. This skill exists to produce images that pass the "would I scroll past this on Instagram?" test.

## The hard rules

### Rule 1. Always use the PFM prompt structure, in order

Write full sentences, not tag soup. Layer the prompt in this order:

1. **Camera declaration** — `Amateur iPhone photo/selfie, shot on iPhone [12/13/14/15/15 Pro], vertical 4:3 aspect.`
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

> Amateur iPhone photo, shot on iPhone [model], vertical 4:3 aspect. [Subject description from reference — "the two children from the reference images" or "Child A with curly brown hair from Image 1 and Child B with blonde pigtails from Image 2"]. [Action, mid-motion]. Keep their facial features, hair, and outfits exactly the same as in the reference images.
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

> Amateur iPhone selfie, shot on iPhone [model, varied across batch], vertical 4:3. [Age + ethnicity + gender + outfit + hair — one concrete sentence]. [Expression — grinning, surprised, mid-laugh, "no way" face]. Holding [phone showing reference screen / printed reference document] toward the camera. Keep the [UI/document] identical to the reference image — same [logo, layout, fine print]. Only change [value] to **[new value]**.
>
> Background: [specific lived-in setting with two or three named props]. [Lighting — named source, named direction, specific temperature]. [Realism texture — skin, motion blur, noise, white balance]. [Composition — tilted, cropped, edge detail].
>
> Negative: not a professional photograph, no studio lighting, no shallow cinematic bokeh, no HDR, no color grade, no retouching, no rim lighting.

## Quick reference — phrases that reliably work

**Camera opener:** `Amateur iPhone photo/selfie, shot on iPhone 15 Pro, 26mm main lens, vertical 4:3 aspect.`

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
- Don't generate an entire social-proof batch in a single unbroken session — spacing them out across sessions introduces helpful micro-drift so the set feels less uniform.

## Broadcast news image prompting

This is a DISTINCT workflow from the iPhone-candid template above. Broadcast news images (anchor desk shots, field reporter standups, sit-down interviews on a couch, b-roll cutaways) have their own aesthetic and their own failure modes. The iPhone-candid template will actively fight you here — don't use it. Use this workflow instead.

### When this workflow applies

- Anchor at a news desk delivering a segment
- Anchor standing in front of a video wall presenting B-roll
- Field reporter standing outside a location holding a stick mic
- Sit-down interview of a subject in their home
- Couple interview on a couch
- B-roll close-ups (hands holding a phone/document, parking lot, traffic, etc.)

For any of these, the generated image should read as a **still from a real local news broadcast**, not a professional photo shoot.

### The single biggest trap: negative stacking backfires

The intuitive move is to stack anti-stock negatives — *"not a stock image, not a studio portrait, not a magazine shot, not a Christmas card…"* — and hope that Nano Banana steers away from the polished aesthetic. **It does not work.** In practice, the more "NOT stock" negatives you pile on, the MORE polished the output becomes.

Why: Nano Banana reads the accumulated negatives as a shopping list of professional photography vocabulary, and its underlying priors interpret all that vocabulary as a polished-image brief. The negatives semantically pollute the prompt.

**The fix: describe the scene positively, in plain language.** Tell Nano Banana what the image IS, not what it isn't. One closing negative is fine; a wall of them backfires.

- Bad: *"NOT a stock image, NOT Getty Images, NOT Shutterstock, NOT Adobe Stock, NOT a real estate listing photo, NOT a LinkedIn outdoor portrait, NOT a travel blog aesthetic, NOT a magazine editorial, NOT a styled commercial photo shoot, NOT a pageant pose…"*
- Good: *"Local TV news interview with a suburban couple in the living room of their home. The husband is mid-sentence, talking to a reporter off-camera right."*

### The video-frame framing trap

Saying *"paused video frame from a live news broadcast"* also tends to read stock. Nano Banana interprets "paused video frame" as "polished still image with a video-esque color grade," which is just a different flavor of polished photo.

**Better:** describe the scene as a local TV news interview happening, not as a frozen frame. *"Local TV news interview with a couple on their couch"* gets cleaner output than *"A paused video frame from a local TV news broadcast showing a couple on their couch."*

### Broadcast camera declaration

Replace the iPhone camera declaration with a broadcast ENG camera declaration. Broadcast cameras have distinct optical properties that separate the image from cinema or stock photography:

> Shot on a broadcast ENG camera — deeper depth of field than cinema, slight video softness, standard broadcast color grade.

Key specs to mention:
- **Broadcast ENG camera** (not cinema camera, not DSLR, not iPhone)
- **Deeper DOF than cinema** (the background is softly defocused but still readable — the subject isn't melting into creamy bokeh)
- **Slight video softness** (not razor-sharp 4K photography)
- **Standard broadcast color grade** (slightly muted, slightly warm cast, not color-corrected to glossy perfection)

Reject: *"cinematic f/1.4 bokeh, shallow depth of field, rim-light halo, dramatic film lighting, golden-hour glamour."* These are all stock/cinema tells.

### The "prominent people" Veo block — and the Nano Banana upstream fix

Veo will sometimes block generation with a "prominent people" error even when the subject isn't actually a public figure. The block fires based on the combination of visual identity + styled wardrobe + polished aesthetic. When this happens, the fix is usually upstream — adjust the Nano Banana reference image so the subject reads as ordinary and anonymous, and the Veo block clears.

**Moves that break prominent-people detection:**

1. **Add reading glasses.** Simple wire-frame reading glasses on an interview subject instantly break celebrity detection. The glasses introduce a distinctive anti-glamour feature that no celebrity headshot would have.
2. **Swap styled wardrobe for ordinary everyday wardrobe.** Designer blazer → plaid flannel shirt. Silk blouse → plain heather-grey pullover sweater. Anything "styled" that reads as wardrobe-department becomes "regular person dressed themselves" clothing.
3. **Drop all jewelry except a wedding band.** Necklaces, statement earrings, bracelets all push the subject toward styled-media look. A plain wedding band reads as ordinary married person.
4. **Add "private citizen" language.** Include in the prompt: *"These are ordinary anonymous middle-class American [homeowners/drivers/etc.] — not celebrities, not public figures, not known people."* Repeat once more as a closing line.
5. **Age-shift slightly.** If the subject reads as mid-30s to mid-40s (peak celebrity demographic), shifting them to early 50s or late 40s moves them into a demographic with fewer celebrity matches.

Apply these as a stack — usually 2–3 of them together will clear the block.

### Lavalier microphones — the #1 broadcast tell

Every person on camera in a news production should have a **small black lavalier microphone clipped to their shirt near the second button, with a thin black cable running down behind the clothing.** This applies to:

- Anchors at the desk (clipped to the blazer lapel)
- Field reporters on location (clipped to the shirt, in addition to their handheld stick mic)
- Sit-down interview subjects
- Silent companions in frame (the wife sitting next to the husband being interviewed — yes, she still gets a lav)

Real news crews mic everyone in frame. Stock photography never includes lavaliers. Explicitly describing the lavalier is the single strongest positive signal that an image is broadcast-authentic, not styled stock.

### Off-camera eye line for interview subjects

Interview subjects in news packages do NOT look at the camera lens. They look at the interviewer, who is sitting just off-camera (usually camera-right). If the subject stares into the lens, the image reads as a VSL pitch or a stock "tell us your story" shot, not a news interview.

- **Anchors at desk / reporters doing standups:** direct camera, locked on lens.
- **Interview subjects (sit-down in home, street interview, etc.):** eyes off-camera right, locked on the off-frame interviewer.

Reinforce three times in the prompt: *"His eyes are on the interviewer, not the camera lens. He is not looking at the camera."*

### Reference image scoping — identity only, NOT composition

When Nano Banana gets a reference image, it pulls from that image by default — identity, composition, lighting, wardrobe, everything. For news production, you often want just the identity (face, features, build) and nothing else.

**Explicitly scope the reference:**

> Reference image 1: Use ONLY for identity — [subject]'s face, [distinctive feature], [distinctive feature]. DO NOT copy the reference's background, lighting, composition, wardrobe, or aesthetic.

Name the specific elements to ignore. Otherwise the generated image drifts toward the reference's whole vibe.

### Ordinary-person wardrobe palette

For interview subjects (the Hero Husband, the Struggling Wife, street-interview bystanders), the wardrobe should read as "this person dressed themselves for a news crew coming over," not as "this person was dressed by a stylist." Working palette:

- Plaid flannel shirt (muted blue/grey tones), sleeves rolled up, over a plain cotton tee
- Plain heather-grey pullover sweater with simple round neckline
- Solid-color casual button-down (light blue chambray), sleeves rolled, untucked
- Quarter-zip fleece (dark navy or charcoal) over a plain tee
- Simple cardigan (neutral color — cream, camel, oatmeal) over a plain blouse
- Plain henley or long-sleeve tee in a solid color

Add plain wedding bands, no other jewelry, glasses optional (as needed for anti-celebrity).

**Reject:** designer blazers, silk blouses, statement necklaces, stacked rings, stylized neckline cuts, branded athleticwear, anything that reads catalog.

### Template — news interview subject

Use for sit-down interview shots of a subject in their home.

> Local TV news interview with a [subject description] in [their living room / on their front porch / in their kitchen / etc.]. [Subject from reference]: [brief identity lock — face, hair, age, distinguishing features]. Wearing [ordinary wardrobe description — see palette above] and a small black lavalier microphone clipped to [garment] near the second button.
>
> [Subject] is mid-sentence, talking to a reporter off-camera right. Mouth open forming a word, [optional hand gesture at chest height], body leaned slightly forward. Eyes on the reporter, not the camera lens.
>
> [Natural home setting with 2–3 specific lived-in details — mismatched bookshelf, framed photos hung slightly crooked, a lamp with trailing cord, etc.]
>
> [Natural daylight from an off-frame window, mixed with soft interior fill. Uneven, real light across the face — not three-point Hollywood lighting.]
>
> Shot on a broadcast ENG camera — deeper depth of field than cinema, slight video softness, standard broadcast color grade. Real skin texture, visible pores, loose hair strands.
>
> [Subject] is an ordinary private [homeowner/driver/etc.], not a public figure or recognizable person.
>
> No text on screen. No chyrons. No lower-third banners. No logos. No watermarks. No additional people in the frame.

### Template — field reporter on-location standup

> Local TV news field reporter standing outside [specific location], delivering a live standup to camera.
>
> [Reporter identity — early-30s female, shoulder-length brown hair, etc.]. Wearing [field-appropriate casual wardrobe — NOT a blazer] and a small black lavalier microphone. Holds a handheld stick microphone at chest level, matte black with a plain dark flag (no station logo — composited in post).
>
> [Reporter] stands centered in the frame, body squared to camera, looking directly into the lens. Caught mid-word, mouth open, actively delivering the report. Natural outdoor posture, slight breeze movement in hair.
>
> Behind her, [specific location from reference image — home exterior, street scene, etc., softly defocused but recognizable]. [Weather — overcast diffused daylight, NOT sunny, NOT golden hour, unless the reference demands otherwise].
>
> Shot on a broadcast ENG camera — deeper depth of field, slight video softness, standard broadcast color grade. Camera at chest height, slightly below eye level (news tripod angle). Very slight handheld micro-drift.
>
> No text on screen. No chyrons. No LIVE bug. No station logo on the mic flag. No watermarks. No other people in the frame.

### Template — anchor at desk

> Local TV news anchor at the desk delivering a segment. A mid-40s woman with shoulder-length wavy brunette hair, wearing a fitted [jewel-tone] blazer over a cream blouse, a small lavalier mic clipped to the lapel, small stud earrings, a delicate pendant necklace.
>
> Seated at a modern dark-wood news desk, body squared to camera, looking directly into the lens. Caught mid-word. Composed, authoritative, warm. Natural blink, slight brow lift.
>
> Behind her, a large video wall showing softly defocused [appropriate B-roll — city skyline, suburban neighborhood, etc.]. Studio set with dark panels and subtle colored accent lighting at the edges.
>
> Shot on a broadcast ENG camera — deeper depth of field, slight video softness, standard broadcast color grade. Warm key light on her face from front-right, cool ambient from the video wall.
>
> No text on screen. No chyrons. No lower thirds. No station logos. No weather ticker. No watermarks.

### Broadcast-specific AI tells and antidotes

| AI tell | Broadcast antidote |
|---|---|
| Shallow cinematic f/1.4 bokeh | `deeper depth of field than cinema, broadcast ENG camera, background softly defocused but readable` |
| Rim-light halo around head | `no rim light, natural key light only, uneven lighting` |
| Styled wardrobe / designer look | `plain flannel / plain sweater / ordinary everyday wardrobe` |
| Celebrity-adjacent appearance | `reading glasses + ordinary wardrobe + no jewelry beyond wedding band + "private citizen" language` |
| Polished composition / balanced framing | `slight imperfect framing, a touch of extra headroom, slightly unbalanced` |
| Perfect soft even lighting on face | `uneven mixed daylight + softbox, subtle warm/cool mismatch across the face` |
| "Paused frame" reading as polished still | drop the "paused frame" language entirely, describe the scene happening |
| Both subjects smiling at camera | `subject mid-sentence, mouth open forming a word, eyes off-camera right on the interviewer` |
| Pristine clean background | `lived-in details — a lamp cord trailing along the baseboard, mismatched bookshelf, framed photos slightly crooked` |
| Sunny blue sky / golden hour on outdoor standup | `overcast diffused daylight, cloud cover acting as natural softbox, no direct sun, cool-neutral color temperature` |

### Broadcast negative closer

For broadcast news images, the negative closer is shorter than the iPhone-candid kill-switch. Too many negatives backfires (see above). Use:

> Negative: no text on screen, no chyrons, no lower-third banners, no logos, no watermarks, no additional people in the frame.

Add a single anti-stock line only if the output is drifting stock on first render:

> Not a stock image, not a magazine portrait, not a commercial photo shoot.

Do NOT stack 10+ "not a [platform]" negatives. One closing line at most.

## Cross-references (PFM workflows)

This skill is **prompt-craft only** — it writes the prompt text. To actually fire a Nano Banana / NB Pro gen, hand off to one of the PFM execution skills:

- **`higgsfield-image-generation`** — CLI-driven, one-off image fires. Use for exploratory gens, character master creation, social-proof batches outside a Notion project.
- **`hig-flow`** — gated 9-step PFM pipeline for Notion-request-driven b-roll batches. Use when an editor drops a Notion request URL inside a Lucid Link project folder.
- **`iphone-cameraroll-prompting`** — sibling prompt-craft skill for camera-roll-aesthetic (real phone snap) images. Use that one instead of this one for character-driven podcast story-ad b-roll where authenticity matters more than polish.

**Firing tool is always the Higgsfield CLI** (`higgsfield generate create nano_banana_2 ...`). The Higgsfield MCP `generate_image` tool is forbidden for actual gens — MCP is read-only inspection only. See memory `feedback_higgsfield_workflow.md`.

## Source material

- [Google — Prompting tips for Nano Banana Pro](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)
- [Google Cloud — Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
- [Google DeepMind — Gemini 3 Pro Image](https://deepmind.google/models/gemini-image/pro/)
- [Prompting.systems — Character consistency guide](https://prompting.systems/blog/nano-banana-pro-character-consistency-guide)
