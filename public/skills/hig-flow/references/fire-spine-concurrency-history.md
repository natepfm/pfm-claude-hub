# Concurrency "why" — the model fire_batch.py implements (archived from SKILL.md Step 10, 2026-07-09)

`fire_batch.py` owns firing now; this is the reasoning + empirical data behind its design, kept for reference. Do NOT hand-roll this code — call the spine.

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

**Self-check before any concurrent CLI fire:**
1. Are any `--image` flags pointing at local file paths instead of UUIDs? → Pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it.
3. Are you using Python ThreadPool, not `bash &`? → ThreadPool past ~4 jobs.
