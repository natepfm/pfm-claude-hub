# The fire path is duplicated 19 times and only one copy is correct

> Written 2026-08-31 by Michal, for Sam. Evidence gathered from the installed skill set on
> this machine. **No existing skill was edited.** `hf-client-mf` is a working demonstration
> of the alternative, not a migration.

## The measurement

Every script in `~/.claude/skills` that invokes the Higgsfield create call, deduplicated by
content hash (so a file forked into three skills counts once):

**19 unique fire implementations.**

Of those, how many hold the FIRE-ONCE-THEN-POLL contract — the rule that a `--wait` timeout
must be *polled* rather than re-fired?

| Implementation | Contract markers |
|---|---|
| `sd2.5-interview-flow-extended-mf/scripts/extend_fire.py` | **16** ✅ |
| `sd2.5-interview-nico/scripts/chain_fire.py` | 2 (partial) |
| the other **17** | **0** |

Markers counted: `timed out`, `find_job_id`, `pending_`, `poll_job`.

## Why that number is expensive

`higgsfield ... --wait` blocks. On a slow render it returns `timed out waiting for job <id>`
with **no url** — and the job is alive and billing. A fire loop that reads "no url" as "the
request dropped" re-fires and pays twice.

`extend_fire.py`'s own docstring records the cost: *"five of six project retros named this the
biggest credit waste,"* with one measured incident at **261 credits**. That fix lives in
exactly one file. The other 17 implementations are still running the shape that caused it.

This is not a code-style complaint. It is 17 copies of a known, priced bug that nobody will
remember to fix in 17 places.

## Why it happened — the responsibility boundary

`extend_fire.py` states its own ownership at the top of the file, and it lists **four** things:

> `OWNS: the higgsfield CLI call, the download, vN naming, the cut gate on landing, the
> FIRE-ONCE-THEN-POLL contract`

Those are four different concerns at three different altitudes:

| Concern | Altitude | Changes when… |
|---|---|---|
| CLI call, poll contract, download | **vendor transport** | Higgsfield changes its API |
| vN naming, provenance sidecar | **PFM file convention** | the naming law changes |
| cut gate on landing | **creative QC** | the craft standard changes |

Because they live in one file, a skill that wants the transport has to take the QC and the
naming with it. So it doesn't — it writes its own fire loop instead, and the transport fix
never travels. **That is the whole mechanism behind the 19.**

The pattern repeats: `fire_skit_clip.py` (446 lines), `fire_bounded.py` (600),
`fire_clip.py` (428), `chain_fire.py` (348, and 1,885 in nico). Each is mostly creative logic
with a fire loop welded into the middle.

## What `hf-client-mf` does instead

One component, one responsibility: **request in → landed file out.**

It owns the vendor transport and nothing above it — the CLI invocation, the cost quote, the
model-param advisory, fire-once-then-poll, pending/resume, the credit delta, the download to a
path the caller names.

It refuses to own creative judgement, QC gates, output naming, sidecars, or handoffs. Those
stay with the calling skill, where they belong and where they differ per creative.

The contract is asserted, not asserted-to: `scripts/selftest.py` runs **26 assertions offline
against a fake Higgsfield, for zero credits**, including the two that matter —

- *timeout FIRED ONLY ONCE (no duplicate paid job)*
- *resume fires NOTHING*

Run it after any edit. Red means the 261-credit bug is back. Today: **26 passed, 0 failed.**

This also satisfies RULES SHIP AS CODE. The fire-once rule currently lives as prose in one
docstring; here it is a script guard with a test that fails loudly.

## What I am NOT proposing

- Not editing any existing skill. Nothing shipped is touched.
- Not a migration. No skill is rewired unless you want it to be.
- Not a new front door. Editors never invoke this; skills call it.

## What I am asking for

1. **A look at the boundary** — is *transport / convention / craft* the right seam for PFM?
2. **If yes, a rename and a home.** `hf-client-mf` is personal-suffixed per the naming law.
   Team-wide it should be `hf-client`, synced, with the skills adopting it one at a time —
   newest and most expensive first, and only with the selftest green.
3. **A rule for new skills:** a new skill does not get to write its own fire loop.

## The migration order I would suggest, if you want one

Cheapest and safest first — each is additive, each provable by dry-run before any spend:

1. **New skills only.** Anything built from here calls the client. Zero risk to shipped work.
2. **`sd2.5-ugc-skit`** — it has no extend support at all today (no `video_extension`, no
   `--extend-from`, no window logic), so its law 8 extend A/B cannot actually be run. Wiring it
   to the client adds the capability instead of replacing working code.
3. **The 0-contract fire paths, by spend.** Each one adopted removes one copy of the bug.
4. **`extend_fire.py` last** — it is the only correct one, so it has the least to gain and the
   most to lose.

Nothing above step 1 happens without your call.
