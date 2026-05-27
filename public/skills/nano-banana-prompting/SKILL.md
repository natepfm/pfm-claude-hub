---
name: nano-banana-prompting
description: Write prompts for Google's Nano Banana Pro (Gemini 3 Pro Image). Three prompt-craft modes in one skill — (1) **structured layered prompts** for social-proof batches + character-consistent scenes (PFM rules 1-7 with kill-switch closer), (2) **broadcast news / interview / anchor / field reporter** aesthetic (broadcast ENG camera, lavalier mics, off-camera eye line, anti-stock discipline), (3) **iPhone camera-roll style** for character b-roll where authenticity beats polish (minimal ~700-char prompts, anchor phrases, anti-glossy discipline — supersedes the formerly-separate `iphone-cameraroll-prompting` skill, folded in 2026-05-27). Use whenever an editor asks for Nano Banana prompts, social proof images, iPhone-quality photos of reference people/kids, broadcast news shots, camera-roll character b-roll, candid selfies, podcast story-ad b-roll, anti-AI-glossy output, or "make it look like a real phone snap". Triggers on Nano Banana, Nano Banana Pro, Gemini 3 Pro Image, social proof, broadcast news, iPhone selfie, camera-roll, candid, "from his camera roll", "shot on iPhone", reference-image consistency, or "make it look like a real photo".
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

## iPhone camera-roll style (minimal prompts for character b-roll)

The default failure mode of Nano Banana for character images is "glossy photoshoot" — sharp focus everywhere, perfect framing, studio-grade lighting, AI-clean. For PFM podcast story ad b-roll where the image needs to read as a real photo from a real person's camera roll, the **structured layered approach from Rules 1-7 above is the wrong tool** — the verbose stack of directives dilutes attention and pulls the model back toward polish. For character-driven b-roll authenticity, **minimal beats verbose**.

This section is the prompting craft for the camera-roll aesthetic. Use it instead of (not alongside) the structured templates when working on podcast story ad character b-roll.

### When to use camera-roll style vs the structured templates above

Use **camera-roll style** when:
- The image should pass as a real iPhone photo from a real person's camera roll (NOT a polished AI image)
- The character is the subject and authenticity outweighs polish
- PFM podcast story ad b-roll (Milton at the table, Sam in his truck, etc.)
- The user fights against "AI-glossy" / "photoshoot-y" / "studio" output

Use the **structured templates** (Rules 1-7 + character-consistent scene + social-proof batch templates above) when:
- Social-proof batches with multiple unique people holding documents/phones
- Setting-driven shots (not character-driven)
- Polished interview / news segment work (use the Broadcast news section above for that specifically)

### Core principle: simple beats verbose

Tight natural-language prompts (~3-5 short paragraphs, ~700 chars total) consistently outperform verbose structured prompts (~2000 chars with elaborate authenticity blocks and bullet-list negatives).

The verbose format dilutes prompt adherence — the model spreads attention thin across all the directives, and many of them cancel each other out. Short prompts let the model focus on the few things that matter and execute them well.

**Target structure:**
1. The shot, in one sentence ("A casual iPhone selfie of [character ref] doing [action] in [setting]")
2. Subject identity preservation ("Milton: identical to ref 1. Wearing the shirt from ref 2.")
3. The setting and lighting in one paragraph
4. One sentence on photographer + casualness ("Looks like his wife casually snapped this on her iPhone")
5. A short negative line covering brand names and any specific exclusions

That's it. No "Camera-roll authenticity:" bullet list. No three-paragraph negative block. The model knows what an iPhone photo looks like — it just needs the right anchor phrases pointing it at that mental space.

### Anchor phrases that work

These short phrases reliably push the model toward camera-roll aesthetic. Pick what fits the shot — you don't need all of them in every prompt.

**Opening:**
- "A real iPhone snapshot of..."
- "A casual iPhone selfie of..."
- "A casual iPhone photo of..."

**Photographer:**
- "Looks like his wife casually snapped this on her iPhone from across the couch."
- "Snapped this himself from a few feet away."
- "His wife casually snapped this from the front porch."

**Anti-photoshoot:**
- "Real candid moment, slightly off-center framing, not a posed photograph."

The opening phrase + the anti-photoshoot line is usually enough. "Shot on iPhone 15 Pro" can help in some cases but isn't required if those two anchor phrases are in place.

### Imperfections to call for (sparingly)

These nudge the output away from AI-glossy. Don't stack all of them in one prompt — pick 1-2 per shot:

- Slight overexposure on highlights (lamp, window, sunlit countertop)
- Soft sensor grain in shadow areas
- Mild motion blur on a hand or arm
- Slightly off-center framing
- Warm indoor incandescent color cast (for evening shots)

The reason to use them sparingly: if you list five imperfections, the model averages them and ends up with something that just looks slightly hazy and weird. One specific imperfection ("slight overexposure on the lamp highlights") gives the model something concrete to render.

### Words to avoid (camera-roll mode)

These all push toward AI-glossy / studio-looking output and undermine the camera-roll aesthetic specifically:

- "Professional", "cinematic", "polished", "high-end" — all signal "make it look like a movie still"
- "Sharp focus everywhere" — real iPhone photos have soft focus on everything outside the autofocus point
- "Studio lighting", "editorial lighting", "rim lighting" — all photoshoot vocab
- "Portrait mode background blur" applied heavily — small amount of background softness is fine, but heavy bokeh looks staged on phone photos
- **"Warm light"**, **"warm afternoon light"**, **"warm evening kitchen lighting"** — known polish trigger for indoor scenes. The model reads "warm light" language as Pottery Barn / magazine-kitchen lighting and produces overly pretty editorial output (perfectly balanced exposure, too-clean countertops, soft golden glow on cabinets). For interior scenes, use "natural daylight" or "harsh midday sun through the window" instead, or describe the scene without naming the lighting at all and let the setting carry it. (Distinct from the "warm incandescent color cast" imperfection above — that's a subtle tint cue, not a primary lighting direction.)

If the user's draft prompt has these words, swap them out. They're load-bearing in the wrong direction.

### Aspect ratios (camera-roll defaults)

- **9:16 vertical** — default for camera-roll content. Selfies, environmental shots taken by someone else, anything from a phone held vertically (which is most phone photos in the wild).
- **4:3 horizontal** — only when there's a specific narrative reason: "the neighbor took the group photo with the phone landscape", "shot through the windshield of the truck horizontally". Don't reach for this without justification.
- **1:1 square** — rarely. Only if the user wants Instagram-square specifically.

When in doubt, default to 9:16 vertical.

### The phone-screen problem

The single biggest failure mode in character + phone shots is the model rendering the phone composited at unrealistic size, with the screen content as a giant overlay alongside the person. The result reads as a marketing graphic, not a phone photo. Users instantly clock it as fake.

**Solution: never combine character and visible phone screen in the same image.**

When the script needs a character looking at their phone:
- Phone screen explicitly angled away from camera ("phone tilted toward his face and away from camera so we cannot see the screen")
- Phone occupies normal held size in his hand, not 4× normal
- Describe his face/posture/reaction to what he's seeing, not the screen content itself

For the screen content itself, generate a SEPARATE pure-screenshot image:
- No character in frame, no phone bezel, no hand
- Just the in-app UI as if it were a screenshot saved to the camera roll
- Render the iPhone status bar (time on the left, battery and signal on the right) at the top, home-indicator bar at the bottom, full app UI in between
- Vertical 9:16, "crisp clean iPhone screenshot, no motion blur"

The editor cuts between [character looking at phone] and [the dedicated screenshot]. The juxtaposition is what reads as "he saw something on his phone" — never combine them in one image.

### Brand-name negative block — always required for camera-roll shots

PFM ads cannot show third-party brand names or logos. Every character/setting prompt needs a short negative line. The minimum:

> No visible brand names, no logos, no readable text on signs, no recognizable retailer branding.

Add specific exclusions for the scene as needed:

- **Hardware-store scenes**: "no orange 5-gallon buckets" (orange buckets code as Home Depot to viewers; switch to gray)
- **Insurance app screens**: "no Geico, Progressive, State Farm, Allstate, or other recognizable insurance company branding"
- **Social media UI**: "no real Facebook or Meta logos in the rendered UI" (the model knows what Facebook looks like and will render it from context — explicit ban needed)
- **Background vehicles**: "no readable Honda, Toyota, Ford, or other automaker badges on background vehicles"
- **Storefronts**: "no readable store signage, no recognizable retail branding"
- **Patagonia-style fleeces (for hardware-store-guy types)**: "no readable Patagonia logo or brand patch visible on the fleece" — but rendering the iconic 1/4-zip silhouette in maroon/burgundy is fine because that's not branded

**Subject brand exception (use carefully — narrower than it sounds):** if the AD ITSELF is selling a specific product, branding on that focal product is fine. Example: an ad selling the Tesla Cybertruck → Tesla emblems on the Cybertruck and Tesla signage in the dealership are fine, that's the subject.

But the "subject" of the ad is whatever the ad is **selling**, NOT whatever the protagonist happens to own or use. In a "Cybertruck owner" story ad for an insurance comparison site, the subject is the insurance comparison site — so Tesla branding is OFF, even though the protagonist drives a Cybertruck and the script explicitly mentions it. The iconic vehicle silhouette is enough; viewers recognize a Cybertruck without seeing the Tesla badge.

Same logic for any other recognizable vehicle, store, or third-party product the protagonist interacts with: if the ad isn't selling it, hide its branding. When in doubt, ask the editor what the ad is actually selling.

### Reference image discipline (camera-roll character work)

For PFM podcast story ad workflows:

- **Ref 1**: the character master (protagonist solo / couple / family — pick the right one for who's in the shot)
- **Ref 2**: the shirt or wardrobe item

Use the prompt language: "the man from reference image 1 (Milton)" + "wearing the shirt from reference image 2 (preserve its exact graphic and fit)".

**Shirt rotation:** rotate randomly across scenes for visual variety, but keep the SAME shirt within a single narrative scene. If two shots are part of the same encounter (e.g., L24 v1 and v3 both at the hardware store with the same guest character), the protagonist wears the same shirt in both — same encounter, same outfit. When in doubt, pick a fresh shirt the user hasn't seen yet in this batch.

**Recurring guest characters** (the wife when only the couple master exists, the son, one-off characters introduced mid-script): pass a prior generation as the ref instead of describing them by text. See `higgsfield-image-generation` for the image-as-reference trick.

**Recurring settings (kitchens, driveways, parking lots, vehicle interiors):** the same image-as-reference trick applies to rooms and locations, not just people. The model invents new variations of a setting on every generation if you only describe it in prose — different cabinets, different counters, different windows, different storefront colors — even with detailed prompt language. Anchoring the setting with a media reference is the only reliable way to keep it consistent across multiple shots.

To lock a setting:
- Pass an existing project shot of that setting as a reference image
- In the prompt, name what the reference is for: *"Same exact kitchen as reference image 3 — preserve the kitchen environment precisely. Use reference image 3 ONLY for the kitchen environment, not for pose or expression."*

The "use reference 3 ONLY for X, not Y" framing matters — without it, the model will pull pose, expression, framing, and other elements from the reference, which usually fights what you actually want in the new shot. Be explicit about what to take and what to ignore.

This works for any element that needs to stay consistent across multiple shots: the protagonist's kitchen, his driveway, the hardware-store parking lot, the inside of his truck cab, even outdoor environments like a specific stretch of road or a recurring scenic overlook.

### "Aging" a photo to look from years ago

When the script needs a flashback ("we bought our house 5 years ago"), faking older camera quality rarely works — modern image models render "old camera" as either obvious VHS-style decay or generic noise, not the subtle thing real older iPhone photos look like.

**What works instead:**
- Render the subjects looking slightly younger ("smoother skin, slightly less mature in the face")
- Add period context: "Sold" rider sign on a real estate post, moving boxes on the porch, no kid yet (if the kid exists in the present-day family but not in the flashback)
- One sentence on color: "slightly warmer color cast and slightly less aggressive HDR processing typical of older iPhone photos from around [year]"

That's enough. The viewer reads "5 years ago" from the context (Sold sign, no kid present) more than from the photo's grain.

### Selfies vs third-person framing

**Selfies** want the person holding the phone explicitly:
- "Holding the phone at arm's length with his right hand"
- "Framed from mid-chest up"
- "Holding the phone in his free hand while he leans into the truck"

**Third-person** wants the photographer named:
- "Snapped this from across the couch"
- "From a few feet away"
- "His wife casually snapped this from the front porch"
- "Set on a stack of cases nearby with the timer"

This sells the photo as real — every real photo has a real photographer holding a real phone. Naming them grounds the output in a believable scenario.

### Camera-roll concrete examples

**Good prompt** (~700 chars, simple, works reliably):

> A real iPhone snapshot of the man from reference image 1 (Milton) sitting slouched on his living room couch in the evening, looking down at his phone. Soft warm lamp light, hint of a TV glowing softly in the background, lived-in suburban living room. He's wearing the shirt from reference image 2 (preserve its exact graphic and fit). Backwards black cap and glasses on. Phone held naturally in his right hand, screen tilted away from camera so we cannot see what's on the screen. Mildly engaged neutral expression — he's just casually checking his phone.
>
> Looks like his wife casually snapped this photo on her iPhone from across the couch. Real candid moment, slightly off-center framing, warm indoor color cast, not a posed photograph or studio shoot.
>
> No visible brand names or logos. Phone screen content not visible.

**Bad prompt** (verbose, dilutes adherence):

> A casual iPhone-style photo of the man from reference image 1 (Milton) sitting on his couch... [followed by 6 more paragraphs covering "Camera-roll authenticity: shot on iPhone 15 Pro rear camera by his wife from across the couch, vertical 9:16 phone-photo orientation, natural smartphone HDR processing, slight overexposure on the brightest lamp highlights, soft sensor grain in the shadow areas of the couch, mild motion blur on his hand if any..." and a 200-char negative block listing 15 forbidden things]

The bad prompt has every right idea — it just buries them. The model can't tell which directives are load-bearing, so it averages everything and produces a polished-looking compromise that has none of the camera-roll character.

The fix isn't more directives. It's fewer, sharper ones.

## Cross-references (PFM workflows)

This skill is **prompt-craft only** — it writes the prompt text. To actually fire a Nano Banana / NB Pro gen, hand off to one of the PFM execution skills:

- **`higgsfield-image-generation`** — CLI-driven, one-off image fires. Use for exploratory gens, character master creation, social-proof batches outside a Notion project.
- **`hig-flow`** — gated 9-step PFM pipeline for Notion-request-driven b-roll batches. Use when an editor drops a Notion request URL inside a Lucid Link project folder.

The formerly-separate `iphone-cameraroll-prompting` skill was folded into this skill's "iPhone camera-roll style" section on 2026-05-27 — use that section for camera-roll character b-roll work.

**Firing tool is always the Higgsfield CLI** (`higgsfield generate create nano_banana_2 ...`). The Higgsfield MCP `generate_image` tool is FORBIDDEN for actual gens — MCP is read-only inspection only. See memory `feedback_higgsfield_workflow.md`.

## Source material

- [Google — Prompting tips for Nano Banana Pro](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)
- [Google Cloud — Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
- [Google DeepMind — Gemini 3 Pro Image](https://deepmind.google/models/gemini-image/pro/)
- [Prompting.systems — Character consistency guide](https://prompting.systems/blog/nano-banana-pro-character-consistency-guide)
