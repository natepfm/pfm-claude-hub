# Changelog

Recent changes to PFM Claude skills, scripts, and tooling. Newest first.

When something here changes that affects what editors run on their machines, run the **Update my skills** command from the [Home page](/) to sync.

---

## 2026-05-26

### `audio-qc` Phase 3 — unexpected music / non-speech audio detection

Audio QC now catches non-speech audio energy (musical stings, musical tails, musical beds) that Veo sometimes adds despite the prompt-level negatives in `feedback_veo_audio_artifacts.md`. Previously these slipped through — `dialogue_mismatch` only fired if the music corrupted the dialogue enough to drop similarity. Clean dialogue + music bleed went undetected.

**How it works (zero-cost piggyback):**
- Phase 1 already parses silence intervals via ffmpeg's `silencedetect` filter
- Phase 2 already gets per-segment speech timestamps from Whisper's transcribe output
- Phase 3 just does interval math — invert silence → non-silent regions, subtract speech segments → non-speech audio regions
- Filter regions < 0.30s (drops breath / word-gap noise)
- Flag `unexpected_music` if any single region > 0.40s OR cumulative > 0.60s

No additional ffmpeg passes. No new model downloads. Runtime cost is essentially zero — adds to the same Phase 2 loop.

**What it catches:**
- Cold-open musical stings (~0.5-1.5s at clip start before dialogue)
- Musical tails after dialogue ends
- Musical beds with detectable speech gaps
- Any non-speech audio in a dialogue-expected clip

**Escalation rule:** only escalates `OK` → `unexpected_music`. Doesn't override `dialogue_mismatch` / `clipped` / `low_volume` as primary flag — those stay primary and music regions still show up in a dedicated report section via the `has_unexpected_music` field.

**Caveat:** if Whisper missed any spoken words (silent voice, muffled audio, unusual accent), they'd appear as false-positive music. The 0.30s minimum-region filter handles short bursts; longer false positives need a spot-check. Bias is to over-flag.

**Report changes:** new "Unexpected music / non-speech audio" section in `audio_qc_report_<date>.md` listing affected clips + per-clip music region timestamps. Recovery patterns added to the audio-qc skill body for cold-open sting / musical tail / musical bed.

Auto-runs whenever Phase 2 runs (i.e. whenever `--manifest` is passed). Re-run `bash claude-pfm-update.sh` to pick it up.

### `visual-qc` skill — per-clip filmstrip pass for VSL slide defects

New sibling skill to `audio-qc`. Catches what you can SEE that audio can't — background morphs, slide text garble, hallucinated overlays (the canonical L19 "Jake" label defect), hard cuts. Built primarily for VSL-style projects with per-line slide references where the LED screen and on-screen text MUST stay frozen across the 8s clip.

**What the scanner does:**
- Extracts 5 stills per clip at fixed timestamps (0s / 2s / 4s / 6s / 7.8s)
- Scales each to ~480px wide and hstacks into a single filmstrip PNG per clip — `<veo_root>/qc/strip_<slug>.png` (per-state subfolders for state-routed batches)
- For caption-slide clips (rate text / name labels / ZIP codes / dollar amounts), additionally pulls 4s / 6s / 7.8s at FULL native resolution to `<veo_root>/qc/caption/<slug>_<t>s.png` — the 480px filmstrip is too small to spot subtle text defects
- Writes a JSON index of all artifacts

**What Claude does:**
- Walks the index, Reads each filmstrip
- Applies pass/fail criteria per clip: ✓ (clean) / ✗ (defect with reason + timestamp) / 🔍 VERIFY (ambiguous — editor's eyes make the call)
- Reads full-res end frames for caption-slide clips
- Writes a markdown report alongside the audio QC report

**The "don't rationalize" rule:** if something ambiguous shows up — faint floating text, edge artifact, partial occlusion — flag it as 🔍 VERIFY, don't talk yourself into "probably a reflection." The L19 "Jake" hallucinated label defect was missed once for exactly that reason. The bias is to over-flag, not under-flag.

**Regen workflow:** pre-delivery defects regen on Veo 3.1 Lite + audio on at count=1, **overwriting the bad take** (explicit exception to `feedback_regen_no_overwrite.md` — the bad clip never entered any timeline). 2-retry cap; after that, surface to editor for Fast escalation decision.

**Integration:** `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now offer visual QC as a second pass after audio QC (sequential offers). Editor can skip it (default for podcast-style work where there's nothing to morph) or opt in with `yes` / `yes L02,L17,L19` (with caption-slide L-numbers).

**Editor command:**
```
python3 ~/.claude/skills/visual-qc/visual_qc_scan.py "<project>/Elements/Footage/Veo" \
  --caption-clips L02,L17,L19,L20,L27,L28 \
  --workers 8
```

Skill files: `~/.claude/skills/visual-qc/SKILL.md` + `visual_qc_scan.py`. Memory entry: `feedback_visual_qc_workflow.md`. Re-run `bash claude-pfm-update.sh` to pick it up. **Sam, also add `Bash(python3 *visual-qc/visual_qc_scan.py *)` to the Lucid Link `settings.json` allowlist next to the audio-qc entry** so first-run permission prompt is skipped.

### Default fire shape — count=1 per prompt (was count=2)

**`count=1` is the new locked default** for all PFM Higgsfield video fires (`hvg-flow`, `higgsfield-veo-batch`, ad-hoc CLI). Previously count=2 was the default to give A/B picks per line — refire-on-QC-fail is the new safety net instead (paired with the partial-return discipline + audio QC Phase 2 dialogue verification, both below).

**The math:**
- Old default (Lite audio × count=2): 24 cr/line
- New default (Lite audio × count=1): 12 cr/line
- ~50% cost cut on dialogue batches
- ~50% cost cut on silent b-roll (16 cr/line → 8 cr/line)

**Editor opt-in to count=2** when audio variance matters or a line is high-stakes — surface at Gate 5 of `hvg-flow`. Per-line ("L01 and L17 at count=2, rest count=1") or per-batch ("fire everything at count=2") both work.

**Why this works:**
- count=1 + audio QC + refire-on-flag covers most lines first try
- The ~10-20% that fail QC get refired as v02 — same effective cost as the old count=2 default
- Editor saves credits AND manifest stays cleaner
- `Partial` status is now rare — only meaningful on opt-in count≥2 lines

Files updated: `hvg-flow` SKILL.md (Gate 5 default block + cost ladder + Gate 7 L1 test + Step 8 config example + Step 11 status legend + Step 11 final-report buckets), `higgsfield-veo-batch` SKILL.md (preflight + speed budget + Step 6 sections), `build_xlsx.py` (config-schema default `countPerPrompt: 1`). Re-run `bash claude-pfm-update.sh` to pick it up.

### Partial-return discipline — QC the survivor before any refire

When a Veo batch comes back with a `Partial` row (one variation made it, one didn't — usually NSFW filter), the surviving variation is often perfectly usable on its own. `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now make this explicit:

- **Partial + survivor passes audio QC** → final report recommends "accept as-is", no refire prompt
- **Partial + survivor flagged by QC** → final report recommends "refire", surfaces the flag
- **Total fail (0 of 2)** → automatic refire candidate (nothing to QC)

Reflexive refires on Partial rows burn ~12-27 cr per row AND clutter the manifest with a v3 entry for a row whose v01 was already fine. The QC offer landing before the final report already creates the right *ordering*, but the rule wasn't *stated* — an editor scanning the manifest could refire on instinct without checking the survivor.

If QC is declined, partials get bucketed as "needs editor review" — the rule can't be applied without QC signal. Memory entry: `feedback_partial_returns_qc_before_refire.md`. Re-run `claude-pfm-update.sh` to pick it up.

### `audio-qc` Phase 2 — Whisper dialogue verification folded back in
After an M-series speed test showed Whisper transcribes 8s clips in ~0.3s (vs the 10-15s/clip the original handoff doc estimated), we folded the Whisper pass back into the audio-qc scanner as a default phase whenever a project's Excel manifest is available.

**What the scanner now does:**
- *Phase 1 — ffmpeg audio-physics* (parallel, ~90s per ~350 clips): silent / low_volume / clipped / no_audio flags (unchanged)
- *Phase 2 — Whisper dialogue verification* (sequential, ~2 min per ~350 clips on M-series): transcribes each clip, fuzzy-matches transcript against the manifest's `dialogue` column, flags `dialogue_mismatch` on similarity below threshold (default 0.70)

Phase 2 catches the **real "audio cut mid-word" cases** that the disabled cut_off heuristic was supposed to but couldn't — if a clip is actually missing trailing words, the transcript won't include them and similarity drops below threshold. Spot-test on 55 L14 clips: 0 dialogue mismatches, 100% match on 49 / >95% on 4 / 77-90% on 4 (the dip is Whisper mistranscribing dollar amounts like "fifteen hundred" as "1500" — not missing words).

**Phase 2 is opt-in via `--manifest`** — `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 pass the project's Excel manifest automatically when offering the QC pass. Without a manifest, Phase 1 still runs. Total runtime for a typical 350-clip batch with both phases: ~3-4 min.

### Whisper added to the Mac installer
`claude-pfm-setup.sh` step 6 installs OpenAI Whisper via pip3 (user install + symlink to `~/bin/whisper`). PyTorch deps make this a ~3-5 min step on a fresh Mac; install is wrapped in try/continue so failures don't abort the rest of the installer (Phase 1 of audio-qc still works without Whisper).

Re-run `claude-pfm-setup.sh` on already-set-up machines to pick up Whisper. Idempotent — skips what's already installed.

### Canva connector — lower thirds graphics on demand
The **Canva** connector is now part of the standard editor onboarding (Setup step 3). PFM uses a **single shared Canva account** — Sam will share the credentials separately, not via the hub.

**What it unlocks:** when you're in a breaking-news project and the script has chyron specs (`BREAKING NEWS`, `JESSICA MARSH / MOTHER OF THREE`, `LIVE — WEST ELMWOOD`, etc.), you can now ask Claude to "build the lower thirds" and it'll generate the actual graphics directly in the shared Canva account using the PFM LATU News brand kit — then drop PNGs into `Elements/Footage/Primary/Lower Thirds/`. No more manually rebuilding chyrons in Canva from a script-side spec.

`breaking-news-story-ads` skill body updated with the full workflow + the LATU News brand style spec.

### `audio-qc` cut_off heuristic disabled — false-positive on PFM news-read content
After spot-checking ~150 cut_off-flagged clips from the Car Repo Breaking News scan, every one ended cleanly — the heuristic was a false-alarm machine. Rachel's continuous narration + breath + ambient fills the full 8s window above -35 dB without leaving any tail silence, but the dialogue is intact. The silencedetect-based check couldn't tell "audio actually cut mid-word" apart from "audio cleanly fills the 8s window with no quiet tail."

**Scanner patched** (`audio_qc_scan.py`) — cut_off branch in the flag-decision logic is commented out with full rationale. The scanner still computes tail-silence-seconds and includes it in the report for visibility, but the flag is never set. Skill body updated to reflect the new flag set: `silent / low_volume / clipped / no_audio / error`.

**New empirical baseline (Car Repo scan, 325 clips):** 276 OK (85%), 49 clipped (15%). Clipped concentrates on Steve cinemagraph intros + closes ("Tonight!" + "Wow, just incredible!") peaking at 0 dBFS — a content fingerprint, not random distortion. Recovery for that pattern is **normalize-on-import in DaVinci** rather than re-firing, since the prompt is already as soft-delivery as it can be. Re-enable cut_off detection only when there's a better signal (e.g., amplitude envelope analysis on the last ~100ms vs the rest of the clip).

### `max_workers` bumped 8 → 16 across all skills — 2× throughput on Enterprise
After the Higgsfield Enterprise migration on 2026-05-25, two empirical Enterprise tests landed:
- **2026-05-25, 100-worker test:** 50/100 jobs returned empty — race carries over from Team plan at high concurrency.
- **2026-05-26, 16-worker test (Car Repo B5 wave 1, 50 jobs):** race clean. The only misses were NSFW filter rejections (3 zero-take cells), not auth errors.

The credential-store race cliff sits somewhere between 16 and 100 workers — 16 is safe, 100 fails half the jobs. `max_workers` is now locked at **16** across `hvg-flow`, `hig-flow`, `higgsfield-veo-batch`, and `higgsfield-image-generation`. 

**What editors see:** Veo + NB Pro batches run ~2× faster than the prior 8-worker cap, with no measurable reliability cost. A 50-job wave that took ~12-15 min now lands in ~5-8 min. Re-run `claude-pfm-update.sh` to pick up the new skills.

---

## 2026-05-25

### New `audio-qc` skill — Veo audio fast-pass
After every Veo batch downloads, you can now run an automatic audio quality check on the clips before importing to DaVinci. ffmpeg-based parallel scanner, ~90s for ~350 clips. Flags `silent` / `low_volume` / `cut_off` / `clipped` / `no_audio` and writes a markdown report straight into the Veo folder.

Validated on Car Chase Breaking News B1-B5 — caught L12 (95% cut_off) and L03 (79% cut_off) as systemic script-line-too-long issues, not random takes. The flag table makes the "fix at the script level vs. re-fire individually" call obvious at a glance.

**Auto-offered, not auto-fired.** `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now ask plainly in chat after downloads complete:

> All N clips downloaded and the manifest is updated. Want me to run an audio QC pass? Flags silent / low_volume / cut_off / clipped / no_audio in ~90s.
>
> Reply `yes` to run it or `no` (or `skip`) to go straight to the final report.

The flow is gated like everything else — explicit opt-in. Initial design included an optional Whisper transcription pass for dialogue-content verification; we decided that level of QC was overkill for PFM's real failure modes (most issues show up clearly in ffmpeg flags) and stripped it out. The skill is fast-pass only.

### settings.json allowlist addition
- `Bash(python3 *audio-qc/audio_qc_scan.py *)` — no permission prompt on QC runs

Re-run `claude-pfm-update.sh` to pick up the new `audio-qc` skill, the updated `hvg-flow` + `higgsfield-veo-batch` skills, and the refreshed settings.json.

---

## 2026-05-22

### ffmpeg added to the Mac installer
`claude-pfm-setup.sh` now installs **ffmpeg** to `~/bin/ffmpeg` as part of the one-shot install. This is what Claude (and skills) use to read video file metadata — duration, dimensions, codec — without needing to open the file in a player. Static binary pulled from evermeet.cx (~80MB, idempotent — re-running the installer skips if `~/bin/ffmpeg` is already present).

On already-set-up editor machines: re-run `claude-pfm-setup.sh` to get ffmpeg. It'll skip everything that's already installed and just add the ffmpeg step. Or run the install snippet directly:

```bash
mkdir -p ~/bin && cd /tmp && \
  curl -L -o ffmpeg.zip "https://evermeet.cx/ffmpeg/getrelease/zip" && \
  unzip -o ffmpeg.zip -d ~/bin/ && \
  chmod +x ~/bin/ffmpeg && \
  ~/bin/ffmpeg -version
```

Windows equivalent pending — `evermeet.cx` is Mac-only. Windows editors should sit tight until the cross-platform path is added.

---

## 2026-05-21

### CLI is the default for ALL Higgsfield image and video gens — MCP is read-only inspection only
Hardened the CLI-vs-MCP rule across memory + every Higgsfield skill. The MCP `generate_image` / `generate_video` tools are now explicitly **forbidden** for actual firing. MCP stays in play only for read-only ops — `balance`, `transactions`, `models_explore`, `select_workspace`, `show_*`. This applies to every gen — one-off tests, character masters, re-fires, exploratory variations, everything. Previously this rule lived implicitly in `feedback_higgsfield_workflow.md`; now it's surfaced in the memory index, the `higgsfield-image-generation` skill (rewritten from MCP-driven to CLI-driven), and the convention banners on `higgsfield-veo-batch` + cross-references in `hvg-flow` / `hig-flow`.

The "MCP vs CLI" panel on the home page now reflects the new lock — MCP is described as inspection-only, not "one-off exploratory firing."

### Concurrency rewrite — UUIDs + Python ThreadPool `max_workers=16`
The previous bash-background-jobs concurrency pattern (`& + wait` with `--image <local_path>`) hit the Higgsfield CLI's credential-store race under load — concurrent CLI processes contend on the auth file while uploading per-job, and most jobs come back empty past ~10 in flight. New locked pattern (verified empirically on 100-job runs):

1. **Pre-upload** every unique reference image **serially**, capture UUIDs.
2. Fire the batch via **Python `ThreadPoolExecutor(max_workers=16)`**, passing UUIDs to `--image` / `--start-image` / `--end-image` (never local file paths).
3. Bash `&` past ~10 jobs is deprecated. Don't use.

Applied to `hvg-flow`, `hig-flow`, `higgsfield-veo-batch`, and `higgsfield-image-generation`. Cap will be revisited after Higgsfield Enterprise call — if Enterprise allows higher concurrency cleanly, workers can be raised.

### Veo cost table corrected — empirical 2026-05-20 numbers
Previous skills documented stale costs (Fast at 22 cr, Lite at "8 cr with audio"). New verified numbers across `hvg-flow` + `higgsfield-veo-batch`:

| Model | Cost / 8s clip | Audio |
|---|---|---|
| Lite — silent | 8 cr | ✗ |
| Lite — with `--generate_audio true` | 12 cr | ✓ |
| Fast | ~27 cr | ✓ (default) |
| Preview (base) | ~58 cr | ✓ |
| Preview (Ultra) — `--quality ultra` | ~87 cr | ✓ |

Two flags newly documented: **`--generate_audio true`** (Lite ships silent without it — known gotcha that caused silent shipping in past batches) and **`--quality basic\|high\|ultra`** (Preview Ultra is the top-tier quality knob).

### veo-script-writing — no camera device names rule
New Rule 3b: words like `iPhone`, `phone`, `GoPro`, `DSLR`, `dash cam`, `Ring camera` in the spoken dialogue or scene description make Veo render that physical device in frame. Device-aesthetic cues belong in the Veo prompt's visual block as indirect markers, not named in the script. Compliance scan + the breaking-news integration checklist both updated to call this out.

### breaking-news-story-ads — three flavors + default talent
Aligned the LL copy of `breaking-news-story-ads` to the most recent Cowork plugin source. Adds:

- **The three flavors** — Flavor A (news-wraps-existing-story-ad re-frame), Flavor B (news-wraps-LC-as-viral-podcast-clip), Flavor C (pure breaking news no source asset). Each with source/body description + reference creative.
- **Default talent** — Lauren Hayes (anchor) + Rachel Torres (field reporter) are the recurring PFM news-talent. Reuse by default; only propose new names if explicitly requested.
- **Workflow gating** — master template first, state/variant fills only after master is locked.
- Removed the stale "Frame-to-video JSON patterns" section. Per-clip Veo prompts now live in the project's Excel manifest built by `hvg-flow`, not embedded inside the script doc.

### PowerFox Enterprise plan — concurrency cap pending
Skills now say "PowerFox Enterprise plan" wherever they reference Higgsfield concurrency. Server-side cap is high enough on Enterprise that it's no longer the practical bottleneck — `max_workers=16` is the defensive default driven by the client-side CLI credential-store race observed on the old Team plan, and will be revisited after the first real Enterprise batch fire.

### Install command — no sudo
`higgsfield-veo-batch` and `hvg-flow` install hints both now use `npm install -g @higgsfield/cli` (no sudo) to match `claude-pfm-setup.sh`. Sudo isn't needed on properly-configured editor machines and triggers prompts for password.

---

## 2026-05-20

### Never re-ask for Notion URL or project folder mid-session
Hardened the handoff between `lc-to-video-podcast` and `hvg-flow` so editors aren't asked to "drop the Notion URL again" when the URL and project folder are already in session context. The chained handoff now flows: script-locked → editor says any HVG trigger → `hvg-flow` enters Gate 1 immediately with the already-known URL + cwd. No re-paste, no redundant prompting. Same fix applies to any in-session chain where the URL was established earlier (script review → fire, edits → fire, etc.).

### Veo word ceiling raised — 24 → 30
Veo line ceiling moved from 24 to 30 words across `veo-script-writing`, `lc-to-video-podcast`, and `higgsfield-veo-batch`. Target sweet spot stays **17-22 words** with the long-lean discipline intact — the extra room is reserved for beats that genuinely earn a longer landing (~9-10s at podcast pace). Closing line still gets the 12-15 word short-line exception.

Quick reference: floor 15 words / target 17-22 / hard ceiling 30 / closer 12-15.

### Hub — "How it works" overview section added
New visual overview on the home page (anchor: **How it works** in the sidebar). Five panels designed for sharing the system with non-editor stakeholders:

1. **Context layers** — how Claude is trained up on PFM (memory → skills → context folder → Notion brief)
2. **MCP vs CLI** — side-by-side comparison of the two ways Claude talks to Higgsfield, and why PFM uses the CLI for production
3. **Notion drop flow** — what happens when an editor drops a Notion URL or project folder reference
4. **The 9 gates** — visual stepper of every gate Claude walks with an editor, with one-line descriptions
5. **Team folder breakdown** — what's inside `6. Claude PFM/` on Lucid Link

This sits between the daily-use commands at the top and the per-OS setup walkthroughs below.

---

## 2026-05-18

### PFM conventions enforced on ALL Higgsfield fires (not just gated flows)
Closes a gap where one-off CLI calls, manual re-fires, and exploratory gens outside the structured `hvg-flow` / `hig-flow` 9-gate flows were skipping PFM-specific conventions — brand-clean negatives, ambient audio direction, character master format, no [STATE LINE] tags, count=1 vs count=2, filename hex suffixes for Resolve, etc.

Three reinforcing signals locked in:

- **New memory entry** so the rule fires across all sessions: whenever Claude is about to invoke Higgsfield (CLI or MCP) for PFM work, it must self-impose `hvg-flow` (video) or `hig-flow` (image) conventions first.
- **`higgsfield-image-generation` skill** now opens with a "PFM CONVENTIONS — non-negotiable" callout listing the must-apply rules and cross-referencing `hig-flow`.
- **`higgsfield-veo-batch` skill** same — opens with the matching callout cross-referencing `hvg-flow`.

This is a discipline fix. The difference editors will notice: fewer first-draft fires that need re-runs because something obvious (brand-clean negative, audio block, ref format, count) was skipped.

### hvg-flow — strict protocol initiation on Notion link / project folder
Hardened auto-trigger behavior so the skill never freelances between gates. When an editor drops a Notion URL or references a PFM project folder path, the model now enters Gate 1 immediately — no head-start Notion fetches, no early shell commands, no brief parsing or format guessing before the gates instruct it, no "would you like to…" alternative offers.

If an editor pastes ahead-of-schedule info (e.g., the master prompt at session start), the skill acknowledges it but still walks gates in order, using the early input at the corresponding gate.

This is a discipline fix, not a feature change — but the difference editors will notice is fewer surprise tool calls between gates and tighter, more predictable conversations.

### veo-script-writing — Gate 0, [STATE LINE] strip, no 3-4s beats
Three hardenings landed today after an editor's LC-to-Video output shipped with `[STATE LINE]` trailing annotations and choppy 3-4s "punchy beats":

- **Gate 0 — LC handoff.** When `/veo-script-writing` is invoked on a Notion request titled "LC to Video —" or on a multi-paragraph long-copy Facebook ad, the skill now surfaces a handoff proposal to `lc-to-video-podcast` and waits for explicit editor confirmation before rebalancing.
- **Strip `[STATE LINE]` trailing tags.** Real bracketed placeholders inside a line (`[STATE]`, `[ROAD]`, `[STATE_RATE_YEAR]`) stay; trailing meta-annotations come out. Scan-and-strip pass runs before delivery.
- **No 3-4s "punchy" beats.** Lines like `"Impact. Bumper gone."` are always merge candidates. Every Veo clip lands in the 15-24 word window, leans long. Closing line is the only short-line exception (12-15 words).

### lc-to-video-podcast — same hardenings
Mirror updates to the floor-15 + no-3-4s-beats rule. Word floor moved from 12 → 15 to enforce 6-8s leaning long.

---

## 2026-05-14

### Higgsfield enterprise migration → PowerFox workspace
Editors moved off the shared `powerfoxlogin@gmail.com` Higgsfield account onto a **PowerFox enterprise workspace** with 1.1M+ shared credits. NB Pro images now bill **0 credits** via the Unlimited entitlement on this workspace (must be explicitly selected — workspace UUID `e7479d4c-0d59-4be5-9057-abce9fe30f39`).

- New script: `claude-pfm-account-switch.sh` — handles logout, login with personal email, workspace set, and verification in one shot.
- Higgsfield MCP in Claude Desktop has separate auth — must be reconnected per-editor (Settings → Connectors → Higgsfield → Disconnect/Reconnect).

---

## 2026-05-13

### hvg-flow — permission prompt refactor + AskUserQuestion killed
- `hvg-flow` Gate 8 heredoc Python and Step 10 parallel mp4 download refactored into checked-in helper (`download_parallel.sh`). Allowlisted as `Bash(bash *hvg-flow/download_parallel.sh *)` — no more "Allow once" prompts mid-run.
- Both `hvg-flow` and `hig-flow` now explicitly tell Claude to NEVER use the `AskUserQuestion` tool for gate confirmations. Multi-choice questions render as plain markdown chat instead.
- Gate 4 (reference mode + assignment) rewritten — asks reference image AND reference mode together, always shows all 5 modes (A-E) with plain-English "when to use" descriptions.

### Editor onboarding scripts
Three Lucid Link scripts shipped:
- `claude-pfm-setup.sh` — one-shot Mac installer (Homebrew → Node → Git → Higgsfield CLI → skills + settings).
- `claude-pfm-setup-windows.sh` — Windows post-prereqs installer (after manual Git/Node/Python installs).
- `claude-pfm-update.sh` — pull latest skills + settings from Lucid Link.

---

## 2026-05-12

### veo-script-writing — no em/en dashes, no ALL CAPS in lines
Strip every em/en dash and ALL CAPS word from balanced Veo lines even when the brief contains them. `[BRACKETED_TOKEN]` placeholders keep their caps as the exception. Scan-and-strip pass runs before delivery.
