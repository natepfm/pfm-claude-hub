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
- Auto-resize images >2000px before passing as `--image`
- Default model: Veo 3.1 Fast (~25 cr/clip) unless explicitly requested otherwise
- `veo3_1_lite` has NO audio — use only for intentionally silent b-roll
- Audio block: never write "no audio" — always include benign ambient direction
- Brand-clean negatives stack matched to vertical (no automaker badges, no Geico/Progressive/etc, no GE/Whirlpool, no Apple/macOS dock, etc.)
- No 3-4s "punchy" beats — lines are 15-24 words, lean long
- No dashes, no ALL CAPS in line text (except `[BRACKETED_TOKEN]` placeholders)
- No `[STATE LINE]` trailing annotations
- No camera device names in scene description (no "iPhone"/"GoPro"/"DSLR" — bleeds device into frame)
- One image input only — Veo accepts a single ref, no start+end keyframes
- Wide-shot lip-sync fails — `status: "failed"` spikes on long-lens / distant-subject refs
- Re-fires save as v3/v4/v5 — never overwrite v01/v02
- UGC dialogue: 6-block prose template (header / scene / performance with cold-open / verbatim dialogue / voice lock / locked audio block / negatives)
- For new-character placement: 1-ref + scene description beats 2-ref
- Concealed Carry vertical exempt from "no firearms" default

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
sudo npm install -g @higgsfield/cli
```

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

**Rough per-clip costs (8s, 16:9):**
- **Veo 3.1 Fast: ~22 credits** ← default for HVG.1
- Veo 3.1 Preview: ~60-100 credits
- Veo 3.1 Lite: ~20 credits (NOTE: silent video, no audio — generally not what we want)
- Seedance 2.0: ~30-40 credits
- Kling 3.0: ~30-50 credits

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

## Step 4 — Fire generations in waves (CLI in parallel)

**Critical: Higgsfield Team plan caps at 16 concurrent jobs.** Fire in waves of **6-7 prompts × `countPerPrompt`** (= 12-14 jobs per wave), wait for the wave to drain, then fire the next.

For each prompt in a wave, fire `count` separate `higgsfield generate create` calls in parallel as backgrounded bash processes. Each command blocks until done with `--wait` and writes its JSON result to a temp file:

```bash
mkdir -p /tmp/veo-batch-results

# Build the wave: for each prompt, fire `countPerPrompt` background jobs
for ENTRY_IDX in 0 1 2 3 4 5; do  # 6 prompts in this wave
  SLUG="${SLUGS[$ENTRY_IDX]}"
  PROMPT="${PROMPTS[$ENTRY_IDX]}"

  for VARIATION in 01 02; do
    higgsfield generate create veo3_1 \
      --prompt "$PROMPT" \
      --image "$IMG" \
      --aspect_ratio "${ASPECT_RATIO}" \
      --duration "${DURATION}" \
      --model "${MODEL_VARIANT}" \
      --wait --wait-timeout 8m \
      --json > "/tmp/veo-batch-results/${SLUG}_v${VARIATION}.json" 2>&1 &
  done
done

# Wait for all background jobs to finish
wait
```

Tunables in the manifest's `generation` block:
- `mcpModel` → CLI positional arg (e.g. `veo3_1`)
- `mcpParams.model` → `--model <variant>` flag (e.g. `--model veo-3-1-fast`)
- Other `mcpParams` keys → `--<key> <value>` flags (e.g. `--quality high`, `--resolution 720p`)
- `aspectRatio` → `--aspect_ratio`
- `duration` → `--duration`

**Do NOT pass `--quality` or `--model` if `mcpParams` is empty** — the CLI uses model defaults.

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
- **Silent audio (Veo 3.1 Lite only)**: Lite is a silent-video model. If editor used Lite in HVG.1, the clips will have no audio. Suggest re-running with Fast.

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
- `higgsfield-image-generation`: parallel skill for Higgsfield image gens (b-roll, character masters) via MCP
- Project memory: `project_pfm_podcast_story_workflow.md` for full pipeline context
- Memory: `feedback_higgsfield_workflow.md` for download/save conventions, rate limits, NSFW retry pattern
