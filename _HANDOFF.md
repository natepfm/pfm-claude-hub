# PFM Editors Hub — web-app handoff

> Standing charter for work on the editor-facing hub. Updated 2026-07-26 after the single-page + auth rebuild.

## What this repo is

The PFM Editors Hub is the team's updater and skill catalog.

- **Repo:** `/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub`
- **Live:** `https://pfmhub.up.railway.app` — this is the ONLY live domain. `pfm-claude-hub-production.up.railway.app` is dead and returns Railway's "Application not found"; do not health-check against it.
- **Deploy:** Railway auto-deploys pushes to `main`
- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 3, Auth.js (next-auth v5)

**The hub is ONE page.** Sam collapsed it on 2026-07-26 because the site was public and exposing internal material. Everything that used to live here — workflow, creative taxonomy, onboarding, resources — now lives in **Notion**, which is access-controlled. Do not re-add pages without Sam asking.

- `/` — the updater (Mac + Windows) and the canonical skill catalog. Auth required.
- `/login` — Google sign-in, restricted to `@powerfoxmedia.com`.
- `/workflow`, `/skills`, `/creatives`, `/resources`, `/onboarding`, `/claude` — thin `redirect("/")` stubs kept only so old Slack/Notion links don't 404. They hold no content.

## Golden workflow rule

**Do not commit or push until Sam says `run`.**

1. Make the change locally.
2. Run TypeScript and the production build.
3. Browser-check desktop and mobile.
4. Show Sam the result.
5. Wait for `run`.
6. Commit + push; Railway deploys automatically.

## Authentication — BUILT, NOT CURRENTLY WIRED

The hub is **open** right now. Sam parked the Google/Railway setup on 2026-07-26, so the gate was removed from `main` the same day it shipped.

**The working implementation is preserved in commit `e7de887`.** To bring it back:

```bash
git checkout e7de887 -- auth.ts proxy.ts app/login app/api/auth
```

then restore the server gate in `app/page.tsx` and the sign-out action in `app/layout.tsx` / `components/Nav.tsx` (also in that commit), and set the env vars below **before** deploying — the gate is useless without them and locks everyone out at the login screen.

`next-auth` is still in `package.json`, so no reinstall is needed.

The rest of this section describes that implementation.

Google OAuth via Auth.js v5. **Only Google-verified `@powerfoxmedia.com` accounts get in.**

Two independent gates — do not remove either:

1. **`proxy.ts`** (Next 16's renamed middleware) gates *every* path except `/login`, `/api/auth/*`, `/brand/*`, and build assets. This is the only thing protecting static files in `public/` — the skill markdown under `/skills/**`, the Cowork `.plugin`, `lander.html`, and the SOP PDF — because static files never run page code.
2. **`app/page.tsx`** re-checks the session server-side before rendering the catalog, so a proxy failure alone does not expose content.

`auth.ts` holds the config. The `hd` param on the Google provider is only a UX hint and is spoofable — **the real boundary is the `signIn` callback**, which rejects any unverified email or any address not ending in `@powerfoxmedia.com`. Keep it that way.

Next.js is pinned at **≥16.2.12**; earlier 16.x had a published middleware/proxy bypass that would defeat gate 1.

### Environment variables

Set on Railway (and in `.env.local` for local dev). See `.env.example`. **Never commit real values** — `.gitignore` covers `.env*` with an exception for the template.

| Variable | Where it comes from |
| --- | --- |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google Cloud Console OAuth client |
| `AUTH_GOOGLE_SECRET` | Google Cloud Console OAuth client |
| `AUTH_URL` | Production origin (Railway/custom domain) |

Authorized redirect URIs on the Google OAuth client must include
`https://<production-domain>/api/auth/callback/google` and, for local work,
`http://localhost:3000/api/auth/callback/google`.

## Canonical skills architecture

One registry drives the catalog:

`content/skillsRegistry.ts`

It drives the tracker, filters, statuses, audit date, downloads, Cowork membership, and counts.

### Skill download invariant

Every `tier: "live"` row must resolve to `public/skills/<skillFolder>/SKILL.md`. The registry helper `skillFolder()` strips human-readable trigger annotations. A rendered download must never point at a missing file.

### Cowork invariant

`coworkSkillFolders` in `content/skillsRegistry.ts` is the one membership list. `scripts/build-cowork-plugin.sh` parses that array and must not carry a second hardcoded list. Rebuild after any bundled skill changes:

```bash
bash scripts/build-cowork-plugin.sh
```

## Current source map

```text
auth.ts                   Auth.js config + the @powerfoxmedia.com gate
proxy.ts                  Request gate for every path incl. public/ files
app/
  layout.tsx              shell, fonts, theme script, masthead, sign-out action
  page.tsx                server auth gate → renders the catalog
  login/page.tsx          Google sign-in, domain-restricted
  api/auth/[...nextauth]/ Auth.js handlers
  {workflow,skills,creatives,resources,onboarding,claude}/  redirect stubs
components/
  SkillCatalog.tsx        the client catalog: updater, stats, filters, table
  Nav.tsx                 masthead: logo, sign-out, theme toggle
  CopyBlock.tsx           copyable terminal commands
  PageHero.tsx            shared page heading
content/
  skillsRegistry.ts       SINGLE canonical skills dataset
  CHANGELOG.md            retained, no longer rendered on the hub
public/
  skills/<name>/          downloadable skill mirrors (gated by proxy.ts)
  pfm-cowork-skills.plugin
  brand/                  masthead logos (intentionally ungated)
```

## Design system

**Persimmon Clean v3** — warm stone light mode plus a charcoal dark mode, driven by CSS-variable Tailwind tokens. Playfair headings, Inter body, JetBrains Mono labels, ink borders with hard offset shadows, fully square corners. The top-right toggle persists in `localStorage` under `pfm-hub-theme`; an inline pre-paint script prevents a light flash.

Use tokens from `tailwind.config.ts`; avoid new raw hex in `className`. Navigation is a single sticky masthead — there is no page nav, because there is one page.

## Verification

```bash
npx --no-install tsc --noEmit
npm run build
```

`next/font/google` fetches Inter, JetBrains Mono, and Playfair at build time; a network-restricted build fails on fonts, which is not an application error.

Browser QA at desktop and ~390×844. Verify:

- Signed out, every path 302s to `/login` — including `/skills/**/SKILL.md`, the `.plugin`, `lander.html`, and the SOP PDF.
- The unauthenticated `/` response body carries no catalog content.
- Signed in with a PFM account: catalog loads, search/filter/sort/expand work, downloads return files.
- A non-PFM Google account is rejected and lands on `/login?error=AccessDenied`.
- No page-wide horizontal overflow.

## Content and safety rules

- Never put credentials, passwords, API keys, workspace IDs, or tokens on the hub or in the repo.
- The hub is the updater and the catalog. Everything else belongs in Notion.
- Skill behavior changes belong in the actual skill source and distribution workflow. A website copy edit must not pretend the installed skill changed.
- Keep the master brief in `../PFM CONTEXT/CLAUDE.md` aligned when architecture or scope changes materially.

## Known follow-ups

- **Verify the live Google sign-in round-trip** once the OAuth client and Railway variables exist — the code is untested against real credentials.
- **Replace the Railway URL with a real PFM subdomain.** Preferred `editors.powerfoxmedia.com`; update the Google authorized redirect URI and `AUTH_URL` at the same time.
- Optional hardening: serve skill files through an authenticated API route instead of `public/`, so they are not static assets at all.
- `content/CHANGELOG.md` is retained but no longer surfaced anywhere. Decide whether it returns as a section under the updater or moves to Notion.
- Skills table sorting/expansion needs stronger keyboard and ARIA semantics.
- `npm run lint` still needs a real ESLint setup for Next.js 16.

---

*Supersedes the 2026-07-12 six-page handoff.*
