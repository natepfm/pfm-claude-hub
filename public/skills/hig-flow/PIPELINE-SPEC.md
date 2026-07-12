# PFM B-Roll Pipeline — architecture (locked 2026-07-06, Sam)

The reorg that makes the b-roll system **type-first**: purpose-built skills own the craft, one
shared spine owns firing + delivery. Source of truth for `fire_batch.py` + every type skill's
handoff. Written after Sam's call: "should we retire HIG and just have skills around different
b-roll? … yes demote [HIG's mandate] … build the real spine … [new type skills] yes, I want them
to be specific."

## Three layers

1. **Type skills (front doors).** One per b-roll TYPE. Own the craft (character/env discipline,
   the OG-lock, prompt bodies) + the shot list + the per-type review cadence. Produce a
   normalized **job list** and hand it to the spine. Own NOTHING mechanical.
   - `iphone-broll` — camera-roll b-roll (identity-swap Mode A + fresh Mode B)
   - `jre-swap` — JRE podcast placement (recreate-frame + person swap)
   - `social-proof-phone-quote` — person holding phone with the quote page on-screen
   - `pfm-character-master` / `character-studio` — character masters (gpt_image_2)
   - `ugc-talking-head-ref` — talking-head presenter reference still
   - `broadcast-news-stills` — anchor / field-reporter / ENG-camera news look **(new 2026-07-06)**
   - `object-inserts` — no-character atmosphere/object shots: bill, mailbox, hands on wheel **(new)**

2. **The pipeline spine.** ONE executable — `fire_batch.py` (sibling to `build_xlsx.py`) — plus the
   `hig-flow` SKILL.md that documents it + wraps the AGF interlock. Owns everything mechanical
   (below). `hig-flow` ALSO keeps a generic shot-list drafter as the **fallback** for an
   unclassified batch that no type skill fits. It is no longer the mandatory front door.

3. **One-offs.** `higgsfield-image-generation` — single shots, refires, prompt tests. Untouched.

## Ownership map

| Capability | Owner |
|---|---|
| cwd verify + full-template scaffold | Spine (`hig-flow` gate 2 / any caller) |
| AGF interlock — read `Asset Gen`, branch, `Generating (Local)` lock, close | Spine (Claude, around the fire) |
| Character / env-plate discipline, prompt craft, the OG-lock | Type skill |
| Shot list + per-type review cadence (e.g. iphone waves of 10) | Type skill |
| Pre-upload UUIDs → ThreadPool(16) → serial verified download → Rule-5 stream | Spine (`fire_batch.py`) |
| Manifest (`.xlsx` via build_xlsx.py / `.md` / none), verify count | Spine, format per contract |
| Lucid handoff 📁/🔗/🦊/📲 + central-library promote offer | Spine (`fire_batch.py` prints, Claude relays) |
| Generic shot-list drafting (misc batch, no type fits) | `hig-flow` ONLY (its remaining unique job) |

## The job-list contract

Every type skill, after its craft gates, writes ONE JSON job list and calls the spine. The spine
never guesses conventions — the type skill declares `outDir` / `naming` / `manifest`, so
iphone-broll keeps its flat `B-Roll/` + `.md` while a VSL keeps `Slide Images/` + `.xlsx`. No
forced migration.

```json
{
  "project": { "name": "...", "slug": "...", "vertical": "...", "notionUrl": "...", "user": "...", "mb": "..." },
  "gen":      { "model": "nano_banana_2", "resolution": "1k", "count": 1, "estCostPerImage": 5 },
  "outDir":   "Elements/Footage/Primary/B-Roll/",
  "naming":   "{nn}_{shot}_{hex}.png",
  "manifest": "md",
  "shots": [
    {
      "shotId":      "05_kitchen_bill",
      "description": "folded utility bill on a kitchen counter, morning light",
      "refs":        ["Elements/Footage/Reference/Locked Environments/kitchen_plate.png"],
      "aspect":      "9:16",
      "prompt":      "<full nano-banana body + brand-clean negatives>"
    }
  ]
}
```

**Naming tokens:** `{nn}` zero-padded index, `{shot}` shotId, `{char}` first ref's character (if
resolvable), `{hex}` unique 4-char hash (kills DaVinci image-sequence auto-grouping —
`feedback_broll_filename_unique_hash`). `{state}` when the shot carries one.

**Spine consumes it →** validate → resolve+dedup+resize refs → (default) dry-run plan / (`--fire`)
pre-upload → ThreadPool(16) fire, `LANDED {shotId}: {url}` streamed per gen (Rule 5) → serial
verified download → manifest → verify count → print 📁/🔗/🦊 handoff + queue the `--fox-drop`.
The **AGF interlock wraps the whole thing** whenever `project.notionUrl` is set — that's Claude's
job around the call (Notion MCP), not the script's.

## What the spine does NOT own

- **AGF interlock Notion writes** — a script can't touch the Notion MCP. Claude does the
  read/branch/`Generating (Local)` lock/close around invoking the spine (documented in `hig-flow`).
- **Rule-5 relay to the editor** — the script streams `LANDED` lines; Claude tails them and does
  the 📲 tappable-CloudFront + widget reveal per gen. The script can't render a widget.
- **Prompt craft** — the type skill wrote the prompts; the spine fires them verbatim.

## Safety defaults (locked)

- **Default = dry-run.** Bare `fire_batch.py <joblist>` plans + prints cost, spends nothing.
  `--fire` is required to upload/generate. Matches "no fire without confirmation" (Rule 3).
- Concurrency ceiling `max_workers=16`, pre-uploaded UUIDs only (never local paths to `--image`) —
  `feedback_higgsfield_cli_concurrency_race`.
- Serial download + verify + retry — parallel downloads drop files on the shared Lucid account.
- Refs > 2000px / > 3MB auto-resized before upload; deduped across the batch.

## Build phases

1. `fire_batch.py` (spine) — proven via dry-run. ← foundation
2. `hig-flow` reframed to pipeline + fallback; mandate demoted; memory/CLAUDE.md updated.
3. `iphone-broll` converted (reference implementation).
4. `jre-swap` + `social-proof-phone-quote` converted.
5. `broadcast-news-stills` + `object-inserts` built (new).
6. Sync Lucid + hub + plugin + memory + changelog; verify.
