# PFM Claude Editor Hub — Web-App Dev Handoff (channel charter)

> **Purpose of this channel: making changes to the PFM Claude Editor web app** (`pfm-claude-hub`) — the editor-facing landing site at `pfm-claude-hub-production.up.railway.app`. Pages, components, SVG diagrams, content/data, changelog, styling. **This channel is the web app only** — not gen flows, not Veo/asset projects, not Notion work, not skill authoring (those happen elsewhere). If a request is "fire the gens / build a batch / write a script," it's the wrong channel.
>
> Read this top-to-bottom once and you're oriented to make any hub change cold.

---

## 1. What the hub is

A Next.js site that is the **editors' home base** for the PFM Claude system. Four pages:
- **Onboarding** (`/`) — first-day setup: accounts, apps, training path, day-one checklist.
- **Claude** (`/claude`) — the pipeline: "Update my skills" command, how-to-use, how-it-works diagrams, Mac/Windows setup, the skills catalog, the Editor (DaVinci) tools, the changelog. **This is the densest, most-edited page.**
- **Creatives** (`/creatives`) — the Creative Library: creative types, variations, verticals, building blocks.
- **Resources** (`/resources`) — landers, tools/logins, brand, shared assets, SOPs.

It also **serves the skills** as downloads (see §9) — but editing skills is usually *not* hub work.

---

## 2. Repo, deploy, and the golden workflow rule

- **Repo:** `/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub`
- **GitHub:** `github.com/natepfm/pfm-claude-hub` (branch `main`)
- **Deploy:** **Railway auto-deploys on every push to `main`** (~2 min) → `pfm-claude-hub-production.up.railway.app`. No manual deploy step; push = ship.
- **🔴 GOLDEN RULE — commit/push ONLY when Sam says "run."** Sam reviews changes first. Build → typecheck clean → show him → he says **"run"** → THEN commit + push. Never commit on your own initiative. Commit messages end with the Claude co-author footer.
- Deploy config lives in `railway.json` + `nixpacks.toml` (don't touch unless deploy is the task).

---

## 3. Stack

| | |
|---|---|
| Framework | **Next.js 16** (App Router, RSC by default) |
| UI | **React 19** |
| Styling | **Tailwind CSS 3.4** (custom theme, §7) |
| Language | **TypeScript 5.5** (strict-ish; `tsc --noEmit` must be clean) |
| Markdown | `marked` (renders `CHANGELOG.md`) |
| Node | ≥ 20.9 |

Components are **server components** unless they need hooks/interactivity — `Nav.tsx` is `"use client"` (uses `usePathname`); most everything else is server-rendered. If you add client interactivity (state, onClick, effects), put `"use client"` at the top of that file.

**npm scripts:** `dev` (`next dev`), `build` (`next build`), `start` (`next start -p $PORT`), `lint` (`next lint`).

---

## 4. Local dev + verify (do this before every "show Sam")

- **Preview live edits:** `npm run dev` → `localhost:3000`.
- **Typecheck (always run before showing Sam):**
  ```bash
  OUT=$(npx --no-install tsc --noEmit 2>&1); TS=$?; echo "exit=$TS"; echo "$OUT"
  ```
  ⚠️ Capture the exit code directly like that — **zsh `$PIPESTATUS` does NOT work here** (it silently misreports, which once produced a false "typecheck failed"). `exit=0` = clean.
- **Render-verify any SVG diagram before committing** (see §8).

---

## 5. File map

```
pfm-claude-hub/
├── app/
│   ├── layout.tsx              Global shell — mounts <Nav> + <MobileNav>, fonts, metadata
│   ├── page.tsx          (421) Onboarding "/" — checklist, apps, training, 2 diagrams
│   ├── claude/page.tsx   (177) Claude "/claude" — composes the section components below
│   ├── creatives/page.tsx(218) Creative Library — cards from content/creatives.ts + diagrams
│   └── resources/page.tsx(237) Resources — landers/tools/brand/assets/SOPs + reskin diagram
├── components/
│   ├── Nav.tsx                 Sidebar nav + MobileNav (client). Page list + per-page subLinks
│   ├── CopyBlock.tsx           Copy-to-clipboard command block (the install/update snippets)
│   ├── Callout.tsx             Styled callout box
│   ├── PlaceholderCard.tsx     Placeholder card
│   └── sections/               The /claude page is assembled from these:
│       ├── Overview.tsx  (403) BIGGEST FILE — "How to use" + "How it works" panels 0-5,
│       │                       holds 5 of the diagrams (knowledge stack, MCP/CLI, Notion
│       │                       fork, gate flowchart, QC loop, cost ladder)
│       ├── SystemDiagram.tsx(137) The master→Lucid→editors cycle diagram
│       ├── SkillsSection.tsx(141) Skills catalog (from skills.ts) + two-surfaces diagram +
│       │                        Cowork download + Contribute callout
│       ├── EditorSection.tsx(89) claude-editor (DaVinci) tools + pipeline diagram
│       ├── SetupMac.tsx   (125) Mac install walkthrough (inside a <details> toggle)
│       ├── SetupWindows.tsx(99) Windows walkthrough (inside a <details> toggle)
│       └── ChangelogSection.tsx(66) Parses CHANGELOG.md → recent 5 + collapsible archive
├── content/                    DATA (edit these, not the JSX, for catalog changes):
│   ├── skills.ts               Skill catalog → SkillsSection + the {skills.length} counters
│   ├── creatives.ts            creativeTypes / variationTypes / verticals / buildingBlocks
│   ├── editorTools.ts          claude-editor tool entries → EditorSection
│   ├── landers.ts              Landing pages → resources
│   └── CHANGELOG.md            The changelog (## YYYY-MM-DD blocks, newest first)
├── public/
│   ├── skills/<skill>/SKILL.md 16 served skill files (download links) — the hub mirror (§9)
│   └── pfm-cowork-skills.plugin The Cowork bundle (rebuilt by scripts/build-cowork-plugin.sh)
├── scripts/
│   └── build-cowork-plugin.sh  Regenerates the .plugin from public/skills/ (1024-char guard)
├── railway.json / nixpacks.toml  Deploy config
└── tailwind.config.ts          Theme tokens (§7)
```

---

## 6. The four pages + their sections (Nav.tsx is the map)

`Nav.tsx` defines the page list and the per-page "On this page" anchor links — keep it in sync when you add/rename a section (the anchor `id=` on the section must match the `href`).

- **`/`** → `#welcome` `#checklist` `#apps` `#training` `#claude-setup`
- **`/claude`** → `#update` `#overview` `#how-it-works` `#setup-mac` `#setup-windows` `#skills` `#editor` `#changelog`
- **`/creatives`** → `#types` `#variations` `#verticals` `#building-blocks`
- **`/resources`** → `#landers` `#tools` `#brand` `#assets` `#sops`

---

## 7. Theme (Tailwind tokens — use the named classes, never raw hex in JSX className)

From `tailwind.config.ts`:

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0a0a0a` | page background |
| `surface` | `#141414` | cards, nav |
| `surface2` | `#1c1c1c` | inner chips, hovers |
| `border` | `#2a2a2a` | all borders/dividers |
| `text` | `#fafafa` | primary text |
| `muted` | `#a1a1a1` | secondary text |
| `accent` | `#FF6B35` | PFM orange — highlights, CTAs, arrows |
| `accentHover` | `#E55A2B` | hover state of accent |
| `accentMuted` | `#3a1f15` | accent-tinted fill (highlighted boxes/callouts) |

Use as `className="bg-surface border-border text-muted"` etc. Accent CTA pattern: `bg-accent text-bg hover:bg-accentHover`. Highlighted/active box: `bg-accentMuted border-l-4 border-accent`.
Fonts: `font-sans` (system stack) / `font-mono` (SF Mono) — but **inside `<svg>` set `style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}`** (Tailwind classes don't apply to SVG text).

---

## 8. ⭐ The SVG diagram pattern (the most common hub change — read carefully)

Diagrams are **hand-authored inline SVG inside JSX**, themed with the hex palette above. There are **~14 across the hub** (see inventory below). They all follow one house style — match it exactly.

### Authoring + verify loop (don't skip the render check)
1. Draft the diagram as a **standalone raw `.svg` file in `/tmp`** first (plain SVG attrs: `font-size`, `text-anchor`, `stroke-width`, `stroke-dasharray`; include a `<rect ... fill="#0a0a0a"/>` background so it's legible). Add a dark bg rect ONLY for the /tmp preview.
2. **Render it:** `qlmanage -t -s 1000 -o /tmp /tmp/mydiagram.svg` → produces `/tmp/mydiagram.svg.png` → **Read the PNG** and eyeball for text overflow, arrow alignment, spacing. Iterate on the raw SVG until it's right.
3. **Port to JSX** in the target component:
   - **camelCase every attribute:** `fontSize`, `textAnchor`, `fontWeight`, `strokeWidth`, `strokeDasharray`, `markerEnd`, `markerWidth`/`markerHeight`/`markerUnits`, `refX`/`refY`.
   - **Drop the `<rect fill="#0a0a0a">` background rect** — the container's `bg-bg` provides it.
   - Numbers can be `{42}` braces or strings; existing code uses braces (`x1={160}`).
4. **Typecheck** (§4), then show Sam.

### House conventions
- **Container:** `<div className="border border-border rounded-lg bg-bg p-5">` (often `max-w-xl` for tall/narrow ones).
- **`<svg>` tag:** `viewBox="0 0 W H"`, `className="w-full h-auto block"`, `role="img"`, a real `aria-label="..."` (full sentence describing the diagram for a11y), `style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}`.
- **Wide diagrams** (viewBox width ~820, horizontal flows): container gets `overflow-x-auto`, the `<svg>` gets `min-w-[560px]` (or `min-w-[680px]`). See `EditorSection.tsx` for the reference.
- **Boxes:** `rx` 8–12, neutral = `fill="#141414" stroke="#2a2a2a" strokeWidth={1.5}`; **highlighted/accent** = `fill="#3a1f15" stroke="#FF6B35" strokeWidth={2}`.
- **Number badges:** accent circle/square `fill="#FF6B35"` with dark text `fill="#0a0a0a"`.
- **Arrows:** define a `<marker>` in `<defs>` with `<path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35"/>`; reference via `markerEnd="url(#id)"`. **Marker IDs must be UNIQUE across the whole rendered page** (existing IDs: `ovStack`, `ovBrA`/`ovBrM`, `ovGate`, `edPipe`, plus the diagram ones added 06-02). Two diagrams on one page with the same marker id = broken arrowheads.
- **Text:** titles `fill="#fafafa"` ~12–15px `fontWeight=600/bold`; body `fill="#a1a1a1"` ~9.5–11px. Light-on-box body sometimes `#cfcfcf`/`#e8e8e8`.
- **Restrained semantic color is OK** where it aids meaning (e.g. the QC diagram uses muted green `#5a9e74` pass / red `#c25b50` fail) — but default to the orange/grey palette.
- **Reference diagrams to copy from:** `SystemDiagram.tsx`, `EditorSection.tsx`, and `Overview.tsx` panels 1/2/4.

### Current diagram inventory (~14)
- **/claude → Overview.tsx:** knowledge-stack (P1) · MCP-vs-CLI (P2) · Notion-drop→Format A/B/C fork (P3) · 9-gate flowchart (P4) · QC loop · Veo cost ladder
- **/claude → other sections:** master→Lucid→editors cycle (`SystemDiagram`) · two-surfaces Code-vs-Cowork (`SkillsSection`) · claude-editor pipeline (`EditorSection`) · pipeline ribbon (top of `app/claude/page.tsx`)
- **/ (Onboarding):** first-day flow (Accounts→Apps→DaVinci→…) · Chrome two-profiles
- **/creatives:** anatomy of a creative (blocks→type→variations→vertical) (+1 more)
- **/resources:** reskin-trending-video flow

---

## 9. The skills relationship (context — usually NOT a hub-dev task)

The hub is the **3rd mirror** of PFM's skills. Source of truth chain:
`local ~/.claude/skills/<skill>/` → Lucid `/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/skills/<skill>/` → **hub `public/skills/<skill>/SKILL.md`** (what editors download).

- **16 skills currently served** (`public/skills/`): audio-qc, breaking-news-story-ads, hig-flow, higgsfield-image-generation, hvg-flow, lc-to-video-podcast, nano-banana-prompting, notion-asset-delivery, propose-skill, reskin-trending-video, story-beats, suno-songwriter, ugc-cinematic-prompt, veo-script-writing, visual-qc, vsl-state-variations.
- **The skill *catalog cards* on the site** come from **`content/skills.ts`** (fields incl. `name`, `title`, `description`, `category`, `worksIn: ["code"|"cowork"]`). `skills.ts` drives `SkillsSection` AND the dynamic `{skills.length}` counters in `Overview.tsx` — **never hardcode the skill count**, it reads from the array.
- **Cowork plugin:** `public/pfm-cowork-skills.plugin` bundles the 6 `worksIn:"cowork"` chat-mode skills. **Rebuild when a chat-mode skill's SKILL.md changes:** `bash scripts/build-cowork-plugin.sh` (sources `public/skills/`, **hard-fails if any bundled skill's frontmatter `description` > 1024 chars** — Cowork's validation limit), then commit the regenerated `.plugin`.
- **Boundary:** changing a skill's *behavior* is done locally + synced through Lucid, not here. The hub side of a skill change is: update `public/skills/<skill>/SKILL.md` (mirror), update its `content/skills.ts` card if the description/category changed, rebuild the plugin if it's chat-mode, add a `CHANGELOG.md` entry.

---

## 10. Common change recipes

| Task | Touch |
|---|---|
| **Add/edit a diagram** | The §8 loop, in the relevant section component or page |
| **Add a changelog entry** | Prepend a `## YYYY-MM-DD` block (with `### Title` + body) to the TOP of `content/CHANGELOG.md`. `ChangelogSection` shows the latest 5 inline + archives the rest; the `/claude` "Update my skills" hero auto-surfaces the newest entry's `### ` title. |
| **Add/edit a skill card** | `content/skills.ts` (and `public/skills/<skill>/SKILL.md` if mirroring a real skill) |
| **Add/rename a page section** | Edit the section/page JSX, give it `id="x" className="scroll-mt-8"`, and add `{href:"#x"}` to that page's `subLinks` in `Nav.tsx` |
| **Add a nav page** | `pages[]` + `subLinks` + `baseRoute()` in `Nav.tsx`, plus `app/<route>/page.tsx` |
| **Edit the update/install commands** | `app/claude/page.tsx` (Update hero `CopyBlock`s), `SetupMac.tsx` / `SetupWindows.tsx`. Editor-facing commands use the **full quoted Lucid path** (`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`). |
| **Add a download** | Drop the file in `public/`, link with `<a href="/file" download>` |
| **Creative Library content** | `content/creatives.ts` |
| **Resources content** | `content/landers.ts` + `app/resources/page.tsx` |

---

## 11. Conventions + gotchas (the stuff that bites)

- **Commit only on Sam's "run."** (Restated because it's the #1 rule.) He pushes; Railway deploys main automatically.
- **`tsc --noEmit` clean before showing Sam** — and capture the exit code directly (zsh `$PIPESTATUS` is broken here).
- **Render-verify SVGs** via `qlmanage` → PNG → Read before committing. Don't eyeball-in-head.
- **Unique SVG marker IDs per page.** Drop the dark bg `<rect>` when porting /tmp SVG → JSX.
- **Never hardcode skill count** — use `{skills.length}`.
- **Rebuild the Cowork plugin** when a chat-mode skill changes; keep descriptions ≤ 1024 chars.
- **No credentials on the hub.** It's editor-facing/effectively public — never put logins, API keys, workspace UUIDs, or account passwords in the site. Logins are shared via 1Password, not here.
- **Copy hygiene:** watch for smart-quotes breaking `CopyBlock` commands; em dashes are fine in *site copy* (unlike Veo/Suno rules).
- **`scroll-mt-8`** on anchor-target sections so the sticky nav doesn't cover headings on jump.
- Use **named theme classes** (`bg-surface`, `text-muted`, `border-border`), not raw hex, in `className`. Raw hex only inside `<svg>`.

---

## 12. Current state (as of 2026-06-03)

- Working tree **clean**, on `main`, synced with `origin/main`. Live + deployed.
- **4 pages, ~14 diagrams, 16 skills served.**
- **Latest changelog: 2026-06-02** — two new skills `reskin-trending-video` + `ugc-cinematic-prompt` (came through the `propose-skill` inbox, captured from Drake — the first real contributions through that pipeline).
- Recent commits (newest first): `bf8e763` add 4 diagrams + freshness pass · `a0f9217` add reskin + ugc skills · `8b2e00f` add 6 themed SVG diagrams · `fe5d8b7` editor pipeline diagram · `fb37650`/`e3a70d5` Cowork plugin rename + 1024-char fix · `5b9bf88`/`86a7552`/`306f96d`/`e7f3b0b` the how-it-works SVG conversions · `cacc1cc` propose-skill + system diagram.
- **This file replaced a stale task-specific `_HANDOFF.md`** (it had been left over from the "6 diagrams" build, which is now shipped). This version is the standing channel charter.

---

## 13. How to start in this channel

1. Open the repo in VS Code (File → Open Folder → `pfm-claude-hub`), or `cd` in.
2. Run `claude` in the integrated terminal (`claude --remote-control` if you want phone access).
3. Read this file. Then make the change → typecheck → render-verify any SVG → **show Sam → wait for "run"** → commit + push → Railway ships in ~2 min.
