---
name: hig-flow
description: PFM's Higgsfield Image Generator flow — end-to-end gated batch pipeline from a brief (Notion request URL OR direct editor description) to delivered b-roll images with an Excel manifest. Image counterpart to `hvg-flow`. **A Notion Video Task Manager URL is the typical starting point but not required** — if the editor describes the brief directly in chat (shot list, character refs, scene context), hig-flow runs the rest of the gates from that input instead of a Notion fetch. Trigger conditions: editor (1) drops a Notion request URL while cwd is inside a Lucid Link project folder, or (2) says any of "run image generations", "run the HIG flow", "run HIG", "fire the b-roll", "fire the image batch", "make the b-roll for this project". The skill walks 9 confirmation gates (cwd verification → brief intake / Notion fetch → reference scan + auto-character-match → model lock → shot list + prompt craft → Excel manifest → preflight → CLI fire → report) and downloads into `Elements/Footage/Primary/B-Roll Photos/` with deterministic filenames. Default: Nano Banana Pro (`nano_banana_2`) at 1k resolution, count=2 per prompt, iPhone-camera-roll prompt style (loads `nano-banana-prompting`); editor specifies if a shot needs different aesthetic (studio, product shot, slide graphic). NOT for: one-off image work with no batch / no manifest wanted (use `higgsfield-image-generation` — single shots, ad-hoc variations, no gated flow), video generation (use `hvg-flow`), Soul Character training (use `higgsfield-soul-id`), or marketplace listing cards (use `higgsfield-marketplace-cards`).
---

# HIG Flow (PFM Image Generation)

End-to-end Higgsfield image generation pipeline for PFM editors. Image counterpart to `hvg-flow`. Editor drops Notion request + project folder, Claude walks 9 confirmation gates, fires CLI batch, downloads images, writes Excel audit manifest.

**Architecture:** Notion MCP for request fetch → `nano-banana-prompting` skill for default prompt style → Higgsfield CLI (`higgsfield generate create nano_banana_2`) for image generation → Excel manifest via sibling helper.

**Trigger phrases:** "run image generations" (primary), "run the HIG flow", "run HIG", "fire the b-roll", "fire the image batch", "make the b-roll for this project". Also auto-propose when a Notion URL is dropped in image-context (editor mentions b-roll, images, photos) while cwd is inside a Lucid Link project folder.

**Speed expectation:** <5 minutes from gate 9 fire to last download for a typical 10-15 shot batch. Images are ~30s each via NB Pro and parallelize cleanly.

**The 9-gate sequence is non-negotiable.** Same gating discipline as `hvg-flow` — every gate confirms before proceeding.

**UI style — NEVER use the `AskUserQuestion` tool for gate confirmations.** All multi-choice questions in this skill (reference mode, model lock, rotation strategy, etc.) MUST be rendered as plain markdown text in the chat. The editor will type a reply like "A" or "1k" — wait for it. The interactive question cards break the editor's flow and Sam explicitly does not want them. This applies to every gate.

---

## Gate 1 — Session start

Editor has already done this part:
1. Opened Claude Code in the specific project folder (Code tab → folder picker → Lucid Link path)
2. Pasted the Notion request URL as their first message (and any specific b-roll requests / shot list hints)

Capture the URL + any inline shot hints from the editor's message.

## Gate 2 — Context check ("up to speed")

Fire these in parallel before responding:

```bash
pwd                                 # cwd
ls -la Elements/Footage/Reference/  # character refs check
which higgsfield                    # CLI installed?
higgsfield account status           # auth + balance
```

Same 4-layer cwd verification as `hvg-flow`:
1. Visual (already in Code tab)
2. Text readback of pwd
3. Structural — `Elements/` exists
4. Lucid Link path — pwd contains `PFM MEDIA MASTER FOLDER`

**Hard-stops:** same as `hvg-flow` — missing `Elements/`, off Lucid Link, CLI missing, CLI not authenticated.

Single readback line:
> Working in `<full pwd>`. Context ✓. Higgsfield: **X credits**. Notion ready. Pulling request now.

## Gate 3 — Notion request review

Fetch via `mcp__*notion-fetch`. Parse the standard fields:
- `Task Name (Angle - Concept)` → project name → slug
- `Vertical` (e.g. "Auto - Forms")
- `MB`, `Priority`, `Status`

**Image-specific extraction from page content:**
- **Character names mentioned in script** — extract every named character (e.g. "Chad", "Ryan", "Luis", "Derek's sister"). These are the names to match-up to reference image filenames at gate 4.
- **B-roll cues from script beats** — scan numbered lines for visual hooks. Examples:
  - "L17 — One of my newer clients, Ryan, was paying $280 a month" → suggests b-roll: Ryan portrait, $280 rate visual
  - "L24 — A week later I was at a hardware store" → suggests b-roll: Chad at hardware store
  - "L27 — My neighbor and her husband in Orlando" → suggests b-roll: Orlando couple, before/after rate
- **Slide directives** (VSLs) — if the request has `Slide:` sub-bullets, those are NB Pro shot prompts ready to fire. Already mapped to clip numbers.

**Read-back to editor:**

> Project: **<Task Name>** (<Vertical>)
> Characters mentioned in script: **<list>** (e.g. "Chad, Ryan, Luis, Derek's sister")
> Script beats with potential b-roll: **<count>** (I'll propose a shot list at gate 6)
> Slide directives present: **Yes / No** (if VSL with `Slide:` cues)
> Slug: `<derived_slug>`
>
> Confirm before I check refs?

## Gate 4 — Reference scan + auto-character-match

```bash
ls -la Elements/Footage/Reference/ 2>/dev/null
```

**Auto-match characters from script → reference filenames:**
- Loop through character names extracted at gate 3
- For each name, fuzzy-match against filenames in `Reference/` (case-insensitive substring match — e.g. character "Chad" matches `Chad Chapman/`, `Chad - Master.png`, `chad-podcast.png`)
- For each character, pick the master ref (look for `master`, `solo`, or just the named file at the root of their folder)

Report mapping:

> Character refs found:
> - **Chad** → `Reference/Chad Chapman/Chad - Solo Master.png` ✓
> - **Ryan** → not found — generate at gate 6 or specify path?
> - **Luis** → `Reference/Luis - Master.png` ✓
> - **Derek's sister** → not found
>
> Continue to model lock?

**Missing-ref handling:**
- If a critical character is missing → ask the editor: "Generate now via the higgsfield-image-generation skill (CLI), or specify a path?"
- If a minor character is missing (e.g. "Derek's sister" mentioned in one line) → flag it; editor can decide whether to skip that line's b-roll or substitute a different character

PFM character master format (from memory): full-body, plain studio backdrop, neutral pose, neutral wardrobe, 9:16. The Reference folder usually has master + a few action variations + shirt library.

## Gate 5 — Model lock

Default: **Nano Banana Pro (`nano_banana_2`)** — best quality NB model, ~5 cr/image at 1k resolution.

> Model: **NB Pro (`nano_banana_2`)**, **resolution 1k**, **count=2 per prompt** (~5 cr/image, ~10 cr/shot). Lock in, or different config?

**Other models worth knowing:**
- `nano_banana_flash` — cheaper, faster, sometimes better on heavy edits per `STORY-AD-IMAGE-WORKFLOW.md`. ~2 cr/image.
- `gpt_image_2` — for product photoshoot / studio compositions. Use when the editor says "studio shot" or "product photo" (and consider `higgsfield-product-photoshoot` skill instead).
- `flux_2`, `z_image` — alternative aesthetics; only use if editor explicitly requests.

**Resolution choices:**
- 1k → fast, cheap, fine for camera-roll b-roll (default)
- 2k → higher detail; use for hero shots, slide graphics, marketing-quality images
- 4k → only when editor explicitly requests (4× cost)

Lock the model + resolution + count for use in gates 6, 8, 9.

## Gate 6 — Shot list + prompt craft

This is the conversational gate. Two paths converge here:

**Path A — Claude proposes from script:**
- Read the parsed Notion script
- For each numbered line, decide if it warrants a unique b-roll image (most lines do; some pure-narration beats don't)
- Apply `nano-banana-prompting` patterns by default (camera-roll iPhone aesthetic)
- Apply PFM brand-clean rules from memory (`feedback_pfm_brand_clean_rules.md`) per vertical
- Output a draft shot list with: shot ID, line match (if any), reference images, draft prompt
- Show the editor: "Here's the proposed shot list — edit, cut, or add."

**Path B — Editor describes shots inline:**
- Editor provides plain-language shot descriptions ("hardware store, Chad loading lumber, candid iPhone snap; family at dinner table, kids laughing; close-up of a folded utility bill on a kitchen counter")
- Claude expands each into a full prompt using `nano-banana-prompting` + brand-clean rules
- Show prompts back, get sign-off

**Both paths usually mix:** editor says "Take a stab at the shot list, I'll cut and add."

**Shot ID naming convention:**
- **Line-matched shots** → `L<NN>_<description>` (e.g. `L17_ryan_portrait`, `L24_chad_hardware_store`)
- **Generic / non-line-matched shots** (slice-of-life, family beats, abstract shots) → just the description (e.g. `family_dinner`, `folded_utility_bill`, `chad_couch_scrolling`)
- Lowercase, underscores between words, no special chars

**Reference dispatch per shot:**
- Editor specifies refs per shot ("L17 uses Ryan master + Ryan apartment setting"; "family_dinner uses Chad master + wife master")
- Auto-default: character master ref(s) for any shot whose description names a character
- If editor says "make this look different" (e.g. studio shot instead of camera roll), Claude departs from `nano-banana-prompting` defaults for that one shot

**Style override per shot (rare):**
- Default style = camera-roll (`nano-banana-prompting` skill loaded)
- Editor can override with: "S05 should be polished studio not camera-roll" — Claude adjusts that one shot's prompt accordingly

**Save the shot list:**

```bash
mkdir -p Elements/Prompts
# write shot list as JSON to Elements/Prompts/<slug>_image_shots.json
```

JSON schema:
```json
{
  "shots": [
    {
      "shotId": "L17_ryan_portrait",
      "lineMatch": 17,
      "description": "Ryan portrait, mid-30s, frustrated look, kitchen background",
      "references": ["Reference/Ryan - Master.png"],
      "aspectRatio": "9:16",
      "style": "camera-roll",
      "prompt": "<full Higgsfield prompt with all camera-roll patterns + brand-clean negatives>"
    }
  ]
}
```

Each shot fires count=2 → produces `<slug>_<shotId>_v01.png` and `<slug>_<shotId>_v02.png`.

Editor approves the shot list → proceed to gate 7. (Note: gate 7 from `hvg-flow` — the optional L1 test fire — is **skipped by default** for HIG Flow because images are cheap and fast; editor reviews the post-batch results and re-fires individual shots if needed.)

## Gate 7 — (Skipped by default for HIG Flow)

Image gens are cheap (~5 cr/image) and fast (~30s each). No test-fire gate. If the editor wants to spot-test one shot before firing the full batch, they can ask: "fire just shot S05 first" — and we'd run a one-off via the CLI (`higgsfield generate create nano_banana_2 ...`) per the `higgsfield-image-generation` skill conventions, then return.

## Gate 8 — Excel manifest write

Use the helper script that ships with this skill:

```
~/.claude/skills/hig-flow/build_xlsx.py
```

Same styling as `hvg-flow`'s manifest (Summary + Shots sheets, color-coded status, banded rows, fixed row height for prompt collapse). Different column layout for image-specific fields.

**Build the config dict, write to temp, run helper:**

```bash
CONFIG=$(mktemp /tmp/hig-build-XXXXXX.json)
cat > "$CONFIG" <<EOF
{
  "project": {
    "name":      "<Task Name from Notion>",
    "slug":      "<derived slug>",
    "vertical":  "<Vertical from Notion>",
    "createdAt": "<ISO timestamp>",
    "user":      "<editor name>",
    "mb":        "<MB from Notion>",
    "notionUrl": "<full request URL>",
    "notes":     ""
  },
  "generation": {
    "modelDisplay":   "Nano Banana Pro",
    "mcpModel":       "nano_banana_2",
    "resolution":     "1k",
    "countPerPrompt": 2,
    "estCostPerImage": 5
  },
  "shots": [
    {
      "shotId":      "L17_ryan_portrait",
      "lineMatch":   17,
      "description": "<one-line plain English>",
      "references":  ["Reference/Ryan - Master.png"],
      "aspectRatio": "9:16",
      "style":       "camera-roll",
      "prompt":      "<full Higgsfield prompt as a string>",
      "status":      "pending",
      "v01":         "",
      "v02":         "",
      "notes":       ""
    }
    /* ... one entry per shot ... */
  ]
}
EOF

python3 ~/.claude/skills/hig-flow/build_xlsx.py "$CONFIG" \
  "Elements/Footage/Primary/B-Roll Photos/<slug>_shots.xlsx"
rm "$CONFIG"
```

**Status field values** (drives row color): same as `hvg-flow` — `pending` / `✓` / `Partial` / `✗` / `skipped`.

**Don't update mid-batch.** One write before fire (this gate), one rewrite after fire (step 11).

## Gate 9 — Final preflight

Pull current Higgsfield balance fresh:

```bash
higgsfield account status
```

Calculate total images: shots × count.

> **<Model display name>** at **<resolution>** | <N shots> × count=<C> = <X images> | ~<Y> cr (have **<Z>** → <W> after) | Output: `Elements/Footage/Primary/B-Roll Photos/` | <K> unique refs in use ✓
>
> Fire?

**Hard-stop if balance < estimated cost:**

> ⚠️ Not enough credits — need <Y>, have <Z>. Top up the Higgsfield account before firing.

Editor confirms → CLI fires.

---

## Step 10 — CLI fire

**Concurrency model — pre-uploaded UUIDs + ThreadPool `max_workers=16`.** PowerFox Enterprise plan — server-side concurrent-job cap is high enough that it's no longer the practical bottleneck; the client-side CLI credential-store race is the constraint. Per locked memory `feedback_higgsfield_cli_concurrency_race.md`: the Higgsfield CLI has a credential-store race condition under concurrent processes. Each `higgsfield generate create` call reads (and sometimes refreshes) auth state at startup. When N CLI processes fire concurrently AND each also uploads a `--image <local_path>` (which is 3 more auth-touching API calls per job for presign + PUT + confirm), the race window widens dramatically.

**Verified empirical data (2026-05-21):**
- 15 ThreadPool workers + file paths (per-job upload) → 65 of 100 jobs returned empty output ✗
- 16 ThreadPool workers + UUIDs (pre-uploaded) → mostly works (15/16 b-roll) ✓
- **8 ThreadPool workers + UUIDs → reliable target** ✓

Verify cap rules with David on the Higgsfield call; if Enterprise allows higher concurrency cleanly, the workers cap can be raised.

**Step 1 — Pre-upload every unique reference image, serially, capture UUIDs:**

```python
import subprocess, json

# Dedupe refs across all shots first
unique_refs = {ref for shot in all_shots for ref in shot["refs"]}
ref_uuid_map = {}
for ref_path in unique_refs:
    result = subprocess.run(
        ["higgsfield", "upload", "create", ref_path, "--json"],
        capture_output=True, text=True, check=True
    )
    ref_uuid_map[ref_path] = json.loads(result.stdout)["id"]
    # → e.g. "70b6e9b2-90c3-4703-84e8-570b99a1884c"
```

Pre-upload calls run **one at a time** (not in a pool) — the auth race exists for uploads too. Pre-upload is cheap (~1-3s per file) and only runs once per unique ref across the whole batch.

**Image preflight before pre-upload:** for any reference image, check pixel width and resize if >2000px or >3MB (same logic as `hvg-flow`). Pre-upload the RESIZED file, not the original. Dedupe — same character master may be referenced by many shots; only resize and upload once.

**Step 2 — Fire the batch via Python ThreadPool with `max_workers=16`, passing UUIDs (not local paths) to `--image`:**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fire_one(shot, variation, ref_uuid_map):
    # NB Pro takes `input_images` as an array; pass repeated --image flags.
    img_flags = []
    for ref in shot["refs"]:
        img_flags.extend(["--image", ref_uuid_map[ref]])  # UUID, not local path

    cmd = [
        "higgsfield", "generate", "create", "nano_banana_2",
        "--prompt", shot["prompt"],
        *img_flags,
        "--aspect_ratio", shot["aspect"],
        "--resolution", "1k",
        "--wait", "--wait-timeout", "5m",
        "--json",
    ]
    return subprocess.run(cmd, capture_output=True, text=True, timeout=360)

all_jobs = [(shot, v) for shot in shots for v in ("01", "02")]
with ThreadPoolExecutor(max_workers=16) as ex:
    futs = {ex.submit(fire_one, shot, v, ref_uuid_map): (shot, v) for shot, v in all_jobs}
    for fut in as_completed(futs):
        shot, v = futs[fut]
        result = fut.result()
        # save result.stdout to /tmp/hig-flow-results/<shotId>_v<v>.json
```

Images are quick (~30s each), so even a 60-job run drains in ~4 min wall-clock at workers=16 (verified clean on Enterprise — see `feedback_higgsfield_cli_concurrency_race.md`).

**No prompt prefix needed.** NB Pro's CLI doesn't have the leading-`{` quirk that Veo had — image prompts are plain prose, not JSON.

**Self-check before any concurrent CLI fire:**
1. Are any `--image` flags pointing at local file paths instead of UUIDs? → Pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it.
3. Are you using Python ThreadPool, not `bash &`? → ThreadPool past ~4 jobs.

**Edge cases:**
- NSFW false-positive on character images is rare for NB Pro (Veo's stochastic NSFW filter doesn't apply here). If it triggers, just re-fire.
- Reference image too large → auto-resize (`sips -Z 1920`) BEFORE pre-uploading.
- `result_url` may be a list when count > 1 returned in one job; the skill should handle either single-URL or list-URL response formats.
- Worker auth error / `Failed to read credentials.` / empty CLI output → wait 60s, retry the failed jobs. If recurring across multiple retries, drop `max_workers` to 4-6.

## Step 11 — Download + Excel update + report

Parse each result JSON for the image URL(s), download in parallel via `urllib.request` or `curl` to `Elements/Footage/Primary/B-Roll Photos/<slug>_<shotId>_v<NN>.png`.

Then rewrite the Excel manifest using the same helper + same config schema, with refreshed status / v01 / v02 / notes per shot.

Final report:

> ✅ **X images delivered** to `Elements/Footage/Primary/B-Roll Photos/`
> ❌ Y shots had failures: <list shotIds + reasons>
> 💰 Final balance: M cr (delta: -K)
> ⏱ Total elapsed: Z min
> 📋 Manifest: `<slug>_shots.xlsx`

If any shot looks off in review, editor can re-fire individual shots via the `higgsfield-image-generation` skill (CLI-driven) or by re-running this skill with a scoped-down shot list.

---

## Multi-batch parallel firing

When the editor drops **N batches at once** (e.g. 5 state URLs in a single message, asking for slides for all of them), don't fire them sequentially batch-by-batch. Treat the whole thing as ONE mega-fire with per-batch routing:

1. **Parallel Notion fetches.** When the message has N URLs, fire all `notion-fetch` calls in one tool-call message — they all return in roughly the time of one fetch instead of N×.
2. **Single pre-upload pass + single flat job queue.** Pre-upload every unique reference image across ALL batches serially (de-duped — a shared character master uploads once, not N times). Then build the union of all jobs across all batches (e.g. 5 states × 6 shots × 2 takes = 60 jobs) and feed it to one `ThreadPoolExecutor(max_workers=16)` using the UUID map. The API doesn't care that jobs span multiple state outputs — it just sees 60 NB Pro requests.
3. **Per-batch output routing at download time.** Each shot dict carries its own `out_dir` (e.g. `Slide Images - Michigan/`). The download step routes by that field — no co-mingling.
4. **Per-batch manifest at each folder's root.** One Excel manifest per batch (`vsl_<state>_slides_shots.xlsx`), written to the batch's output folder. Don't write a global manifest covering all batches — editors open each state's folder independently.
5. **Throughput data point:** 60 NB Pro 2k jobs delivered in ~3-4 min wall-clock with `max_workers=16` and pre-uploaded UUIDs. Use this as a planning baseline. (Cap was 8 from 2026-05-21 → 2026-05-26 as a defensive default; bumped to 16 after Enterprise B5 wave 1 verified clean at 16 workers. Past ~16 the credential-store race starts dropping jobs — 100 workers = 50% failure.)

Trigger phrases that signal multi-batch: "run a bunch more," "do all of these," paste of >1 Notion URL in the same message, "next batch is X, Y, Z."

## State-variant slide projects

For projects that produce per-state versions of a winning VSL/ad (Florida → Colorado, etc.):

- **Only fire shots where the visual changes between states.** Narration / no-slide lines reuse the broad/winner version's `LXX - Generic.png` files unchanged — Chad-on-plain-plate is state-agnostic.
- **Edit-style prompts must swap ALL state/city/name tokens, not just the headline data.** A common failure: prompt says "replace rate with $230" and gets a great rate swap — but leaves "Tampa" or "Orlando" still written on the slide because the prompt never told NB Pro to touch the city. Default prompt structure:
  ```
  TWO (or N) changes required:
  (1) Replace <rate/number> with <new value> in <color>...
  (2) Replace the city name '<old city>' with '<new city>' anywhere it appears as text...
  (3) Replace the state name '<old state>' with '<new state>' anywhere it appears as text...
  Make NO other changes — preserve every other pixel.
  ```
- **Inspect the source slide for ALL embedded text tokens** before drafting the prompt — state name, city name, person's name (Ryan→Jason), regional/cultural cues. One token missed = one re-fire.
- **Check for multiple DESIGN VARIANTS per slot.** Florida has `L1 - Title Slide - v1.png` AND `L1 - Title Slide - v2.png` — those aren't two takes, they're two different slide designs (e.g. "FLORIDA AUTO INSURANCE CONFERENCE" + "FLORIDA TECH AUTOMOBILE CONFERENCE"). Both designs need state swaps. **Before scoping a state batch, list every `L<NN> - * - v*.png` in the broad/winner folder and treat each unique design as its own shot.** Common slots with multiple designs: title slides (L1), CTA cards (L41), discount lists. If unsure, ls + diff the file sizes — different designs usually have visibly different sizes.
- **Naming distinction — design variant vs. take.** PFM's broad/winner folder uses `v1`/`v2` suffix for *design variants* (one file each). When firing with `count=2`, each state batch produces *takes* of each design — name accordingly so they don't collide:
  - Design A, take 1 + take 2 → `L1 - Title Slide - <State> - v1.png` + `... - v2.png`
  - Design B, take 1 + take 2 → `L1 - Title Slide - <State> v2 - v1.png` + `... - v2.png`
  - The "v2" before the dash = design variant; the "v1/v2" after the dash = take number
- **Identity preservation language is non-negotiable** for character slides — explicit "keep the person's identity, face, expression, clothing, pose, framing, lighting, background completely identical." NB Pro will subtly re-render the face if not told to lock identity.
- **Output naming convention:** mirror the broad/winner folder's filename pattern with the state appended (e.g. `L1 - Title Slide - Colorado - v1.png` to match `L1 - Title Slide - v1.png`). Editor's After Effects timelines drop in by name.
- **Output folder:** `Elements/Footage/Reference/Slide Images - <State>/` per editor's convention. Don't put state slides in the same folder as the broad/winner — keeps timelines clean.
- **Resolution:** NB Pro 1k and 2k cost the same (~2 cr). Default to **2k** for full-screen slide work.

## What NOT to do

- **Don't write image prompts without `nano-banana-prompting` patterns** — that's the default style for PFM b-roll. Editor explicitly opts out per-shot if a different aesthetic is needed.
- **Don't skip PFM brand-clean rules** — every prompt's negative section needs the brand-clean stack from `feedback_pfm_brand_clean_rules.md` (no automaker badges for Auto, no carrier logos, no Apple dock on laptops, etc.).
- **Don't fire** without showing the shot list at gate 6 and the preflight at gate 9.
- **Don't generate character masters here** — masters are foundational, build them via the `higgsfield-image-generation` skill (CLI-driven) or follow `STORY-AD-IMAGE-WORKFLOW.md` Phase 1. HIG Flow assumes masters already exist in `Reference/`.
- **Don't write outputs** to a folder other than `Elements/Footage/Primary/B-Roll Photos/` without asking.
- **Don't pre-process the prompt text** beyond shot-list approval — Higgsfield's API may auto-enhance.
- **Don't update the Excel mid-batch** — single write before, single write after.
- **Don't activate this skill** outside a Lucid Link project folder. Hard-stop on cwd verification (gate 2, layer 4).

## Cross-references

- `hvg-flow` — video counterpart to this skill (same architecture, different model + output)
- `nano-banana-prompting` — loaded by default at gate 6 for prompt style
- `higgsfield-image-generation` — CLI-driven skill for one-off image experiments and character-master creation
- `nano-banana-prompting` — NB-specific prompting patterns
- `higgsfield-product-photoshoot` — for studio / product compositions (different skill if editor requests)
- Memory: `feedback_pfm_brand_clean_rules.md`, `feedback_pfm_character_master_format.md`, `feedback_higgsfield_workflow.md`, `feedback_shirt_rotation_pattern.md`, `feedback_selfie_arm_framing.md`, `feedback_social_proof_selfie_variety.md`, `feedback_folded_bill_aging_cue.md`, `feedback_image_review_context_budget.md`, `feedback_character_placement_one_ref_wins.md`
- Reference workflow: `STORY-AD-IMAGE-WORKFLOW.md` (Phase 1 foundational asset workflow)
