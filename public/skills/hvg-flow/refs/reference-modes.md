---
title: HVG flow — reference modes (A/B/C/D/E) detail
parent_skill: hvg-flow
loaded_when: Gate 4 of hvg-flow needs per-mode follow-up specifics or missing-refs handling detail
---

# Reference modes (A/B/C/D/E) — full detail

Load-on-demand companion to `hvg-flow` Gate 4. The 5-mode summary table (which mode means what + when to use each) stays in the main SKILL.md so it's visible when Claude asks the editor to pick. This file holds:

- Per-mode follow-up specifics (what to verify / ask once a mode is chosen)
- Filename-quirk tolerance for the folder scan
- Missing-refs handling detail

Read this whenever the editor picks a mode at Gate 4 Step 2 and Claude needs the follow-up procedure.

## Filename quirks to tolerate (don't block on these)

When scanning `Elements/Footage/Reference/` at Gate 4 Step 1, tolerate:
- Trailing whitespace before extension (`L8 - Generic .png`)
- Typos in the descriptive suffix (`L34 - Genertic.png`)
- Mixed extensions (`.png`, `.jpeg`, `.jpg`, `.webp`)
- Inconsistent zero-padding within the same project (`L1` and `L01` both valid)

**Version variants per line:** when multiple files match the same line number (e.g. `L1 - Title Slide - v1.png` AND `L1 - Title Slide - v2.png`), surface them and ask the editor which to use. Default suggestion: latest version (`v2` over `v1`). Don't auto-pick silently.

**`Generic` in filename suffix** (case-insensitive): treat as "no specific slide for this line — use pool fallback if Mode E, else still mode-B-eligible."

## Per-mode follow-ups (Step 3 of Gate 4)

After the editor picks a mode at Gate 4 Step 2, apply the matching follow-up:

### Mode A — Single shared

Ask which file is the shared ref (auto-pick if exactly one root-level file in the scan results). Confirm with the editor before moving on.

### Mode B — Per-line

Verify every line in the script has a matching file via `^L(\d+)\b` regex. Map lines → files and surface the assignment table.

**If gaps exist**, surface them and ask:

> L05, L12, L19 don't have refs. Generate them now (kick to `higgsfield-image-generation`) or fire without them (skill will mark those rows `skipped`)?

**If multiple version variants match the same line**, ask which version (default suggestion: latest — `v2` over `v1`).

### Mode C — Rotating pool

Ask rotation strategy:

> Rotation strategy?
> (1) **Random** — random pool item per line
> (2) **Sequential** — cycle through the pool in order, loop if pool < line count
> (3) **Script-tagged** — editor specifies shot type per line in the script (e.g., `L01: Close, L02: Medium, L03: Long`)

If (3), ask the editor to drop the per-line tag list now (or paste an updated script with the tags inline).

### Mode D — Start + end frames

Verify both `_start` and `_end` exist for every line. Surface gaps. Confirm.

### Mode E — Mixed

Ask Mode C rotation strategy for the fall-through pool. Skill builds per-line assignment using fall-through logic: `LXX.png` if it exists, else pool pick.

## Missing refs handling

- **Editor wants to generate missing refs** → exit hvg-flow, point editor to `higgsfield-image-generation` skill in a separate chat, restart hvg-flow when refs are saved into the folder.
- **Editor wants to fire without missing refs** → mark those lines as `skipped` in the manifest and don't fire them in step 10.

## Cross-references

- Main flow: `hvg-flow/SKILL.md` Gate 4
- Character master format rules: memory `feedback_pfm_character_master_format.md`
- Image gen for missing refs: `higgsfield-image-generation` (one-off) or `hig-flow` (full Notion-request batch)
