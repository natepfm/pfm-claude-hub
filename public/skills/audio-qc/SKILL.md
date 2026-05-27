---
name: audio-qc
description: PFM's audio quality check skill for Veo-generated mp4 clips. Three-phase scanner — Phase 1 is ffmpeg audio-physics checks (silent / low_volume / clipped / no_audio in ~90s for ~350 clips), Phase 2 is OpenAI Whisper dialogue verification when the project's Excel manifest is passed (transcribes each clip and fuzzy-matches against expected dialogue, flagging dialogue_mismatch on low-similarity clips in ~2 min for ~350 clips on M-series Mac), Phase 3 is unexpected-music detection (piggybacks on Phase 1's silence intervals + Phase 2's Whisper speech segments to flag non-speech audio energy — musical stings, musical beds, musical tails that Veo sometimes adds despite prompt-level negatives, runs in zero additional ffmpeg passes). Use this skill whenever an editor asks to "QC the clips", "check the audio", "run audio QC", "verify the clips", or after a Veo batch completes downloading and the editor wants to spot-check before importing to DaVinci. Auto-offered by `hvg-flow` as a post-download step. NOT for: pre-Veo prompt validation (use `veo-script-writing`), image QC, or DaVinci timeline-level QC.
---

# Audio QC — PFM

Two-phase quality check for Veo-generated mp4 clips. Catches silent / clipped / no-audio (audio physics) AND wrong-words / voice drift (Whisper transcription) before clips hit DaVinci. Total wall clock ~3-4 min for a typical 350-clip batch on M-series Mac.

## When to invoke

This skill triggers on:
- Editor says "QC the clips", "check audio quality", "run audio QC", "verify the videos", "spot-check the clips"
- Editor accepts the post-download QC offer surfaced by `hvg-flow` Step 11
- Editor wants to re-scan after re-firing failed clips
- Editor wants to scan a sub-folder (single batch, single state)

Don't invoke for:
- Pre-Veo prompt validation — use `veo-script-writing` for script-level fixes
- Image QC — different tool surface (no audio to check on .png files)
- DaVinci timeline-level QC (sync drift, color, etc.) — different domain

## What it checks

### Phase 1 — ffmpeg audio-physics (parallel, ~90s per ~350 clips)

ffmpeg + silencedetect, parallelized 12 workers default. Per clip, 3 active checks run in one ffmpeg pass:

1. Audio stream present?
2. mean_volume above silent threshold?
3. max_volume below clipping threshold?

(The scanner also measures tail silence in the last 0.5s — left in the report for visibility — but does NOT flag on it. See "What's NOT in this skill" for the rationale.)

### Phase 2 — Whisper dialogue verification (sequential, ~2 min per ~350 clips on M-series)

When the project's Excel manifest is passed via `--manifest <slug>_prompts.xlsx`:

1. Load OpenAI Whisper `base` model (one-time, ~5s)
2. For each clip whose audio-physics flag is OK (skip silent / no_audio / error):
   - Transcribe via Whisper (M-series: ~0.3s per 8s clip)
   - Look up expected dialogue from manifest's `dialogue` column (matched by slug)
   - Normalize both (strip `[PLACEHOLDER]` tokens, lowercase, strip punctuation)
   - Compute SequenceMatcher similarity ratio
   - If similarity < threshold (default 0.70) → escalate flag to `dialogue_mismatch`
3. Report includes per-clip transcript + expected dialogue for any mismatches

### Phase 3 — Unexpected music / non-speech audio (piggybacks on Phases 1 + 2, ~0s extra)

Runs whenever Phase 2 runs (no extra flag needed). Uses the silence intervals Phase 1 already parsed + the speech segments Phase 2 already got from Whisper. Zero additional ffmpeg passes.

Logic per clip:
1. Compute non-silent regions (invert Phase 1's silence intervals across the clip duration)
2. Subtract Whisper's speech segments — what's left is non-speech non-silent audio
3. Filter regions shorter than 0.30s (drops breath / Whisper word-gap noise)
4. Flag `unexpected_music` if any single region > 0.40s OR cumulative > 0.60s
5. Escalation rule: only escalates a clip from `OK` → `unexpected_music`. If the clip already has `dialogue_mismatch` / `clipped` / `low_volume`, those stay as the primary flag and the music regions show up in the dedicated report section anyway (via the `has_unexpected_music` field).

**What this catches:**
- Cold-open musical stings (Veo's known tendency to add musical intros to dialogue clips — see `feedback_veo_audio_artifacts.md` for the prompt-level prevention rules)
- Musical tails after dialogue ends
- Musical beds with gaps where dialogue should fill (Whisper transcribes the dialogue cleanly, but audio energy persists in the gaps)
- Any non-speech audio in a clip that's supposed to be dialogue-only

**Caveat:** if Whisper missed any spoken words (silent voice, muffled audio, unusual accent), they'd appear as false-positive music regions. The 0.30s minimum-region filter mitigates short bursts; longer false positives need a spot-check. Bias is to over-flag rather than under-flag.

**Flag values (combined):**
| Flag | Means | Typical cause |
|---|---|---|
| `OK` | Passed all checks | — |
| `silent` | mean_volume < -55 dB | Veo 3.1 Lite without `--generate_audio true` |
| `low_volume` | mean_volume between -55 and -35 dB | Quiet performance or muffled audio |
| `clipped` | max_volume > -0.5 dB | Distortion / harsh peaks (digital 0 dBFS clipping) |
| `no_audio` | No audio stream | Veo Lite shipped silent (common — known issue) |
| `dialogue_mismatch` | Transcript similarity < threshold | Wrong words, mid-syllable cut, voice drift, or Whisper mistranscription of dollar amounts / numbers |
| `unexpected_music` | Non-speech audio detected (Phase 3) — single region > 0.40s OR cumulative > 0.60s of audio energy that Whisper didn't transcribe as speech | Cold-open musical sting, musical tail, musical bed, or other non-dialogue audio. Veo cold-open stings are the most common cause despite the prompt-level negatives in `feedback_veo_audio_artifacts.md` |
| `error` | ffmpeg or Whisper failed | Corrupt file, codec issue, or model exception |

**Empirical baseline (2026-05-26 Car Repo scan):**
- *Phase 1 only* (cut_off heuristic disabled): 276/325 OK (85%), 49 clipped (15%) — concentrated on **Steve cinemagraph intros + closes** (L02 "Tonight, this viral video..." = 20 clips, L23 "Wow, just incredible..." = 26 clips). Rachel-narrated lines (L11/L14/L03) are essentially clean (1 each).
- *Phase 2 spot-test* on 55 L14 clips (Car Repo B2-B6): **0 dialogue mismatches**. 100% full-match on 49 clips, >95% on 4, 77-90% on 4 (the dip is Whisper mistranscribing dollar amounts like "fifteen hundred" as "1500" — not missing words). Whisper confirms intact dialogue when audio physics alone can't.
- Runtime per phase on M-series Mac: ~90s ffmpeg parallel + ~2 min Whisper sequential ≈ 3-4 min total for a 350-clip batch.

The Steve-clipping pattern is a known PFM-specific issue — his hot opens and emphatic closes peak at 0 dBFS. See Recovery patterns below.

## Full SOP

### Command (Phase 1 + Phase 2 — the default for any post-batch QC)

```bash
python3 ~/.claude/skills/audio-qc/audio_qc_scan.py \
  "<project>/Elements/Footage/Veo" \
  --manifest "<project>/Elements/Footage/Veo/<slug>_prompts.xlsx" \
  --workers 12
```

Passing `--manifest` activates Phase 2 (Whisper) automatically. The manifest is the same Excel file `hvg-flow` writes at gate 8 / step 11.

### Command (Phase 1 only — when no manifest exists or Whisper isn't installed)

```bash
python3 ~/.claude/skills/audio-qc/audio_qc_scan.py "<project>/Elements/Footage/Veo" --workers 12
```

Omit `--manifest` and only the audio-physics phase runs. Useful for HVG.1 legacy projects without an Excel manifest, or quick spot-checks where dialogue verification isn't needed.

The report writes to `<veo_root>/audio_qc_report_<YYYY-MM-DD>.md` by default. Override with `--out /path/to/report.md`.

### Common flags

| Flag | When to use |
|---|---|
| `--manifest <path>` | Enables Phase 2 (Whisper). Path to project's `<slug>_prompts.xlsx`. |
| `--workers 12` | Default ffmpeg parallelism. Lower to 4-8 if the machine is busy. |
| `--exclude "Batch 6"` | Skip in-flight batches. Repeatable — pass once per pattern. |
| `--exclude "_v03"` | Skip re-fires while scanning originals. |
| `--out <path>` | Custom report destination. |
| `--whisper-model small` | Bigger model for higher accuracy (default `base`). `tiny` for speed, `small`/`medium`/`large` for accuracy. |
| `--no-whisper` | Skip Phase 2 even when `--manifest` is passed. |
| `--dialogue-threshold 0.65` | Lower the similarity threshold for `dialogue_mismatch` (default 0.70). |

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
| `dialogue_mismatch` (isolated, transcript reads close to expected but with a wrong word) | Real wrong-word event — Veo synthesized a different word than the prompt asked for | Spot-check the transcript section of the report; if it really is a wrong-word case, re-fire as v03 |
| `dialogue_mismatch` (similarity 0.7-0.9, transcript matches but for number/dollar-amount rendering) | Whisper mistranscription of digits — "fifteen hundred" heard as "1500" | Usually a false positive — verify by listening and accept the take. Consider lowering `--dialogue-threshold` for this project if it's frequent |
| `dialogue_mismatch` (concentrated on one L#) | Either Veo consistently drops a phrase from that line, or the manifest's expected dialogue is out of sync with what was actually fired | Check the manifest vs the script; if script was edited mid-batch, manifest may be stale. Re-fire affected clips only if dialogue is genuinely missing words |
| `unexpected_music` (single region at clip start, ~0.5-1.5s) | Cold-open musical sting — Veo's known tendency despite prompt negatives | Re-fire as v03 with the strengthened audio-block negatives from `feedback_veo_audio_artifacts.md`. If persistent across multiple takes of the same line, the prompt needs tightening at the script level |
| `unexpected_music` (single region at clip end, last ~0.5-1.0s) | Musical tail after dialogue ends | Same recovery as cold-open sting — re-fire with strengthened negatives. Often pairs with `clipped` on the same clip when the tail peaks |
| `unexpected_music` (multiple small regions throughout) | Possible musical bed under the dialogue, OR Whisper missed words (false positive) | Spot-check the actual clip — is there music under the dialogue, or did Whisper just stumble on a name / number / accent? If real music, re-fire; if Whisper miss, accept the take |
| `error` | Corrupt download or Whisper exception | Re-download from the result JSON; if Whisper itself errored, re-run the scanner |

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

## Edge cases

- **ffmpeg not found** — the script self-resolves via `$PFM_FFMPEG` env → `~/bin/ffmpeg` → `which ffmpeg`. If none found, prints an install hint and exits 2. Run `claude-pfm-setup.sh` to install.
- **Permission prompt** — on first run, Claude Code may prompt for the python3 + audio_qc_scan.py command. Approve once; the Lucid Link `settings.json` allowlist (`Bash(python3 *audio-qc/audio_qc_scan.py *)`) covers subsequent runs.
- **mp4 files outside the Veo folder** — the scanner only walks the path you point at. If reference videos or other mp4s live elsewhere, they're not scanned.
- **Empty veo folder** — exits 0 with "Found 0 mp4 files" log. Not an error.
- **Custom output path conflicts** — use `--out` for non-default report locations. Otherwise reports always land inside `<veo_root>/audio_qc_report_<date>.md`.

## Cross-references

- **`hvg-flow`** — invokes this skill via the post-download offer in Step 11
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
- **Cut-off detection (disabled 2026-05-26).** Originally flagged clips with `<50ms silence in the last 0.5s` as "cut mid-word." Disabled after the Car Repo Breaking News scan flagged 150+ false positives: Rachel's continuous narration + breath + ambient fills the full 8s window without leaving any tail silence, but the dialogue is intact. silencedetect can't tell "audio actually cut mid-word" apart from "audio cleanly fills the 8s window with no quiet tail" for PFM's news-read content. Scanner still computes tail-silence-seconds and includes the value in the report for visibility, but the flag is never set. **Phase 2 Whisper now catches the real "audio cut mid-word" cases** — if a clip is actually missing trailing words, the transcript won't include them and similarity drops below threshold, escalating to `dialogue_mismatch`. That replaces what cut_off was supposed to do.
