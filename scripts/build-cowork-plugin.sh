#!/usr/bin/env bash
# Rebuild the PFM Cowork skills plugin bundle from the CURRENT hub SKILL.md sources.
#
#   Run from anywhere:   bash scripts/build-cowork-plugin.sh
#
# It bundles every chat-mode (Cowork-capable) skill — i.e. every skill whose
# worksIn includes "cowork" in content/skills.ts — into public/pfm-cowork-skills.plugin,
# pulling each SKILL.md fresh from public/skills/ so the bundle is never stale.
# After running, commit the regenerated .plugin and push.
set -euo pipefail

HUB="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_SRC="$HUB/public/skills"
NAME="pfm-cowork-skills"
VERSION="1.2.0"
OUT="$HUB/public/$NAME.plugin"

# The chat-mode skills — keep in sync with worksIn:"cowork" in content/skills.ts
COWORK_SKILLS=(veo-script-writing breaking-news-story-ads nano-banana-prompting story-beats lc-to-video-podcast suno-songwriter)

TMP="$(mktemp -d)"
STAGE="$TMP/$NAME"
mkdir -p "$STAGE/.claude-plugin" "$STAGE/skills"

cat > "$STAGE/.claude-plugin/plugin.json" <<JSON
{
  "name": "$NAME",
  "version": "$VERSION",
  "description": "Power Fox Media's chat-mode skills — every skill that runs in Cowork with no terminal, filesystem, or Higgsfield CLI: Veo script formatting, breaking-news ad framing, Nano Banana / Higgsfield prompting, podcast-style LC adaptation, PFM story beats, and Suno ad-to-song prompts.",
  "author": { "name": "Power Fox Media" }
}
JSON

cat > "$STAGE/README.md" <<'MD'
# PFM Cowork Skills

A Claude / Cowork plugin bundling **every Power Fox Media skill that runs in Cowork chat mode** — for non-editor team members (writers, strategists, MBs) with no terminal, no filesystem, and no Higgsfield CLI.

## What's included (all chat-mode skills)

| Skill | Use it when |
|---|---|
| **veo-script-writing** | Drafting / reviewing Veo 3.1 story-ad scripts; rebalancing into per-clip lines; formatting dialogue |
| **breaking-news-story-ads** | Wrapping a story ad as a local 6pm news segment (LATU News); anchor copy, field reporter packages, chyrons |
| **nano-banana-prompting** | Nano Banana Pro prompts — social-proof images, character-consistent scenes, candid iPhone-style photos |
| **story-beats** | Beating out a PFM story ad from a reference or original idea — 6-beat baseline with dialogue anchors |
| **lc-to-video-podcast** | Converting a Facebook long-copy ad into a Veo-numbered podcast monologue script |
| **suno-songwriter** | Turning an ad script into a Suno v5 song — lyrics + style block |

## What's NOT included (and why)

The editor pipeline skills (`hvg-flow`, `hig-flow`, QC, delivery, etc.) are intentionally excluded — they need the Higgsfield CLI, Lucid Link, and local Bash/Python, so they only run in **Claude Code on an editor's Mac** and would fail in Cowork's hosted chat mode.

## Install / update

1. Upload this `.plugin` to your Cowork org's plugin library (or the individual `SKILL.md` files).
2. Team members see the skills under **Customize skills**.
3. To update: re-download the latest bundle from the hub and re-upload — Cowork keeps only the last-uploaded copy.

## Maintenance (Sam)

Rebuild with `bash scripts/build-cowork-plugin.sh` from the hub repo whenever a chat-mode skill changes (it pulls each current `SKILL.md` from `public/skills/`), then commit the regenerated `.plugin` and push. Source of truth: `~/.claude/skills/<skill>/SKILL.md`, mirrored to Lucid Link + the hub.

---

*Power Fox Media*
MD

for s in "${COWORK_SKILLS[@]}"; do
  if [ ! -f "$SKILLS_SRC/$s/SKILL.md" ]; then
    echo "ERROR: missing source SKILL.md for '$s' at $SKILLS_SRC/$s/SKILL.md" >&2
    exit 1
  fi
  # Cowork plugin validation rejects any skill whose frontmatter description > 1024 chars.
  dlen=$(python3 - "$SKILLS_SRC/$s/SKILL.md" <<'PY'
import sys, re
fm = open(sys.argv[1], encoding='utf-8').read().split('---')
fm = fm[1] if len(fm) >= 3 else ''
m = re.search(r'(?m)^description:\s*(.+(?:\n(?!\w+:).*)*)', fm)
print(len(m.group(1).strip()) if m else 0)
PY
)
  if [ "$dlen" -gt 1024 ]; then
    echo "ERROR: '$s' description is $dlen chars — over Cowork's 1024-char skill-description limit. Trim it before bundling." >&2
    exit 1
  fi
  mkdir -p "$STAGE/skills/$s"
  cp "$SKILLS_SRC/$s/SKILL.md" "$STAGE/skills/$s/SKILL.md"
done

rm -f "$OUT"
( cd "$TMP" && zip -rq "$OUT" "$NAME" )
rm -rf "$TMP"
echo "Built $OUT (v$VERSION, ${#COWORK_SKILLS[@]} skills)"
