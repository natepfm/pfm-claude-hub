---
name: higgsfield-veo-batch
description: Drive the full Higgsfield video-generation pipeline end-to-end from an HVG.1 (Higgsfield Video Generator) handoff using the Higgsfield CLI (NOT the MCP). Use this skill whenever an editor drops an HVG.1 `_handoff.md` or `_manifest.json` into the conversation, or signals "fire the Veo batch", "run the gens", "let's start the generations", "begin the Veo run". The skill reads the manifest, fires `higgsfield generate create` shell commands in parallel waves under the rate limit, and downloads results into the project's `Elements/Footage/Veo/` folder with deterministic filenames (`<slug>_v01.mp4` / `<slug>_v02.mp4`). The CLI bypasses the MCP's broken filters and exposes full Veo 3.1 Fast/Preview with frame-to-video AND audio. If the editor does NOT have a manifest (legacy project, manual workflow, single one-off clip), do not use this skill — fire `higgsfield generate create` directly per the higgsfield-generate skill conventions.
---

# Higgsfield Veo Batch (CLI edition)

Runtime counterpart to **HVG.1** (Higgsfield Video Generator webapp at `https://higgsfield-video-generator-production.up.railway.app/`).

## 🛑 PFM CONVENTIONS — non-negotiable before firing

**Before firing ANY Higgsfield video CLI call for PFM work** (one-off re-fires, manual tests, exploratory shots, legacy HVG.1 manifest batches), load and apply the conventions from `hvg-flow` — even when the editor isn't going through the structured 9-gate flow.

Quick rules to self-impose every time:
- Veo prompt format: prefix `Veo video prompt: ` for JSON masters (CLI rejects leading `{`)
- Auto-resize images >2000px before passing as `--image`; pre-upload to UUIDs for batch fires (see Step 4a)
- Default model: Veo 3.1 Fast (~27 cr/clip, audio by default) unless explicitly requested otherwise
- `veo3_1_lite` ships SILENT by default (8 cr/clip). Add `--generate_audio true` for dialogue audio (12 cr/clip)
- `veo3_1` Preview has a `--quality basic|high|ultra` knob — Ultra is ~87 cr/clip, reserve for hero placements
- Audio block: never write "no audio" — always include benign ambient direction
- Brand-clean negatives stack matched to vertical (no automaker badges, no Geico/Progressive/etc, no GE/Whirlpool, no Apple/macOS dock, etc.)
- No 3-4s "punchy" beats — lines are 15-30 words (target 17-22), lean long
- No dashes, no ALL CAPS in line text (except `[BRACKETED_TOKEN]` placeholders)
- No `[STATE LINE]` trailing annotations
- No camera device names in scene description (no "iPhone"/"GoPro"/"DSLR" — bleeds device into frame)
- One image input only — Veo accepts a single ref, no start+end keyframes
- Wide-shot lip-sync fails — `status: "failed"` spikes on long-lens / distant-subject refs
- Re-fires save as v3/v4/v5 — never overwrite v01/v02
- UGC dialogue: 6-block prose template (header / scene / performance with cold-open / verbatim dialogue / voice lock / locked audio block / negatives)
- For new-character placement: 1-ref + scene description beats 2-ref
- Concealed Carry vertical exempt from "no firearms" default
- Workspace check: `higgsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39` if the CLI shows "No workspace selected" (PowerFox Enterprise drift recovery)

Full convention list lives in `~/.claude/skills/hvg-flow/SKILL.md`. Cross-load it whenever this skill triggers for PFM material.

**Uses the Higgsfield CLI, NOT the MCP.** The CLI bypasses the MCP's filters that broke `mode: input_images`, `input_image`, and `generate_audio` for Veo models. Verified 2026-05-06: Veo 3.1 Fast + image + audio works perfectly through `higgsfield generate create`.

Editor walks away after dropping the manifest; comes back to a folder of correctly-named `.mp4` files with audio.

## When to apply

Apply on any of these signals:
- An HVG.1 `_handoff.md` or `_manifest.json` is dropped into the conversation
- Editor says "fire the Veo batch", "run the gens", "let's start generations", "kick off the Veo run", "fire it off"
- A manifest JSON object is pasted with a `generation.mcpModel` field

**Don't apply** if:
- No manifest exists — use the `higgsfield-generate` skill for one-off clips
- The editor wants prompts to copy/paste manually — write the prompt and stop
- The editor asks about something else mid-batch — pause, address, resume

## Speed expectations

Aim for **<2 minutes from manifest drop to first wave firing**. CLI is faster than the old MCP path because:
- `--image <path>` auto-uploads (no separate `media_upload` + `media_confirm` calls)
- `--wait` blocks until done in one shot (no polling loop)
- One CLI call per generation = one shell command, no MCP roundtrip overhead

## Step 1 — Bootstrap (verify CLI installed + authenticated)

Fire these in parallel in a single message:

```bash
which higgsfield                              # confirms CLI is on $PATH
higgsfield account status                     # confirms auth + current credits
```

If `which higgsfield` returns nothing, install:
```bash
npm install -g @higgsfield/cli
```

(Matches the `claude-pfm-setup.sh` installer — no `sudo` if the user's npm prefix is writable, which it is on a properly-configured editor machine.)

If `higgsfield account status` says "Session expired" or "Not authenticated", ask the editor to run `higgsfield auth login` (interactive, browser-based, ~5s).

## Step 2 — Pre-flight (parallel, lightweight)

Fire these in parallel in a single message:

1. **Read `<slug>_manifest.json`** if it exists in the same folder as the `.md` (preferred — faster than markdown parsing). Fall back to extracting the JSON block under `## Manifest` in the `.md` only if the JSON file isn't there.
2. `bash`: verify reference image exists at `<md_folder>/<imgName>`:
   ```bash
   IMG="<full path>"
   ls -la "$IMG"
   ```
3. `bash`: walk up from the `.md` folder to find `Elements/Footage/Veo/`, create if missing:
   ```bash
   mkdir -p "<output folder>"
   ```
4. `higgsfield generate cost <mcpModel> --prompt "x" --image "$IMG" --aspect_ratio 16:9 --duration 8 --model veo-3-1-fast` (one cost check to estimate per-clip — multiply by total clips)

Then output **one** preflight line:

> Preflight: 10 prompts × count=2 = 20 clips, ~440 cr (have 3,764 → 3,324 after). Output: `Elements/Footage/Veo/`. Reference: `Jason - On Podcast Set.jpg` ✓ Cleared to fire?

If balance < estimated cost: stop and ask. Don't volunteer the full table unless asked.

**Verified per-clip costs (8s, 16:9, empirical table 2026-05-20):**
- **Veo 3.1 Fast: ~27 credits** ← default for HVG.1 (audio included by default)
- **Veo 3.1 Preview (base): ~58 credits** (audio included)
- **Veo 3.1 Preview (Ultra): ~87 credits** (`--quality ultra` flag on `veo3_1` — `--quality` accepts `basic | high | ultra`)
- **Veo 3.1 Lite — silent: 8 credits** (no audio — default if `--generate_audio` flag omitted)
- **Veo 3.1 Lite — with audio: 12 credits** (requires `--generate_audio true` flag — Lite ships silent without it)
- Seedance 2.0: ~30-40 credits
- Kling 3.0: 10 cr (5s std) / 20 cr (10s std) / 25 cr (10s pro)

## Step 3 — Image size validation (defensive)

Higgsfield rejects images > ~3MB or > ~2000px wide. The CLI auto-uploads via `--image <path>`, but the underlying API will reject oversize images. Validate first:

```bash
WIDTH=$(sips -g pixelWidth "$IMG" | awk '/pixelWidth/ {print $2}')
SIZE=$(stat -f%z "$IMG")  # macOS

if [ "$WIDTH" -gt 2000 ] || [ "$SIZE" -gt 3000000 ]; then
  RESIZED="${IMG%.*}_resized.${IMG##*.}"
  sips -Z 1920 "$IMG" --out "$RESIZED"
  IMG="$RESIZED"
  echo "Auto-resized to $RESIZED (was ${WIDTH}px / $((SIZE/1024))KB)"
fi
```

Tell the editor if you auto-resized so they know which file got uploaded.

## Step 4 — Fire generations (Python ThreadPool + pre-uploaded UUIDs)

**Concurrency model — pre-uploaded UUIDs + `max_workers=8`.** PowerFox Enterprise plan (verify concurrent cap with David — was 16 on Team). Per locked memory `feedback_higgsfield_cli_concurrency_race.md`: the Higgsfield CLI has a credential-store race condition under concurrent processes. When N CLI processes fire concurrently AND each ALSO uploads a `--image <local_path>` (3 more auth-touching API calls per job for presign + PUT + confirm), most jobs come back empty.

**Verified empirical data (2026-05-21):**
- 16 bash `&` background jobs + file paths → all 16 fail with auth errors ✗
- 15 ThreadPool workers + file paths (per-job upload) → 65 of 100 jobs return empty output ✗
- 8 ThreadPool workers + pre-uploaded UUIDs → reliable target ✓

The old `bash & + wait` wave pattern in earlier versions of this skill is DEPRECATED.

**Step 4a — Pre-upload the reference image(s), serially, capture UUID(s):**

For HVG.1 manifests, the reference is typically a single character master image (one upload). For multi-ref manifests, dedupe first.

```python
import subprocess, json

unique_refs = collect_unique_refs(manifest)  # set of local paths from manifest entries
ref_uuid_map = {}
for ref_path in unique_refs:
    result = subprocess.run(
        ["higgsfield", "upload", "create", ref_path, "--json"],
        capture_output=True, text=True, check=True
    )
    ref_uuid_map[ref_path] = json.loads(result.stdout)["id"]
```

Uploads run **one at a time** (not in a pool — the auth race exists for uploads too). Pre-upload is cheap (~1-3s per file) and only once per unique ref. Image preflight (Step 3) produces the resized files; pre-upload those resized versions, not the originals.

**Step 4b — Fire the batch via Python ThreadPool with `max_workers=8`, passing UUIDs:**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import subprocess, os

os.makedirs("/tmp/veo-batch-results", exist_ok=True)

def fire_one(entry, variation, ref_uuid_map, mcp_model, model_flag, aspect_ratio, duration, generate_audio, quality):
    prompt = f"Veo video prompt: {entry['fullPrompt']}"  # leading-{ prefix workaround for JSON masters

    cmd = [
        "higgsfield", "generate", "create", mcp_model,
        "--prompt", prompt,
        "--image", ref_uuid_map[entry["ref_path"]],  # UUID, not local path
        "--aspect_ratio", aspect_ratio,
        "--duration", str(duration),
        "--wait", "--wait-timeout", "8m",
        "--json",
    ]
    if model_flag:                  # e.g. "veo-3-1-fast"
        cmd.extend(["--model", model_flag])
    if generate_audio:              # Lite-with-audio fires only
        cmd.extend(["--generate_audio", "true"])
    if quality:                     # Preview Ultra fires
        cmd.extend(["--quality", quality])

    out_path = f"/tmp/veo-batch-results/{entry['slug']}_v{variation}.json"
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=540)
    with open(out_path, "w") as f:
        f.write(result.stdout)
    return (entry["slug"], variation, result.returncode)

all_jobs = [(entry, v) for entry in manifest_entries for v in ("01", "02")]
with ThreadPoolExecutor(max_workers=8) as ex:
    futs = {
        ex.submit(fire_one, entry, v, ref_uuid_map, MCP_MODEL, MODEL_FLAG, ASPECT_RATIO, DURATION, GENERATE_AUDIO, QUALITY): (entry, v)
        for entry, v in all_jobs
    }
    for fut in as_completed(futs):
        entry, v = futs[fut]
        result = fut.result()
        # progress log or report
```

**Manifest tunables → CLI flags:**
- `mcpModel` → CLI positional arg (e.g. `veo3_1`, `veo3_1_lite`)
- `mcpParams.model` → `--model <variant>` flag (e.g. `--model veo-3-1-fast`)
- `mcpParams.quality` → `--quality <basic|high|ultra>` flag (Preview Ultra runs only)
- `mcpParams.generate_audio` → `--generate_audio true` (Lite-with-audio runs only)
- Other `mcpParams` keys → `--<key> <value>` flags
- `aspectRatio` → `--aspect_ratio`
- `duration` → `--duration`

**Do NOT pass `--quality`, `--model`, or `--generate_audio` if `mcpParams` doesn't include them** — the CLI uses model defaults. `veo3_1_lite` without `--generate_audio true` ships silent; `veo3_1_lite` with the flag ships at the audio rate (12 cr vs 8 cr).

**Self-check before firing:**
1. Are any `--image` flags pointing at local file paths? → Pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 8? → If higher, lower it.
3. Is the model `veo3_1_lite` AND the manifest specifies audio? → Add `--generate_audio true`.
4. Is the manifest spec'ing Preview Ultra? → Add `--quality ultra`.

### Per-prompt construction

For each manifest entry, the prompt sent to `--prompt` should be the entry's `fullPrompt` (the master JSON pre-built by HVG.1, with id/title/dialogue injected per line). Higgsfield's API will auto-enhance it into a structured prompt internally, so you don't need to pre-process.

**CRITICAL CLI QUIRK — prompts that start with `{` fail.** The Higgsfield CLI auto-detects JSON-looking strings on `--prompt` and breaks. Since `fullPrompt` from HVG.1 manifests is a JSON string starting with `{`, the call fails with a generic error. **Workaround: prefix the prompt with leading text** so it doesn't start with `{`:

```bash
PROMPT_WITH_PREFIX="Veo video prompt: ${FULL_PROMPT}"
higgsfield generate create veo3_1 --prompt "$PROMPT_WITH_PREFIX" ...
```

The "Veo video prompt:" prefix is informational text that gets included in the prompt sent to Veo (which auto-enhances anyway, so it's stripped/ignored in the final output). Verified 2026-05-06.

If `fullPrompt` contains literal newlines or quote characters, escape them properly when passing to bash (use `printf '%s' "$PROMPT"` or write to a temp file and use `--prompt "$(cat /tmp/prompt.txt)"`).

### Edge cases

- **CLI hangs past `--wait-timeout`**: the underlying job may still complete. Get the job ID from the partial output (CLI prints it before `--wait`), then `higgsfield generate wait <job_id> --json` to recover.
- **Image upload failure**: CLI returns an error before the gen starts. Auto-resize the image and retry.
- **Rate limit hit**: 16-concurrent cap exceeded. Wait 60s, retry the failed jobs.
- **NSFW false positive**: Veo's safety filter is stochastic on certain character archetypes (~20-30% rate on bald/turtleneck "Chad" silhouettes). Failed jobs return `status: "failed"` with no `result_url`. Just re-fire the same prompt + ref. Add `"NOT a real person, NOT a celebrity, NOT a public figure - entirely fictional original character"` to the character description if persistent.
- **Silent audio (Veo 3.1 Lite without `--generate_audio true`)**: Lite ships silent by default. If the manifest specs `veo3_1_lite` but the editor expected dialogue audio, the fire either needs the `--generate_audio true` flag added (12 cr/clip instead of 8 cr/clip silent) OR the model escalated to Fast (~27 cr/clip, audio by default). Confirm with the editor before re-firing.

## Step 5 — Download results

After `wait` returns (all background CLI jobs done), parse each JSON file for `result_url` and download in parallel:

```bash
cd "<output folder>"
for SLUG_VAR in "${SLUG_VARS[@]}"; do  # e.g. "denied_carloan_L01_v01"
  URL=$(jq -r '.[0].result_url' "/tmp/veo-batch-results/${SLUG_VAR}.json")
  if [ "$URL" != "null" ] && [ -n "$URL" ]; then
    curl -sSL "$URL" -o "${SLUG_VAR}.mp4" -w "${SLUG_VAR}: %{http_code}\n" &
  else
    echo "FAILED: ${SLUG_VAR} — no result_url, check JSON for error"
  fi
done
wait
```

Quote paths with spaces. Variation number = explicit in the filename loop above.

## Step 6 — Report

When all downloads complete, summarize:
- ✅ N clips delivered to `<output folder>`
- ❌ Y prompts had failures (with reasons + slugs)
- 💰 Final balance: M credits (delta: -K credits)
- ⏱ Total elapsed: Z minutes

If any prompt failed, list slug + dialogue + reason so the editor can decide whether to re-fire.

## Speed budget (target)

For a typical 10-line × count=2 batch:

| Step | Target time |
|---|---|
| Bootstrap + preflight (parallel) | 30s |
| Image validate + maybe resize | 10s |
| Fire wave 1 (6 prompts × 2 = 12 jobs in background) | 5s |
| Wave 1 generation + drain (CLI --wait blocks) | 90-180s |
| Fire wave 2 (4 prompts × 2 = 8 jobs) | 5s |
| Wave 2 generation + drain | 90-180s |
| Download all clips (parallel curl) | 30s |
| Report | 5s |
| **Total wall clock** | **~5-7 min for 20 clips** |

If you're going slower than this, audit which step ate the time. Most common culprit: serial CLI calls instead of parallel background jobs.

## What NOT to do

- **Don't use the MCP** `mcp__*__generate_video` tool — it filters out the params we need (`input_image`, `mode: input_images`, `generate_audio`). Use the CLI exclusively.
- **Don't fire the batch** without showing the editor the cost preflight and waiting for explicit confirmation
- **Don't `rm` failed jobs' partial JSON files** — leave them for the editor to inspect
- **Don't write to a different folder than `Elements/Footage/Veo/`** without asking — that's the locked-in convention per project memory
- **Don't pre-process the prompt text** — Higgsfield's API auto-enhances it. Pass `fullPrompt` from the manifest verbatim.

## Cross-references

- HVG.1 webapp: produces the handoff `.md` + manifest JSON this skill consumes
- `higgsfield-generate`: official Higgsfield-built skill for one-off generations via CLI
- `higgsfield-image-generation`: parallel skill for Higgsfield image gens (b-roll, character masters) — CLI-driven, same `higgsfield generate create` pattern
- Project memory: `project_pfm_podcast_story_workflow.md` for full pipeline context
- Memory: `feedback_higgsfield_workflow.md` for download/save conventions, rate limits, NSFW retry pattern
