---
name: pfm-character-master
description: PFM's ONE character-master skill — generate scale-anchored character master images for ANY character (human, animal, stylized-animated, or mascot/object) in the single locked-format reference sheet, 5 angles (front / side / 3-quarter / back / sitting) + a face-portrait close-up, scale-anchored next to a 5'10" human silhouette, rendered in the art style specified per character (photoreal, stylized 3D Pixar/Illumination, illustrated 2D). TWO intake modes — MODE A (spec-driven, no photo, the editor describes the character in words and the 6-field spec drives the prompt) and MODE B (photo-anchored, a real likeness photo / existing still / casting photo is the identity source and the rendered face IS that person). Use whenever an editor needs a NEW character master for a PFM project (story-ad cast, recurring talent, supporting humans, antagonists, dogs/animals, mascots, dealership assistant manager, mortgage broker, tow driver, Hero Wife, "the guy at the park," "the kid from Katy") OR wants to re-fire an existing master with the scale anchor baked in. Trigger families — SPEC (Mode A): "make a character master for X," "create a master for the [character]," "give me a new character," "add [character] to the cast," "spec a [type/role]," "character master with scale," "scale-anchored master." PHOTO (Mode B): "make a character master from this photo," "turn this reference into a master," "I have a photo of someone, build the character," "formalize this still into a master," or the editor drops a likeness image and wants a master. NOT for: placing a finished master into an environment (use character-studio — placement-only), the JRE podcast frame swap (jre-swap), b-roll batches (type skills / hig-flow), or firing Veo clips (hvg-flow).
---

# PFM Character Master — Scale-Anchored Reference Sheets (spec OR photo)

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


This skill produces PFM's locked character-master format for any character in a PFM creative — human, animal, animated, or mascot. One image, 5 angles + a face-portrait close-up, scale-anchored against a 5'10" human silhouette (or alternative anchor when the character itself IS human and the comparison silhouette plays a different role).

The scale anchor is the load-bearing part. Without it, NB Pro improvises character size and renders dogs at human-scale (anthropomorphic actors), or children at adult-height, or "tall guy" characters at the same height as everyone else. The silhouette gives the model an explicit "this is how tall the character is relative to a standard 5'10" adult" reference, and downstream b-roll prompts that include this master as an `--image` reference inherit the scale lock.

## Two intake modes — pick by what the editor hands you

- **Mode A — spec-driven (no photo).** The editor describes the character in words; you walk the 6-field spec (Steps A1–A4) and the prompt template invents the person. The classic path.
- **Mode B — photo-anchored (likeness provided).** The editor drops one or more likeness images (a real person, a still from footage, a casting photo, an existing PFM still to formalize); the photo IS the identity source and you propose the spec back from what you see (Steps B1–B3). Ported from the retired character-studio Act 1.

Both modes converge on the same locked prompt template, the same CLI fire, the same filename convention, and the same automatic library save. Environment placement afterward is a different skill — `character-studio` (placement-only).

## When to use

- A new character appears in a PFM script and needs a master before any b-roll work — human OR non-human
- An existing master is missing the scale anchor and needs to be re-fired (v02 with scale)
- A supporting/one-off character (the neighbor, the gas-station attendant, the kid on the bike, the dealership manager, the mortgage broker) needs a quick master
- A recurring character across multiple ads (Hero Wife in Auto / Home / Loans conversions) needs an identity-locked master
- You want to spec a character (physical features, clothing, accessories, energy) and lock identity for an upcoming gen flow — Mode A
- The editor has a photo of a real person / an existing still and wants them turned into a locked master — Mode B

**Pairs with:**
- `hig-flow` — uses character masters as input refs for b-roll gens
- `hvg-flow` — uses character masters as Veo `input_image` for clip generation
- `character-studio` — drops a finished master into a locked PFM environment (placement)
- `higgsfield-image-generation` — for one-off variations of an existing master

---

# MODE A — Spec-driven (no photo)

## Step A1 — pick the character type

The character type drives everything downstream — scale anchor behavior, prompt template branch, default art style, the pose set, negative prompts.

| Type | Examples | Default art style |
|---|---|---|
| `human` | Hero Wife, Mortgage Broker, Dealership Asst Manager, Tow Driver, "the kid from Katy," Founder (when shown as a person) | `photoreal` |
| `animal` | Max the Dog, Pup 1, Brother (yellow Lab), Park Guy (chocolate Lab), Founder Shiba Inu | `stylized-3d-pixar` |
| `stylized-animated` | Animated mascots that are NOT animals (e.g. an animated SMA wordmark character, an animated coin character) | `stylized-3d-pixar` |
| `mascot-object` | Inanimate brand mascots, object characters, oversized props treated as characters | `stylized-3d-pixar` |

Default to `human` for any character described as a person without an explicit "animated / Pixar / stylized" cue.

## Step A2 — pick the art style

Art style is independent of character type — a human can be photoreal OR stylized; an animal can be stylized OR (rarely) photoreal. Default to the type's default unless the editor specifies otherwise.

| Style | Description | Use when |
|---|---|---|
| `photoreal` | Natural-lit, iPhone-authentic photographic feel. Soft daylight, true skin tones, real-world textures, slightly imperfect (NOT studio-glossy) | Live-action story-ad humans, any character meant to feel filmed |
| `stylized-3d-pixar` | Stylized 3D Pixar/Illumination art style. Soft cinematic shading, expressive proportions, plush warm rendering | Animated dogs, animated mascots, the Max universe |
| `illustrated-2d` | Flat or semi-flat 2D illustration, clean line work, brand-graphic feel | Rare — use for brand-graphic mascots or 2D illustrated characters only |

## Step A3 — pick the scale tier

**The full tier tables (human / animal / mascot) live in [`references/master-format.md`](references/master-format.md) — load it and pick the tier there.** The tier dictates the character's height relative to the 5'10" silhouette anchor (e.g. `human-avg-male` = crown matches silhouette crown; `animal-large` = shoulder at silhouette hip). If unsure, default per type: `human-avg-male` for humans, `animal-large` for dogs.

## Step A4 — confirm the required inputs

Before firing, confirm with the editor:

1. **Character name** (e.g. "Hero Wife," "Mortgage Broker Marcus," "Max," "Park Guy")
2. **Character type** (per Step A1)
3. **Art style** (per Step A2)
4. **Scale tier** (per Step A3)
5. **Full visual spec** —
   - For humans: age, build, hair (style + color), skin tone, distinctive features (glasses, beard, freckles, etc.), wardrobe top + bottom + shoes, accessories (watch, jewelry, hat, bag)
   - For animals: breed, color/markings, collar (color + material + tag shape — strongest identity differentiator across a family), distinctive features
   - For mascots: form, material, color palette, accessories, distinctive features
6. **Personality energy** (one-line vibe — "warm Houston mom-energy," "laid-back LA brother," "smart tech kid," "no-nonsense Texas dealership pro")

These six fields feed the prompt template below. Then fire (The CLI fire, below).

---

# MODE B — Photo-anchored (likeness provided)

## Step B1 — Intake the reference(s)

Accept any of:
- A single likeness photo (a real person, a still from footage, a casting photo)
- Several photos of the same person (better — more angles = stronger identity lock)
- An existing PFM still the editor wants formalized into a master

Confirm: **who is this character** (name + one-line role, e.g. "Marcus — PNW homeowner witness") and **where the file(s) live** (path or attachment). If the reference is a tight crop or low-res, say so — identity lock will be weaker; offer to proceed or ask for a better source.

## Step B2 — Read the photo, propose the spec (don't interrogate)

Unlike Mode A (which asks for 6 fields because there's no photo), here the photo answers most of it. **Read the reference and propose** the spec back for a one-line confirm rather than a questionnaire:

- **Scale tier** — infer from the photo + role (default `human-avg-male` / `human-avg-female`; flag if they read tall/short/teen/kid). This is the one field a photo can't fully resolve, so confirm it.
- **Art style** — default `photoreal` for a real-person photo (iPhone-authentic, NOT studio-glossy). Only go stylized if the editor asks.
- **Wardrobe / features** — describe what you see; note anything to lock (glasses, beard, signature jacket) or normalize (the master wears neutral, scene-agnostic wardrobe so it composes into any environment — see the wardrobe rule below).
- **Personality energy** — one line, inferred from the photo, confirmed.

Present it as: *"Reading the photo: average-male scale, photoreal, mid-40s, salt-and-pepper beard, glasses. Master wardrobe neutral (heather crew + dark jacket). Energy: warm blue-collar dad. Good, or adjust?"* — then fire on confirm.

**Wardrobe rule for the master:** keep it **neutral and scene-agnostic** (plain crew/henley + simple jacket, no logos, no costume). The master is for identity + scale + continuity; environment-specific wardrobe (headphones, lavalier, blazer) gets added per scene at placement time (`character-studio`). A master baked in podcast headphones can't cleanly go on stage.

## Step B3 — Fire the photo-anchored master

Same locked model-sheet format (5 angles, 5'10" silhouette scale anchor, neutral light-grey background) — but the **reference photo is the lead `--image`** so the rendered face IS the person.

Build the prompt from the master template below, with one addition up top:

> "Match the face, hair, and likeness of the person in the provided reference photograph exactly — same facial structure, same features, same skin tone. Render that exact person as a scale-anchored character reference model sheet, [rest of the locked template]."

Photo-anchored ref rules (they differ from Mode A — see "Reference images required at fire time" below):
- **Pre-upload every reference serially first** → UUIDs, then fire (`feedback_higgsfield_cli_concurrency_race.md`).
- Pass the likeness photos **ONLY** — do **NOT** add a format-sheet / style anchor. It dilutes the face (`reference_sam_talent_identity`); the 5-angle scale-anchored layout comes entirely from the prompt prose, which GPT Image 2 follows. (NB Pro v01 with a format-sheet anchor came out "a little off" on the Christian Hall build; GPT Image 2 with identity-only refs fixed it.)
- After the takes land: read the master — does the face match the reference? Is the scale anchor present? If the likeness drifted, re-fire as v02 with the reference photo weighted harder (lead it harder in the prompt, drop competing style refs). Don't ship a drifted master downstream — every placement inherits the drift.

Then continue with the shared fire/download/deliver mechanics below.

---

## The prompt template (branches by type — both modes)

The locked format is the same across all types — single image, left-to-right lineup, neutral light-grey background, scale anchor on the far left. Only the slot fills change. (Mode B prepends the likeness lead-in from Step B3.)

### Master template

```
A scale-anchored character reference model sheet for <CHARACTER NAME>, rendered in <ART STYLE DIRECTIVE>, on a clean neutral light-grey background. Match the reference images for the locked PFM character-master format and visual language.

The sheet shows, lined up left to right:

1. <SCALE ANCHOR LINE>

2. <CHARACTER NAME> standing front-on next to the silhouette. <SCALE LINE per tier>

3. <CHARACTER NAME> in side profile.

4. <CHARACTER NAME> in 3/4 view.

5. <CHARACTER NAME> in <POSE 5 per type>.

6. <CHARACTER NAME> in a head-and-shoulders PORTRAIT close-up — face filling the frame so facial detail reads (skin texture, eyes, hair, expression). Same lighting and neutral grey background. This is the FACE-DETAIL reference; slots 1-5 (silhouette + full-body views) still carry the size lock so downstream b-roll knows how big the character is.

<CHARACTER NAME>: <FULL VISUAL SPEC>. Personality energy: <ENERGY LINE>.

<ART STYLE DIRECTIVE — long form>. Same render quality, same soft <natural / cinematic> lighting, same neutral light-grey background as the reference images.

Negative: <NEGATIVE PROMPT per type>.
```

### Slot fills by type

**Scale anchor line (slot 1)** — universal default:
> "An adult human silhouette in plain medium-grey outline form — no facial features, no clothing details, exactly 5 feet 10 inches tall, standing front-on. The scale anchor."

For `mascot-oversized` characters, override to:
> "An adult human silhouette in plain medium-grey outline form, 5 feet 10 inches tall, shown small relative to the character for scale comparison."

**Scale line (slot 2)** — paste verbatim per tier. **The verbatim per-tier strings live in [`references/master-format.md`](references/master-format.md)** — load it and paste the exact line for the chosen tier (never paraphrase them; they're calibrated).

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

**Negative prompt (slot 8) by type:** **the per-type negative stacks live in [`references/master-format.md`](references/master-format.md)** — load it and paste the stack matching the type + style verbatim.

## Reference images required at fire time

**Mode A (spec-driven)** — pass these as `--image` flags:

1. **Art-style reference** — for `stylized-3d-pixar` chars, use any existing PFM Pixar master (e.g. `Max_Model_Sheet_v03_405c.png`). For `photoreal` chars, use any existing PFM photoreal character master OR a clean PFM photoreal hero frame from the project. For `illustrated-2d`, use any existing PFM 2D mascot.
2. **Scale reference** — the project's `Family_Scale_Reference_v01_*.png` (or equivalent). Locks the proportional scaling logic. If the project doesn't have one yet, fire the FIRST master without it and use that first master as the art-style + scale anchor for subsequent characters.

For the very first character master in a brand new project with no prior PFM masters to anchor to, pass a single representative PFM hero frame from any prior project as the style ref.

**Mode B (photo-anchored)** — pass the identity photos ONLY and drop the format-sheet anchor (it dilutes the face); the 5-angle layout comes from prose (Step B3).

## Cowork mode — spec + prompt only, NEVER fire (Dima / any session without the Higgsfield CLI)

Check first: if `which higgsfield` doesn't resolve (Claude Cowork sessions don't have the CLI), this session CANNOT fire. **Do NOT fall back to the Higgsfield MCP connector — MCP firing is forbidden, period** (hard PFM rule; MCP is read-only inspection only). Instead, the deliverable becomes the **fire-ready package**:

1. Walk the mode's steps with the user exactly as normal and build the complete filled prompt from the template.
2. Name the reference images the fire needs (Mode A: art-style ref + scale ref; Mode B: the likeness photos) with their exact Lucid paths — pick real existing files (check the central Character Library / the project's Reference folder); never invent filenames.
3. **Write the package into the project** (Lucid access permitting): `Elements/Prompts/<Character>_master_prompt.md` containing the full prompt, the ref paths, the target output path + filename convention, and the one-line CLI fire command from the section below with everything filled in.
4. Tell the user: any editor machine (or Sam's) fires this in ~2 minutes — and if this character was blocking a `/stage request` gap, re-run the stage once the master PNG lands and the gap clears.
5. If the session has no Lucid access either: deliver the package in chat and note it on the Notion request's gap note instead.

## The CLI fire

**Model is ALWAYS `gpt_image_2` (GPT Image 2), `--quality high` — locked by Sam 2026-06-12 (`feedback_character_master_always_gpt_image_2`).** NB Pro (`nano_banana_2`) genericizes / softens the face on a master; GPT Image 2 holds identity and follows the 5-angle scale-anchored layout from prose. Default **3 takes** for a new character (editor picks the hero). Output to `Elements/Footage/Reference/<Character> Master/`.

```bash
higgsfield generate create gpt_image_2 \
  --prompt "<filled prompt from template above>" \
  --image <ref UUID(s) — Mode A: art-style / scale anchor · Mode B: likeness photo(s) ONLY> \
  --aspect_ratio 16:9 \
  --resolution 1k \
  --quality high \
  --wait --wait-timeout 8m --json
```

**Pre-upload reference images** before firing (`higgsfield upload create <path> --json`). Pass UUIDs, not local paths — per the locked Higgsfield CLI concurrency rule (`feedback_higgsfield_cli_concurrency_race.md`).

**Spine note: fires port onto fire_batch.py once the spine passes real-fire sign-off.**

**Download multi-take batches SERIALLY** with a size/verify check — parallel downloads race Lucid sync and silently drop files (`feedback_verify_veo_download_count`).

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

## Lucid handoff — 📁 + 🔗 + 🦊 (every fire)

After a successful fire, EVERY mention of the output destination MUST show both:
- **📁 Path:** raw `/Volumes/ads/…` path in backticks
- **🔗 Open:** clickable LinkYourFile link, built with `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute path>"`
- **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)
- **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.

This is a hard PFM rule (see `feedback-two-link-lucid-handoff.md`). A bare `Output: Elements/...` line is a violation.

## Library save — AUTOMATIC on approval

**When the editor approves a master, save it to the Character Library + Prompts sheet AUTOMATICALLY, no ask (locked: `feedback_always_save_masters_to_library`). Announce the save in one line.**

- **Image** → `Character Library/<Character>/<Character> - Master.png` (strip hash + version suffix on copy; existing file → save as `v02`, never overwrite)
- **Prompt** → `Prompts Library/Character Master - <Character>.md` (house entry structure; update the README index; existing entry → `v2`, no overwrite)
- Full paths, naming rules, and entry structure: [`references/master-format.md`](references/master-format.md) § Central-library save mechanics.
- The Lucid handoff rule (📁/🔗/🦊) applies to the new central-folder destinations too.

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
- **(Mode B) Don't add a format-sheet / style anchor next to the likeness photos** — it dilutes the face; identity refs only.
- **(Mode B) Don't invent a likeness** — if no reference photo is provided, that's Mode A (spec-driven), not a guessed face.

## Cross-references

- [`references/master-format.md`](references/master-format.md) — tier tables, verbatim scale-line strings, per-type negative stacks, full library-save mechanics
- `character-studio` — placement-only: drops a finished master into a locked PFM environment (podcast / talk show / news interview / stage / custom)
- `jre-swap` — puts a character onto the EXISTING JRE podcast frame (recreate + swap, not prose placement)
- `hig-flow` — downstream b-roll workflow that consumes character masters as input refs
- `hvg-flow` — Veo video pipeline that uses masters as `input_image`
- `higgsfield-image-generation` — for one-off variations or refines
- `nano-banana-prompting` — full Nano Banana prompt-craft reference
- Memory: `feedback_higgsfield_workflow.md`, `feedback_higgsfield_cli_concurrency_race.md`, `feedback_pfm_character_master_format.md`, `feedback-two-link-lucid-handoff.md`, `feedback_always_save_masters_to_library`, `feedback_character_master_always_gpt_image_2`, `reference_sam_talent_identity`
- Reference examples in any PFM project: `Elements/Footage/Reference/Max Master/Max_Model_Sheet_*.png`, `Elements/Footage/Reference/Family Scale Reference/Family_Scale_Reference_*.png`
- **Central libraries (auto-saved on approval — see the Library save section above):**
  - `1. PFM Media Assets/AI Generation Assets - PFM/Character Library/` — per-character master image library (Option B: subfolder per character, wife + family + guest variants nested inside)
  - `1. PFM Media Assets/AI Generation Assets - PFM/Prompts Library/` — per-character prompt template library (mirrors `Field TV Anchor - Rachel Torres.md` shape; index in the folder's `README.md`)
