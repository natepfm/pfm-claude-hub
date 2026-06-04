---
name: pfm-character-master
description: Generate scale-anchored PFM character master images for ANY character — human, animal, stylized-animated, or mascot/object — using a single locked-format reference sheet showing the character at correct proportional scale next to a 5'10" human silhouette anchor (or appropriate alternative for oversized / inanimate chars), in 5 angles (front / side / 3-quarter / back / sitting), rendered in the art style specified per character (photoreal, stylized 3D Pixar/Illumination, illustrated 2D). Use this skill whenever an editor needs a NEW character master for a PFM project (story-ad cast, recurring talent, supporting humans, antagonists, dogs/animals, mascots, dealership assistant manager, mortgage broker, tow driver, Hero Wife, "the guy at the park," "the kid from Katy") OR wants to re-fire an existing master with the scale anchor baked in. Triggers on phrases like "make a character master for X," "create a master for the [character]," "give me a new character," "add [character] to the cast," "spec a [type/role]," "character master with scale," "scale-anchored master."
---

# PFM Character Master — Scale-Anchored Reference Sheets

This skill produces PFM's locked character-master format for any character in a PFM creative — human, animal, animated, or mascot. One image, 5 angles, scale-anchored against a 5'10" human silhouette (or alternative anchor when the character itself IS human and the comparison silhouette plays a different role).

The scale anchor is the load-bearing part. Without it, NB Pro improvises character size and renders dogs at human-scale (anthropomorphic actors), or children at adult-height, or "tall guy" characters at the same height as everyone else. The silhouette gives the model an explicit "this is how tall the character is relative to a standard 5'10" adult" reference, and downstream b-roll prompts that include this master as an `--image` reference inherit the scale lock.

## When to use

- A new character appears in a PFM script and needs a master before any b-roll work — human OR non-human
- An existing master is missing the scale anchor and needs to be re-fired (v02 with scale)
- A supporting/one-off character (the neighbor, the gas-station attendant, the kid on the bike, the dealership manager, the mortgage broker) needs a quick master
- A recurring character across multiple ads (Hero Wife in Auto / Home / Loans conversions) needs an identity-locked master
- You want to spec a character (physical features, clothing, accessories, energy) and lock identity for an upcoming gen flow

**Pairs with:**
- `hig-flow` — uses character masters as input refs for b-roll gens
- `hvg-flow` — uses character masters as Veo `input_image` for clip generation
- `higgsfield-image-generation` — for one-off variations of an existing master

## Step 1 — pick the character type

The character type drives everything downstream — scale anchor behavior, prompt template branch, default art style, the pose set, negative prompts.

| Type | Examples | Default art style |
|---|---|---|
| `human` | Hero Wife, Mortgage Broker, Dealership Asst Manager, Tow Driver, "the kid from Katy," Founder (when shown as a person) | `photoreal` |
| `animal` | Max the Dog, Pup 1, Brother (yellow Lab), Park Guy (chocolate Lab), Founder Shiba Inu | `stylized-3d-pixar` |
| `stylized-animated` | Animated mascots that are NOT animals (e.g. an animated SMA wordmark character, an animated coin character) | `stylized-3d-pixar` |
| `mascot-object` | Inanimate brand mascots, object characters, oversized props treated as characters | `stylized-3d-pixar` |

Default to `human` for any character described as a person without an explicit "animated / Pixar / stylized" cue.

## Step 2 — pick the art style

Art style is independent of character type — a human can be photoreal OR stylized; an animal can be stylized OR (rarely) photoreal. Default to the type's default unless the editor specifies otherwise.

| Style | Description | Use when |
|---|---|---|
| `photoreal` | Natural-lit, iPhone-authentic photographic feel. Soft daylight, true skin tones, real-world textures, slightly imperfect (NOT studio-glossy) | Live-action story-ad humans, any character meant to feel filmed |
| `stylized-3d-pixar` | Stylized 3D Pixar/Illumination art style. Soft cinematic shading, expressive proportions, plush warm rendering | Animated dogs, animated mascots, the Max universe |
| `illustrated-2d` | Flat or semi-flat 2D illustration, clean line work, brand-graphic feel | Rare — use for brand-graphic mascots or 2D illustrated characters only |

## Step 3 — pick the scale tier

Pick the tier that matches the character's real-world height/scale. The tier dictates the character's height relative to the 5'10" silhouette anchor.

### Human tiers

| Tier | Character description | Height vs 5'10" silhouette |
|---|---|---|
| `human-tall` | Tall adult (6'2"+) | Crown ~4" ABOVE silhouette crown |
| `human-avg-male` | Average adult male (5'8"–5'11") | Crown matches silhouette crown |
| `human-avg-female` | Average adult female (5'4"–5'7") | Crown approximately at silhouette eye level |
| `human-short` | Short adult (under 5'2") | Crown approximately at silhouette nose level |
| `human-teen` | Teen (13–17) | Variable — default to crown at silhouette mouth level |
| `human-kid` | Child (6–12) | Crown approximately at silhouette chest level |
| `human-toddler` | Toddler (2–5) | Crown approximately at silhouette hip level |

### Animal tiers (most PFM dog work)

| Tier | Character description | Height vs 5'10" silhouette |
|---|---|---|
| `animal-large` | Adult Labrador, Golden Retriever, Border Collie, Shiba Inu, mid-large breeds | Shoulder at silhouette **hip** (~38" from ground) |
| `animal-small` | Adult Beagle, Corgi, smaller terriers | Shoulder at silhouette **mid-thigh** (~28" from ground) |
| `animal-puppy` | Young Lab/Golden puppy, similar growing puppies | Head at silhouette **knee** (~20" from ground) |
| `animal-young-adult` | College-age dog (older puppy / young adult Lab) | Shoulder slightly below hip (~34" from ground) |
| `animal-toy` | Adult Chihuahua, Pomeranian, very small breeds | Top of head at silhouette **mid-shin** (~12" from ground) |

### Mascot / object tier

| Tier | Use when | Anchor behavior |
|---|---|---|
| `mascot-character-sized` | Inanimate mascot rendered character-scale (3–5 ft) | Treat as `human-kid` to `human-avg-female` per spec |
| `mascot-oversized` | Mascot that should feel LARGER than human | Crown above silhouette crown per spec |
| `mascot-prop` | Small object treated as character | Sized against silhouette hand (~3 ft from ground) |

If unsure, default per type: `human-avg-male` for humans, `animal-large` for dogs.

## Step 4 — confirm the required inputs

Before firing, confirm with the editor:

1. **Character name** (e.g. "Hero Wife," "Mortgage Broker Marcus," "Max," "Park Guy")
2. **Character type** (per Step 1)
3. **Art style** (per Step 2)
4. **Scale tier** (per Step 3)
5. **Full visual spec** —
   - For humans: age, build, hair (style + color), skin tone, distinctive features (glasses, beard, freckles, etc.), wardrobe top + bottom + shoes, accessories (watch, jewelry, hat, bag)
   - For animals: breed, color/markings, collar (color + material + tag shape — strongest identity differentiator across a family), distinctive features
   - For mascots: form, material, color palette, accessories, distinctive features
6. **Personality energy** (one-line vibe — "warm Houston mom-energy," "laid-back LA brother," "smart tech kid," "no-nonsense Texas dealership pro")

These six fields feed the prompt template below.

## The prompt template (branches by type)

The locked format is the same across all types — single image, left-to-right lineup, neutral light-grey background, scale anchor on the far left. Only the slot fills change.

### Master template

```
A scale-anchored character reference model sheet for <CHARACTER NAME>, rendered in <ART STYLE DIRECTIVE>, on a clean neutral light-grey background. Match the reference images for the locked PFM character-master format and visual language.

The sheet shows, lined up left to right:

1. <SCALE ANCHOR LINE>

2. <CHARACTER NAME> standing front-on next to the silhouette. <SCALE LINE per tier>

3. <CHARACTER NAME> in side profile.

4. <CHARACTER NAME> in 3/4 view.

5. <CHARACTER NAME> in <POSE 5 per type>.

<CHARACTER NAME>: <FULL VISUAL SPEC>. Personality energy: <ENERGY LINE>.

<ART STYLE DIRECTIVE — long form>. Same render quality, same soft <natural / cinematic> lighting, same neutral light-grey background as the reference images.

Negative: <NEGATIVE PROMPT per type>.
```

### Slot fills by type

**Scale anchor line (slot 1)** — universal default:
> "An adult human silhouette in plain medium-grey outline form — no facial features, no clothing details, exactly 5 feet 10 inches tall, standing front-on. The scale anchor."

For `mascot-oversized` characters, override to:
> "An adult human silhouette in plain medium-grey outline form, 5 feet 10 inches tall, shown small relative to the character for scale comparison."

**Scale line (slot 2)** — paste verbatim per tier:

Human tiers:
- `human-tall`: "Standing at tall-adult scale: crown approximately 4 inches above the silhouette's crown (~6 feet 2 inches total)."
- `human-avg-male`: "Standing at average adult male scale: crown matching the silhouette's crown height (~5 feet 10 inches)."
- `human-avg-female`: "Standing at average adult female scale: crown approximately at the silhouette's eye level (~5 feet 5 inches)."
- `human-short`: "Standing at short-adult scale: crown approximately at the silhouette's nose level (~5 feet 1 inch)."
- `human-teen`: "Standing at teen scale: crown approximately at the silhouette's mouth level."
- `human-kid`: "Standing at child scale: crown approximately at the silhouette's chest level."
- `human-toddler`: "Standing at toddler scale: crown approximately at the silhouette's hip level."

Animal tiers:
- `animal-large`: "Standing at correct adult Labrador scale: shoulder approximately at the silhouette's hip height (~38 inches from the ground)."
- `animal-small`: "Standing at adult small-breed scale: shoulder approximately at the silhouette's mid-thigh height (~28 inches from the ground)."
- `animal-puppy`: "Standing at puppy scale: head approximately at the silhouette's knee height (~20 inches from the ground)."
- `animal-young-adult`: "Standing at young-adult scale: shoulder slightly below adult Labrador hip height (~34 inches from the ground)."
- `animal-toy`: "Standing at toy-breed scale: top of head approximately at the silhouette's mid-shin height (~12 inches from the ground)."

Mascot tiers: use the closest human or animal tier line, adapted for the character.

**Pose 5 by type:**
- `human` / `mascot-character-sized`: "seated pose on a simple neutral stool, hands resting on knees, relaxed"
- `animal`: "sitting pose on his/her haunches, alert and natural"
- `stylized-animated` / `mascot-object`: "the character's natural rest pose (seated, perched, or settled — appropriate to the form)"

**Art style directive — long form (slot 7):**

`photoreal`:
> "Photoreal, natural daylight, true-to-life skin tones and textures, iPhone-authentic photographic feel (NOT studio-glossy, NOT overlit, NOT advertising-perfect). Soft natural shadow, slightly imperfect lighting, real-world rendering."

`stylized-3d-pixar`:
> "Stylized 3D Pixar/Illumination animated art style. Soft cinematic shading, expressive proportions, warm plush rendering, clean form language. Match the same art style as the reference images."

`illustrated-2d`:
> "Clean illustrated 2D art style, flat or semi-flat shading, clear line work, brand-graphic rendering."

**Negative prompt (slot 8) by type:**

`human` + `photoreal`:
> "not stylized, not animated, not 3D Pixar, not illustrated, no cartoon proportions, no detailed facial features on the silhouette, no anthropomorphized animal posing, no over-glossy studio lighting, no advertising-perfect skin, no text labels, no watermarks, no chyrons, no brand logos."

`animal` / `stylized-animated` + `stylized-3d-pixar`:
> "not photoreal, no detailed human face on the silhouette, no anthropomorphic standing-on-hind-legs posing, no oversized character, no human-scale animal, no toddler-scale character (for adult chars), no text labels, no watermarks, no chyrons, no brand logos."

`mascot-object` / `illustrated-2d`:
> "no detailed face on the silhouette, no anthropomorphic posing inappropriate to the form, no text labels, no watermarks, no chyrons, no brand logos, no copyrighted character likenesses."

## Reference images required at fire time

Pass these as `--image` flags:

1. **Art-style reference** — for `stylized-3d-pixar` chars, use any existing PFM Pixar master (e.g. `Max_Model_Sheet_v03_405c.png`). For `photoreal` chars, use any existing PFM photoreal character master OR a clean PFM photoreal hero frame from the project. For `illustrated-2d`, use any existing PFM 2D mascot.
2. **Scale reference** — the project's `Family_Scale_Reference_v01_*.png` (or equivalent). Locks the proportional scaling logic. If the project doesn't have one yet, fire the FIRST master without it and use that first master as the art-style + scale anchor for subsequent characters.

For the very first character master in a brand new project with no prior PFM masters to anchor to, pass a single representative PFM hero frame from any prior project as the style ref.

## The CLI fire

Single fire, NB Pro, 16:9, 1k. Output to `Elements/Footage/Reference/<Character> Master/`.

```bash
higgsfield generate create nano_banana_2 \
  --prompt "<filled prompt from template above>" \
  --image <art-style ref UUID> \
  --image <scale ref UUID> \
  --aspect_ratio 16:9 \
  --resolution 1k \
  --wait --wait-timeout 8m --json
```

**Pre-upload both reference images** before firing (`higgsfield upload create <path> --json`). Pass UUIDs, not local paths — per the locked Higgsfield CLI concurrency rule (`feedback_higgsfield_cli_concurrency_race.md`).

**Cost:** ~2 credits per character master.

**Time:** ~30-90 seconds per fire when the Higgsfield queue is clear. If the queue is backed up, expect 2-8 minutes — use `--wait-timeout 8m` and background the fire.

## Filename convention

```
Elements/Footage/Reference/<Character> Master/<Character>_Model_Sheet_v<NN>_<HEX>.png
```

- `<Character>` — name with spaces preserved (e.g. `Hero Wife Master`, `Mortgage Broker Master`, `Park Guy Master`)
- File prefix uses underscores: `Hero_Wife_Model_Sheet_v01_a4b2.png`, `Mortgage_Broker_Model_Sheet_v01_f9e7.png`
- `v<NN>` — version number (v01, v02, etc.) — NEVER overwrite; new attempts increment
- `<HEX>` — 4-character lowercase hex (random, unique per file) to break DaVinci auto-grouping

## Updating the Family Scale Reference

When you add a new character to a project that already has a Family Scale Reference, you have two options:

**Option A (default):** Leave the existing Family Scale Reference alone. The new character's individual master is scale-anchored already, which is enough for downstream b-roll work. The Family Scale Reference becomes a "the original core cast" historical chart.

**Option B (cleaner for big casts):** Re-fire the Family Scale Reference to include the new character lined up with the rest. Heavier (multi-character compose) but gives the editor a complete cast scale chart in one image. Use when the cast grows beyond ~3-4 characters and inter-character scale clarity matters for b-roll.

When in doubt, pick A. The individual masters already do the job; the family chart is a nice-to-have.

## Two-link Lucid handoff (every fire)

After a successful fire, EVERY mention of the output destination MUST show both:
- **📁 Path:** raw `/Volumes/ads/…` path in backticks
- **🔗 Open:** clickable LinkYourFile link, built with `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute path>"`

This is a hard PFM rule (see `feedback-two-link-lucid-handoff.md`). A bare `Output: Elements/...` line is a violation.

## What NOT to do

- **Don't skip the scale anchor.** A character master without scale is a dimensional bug bomb waiting to go off in b-roll. Even for "obvious" human characters — the silhouette tells the model height differential matters and downstream gens will respect it.
- **Don't put the character on a stylized backdrop** (sunset, studio, scene). The neutral light-grey background is locked — the master is for IDENTITY / SCALE / CONTINUITY, not aesthetic.
- **Don't anthropomorphize non-human characters** in the master. Even if eventual b-roll uses anthro poses (rare in PFM), the master stays on-all-fours / natural-stance.
- **Don't fire photoreal characters in studio-glossy style.** PFM photoreal = iPhone-authentic, soft daylight, slightly imperfect. Studio-perfect ruins the live-action match.
- **Don't compose multi-character masters here.** One character per master image. (For multi-character group portraits, see `hig-flow` Family Master pattern.)
- **Don't fire at 2k or 4k.** 1k is fine for identity-lock purposes and costs less.
- **Don't overwrite existing masters.** New versions increment `v<NN>`.
- **Don't generate a master for a character that already has one.** Check `ls Elements/Footage/Reference/<Character> Master/` first — if `v01` exists and the editor isn't explicitly asking for v02, return early and link the existing master.
- **Don't mix art styles in a single project's cast** unless the creative brief explicitly calls for it (e.g. MAX THE DOG = stylized animals + photoreal environments is the brief). For standard photoreal story-ads, all characters stay photoreal; for the Max universe, all animal characters stay stylized.

## Cross-references

- `hig-flow` — downstream b-roll workflow that consumes character masters as input refs
- `hvg-flow` — Veo video pipeline that uses masters as `input_image`
- `higgsfield-image-generation` — for one-off variations or refines
- `nano-banana-prompting` — full Nano Banana prompt-craft reference
- Memory: `feedback_higgsfield_workflow.md`, `feedback_higgsfield_cli_concurrency_race.md`, `feedback_pfm_character_master_format.md`, `feedback-two-link-lucid-handoff.md`
- Reference examples in any PFM project: `Elements/Footage/Reference/Max Master/Max_Model_Sheet_*.png`, `Elements/Footage/Reference/Family Scale Reference/Family_Scale_Reference_*.png`
