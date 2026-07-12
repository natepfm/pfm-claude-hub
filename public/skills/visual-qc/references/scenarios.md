# Visual QC — common scenarios + batching strategy

## Batching strategy for large batches (>50 clips)

Process 10-15 clips at a time, summarize, then move to the next batch. For batches >100 clips, consider spawning a subagent per state with the relevant filmstrip subset.

## Common scenarios

### Scenario 1 — Editor accepts post-download offer (chained from hvg-flow)

`hvg-flow` Step 11 surfaced the visual QC offer after audio QC. Editor said `yes L02, L17, L19` (or just `yes` for no caption focus). The Veo folder is already known (project root + `/Elements/Footage/Veo`), the caption L-numbers came in the editor's reply. Skip the standalone-invocation ask flow — fire the scanner with the params from the chained context.

### Scenario 2 — Editor invokes cold ("run visual QC")

Editor types "run visual QC" / "filmstrip QC" / "verify the visuals" with no prior gated-flow context. Apply the Standalone invocation flow in SKILL.md — confirm folder + caption L-numbers, then fire.

### Scenario 3 — Single state / batch spot-check

Editor wants to re-scan just the Florida fills (or a single batch subfolder) after re-firing some clips:

```bash
python3 ~/.claude/skills/visual-qc/visual_qc_scan.py "<project>/Elements/Footage/Veo/FL" \
  --caption-clips L02,L17,L19 --workers 8
```

The scanner walks recursively from whatever root you point at. The `qc/` output lands inside that root (e.g. `Elements/Footage/Veo/FL/qc/`).

### Scenario 4 — Re-scan after regens

After regens land (overwriting the bad take per the pre-delivery regen rule), re-run the scanner on the full folder OR just the affected state subfolder. New filmstrips overwrite the old ones for the same scan date. Add `--out` if you want both reports side-by-side.

### Scenario 5 — Editor is unsure if visual QC is worth it

Podcast-style project (one shared ref + one speaker, no slide refs): tell the editor visual QC rarely catches anything in that shape — the speaker IS the content, nothing else to morph. They can skip it and rely on audio QC alone. VSL-style projects with per-line slide refs: definitely worth running.
