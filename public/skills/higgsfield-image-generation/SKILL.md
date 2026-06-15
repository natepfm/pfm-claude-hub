---
name: higgsfield-image-generation
description: Drive Higgsfield image generation via the Higgsfield CLI (`higgsfield generate create`) for one-off image work — single shots, ad-hoc variations, prompt tests. **No gated batch flow, no Excel manifest.** Fire generations, parse result URLs, download into the editor's project folder with PFM filename conventions. CLI-only firing; MCP firing is FORBIDDEN (see `feedback_higgsfield_workflow.md` — MCP is read-only inspection only). Use this skill for one-off variations of an existing character, ad-hoc b-roll for an active project, testing prompts before committing to a full batch, refiring failed shots, or character master tests. Triggers on "generate this image", "fire off these prompts", "let's run this through Higgsfield", "make me a few variations", "another one of [character] but [variation]", or any ad-creative b-roll generation that isn't a coordinated batch. NOT for: full batch image work where the editor wants a manifest + coordinated download + gated workflow — use `hig-flow` instead (the 9-gate flow, which accepts either a Notion request URL OR a direct editor brief). 🔴 ALWAYS load `nano-banana-prompting` for the prompt body — mandatory for every fire including one-offs (locked 2026-06-10); editor explicitly asking for a different style is the only opt-out.
---

> ## 🔴 Two-link Lucid handoff — MANDATORY at every download / save / report step
>
> Every time this skill saves, downloads, or reports an asset path — a one-off CLI fire, a refire, a variation, a character master test — render BOTH:
> - **📁 Path:** raw `/Volumes/ads/…` path in backticks (for Finder)
> - **🔗 Open:** clickable LinkYourFile link, built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`
> - **📲 Tappable** — *only when SHOWING a viewable asset* (preview / composite / hero pick, not just naming the folder): the asset uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL tappable on the editor's phone, no Lucid. Locked 2026-06-15.
>
> Never bare filenames. Never just a relative path. Never just a folder name without the clickable link. **A "Saved as: <filenames>" report with no links is a CLAUDE.md Hard-Rule-5 violation.** Build the link BEFORE rendering any report; same helper used everywhere.

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

**Allowed MCP tools** (read-only inspection — fine to call): `balance`, `transactions`, `models_explore`, `list_workspaces` / `select_workspace`, `show_generations` / `show_medias` / `show_characters`. Everything else (`generate_image`, `media_upload`, `media_confirm`, `job_display` polling) → use the CLI instead.

## 🛑 PFM CONVENTIONS — non-negotiable before firing

**Before firing ANY Higgsfield image gen for PFM work** (one-off, test, re-fire, or exploratory), load and apply the conventions from `hig-flow` — even when the editor isn't going through hig-flow's structured 9-gate flow.

Quick rules to self-impose every time:
- Default model: `nano_banana_2` (NB Pro) at 1k resolution, count=1 (opt into `--count 2` for a pick)
- Filename suffix: end every b-roll PNG with a unique 4-char hex tag (`_<hex>.png`) so DaVinci Resolve doesn't auto-group as image sequences
- No iOS UI chrome in b-roll (no status bar, Camera Roll header, scrubbing strip, date stamps)
- Brand-clean negatives stack matched to vertical (no automaker badges in vehicle shots, no Geico/Progressive in insurance, no GE/Whirlpool in appliances, no Apple/macOS dock on laptops, etc.)
- iPhone camera-roll prompting style by default for podcast story-ad b-roll
- For UGC character master refs, use "extracted video frame" framing — NOT "screenshot" or "photo"
- Selfie arm framing: minimize the extending arm in foreground
- Folded-bill aging cue (tri-fold creases + opened #10 envelope) on every printed-bill moment
- Lived-in clutter on home-interior b-roll (junk mail, dirty mug, charger cable) — NOT stock photography
- Character placement: 1-ref + scene prose beats 2-ref
- Shirt rotation: random per scene, same within a scene
- Concealed Carry vertical exempt from "no firearms" default

Full convention list lives in `~/.claude/skills/hig-flow/SKILL.md`. Cross-load it whenever this skill triggers for PFM material.

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

**Parallel batch (>4 fires)** with reference images: pre-upload each unique ref ONCE serially, capture UUIDs, then pass UUIDs (not local paths) into the parallel fires. This avoids the concurrent-auth race documented in `feedback_higgsfield_cli_concurrency_race.md`.

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
  --aspect-ratio 9:16 \
  --resolution 1k \
  --count 1 \
  --wait --json
```

**Multi-ref:** pass multiple `--image` flags (or pre-uploaded UUIDs):

```bash
higgsfield generate create nano_banana_2 \
  --prompt "..." \
  --image <chad_master_uuid> \
  --image <shirt_uuid> \
  --aspect-ratio 9:16 \
  --resolution 1k \
  --count 1 \
  --wait --json
```

**Key flags:**
- `--wait` — blocks until complete. No separate polling step needed (THIS is the big CLI win over MCP).
- `--json` — emits machine-readable result with rawUrls so you can `jq` out the download URLs.
- `--count 1` — **default** (one image per fire). Opt into `--count 2` (or higher) when the editor wants multiple variants to pick from.
- `--aspect-ratio 9:16` — vertical for camera-roll style. Use `4:3` for landscape phone shots, `1:1` for square, `16:9` for landscape video frame.
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
- **Two-link handoff (standing rule, `feedback_two_link_lucid_handoff`):** the raw Lucid **Path** (backticked, for Finder) AND a clickable **Open** link to the download folder — build via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`, render as `[label ↗](url)`. Lucid `/Volumes/ads/…` paths only; if the download landed elsewhere, give the Path and say the clickable link doesn't apply.
- Final balance (CLI: `higgsfield account status`)
- Any silent losses (stuck or missing jobs — see below)

## Parallel batch firing (multiple shots)

For batches of 5+ gens, use Python `ThreadPoolExecutor` with `max_workers=16` and pre-uploaded UUIDs. Bash `&`+`wait` past ~10 jobs breaks down on the credential-store race documented in `feedback_higgsfield_cli_concurrency_race.md`.

Skeleton (adapt to actual job shape):

```python
from concurrent.futures import ThreadPoolExecutor
import subprocess, json

def fire_one(job):
    cmd = [
        "higgsfield", "generate", "create", "nano_banana_2",
        "--prompt", job["prompt"],
        "--image", job["ref_uuid"],                # UUID, not local path
        "--aspect-ratio", "9:16",
        "--resolution", "1k",
        "--count", "1",
        "--wait", "--wait-timeout", "5m", "--json",
    ]
    return subprocess.run(cmd, capture_output=True, text=True, timeout=360)

with ThreadPoolExecutor(max_workers=16) as ex:
    futs = {ex.submit(fire_one, j): j for j in jobs}
    for fut in futs:
        result = fut.result()
        parsed = json.loads(result.stdout) if result.returncode == 0 else None
        # ... extract rawUrls, queue downloads
```

**Self-check before any concurrent CLI fire:**
1. Are any `--image` flags pointing at local file paths? → If yes, pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it. (16 verified clean on Enterprise; race kicks in past ~16 — 100 workers = 50% job loss.)
3. Are you using Python ThreadPool or bash `& + wait`? → ThreadPool past 8 jobs.

## Handling stuck and lost jobs

Two failure modes worth knowing about even with `--wait`:

**Stuck jobs:** A `--count 2` fire occasionally returns with one variant in `completed` and one in `in_progress` after the wait window. Re-fire a `--count 1` with the same prompt for the missing variant. Save as `_v03`.

**Silent partial results:** Sometimes only one rawUrl shows up in `.results[]` when count=2. Same recovery — fire a single-count backup.

Don't worry the user about this — it's a quirk of the platform. Quietly handle it and proceed.

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
- **When something fails silently** (stuck job, failed upload, missing variation): tell the user matter-of-factly and explain the recovery you're doing. Don't catastrophize a single missing image.
- **When pre-uploading**: list the reference images and their UUIDs so the user can confirm.
- **After every download** (single fire, refire, batch, anything): render the **two-link Lucid handoff block** — 📁 **Path:** raw `/Volumes/ads/…` path in backticks + 🔗 **Open:** clickable LinkYourFile link built via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder>"`. Listing bare filenames without those two lines is a CLAUDE.md Hard-Rule-5 violation — the editor shouldn't have to ask "where are these?" — that question is the failure signal.

## When NOT to use this skill

- The user wants prompts they can copy-paste themselves into the Higgsfield UI. Write the prompts and stop — driving the CLI is overkill for that.
- The user is on a different image-generation platform (Midjourney, Runway, Sora). This skill is Higgsfield-specific.
- The user wants video generation. Use `hvg-flow` (the gated video pipeline) — CLI-only, like this skill.
- The CLI isn't installed in this session. If `which higgsfield` returns nothing, say so explicitly and ask Sam how to proceed. Do NOT silently fall back to MCP firing.
