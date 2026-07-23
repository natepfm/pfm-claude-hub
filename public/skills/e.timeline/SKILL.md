---
name: e.timeline
description: >-
  [editor command] Timeline HANDOFF between editors — publish a DaVinci timeline as a .drt into
  the project's Creatives/Timelines/ (export leg), and bring a published .drt into YOUR OWN open
  DaVinci project with full media verification (import leg). This is how a project moves from one
  editor to another without hunting timelines or relinking: everyone mounts Lucid at the same
  /Volumes/ads path, so an imported .drt relinks itself. Use on "/e.timeline export", "/e.timeline
  import <drt>", "export the timeline", "publish the timeline", "hand off this project", "pick up
  <project>", "import <editor>'s timeline", "grab the timeline for batch 2". The export leg also
  runs automatically inside /e.export (every render publishes its timeline). NOT for: media-folder
  imports (e.import), building timelines (e.assemble), rendering (e.export), or Palmier
  (p.export / palmier-davinci-import).
---

# e.timeline — timeline handoff (`e.` = editing-workflow family)

## STATUS: TEAM (pushed to Lucid 2026-07-23, Sam). Maiden export run proven same day; first cross-editor pickup is the remaining live validation — treat its first run on another editor's machine as supervised.

**Why this exists (2026-07-23):** timelines live inside each editor's DaVinci cloud project —
invisible in Finder, findable only by DM-ing the original editor. Picking up someone's batch meant
hunting the timeline AND relinking media. This skill makes the timeline a published artifact on
Lucid and makes pickup a one-command import that relinks itself.

## 🔴 Hard rules (both legs)

- **Current open project ONLY** — never create / switch / clear / load a project (claude-editor's
  absolute rule).
- **ADDITIVE only** on import — never DeleteFolders, never touch existing bins/timelines.
- **NEVER overwrite** — an existing .drt versions up (`_v02`, `_v03`…) automatically
  (`feedback_regen_no_overwrite`).
- **Filename = timeline name, verbatim** — which equals the creative name per `pfm-naming`, so
  `Creatives/Timelines/` self-documents.
- **Parent media is referenced in place, NEVER copied** into the new request's folder (Sam, locked
  2026-07-23). Copy-on-write only: a file the new project will MODIFY gets copied to its own
  Elements first. Elements/ stays read-only everywhere (locked 2026-07-20).
- **Run the scripts as written; never hand-roll** the export/import (same law as e.import Step 0).

## Export leg — publish the timeline

```bash
python3 ~/.claude/skills/e.timeline/e_timeline_export.py \
  --project-folder "<absolute Lucid project folder>" \
  --current                      # or --timeline "<name/substring>" (repeatable) or --batch "Batch 1"
```

- Writes `<timeline name>.drt` into `<project>/Creatives/Timelines/` (creates the folder if the
  project predates the template change). Existing file → versions up, never overwrites.
- **Path check on every timeline:** any clip path outside `/Volumes/ads` is printed loudly — that
  exact file WILL be offline on the next editor's machine. `--strict` refuses to export instead.
  Fix = move the file to its canonical Lucid location and relink BEFORE publishing.
- Verifies each .drt exists on disk with size > 0 (DONE = that check passing).
- Delivery: published .drt is a landed asset → full 📁 + 🔗 handoff on the folder
  (`linkyourfile.py`), 🦊 rail drop when this is a project handoff delivery.

## Import leg — pick up the timeline

### 🔴 STEP 0 — MIRROR THE PROJECT FOLDER FIRST (the e.import law applies here, no exceptions)

The DaVinci bin structure MUST match the project folder in Finder (`feedback_davinci_bin_matches_lucid_folder`,
`feedback_davinci_import_whole_folder`) — never one flat bin with everything crammed in. Before
importing any .drt, mirror the ENTIRE new project folder:

```bash
python3 ~/.claude/skills/e.import/e_import.py --folder "<new request folder>/Creatives"
python3 ~/.claude/skills/e.import/e_import.py --folder "<new request folder>/Elements"
```

This creates the full bin tree (all folders, even empty) + imports the project's own media. THEN
import the .drt — the script places the timeline in the bin matching its Finder path (e.g.
`Creatives/Parent Timelines`), never flat.

```bash
python3 ~/.claude/skills/e.timeline/e_timeline_import.py \
  --drt "/Volumes/ads/.../<parent project>/Creatives/Timelines/<name>.drt" \
  --project-folder "<absolute Lucid folder of the NEW request>"   # names the destination bin
```

- Editor opens **their own** DaVinci project first — never the other editor's.
- Timeline lands in a bin named for the NEW request's folder (whose work it now is). Omit
  `--project-folder` only when re-importing into the same project's own work.
- Media auto-populates from the .drt's recorded paths — the shared base clips keep pointing at the
  **parent** project's Elements, which is correct and reported, not "fixed".
- **Parent-media bin placement (Sam, locked 2026-07-23):** clips the .drt pulls in from OTHER
  project folders have no Finder home inside this project, so they get NO re-binning — anywhere
  inside the project bin is fine, as long as their file paths stay intact. Never move/relink them.
- **Verification (named check):** every referenced file is tested on disk. Report classifies:
  parent-project media / this request's media / elsewhere (⚠ NOT ON LUCID flagged). Zero missing =
  pass; any missing file is listed with its path — that file was never on Lucid, or isn't synced.
- Duplicate timeline name in the project → import returns nothing; re-run with `--timeline-name`.

### After a continuation pickup

If the new request's folder already has its own generated assets (batch-2 gens, graphics), offer
the media leg — that's plain `e.import`, unchanged:

```bash
python3 ~/.claude/skills/e.import/e_import.py --folder "<new request folder>/Elements"
```

## The full handoff picture

Finishing editor: `/e.export` renders the batch → the hook publishes every timeline's .drt to
`Creatives/Timelines/` automatically → turn-in comment carries the Timeline row.
Pickup editor: opens own project → `/e.timeline import <drt>` → everything online → `e.import` the
new request's own elements → cuts batch 2. No DMs, no relinking, no hunting.

## Proxy policy (written rule, not enforced by this skill)

Default = **no proxies** (Veo clips, gens, 1080 footage cut natively off Lucid). Only 4K
field-shoot footage warrants proxies — and then the project's proxy generation location is set to
the project folder ON LUCID (e.g. `Elements/Footage/Proxy/`), never Resolve's default local
folder, so proxies travel with the handoff. Missing proxies alone never cause offline media
(Resolve falls back to originals); offline media = a non-Lucid path, which the export leg's path
check exists to catch.

## Preconditions

- DaVinci Resolve open, a project loaded, Preferences > System > General > External scripting = Local.
- Lucid mounted at `/Volumes/ads`.

## Cross-references

`e.timeline.export` (STANDALONE export-leg command — for editors who rendered manually outside
/e.export; also what the `/r.creative` + notion-asset-delivery turn-in ping runs on a yes) ·
`e.import` (media leg) · `e.export` (render + auto-publish hook) · `claude-editor` (full 4-phase
pipeline) · `pfm-naming` (timeline/creative naming) · `feedback_regen_no_overwrite` ·
`feedback_davinci_import_whole_folder`.
