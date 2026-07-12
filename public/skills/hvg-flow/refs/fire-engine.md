# Fire engine — concurrency model + batch fire code (hvg-flow Step 10)

Moved verbatim from SKILL.md Step 10 (2026-07-09) — load this before writing any fire script.

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
    shot_type = line_assignment.get("shot_type", "")  # "studio_anchor" / "field_standup" / "interview" / "phone_sot" / "screensaver" / "motion"
    if line_assignment.get("refMode") == "D":  # Start + end keyframes — different bookends, motion
        img_flags.extend(["--start-image", ref_uuid_map[line_assignment["start_ref"]]])
        img_flags.extend(["--end-image", ref_uuid_map[line_assignment["end_ref"]]])
    elif shot_type in ("studio_anchor", "screensaver"):  # D-locked cinemagraph — same UUID both endpoints
        same_uuid = ref_uuid_map[line_assignment["ref"]]
        img_flags.extend(["--start-image", same_uuid])
        img_flags.extend(["--end-image", same_uuid])
    else:  # Single --image — field standup, interview, phone SOT, motion
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

# count=1 locked default — one take per line. Add extra variations ONLY for lines
# where the editor opted into count=2 at gate 5.
all_jobs = [(line, v) for line in line_assignments for v in ("01",)]
with ThreadPoolExecutor(max_workers=16) as ex:
    futs = {
        ex.submit(fire_one, line, v, ref_uuid_map, MCP_MODEL, MODEL_FLAG, ASPECT_RATIO, DURATION, GENERATE_AUDIO, QUALITY): (line, v)
        for line, v in all_jobs
    }
    for fut in as_completed(futs):
        line, v = futs[fut]
        slug, variation, rc = fut.result()
        # log or report per-completion — Rule 5: surface each result_url the instant it resolves
```

**Self-check before firing:**
1. Are any `--image` / `--start-image` / `--end-image` flags pointing at local file paths? → Pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it.
3. Are you using Python ThreadPool, not `bash &`? → ThreadPool past ~4 jobs.
4. Is the model `veo3_1_lite` AND the editor wants audio? → Add `--generate_audio true` (Lite ships silent without it).
5. Is the model Preview Ultra? → Add `--quality ultra`.
