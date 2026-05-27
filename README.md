# PFM Claude Hub

The web dashboard for Power Fox Media editors — setup walkthroughs, skill updates, account migration, and changelog. Replaces the editor SOP PDFs.

Live at: _(set after first Railway deploy)_

---

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Markdown changelog rendered server-side
- Hosted on Railway, auto-deployed from GitHub

---

## Publishing this repo (first-time, via GitHub Desktop + Railway)

Same flow you used for HVG.1. ~10 minutes.

### 1. Publish to GitHub via GitHub Desktop

1. Open **GitHub Desktop**
2. **File → Add local repository** → select this folder (`/Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub/`)
3. GitHub Desktop will say "this is not a git repository — would you like to create one?" → click **Create repository**
4. Set the name to `pfm-claude-hub`, leave defaults
5. Click **Publish repository** in the top-right
6. Keep it **Private** (uncheck "keep this code private" if you want public; private is fine for an internal tool)
7. Repo is now live at `github.com/<your-handle>/pfm-claude-hub`

### 2. Deploy to Railway

1. Open [railway.app](https://railway.app) → log in
2. **New Project → Deploy from GitHub repo**
3. Pick `pfm-claude-hub`
4. Railway auto-detects Next.js via Nixpacks and starts the first build (~3-5 min)
5. Once green, click **Settings → Domains → Generate Domain** to get a `*.up.railway.app` URL
6. (Optional) Add a custom domain like `claude.powerfoxmedia.com` — Railway gives you the DNS records to add

That's it. Site is live.

---

## Updating the Hub (ongoing)

Anytime you want to ship a change — new changelog entry, skill description tweak, new section in setup docs — the loop is:

1. Edit the relevant file locally (any text editor — VS Code, Cursor, etc.)
2. Save
3. Open **GitHub Desktop** — it shows the diff
4. Write a 1-line commit message → **Commit to main** → **Push origin**
5. Railway picks up the push automatically and redeploys (~2 min)
6. Refresh the live site — change is live

No CLI, no `git` commands. Just save → commit → push.

---

## What lives where

| File | What you'd change |
|---|---|
| `content/CHANGELOG.md` | New skill update, new feature shipped. Most-frequently edited file. |
| `content/skills.ts` | Add or update a skill in the Skills section. |
| `app/page.tsx` | Top-of-page hero + Quick Actions. |
| `components/sections/SetupMac.tsx` | Mac setup walkthrough section. |
| `components/sections/SetupWindows.tsx` | Windows setup walkthrough section. |
| `components/sections/SkillsSection.tsx` | Skills reference + download buttons. |
| `components/sections/Troubleshooting.tsx` | Common-error fixes section. |
| `components/sections/ChangelogSection.tsx` | Renders content/CHANGELOG.md inline. |
| `public/skills/<name>/SKILL.md` | The downloadable version of each skill (served on the Skills page). Re-copy from `~/.claude/skills/` when a skill changes — see "Syncing skills" below. |
| `public/pfm-writing-skills.plugin` | The Cowork plugin bundle. Rebuild from the source skills when text-only skills change. |
| `tailwind.config.ts` | Theme colors (currently black/white/orange — PFM brand). |

---

## Syncing skills when they change

When a skill is updated (in `~/.claude/skills/<name>/SKILL.md`), the changes need to land in three places in this repo:

1. **`public/skills/<name>/SKILL.md`** — the downloadable copy on the Skills page.
2. **`public/pfm-writing-skills.plugin`** — the Cowork bundle (only if a `cowork`-tagged skill changed).
3. **`content/CHANGELOG.md`** — note what changed and why.

Quick sync command for the file copies (run from this repo's root):

```bash
# Copy individual SKILL.md files
for s in hvg-flow hig-flow veo-script-writing lc-to-video-podcast breaking-news-story-ads nano-banana-prompting higgsfield-image-generation audio-qc visual-qc story-beats; do
  cp ~/.claude/skills/$s/SKILL.md public/skills/$s/SKILL.md
done

# Copy rebuilt Cowork plugin
cp "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/pfm-writing-skills.plugin" public/pfm-writing-skills.plugin
```

Then commit + push via GitHub Desktop as usual.

---

## Local development (optional)

If you want to preview changes locally before pushing:

```bash
cd /Users/samschiller/Documents/CLAUDE/Projects/pfm-claude-hub
npm install
npm run dev
# Visit http://localhost:3000
```

`npm install` only needs to run once. After that, just `npm run dev` and you'll see your edits live-reload in the browser.

---

## Conventions

- **Changelog format:** `## YYYY-MM-DD` headers, `### <area> — <short title>` subheaders. Render order is newest-first.
- **Black/white/orange theme:** defined in `tailwind.config.ts`. Don't introduce new accent colors without updating that file.
- **Copy-paste only:** every command on the site uses the `CopyBlock` component for one-click copy. No URL schemes or native helpers — keeps the site simple and transparent.

---

*Built for Power Fox Media. Maintained by Sam.*

