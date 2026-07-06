# Human Ad Copy: the Claude skill from the video

This is the exact skill I built on camera. It makes Claude write ad copy that does not
sound like AI, using the 15 frameworks and the AI-tell checklist from the playbook.

## Install (Claude Code)

1. Unzip this folder.
2. Move the `human-ad-copy` folder into your project's `.claude/skills/` directory. If you
   do not have that directory yet, create it, so you end up with `.claude/skills/human-ad-copy`.
3. Restart Claude Code. It finds the skill on its own.

## Use it

- Paste a draft and say "check this for AI tells", or ask Claude to "write this ad with my
  First Person framework".
- Or run the scanner on any text file yourself:
  `bash human-ad-copy/scripts/ai-tell-scan.sh your-copy.txt`

## What is inside

- `SKILL.md`: the rules Claude follows on every draft.
- `references/ai-tells.md`: the full catalog of AI-writing tells, adapted for ads.
- `references/copy-frameworks.md`: the 15 frameworks, with a clean example each.
- `scripts/ai-tell-scan.sh`: a mechanical scan that flags tells in a draft.

Built by Caleb Kruse, Mr. Paid Social. The tools I use daily, a swipe library of ~1,700
real ads, and monthly calls with seven-figure buyers live in The Ai Ads Alchemists.
500+ media buyers, $97/mo: skool.com/mrpaidsocial
