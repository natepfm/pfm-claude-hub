---
name: audio-qc
description: PFM's audio quality check skill for Veo-generated mp4 clips. ffmpeg-based parallel scanner that flags silent / low_volume / clipped / no_audio clips in ~90s for ~350 clips and writes a markdown report into the Veo folder. Use this skill whenever an editor asks to "QC the clips", "check the audio", "run audio QC", "verify the clips", or after a Veo batch completes downloading and the editor wants to spot-check before importing to DaVinci. Auto-offered by `hvg-flow` and `higgsfield-veo-batch` as a post-download step. NOT for: pre-Veo prompt validation (use `veo-script-writing`), image QC, or DaVinci timeline-level QC.
---

# Audio QC — PFM

Fast audio quality check for Veo-generated mp4 clips. Catches silent / clipped / no-audio clips before they hit DaVinci. ffmpeg-based, no external Python deps, ~90s for 350 clips.

## When to invoke

This skill triggers on:
- Editor says "QC the clips", "check audio quality", "run audio QC", "verify the videos", "spot-check the clips"
- Editor accepts the post-download QC offer surfaced by `hvg-flow` Step 11 or `higgsfield-veo-batch` Step 6
- Editor wants to re-scan after re-firing failed clips
- Editor wants to scan a sub-folder (single batch, single state)

Don't invoke for:
- Pre-Veo prompt validation — use `veo-script-writing` for script-level fixes
- Image QC — different tool surface (no audio to check on .png files)
- DaVinci timeline-level QC (sync drift, color, etc.) — different domain

## What it checks

ffmpeg + silencedetect, parallelized 12 workers default. Per clip, 3 active checks run in one ffmpeg pass:

1. Audio stream present?
2. mean_volume above silent threshold?
3. max_volume below clipping threshold?

(The scanner also measures tail silence in the last 0.5s — left in the report for visibility — but does NOT flag on it. See "What's NOT in this skill" for the rationale.)

**Flag values:**
| Flag | Means | Typical cause |
|---|---|---|
| `OK` | Passed all checks | — |
| `silent` | mean_volume < -55 dB | Veo 3.1 Lite without `--generate_audio true` |
| `low_volume` | mean_volume between -55 and -35 dB | Quiet performance or muffled audio |
| `clipped` | max_volume > -0.5 dB | Distortion / harsh peaks (digital 0 dBFS clipping) |
| `no_audio` | No audio stream | Veo Lite shipped silent (common — known issue) |
| `error` | ffmpeg failed | Corrupt file or codec issue |

**Empirical baseline (2026-05-26 Car Repo scan, cut_off heuristic disabled):**
- 276/325 OK (85%)
- 49 clipped (15%) — concentrated on **Steve cinemagraph intros + closes** (L02 "Tonight, this viral video..." = 20 clips, L23 "Wow, just incredible..." = 26 clips). Rachel-narrated lines (L11/L14/L03) are essentially clean (1 each).
- 0 silent / no_audio in this scan (all clips generated with audio)

The Steve-clipping pattern is a known PFM-specific issue — his hot opens and emphatic closes peak at 0 dBFS. See Recovery patterns below.

## Full SOP

### Command

```bash
python3 ~/.claude/skills/audio-qc/audio_qc_scan.py "<project>/Elements/Footage/Veo" --workers 12
```

The report writes to `<veo_root>/audio_qc_report_<YYYY-MM-DD>.md` by default. Override with `--out /path/to/report.md`.

### Common flags

| Flag | When to use |
|---|---|
| `--workers 12` | Default. Lower to 4-8 if the machine is busy. |
| `--exclude "Batch 6"` | Skip in-flight batches. Repeatable — pass once per pattern. |
| `--exclude "_v03"` | Skip re-fires while scanning originals. |
| `--out <path>` | Custom report destination. |

### Reading the report

The report has three sections:

1. **Summary** — flag counts at a glance.
2. **Flagged clips** — only the non-OK clips, with batch/state/clip + measurements + flag. **This is the actionable part.**
3. **All clips** (collapsed) — full table for spot-check or audit.

### What to surface to Sam

Don't dump the entire report. Surface:
- Flag counts (1-liner)
- Top concentrations (e.g. "L23 has 26/26 clipped — Steve's emphatic close hits 0 dBFS — normalize on import")
- Per-batch hotspots (e.g. "Batch 3 has 8/14 clipped — same pattern across states")
- A pointer to the full report path

Example:

> Audio QC complete on 325 clips. **276 OK, 49 clipped.**
> Hotspots:
> - **L02** (Steve "Tonight, this viral video..."): 20 clipped — hot-open peaks at 0 dBFS, content fingerprint
> - **L23** (Steve "Wow, just incredible..."): 26 clipped — emphatic close, same pattern
> - **L11 / L14 / L03** (Rachel): 1 clipped each — essentially clean
>
> Recovery: one-pass loudness normalization in DaVinci on import (-3 dB peak ceiling) fixes all 49 in a single step. Re-firing rarely helps — the prompt is already as soft-delivery as it can be.
>
> Full report: `Elements/Footage/Veo/audio_qc_report_2026-05-26.md`

## Recovery patterns by flag

| Flag | Likely cause | Recovery |
|---|---|---|
| `silent` / `no_audio` | Veo Lite without `--generate_audio true` | Re-fire with `--generate_audio true` (12 cr/clip) or escalate to Veo 3.1 Fast (~27 cr/clip, audio default). See `feedback_veo_audio.md` |
| `clipped` (isolated, 1-3 per line) | Random distortion on one take | Re-fire as v03 |
| `clipped` (concentrated on hot-open / emphatic-close lines, e.g. Steve "Tonight!"/"Wow!") | Veo audio renderer pushes first-word emphasis to 0 dBFS — content fingerprint, not random | **Best path: normalize in DaVinci on import** — one-pass loudness pass at -3 dB peak ceiling fixes all flagged clips at once. Re-firing rarely helps because the prompt is already as soft-delivery as it can be. Accepting brief peaks at 0 dBFS is also valid — clipping artifacts at that brevity often aren't audible |
| `low_volume` | Quiet take | Spot-check — may be fine; only re-fire if muddy in context |
| `error` | Corrupt download | Re-download from the result JSON |

## Common scenarios

### Scenario 1 — Editor accepts post-download offer

`hvg-flow` or `higgsfield-veo-batch` surfaced the QC offer after downloads. Editor said `yes`. Run the scanner with the project's Veo folder as the root, default workers, no exclusions. Surface findings + report path.

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

## Edge cases

- **ffmpeg not found** — the script self-resolves via `$PFM_FFMPEG` env → `~/bin/ffmpeg` → `which ffmpeg`. If none found, prints an install hint and exits 2. Run `claude-pfm-setup.sh` to install.
- **Permission prompt** — on first run, Claude Code may prompt for the python3 + audio_qc_scan.py command. Approve once; the Lucid Link `settings.json` allowlist (`Bash(python3 *audio-qc/audio_qc_scan.py *)`) covers subsequent runs.
- **mp4 files outside the Veo folder** — the scanner only walks the path you point at. If reference videos or other mp4s live elsewhere, they're not scanned.
- **Empty veo folder** — exits 0 with "Found 0 mp4 files" log. Not an error.
- **Custom output path conflicts** — use `--out` for non-default report locations. Otherwise reports always land inside `<veo_root>/audio_qc_report_<date>.md`.

## Cross-references

- **`hvg-flow`** — invokes this skill via the post-download offer in Step 11
- **`higgsfield-veo-batch`** — same post-download offer pattern in Step 6
- **`feedback_veo_audio.md`** — Lite silent-take risk (the "no_audio" pattern)
- **`feedback_verify_veo_download_count.md`** — file-count reconciliation that runs alongside QC
- **`feedback_veo_no_short_punchy_beats.md`** — the line-length rules (relevant for the disabled cut_off check; if cut_off is ever re-enabled, this is the upstream fix for "line too long for 8s")
- **`feedback_higgsfield_workflow.md`** — Higgsfield CLI is the firing tool; QC happens after files land on disk
- **`audio_qc_scan.py`** (sibling) — the actual scanner script

## What's NOT in this skill

- Pre-Veo prompt validation (use `veo-script-writing`)
- Image QC (no audio to check)
- Veo cost estimation / preflight (handled by `hvg-flow` Step 9)
- Re-firing failed clips (Claude does that outside this skill, using the recovery patterns above)
- DaVinci timeline-level audio checks (different domain — would need a separate skill)
- Dialogue-content verification — was tested with OpenAI Whisper transcription, decided the fast pass covers PFM's real failure modes and the Whisper pass was overkill for our use case. Not part of the skill.
- **Cut-off detection (disabled 2026-05-26).** Originally flagged clips with `<50ms silence in the last 0.5s` as "cut mid-word." Disabled after the Car Repo Breaking News scan flagged 150+ false positives: Rachel's continuous narration + breath + ambient fills the full 8s window without leaving any tail silence, but the dialogue is intact. silencedetect can't tell "audio actually cut mid-word" apart from "audio cleanly fills the 8s window with no quiet tail" for PFM's news-read content. Scanner still computes tail-silence-seconds and includes the value in the report for visibility, but the flag is never set. Re-enable only if we find a better signal (e.g., amplitude envelope analysis on the last ~100ms vs the rest of the clip).
