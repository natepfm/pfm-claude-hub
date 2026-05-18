---
name: iphone-cameraroll-prompting
description: Write Nano Banana / Higgsfield image-edit prompts that produce photorealistic iPhone-camera-roll style images for ad b-roll — real phone-snap aesthetic, not polished AI-glossy photoshoot output. Use this whenever the user asks for images that look like "real phone photos", "iPhone shots", "camera roll" content, candid selfies, podcast story ad b-roll, or is fighting against AI-glossy / photoshoot-y / studio-looking results. Triggers on phrases like "make it look like a real phone snap", "iPhone selfie", "camera-roll style", "candid", "from his camera roll", "shot on iPhone", "casual photo", or general b-roll prompting work for podcast story ads where authenticity matters more than polish. Apply this skill BEFORE writing any Nano Banana / Higgsfield prompt for character-driven b-roll content. Pair with the higgsfield-image-generation skill when actually firing the prompts through the Higgsfield MCP.
---

# iPhone Camera-Roll Style Prompting

The default failure mode of Nano Banana for character images is "glossy photoshoot" — sharp focus everywhere, perfect framing, studio-grade lighting, AI-clean. For podcast story ad b-roll the goal is the opposite: it must read as a real photo from a real person's camera roll.

This skill is the prompting craft for that aesthetic.

## Core principle: simple beats verbose

Tight natural-language prompts (~3-5 short paragraphs, ~700 chars total) consistently outperform verbose structured prompts (~2000 chars with elaborate authenticity blocks and bullet-list negatives).

The verbose format dilutes prompt adherence — the model spreads attention thin across all the directives, and many of them cancel each other out. Short prompts let the model focus on the few things that matter and execute them well.

**Target structure:**
1. The shot, in one sentence ("A casual iPhone selfie of [character ref] doing [action] in [setting]")
2. Subject identity preservation ("Milton: identical to ref 1. Wearing the shirt from ref 2.")
3. The setting and lighting in one paragraph
4. One sentence on photographer + casualness ("Looks like his wife casually snapped this on her iPhone")
5. A short negative line covering brand names and any specific exclusions

That's it. No "Camera-roll authenticity:" bullet list. No three-paragraph negative block. The model knows what an iPhone photo looks like — it just needs the right anchor phrases pointing it at that mental space.

## Anchor phrases that work

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

## Imperfections to call for (sparingly)

These nudge the output away from AI-glossy. Don't stack all of them in one prompt — pick 1-2 per shot:

- Slight overexposure on highlights (lamp, window, sunlit countertop)
- Soft sensor grain in shadow areas
- Mild motion blur on a hand or arm
- Slightly off-center framing
- Warm indoor incandescent color cast (for evening shots)

The reason to use them sparingly: if you list five imperfections, the model averages them and ends up with something that just looks slightly hazy and weird. One specific imperfection ("slight overexposure on the lamp highlights") gives the model something concrete to render.

## Avoid these words

These all push toward AI-glossy / studio-looking output and undermine the whole aesthetic:

- "Professional", "cinematic", "polished", "high-end" — all signal "make it look like a movie still"
- "Sharp focus everywhere" — real iPhone photos have soft focus on everything outside the autofocus point
- "Studio lighting", "editorial lighting", "rim lighting" — all photoshoot vocab
- "Portrait mode background blur" applied heavily — small amount of background softness is fine, but heavy bokeh looks staged on phone photos
- **"Warm light"**, **"warm afternoon light"**, **"warm evening kitchen lighting"** — known polish trigger for indoor scenes. The model reads "warm light" language as Pottery Barn / magazine-kitchen lighting and produces overly pretty editorial output (perfectly balanced exposure, too-clean countertops, soft golden glow on cabinets). For interior scenes, use "natural daylight" or "harsh midday sun through the window" instead, or describe the scene without naming the lighting at all and let the setting carry it. (Distinct from the "warm incandescent color cast" imperfection above — that's a subtle tint cue, not a primary lighting direction.)

If the user's draft prompt has these words, swap them out. They're load-bearing in the wrong direction.

## Aspect ratios

- **9:16 vertical** — default for camera-roll content. Selfies, environmental shots taken by someone else, anything from a phone held vertically (which is most phone photos in the wild).
- **4:3 horizontal** — only when there's a specific narrative reason: "the neighbor took the group photo with the phone landscape", "shot through the windshield of the truck horizontally". Don't reach for this without justification.
- **1:1 square** — rarely. Only if the user wants Instagram-square specifically.

When in doubt, default to 9:16 vertical.

## The phone-screen problem

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

## Brand-name negative block — always required

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

## Reference image discipline

For PFM podcast story ad workflows:

- **Ref 1**: the character master (protagonist solo / couple / family — pick the right one for who's in the shot)
- **Ref 2**: the shirt or wardrobe item

Use the prompt language: "the man from reference image 1 (Milton)" + "wearing the shirt from reference image 2 (preserve its exact graphic and fit)".

**Shirt rotation:** rotate randomly across scenes for visual variety, but keep the SAME shirt within a single narrative scene. If two shots are part of the same encounter (e.g., L24 v1 and v3 both at the hardware store with the same guest character), the protagonist wears the same shirt in both — same encounter, same outfit. When in doubt, pick a fresh shirt the user hasn't seen yet in this batch.

**Recurring guest characters** (the wife when only the couple master exists, the son, one-off characters introduced mid-script): pass a prior generation as the ref instead of describing them by text. See the higgsfield-image-generation skill for the image-as-reference trick.

**Recurring settings (kitchens, driveways, parking lots, vehicle interiors):** the same image-as-reference trick applies to rooms and locations, not just people. The model invents new variations of a setting on every generation if you only describe it in prose — different cabinets, different counters, different windows, different storefront colors — even with detailed prompt language. Anchoring the setting with a media reference is the only reliable way to keep it consistent across multiple shots.

To lock a setting:
- Pass an existing project shot of that setting as a reference image
- In the prompt, name what the reference is for: *"Same exact kitchen as reference image 3 — preserve the kitchen environment precisely. Use reference image 3 ONLY for the kitchen environment, not for pose or expression."*

The "use reference 3 ONLY for X, not Y" framing matters — without it, the model will pull pose, expression, framing, and other elements from the reference, which usually fights what you actually want in the new shot. Be explicit about what to take and what to ignore.

This works for any element that needs to stay consistent across multiple shots: the protagonist's kitchen, his driveway, the hardware-store parking lot, the inside of his truck cab, even outdoor environments like a specific stretch of road or a recurring scenic overlook.

## "Aging" a photo to look from years ago

When the script needs a flashback ("we bought our house 5 years ago"), faking older camera quality rarely works — modern image models render "old camera" as either obvious VHS-style decay or generic noise, not the subtle thing real older iPhone photos look like.

**What works instead:**
- Render the subjects looking slightly younger ("smoother skin, slightly less mature in the face")
- Add period context: "Sold" rider sign on a real estate post, moving boxes on the porch, no kid yet (if the kid exists in the present-day family but not in the flashback)
- One sentence on color: "slightly warmer color cast and slightly less aggressive HDR processing typical of older iPhone photos from around [year]"

That's enough. The viewer reads "5 years ago" from the context (Sold sign, no kid present) more than from the photo's grain.

## Selfies vs third-person framing

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

## Concrete examples

### Good prompt (~700 chars, simple, works reliably)

> A real iPhone snapshot of the man from reference image 1 (Milton) sitting slouched on his living room couch in the evening, looking down at his phone. Soft warm lamp light, hint of a TV glowing softly in the background, lived-in suburban living room. He's wearing the shirt from reference image 2 (preserve its exact graphic and fit). Backwards black cap and glasses on. Phone held naturally in his right hand, screen tilted away from camera so we cannot see what's on the screen. Mildly engaged neutral expression — he's just casually checking his phone.
>
> Looks like his wife casually snapped this photo on her iPhone from across the couch. Real candid moment, slightly off-center framing, warm indoor color cast, not a posed photograph or studio shoot.
>
> No visible brand names or logos. Phone screen content not visible.

### Bad prompt (verbose, dilutes adherence)

> A casual iPhone-style photo of the man from reference image 1 (Milton) sitting on his couch... [followed by 6 more paragraphs covering "Camera-roll authenticity: shot on iPhone 15 Pro rear camera by his wife from across the couch, vertical 9:16 phone-photo orientation, natural smartphone HDR processing, slight overexposure on the brightest lamp highlights, soft sensor grain in the shadow areas of the couch, mild motion blur on his hand if any..." and a 200-char negative block listing 15 forbidden things]

The bad prompt has every right idea — it just buries them. The model can't tell which directives are load-bearing, so it averages everything and produces a polished-looking compromise that has none of the camera-roll character.

The fix isn't more directives. It's fewer, sharper ones.

## When NOT to use this skill

- The user wants studio-grade product photography (different aesthetic, opposite direction)
- The user wants stylized illustration or non-photorealistic output
- The user wants stock-photo-style polished imagery
- Pure UI screenshots without any character — those don't need "iPhone snapshot" framing; they need "iPhone screenshot saved to camera roll" framing, which is a different prompt structure (full-screen UI capture with status bar + home indicator, not a photo of a phone in a setting)
- The user is on a model that isn't Nano Banana / Higgsfield (e.g., Midjourney, Imagen). The principles partially transfer but the specific anchor phrases were tuned on Nano Banana — verify they work on the target model first.
