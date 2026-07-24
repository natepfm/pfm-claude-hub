---
name: higgsfield-image-generation
description: Drive Higgsfield image generation via the Higgsfield CLI (`higgsfield generate create`) for one-off image work — single shots, ad-hoc variations, prompt tests. **No gated batch flow, no Excel manifest.** Fire generations, parse result URLs, download into the editor's project folder with PFM filename conventions. CLI-only firing; MCP firing is FORBIDDEN (see `feedback_higgsfield_workflow.md` — MCP is read-only inspection only). Use this skill for one-off variations of an existing character, ad-hoc b-roll for an active project, testing prompts before committing to a full batch, refiring failed shots, or character master tests. Triggers on "generate this image", "fire off these prompts", "let's run this through Higgsfield", "make me a few variations", "another one of [character] but [variation]", or any ad-creative b-roll generation that isn't a coordinated batch. NOT for: full batch image work where the editor wants a manifest + coordinated download + gated workflow — use `hig-flow` instead (the 9-gate flow, which accepts either a Notion request URL OR a direct editor brief). 🔴 ALWAYS load `nano-banana-prompting` for the prompt body — mandatory for every fire including one-offs (locked 2026-06-10); editor explicitly asking for a different style is the only opt-out.
---

> ## 🔴 Lucid handoff (📁 + 🔗 + 🦊) — MANDATORY at every download / save / report step
>
> Every time this skill saves, downloads, or reports an asset path — a one-off CLI fire, a refire, a variation, a character master test — render BOTH:
> - **📁 Path:** raw `/Volumes/ads/…` path in backticks (for Finder)
> - **🔗 Open:** clickable LinkYourFile link, built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`
> - **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)
> - **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.
>
> Never bare filenames. Never just a relative path. Never just a folder name without the clickable link. **A "Saved as: <filenames>" report with no links is a CLAUDE.md Hard-Rule-2 violation.** Build the link BEFORE rendering any report; same helper used everywhere.

> ## 🔴 Hard Rule 5 — STREAM every gen the INSTANT it lands (locked 2026-06-30 · hardened mechanically 2026-07-01)
>
> The moment ANY generation's result URL exists, surface it to the editor — **📲 tappable CloudFront link + the Higgsfield widget (`job_display` / `show_generations`)** — labeled (shot, take) — BEFORE downloading, BEFORE any QC read, BEFORE checking the next result. The editor sees raw gens first and decides; your verdicts come AFTER the reveal, below it, never as a gate.
>
> **Mechanical enforcement — the fire mechanism itself must emit each result as it completes:**
> - **Batches under 20:** fire each gen as its OWN backgrounded task, or use the ThreadPool skeleton below with `as_completed` printing each `LANDED` line the second it resolves — and relay each to the editor immediately. **NEVER one silent multi-gen `--wait` shell that only returns when the slowest gen finishes. NEVER hold finished gens to present a picked/QC'd set.**
> - **20+ items:** stream a compact per-result line as each lands (label + 📲), then one rollup report at batch completion — the rollup supplements the stream, never replaces it (reconciled 2026-07-12, Sol #2).
> - If your fire command can't expose per-gen results, restructure it before firing. A batch that reports only at the end is a Rule 5 violation even if every other convention was followed.

---

# Higgsfield Image Generation (CLI-driven, one-off scope)

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


This skill drives the Higgsfield CLI to actually generate images for **one-off work** — single shots, variations, ad-hoc b-roll, prompt tests. For **full Notion-request batches**, hand off to `hig-flow` instead (the 9-gate flow).

If the user wants prompts to copy-paste into the Higgsfield UI themselves, write the prompts and stop — this skill doesn't apply.

## 🛑 CLI for firing, MCP FORBIDDEN — canonical rule in memory

**The firing tool is always `higgsfield generate create`.** Full rule + empirical rationale lives in `feedback_higgsfield_workflow.md` (memory). Summary:

- CLI is ~10× faster than the MCP `generate_image` round-trip (one command vs presigned upload → confirm → generate → poll → download)
- MCP filters break Veo's audio + frame-to-video params (relevant for the sibling video pipeline; same architectural pattern applies here)
- Sam's automation thesis: never touch the Higgsfield UI, never manual-wait between steps

**FORBIDDEN MCP tools** (firing / mutation — never call): `generate_image`, `media_upload`, `media_confirm`, and any other MCP that creates or spends. Firing goes through the CLI, always.

**Allowed MCP tools** (read-only inspection — fine to call): `balance`, `transactions`, `models_explore`, `list_workspaces` / `select_workspace`, `show_generations` / `job_display` / `show_medias` / `show_characters`.

**REQUIRED post-gen widget step (Widget Law, locked 2026-06-17):** After ANY gen completes, ALSO render results in the Higgsfield widget via the read-only `show_generations` (batch) or `job_display` (single) MCP calls — read-only inspection is required and fully compatible with CLI-only firing. Firing via MCP stays forbidden. See `feedback_show_gen_results_in_widget`.

## 🛑 PFM CONVENTIONS — non-negotiable before firing

**Before firing ANY Higgsfield image gen for PFM work** (one-off, test, re-fire, or exploratory), load and apply the PFM conventions — even when the editor isn't going through a gated flow. **The canonical convention list lives in `~/.claude/skills/hig-flow/SKILL.md` (+ `~/.claude/skills/hig-flow/PIPELINE-SPEC.md`) — cross-load it whenever this skill triggers for PFM material.** Don't re-derive conventions from memory; read them there.

The two that are UNIQUE to the one-off path (self-impose every time, no flow to enforce them):
- Default model: `nano_banana_2` (NB Pro) at 1k resolution, one image per fire — the locked one-off/refire default (2026-06-17). For a 2-up pick, fire twice (`_v01`/`_v02`); `--count` is no longer a valid flag (see Flag-drift note).
- Filename suffix: end every b-roll PNG with a unique 4-char hex tag (`_<hex>.png`) so DaVinci Resolve doesn't auto-group as image sequences (the flow's manifest step normally polices this; here YOU do)

### 🔴 Prompt craft — `nano-banana-prompting` is MANDATORY (locked 2026-06-10)

Every prompt body fired through this skill MUST be written via the **`nano-banana-prompting`** skill — load it and pick the right mode (structured layered / broadcast-news / iPhone camera-roll) before drafting. **This applies to one-offs, quick tests, single refires, and "just one more" — the no-HIG path is NOT a license to freelance prompts.** The only exceptions: (a) the editor explicitly asks for a different prompting style, or (b) the prompt comes from a locked template in another skill (call-graphics designs, VSL slide edit-swaps, pixar builder, character-master format) — those templates ARE the approved prompt.

## Model lineup (the names are confusing)

The Higgsfield UI uses friendly names that don't match the CLI model IDs. This trips people up regularly:

| Higgsfield UI name | CLI model id | When to use |
|---|---|---|
| Nano Banana Pro | `nano_banana_2` | Default for ad b-roll. Highest quality, 4K capable, best text rendering. |
| Nano Banana 2 | `nano_banana_flash` | Fast variant, lower quality. Use only when explicitly asked. |
| Nano Banana | `nano_banana` | NB1 budget. Skip unless cost is an extreme constraint. |
| Soul Cast | `soul_cast` | Higgsfield's character-consistency specialist. Worth trying for character-locked work. |
| Soul 2 | `soul_2` | UGC-style realism. Good for portraits, fashion. |

**When the user says "NB2" or "Nano Banana 2"** in conversation, verify which they mean — many people use "NB2" loosely. Default to `nano_banana_2` for podcast story ad b-roll unless they correct you.

If you're unsure about a model's CLI flags or params, call the read-only MCP `models_explore` tool to inspect — that's the one MCP call still allowed here.

## Cost reality (verified empirically)

At `nano_banana_2`:
- **1k resolution: ~2 credits per generation** (count=1 default ≈ 2 cr; count=2 opt-in ≈ 4 cr/pair)
- **2k resolution: ~4-5 credits per generation**
- 4k: more expensive, untested at scale

For camera-roll-style content, 1k is plenty — real iPhone snaps aren't pin-sharp. **Default to `--resolution 1k`** unless the output is for hero placement that needs to hold up at high crops.

Always check `mcp__*balance` at the start of a session and again after big batches so you can keep the user informed about runway. (The CLI also reports balance via `higgsfield account status` — either works.)

## The CLI workflow

### Step 1: Confirm workspace + balance

```bash
higgsfield account status
```

Verify:
- `Workspace: PowerFox Enterprise` (UUID `e7479d4c-0d59-4be5-9057-abce9fe30f39`) — NOT "No workspace selected". If drift detected, run `higgsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39` first.
- Balance has runway for the planned batch.

### Step 2: Pre-upload reference images (only if firing in parallel)

**Single fire:** skip — pass `--image ./local.png` directly; the CLI auto-uploads inline.

**Parallel batch (>4 fires)**: route to the shared spine (`fire_batch.py` — see "Parallel batch firing" below), which pre-uploads for you. If you're hand-firing 2–4 parallel one-offs with reference images: pre-upload each unique ref ONCE serially, capture UUIDs, then pass UUIDs (not local paths) into the parallel fires. This avoids the concurrent-auth race documented in `feedback_higgsfield_cli_concurrency_race.md`.

```bash
# Pre-upload once per unique ref:
higgsfield upload create "Reference/Chad - Master.png" --json | jq -r '.id'
# → "70b6e9b2-90c3-4703-84e8-570b99a1884c"
```

Track UUIDs in a dict keyed by ref filename. Re-use across the batch.

### Step 3: Fire the gen via CLI

**Single-fire (image-to-image with one ref):**

```bash
higgsfield generate create nano_banana_2 \
  --prompt "<full prompt text with PFM conventions baked in>" \
  --image ./Elements/Footage/Reference/Chad/Chad-Master.png \
  --aspect_ratio 9:16 \
  --resolution 1k \
  --wait --json
```

> ⚠ **Flag drift (verified 2026-07-23):** the CLI now maps model params by their exact `hf model get` names. For `nano_banana_2` that means **`--aspect_ratio`** (underscore, NOT `--aspect-ratio`) and **NO `--count` flag** — passing either legacy name errors with `Unknown params`. One image per fire is the default; for a 2-up pick, fire twice (`_v01`/`_v02`). Result JSON is a top-level array; the URL key is **`.[].result_url`** (not `.results[].rawUrl`). Always `hf model get <model>` if a fire rejects a flag.

**Multi-ref:** pass multiple `--image` flags (or pre-uploaded UUIDs):

```bash
higgsfield generate create nano_banana_2 \
  --prompt "..." \
  --image <chad_master_uuid> \
  --image <shirt_uuid> \
  --aspect_ratio 9:16 \
  --resolution 1k \
  --wait --json
```

**Key flags:**
- `--wait` — blocks until complete. No separate polling step needed (THIS is the big CLI win over MCP).
- `--json` — emits machine-readable result with rawUrls so you can `jq` out the download URLs.
- **count:** one image per fire is the default; `--count` is no longer a valid flag (see Flag-drift note above) — for a pick, fire twice as `_v01`/`_v02`.
- `--aspect_ratio 9:16` — vertical for camera-roll style. Use `4:3` for landscape phone shots, `1:1` for square, `16:9` for landscape video frame.
- `--resolution 1k` — default. Bump to `2k` only for hero placements.

### Step 4: Parse result URLs from JSON

For `nano_banana_2`, completed jobs return `.results[].rawUrl`. Use `jq` to extract:

```bash
echo "$JSON" | jq -r '.results[].rawUrl'
```

Save the rawUrls — they expire after a window (CloudFront-signed).

### Step 5: Download directly into the project folder

```bash
cd "/path/to/project/Elements/Footage/Primary/B-Roll Photos"
curl -sSL "<rawUrl1>" -o "L14_dad_register_v01_a3f2.png" -w "v01: %{http_code}\n" &
curl -sSL "<rawUrl2>" -o "L14_dad_register_v02_b7c1.png" -w "v02: %{http_code}\n" &
wait
```

**Filename pattern for podcast story ad b-roll:** `LXX_short_description_vNN_<HEX>.png` (e.g. `L14_insurance_app_v01_a3f2.png`).

Breakdown:
- `LXX` — script line tag so editors can grep by line later.
- `_short_description_` — human-readable scene slug.
- `_vNN` — take number (`v01`, `v02`). If a line gets re-fired, increment (`v03`, `v04`) — NEVER overwrite (`feedback_regen_no_overwrite`).
- `_<HEX>` — **required** unique 4-char lowercase hex tag (e.g. `a3f2`, `b7c1`, `9eee`) immediately before `.png`. **Every file in the folder must have a unique hash.** Non-optional — see `feedback_broll_filename_unique_hash`.

**Why the hash matters:** DaVinci Resolve auto-groups files in the Media Pool when their filenames are identical except for a sequential number. Without the trailing hash, `L01_dad_v01.png` and `L01_dad_v02.png` get stacked into a single unusable "image sequence" clip. The hex tag breaks the pattern.

**Generate the hash** by picking a random 4-char string from `[0-9a-f]`, skipping any tag already used this session.

**Videos are exempt.** This rule applies to `.png` (and other still-image) downloads only. `.mp4` Veo clips keep their plain `_v01.mp4` / `_v02.mp4` versioning.

### Step 6: Verify and report

```bash
ls -la /path/to/project/Elements/Footage/Primary/B-Roll\ Photos/ | grep "L14"
```

Confirm file count matches expected (count × number of fires). Report to user:
- Filenames saved
- **Lucid handoff (standing rule, `feedback_two_link_lucid_handoff`):** the raw Lucid **Path** (backticked, for Finder) AND a clickable **Open** link AND a **🦊 Fox.io** rail drop for the download folder — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --both "<absolute folder>" "<label>"` prints the 🔗 URL and queues the 🦊 drop in one call; render `[label ↗](url)` + `🦊 Fox.io: <label> → From Claude rail`. Lucid `/Volumes/ads/…` paths only; if the download landed elsewhere, give the Path and say the clickable link doesn't apply.
- Final balance (CLI: `higgsfield account status`)
- Any silent losses (stuck or missing jobs — see below)

## Parallel batch firing (multiple shots) — use the shared spine

**Batches of 5+ gens fire through the shared spine, not a hand-rolled runner:** `~/.claude/skills/hig-flow/fire_batch.py` (job-list contract + ownership map: `~/.claude/skills/hig-flow/PIPELINE-SPEC.md`). The spine already owns everything a batch needs — serial UUID pre-upload (the concurrent-auth race, `feedback_higgsfield_cli_concurrency_race.md`), ThreadPool `max_workers=16`, per-gen Rule-5 streaming (each result relayed 📲 + widget the instant it lands), serial verified download, and the Lucid handoff. Build the job list, call the spine, tail its output.

This skill's own CLI workflow (above) is for the 1–4-fire one-off case only. The pre-fire self-check still applies to any concurrent fire you do run by hand: local paths → pre-upload to UUIDs first; never exceed 16 workers; ThreadPool over bash `&`+`wait` past 8 jobs. The retired hand-rolled ThreadPool skeleton is archived at `references/legacy/manual-threadpool-batch.md` — reference only, don't resurrect it.

## Handling stuck and lost jobs

Two failure modes worth knowing about even with `--wait`:

**Stuck jobs:** A `--count 2` fire occasionally returns with one variant in `completed` and one in `in_progress` after the wait window. The known fix: a `--count 1` re-fire with the same prompt for the missing variant, saved as `_v03`.

**Silent partial results:** Sometimes only one rawUrl shows up in `.results[]` when count=2. Same fix — a single-count backup fire.

**When an output misses: name the miss, SHOW it, STOP — refires are the editor's call.** Never quietly handle a stuck or partial result and proceed. Surface what landed (📲 + widget), name what's missing or wrong in one line, and wait for the editor's go before firing the fix. (See `feedback_stop_assuming_show_and_ask` — locked 2026-07-08, system-wide.)

## Image-as-reference trick for character AND setting continuity

When the same element — a recurring guest character OR a recurring setting — needs to appear consistently across multiple shots, describing it by text alone is unreliable. Identities drift, kitchens get redrawn, parking lots come out as different parking lots.

**The fix:** pass a prior generation (or any project shot containing the element) as a `--image` reference for the next shot. The model treats it as a lock and preserves whatever you point it at.

### For recurring guest characters

E.g., the wife when only the couple master exists, the son, "the Asian guy in the maroon fleece who showed up in the parking lot in shot 24."

Workflow:
1. Generate the first shot using whatever refs you have (character masters + shirts)
2. Once you have a result you like, download it
3. For the second shot, upload the downloaded image (via the pre-upload step above) and pass the new UUID as `--image` for the next fire
4. In the prompt: "the same [character description] from the reference image, just at a different angle / different moment / different framing"

Dramatically more reliable than re-describing a recurring character by text. Especially valuable for one-off characters introduced mid-script (the hardware-store guy, the neighbor with a dog, the woman in the next car at a red light) where you don't have a dedicated character master.

### For recurring settings

E.g., the protagonist's kitchen, his driveway, the hardware-store parking lot, the inside of his truck cab. The model invents a new variation of any room or location on every generation if you only describe it in prose.

Same workflow, just pointing the reference at a setting:
1. Pick an existing project shot that shows the setting clearly
2. Upload it via `higgsfield upload create` and capture its UUID
3. Pass that UUID as `--image` for shots that need the same setting
4. In the prompt, name what the reference is for: *"Same exact kitchen as reference image — preserve the kitchen environment precisely. Use the reference ONLY for the kitchen environment, not for pose or expression."*

The "use reference X ONLY for [setting], not [pose/expression]" framing matters — without it, the model pulls pose, framing, and other elements from the reference and fights what you actually want in the new shot.

See **nano-banana-prompting** for more on setting-continuity prompt language.

## Communication patterns

- **Before a big batch**: state how many credits the batch will burn so the user can sanity-check budget.
- **After a batch**: report new balance.
- **When something fails silently** (stuck job, failed upload, missing variation): name the miss matter-of-factly, show what DID land, and name the recovery you'd run — then stop; the refire is the editor's call. Don't catastrophize a single missing image.
- **When pre-uploading**: list the reference images and their UUIDs so the user can confirm.
- **As every gen lands** (Rule 5): relay its 📲 tappable link + widget immediately — the editor never waits for the batch to see a finished gen.
- **After every download** (single fire, refire, batch, anything): render the **Lucid handoff block** — 📁 **Path:** raw `/Volumes/ads/…` path in backticks + 🔗 **Open:** clickable LinkYourFile link built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"` + 🦊 **Fox.io:** rail drop via the same helper with `--fox-drop` (render `🦊 Fox.io: <label> → From Claude rail`). Listing bare filenames without those lines is a CLAUDE.md Hard-Rule-2 violation — the editor shouldn't have to ask "where are these?" — that question is the failure signal.

## When NOT to use this skill

- The user wants prompts they can copy-paste themselves into the Higgsfield UI. Write the prompts and stop — driving the CLI is overkill for that.
- The user is on a different image-generation platform (Midjourney, Runway, Sora). This skill is Higgsfield-specific.
- The user wants video generation. Use `hvg-flow` (the gated video pipeline) — CLI-only, like this skill.
- The CLI isn't installed in this session. If `which higgsfield` returns nothing, say so explicitly and ask Sam how to proceed. Do NOT silently fall back to MCP firing.
