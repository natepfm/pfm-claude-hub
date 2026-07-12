---
name: anchor-wall-composite
description: PFM's anchor wall composite — renders a verified SaveMaxAuto EndCard onto the curved video wall behind the studio anchor (Steve, in PFM's breaking-news creatives), producing the D-locked cinemagraph reference frame for the anchor's close lines. BREAKING NEWS creatives ONLY — the creative must have a studio-anchor scene with a video wall. Podcast / VSL / UGC Calls creatives do NOT use this: their grammar is the burned-through banner + the EndCard cut in as a FULL-SCREEN close card (locked by Sam 2026-07-08 — an add-a-screen-behind-the-podcast-host variant was built that night on a mistaken BN assumption and reverted the same night; the technique worked mechanically but is NOT a format convention — never offer it unless the editor explicitly asks for a screen composite on a non-BN set). Use when an editor says "anchor wall", "anchor wall composite", "steve wall", "wall composite", "put the endcard on Steve's wall", "anchor wall ref", "make the Steve reference image", "swap the wall content", "new Steve images with the new numbers", or when a breaking-news creative's close-line cinemagraphs need their reference frame after call-graphics delivered the EndCards. NOT for: generating the EndCard or Banner themselves (use call-graphics first — this skill consumes a finished EndCard), firing the close-line Veo cinemagraphs (hvg-flow / direct fire), or non-anchor creative types.
---

# Anchor Wall Composite

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Render a delivered EndCard onto the curved video wall behind Steve (the studio anchor), producing the reference frame for the D-locked close-line cinemagraphs. Battle-tested on Car Chase Roku CTV Calls (Houston v6, Nationwide, Washington — June 2026). One composite per EndCard variant the editor wants animated.

## Inputs (confirm both exist before firing)

1. **Base frame**: the project's OG Studio Anchor PNG (e.g. `Elements/Footage/Reference/Anchors/Studio Anchor - v2_c3d4.png` in Car Chase). Steve at the desk, curved video wall behind him. **No wall → this skill doesn't apply — say so and stop.** (Podcast/VSL/UGC Calls closes = banner + full-screen EndCard in the edit, never a composited screen. An add-a-screen variant was proven mechanically on 2026-07-08 — base frame + "ONE ADDITION: a flat-screen behind the host showing reference #2", same preservation/phone blocks, hardened screen-freeze on the downstream D-locked fire — but it exists ONLY for an explicit editor ask, never as a default.)
2. **EndCard**: the already-verified EndCard PNG for the variant being animated (from `call-graphics`).

## Fire

`gpt_image_2`, **1k** (composites are refs, not deliverables), 16:9, both images as refs — **anchor frame FIRST, EndCard SECOND**. Upload both fresh and serially (`higgsfield upload create <file> --json`), then:

```bash
higgsfield generate create gpt_image_2 \
  --prompt "<prompt below with {PHONE} swapped>" \
  --image <ANCHOR_UUID> --image <ENDCARD_UUID> \
  --aspect_ratio 16:9 --resolution 1k \
  --wait --wait-timeout 15m --json
```

Output: `Elements/Footage/Reference/Anchors/<variant subfolder>/Studio Anchor <Roku|TD> EndCard Wall <Variant> GPT - test_<4-hex>.png`

## Prompt (swap `{PHONE}` — keep the "fourteen characters" line; the locked (XXX) XXX-XXXX format is always 14)

```
Use REFERENCE IMAGE #1 (the Studio Anchor frame of STEVE the news anchor) as the BASE FRAME. The output must be IDENTICAL to reference #1 in every way EXCEPT the content shown on the curved video wall behind Steve.

PRESERVE EXACTLY FROM REFERENCE #1:
- Steve's identity, face, hair, suit, tie, pose, expression, position, every pixel of Steve
- The exact framing, camera angle, perspective, and composition
- The news anchor desk in front of Steve
- The studio environment, lighting, and curved video wall geometry
- Every pixel outside of the video wall's display surface

ONLY ONE CHANGE: the content displayed ON the curved video wall is replaced with the content of REFERENCE IMAGE #2 (the SaveMaxAuto End Card graphic).

CRITICAL — THE PHONE NUMBER MUST BE FULLY VISIBLE END TO END, INCLUDING THE OPENING PARENTHESIS:
The phone number on the End Card reads EXACTLY '{PHONE}' — fourteen characters total including parentheses and hyphen. Render the End Card on the curved video wall such that ALL fourteen characters are CLEARLY VISIBLE and READABLE, including the leading opening parenthesis '(' on the left side. Do NOT let Steve's body, shoulder, or head occlude any digits or the opening paren. Do NOT let the curved wall's left edge crop the phone number — the entire End Card content (wordmark + phone + info block) must read correctly with comfortable margin on all sides of the wall. If needed to make the full phone number visible, render the End Card slightly inset from the wall's left edge so the curve doesn't eat the opening parenthesis.

The End Card content reads as in reference #2: deep navy background, real SaveMaxAuto wordmark at top (prominent sizing), large white phone number '{PHONE}' rendered character-for-character including the opening parenthesis, small cyan hairline rule, 3-line info block.

DO NOT add bezels, mounting frames, or hardware around the wall. The wall is identical to reference #1, just showing different content.

DO NOT move Steve. DO NOT change his pose, expression, framing, or appearance. He stays IDENTICAL to reference #1.

DO NOT remove the desk. DO NOT change the camera angle. DO NOT change the studio. DO NOT relight the scene.

This is a 1:1 content swap on the video wall.

NEGATIVES: NO phone-number truncation, NO missing opening parenthesis, NO cropping at the wall's left edge, NO Steve repositioning, NO standing up, NO pose change, NO wardrobe change, NO desk removal, NO camera-angle change, NO reframing, NO bezels around the wall, NO SaveMax+Auto or SaveMax-Auto wordmark variants, NO fake wordmark inventions, NO leading '1-' before the phone, NO spaces around the hyphen between digit groups, NO chyrons, NO lower-thirds, NO LATU branding.
```

If the EndCard design isn't Apple Navy, swap the "deep navy background … cyan hairline rule" sentence to describe the actual design's palette (pull from its design.md in the template library at `7. SMA Organic/SMA - Brand Folder/Endcard & Banner Graphic Templates/`) — the rest of the prompt is design-agnostic.

## Verify (always, before handoff)

Read the composite: full phone number visible end to end (the opening paren is the usual casualty — the curved wall's left edge eats it), Steve pixel-identical to the OG, no bezels, no chyrons. Refire on any miss (2-retry cap, then flag); the "inset from the wall's left edge" language usually clears it but isn't deterministic.

## Deliver

Three-link handoff — this skill always SHOWS a single composite, so include all three (Hard Rule 2):
- 📁 raw `/Volumes/ads/…` path in backticks (Finder)
- 🔗 LinkYourFile link via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<path>"` (opens the Lucid folder)
- 🦊 From Claude rail drop via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<path>"` (opens in Fox.io in a new tab; entry self-clears on click)
- 📲 **Tappable** — the composite uploaded via `higgsfield upload create "<file>" --json` → a CloudFront URL the editor can tap and view on their phone, no Lucid. Locked 2026-06-15 (emoji 📲, not 🧭).

## Downstream use

The composite is the `--start-image` AND `--end-image` (same UUID, D-locked) for the Veo 3.1 Lite close-line cinemagraphs — that's hvg-flow / direct-fire territory, not this skill.

## Failure modes

- **Queue stall** (CLI returns empty `[]` after ~3 min): refire — second attempt typically lands in ~2 min.
- **Opening paren cropped by the wall curve**: refire as-is once; if it repeats, the editor may prefer a Steve-shifted variant — ask before deviating from the 1:1 content-swap rule.
- **Steve drifts (pose/standing/desk gone)**: refire — never hand off a drifted composite.
