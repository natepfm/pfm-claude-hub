---
name: hf-client
description: >-
  THE Higgsfield transport layer — one component whose ONLY responsibility is submitting a
  generation request and landing the artifact: build the CLI call, quote the cost, fire ONCE,
  poll a live job instead of re-firing, persist/resume a pending job, measure the credit
  delta, download to a caller-named path. It judges no creative content, runs no QC gate,
  names no file and writes no sidecar. Skills call it instead of forking their own fire loop.
  Use on: "fire through hf-client", "use the shared fire path", "hf_client", or when building
  any new skill that needs to reach Higgsfield.
---

# hf-client — the fire path, extracted

> Built 2026-08-31 by Michal (`hf-client-mf`); approved by Sam 2026-09-01 and renamed
> `hf-client` as THE shared fire path. Distribution: hub library item — editors pull it.
> The fire contract is lifted from `extend_fire.py`, the one prior implementation that held it.
> **Nothing in any existing skill was edited to create this.**
>
> **🔴 RULE (Sam, 2026-09-01): a NEW skill does not write its own fire loop — it calls this.**
> Existing skills keep their loops until they are opened for another reason.
>
> **2026-09-01 review fixes (Sam's session, all covered by selftest 8–12):**
> balance moved with no job id → NEVER retry (was retrying: the 261 bug through a side door) ·
> `--resume` refuses to land onto an existing file (never-overwrite now holds on every path) ·
> `billed_but_no_url` is computed AFTER the poll (a poll that lands is not a loss) ·
> `Error: Job not found` (which the CLI returns with exit code 0) stops polling after one
> call and leaves no sidecar · `curl -f` so an HTTP error is never saved as the media file.
>
> **2026-09-02 credit-cost fix (Sam, "FIX CREDIT COST TRACKING"; selftest 13–16):**
> `credits_spent` is now the deterministic per-job charge from `higgsfield generate cost`,
> NOT `balance_before − balance_after`. The balance is WORKSPACE-wide, so another editor's
> gen billing during the fire window inflated the number (~3× over on a 4-clip fire). The
> delta is kept as `balance_delta` for the billed-but-no-url tripwire and audit only;
> `credits_source` says which one you are reading. Also fixed: the CLI REQUIRES `--prompt`
> on `generate cost`, so every quote before this fix was silently `None`.

## 🔴 CHECKLIST — read at the TOP, every run

1. **This component does ONE thing: request in, landed file out.** If you are about to add
   creative judgement, a QC gate, an output-naming rule or a sidecar shape to this skill —
   stop. That belongs to the CALLING skill. The boundary is the whole point.
2. **Never edit `hf_client.py` without re-running `selftest.py`.** 51 assertions, offline,
   zero credits. A red selftest means the expensive bug is back.
3. **Verify with `--dry-run` before any real fire.** It validates the request and prints the
   exact command without spending.
4. **Flag names pass through VERBATIM.** Higgsfield mixes dashes and underscores
   (`--image-references`, `--start-image`, `--extension_mode`, `--bitrate_mode`) and has
   rejected plausible-looking corrections. The caller owns the spelling; this layer
   normalises nothing and never guesses.
5. **A submitted job is NEVER re-fired.** See the contract below. This is the rule the whole
   component exists to hold.
6. **The caller names the output file.** `--dest` is exact. This layer refuses to overwrite an
   existing file unless explicitly told to, because a prior take is never clobbered — but it
   does not know what a `vN` is and must not learn.
7. **Log `credits_spent`, never the balance delta, as a fire's cost.** `credits_spent` comes
   from `generate cost` (keyed only to this fire's params, cannot be polluted). `balance_delta`
   is workspace-wide and exists for the tripwire + audit row only. If `credits_source` reads
   `balance_delta_fallback`, the quote was unreadable and the number is suspect.

## 🔴 The contract: FIRE ONCE, THEN POLL

`higgsfield ... --wait` blocks, and on a slow render returns `timed out waiting for job <id>`
with **no url**. The job is alive and **billing**. The old shape treated that as a dropped
request and re-fired, spawning duplicate paid jobs — five of six project retros named it the
biggest single credit waste, one incident at 261 credits.

| Outcome of a fire | What this layer does |
|---|---|
| url returned | download it, land it |
| no url, **job id present** | persist `.pending_<job>.json`, **poll that id** — never re-fire |
| no url, no job id, **balance unchanged** | a true dropped request — retry, once by default |
| no url, no job id, **balance moved** | a job exists we cannot name — **exhausted, NOT retried**, flagged `billed_but_no_url`; find it with `higgsfield generate list` |
| `Error: Job not found` while polling | not a live job — stop after one poll, no sidecar, no re-fire |

`--resume --work-dir DIR` adopts a pending job a killed session left behind and **fires
nothing**. If the pending job's `--dest` now exists, resume **refuses** (exit 1) and keeps
the sidecar — re-run with `--dest <next vN>`.

## What it owns / what it refuses to own

| Owns | Does NOT own — belongs to the caller |
|---|---|
| the `higgsfield generate create` invocation | what a good prompt is |
| pre-spend cost quote = the recorded `credits_spent` | creative refusals / policy gates |
| model-param advisory (warns, never blocks) | QC gates, cut gates, looking at pixels |
| fire-once-then-poll + pending/resume | output naming (`vN`), provenance sidecars |
| balance before/after → `balance_delta` (tripwire + audit) | slot maps, plates, portraits, stations |
| download to an exact caller-named path | streaming 📲/📁/🔗/🦊 handoffs |

Refusals happen **before** anything is submitted: empty prompt · missing `--model`/`--dest` ·
an input path that is not on disk · a param with an empty value · a `--dest` that already
exists. Nothing is billed by a refusal — asserted in the selftest.

## Use it from a shell

```bash
S=~/.claude/skills/hf-client/scripts

# validate + see the exact command, spend nothing
python3 $S/hf_fire.py --dry-run --model seedance_2_5 --prompt-file g01.txt \
  --dest "out/g01_v01.mp4" \
  --repeat image-references=her.png --repeat image-references=wide.png \
  --param duration=20 --param resolution=720p --param aspect_ratio=9:16 \
  --param bitrate_mode=high --param generate_audio=true --flag wait

# an extend continuation — the CURRENT vendor spelling per `higgsfield model get seedance_2_5`
# (verified in sd2.5-interview-nico 2026-08-25; `--model video_extension` is the LEGACY form)
python3 $S/hf_fire.py --model seedance_2_5 --prompt-file g02.txt --dest "out/g02_v01.mp4" \
  --param mode=video_extension --param extension_mode=forward \
  --param video=out/g01_v01.mp4 --param duration=22 --param resolution=720p --flag wait

# adopt a job a killed session left running
python3 $S/hf_fire.py --resume --work-dir out
```

Exit codes: **0** landed · **1** refused (nothing submitted) · **2** exhausted ·
**3** pending (job alive, resume later).

## Use it from Python

```python
import sys; sys.path.insert(0, os.path.expanduser("~/.claude/skills/hf-client/scripts"))
import hf_client

res = hf_client.fire(hf_client.Request(
    model="seedance_2_5", prompt=prompt_text, dest=dest_path, work_dir=chain_dir,
    params={"duration": 20, "resolution": "720p"},
    repeated={"image-references": [her, wide]}, flags=["wait"], label="g01"))

if res.ok:
    ...   # caller runs ITS gates, writes ITS sidecar, streams ITS handoff
```

`Result` carries `ok · status · dest · url · job_id · cost_quote_cr · balance_before/after ·
balance_delta · credits_spent · credits_source · billed_but_no_url · fire_attempts ·
poll_attempts · advisories · command`.
`fire_attempts` is the contract made observable: on any submitted job it is **1**.
`credits_spent` = the `generate cost` charge (`credits_source: generate_cost`); it falls back
to `balance_delta` only when no quote was readable (`balance_delta_fallback`) and is `0.0`
(`not_submitted`) when nothing reached Higgsfield. Write `credits_spent` + `credits_source` +
`balance_delta` into your ledger row.

## Verify

```bash
python3 ~/.claude/skills/hf-client/scripts/selftest.py
```
51 assertions, offline, no credits, no network. Includes the ones that matter most:
*timeout fired only once*, *billed-but-no-id fired only once*, *resume fires nothing*,
*resume refuses an existing dest*, *credits_spent is the generate-cost charge, not the
polluted workspace delta*.

Live price check (reads the price, spends nothing) — must print `156.0`:
```bash
python3 -c 'import sys,os; sys.path.insert(0, os.path.expanduser("~/.claude/skills/hf-client/scripts")); import hf_client; print(hf_client.cost_quote(hf_client.Request(model="seedance_2_5", prompt="cost-probe", dest="/tmp/x.mp4", params={"duration":24,"resolution":"720p"})))'
```

## Not for

Deciding what to generate · prompt construction · QC · assembly · delivery/handoff · anything
that needs to know the creative. It is a pipe, deliberately.
