# PFM Character Master — Format Reference

Load-bearing detail for `pfm-character-master/SKILL.md`: the scale-tier tables, the verbatim
scale-line strings for prompt slot 2, the per-type negative stacks for slot 8, and the full
central-library save mechanics. Content moved here verbatim from SKILL.md (2026-07-09 reorg) —
nothing deleted.

## Scale tiers (Step 3)

Pick the tier that matches the character's real-world height/scale. The tier dictates the
character's height relative to the 5'10" silhouette anchor.

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

### Mascot / object tiers

| Tier | Use when | Anchor behavior |
|---|---|---|
| `mascot-character-sized` | Inanimate mascot rendered character-scale (3–5 ft) | Treat as `human-kid` to `human-avg-female` per spec |
| `mascot-oversized` | Mascot that should feel LARGER than human | Crown above silhouette crown per spec |
| `mascot-prop` | Small object treated as character | Sized against silhouette hand (~3 ft from ground) |

If unsure, default per type: `human-avg-male` for humans, `animal-large` for dogs.

## Scale lines (prompt slot 2) — paste verbatim per tier

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

## Negative stacks (prompt slot 8) — per type

`human` + `photoreal`:
> "not stylized, not animated, not 3D Pixar, not illustrated, no cartoon proportions, no detailed facial features on the silhouette, no anthropomorphized animal posing, no over-glossy studio lighting, no advertising-perfect skin, no text labels, no watermarks, no chyrons, no brand logos."

`animal` / `stylized-animated` + `stylized-3d-pixar`:
> "not photoreal, no detailed human face on the silhouette, no anthropomorphic standing-on-hind-legs posing, no oversized character, no human-scale animal, no toddler-scale character (for adult chars), no text labels, no watermarks, no chyrons, no brand logos."

`mascot-object` / `illustrated-2d`:
> "no detailed face on the silhouette, no anthropomorphic posing inappropriate to the form, no text labels, no watermarks, no chyrons, no brand logos, no copyrighted character likenesses."

## Central-library save mechanics (full detail)

The save itself is AUTOMATIC on editor approval of a master (locked:
`feedback_always_save_masters_to_library`) — see SKILL.md's save-policy section. These are the
mechanics of where and how:

- **Master image** → `/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/AI Generation Assets - PFM/Character Library/<Character>/<Character> - Master.png`
  - Per-character subfolder (Option B structure). Wife / family / guest variants of the same character go into the same folder (`<Character>/Wife - Master.png`, `<Character>/Guest Characters/<Guest>.png`)
  - Strip the source hash + version suffix on copy: `Hero_Wife_Model_Sheet_v01_a4b2.png` → `Hero Wife - Master.png`
  - If `<Character> - Master.png` already exists in the central folder, save as `<Character> - Master v02.png` (NEVER overwrite — same rule as the project-local v<NN> increment). Surface it: "⚠️ central library already has `<Character> - Master.png` — saved as `v02`."
- **Prompt entry** → `/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/AI Generation Assets - PFM/Prompts Library/Character Master - <Character>.md`
  - Mirror the structure of existing Prompts Library entries (`Field TV Anchor - Rachel Torres.md`, `Studio Anchor - Steve.md`): metadata table → visual spec (the 6 confirmed inputs) → working filled-in prompt (the exact body fired) → CLI fire snippet (the exact higgsfield command + ref UUIDs used) → provenance (the source project)
  - Update the Prompts Library README index table with the new row
  - If `Character Master - <Character>.md` already exists, save as `Character Master - <Character> v2.md` (no overwrites)
- The Lucid handoff rule (📁 + 🔗 + 🦊) applies to the new central-folder destinations too.
