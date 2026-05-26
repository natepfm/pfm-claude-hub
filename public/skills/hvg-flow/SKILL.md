---
name: hvg-flow
description: PFM's Higgsfield Video Generation flow — end-to-end pipeline from a Notion Video Task Manager URL to delivered Veo clips, run by editors directly in Claude Code (no webapp). Handles three request shapes — (1) story-ad / podcast BASE creation (Format A: callout-based Notion request, single shared reference); (2) VSL BASE creation (Format B: page-heading-based Notion request with per-line `Slide:` directives, supporting per-line / rotating-pool / start+end / mixed reference modes); (3) state-variation runs (auto-detects `## <State> Fill` sections + state-tagged clip numbers from Instructions, fires the tagged subset across all states in the batch). Use this skill when an editor (1) drops a Notion request URL while cwd is inside a Lucid Link project folder, or (2) says any of "run video generations", "run the HVG flow", "run HVG", "fire the batch", "fire the gens", "let's start generations", "kick off the Veo run". The skill walks 9 confirmation gates (cwd verification → Notion fetch → reference mode + per-line assignment → model lock → master prompt → optional L1 test → Excel manifest → preflight → CLI fire) and downloads clips into `Elements/Footage/Veo/` with deterministic filenames. Supersedes `higgsfield-veo-batch` for new projects (which stays available for legacy HVG.1 webapp manifest drops). NOT for: HVG.1 manifest drops (use `higgsfield-veo-batch`), or one-off clips without a Notion request (use `higgsfield-generate`).
---

# HVG Flow (PFM Video Generation)

End-to-end Higgsfield Video Generation pipeline for PFM editors. Replaces the HVG.1 webapp + manifest dance: editor drops a Notion request URL inside a project folder, Claude walks 9 confirmation gates, fires the CLI batch, downloads clips, writes an Excel audit manifest.

**Architecture:** Notion MCP for request fetch → Higgsfield **CLI** (`higgsfield generate create nano_banana_2`) for any missing reference image creation → Higgsfield **CLI** (`higgsfield generate create veo3_1_fast`) for video generation → xlsx skill for the audit manifest. **CLI for ALL gens — never the MCP `generate_image` / `generate_video` tools** (MCP is read-only inspection only — `balance`, `transactions`, `models_explore`, `select_workspace`). See `feedback_higgsfield_workflow.md`.

**Trigger phrases:** "run video generations" (primary), "run the HVG flow", "run HVG", "fire the batch", "fire the gens".

**Auto-initiation triggers (these alone fire the protocol — do NOT wait for an explicit verb):**
- The editor drops a **Notion URL** (any `notion.so/...` or `*.notion.site/...` link) in any session
- The editor drops or names a **PFM project folder path** (anything under `/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/...`) — including when the session opens with cwd already inside one
- The editor pastes both a Notion URL AND a folder reference together

**🛑 MANDATORY INITIATION BEHAVIOR — read carefully:**

When any of the auto-initiation triggers above are detected, your **first response must be Gate 1 of this skill** — full stop. Do NOT:
- Fetch the Notion page first to "get a head start"
- Run `ls`, `pwd`, or any shell commands ahead of Gate 2's exact prompt
- Try to parse the brief or guess at request shape (Format A/B/C)
- Build prompts, scan refs, propose models, or speculate about state variations
- Offer alternatives ("would you like me to run hvg-flow, or just summarize the brief?") — the answer is always: enter the protocol

The editor invoking the skill via trigger (URL drop, folder ref, or verb) is the confirmation to start. Your job is to walk them through 9 gates in order. Each gate's prompt is scripted below — say what's scripted, wait for the editor's reply, move to the next gate. **No freelancing between gates. No skipping gates. No combining gates.**

If the editor's first message contains information that would normally come at Gate 3 or later (e.g., they paste the master prompt at session start), still acknowledge Gate 1 first, then mention you've already captured the master prompt and will reuse it at Gate 6 when you arrive there. Do not jump ahead.

**Mid-session handoffs — DO NOT re-ask for the Notion URL or project folder:**

If hvg-flow is being invoked mid-session — common cases are after `lc-to-video-podcast` finishes (script just got pushed to Notion) or after script edits / review work — the Notion URL and project folder context are **already established** from earlier in the conversation. Use them. Do NOT ask the editor to "drop the Notion URL again" or "paste the brief again." Acknowledge what's in context, then enter Gate 1.

Example correct opening when chained mid-session:

> Picking up the same Notion request (`<URL>`) in `<project folder pwd>`. Entering HVG Gate 1.

Example WRONG opening (do not produce this — it's redundant and frustrating):

> ~~Drop the Notion URL again with "run video generations" and I'll spin up hvg-flow.~~

The editor already gave you the URL once. Re-asking treats them like they're starting over. The only time you ask for a Notion URL is when the session genuinely starts cold with no prior context.

**Speed expectation:** <2 minutes from session start to wave 1 firing on a clean project (refs already in place, master prompt ready to paste).

**The 9-gate sequence is non-negotiable.** Every gate is a confirmation point — never skip ahead, never proceed past a gate without explicit editor confirmation. Gates exist to catch misconfigurations before they burn credits.

**UI style — NEVER use the `AskUserQuestion` tool for gate confirmations.** All multi-choice questions in this skill (reference mode, model lock, rotation strategy, etc.) MUST be rendered as plain markdown text in the chat. The editor will type a reply like "A" or "Mode B" or "Veo Fast" — wait for it. The interactive question cards break the editor's flow (small target area, can't see context, mobile-unfriendly) and Sam explicitly does not want them. This applies to every gate.

---

## Gate 1 — Session start

Editor has already done this part:
1. Opened Claude Code in the specific project folder (Code tab → folder picker → Lucid Link path)
2. Pasted the Notion request URL as their first message (optionally pasted a master prompt too)

Capture the URL from the editor's message OR from earlier in the session context (e.g., from a chained `lc-to-video-podcast` or `veo-script-writing` run). Don't proceed past gate 2 without a URL. **Only ask "Drop the Notion request URL to continue"** when the session genuinely has no URL anywhere in context — never as a default opener mid-conversation.

## Gate 2 — Context check ("up to speed")

Fire these in parallel in a single message before responding:

```bash
pwd                                    # cwd verification
ls -la Elements/                       # structural check
which higgsfield                       # CLI installed?
higgsfield account status              # auth + balance
```

Verify all four cwd layers:
1. **Visual** — editor already saw the folder name in Code tab; no action
2. **Text readback** — print full pwd path back to editor
3. **Structural** — `Elements/` directory exists in cwd
4. **Lucid Link** — pwd contains `PFM MEDIA MASTER FOLDER`

**Hard-stop conditions:**
- `Elements/` missing → "⚠️ This doesn't look like a project folder — no `Elements/` directory found. You're in `<pwd>`. Close this session and reopen Claude Code in your Lucid Link project folder."
- `PFM MEDIA MASTER FOLDER` not in path → "⚠️ This folder isn't on Lucid Link. You're in `<pwd>`. Project files must live on Lucid Link so the team syncs. Close this session and reopen in `/Volumes/ads/PFM MEDIA MASTER FOLDER/...`."
- CLI not installed → "Higgsfield CLI not found. Install with: `npm install -g @higgsfield/cli`, then re-run."
- CLI not authenticated → "Higgsfield session expired. Run `higgsfield auth login` (browser-based, ~5s), then re-run."

If all four pass, single readback line:

> Working in `<full pwd>`. Context ✓. Higgsfield: **X credits**. Notion ready. Pulling the request now.

## Gate 3 — Notion request review

Use `mcp__*notion-fetch` with the URL the editor dropped. Parse:

**From database properties:**
- `Task Name (Angle - Concept)` → project name (drives slug)
- `Vertical` → e.g. "Auto - Forms"
- `Videos` → integer count (most projects = 1)
- `MB` → media buyer attribution

**From page content — three formats handled:**

**Format A: Story ad / podcast (callouts):**
- **Instructions callout** (🎓 question-mark icon) — prose: character notes, narrative summary, state-variable flag, editing rules, MB notes
- **Assets callout** (📼 cassette icon) — IGNORE the mention-page links and inline images. Editor-eyes-only past-project references. Local folder is source of truth for refs.
- **Examples callout** (📎 attachment icon) — IGNORE.
- **Copy callout** (✏️ pencil icon) — numbered script lines under `### ... Veo Numbered ...` heading. Stop at `<details>` collapsible.

**Format B: VSL (page-level headings, no callouts):**
- `## Instructions` heading — prose: character, format, length, captions/banner choices
- `## Copy` heading — numbered script lines, sometimes followed by a clean repeat of the script (parse the FIRST instance, ignore the duplicate). Stop at any `<details>` block.

**Format C: Live-action / doc-style brief (prose monologue, not pre-numbered):**
- Some briefs are written for a real shoot (testimonials, doc-style, monologue work) and the Copy callout has actor toggles or `### "Character Name"` sections containing full prose monologues with stage directions in italics — e.g. `*(pause)*`, `*(voice tightens)*`, `(laughs)`. There are NO numbered Veo lines.
- The editor is asking you to AI-generate what was originally a live-action plan. Surface this explicitly: "Brief is written for a live-action shoot, not Veo — confirm you want to AI-generate this?"
- Script needs to be balanced into Veo/Kling clips on the fly. Three options to offer the editor:
  1. **Hand off to `veo-script-writing` skill** for clean per-clip balancing (best when monologue is >60s and stage directions are dense)
  2. **Auto-balance now** — propose a per-line breakdown of ~8-10s beat-clusters with stage directions baked into each clip's emotional context (best when editor wants to keep momentum)
  3. **Editor pastes a pre-numbered version** they balanced themselves
- Format C requests pair naturally with **Mode 6b (prose-per-line)** at gate 6 — the stage directions ARE the per-clip performance cues.
- **After balancing, write the numbered script back to the Notion request.** This is a required step, not optional. Editors and downstream parsing both need the canonical numbered version to live in the source, not just in this chat. Use `mcp__*notion-update-page` with `update_content` to replace the prose dialogue paragraphs with numbered list items (one per Veo clip). Preserve the HOOK / BODY / CTA section headers and the `CUT TO B-ROLL` / `CUT BACK TO TALENT` cues as plain prose between numbered groups — b-roll cut indicators are NOT numbered (see `veo-script-writing` Rule 6). Strip em-dashes and ALL CAPS from the dialogue per `veo-script-writing` Rules 2-3 (and locked memory `feedback_veo_script_no_dashes_no_caps.md`) — the brief's source dialogue often has them, the numbered version must not. Confirm the balance with the editor first (they may want to tweak the split or the CTA), then do the Notion write.
- **Notion update gotchas (learned the hard way):**
  - **Match the leading `\t` indentation** from the callout in your `old_str`. The fetch output shows the callout content with `\t` prefixes; `update_content` requires exact whitespace match. If the first edit attempt fails with "different indentation," the tabs are the issue.
  - **Prefer one big targeted replacement** of the whole script block over chained small edits. Multiple `content_updates` entries that each modify a piece can break the markdown nesting — numbered items inherit wrong parent lists when section headers split groups, and you end up with cascading indentation. One single `old_str`/`new_str` pair covering the entire script block is safer.
  - **Notion's ordered-list renderer numbers continuously across a callout** — multiple numbered groups separated by plain prose lines render as one sequential list (`1, 2-3, 4-6, 7`), not section-restarted (HOOK `1`, BODY `1-2`, etc.). Either accept the continuous numbering and use sequential L# tags top-to-bottom, or use explicit text prefixes (`L1: VO: "..."`) as plain paragraphs instead of markdown ordered list items. Pick one approach per script and stay consistent. See `veo-script-writing` Rule 7.
- **Re-fetch the Notion page after the write** to confirm the update applied cleanly. If the structure broke (cascading indentation, wrong numbers, missing section headers), do a second update to clean it up before moving on. Don't proceed to gate 4 with a broken Notion script — downstream will be confused.
- A canonical Format C signal: brief mentions "doc-style", "Errol Morris", "testimonial", "single subject", "real actor", italic stage directions like `*(pause)*` interspersed with prose dialogue.

Detect format by presence of callouts vs bare `## Instructions`/`## Copy` headings, AND whether the Copy section has numbered lines or prose monologues.

**Slide directives (VSLs especially):**
Some lines have an indented sub-bullet starting with `Slide:` or `Slide -` describing the visual the line should show on screen. Example:
```
1. Have you seen the average auto insurance rate in Florida?
   1. Slide: Florida Tech Automobile Conference 2026 - Keynote Speaker
2. Floridians are paying about $3,500/year...
   1. Slide: Numbers on screen
```
Parse and store per line. They go in the manifest's **Slide** column for editor reference. They're informational only — not consumed by the CLI.

**Request-type detection — three paths:**

The skill routes based on what the Notion request looks like. Three shapes:

1. **BASE / BROAD** — script with no `[STATE LINE]` tags AND no `## <State> Fill` sections. Process all script lines as a single fire.

2. **BASE creation with state markers (no fill yet)** — script has `[STATE LINE]` tags + `[STATE]` tokens, BUT no per-state Fill sections (the BASE hasn't been filled-in yet, just marked-up for future swaps). Treat as BROAD/BASE — fire the script as-is with whatever default state is in the dialogue. If `[STATE]` tokens are still literally in the dialogue, surface the mismatch and ask the editor.

3. **State-variation run** — Notion has one or more `## <State> Fill` section headers under the Copy callout, each containing 5-ish numbered lines that are the state-filled versions of the tagged clips. **This is the most common state-batch shape.** Fire the tagged subset × N states.

**Detecting state-variation requests:**
- Look for repeated `## <State Name> Fill` heading pattern in the Copy callout (e.g. `### Florida Fill`, `### Colorado Fill`, `### Pennsylvania Fill`)
- Cross-reference with Instructions text for explicit clip numbers (e.g. "only clips 2, 15, 18, 24, and 41 re-render per state")
- Each Fill section's numbered lines map 1:1 to the tagged clips in script order

**State-variation parse output:**
- `states: ["Florida", "Colorado", "Pennsylvania"]` (full names) — derive 2-letter abbrevs (FL, CO, PA) for slugs
- `taggedClips: [2, 15, 18, 24, 41]` (the original BASE script line numbers that re-render)
- `dialogue[state][lineNum]` — pre-filled dialogue per (state, line) tuple, pulled from each Fill section

**Read-back to editor:**

> State-variation run detected.
> States this batch: **Florida, Colorado, Pennsylvania**
> Tagged clips: **L02, L15, L18, L24, L41** (5 lines per state)
> Total prompts: **15** (5 lines × 3 states) × count=1 = **15 clips**
>
> Confirm before I check refs?

If the prose flag and the section headers disagree, surface the mismatch and let the editor resolve.

**Slug derivation** from project name:
- Lowercase, replace spaces and special chars with underscores, collapse multiple underscores
- Drop "LC to Video" prefix and "Podcast" suffix if present
- Example: `LC to Video - Denied Car Loan Podcast` → `denied_car_loan`

**Read-back to editor:**

> Project: **<Task Name>** (<Vertical>)
> Character: <one-line from Instructions>
> Reference source: <if Instructions mention pulling from prior project, note it as info only>
> Script: **N numbered lines**, Veo-balanced
> State-variable: **BROAD** (no tags) | **BASE-only** (X tags found)
> Videos: N | MB: <name>
> Slug: `<derived_slug>`
>
> Confirm before I check refs?

## Gate 4 — Reference mode + assignment

Different project types use refs differently. The skill supports five modes; editor picks one explicitly.

**Step 1 — Scan the folder:**

```bash
ls -la "Elements/Footage/Reference/" 2>/dev/null
```

Categorize what's there:
- **Loose root-level image files** (`.jpg`/`.jpeg`/`.png`/`.webp`) — candidates for shared ref or rotating pool
- **Subfolders** — character/scene/set groupings
- **Line-numbered files** matching the regex `^L(\d+)\b` — accepts `L1.png`, `L01.png`, `L10.png`, etc. (PFM editors don't always zero-pad). Filenames may carry a descriptive suffix and a version tag, e.g. `L1 - Title Slide - v1.png`, `L10 - Generic.png`, `L17 - Ryan Before - v1.png`. Treat `Generic` (case-insensitive) in the suffix as "no specific slide for this line — use pool fallback if Mode E, else still mode-B-eligible."
- **Keyframe pairs** matching `L<N>_start.<ext>` + `L<N>_end.<ext>` (both must be present per line) — Mode D candidates. Same regex tolerance for line number padding.

**Version variants per line:**

When multiple files match the same line number (e.g. `L1 - Title Slide - v1.png` AND `L1 - Title Slide - v2.png`), surface them and ask the editor which to use. Default suggestion: latest version (`v2` over `v1`). Don't auto-pick silently.

**Filename quirks to tolerate (don't block on these):**
- Trailing whitespace before extension (`L8 - Generic .png`)
- Typos in the descriptive suffix (`L34 - Genertic.png`)
- Mixed extensions (`.png`, `.jpeg`, `.jpg`, `.webp`)
- Inconsistent zero-padding within the same project

Report all four buckets to the editor.

**Step 2 — Present as plain markdown text (NOT AskUserQuestion). Ask TWO things together — reference image(s) AND reference mode.** Always show all 5 mode options with plain-English explanations, even if some look obviously inapplicable — the editor decides, not you.

Render in chat:

> **Reference folder scan:**
> - {N} loose root-level files: `<list shot-type pool, abbreviated if long>`
> - {N} subfolders: `<list set names>`
> - {N} line-numbered files (LXX.png): `<count, e.g. "L01-L41" or "none">`
> - {N} keyframe pairs (LXX_start.png + LXX_end.png): `<count or "none">`
>
> I need two things from you:
>
> **1. Reference image(s)** — which file(s) in `Elements/Footage/Reference/` should be used as input to Veo? Based on the scan, my guess is `<best-guess filename>`. Confirm or correct.
>
> **2. Reference mode** — how should those images map to the lines in this batch? Pick one of these five:
>
> | Mode | What it means | When to use |
> |---|---|---|
> | **A — Single shared** | One image, used identically on every line | Story ads / podcast monologue at one set |
> | **B — Per-line** | Each line uses its own `LXX.png` (1:1 mapping) | Slide-heavy VSL where every line has a unique slide |
> | **C — Rotating pool** | Pick a different image per line from a pool of angle/shot variations | Talking-head with shot variety (close / medium / long) |
> | **D — Start + end frames** | Each line uses a `LXX_start.png` + `LXX_end.png` pair for keyframe-to-keyframe motion | Animated transitions, motion-controlled b-roll |
> | **E — Mixed** | Line-specific `LXX.png` where it exists, fall through to rotating pool for the rest | Most VSLs — some slides locked, rest pooled |
>
> Reply with the file(s) and the mode letter, e.g. `Jason - On Podcast Set.png, mode A`.

**Step 3 — Per-mode follow-ups:**

**Mode A:** ask which file is the shared ref (auto-pick if exactly one root-level file). Confirm.

**Mode B:** verify every line in the script has a matching file via `^L(\d+)\b` regex. Map lines → files and surface the assignment table. If gaps exist, surface them and ask: "L05, L12, L19 don't have refs. Generate them now (kick to `higgsfield-image-generation`) or fire without them (skill will mark those rows `skipped`)?" If multiple version variants match the same line, ask which version (default suggestion: latest).

**Mode C:** ask rotation strategy:
> Rotation strategy?
> (1) **Random** — random pool item per line
> (2) **Sequential** — cycle through the pool in order, loop if pool < line count
> (3) **Script-tagged** — editor specifies shot type per line in the script (e.g., `L01: Close, L02: Medium, L03: Long`)

If (3), ask the editor to drop the per-line tag list now (or paste an updated script with the tags inline).

**Mode D:** verify both `_start` and `_end` exist for every line. Surface gaps. Confirm.

**Mode E:** ask Mode C rotation strategy for the fall-through pool. Skill builds per-line assignment using fall-through logic: `LXX.png` if it exists, else pool pick.

**Step 4 — Build the per-line ref assignment table:**

Show the editor what each line will use:

> Per-line ref assignment (Mode {X}, {strategy if applicable}):
> | L# | Reference(s) |
> | L01 | Florida Conference Slide.png (line-specific) |
> | L02 | Numbers Slide.png (line-specific) |
> | L03 | Close Shot - Center - 2.png (pool) |
> | L04 | Medium Shot - Center - 5.png (pool) |
> ...
>
> Confirm before I move to gate 5?

The assignment table feeds gate 8 (Excel manifest's Reference(s) column) and step 10 (per-line `--image` / `--start-image` / `--end-image` dispatch).

**Missing refs handling:**
- If editor wants to generate missing refs → exit hvg-flow, point editor to `higgsfield-image-generation` skill in a separate chat, restart hvg-flow when refs are saved into the folder
- If editor wants to fire without missing refs → mark those lines as `skipped` in the manifest and don't fire them in step 10

PFM character master format (from memory `feedback_pfm_character_master_format.md`): full-body, plain studio backdrop, standing front-on, neutral pose, neutral wardrobe, 9:16. Don't generate cinematic in-scene shots as the master — only as derived b-roll.

## Gate 5 — Model confirmation

**Default for SILENT b-roll: Veo 3.1 Lite at count=1** (8 cr/clip = 8 cr/line). **Default for DIALOGUE: Veo 3.1 Lite with `--generate_audio true` at count=1** (12 cr/clip = 12 cr/line). **`count=1` is the locked default** as of 2026-05-26 — editors can opt in to `count=2` (or higher) on specific lines where audio variance matters by saying so at this gate. A/B picks are no longer the default; refire-on-QC-fail is the new safety net (see Step 11 "Refire decisions" and `feedback_default_count_1.md`).

> Model: **Veo 3.1 Lite** (default — silent at 8 cr/clip OR with audio at 12 cr/clip via `--generate_audio true`, `count=1` default). Confirm silent or audio, or want count=2 on any lines? Or different model?

**Available models with verified costs** (8s / 16:9, empirical table 2026-05-20):
- **Veo 3.1 Lite — silent** — **8 cr/clip**, no audio. Default for silent b-roll, ambient plates, state-variation backgrounds.
- **Veo 3.1 Lite — with audio** — **12 cr/clip**, dialogue audio + lip sync. **Requires `--generate_audio true` flag** — WITHOUT the flag, Lite ships silent. Default for podcast story-ad dialogue lines where identity is locked from a single reference.
- **Veo 3.1 Fast** — **~27 cr/clip**, has audio by default. Escalation when Lite quality isn't holding — hero shots, complex performance, tight lip-sync requirements.
- **Veo 3.1 Preview (base)** — **~58 cr/clip**, has audio. One-shot heroes only — ~2.1× the cost of Fast.
- **Veo 3.1 Preview (Ultra)** — **~87 cr/clip**, has audio, dialed via `--quality ultra` flag. `--quality` knob on `veo3_1` accepts `basic | high | ultra`. Top-tier quality reserve; use only when Preview-base isn't delivering for the hero placement.
- Seedance 2.0 — ~30-40 cr/clip
- **Kling 3.0** — 10 cr (5s std) / 20 cr (10s std) / 25 cr (10s pro) — has audio with lip sync. Strong identity-lock from reference image. Better than Veo for testimonial / single-subject character-continuity work where Veo's stochastic NSFW filter is a tax.

**Cost ladder** (8s clips, audio variants, count=1 default — double the cost/line for count=2 opt-in):
| Setup | Cost/line | Audio |
|---|---|---|
| Lite silent (DEFAULT for silent b-roll) | 8 cr | ✗ |
| Lite audio (DEFAULT for dialogue) | 12 cr | ✓ |
| Fast | 27 cr | ✓ |
| Preview base | 58 cr | ✓ |
| Preview Ultra | 87 cr | ✓ |

For opt-in A/B picks (count=2) on specific lines, double the cost/line. Editor can specify per-line at gate 5 — e.g. "L01 and L17 at count=2, rest count=1."

If editor picks Preview, confirm: "Preview base is ~2.1× the cost of Fast; Preview Ultra is ~3.2× Fast — hero shot only?"

**Map to CLI args:**
- Veo 3.1 Lite silent (DEFAULT for silent) → `veo3_1_lite` positional (no `--model` flag, no `--generate_audio` flag) — 8 cr/clip
- Veo 3.1 Lite with audio (DEFAULT for dialogue) → `veo3_1_lite` positional + `--generate_audio true` — 12 cr/clip
- Veo 3.1 Fast → `veo3_1` positional + `--model veo-3-1-fast` — audio included, ~27 cr/clip
- Veo 3.1 Preview (base) → `veo3_1` positional + `--model veo-3-1-preview` (no `--quality` flag = base default) — ~58 cr/clip
- Veo 3.1 Preview (Ultra) → `veo3_1` positional + `--model veo-3-1-preview` + `--quality ultra` — ~87 cr/clip
- Seedance 2.0 → `seedance_2_0` positional
- Kling 3.0 → `kling3_0` positional (note: no underscore between "kling" and "3")

**Always verify model IDs against the live CLI** before firing — run `higgsfield model list` if you're unsure. The CLI's actual job-set-types occasionally differ from intuition (e.g. `kling3_0` not `kling_3_0`).

Lock the model name + CLI args for use in gates 7, 9, and step 10.

**Kling 3.0 specifics** (verified 2026-05-07):
- `mode: pro | std` — pro is +5 cr/clip but noticeably better identity preservation and motion control. Default to **pro for testimonial / character-continuity work**, std for ambient or background plates.
- `sound: on | off` — Kling 3.0 generates dialogue audio with lip sync, comparable to Veo 3.1.
- `duration: 5 | 10` — default 5; 10 is the right default for dialogue beats with breath room.
- `aspect_ratio: 16:9 | 9:16 | 1:1`
- Costs: 10 cr (5s std) / 20 cr (10s std) / **25 cr (10s pro)** — substantially cheaper than Veo 3.1 Fast for testimonial work where Kling's identity-lock from a reference image is often stronger.

**Aspect ratio default by use case** (when the editor doesn't specify):
- Organic / social-first (Instagram, TikTok, organic posts) → **9:16**
- Paid / horizontal (YouTube, web, story-ad timelines) → **16:9**
- Square / multi-platform → 1:1
The Notion request's `Vertical` field is the strongest signal: "Organic" defaults 9:16, "Auto - Forms" / "Home - Calls" etc. default 16:9 unless stated otherwise. Always confirm before firing.

## Gate 6 — Master prompt

**Two prompt-shape modes — pick one with the editor before drafting:**

**Mode 6a — JSON master + dialogue swap** (default for story ads, podcast spots, multi-state batches)
- One JSON master template with locked scene/character/lighting/voice fields
- Per-line firing swaps the `dialogue` field; everything else stays identical
- File: `Elements/Prompts/<slug>_master_prompt.json`
- Right when every clip shares the same scene and the only thing changing is the line being said

**Mode 6b — Prose-per-line bespoke** (default for testimonials, dramatic monologues, doc-style work)
- One prose paragraph per clip, ~200-300 words each, with stage directions baked into the prompt as performance cues (eye drift, breath catch, smile fading, etc.)
- Identity, lighting, voice-lock blocks repeated verbatim per prompt — verbosity is the point
- Each prompt names its angle/composition explicitly (e.g. "Match the Angle B setup exactly")
- File: `Elements/Prompts/<slug>_master.md` — preamble (locked identity / composition / voice / audio blocks) followed by a `## L01 — Angle X` section per line containing the full bespoke prompt
- Right when each beat is emotionally specific and the dialogue swap pattern would flatten the performance

**Pick the mode:**
- If Notion has stage directions in italics like `*(pause)*`, `*(voice tightens)*`, `(laughs)` — that's a strong signal for **6b**
- If the brief is "doc-style", "Errol Morris", "testimonial", "monologue", or names individual beats with emotional cues — **6b**
- If the brief is hook variations of one master script, podcast b-roll behind dialogue, or multi-state Fill sections — **6a**
- When in doubt, ask the editor: "JSON master + dialogue swap, or prose-per-line bespoke?"

---

**Mode 6a flow — JSON master:**

```bash
ls Elements/Prompts/<slug>_master_prompt.json 2>/dev/null
```

If file exists:

> Master prompt from `<file mtime date>` exists at `Elements/Prompts/<slug>_master_prompt.json`. Use as-is?

Editor confirms → load → proceed to gate 7. Editor wants new → fall through.

If file missing or rebuilding:

> What's your master prompt? Paste JSON or text, or say "build it from the request" and I'll draft one.

- If pasted parses as JSON → save as `.json`. Otherwise text → `.txt`.
- Save to `Elements/Prompts/<slug>_master_prompt.json` (or `.txt`) **immediately**.
- Apply PFM brand-clean rules from memory `feedback_pfm_brand_clean_rules.md` to the negative prompt — match to vertical.

The dialogue-substitution-per-line happens at fire time (step 10). The master is the template; `dialogue` field gets swapped per line.

---

**Mode 6b flow — prose-per-line:**

Ask the editor for a reference prompt to mirror (or volunteer to draft from scratch using the Notion brief):

> Got an example prompt I should mirror? (One full prose paragraph in the style you want — identity locks, composition, performance direction, dialogue, voice lock, audio.) Or want me to draft fresh from the brief?

If the editor pastes an example, treat it as the **canonical structure template**. Common Eleanor-style structure:

1. Opening — `<Character> interview testimonial video using the provided reference image as the locked identity and composition reference. Match the <Angle X> setup exactly and remain there for the entire shot with absolutely no cuts...`
2. Composition lock — framing, negative space, background
3. Identity continuity — wardrobe, hair, eyes, skin, hands
4. Lighting — soft directional key from camera-left, fall-off, exposure intent
5. Color — `Generate in realistic natural color even though final delivery will be graded black-and-white` (if B&W in post)
6. Camera lock — completely static
7. Beat-specific emotional context — what just happened, what's about to land
8. Delivery cue — how the line is said (slowly, under his breath, voice catching)
9. Verbatim dialogue in quotes
10. Post-line stage direction — the beat after, where the eyes go
11. Emotional tone summary — what NOT to do (never performative, never theatrical)
12. **Voice lock** — locked verbatim across all per-line prompts so audio matches in cut
13. Audio direction — `dry room tone only, no music, no ambience`

Build per-line prompts for the full script:
- Break the monologue into ~8-10 second beat-clusters (one beat per clip)
- Write each per-line prompt as a complete bespoke paragraph with steps 1-13 filled in
- **The identity, composition, lighting, voice, audio blocks are repeated verbatim** in every per-line prompt — voice continuity across clips depends on this
- The beat-specific context (steps 7-11) is unique per line

Save to `Elements/Prompts/<slug>_master.md`:
- Top: preamble with locked identity / composition / voice / audio blocks (for editor reference)
- Then: `## L01 — Angle A (<ref filename>)` headers, one per line, full bespoke prompt under each
- Save **immediately** before showing the editor — preserves on session crash

In step 10, the per-line `--prompt` value is the full bespoke prompt body for that line (not a JSON with a `dialogue` swap). Mode 6b prompts typically don't start with `{`, so the "Veo video prompt: " prefix is **not needed** — pass the prose as-is.

Show 1-2 representative per-line prompts to the editor for spot-check before moving to gate 7.

## Gate 7 — Optional test generation (L1)

> Test-fire L1 (~12-27 cr depending on model, count=1 default) before committing the full batch? Worth it if the prompt is novel or the line is high-stakes. Reply `yes` (count=1 default), `yes count=2` (~double cost, see take-to-take audio variance), or `skip`.

**Yes (count=1, default):**
- Fire L1 with count=1 using step 10's CLI logic
- Download to `Elements/Footage/Veo/<slug>_L01_v01.mp4`
- Tell the editor: "L1 take ready in `Elements/Footage/Veo/`. Give it a watch and let me know if the prompt needs adjustment."
- Editor approves → mark L1 as DONE; the full batch will skip L1 (saves L1's cost).
- Editor wants prompt adjusted → loop back to gate 6, repaste/edit master_prompt.json, re-fire test (save as v02 — never overwrite per `feedback_regen_no_overwrite.md`).

**Yes (count=2, opt-in for variance check):**
- Same as above but fire L1 twice — `<slug>_L01_v01.mp4` AND `<slug>_L01_v02.mp4`. Use this when you want to see take-to-take variance on the prompt before committing to a 100-clip batch.

**Skip:**
- Proceed to gate 8 with no L1 takes yet; full batch will fire L1 along with everything else.

## Gate 8 — Excel manifest write

**The Excel manifest is REQUIRED, not optional — write it even when the editor is in prompt-craft mode and not firing the CLI.** Sam locked this in across the Purdentix batch (2026-05-13). Whenever you write Veo/Kling per-line prompts for a PFM project — whether the editor is firing them through the CLI in this same session, copy-pasting them somewhere else, or just collecting them for later — the spreadsheet **MUST** be written to the project folder at `Elements/Footage/Veo/<slug>_prompts.xlsx`. The editor uses this manifest as their canonical reference for the full prompt set; without it, the prompts only live in chat scrollback and can be lost when context compacts or the session ends.

This applies to all three prompt-craft scenarios:
1. **Full HVG.1 flow** — editor will fire the CLI immediately after; manifest gets refreshed at step 11 with statuses
2. **Prompt-craft only** — editor is collecting prompts to fire manually later through the HVG.1 webapp / another tool / their own CLI runs. Write the manifest with `status: "pending"` for every row.
3. **Mixed scenarios** — some prompts are talent dialogue Veo clips, some are b-roll image-gen prompts (Nano Banana, Higgsfield image gen) for reference frames, some are b-roll Veo motion prompts off those reference frames. Still write the manifest — include the b-roll image-gen rows alongside the Veo rows, distinguish via a `model` or `notes` column. The manifest is the editor's source of truth for "what prompts exist for this project."

When in doubt, write the manifest. The cost of writing it is trivial; the cost of losing the prompts when the chat context gets long is real.

Use the locked-in helper script that ships with this skill:

```
~/.claude/skills/hvg-flow/build_xlsx.py
```

It produces a styled two-sheet workbook (Summary + Prompts) with PFM-locked colors, banded rows, color-coded status column, and a fixed-row-height Full Prompt column that clips visually so editors can double-click any cell to read the full JSON without the row exploding.

**Build the config dict, write it to a temp file via the `Write` tool (NOT a Bash heredoc — heredocs trigger permission prompts every run), then call the build helper:**

Step A — use the `Write` tool to create `/tmp/hvg-build-config.json` with this structure:

```json
{
  "project": {
    "name":      "<Task Name from Notion>",
    "slug":      "<derived slug>",
    "vertical":  "<Vertical from Notion>",
    "imgName":   "<shared ref filename, or '(per-line — see Prompts sheet)' for Mode B/C/D/E>",
    "createdAt": "<ISO timestamp>",
    "user":      "<editor name>",
    "mb":        "<MB from Notion>",
    "notionUrl": "<full request URL>",
    "notes":     ""
  },
  "generation": {
    "modelDisplay":   "Veo 3.1 Fast",
    "mcpModel":       "veo3_1",
    "mcpParams":      {"model": "veo-3-1-fast"},
    "duration":       8,
    "aspectRatio":    "16:9",
    "countPerPrompt": 1,
    "estCostPerClip": 25
  },
  "reference": {
    "mode":             "A",
    "modeDescription":  "Single shared",
    "rotationStrategy": ""
  },
  "prompts": [
    {
      "lineNum":    1,
      "slug":       "<slug>_L01",
      "state":      "",
      "slide":      "<slide directive from Notion, or empty>",
      "dialogue":   "<line 1 verbatim>",
      "references": "<display: filename for Mode A/B/C, or 'L01_start.png → L01_end.png' for Mode D>",
      "fullPrompt": "<master JSON with id/title/dialogue injected, as a string>",
      "status":     "pending",
      "v01":        "",
      "v02":        "",
      "notes":      ""
    }
  ]
}
```

Step B — fire the build helper:

```bash
python3 ~/.claude/skills/hvg-flow/build_xlsx.py /tmp/hvg-build-config.json "Elements/Footage/Veo/<slug>_prompts.xlsx"
```

This command IS statically allowlistable as `Bash(python3 ~/.claude/skills/hvg-flow/*)` — no permission prompt on subsequent runs.

**Reference block fields:**
- `mode`: `A` / `B` / `C` / `D` / `E` — locked at gate 4
- `modeDescription`: `Single shared` / `Per-line` / `Rotating pool` / `Start + end frames` / `Mixed`
- `rotationStrategy`: `random` / `sequential` / `script-tagged` (only set for C/E; empty otherwise)

**Slug pattern per row:**

| Run shape | Per-row `slug` field | Example |
|---|---|---|
| BASE / BROAD | `<project_slug>_L<NN>` | `denied_car_loan_L01` |
| State-variation run | `<project_slug>_<STATE_ABBR>_L<NN>` | `cybertruck_state_b1_FL_L02` |

Use **2-letter state abbreviations** (FL/CO/PA/TX/etc.) for state-variation slugs. Original BASE script line numbers are preserved in `L<NN>` so the editor can drop each take into the right slot of the broad timeline. The Prompts sheet's State column gets the full state name (Florida/Colorado/Pennsylvania) for human readability.

For state-variation manifests, **order rows by state → clip number** (matches how editors assemble each state's video, not how lines appear in the master script).

**Output folder layout for state-variation runs — per-state subfolders:**

State batches drop their clips into `<STATE_ABBR>/` subfolders inside `Elements/Footage/Veo/`. Editors assemble one state's video at a time, so co-locating all of one state's takes makes assembly trivial.

```
Elements/Footage/Veo/
├── FL/
│   ├── cybertruck_state_b1_FL_L02_v01.mp4
│   ├── ... (5 lines × 1 take = 5 files at count=1 default)
├── CO/
│   ├── cybertruck_state_b1_CO_L02_v01.mp4
│   └── ...
├── PA/
│   └── ...
└── <slug>_prompts.xlsx        ← manifest stays at the Veo root
```

**The Excel manifest stays at the Veo root** (not duplicated per state) — its rows reference the per-state filenames including the subfolder prefix in the `v01` column (e.g. `FL/cybertruck_state_b1_FL_L02_v01.mp4`). The `v02` column stays empty for count=1 fires; populated only for lines where the editor opted into count=2 at gate 5.

For BASE / BROAD runs (single state's worth of clips), Veo/ stays flat — no subfolders.

**Status field values** (drives row color):
- `"pending"` — not fired yet (grey) — use this for every row at gate 8 (except a test-approved L1 → `"✓"`)
- `"✓"` — all expected takes delivered (green). At count=1 default: just v01. At count=2 opt-in: v01 + v02.
- `"Partial"` — at count≥2 opt-in only: one or more expected variations missing but at least one delivered (yellow); set `notes` to explain. Not used for count=1 rows.
- `"✗"` — all takes failed (red)
- `"skipped"` — line had a missing ref (Mode B/D gap) and editor chose to fire without it (grey italic)

> Manifest written: `<slug>_prompts.xlsx`

**Don't update this file mid-batch.** One write before fire (this gate), one rewrite after fire (step 11) — same helper, same config schema, just refreshed status / v01 / v02 / notes per row.

## Gate 9 — Final preflight

Pull current Higgsfield balance fresh:

```bash
higgsfield account status
```

Calculate total clips: lines × count (minus L1's count if test was approved).

> **<Model display name>** | <N prompts> × count=<C> = <X clips> | ~<Y> cr (have **<Z>** → <W> after) | Output: `Elements/Footage/Veo/` | Ref: `<filename>` ✓
>
> Fire?

**Hard-stop if balance < estimated cost:**

> ⚠️ Not enough credits — need <Y>, have <Z>. Top up the Higgsfield account before firing.

Editor confirms → CLI fires (step 10).

---

## Step 10 — CLI fire (post-gate execution)

Same CLI logic as `higgsfield-veo-batch`. Key load-bearing details below; consult that skill for full edge cases.

**Image preflight (auto-resize if oversize):**

Run this for **every unique reference image** the project will use (not just one — Mode B/C/D/E hit many distinct files). De-duplicate first to avoid resizing the same image twice.

```bash
for IMG in "${UNIQUE_IMGS[@]}"; do
  WIDTH=$(sips -g pixelWidth "$IMG" | awk '/pixelWidth/ {print $2}')
  SIZE=$(stat -f%z "$IMG")
  if [ "$WIDTH" -gt 2000 ] || [ "$SIZE" -gt 3000000 ]; then
    RESIZED="${IMG%.*}_resized.${IMG##*.}"
    sips -Z 1920 "$IMG" --out "$RESIZED"
    # Update the per-line ref assignment to point at the resized file
  fi
done
```

**Per-prompt construction:**
For each script line, take the master prompt template and inject:
- `id` field → `<slug>_L<NN>` (e.g. `denied_car_loan_L01`)
- `title` field → matches `id` (`<slug>_L<NN>`)
- `dialogue` field → the verbatim script line (state-tag brackets stripped, HTML spans stripped)

**CLI quirk — prompts starting with `{` fail.** Only applies when the prompt is JSON-shaped (Mode 6a). Prefix those with leading text:

```bash
PROMPT_WITH_PREFIX="Veo video prompt: ${FULL_PROMPT_JSON}"
```

The "Veo video prompt: " prefix is informational text that Higgsfield's API auto-enhancer strips/ignores. Verified 2026-05-06.

**Mode 6b (prose-per-line) does NOT need the prefix** — those prompts start with character description (e.g. "Kevin interview testimonial video using the provided reference image..."), not `{`, and pass through the CLI cleanly as-is.

**Per-line image dispatch (mode-aware):**

The CLI command's image flags depend on the reference mode locked in at gate 4:

| Mode | CLI flags |
|---|---|
| A — Single shared | `--image <shared_ref>` (same for every line) |
| B — Per-line | `--image <line's LXX.png>` (different per line) |
| C — Rotating pool | `--image <line's pool pick>` (different per line) |
| D — Start + end | `--start-image <LXX_start> --end-image <LXX_end>` (no `--image` flag) |
| E — Mixed | per-line: `--image <LXX.png if exists, else pool pick>` |

**Concurrency model — pre-uploaded UUIDs + Python ThreadPool `max_workers=16`.** PowerFox Enterprise plan — server-side concurrent-job cap is high enough that it's no longer the practical bottleneck; the client-side CLI credential-store race is the constraint. Per locked memory `feedback_higgsfield_cli_concurrency_race.md`: the Higgsfield CLI has a credential-store race condition under concurrent processes. Each `higgsfield generate create` reads (and sometimes refreshes) auth state at startup. When N CLI processes fire concurrently AND each ALSO uploads a `--image <local_path>` (3 more auth-touching API calls per job for presign + PUT + confirm), the race window widens dramatically and most jobs come back empty.

**Verified empirical data (2026-05-21):**
- 16 bash `&` background jobs + file paths → all 16 fail with auth errors ✗
- 15 ThreadPool workers + file paths (per-job upload) → 65 of 100 jobs return empty output ✗
- 8 ThreadPool workers + pre-uploaded UUIDs → reliable target ✓

Verify cap with David on the Higgsfield call; if Enterprise allows higher concurrency cleanly, the workers cap can be raised. The wave-bash pattern below is DEPRECATED — do not use.

**Step 1 — Pre-upload every unique reference image, serially, capture UUIDs:**

```python
import subprocess, json

# Dedupe across modes:
# - Mode A: 1 shared ref → 1 upload
# - Mode B: per-line refs → N unique uploads
# - Mode C: rotating pool → P unique uploads (typically <N)
# - Mode D: start+end → each unique start AND end gets uploaded
# - Mode E: mixed → per-line + pool refs deduped
unique_refs = collect_unique_refs(line_assignments)  # set of local paths
ref_uuid_map = {}
for ref_path in unique_refs:
    result = subprocess.run(
        ["higgsfield", "upload", "create", ref_path, "--json"],
        capture_output=True, text=True, check=True
    )
    ref_uuid_map[ref_path] = json.loads(result.stdout)["id"]
    # → e.g. "70b6e9b2-90c3-4703-84e8-570b99a1884c"
```

Run upload calls **one at a time** (not in a pool) — the auth race exists for uploads too. Pre-upload is cheap (~1-3s per file) and runs once per unique ref across the whole batch. Resize images >2000px or >3MB BEFORE uploading; pre-upload the resized file (the image preflight step earlier in this gate already produces resized versions).

**Step 2 — Fire the batch via Python ThreadPool with `max_workers=16`, passing UUIDs to `--image` / `--start-image` / `--end-image`:**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import subprocess, os

os.makedirs("/tmp/hvg-flow-results", exist_ok=True)

def fire_one(line_assignment, variation, ref_uuid_map, mcp_model, model_flag, aspect_ratio, duration, generate_audio, quality):
    # Mode 6a (JSON master) needs the "Veo video prompt: " prefix; Mode 6b (prose-per-line) does not.
    if line_assignment["promptMode"] == "6a":
        prompt = f"Veo video prompt: {line_assignment['fullPrompt']}"
    else:
        prompt = line_assignment["fullPrompt"]

    img_flags = []
    if line_assignment.get("refMode") == "D":  # Start + end keyframes
        img_flags.extend(["--start-image", ref_uuid_map[line_assignment["start_ref"]]])
        img_flags.extend(["--end-image", ref_uuid_map[line_assignment["end_ref"]]])
    else:  # A / B / C / E — single --image
        img_flags.extend(["--image", ref_uuid_map[line_assignment["ref"]]])

    cmd = [
        "higgsfield", "generate", "create", mcp_model,
        "--prompt", prompt,
        *img_flags,
        "--aspect_ratio", aspect_ratio,
        "--duration", str(duration),
        "--wait", "--wait-timeout", "8m",
        "--json",
    ]
    if model_flag:                  # e.g. "veo-3-1-fast", "veo-3-1-preview"
        cmd.extend(["--model", model_flag])
    if generate_audio:              # Lite-with-audio fires only (Fast / Preview have audio by default)
        cmd.extend(["--generate_audio", "true"])
    if quality:                     # Preview Ultra fires
        cmd.extend(["--quality", quality])

    out_path = f"/tmp/hvg-flow-results/{line_assignment['slug']}_v{variation}.json"
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=540)
    with open(out_path, "w") as f:
        f.write(result.stdout)
    return (line_assignment["slug"], variation, result.returncode)

all_jobs = [(line, v) for line in line_assignments for v in ("01", "02")]
with ThreadPoolExecutor(max_workers=16) as ex:
    futs = {
        ex.submit(fire_one, line, v, ref_uuid_map, MCP_MODEL, MODEL_FLAG, ASPECT_RATIO, DURATION, GENERATE_AUDIO, QUALITY): (line, v)
        for line, v in all_jobs
    }
    for fut in as_completed(futs):
        line, v = futs[fut]
        slug, variation, rc = fut.result()
        # log or report per-completion
```

**Self-check before firing:**
1. Are any `--image` / `--start-image` / `--end-image` flags pointing at local file paths? → Pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it.
3. Are you using Python ThreadPool, not `bash &`? → ThreadPool past ~4 jobs.
4. Is the model `veo3_1_lite` AND the editor wants audio? → Add `--generate_audio true` (Lite ships silent without it).
5. Is the model Preview Ultra? → Add `--quality ultra`.

**Skip L1 if test-fire was approved:** loop starts at L2, not L1.

**Download results — call the checked-in helper (NOT inline shell, which triggers permission prompts every run):**

For BASE / BROAD runs: write straight into `Elements/Footage/Veo/`.
For state-variation runs: write into `Elements/Footage/Veo/<STATE_ABBR>/` subfolders (the helper auto-routes by detecting `_<XX>_L<NN>` state tags in the slug).

```bash
bash ~/.claude/skills/hvg-flow/download_parallel.sh "Elements/Footage/Veo" <slug1> <slug2> <slug3> ...
```

Pass each slug as a separate positional argument (one per fired clip variation, e.g. `denied_car_loan_L01_v01 denied_car_loan_L01_v02 denied_car_loan_L02_v01 ...`). The helper:
- Reads `/tmp/hvg-flow-results/<slug>.json` for each
- Extracts `result_url` via `jq`
- Routes state-tagged slugs into per-state subfolders automatically
- Downloads all clips in parallel via `curl &`, then waits for all to finish

This command IS statically allowlistable as `Bash(bash ~/.claude/skills/hvg-flow/*)` — no permission prompt after first approval.

**Edge cases (consult `higgsfield-veo-batch` for full handling):**
- NSFW false-positive (~20-30% on bald/turtleneck Chad-type characters): re-fire same prompt + ref
- Rate limit hit: wait 60s, retry failed jobs
- Image upload failure: auto-resize image, retry
- CLI hang past `--wait-timeout`: get job ID from partial output, recover with `higgsfield generate wait <job_id> --json`

## Step 11 — Excel update + audio QC offer + final report

After all clips download, **rewrite** `<slug>_prompts.xlsx` using the same `build_xlsx.py` helper from gate 8 — same config schema, just refreshed status / v01 / v02 / notes per row. The helper overwrites the file cleanly; both Summary and Prompts sheets get rebuilt in one shot.

Update each prompt entry in the config:
- `status`: `"✓"` if all expected mp4s exist on disk (just v01 at count=1 default; v01 + v02 at count=2 opt-in), `"Partial"` if some-but-not-all (count≥2 opt-in only), `"✗"` if none
- `v01` / `v02`: actual filenames. **For state-variation runs, include the per-state subfolder prefix** (e.g. `FL/cybertruck_state_b1_FL_L02_v01.mp4`) so the editor can locate the file directly from the manifest. For BASE / BROAD runs, just the filename.
- `notes`: error reason for failed rows (e.g. "v01 missing — NSFW filter false positive"); empty for success

Then run the helper exactly like in gate 8:

```bash
python3 ~/.claude/skills/hvg-flow/build_xlsx.py "$CONFIG" \
  "Elements/Footage/Veo/<slug>_prompts.xlsx"
```

### Refire decisions — DO NOT refire until QC has run

**Every successful return passes through audio QC before any refire decision.** Refiring on reflex burns credits AND clutters the manifest with extra v-numbered rows for clips that were already fine. With `count=1` as the locked default (2026-05-26), the math is simple: trust what came back unless QC says otherwise.

Routing (applied in the final report below):
- **Returned (v01 at count=1 default, or any variation at count≥2 opt-in) AND passes QC** → recommend "accept as-is", no refire prompt
- **Returned AND flagged by QC** → recommend "refire", save as next vNN (v02 for count=1 rows, v03+ for count≥2 rows)
- **Total fail (0 returned)** → automatic refire candidate (nothing to QC)

**Partial status (count≥2 opt-in only):** when a row was fired at count≥2 and 1 of N variations is missing, treat it the same way — QC the survivor first. Don't refire just to "top up" to the requested count if the survivor is already good.

If the editor declines QC, this rule cannot be applied — note in the final report that nothing was auto-vetted and the editor needs to review manually. See `feedback_partial_returns_qc_before_refire.md`.

### Audio QC offer (optional)

After the manifest is rewritten and BEFORE the final report, surface the QC offer to the editor in **plain markdown chat** (NOT `AskUserQuestion` — see `feedback_no_askuserquestion_in_pfm_flows.md`):

> All N clips downloaded and the manifest is updated. Want me to run an audio QC pass before you import to DaVinci? Two phases run together — ffmpeg audio-physics (silent / clipped / no_audio in ~90s) PLUS Whisper dialogue verification against the manifest (flags `dialogue_mismatch` on wrong-words / mid-syllable cuts in ~2 min). Total ~3-4 min for a typical 350-clip batch. Writes a markdown report into the Veo folder with transcripts for any mismatches.
>
> Reply `yes` to run it or `no` (or `skip`) to go straight to the final report.

**Handling each response:**
- **`yes`** — load the `audio-qc` skill and fire the scanner:
  ```bash
  python3 ~/.claude/skills/audio-qc/audio_qc_scan.py "<project>/Elements/Footage/Veo" \
    --manifest "Elements/Footage/Veo/<slug>_prompts.xlsx" \
    --workers 12
  ```
  Pass `--manifest` so Whisper Phase 2 runs against the same Excel manifest you just rewrote in this step. After it completes (~3-4 min), surface the flag-count summary + top hotspots + any dialogue_mismatch transcripts in the final report below. See `audio-qc/SKILL.md` for how to interpret flags and what to surface.
- **`no` / `skip`** — proceed directly to the final report below.

**Never auto-fire QC without explicit confirmation.** The editor opted into a gated flow; this is a gate too.

### Final report

Then summarize for the editor:

> ✅ X clips delivered to `Elements/Footage/Veo/`
> ❌ Y prompts had failures: <list slugs + reasons>
> 💰 Final balance: M credits (delta: -K)
> ⏱ Total elapsed: Z minutes
> 📋 Manifest: `<slug>_prompts.xlsx`
> 🎧 Audio QC: `<summary if ran, else "skipped">`

If failures or QC flags exist, list them in three buckets (assuming QC ran — see "Refire decisions" above):

- **Total fails** (0 returned) — slug + dialogue + reason; default-recommend refire
- **Returned, QC-clean** — accept as-is, no refire. Default for count=1 returns + count≥2 Partials whose survivor passed QC.
- **Returned, QC-flagged** — slug + dialogue + flag reason; default-recommend refire (save as next vNN)

If QC was declined, all returns land in a single "needs editor review" bucket — Claude cannot auto-vet without QC signal.

If audio QC ran, also list flagged-clip hotspots (per-L-number concentrations) — these are usually script-level fixes, not refire candidates.

---

## What NOT to do

- **Don't use the Higgsfield MCP** `mcp__*generate_video` tool — it filters out the params we need (`input_image`, `mode: input_images`, `generate_audio`). CLI exclusively for video.
- **Don't fire** without showing the editor gate 9's preflight and waiting for explicit confirmation.
- **Don't proceed** past any gate without editor confirmation. The skill is gated by design.
- **Don't write outputs** to a folder other than `Elements/Footage/Veo/` without asking.
- **Don't pre-process the prompt text** — Higgsfield's API auto-enhances. Pass the master with dialogue substituted, prefixed with "Veo video prompt: ", verbatim.
- **Don't update the Excel mid-batch** — single write before, single write after.
- **State-variation runs ARE supported** — auto-detect `## <State> Fill` sections in Notion and route per gate 3. Don't hard-stop on `[STATE LINE]` tags; they're a routing signal, not an error.
- **Don't follow Notion mention-page links** for reference images — those are editor-eyes-only past-project pointers. Local `Elements/Footage/Reference/` is source of truth.
- **Don't activate this skill** outside a Lucid Link project folder. Hard-stop on cwd verification (gate 2, layer 4).
- **Don't skip the Excel manifest write** even when in prompt-craft mode (editor not firing CLI in this session). The manifest is required — see gate 8. The prompts must live in `Elements/Footage/Veo/<slug>_prompts.xlsx` for the editor to use as their source of truth. Chat scrollback is not a deliverable.

## Cross-references

- `higgsfield-image-generation` — for reference creation when gate 4 finds nothing
- `higgsfield-veo-batch` — predecessor skill, still handles HVG.1 webapp manifest drops
- `iphone-cameraroll-prompting` — for camera-roll b-roll prompt craft (separate workflow)
- Memory: `feedback_pfm_brand_clean_rules.md`, `feedback_pfm_character_master_format.md`, `feedback_higgsfield_workflow.md`, `feedback_veo_audio.md`, `feedback_hvg1_master_prompt_format.md`
- Workflow context: `project_pfm_podcast_story_workflow.md`
