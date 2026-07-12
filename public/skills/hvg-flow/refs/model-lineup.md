---
title: HVG flow — model lineup, cost ladder, CLI args
parent_skill: hvg-flow
loaded_when: Gate 5 of hvg-flow needs the full model lineup, full cost ladder, CLI flag mappings, Kling-specific params, or aspect ratio detail beyond the default summary
---

# Model lineup, cost ladder, CLI args — full detail

Load-on-demand companion to `hvg-flow` Gate 5. The main SKILL.md keeps the default model block (Veo 3.1 Lite for silent + dialogue), a 1-line cost summary, and the essential CLI mapping. This file holds:

- Full model lineup with empirical costs + when to use each
- Full cost ladder including count=2 opt-in math
- Complete CLI argument mappings
- Kling 3.0-specific parameters
- Aspect ratio defaults by use case

Read this whenever the editor wants a non-default model, asks about cost / CLI flag details, or the Notion brief specifies something unusual.

## Available models with verified costs (8s / 16:9, empirical table 2026-05-20)

- **Veo 3.1 Lite — silent** — **8 cr/clip**, no audio. Default for silent b-roll, ambient plates, state-variation backgrounds.
- **Veo 3.1 Lite — with audio** — **12 cr/clip**, dialogue audio + lip sync. **Requires `--generate_audio true` flag** — WITHOUT the flag, Lite ships silent. Default for podcast story-ad dialogue lines where identity is locked from a single reference.
- **Veo 3.1 Fast** — **~27 cr/clip**, has audio by default. Escalation when Lite quality isn't holding — hero shots, complex performance, tight lip-sync requirements.
- **Veo 3.1 Preview (base)** — **~58 cr/clip**, has audio. One-shot heroes only — ~2.1× the cost of Fast.
- **Veo 3.1 Preview (Ultra)** — **~87 cr/clip**, has audio, dialed via `--quality ultra` flag. `--quality` knob on `veo3_1` accepts `basic | high | ultra`. Top-tier quality reserve; use only when Preview-base isn't delivering for the hero placement.
- **Seedance 2.0** — ~30-40 cr/clip
- **Kling 3.0** — 10 cr (5s std) / 20 cr (10s std) / 25 cr (10s pro) — has audio with lip sync. Strong identity-lock from reference image. Better than Veo for testimonial / single-subject character-continuity work where Veo's stochastic NSFW filter is a tax.

## Cost ladder (8s clips, audio variants, count=1 default — double for count=2 opt-in)

| Setup | Cost/line | Audio |
|---|---|---|
| Lite silent (DEFAULT for silent b-roll) | 8 cr | ✗ |
| Lite audio (DEFAULT for dialogue) | 12 cr | ✓ |
| Fast | 27 cr | ✓ |
| Preview base | 58 cr | ✓ |
| Preview Ultra | 87 cr | ✓ |

For opt-in A/B picks (count=2) on specific lines, double the cost/line. Editor can specify per-line at gate 5 — e.g. *"L01 and L17 at count=2, rest count=1."*

If editor picks Preview, confirm: *"Preview base is ~2.1× the cost of Fast; Preview Ultra is ~3.2× Fast — hero shot only?"*

## CLI argument mappings

| Display name | CLI invocation | Cost |
|---|---|---|
| Veo 3.1 Lite — silent | `veo3_1_lite` (no `--model`, no `--generate_audio`) | 8 cr/clip |
| Veo 3.1 Lite — with audio | `veo3_1_lite --generate_audio true` | 12 cr/clip |
| Veo 3.1 Fast | `veo3_1 --model veo-3-1-fast` (audio default on) | ~27 cr/clip |
| Veo 3.1 Preview (base) | `veo3_1 --model veo-3-1-preview` (no `--quality` flag = base) | ~58 cr/clip |
| Veo 3.1 Preview (Ultra) | `veo3_1 --model veo-3-1-preview --quality ultra` | ~87 cr/clip |
| Seedance 2.0 | `seedance_2_0` | ~30-40 cr/clip |
| Kling 3.0 | `kling3_0` (note: no underscore between "kling" and "3") | 10-25 cr depending on pro/std × duration |

**Always verify model IDs against the live CLI** before firing — run `higgsfield model list` if you're unsure. The CLI's actual job-set-types occasionally differ from intuition (e.g. `kling3_0` not `kling_3_0`).

## Kling 3.0 specifics (verified 2026-05-07)

- `mode: pro | std` — pro is +5 cr/clip but noticeably better identity preservation and motion control. Default to **pro for testimonial / character-continuity work**, std for ambient or background plates.
- `sound: on | off` — Kling 3.0 generates dialogue audio with lip sync, comparable to Veo 3.1.
- `duration: 5 | 10` — default 5; 10 is the right default for dialogue beats with breath room.
- `aspect_ratio: 16:9 | 9:16 | 1:1`
- Costs: 10 cr (5s std) / 20 cr (10s std) / **25 cr (10s pro)** — substantially cheaper than Veo 3.1 Fast for testimonial work where Kling's identity-lock from a reference image is often stronger.

## Aspect ratio default — ALWAYS 9:16 (locked 2026-06-17)

**Default to 9:16 (vertical) for EVERY fire — even when the project / `Vertical` is 16:9.** Do NOT infer aspect from the `Vertical` field. Go 16:9 (or 1:1) ONLY when the editor / request explicitly asks, or for an inherently-horizontal format (VSL full-screen slides, CTV / anchor-wall). Always confirm at the preflight.

## Cross-references

- Main flow: `hvg-flow/SKILL.md` Gate 5
- count=1 default rationale: memory `feedback_default_count_1.md`
- Higgsfield CLI conventions: memory `feedback_higgsfield_workflow.md`
- HVG.1 manifest + CLI pipeline empirical data: memory `feedback_hvg1_master_prompt_format.md`
- Concurrency cap (max_workers=16): memory `feedback_higgsfield_cli_concurrency_race.md`
