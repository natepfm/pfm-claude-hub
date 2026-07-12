# PFM Editors Hub

The editor-facing home base for Power Fox Media's Claude production system.

Live: [pfm-claude-hub-production.up.railway.app](https://pfm-claude-hub-production.up.railway.app)

## Pages

- **Dashboard** (`/`) — system status, latest release, and Mac/Windows update commands
- **Workflow** (`/workflow`) — request-to-delivery system, setup, generation lanes, editor tools, changelog
- **Skills** (`/skills`) — updates, canonical 63-entry tracker, downloads, and Cowork plugin
- **Creatives** (`/creatives`) — locked Notion property taxonomy and Full/Display/Compact naming
- **Resources** (`/resources`) — landers, shared assets, and SOPs
- **Onboarding** (`/onboarding`) — first-day setup and training path

## Stack

- Next.js 16 / React 19 / App Router
- TypeScript
- Tailwind CSS 3
- `marked` for the changelog
- Railway hosting from `main`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Typecheck before review:

```bash
OUT=$(npx --no-install tsc --noEmit 2>&1); TS=$?; echo "exit=$TS"; echo "$OUT"
```

Production build:

```bash
npm run build
```

## One canonical skills registry

All skill-facing surfaces derive from:

`content/skillsRegistry.ts`

It controls the Skills tracker, statuses, Cowork membership, and public download paths. `content/skills.ts` is a compatibility re-export; do not add data there.

Current audited state: 63 tracked entries, 42 team-live skills, 8 Cowork skills, 8 workflows.

Every team-live row must have:

`public/skills/<folder>/SKILL.md`

The Cowork bundle is rebuilt from the canonical `coworkSkillFolders` list:

```bash
bash scripts/build-cowork-plugin.sh
```

## Common content locations

| File | Purpose |
|---|---|
| `content/skillsRegistry.ts` | Canonical skills/status/Cowork data |
| `content/CHANGELOG.md` | Newest-first editor-visible releases |
| `content/creatives.ts` | Locked 07.11.26 Notion property and naming model |
| `content/landers.ts` | Lander URLs by vertical |
| `content/editorTools.ts` | DaVinci/editor tool cards |
| `public/skills/` | Downloadable team skill mirrors |
| `public/pfm-cowork-skills.plugin` | Cowork plugin artifact |

## Shipping

Railway auto-deploys every push to `main`. Project rule: build and verify locally, show Sam, and commit/push only after he says **run**.

See [`_HANDOFF.md`](./_HANDOFF.md) for the full maintenance contract and current known follow-ups.
