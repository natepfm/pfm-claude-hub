---
name: pixar-state-music-video
description: PFM's per-state Pixar Best State Music Video asset generator (Auto + Home). Produces the visual asset set for a state's Pixar music-video ad — a 3D Pixar anthropomorphic state-outline mascot that sings a state jingle over 12 cut-to-music b-roll scenes. Fires the CHARACTER master + 12 locked-structure scene frames via Higgsfield NB Pro (state-feature-derived prompt tokens), and preps the state-filled lyrics + Suno style block for the editor to run by hand. Use when an editor drops a "50 States - Auto/Home Pixar Best State Music Video - <State>" Notion request, or says "do the <state> pixar music video", "fire the pixar state assets", "make the pixar best-state video for <state>", "next pixar state". Semi-auto: the skill auto-fires the Higgsfield character+b-roll and preps the Suno prompt; the HUMAN runs Suno (take-gen + pick) and Mark assembles the edit. NOT for: the Pixar "Story" one-offs (Wallet/Senior/Broad — hand-built), the VSL/Sarah flows, or any non-Pixar request.
---

> ## 🔴 Lucid handoff (📁 + 🔗 + 🦊) — MANDATORY at every download / save / report step
>
> Every time this skill saves, downloads, or reports an asset path — character master, scene frames, intermediate refires, final report — render BOTH:
> - **📁 Path:** raw `/Volumes/ads/…` path in backticks (for Finder)
> - **🔗 Open:** clickable LinkYourFile link, built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`
> - **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)
> - **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.
>
> Never bare filenames. Never just a relative path. Never just a folder name without the clickable link. **A "Saved as: <filenames>" report with no links is a CLAUDE.md Hard-Rule-2 violation.** Build the link BEFORE rendering any report; same helper used everywhere.

---

# Pixar State Music Video (Auto + Home)

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


A 9:16 vertical music-video ad: a **3D Pixar anthropomorphic state-outline character** (e.g. forest-green Oregon in a navy "OREGON" cap) sings a state jingle ("Oregon is the BEST!") over **12 cut-to-the-beat b-roll scenes**. ~1 video per state. Part of the "Pixar Hank Universe." Two verticals share the SAME visuals — only the lyrics/reveal differ:
- **Auto** → "$39 a month" reveal, keeps "Zero DUIs in 5 years"
- **Home** → "$369 a year" reveal, keeps "Zero claims in 3 years"

**Master = Texas. Reference build = Colorado.** Every state request says "same exact concept as Texas + Colorado."

## TWO MODES (one skill, `--mode music|ugc`)
| | **music** (Best State Music Video) | **ugc** (Average State) |
|---|---|---|
| Audio | Suno SONG (human-fired) | **NO Suno** — spoken UGC script; mascot TALKS (lip-synced VO) |
| Scenes | 12 fixed generic scenes | **one scene per script line** (~11), illustrating that beat |
| Numbers | flat $39/mo (auto) / $369/yr (home) | **state-specific** from rate sheet (avg $/mo + $/yr, standard reveal, state reveal) |
| Hooks | none | **3 text-hook variants** = EDITOR-side text overlays (not separate gens) |
| Build | `build_pixar_prompts.py <tokens.json> <auto\|home> <out>` | `build_pixar_prompts.py --mode ugc <ugc_lines.json> <out>` |
Both modes SHARE the character derivation + NB-Pro-prose engine + don't-overwrite (`claude_` prefix) discipline.
**ugc validated on Michigan 2026-05-31:** mitten shape nailed (thumb + Saginaw notch), line-2 "$2,859 a year" rendered as bold 3D floating text beside a distressed mascot, Great Lakes winter setting. `ugc_lines.json` = state tokens + `numbers{avg_mo,avg_yr,reveal_std,reveal_state}` + `hooks[]` + `lines[]` (paste the request's Copy). The builder auto-detects per-line props: a $ figure → 3D floating text; "discount/80%" → 3 discount badges; "phone/as low as" → glowing white phone; "tap/link/click" → CTA gesture; line 1 / "Hi I am <State>" → USA-map-zoom with the state popping out.

## Semi-auto scope (locked with Sam 2026-05-30)
**Skill AUTO-does:**
0. **Status is hands-off — leave the request at "Requested."** Do NOT flip it to "In Progress" on pickup; firing the Pixar assets is a raw-asset handoff, not a status change (standing rule, see `feedback_notion_request_status_lifecycle`) — Status moves → "Done" only on an explicit turn-in, handled by `notion-asset-delivery`.
1. **Derive state tokens** — look up the state's real features (shape, signature terrain/landmarks, state color, a state-identity cap, typical older vehicle, flora, palette) and write a `<state>_tokens.json`. (Validated: a blind Oregon derivation reproduced PFM's real build — forest-green body, navy OREGON cap, tan Land Cruiser, Mt. Hood, "HISTORIC COLUMBIA RIVER HWY" sign.)
2. **Build prompts** — `build_pixar_prompts.py <tokens.json> <auto|home> <out.json>` → 1 character + 12 scene **plain-prose** NB Pro prompts.
3. **Fire + download** — `fire_pixar.py <manifest> <project_root>` → character + 12 scenes into `Elements/Graphics/`. **When the state folder ALREADY has a prior build (the originals: `<state>.png`, `o1-o11.png`), NEVER overwrite — prefix new files `claude_` (`claude_character_<state>.png`, `claude_<state>_01..12.png`) so they sit alongside for comparison.** On a clean/new state with no prior build, use the house names (`<State> PIXAR.png`, `<state>_01..12.png`). + xlsx manifest. **Lucid handoff (standing rule, `feedback_two_link_lucid_handoff`):** when reporting the delivered frames, close with the raw Lucid **Path** (`Elements/Graphics/`, backticked) AND a clickable **Open** LinkYourFile link AND a **🦊 Fox.io** rail drop — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --both "<absolute folder>" "<label>"` prints the 🔗 URL and queues the 🦊 drop; render `[label ↗](url)` + `🦊 Fox.io: <label> → From Claude rail`. Lucid `/Volumes/ads/…` paths only.
4. **Prep the song** — fill the lyrics template for the state/vertical + compose a ready-to-paste **Suno style block** (load `suno-songwriter`: Suno v5, male lead, PIXAR Songs workspace). Hand it to the editor as a copy-paste block.

**HUMAN does:** paste lyrics into Suno → generate ~12 takes → pick the winner → drop `<State>_<Vertical>_Song.mp3` into `Elements/Audio/Music/`. Then **Mark** assembles (character singing + 12 b-roll frames animated & cut to music).

## The 12 LOCKED scenes (state-agnostic structure; only tokens swap)
Proven identical across Georgia/Washington/Oregon builds. `build_pixar_prompts.py` owns the exact prose.
1. Country Road Driving (hero) · 2. Living Room — stressed driver w/ bills · 3. Retro CRT — rate loading · 4. Retro CRT — locked in/covered · 5. Tow Truck Cab — roadside recovery · 6. Home Selfie — saved customer · 7. {City} Tavern — "{State} Is The Best" banner · 8. Barn Dance — "Same Coverage" · 9. Farm Porch — "Recalculate Your Rate" · 10. {City} Main Street — reveal sign ($39/mo or $369/yr) · 11. Country Road — standing on old truck · 12. Savings Reveal — confetti finale (giant phone, coverage checklist, reveal rate)

## Per-state tokens (derive by looking up real state features)
`state, abbr, shape, body_color, cap, vehicle, terrain, flora, landmark_city, landmark_signs[], palette[], avoid_states[], license_plate, weather`. See `build_pixar_prompts.py` docstring for the Oregon example. **Derivation rules:**
- **body_color** = the state's defining color (Oregon forest green, Florida sunset orange, Colorado mountain-blue/white).
- **cap** = a state-identity ball cap with a state name patch + a local motif (GA = peach).
- **vehicle** = a *well-loved older* state-typical vehicle (OR = tan Land Cruiser; GA = sand-tan F-150; WA = forest-green Subaru Outback). NEVER a new/luxury/sports car.
- **terrain/landmarks** = real signature geography (OR = Mt. Hood + Columbia River Hwy; CO = Rockies/aspens/snow; FL = palms/beaches).
- **avoid_states** = the sibling states whose shape/terrain NB Pro might bleed in (always include Texas + Colorado, plus neighbors).

## 🔴 RULE-5 — show every gen the instant it lands

**Show every gen the instant it lands — 📲 CloudFront + widget (`job_display`/`show_generations`) — before download, QC, or picks. QC verdicts come AFTER the reveal, below it, never as a gate.** For this skill that means the 13-still set (character + 12 scenes) streams to the editor one by one as each `result_url` returns — never one end-of-batch dump, never held for a QC read.

## Firing engine notes (learned the hard way)
- **NB Pro takes PLAIN PROSE prompts. A JSON-blob prompt → HTTP 500.** (The Georgia/Washington prompt *files* on disk are JSON reference docs, but the actual fire used prose.) `build_pixar_prompts.py` emits prose.
- **Output is 1080×1920 (9:16), `nano_banana_2`, 2k, count=1.** ~2 cr/image → **~26 cr for the full 13-shot set.** ALWAYS state the cost when firing (per `feedback_report_cr_cost_on_batches`).
- Retry cap: initial + up to 2 retries on transient 500/timeout, then flag (`fire_pixar.py` default).
- **🔴 Refires of DELIVERED assets version up — never overwrite, never `rm`-to-force.** The `claude_`/`o` prefix rule above is for fresh-build-vs-original comparison; once a frame is DELIVERED (fired out + delivery comment / in the editor's hands), a corrective refire saves as a NEW variant (`..._v02`, `_v03`), never clobbering the delivered file — and you NEVER `rm` an existing file to defeat the fire script's skip-if-exists idempotency (that deletion IS the overwrite). Pre-delivery `visual-qc` regen is the ONLY overwrite exception. See `feedback_regen_no_overwrite` (the pixar-avg L06/L07 overwrite, 2026-07-13, is exactly this failure).
- Baked-in negatives: "no fingers on mittens", "clean recognizable smooth state silhouette (not lumpy)", "any on-screen sign/text appears EXACTLY ONCE (no duplicate text)", "NOT <avoid_states> shape/terrain".

## What this skill does NOT do
- It does NOT call Suno (no official Suno API; unofficial gateways risk PFM's account — Sam's call 2026-05-30). It preps the prompt; the editor fires Suno.
- It does NOT animate the 12 frames or assemble the edit — those are the editor's / Mark's manual pass. The skill delivers the **still frames** (the editor animates them image→video + cuts to the song).
- NOT for the Pixar "Story" one-offs (Wallet/Senior/Average Broad) — those are bespoke multi-generation narrative builds, hand-done.

## Files
- `build_pixar_prompts.py` — tokens + vertical → 13-shot prose manifest
- `fire_pixar.py` — manifest + project root → fire/download/xlsx
- Loads `suno-songwriter` for the Suno style block; `notion-asset-delivery` for the delivery comment.

## Provenance
Built 2026-05-30. Validated on Oregon Auto (blind derivation matched PFM's real `oregon.png` + `o1-o11` build). Cross-refs: `feedback_check_past_assets_on_variations`, `feedback_report_cr_cost_on_batches`, `feedback_pfm_brand_clean_rules`, `suno-songwriter`, `hig-flow`.
