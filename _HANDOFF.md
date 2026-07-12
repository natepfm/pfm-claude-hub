# PFM Editors Hub — web-app handoff

> Standing charter for work on the editor-facing hub. Updated 2026-07-12 after the registry/distribution audit.

## What this repo is

The PFM Editors Hub is the team home base for the Claude production system.

- **Repo:** `/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub`
- **Live:** `https://pfm-claude-hub-production.up.railway.app`
- **Deploy:** Railway auto-deploys pushes to `main`
- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 3, `marked`

Current pages:

- `/` — system dashboard and registry overview
- `/claude` — production flow, setup, catalog, editor tools, changelog
- `/skills` — the canonical filterable 63-entry skills tracker
- `/creatives` — creative types, variations, verticals, building blocks
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

- Dashboard counts and registry table
- `/skills` tracker, filters, statuses, and audit date
- `/claude#skills` team-live catalog
- Cowork-ready count
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
  claude/page.tsx         Claude workflow/setup/catalog/changelog
  skills/page.tsx         Interactive canonical registry
  creatives/page.tsx      Creative Library
  resources/page.tsx      Landers/resources/SOPs
  onboarding/page.tsx     First-day guide

components/
  Nav.tsx                 six-item sticky top navigation
  CopyBlock.tsx           copyable terminal commands
  PageHero.tsx            shared page heading
  PlaceholderCard.tsx     intentionally unfinished resource cards
  sections/               Claude-page workflow/setup/catalog sections

content/
  skillsRegistry.ts       SINGLE canonical skills dataset
  skills.ts               compatibility re-export only
  creatives.ts            Creative Library data
  editorTools.ts          DaVinci/editor tools
  landers.ts              lander URLs by vertical
  CHANGELOG.md            newest-first shipped changes

public/
  skills/<name>/          downloadable team-live skill mirrors
  pfm-cowork-skills.plugin
  PFM-Editor-SOP-Claude-Team-Switch.pdf
```

## Design system

Current look: **Persimmon Clean** — warm stone canvas, white cards, black rules/hard shadows, orange accent, Playfair headings, Inter body, JetBrains Mono labels.

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
- Registry counts match across `/`, `/skills`, and `/claude`.
- Search/filter/expand behavior works.
- Every rendered skill download returns a file, never the Next 404.
- The Cowork count matches the plugin archive.
- No page-wide horizontal overflow.

## Content and safety rules

- Never put credentials, account passwords, API keys, workspace IDs, or private tokens on the hub.
- Landers are maintained in `content/landers.ts`; Sam is collecting the authoritative links. Do not guess or fill the unfinished Resources sections without his source URLs.
- Changelog entries are newest-first and should accompany editor-visible releases.
- Keep the master brief in `../PFM CONTEXT/CLAUDE.md` aligned when architecture or scope changes materially.
- Skill behavior changes belong in the actual skill source and distribution workflow. A website-only copy edit must not pretend the installed skill changed.

## Known follow-ups after the July audit

- Resources → Tools & logins and Brand & guidelines remain intentionally incomplete pending authoritative links/content from Sam.
- Mobile top-nav targets are cramped and below the preferred 44px touch height.
- Skills table sorting and row expansion need stronger keyboard/ARIA semantics.
- `npm run lint` needs a real ESLint setup for Next.js 16.
- Self-host the three fonts if offline/restricted builds need to be supported.

---

*This file supersedes the June four-page / 16-skill handoff.*
