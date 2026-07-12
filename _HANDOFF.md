# PFM Editors Hub — web-app handoff

> Standing charter for work on the editor-facing hub. Updated 2026-07-12 after the registry/distribution audit.

## What this repo is

The PFM Editors Hub is the team home base for the Claude production system.

- **Repo:** `/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub`
- **Live:** `https://pfm-claude-hub-production.up.railway.app`
- **Deploy:** Railway auto-deploys pushes to `main`
- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 3, `marked`

Current pages:

- `/` — system status, Mac/Windows updater, and route cards
- `/workflow` — production flow, setup, asset-gen lanes, editor tools, changelog (`/claude` redirects here)
- `/skills` — updates, canonical 63-entry tracker, downloads, and Cowork bundle
- `/creatives` — the locked 07.11.26 Notion property taxonomy and naming renderings
- `/resources` — landers, shared assets, SOPs, plus unfinished tools/brand sections
- `/onboarding` — first-day setup and training path

## Golden workflow rule

**Do not commit or push until Sam says `run`.**

Normal loop:

1. Make the change locally.
2. Run TypeScript and relevant tests.
3. Browser-check desktop and mobile.
4. Show Sam the result.
5. Wait for `run`.
6. Commit + push; Railway deploys automatically.

## Canonical skills architecture

There is one hub registry:

`content/skillsRegistry.ts`

It drives:

- `/skills` tracker, filters, statuses, audit date, and downloads
- Cowork-ready count and plugin membership
- Cowork plugin membership
- Public skill download paths

Current audited state:

- 63 tracked registry entries
- 42 `tier: "live"` team-distributed skills
- 8 Cowork skills
- 8 rows marked as workflows
- Audit date: 2026-07-11

`content/skills.ts` is a compatibility re-export only. Never add catalog data there.

### Skill download invariant

Every `tier: "live"` registry row must resolve to:

`public/skills/<skillFolder>/SKILL.md`

The registry helper `skillFolder()` strips human-readable trigger annotations. A rendered download must never point to a missing file. Sync the full source skill directory so references/scripts are available when needed, not only the top-level `SKILL.md`.

### Cowork invariant

`coworkSkillFolders` in `content/skillsRegistry.ts` is the one membership list. `scripts/build-cowork-plugin.sh` parses that array and must not contain a second hardcoded list.

Rebuild after any bundled skill changes:

```bash
bash scripts/build-cowork-plugin.sh
```

The page count, bundle count, archive contents, plugin description, and README must agree.

## Current source map

```text
app/
  layout.tsx              shell, metadata, top nav, footer
  page.tsx                Dashboard
  workflow/page.tsx       System flow/setup/asset-gen/editor/changelog
  claude/page.tsx         Compatibility redirect to /workflow
  skills/page.tsx         Updaters + interactive canonical registry + downloads/plugin
  creatives/page.tsx      Notion creative taxonomy and naming convention
  resources/page.tsx      Landers/resources/SOPs
  onboarding/page.tsx     First-day guide

components/
  Nav.tsx                 six-item sticky top navigation
  CopyBlock.tsx           copyable terminal commands
  PageHero.tsx            shared page heading
  PlaceholderCard.tsx     intentionally unfinished resource cards
  sections/               Workflow-page system/setup/editor sections

content/
  skillsRegistry.ts       SINGLE canonical skills dataset
  skills.ts               compatibility re-export only
  creatives.ts            Locked Notion property/naming model (07.11.26)
  editorTools.ts          DaVinci/editor tools
  landers.ts              lander URLs by vertical
  CHANGELOG.md            newest-first shipped changes

public/
  skills/<name>/          downloadable team-live skill mirrors
  pfm-cowork-skills.plugin
  PFM-Editor-SOP-Claude-Team-Switch.pdf
```

## Design system

Current look: **Persimmon Clean** — warm stone light mode plus a charcoal dark mode, both driven by CSS-variable Tailwind tokens. The top-right toggle persists in `localStorage` under `pfm-hub-theme`; an inline pre-paint script prevents a light flash on saved dark sessions. Both modes keep the centered orange/charcoal masthead, hard-shadow cards, Playfair headings, Inter body, and JetBrains Mono labels.

Use tokens from `tailwind.config.ts`; avoid new raw hex values in `className`. Existing SVGs use explicit palette values because Tailwind classes do not style SVG text reliably.

Navigation is a universal sticky top toolbar on desktop and mobile. Check the 390px layout whenever nav labels or page count changes.

## Verification

TypeScript:

```bash
OUT=$(npx --no-install tsc --noEmit 2>&1); TS=$?; echo "exit=$TS"; echo "$OUT"
```

The old `next lint` command is invalid in Next.js 16. Keep the package script wired to an actual ESLint invocation once ESLint/config is installed.

Production build:

```bash
npm run build
```

The current `next/font/google` setup fetches Inter, JetBrains Mono, and Playfair Display at build time. A network-restricted build will fail until those fonts are self-hosted; distinguish that from a TypeScript/application failure.

For browser QA, inspect the local app at desktop width and around 390×844 mobile. Verify:

- All six routes load.
- `/skills` reports 63 tracked / 42 live / 8 Cowork and exposes 42 downloads.
- Search/filter/expand behavior works.
- Every rendered skill download returns a file, never the Next 404.
- The Cowork count matches the plugin archive.
- No page-wide horizontal overflow.

## Content and safety rules

- Never put credentials, account passwords, API keys, workspace IDs, or private tokens on the hub.
- Landers are maintained in `content/landers.ts`; Sam is collecting the authoritative links. Do not guess or fill the unfinished Resources sections without his source URLs.
- Creative taxonomy and naming copy must follow the locked 07.11.26 Notion update: structured properties, three renderings, invisible defaults, max-two Creative Type stack, and explicit Parent Creative/reuse lineage.
- Changelog entries are newest-first and should accompany editor-visible releases.
- Keep the master brief in `../PFM CONTEXT/CLAUDE.md` aligned when architecture or scope changes materially.
- Skill behavior changes belong in the actual skill source and distribution workflow. A website-only copy edit must not pretend the installed skill changed.

## Known follow-ups after the July audit

- **Next major hub pass: Resources needs a full overhaul.** Revisit its information architecture, categories, copy, and presentation as one project—not merely filling the current Tools & logins / Brand placeholders. Sam still needs to gather the authoritative lander and resource links before that pass.
- **Replace the Railway URL with a real PFM subdomain.** Preferred: `editors.powerfoxmedia.com`; fallback: `hub.powerfoxmedia.com`. Keep the Railway domain only as the deployment origin/fallback and update hub docs once DNS + Railway custom-domain verification are complete.
- Mobile top-nav targets are cramped and below the preferred 44px touch height.
- Skills table sorting and row expansion need stronger keyboard/ARIA semantics.
- `npm run lint` needs a real ESLint setup for Next.js 16.
- Self-host the three fonts if offline/restricted builds need to be supported.

---

*This file supersedes the June four-page / 16-skill handoff.*
