# _HANDOFF — pfm-claude-hub: 6 new SVG diagrams

**Repo:** `/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub`
**Deploy:** Railway auto-deploys on push to `main` (~2 min) → `pfm-claude-hub-production.up.railway.app`
**Task:** Add 6 themed SVG diagrams/shapes across the hub. Flow per diagram: author → render-verify → port to inline JSX → `tsc` clean → show Sam → he says **"run"** → commit + push.

---

## Where things stand

All 6 diagrams are **authored + rendered** as standalone SVGs in `diagram-drafts/` (in-repo, durable). **None are ported to JSX or integrated yet. Nothing committed.**

| # | Diagram | Draft file | Target | Status |
|---|---------|-----------|--------|--------|
| 1 | Notion-drop → auto-detect → Format A/B/C → Gate 1 | `diagram-drafts/d1_notionfork.svg` | `components/sections/Overview.tsx` — **replace Panel 3** | ✅ rendered + eyeballed, looks good |
| 2 | Anatomy of a creative (blocks → type → variations → vertical) | `diagram-drafts/d2_anatomy.svg` | `app/creatives/page.tsx` — new diagram at top | rendered, not yet reviewed |
| 3 | Two surfaces — Claude Code vs Cowork | `diagram-drafts/d3_surfaces.svg` | `components/sections/SkillsSection.tsx` — after header intro | rendered, not yet reviewed |
| 4 | QC loop (download → QC → verdict → delivery; fail loops back) | `diagram-drafts/d4_qc.svg` | `Overview.tsx` — new panel after Panel 4 | rendered, not yet reviewed |
| 5 | Cost ladder (Veo credits: Lite / Fast / Preview) | `diagram-drafts/d5_cost.svg` | `Overview.tsx` — new panel | rendered, not yet reviewed |
| 6 | Pipeline ribbon (Notion → Claude → Veo+b-roll → edit → delivered) | `diagram-drafts/d6_ribbon.svg` | `app/claude/page.tsx` — slim banner after `<header>` | rendered, not yet reviewed |

`diagram-drafts/d1_notionfork.png` is the verified render of #1. Re-render any draft with:
`qlmanage -t -s 1000 -o /tmp diagram-drafts/dN_*.svg` then Read the resulting `/tmp/*.png`.

---

## Next steps (in order)

1. **Eyeball #2–#6** — render each draft to PNG and Read it; fix any text overflow / arrow alignment **in the draft SVG** before porting. (#1 is already verified.)
2. **Port each to inline JSX** in its target file (conventions below).
3. **#4 + #5 placement** — insert as new Overview panels after Panel 4 (the gate-flow). Then **renumber the existing "5. The team folder" panel → 7**, so order reads: 1, 2, 3, 4, **QC = 5**, **Cost = 6**, Team folder = 7. ⚠️ Do NOT touch the gate-flow diagram's internal 9-gate numbering — that's a separate count inside Panel 4's SVG.
4. **Typecheck:** `OUT=$(npx --no-install tsc --noEmit 2>&1); TS=$?; echo "exit=$TS"; echo "$OUT"` — zsh `$PIPESTATUS` does NOT work here, capture the exit directly.
5. **Show Sam, then stop.** Do not commit until he says **"run."** Then commit (co-author footer) + push; Railway deploys.
6. **Delete `diagram-drafts/`** once all 6 are integrated — it's scratch only.

---

## Conventions (match the existing 5 diagrams)

- **Theme:** bg `#0a0a0a` · surface `#141414` · surface2 `#1c1c1c` · border `#2a2a2a` · text `#fafafa` · muted `#a1a1a1` · accent `#FF6B35` · accentMuted `#3a1f15`.
- **JSX port:** camelCase every SVG attr — `fontSize`, `textAnchor`, `fontWeight`, `strokeWidth`, `strokeDasharray`, `markerEnd`, `markerWidth`/`markerHeight`/`markerUnits`, `refX`/`refY`. **Drop the `<rect ... fill="#0a0a0a"/>` background rect** when porting — the container's `bg-bg` provides it (the bg rect is only in the drafts for render legibility).
- **Container:** `<div className="border border-border rounded-lg bg-bg p-5 ...">`. Wide diagrams (**#2 anatomy** and **#6 ribbon** — viewBox width 820) need `overflow-x-auto` on the container + `min-w-[680px]` on the svg (see `EditorSection.tsx` for the pattern).
- **`<svg>` tag:** `className="w-full h-auto block"`, `role="img"`, a real `aria-label`, `style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}`.
- **Marker IDs must be unique** across the rendered page. Existing IDs in use: `ovStack`, `ovBrA`/`ovBrM`, `ovGate`, `edPipe`. Suggested new: #1 → `p3Fork`; #3 → `skA`/`skM`; #4 → `qcA`/`qcF`; #6 → `ribA`; #2 → `anatA`. #5 (cost ladder) has no arrows/markers.
- **Style reference:** copy the look from `Overview.tsx` Panels 1 / 2 / 4, `SystemDiagram.tsx`, and `EditorSection.tsx`.

---

## Two design choices to confirm with Sam while porting

- **#4 QC** uses muted **green `#5a9e74`** (pass) + **red `#c25b50`** (fail) verdict dots — a small step outside the strict orange/grey palette. Keep, or swap to accent/grey? *(Recommend keeping — pass/fail reads instantly.)*
- **#5 cost ladder** shows per-clip **credit costs** on the hub (Lite 8/12 · Fast 27 · Preview 58/87). Fine for an internal team hub; just confirm he's good showing the numbers.

---

## Placement details (exact spots)

- **Overview Panel 3 (replace):** the `{/* Panel 3: Notion drop flow */}` block — currently a `grid md:grid-cols-3` input→arrow→output layout plus a Format A/B/C paragraph below it. Keep the `<h3>` + intro `<p>`; swap the visual for the SVG. The Format A/B/C paragraph is now redundant with the fork — trim to a one-line caption or drop it.
- **Team-folder panel (renumber 5→7):** the `{/* Panel 5: What's in 6. Claude PFM */}` block near the bottom of `Overview.tsx`.
- **Ribbon (#6):** insert between `</header>` and the `{/* Hero: Update my skills */}` section in `app/claude/page.tsx`. Keep it slim/understated so the orange Update hero still dominates the top.
- **Anatomy (#2):** top of `app/creatives/page.tsx`, right after the `<header>`, before the `{/* Creative types */}` section.
- **Two surfaces (#3):** in `SkillsSection.tsx`, after the section header `<p>` intro, before (or just after) the "Download the Cowork plugin" callout.

---

## Workflow rules (standing)

- **Commit only on Sam's "run."** He pushes manually; one push = Railway redeploy.
- No AskUserQuestion cards — plain markdown.
- Commit message ends with the Claude co-author footer.
