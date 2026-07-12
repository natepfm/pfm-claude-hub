# LEGACY — hand-rolled parallel batch firing (superseded by the shared spine)

> **Superseded 2026-07-09.** Multi-shot batches now fire through the shared spine
> `~/.claude/skills/hig-flow/fire_batch.py` (contract: `~/.claude/skills/hig-flow/PIPELINE-SPEC.md`),
> which owns pre-upload → concurrent fire (Rule-5 streamed) → serial verified download → manifest →
> Lucid handoff. This file preserves the original hand-rolled ThreadPool teaching for reference —
> the concurrency lessons in it (UUID pre-upload, `max_workers=16`, `as_completed` streaming) are
> exactly what fire_batch.py implements. Do not hand-roll a new batch runner from this; use the spine.

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
    for fut in as_completed(futs):        # 🔴 Rule 5: handle each gen the MOMENT it finishes
        job = futs[fut]
        result = fut.result()
        parsed = json.loads(result.stdout) if result.returncode == 0 else None
        url = parsed["results"][0]["rawUrl"] if parsed and parsed.get("results") else None
        print(f"LANDED {job['label']}: {url}", flush=True)   # streamed to the shell output AS IT LANDS
        # download this one now — do NOT wait for the rest of the batch
```

(import line: `from concurrent.futures import ThreadPoolExecutor, as_completed`)

**While the backgrounded batch shell runs, tail its output — every `LANDED` line gets relayed to the editor IMMEDIATELY** (📲 tappable + widget), before the next one resolves. The end-of-batch message is just counts + balance; the reveals already happened live.

**Self-check before any concurrent CLI fire:**
1. Are any `--image` flags pointing at local file paths? → If yes, pre-upload first and swap to UUIDs.
2. Is `max_workers` ≤ 16? → If higher, lower it. (16 verified clean on Enterprise; race kicks in past ~16 — 100 workers = 50% job loss.)
3. Are you using Python ThreadPool or bash `& + wait`? → ThreadPool past 8 jobs.
