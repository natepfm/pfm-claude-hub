---
name: hig-flow
description: 🔴 MANDATORY for ALL image gens in any PFM project folder — including one-off tests, manual refires, character master tests, single-shot variations, "let me try one quick," "just one more." The ONLY skip is the editor literally writing "one-off", "quick", "no manifest", "no flow", or "direct CLI" in their message. Do NOT infer "small job → skip the gate" — that's the failure mode this skill exists to prevent. When in doubt, this skill runs. PFM's Higgsfield Image Generator flow — end-to-end gated batch pipeline from a brief (Notion request URL OR direct editor description) to delivered b-roll images with an Excel manifest. Image counterpart to `hvg-flow`. **A Notion Video Task Manager URL is the typical starting point but not required** — if the editor describes the brief directly in chat (shot list, character refs, scene context), hig-flow runs the rest of the gates from that input instead of a Notion fetch. Trigger conditions: editor (1) drops a Notion request URL while cwd is inside a Lucid Link project folder, or (2) says any of "run image generations", "run the HIG flow", "run HIG", "fire the b-roll", "fire the image batch", "make the b-roll for this project". The skill runs setup SILENTLY (cwd check, brief intake / Notion fetch, character match, model lock to NB Pro 1k count=1, shot-list + prompt draft, manifest write) and stops for the editor at only up to two confirmations — character-reference assignment (only when a character is unmatched) and a consolidated preflight that doubles as shot-list sign-off — then downloads into `Elements/Footage/Primary/B-Roll Photos/` with deterministic filenames. Default: Nano Banana Pro (`nano_banana_2`) at 1k resolution, count=1 per prompt (editor opts into count=2 for a pick), iPhone-camera-roll prompt style (loads `nano-banana-prompting`); editor specifies if a shot needs different aesthetic (studio, product shot, slide graphic). NOT for: one-off image work with no batch / no manifest wanted (use `higgsfield-image-generation` — single shots, ad-hoc variations, no gated flow), video generation (use `hvg-flow`), Soul Character training (use `higgsfield-soul-id`), or marketplace listing cards (use `higgsfield-marketplace-cards`).
---

# HIG Flow (PFM Image Generation)

## 🔘 Fire gate = clickable card (locked 2026-06-11)

Present every **Fire?** confirmation via the **AskUserQuestion tool** — header `Fire?`, question "Preflight above — fire this batch?", options: **🔥 Fire** ("fire exactly as preflighted") and **Hold** ("don't fire — I'll say what to change"). Clicking 🔥 Fire IS the explicit fire confirmation (Hard Rule 3); a typed `fire` in chat also counts. This is the ONE sanctioned AskUserQuestion use in PFM flows — every other multi-choice stays plain markdown per the editor's standing preference.

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


End-to-end Higgsfield image generation pipeline for PFM editors. Image counterpart to `hvg-flow`. Editor drops a Notion request (or describes the brief inline) + project folder, Claude runs setup silently and stops at up to two confirmations (character-reference assignment when ambiguous, then a consolidated preflight that doubles as shot-list sign-off), fires the CLI batch, downloads images, writes an Excel audit manifest. The 9 gates below are still the full procedure — but most run silently now (see Execution Model), not as nine separate confirmation stops.

**Architecture:** Notion MCP for request fetch → `nano-banana-prompting` skill for default prompt style → Higgsfield CLI (`higgsfield generate create nano_banana_2`) for image generation → Excel manifest via sibling helper.

**Trigger phrases:** "run image generations" (primary), "run the HIG flow", "run HIG", "fire the b-roll", "fire the image batch", "make the b-roll for this project". Also auto-propose when a Notion URL is dropped in image-context (editor mentions b-roll, images, photos) while cwd is inside a Lucid Link project folder.

**Speed expectation:** <5 minutes from gate 9 fire to last download for a typical 10-15 shot batch. Images are ~30s each via NB Pro and parallelize cleanly.

**🛑 EXECUTION MODEL — silent setup, minimal confirmation stops (updated 2026-05-27):**

Same model as `hvg-flow`. On a trigger (URL drop / folder ref / "fire the b-roll" / etc.), enter the flow immediately — don't offer alternatives. Then run with **silent setup and at most two confirmation stops**: pause only where a wrong call costs real credits, hard-stop loud on any failure.

**Run SILENTLY — do the work, don't stop for a yes:**
- **Gate 1** — capture the URL / brief / inline shot hints.
- **Gate 2** — context check (pwd / `Elements/` / CLI / auth). One-line readback, keep going. HARD-STOP only on failure.
- **Gate 3** — fetch + parse the request (or read the editor's inline brief); extract character names for the gate-4 match. Rolls into the preflight.
- **Gate 5** — lock the model: default **Nano Banana Pro (`nano_banana_2`), 1k, count=1**, silently. `count=1` is the locked default — only ask for a non-default model/resolution, or if the editor wants `count=2` for a pick. Shown in the preflight.
- **Gate 6** — draft the shot list + per-shot prompts silently (`nano-banana-prompting` style + brand-clean). Save the JSON to `Elements/Prompts/`. The FULL shot list shows in the preflight for approval — it's the deliverable definition, so the editor sees and signs off on every shot there.
- **Gate 7** — already skipped by default (no L1 test for images).
- **Gate 8** — write the Excel manifest silently.

**STOP for confirmation — the only blocking gates:**
- **Gate 4 — Reference / character match.** Auto-match named characters to ref files. If every named character resolves to exactly one master, state the mapping and roll it into the preflight — NO separate stop. If it's ambiguous (a character has no ref, or multiple candidate files), THIS is a stop: surface the gaps and ask (generate the missing master via `higgsfield-image-generation`, specify a path, or skip that shot).
- **Gate 9 — Consolidated preflight → fire.** One block: brief summary, the FULL shot list (IDs + one-line descriptions), reference plan, model + resolution + count, image count, cost (have X → Y after), output folder. Single **"Fire?"** — last stop before spend. The shot list here IS the editor's sign-off on what gets made; the cost line is sign-off on the spend.

**Net:** a clean project (all characters matched, default model) reaches a SINGLE confirmation — the preflight, which doubles as shot-list approval. A project with an unmatched character gets two. Never more.

**Hard-stops fire loud regardless** (safety rails): cwd not a PFM project folder · `Elements/` missing · CLI missing · auth expired · insufficient credits · a named character with no reference (editor decides generate-vs-skip).

**Silent ≠ off-script.** Run the defined steps in order; don't invent steps or fire outside the flow; don't skip the preflight. Mid-session: never re-ask for the URL / project folder if they're already in context.

**UI style — plain markdown for every question EXCEPT the Fire? gate.** Multi-choice questions render as plain markdown chat — the editor types "1k" / "drop shot 3, add a bill close-up" / etc. Interactive cards break the editor's flow and Sam doesn't want them. **ONE exception (locked 2026-06-11): the Fire? confirmation uses an AskUserQuestion card** (🔥 Fire / Hold) so the editor clicks instead of typing — see the Fire gate section above.

---

## Gate 1 — Session start [SILENT]

Editor has already done this part:
1. Opened Claude Code in the specific project folder (Code tab → folder picker → Lucid Link path)
2. Pasted the Notion request URL as their first message (and any specific b-roll requests / shot list hints)

Capture the URL + any inline shot hints from the editor's message.

**Project folder via LinkYourFile:** the editor can point at the project folder by dropping a **LinkYourFile link** instead of opening it in Code — decode the link's base64 `p=` param → the `/Volumes/ads/…` path, then `cd` there before the Gate 2 context check.

## Gate 2 — Context check ("up to speed") [SILENT — hard-stop on failure]

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

## Gate 3 — Notion request review [SILENT — parsed summary rolls into preflight]

Fetch via `mcp__*notion-fetch`. **Do NOT touch the request's Status — leave it at "Requested."** Generating assets is a raw-asset handoff, not a status change; gen/delivery is hands-off on Status (standing rule, see `feedback_notion_request_status_lifecycle`) — Status moves → "Done" only on an explicit turn-in, which `notion-asset-delivery` handles. Then parse the standard fields:
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

## Gate 4 — Reference scan + auto-character-match [STOP only if a character is unmatched]

```bash
ls -la Elements/Footage/Reference/ 2>/dev/null
```

**Auto-match characters from script → reference filenames:**
- Loop through character names extracted at gate 3
- For each name, fuzzy-match against filenames in `Reference/` (case-insensitive substring match — e.g. character "Chad" matches `Chad Chapman/`, `Chad - Master.png`, `chad-podcast.png`)
- For each character, pick the master ref (look for `master`, `solo`, or just the named file at the root of their folder)

**Per the Execution Model, this is a STOP only when a character is UNMATCHED.** If every named character resolves to exactly one master, note the mapping and roll it into the preflight — don't stop here. Stop only if a character has no ref (or multiple candidates), and surface just the gaps.

Report mapping (info — only blocks if there's an unmatched character):

> Character refs found:
> - **Chad** → `Reference/Chad Chapman/Chad - Solo Master.png` ✓
> - **Ryan** → not found — generate via `higgsfield-image-generation`, specify a path, or skip Ryan's shots?
> - **Luis** → `Reference/Luis - Master.png` ✓
> - **Derek's sister** → not found — skip or substitute?
>
> (If every character is ✓, no stop — the mapping shows again in the preflight.)

**Missing-ref handling:**
- If a critical character is missing → ask the editor: "Generate now via the higgsfield-image-generation skill (CLI), or specify a path?"
- If a minor character is missing (e.g. "Derek's sister" mentioned in one line) → flag it; editor can decide whether to skip that line's b-roll or substitute a different character

PFM character master format (from memory): full-body, plain studio backdrop, neutral pose, neutral wardrobe, 9:16. The Reference folder usually has master + a few action variations + shirt library.

## Gate 5 — Model lock [SILENT — default NB Pro 1k count=1]

Default: **Nano Banana Pro (`nano_banana_2`)** — best quality NB model, ~5 cr/image at 1k resolution.

> Model: **NB Pro (`nano_banana_2`)**, **resolution 1k**, **count=1 per prompt** (~5 cr/image = ~5 cr/shot). Lock in, want count=2 for a pick, or different config?

**Other models worth knowing:**
- `nano_banana_flash` — cheaper, faster, sometimes better on heavy edits per `STORY-AD-IMAGE-WORKFLOW.md`. ~2 cr/image.
- `gpt_image_2` — for product photoshoot / studio compositions. Use when the editor says "studio shot" or "product photo" (and consider `higgsfield-product-photoshoot` skill instead).
- `flux_2`, `z_image` — alternative aesthetics; only use if editor explicitly requests.

**Resolution choices:**
- 1k → fast, cheap, fine for camera-roll b-roll (default)
- 2k → higher detail; use for hero shots, slide graphics, marketing-quality images
- 4k → only when editor explicitly requests (4× cost)

Lock the model + resolution + count for use in gates 6, 8, 9.

## Gate 6 — Shot list + prompt craft [SILENT — full shot list shown at preflight for approval]

**Per the Execution Model, draft the shot list + prompts SILENTLY here — the editor approves the full list at the preflight (Gate 9), not at this gate.** The two paths below describe how to build the list; the "show the editor / get sign-off" steps move to the preflight, where the editor can cut / add / tweak shots before firing. (If the editor already gave an explicit shot list inline, just use it.)

This is the prompt-craft gate. Two paths converge here:

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

Each shot fires count=1 → produces `<slug>_<shotId>_v01.png`. (If the editor opted into count=2, also `<slug>_<shotId>_v02.png`.)

Draft silently → the full shot list is presented for the editor's approval at the consolidated preflight (Gate 9), not here. (Gate 7 — the `hvg-flow` optional L1 test fire — stays **skipped by default** for HIG Flow: images are cheap and fast, so the editor reviews post-batch results and re-fires individual shots if needed.)

## Gate 7 — (Skipped by default for HIG Flow)

Image gens are cheap (~5 cr/image) and fast (~30s each). No test-fire gate. If the editor wants to spot-test one shot before firing the full batch, they can ask: "fire just shot S05 first" — and we'd run a one-off via the CLI (`higgsfield generate create nano_banana_2 ...`) per the `higgsfield-image-generation` skill conventions, then return.

## Gate 8 — Excel manifest write [SILENT]

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
    "countPerPrompt": 1,
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

## Gate 9 — Consolidated preflight → fire [STOP]

**This is the one consolidated confirmation stop.** It absorbs what the now-silent model lock (Gate 5) and shot-list draft (Gate 6) used to confirm separately — the editor sees the full shot list AND the cost in one block and approves once. The shot list here IS the editor's sign-off on what gets made.

Pull current Higgsfield balance fresh:

```bash
higgsfield account status
```

Calculate total images: shots × count. **Build the LinkYourFile link BEFORE rendering the preflight** — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute output folder>"` — same helper used by the final report. The preflight Output MUST use the two-link format (raw Lucid Path + clickable Open link); a bare relative path is a Hard-Rule-5 violation. Then show the full preflight in one block:

> **Preflight — <Project name>**
> Brief: <one-line, e.g. "Karen HOA b-roll — 12 shots">
> Shot list:
> 1. `L17_ryan_portrait` — Ryan, frustrated, kitchen
> 2. `L24_chad_hardware_store` — Chad loading lumber, candid iPhone snap
> 3. `family_dinner` — Chad + wife + kids laughing
> … (all N shots — ID + one-line each)
> Reference plan: <characters matched to masters, e.g. "Chad → Solo Master, Ryan → Master">
> Model: **Nano Banana Pro**, 1k, count=<C>
> Images: <N shots> × <C> = **<X images>**
> Cost: ~<Y> cr (have **<Z>** → <W> after)
> 📁 Path: `/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/…/Elements/Footage/Primary/B-Roll Photos/`
> 🔗 Open: [B-Roll Photos ↗](https://linkyourfile.com/link?p=…)
> **Fire?**

The full shot list is the editor's chance to cut / add / tweak shots now that Gate 6 runs silent — it's the deliverable definition. Editor can reply "fire" or "drop shot 3, add a close-up of the utility bill, then fire."

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

takes = ("01",)  # count=1 default; ("01", "02") if the editor opted into count=2
all_jobs = [(shot, v) for shot in shots for v in takes]
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

Final report — **always close with the Lucid handoff (📁 Path + 🔗 Open — plus a 3rd 📲 Tappable line whenever you show a representative image inline, per Hard Rule 2)** (standing rule, `feedback_two_link_lucid_handoff`): the raw Lucid **Path** (backticked, for Finder) AND a clickable **Open** link, built with `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute B-Roll Photos folder>"` and rendered as `[label ↗](url)` (Lucid `/Volumes/ads/…` paths only):

> ✅ **X images delivered** to `Elements/Footage/Primary/B-Roll Photos/`
> ❌ Y shots had failures: <list shotIds + reasons>
> 💰 Final balance: M cr (delta: -K)
> ⏱ Total elapsed: Z min
> 📋 Manifest: `<slug>_shots.xlsx`
> 📁 Path: `/Volumes/ads/…/Elements/Footage/Primary/B-Roll Photos`
> 🔗 Open: [B-Roll Photos ↗](https://linkyourfile.com/link?p=…)

If any shot looks off in review, editor can re-fire individual shots via the `higgsfield-image-generation` skill (CLI-driven) or by re-running this skill with a scoped-down shot list.

## Optional — promote anything to the central PFM libraries

After the final report, the editor can choose to promote any of this batch's images or prompts to PFM's central libraries — `1. PFM Media Assets/AI Generation Assets - PFM/Character Library/` (for keeper character or scene refs other projects will reuse) and `1. PFM Media Assets/AI Generation Assets - PFM/Prompts Library/` (for prompts that nailed a tricky character or scene type and deserve to become a reusable template).

**This step is OPTIONAL** — unlike `pfm-character-master`'s mandatory save offer, hig-flow runs are usually large per-shot batches where most images stay project-local. Surface the option ONCE at the tail of the report; do not pester the editor across the batch and do not re-offer on refires.

**Tail-of-report wording — paste after the two-link handoff:**

> 💾 Want to promote any shot to PFM central libraries?
>   - **Image(s)** → `Character Library/<Character>/` (e.g. a clean character-on-grey or canonical scene that other projects will reuse)
>   - **Prompt(s)** → `Prompts Library/<Role / Scene Type> - <Character>.md` (e.g. a shot's prompt that nailed a tricky character or scene type and should become a reusable template)
>
> Reply with the shot IDs (e.g. `promote L17, g05`) or `skip`.

**On editor reply with shot IDs:**
- For each shot, ask which target(s) — `image`, `prompt`, or `both`
- **Image promotion** → copy the delivered PNG into the per-character subfolder under `Character Library/` (Option B structure: per-character folder, wife/family/guest variants nested inside). Strip the source hash + version suffix on copy (`sma_houston_L17_v01.png` → `<Character> - Master.png` or a descriptive shot name). No overwrites — `v02` if a same-named file exists.
- **Prompt promotion** → write a new `Prompts Library/<Role / Scene Type> - <Character>.md` entry mirroring existing entries' shape (metadata table → visual spec → working JSON prompt body → CLI fire snippet → provenance citing this project). Update the Prompts Library `README.md` index table with the new row.
- Two-link Lucid handoff (Path + Open) for each new central-folder destination.

**On `skip`:** acknowledge ("Skipped central libraries.") and move on. Don't re-prompt.

**Hard constraints:**
- Surface ONCE at the end of the report. NEVER mid-batch.
- NEVER auto-promote without explicit shot IDs from the editor.
- Two-link Lucid handoff applies to the new central-folder destinations too.

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
- **Output naming convention:** mirror the broad/winner folder's filename pattern with the state appended (e.g. `L1 - Title Slide - Colorado - v1.png` to match `L1 - Title Slide - v1.png`) so the editor can swap them in by exact filename.
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
- **Central libraries (optional promotion target — see the "Optional — promote anything to the central PFM libraries" section above):** `1. PFM Media Assets/AI Generation Assets - PFM/Character Library/` (per-character image library) and `1. PFM Media Assets/AI Generation Assets - PFM/Prompts Library/` (per-character prompt template library)
