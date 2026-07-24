---
name: e.import
description: >-
  [editor command] Targeted ADDITIVE media import into the CURRENT open DaVinci Resolve project —
  bring ONE Lucid folder (recursive) into the media pool, mirroring its path under the project bin
  (bin name = Lucid project folder name, verbatim). The lightweight extraction of claude-editor
  Phase 1 for when the editor just needs files in DaVinci — new b-roll, a refire batch, a graphics
  drop — WITHOUT the full import-assemble pipeline. Use on "get this folder into davinci", "import
  the b-roll", "make sure those get in davinci", "/e.import <folder>", "add these files to the
  media pool". Brings the folder's MEDIA **and its `.drt` timelines** (Sam 2026-07-24 — timelines
  import via ImportTimelineFromFile into the bin mirroring their own folder, e.g.
  `Creatives/Timelines`). Purely additive + idempotent (never deletes, never switches projects,
  never duplicates an existing timeline). NOT for: the full project Phase-1 import at edit-start
  (claude-editor), BUILDING timelines from a script (e.assemble), publishing a timeline as a .drt
  for handoff (e.timeline), or Palmier imports (palmier-davinci-import).
---

# e.import — one folder → the open DaVinci project

## 🔴 STEP 0 — RUN THE SCRIPT AS WRITTEN; NEVER HAND-ROLL THE IMPORT (Sam, 07-22 — "use what's in the skill")
Use `e_import.py` — it does the name-verified `AddItemListToMediaPool` (plain `ImportMedia` silently SKIPS uncached Lucid files, the locked reason this script exists). Do NOT re-implement the pool import by hand. Fix the script if a case is missing; don't fork a scratch one.

Extracted from claude-editor Phase 1 (2026-07-14, Sam: "we should not have to invoke the entire
claude-editor for a simple import"). One job: a Lucid folder's media lands in the open project's
pool, in the right bin, additively.

## Run

```bash
python3 ~/.claude/skills/e.import/e_import.py --folder "<absolute Lucid folder>"
```

- **Bin routing:** walks UP from the folder to the Lucid project root (the dir containing
  `Elements/`); project bin = that folder's name VERBATIM (`feedback_davinci_bin_matches_lucid_folder`),
  and the relative path is mirrored as sub-bins (e.g. `Elements/Footage/Primary/B-Roll`).
  `--bin-name` overrides; `--flat` skips the mirror and drops straight into the project bin.
- **Lucid-hardened mechanics** (inherited verbatim from claude-editor): fresh leaf bin →
  `MediaStorage.AddItemListToMediaPool` (drag-equivalent; pulls uncached cloud files that plain
  ImportMedia silently skips — but does NOT dedupe, so only on an empty bin); partially-filled bin →
  `MediaPool.ImportMedia` top-up filtered by existing File Path (dedupes). Idempotent — re-run to
  top up SHORT folders.
- **Timelines (`.drt`) come too** (Sam 2026-07-24): media is only half a project folder. After the
  media walk the script sweeps for `.drt` files and imports each via `MediaPool.ImportTimelineFromFile`
  — they are NOT media, so `AddItemListToMediaPool` silently ignores them (which is why
  `Creatives/Timelines/` used to arrive empty). Each lands in the bin that MIRRORS its own folder
  (`Creatives/Timelines` on disk → `Creatives → Timelines` in the pool), never a new root-level bin.
  Idempotent by timeline NAME, so re-running never duplicates. **Resolve drops
  `ImportTimelineFromFile` calls made back-to-back** — only 2 of 4 landed on the first run — so the
  loop paces itself (0.6s between, one 1.5s retry) and reports `timelines: N imported, N already
  present, N failed`. Never lower that pacing.
- **Verification** (DONE = check passed): per-folder disk-count vs in-bin-count table; anything
  SHORT → re-run. Saves the project at the end.

## Hard rules (inherited)

- Current OPEN project only — never create/switch/clear/load a project.
- ADDITIVE only — never DeleteFolders, never touch existing bins/timelines
  (`feedback_davinci_import_whole_folder`).
- Requires Resolve open + Preferences > System > General > External scripting = Local.

## Cross-references

`claude-editor` (full Phase-1 project import + the 4-phase pipeline) · `e.assemble` (timelines) ·
`palmier-davinci-import` (Palmier→DaVinci leg) · `feedback_davinci_bin_matches_lucid_folder`.
