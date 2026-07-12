---
name: iphone-broll
description: PFM's iPhone camera-roll b-roll flow, two modes. MODE A (identity-swap regeneration) takes an existing LC-to-Video / podcast story ad's camera-roll b-roll set and rebuilds the WHOLE set around a NEW character (and their family / supporting cast), with zero race-or-identity bleed from the original. MODE B (fresh b-roll) builds a brand-new set from a creative's SCRIPT beats when there is no original to mirror (first-run podcast story ad, etc.), commonly 2 cutaway options per dialogue line plus slice-of-life atmosphere shots, using the same camera-roll craft + locked-environment + character-master discipline. This is the skill that solves the "the swap didn't fully convert — shot 04 still has the old Black character" failure. The locked method: NEVER pass an original b-roll image as a reference; instead drive every shot from (1) locked character masters + (2) locked empty-environment plates + (3) fresh prose that uses the original only as written inspiration. Use when an editor says "make the same b-roll but with <character>", "regenerate this b-roll for <new character>", "iphone broll", "swap the b-roll cast", "we need all the same b-roll with <X> instead", "rebuild the camera-roll shots for <character>", "make iphone b-roll" / "make some iphone b-roll" (Mode B, fresh), or pivots a winning LC-to-Video creative to a new on-camera person and needs the full supporting photo set. Default: Nano Banana Pro (`nano_banana_2`) at 1k, count=1, iPhone camera-roll style (loads `nano-banana-prompting`); character masters via `pfm-character-master` (spec or photo mode; gpt_image_2); quote-page graphics via gpt_image_2 from the brand template. For a manifest-gated Notion-request b-roll batch `hig-flow` is the heavier alternative; this skill is the direct camera-roll-wave path (swap OR fresh). NOT for: one-off image tests (use `higgsfield-image-generation`), video (use `hvg-flow`), or the DaVinci assemble (`claude-editor`).
---

# iPhone B-Roll (PFM camera-roll b-roll — swap OR fresh)

Build a PFM story-ad's iPhone camera-roll b-roll set so the whole thing looks shot on one phone, same places, same week — lived-in, anti-glossy, amateur-snapshot. **Two modes:**

- **Mode A — identity swap (regeneration):** rebuild an EXISTING creative's b-roll set around a **new on-camera character** (hero + family + supporting cast), zero leftover from the original cast. The hard lock below governs this mode.
- **Mode B — fresh b-roll (no original to mirror):** build a set from scratch for a NEW creative, working from the **script's story beats** (commonly 2 cutaway options per dialogue line + a block of slice-of-life atmosphere shots). No originals exist, so the OG-lock is moot — but the same camera-roll craft, locked-environment plates, character-master discipline, and review-wave cadence apply identically.

Both modes share the firing config, masters + env-plate discipline, prompt craft, and the fire→review→fix→deliver gates. Where a gate differs by mode, it says so.

## 🔴 THE ONE LOCK (Mode A) — never reference the original b-roll image

> **Mode B (fresh):** no original set exists, so this lock is moot — skip it. You still anchor each person ONLY on their character master and build every recurring setting from a locked empty env plate (Gate 4), never from a found photo.

The failure this skill exists to prevent: you pass an original b-roll clip as a `--image` reference "so the new shot matches the framing," and the model **carries the original person's race / face / body** into the output. Result: a half-converted swap (the editor flags "05 still has the old wife," "07 is a different kid"). This bled through repeatedly until the method below was locked.

**The fix is absolute: the original b-roll image is NEVER an input to a generation.** It is *inspiration you read and describe*, nothing more. Every fired shot is built from only:

1. **Character master(s)** — the new hero + family, as `--image` refs (identity).
2. **A locked environment plate** — an empty room / exterior with NO people in it, as an `--image` ref (setting consistency).
3. **Fresh prose** — you write the composition from scratch, using the original shot only as a written description of *what's happening* (subject, action, framing feel).

No OG image in, no OG person out. If a shot "needs" the original to look right, you still describe it in words — you do not attach it.

## Default firing config → the shared spine

This skill owns the **craft** (masters, env-plates, the OG-lock, prompt bodies, wave cadence). It does
NOT hand-roll firing — the fire/download/manifest/handoff mechanics are the **pipeline spine**,
`~/.claude/skills/hig-flow/fire_batch.py` (contract + ownership: `hig-flow/PIPELINE-SPEC.md`). Per
review wave you write a **job list** and call the spine; it pre-uploads UUIDs, fires at
`max_workers=16`, streams `LANDED <shot>: <url>` per gen (Rule 5), serial-downloads with verify, and
prints the 📁/🔗/🦊 handoff. The iphone-broll job list declares:

- `gen`: `{ "model": "nano_banana_2", "resolution": "1k", "count": 1, "aspect": "9:16" }` — NB Pro 1k
  count=1 (editor opts into count=2 for a pick); `16:9` only where a wide plate is genuinely wanted.
  Prompt bodies are **iPhone camera-roll style** (`nano-banana-prompting` iPhone mode) — anti-glossy,
  lived-in, amateur-snapshot, no iOS UI chrome (`feedback_no_ui_chrome_in_broll`).
- `outDir`: `Elements/Footage/Primary/B-Roll/` — **flat, no subfolders** (PFM convention here).
- `naming`: `{nn}_{shot}_{char}_{hex}.png` — the **unique 4-char `{hex}`** stops DaVinci auto-grouping
  as an image sequence (`feedback_broll_filename_unique_hash`); pass each shot's `char` field.
- `manifest`: `"md"` — the lightweight shot-list (this skill's `.md`, not hig-flow's `.xlsx`).
- **Fire-route** — a PFM project fire: the editor's "one-off / quick / no manifest / no flow / direct
  CLI" opt-out (or a prior fire-direct this session) lets you fire direct; otherwise check (Hard Rule
  1). Any single wave **≥20 items REQUIRES a preflight + Fire? card** (Hard Rule 3) — keep waves under
  20, or run the preflight. **Invoke the spine dry-run (no `--fire`) to build the preflight cost line.**
- **AGF-stageable now:** because the fire is the shared spine, an iphone-broll batch with a Notion
  request can be staged to the mini exactly like a hig-flow batch (the interlock lives in the spine).

## Flow

> **Gates 1–2 are Mode A (swap).** For **Mode B (fresh)** use Gate 1B + 2B, then continue at Gate 3 — masters, env plates, prompt craft, review waves, download, and deliver are identical for both modes.

### Gate 1B — Scope from the script [Mode B, SILENT]
Confirm cwd is the project. Read the locked script / dialogue manifest. The b-roll set = the story's **visual beats** per the editor's spec — commonly **2 cutaway options per dialogue line** (two DISTINCT angles/subjects, not near-dupes) plus a block of **slice-of-life** atmosphere shots with no dialogue tie. List the cast the story actually shows (narrator in their real setting, spouse, kids, people in the story) and the recurring settings (home, barn, workplace). Note which reuse the Character Library vs need a new master / env plate.

### Gate 2B — Build the shot list from beats [Mode B]
Write `_BRoll_ShotList.md`, one row per image: `NN | line/beat | subject + action | character(s) + env ref | fresh prose`. For each "per-line" pair give one wide/action shot + one detail/object insert so the editor gets real cutaway choice. Slice-of-life rows are pure atmosphere. No OG map — every shot is fresh prose from the beat. Then continue at Gate 3.

### Gate 1 — Scope [Mode A, SILENT]
Confirm cwd is the project folder. Identify: the **original creative** (the b-roll you're mirroring — often open in the editor's DaVinci timeline or in a sibling project's `Elements/`), the **new hero**, and the **family + supporting cast** the story needs. Note which cast can be **reused** from the Character Library (neighbor, coworker, founder/Ethan, "guy at the park") vs which need **new masters** (hero, spouse, kids, brother).

### Gate 2 — Map the original b-roll [SILENT]
Copy the original b-roll stills into `Elements/Footage/Reference/OG B-Roll/` — **copy, never rename in place**: the originals' paths are linked in the editor's DaVinci timeline and renaming breaks them. Rename the *copies* `NN_Shot-Name.png`. Write `_OG_BRoll_MAP.md`: `NN | OG line | subject | character(s) | action (REGEN with <hero> / REUSE setting)`. Cross-reference the editor's open timeline if they have it up.

### Gate 3 — Build character masters [STOP for review]
Build the hero + each family member via `pfm-character-master` (spec or photo mode) — **gpt_image_2 `--quality high`**, scale-anchored 5-angle sheet, photo-anchored from real refs where provided (`feedback_character_master_always_gpt_image_2`, `feedback_pfm_character_master_format`). Reuse Library masters for supporting cast. **Show the masters and wait for sign-off** before any placement — a wrong face multiplies across the whole set. (Brother-too-similar, etc. gets caught here.)

### Gate 4 — Lock the environments [SILENT, or STOP if first time]
For every recurring setting (kitchen, living room, home exterior/backyard, empty move-in interior), fire a clean **empty plate with NO people** and save it to `Elements/Footage/Reference/Locked Environments/`. These become the setting `--image` ref reused across every shot in that room, so the kitchen is the *same* kitchen in all twelve kitchen shots. Settings with no recurring need (truck cab, park, sidewalk) get pure fresh prose, no env ref.

### Gate 5 — Prompt craft [SILENT]
Per shot: fresh prose (OG-as-inspiration) + the matching env ref + the character master(s). Bake in:
- **Solo-lock** for solo shots — the host / narrator / anyone off-screen never enters frame; "one person only, no other people."
- **Full-swap negatives** — explicitly exclude the original cast's identity ("no <original> family, swap fully," and the right racial descriptors to overwrite, since you're *not* passing the OG image to anchor it).
- **No-device naming** in the visible description (`feedback_veo_device_naming` applies to NB too — describe outcome, not "iPhone").
- **Phone-in-hand-with-quote shots → use the `social-proof-phone-quote` skill (screen-as-reference, ONE pass).** The deliverable is a single image with the brand quote page on the phone screen, natural. The locked technique: pass the quote-page graphic as `reference 1` and the character master as `reference 2`, then *"holds a modern iPhone with the screen facing the camera — the phone screen displays exactly the image in reference 1, unchanged, sharp and readable."* NB Pro builds person + phone + screen in one gen. **Do NOT** post-composite a screenshot onto a blank held phone (reads pasted — rejected 2026-06-14) and **do NOT** describe the screen generically with no reference (garbles). See that skill for the full template.
- **Lived-in clutter + anti-stock** (`feedback_b_roll_lived_in_anti_stock`), shirt-rotation per scene (`feedback_shirt_rotation_pattern`), minimize selfie arm (`feedback_selfie_arm_framing`), brand-clean negatives (`feedback_pfm_brand_clean_rules`).

### Gate 6 — Fire in review waves [STOP each wave]
Fire **~10 at a time** (the editor's locked cadence — review and give notes between waves; never blast the whole set at once). Per wave: write the wave's shots into a job list (the `PIPELINE-SPEC.md` contract, config above) and call the spine:

```bash
python3 ~/.claude/skills/hig-flow/fire_batch.py "$WAVE_JOBLIST" --fire --project-root "$(pwd)"
```

It streams `LANDED <shot>: <url>` as each lands — **relay each to the editor the instant it prints** (Rule 5: 📲 tappable + widget), then it serial-downloads + appends to the `.md` manifest. `/remoteview` for phone review. Take notes between waves. (Bare, no `--fire`, dry-runs the wave for the preflight cost line.)

### Gate 7 — Review + fix [loop — the editor drives]
Local fires are NEVER auto-QC'd. After each wave's results land and are SHOWN (Rule 5), OFFER QC via a plain ask (AGF/mini keeps mandatory QC). When an output misses (bleed / wrong character / bad lighting / subject cut off): name the miss in one line, SHOW it, STOP — refires are the editor's call, never self-initiated. Editor-requested regens fire as new versions (don't overwrite — `feedback_regen_no_overwrite`). Also complete the planned set: the categories that aren't 1:1 with the OG map but the story needs (neighbor beats, brother beats, slice-of-life payoff) and **copy in the reused cast** (founder/Ethan, neighbor, coworker) from the Library.

### Gate 8 — Quote / rate graphics + on-phone composite
1. **Build the quote page** — a text-precise UI mockup → **gpt_image_2** (not NB). Clone the brand's saved quote template (e.g. `Client Assets - DPW/SaveMaxHomes - Client Assets/Quote Pages/`), swapping only brand / discounts / rate / domain. For a state batch, fire one per state swapping just the **payoff monthly rate** (the script's "quote came back … a month" line). Digit-verify every output, then save the first as the reusable brand template.
2. **Put it on the held phones — Gate 5's one-pass rule stands.** Every phone-in-hand shot fires through `social-proof-phone-quote`: the quote page rides in as `reference 1` and the screen is rendered IN the single gen — there is no second composite pass. Match the **rate to the use**: hero rate reused across the cut, or per-state screens if the phone must match each state's VO (confirm scale with the editor — per-state multiplies shots × states).

### Gate 9 — Flatten + deliver
One flat `B-Roll/` folder, sequential numbers, unique hex tags (the spine's `naming` already did this). The spine prints the **Lucid handoff** on the final wave — 📁 raw path + 🔗 LinkYourFile + 🦊 From Claude rail drop (Hard Rule 2); relay it, plus `/remoteview` links if the editor is on their phone. (The spine's `.md` manifest is the delivered shot list — no separate write.)

## What NOT to do
- ❌ **(Mode A)** Pass an original b-roll image as `--image` (the one lock — it bleeds the old cast). *(Mode B has no OG image, so this is moot.)*
- ❌ Rename the originals in their source folder (breaks DaVinci links — copy first).
- ❌ Fire the whole set in one shot (review waves of ~10; ≥20 needs a preflight).
- ❌ Build masters in NB Pro (masters are always gpt_image_2).
- ❌ Deliver a held phone with a blank screen and tell the editor to composite the UI in DaVinci — the page is rendered on the screen in the ONE gen (Gate 5's `social-proof-phone-quote` delegation). A blank or garbled ("what's with the 7?") screen is not a deliverable.
- ❌ Parallel-download (Lucid race drops files — serial + verify).

## Cross-references
`hig-flow` (fresh b-roll, no original to mirror) · `pfm-character-master` (masters — spec or photo) · `nano-banana-prompting` (prompt bodies) · `higgsfield-image-generation` (one-off refires) · `labs-voice-swap` / `hvg-flow` (the video side) · `claude-editor` (assemble). Memories: `feedback_higgsfield_cli_concurrency_race`, `feedback_character_placement_one_ref_wins`, `feedback_b_roll_lived_in_anti_stock`, `feedback_no_ui_chrome_in_broll`, `feedback_broll_filename_unique_hash`, `feedback_character_master_always_gpt_image_2`.
