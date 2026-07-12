# Audio QC — empirical baseline + common scenarios

## Empirical baseline (2026-05-26 Car Repo scan)

- *Phase 1 only* (cut_off heuristic disabled): 276/325 OK (85%), 49 clipped (15%) — concentrated on **Steve cinemagraph intros + closes** (L02 "Tonight, this viral video..." = 20 clips, L23 "Wow, just incredible..." = 26 clips). Rachel-narrated lines (L11/L14/L03) are essentially clean (1 each).
- *Phase 2 spot-test* on 55 L14 clips (Car Repo B2-B6): **0 dialogue mismatches**. 100% full-match on 49 clips, >95% on 4, 77-90% on 4 (the dip is Whisper mistranscribing dollar amounts like "fifteen hundred" as "1500" — not missing words). Whisper confirms intact dialogue when audio physics alone can't.
- Runtime per phase on M-series Mac: ~90s ffmpeg parallel + ~2 min Whisper sequential ≈ 3-4 min total for a 350-clip batch.

The Steve-clipping pattern is a known PFM-specific issue — his hot opens and emphatic closes peak at 0 dBFS. See the Recovery patterns table in SKILL.md.

## Common scenarios

### Scenario 1 — Editor accepts post-download offer

`hvg-flow` surfaced the QC offer after downloads. Editor said `yes`. Run the scanner with the project's Veo folder as the root, default workers, no exclusions. Surface findings + report path.

### Scenario 2 — Batch is still in flight

Editor wants to QC the completed batches but Batch 6 is still firing in another session. Use `--exclude "Batch 6"` to skip in-progress mp4s (would otherwise spam errors as ffmpeg can't read incomplete files).

### Scenario 3 — Single batch / state spot-check

Editor wants to spot-check just the Florida fills:

```bash
python3 ~/.claude/skills/audio-qc/audio_qc_scan.py "<project>/Elements/Footage/Veo/FL" --workers 12
```

The scanner walks recursively from whatever root you point at.

### Scenario 4 — Re-scan after re-fires

After re-firing some failed clips as v03/v04, re-run the scanner. The latest scan supersedes the old report (filename has the date). Add `--out` if you want to keep both reports side-by-side.
