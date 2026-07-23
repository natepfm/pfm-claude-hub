---
name: e.timeline.export
description: >-
  [editor command] STANDALONE timeline publish — export timeline(s) from the open DaVinci project
  as .drt files into the project's Creatives/Timelines/, WITHOUT running a render. For when the
  editor already rendered/exported their videos manually (outside /e.export) and the timelines
  still need publishing — the handoff artifact must exist either way. Use on "/e.timeline.export",
  "export the timelines", "publish the timelines", "just the timelines", "save out the timeline",
  or a yes to the turn-in ping "want me to also export the timelines?". Runs the export leg of
  e.timeline and nothing else. NOT for: rendering video (e.export — which auto-publishes .drts
  itself), importing/picking up a timeline (e.timeline import leg), or media imports (e.import).
---

# e.timeline.export — publish timelines standalone (`e.` = editing-workflow family)

## STATUS: TEAM (pushed to Lucid 2026-07-23 alongside e.timeline).

The export leg of `e.timeline` as its own command. Exists because editors don't always render
through `/e.export` (which publishes .drts automatically) — a manually-rendered project still
needs its timelines published or the handoff system has a hole.

## Run

Read `~/.claude/skills/e.timeline/SKILL.md` (export leg) and execute it EXACTLY as written — all
hard rules apply (never overwrite / version up, filename = timeline name verbatim, path check,
📁 + 🔗 handoff on the Timelines folder):

```bash
python3 ~/.claude/skills/e.timeline/e_timeline_export.py \
  --project-folder "<absolute Lucid project folder>" \
  --current            # or --timeline "<name/substring>" (repeatable) or --batch "Batch 1"
```

- **Project folder**: find it in session context (recent export report, _HANDOFF.md, cwd) before
  asking. **Timeline selection**: the finished creatives' timelines — match by the creative names
  in `Creatives/`; ask only if genuinely ambiguous.
- Surface any ⚠ off-Lucid path lines to the editor verbatim — that media will be offline on any
  other machine.
- DONE = the script's "✓ N/N .drt file(s) verified on disk" line.

## Cross-references

`e.timeline` (full skill: mechanics + import/pickup leg) · `e.export` (renders + auto-publishes) ·
`/r.creative` (turn-in pings this skill when timelines aren't published).
