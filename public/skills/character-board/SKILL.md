---
name: character-board
description: Refresh the AI Characters flat "masters board" — copy a single at-a-glance tile per character (plus distinct family members) from Character Library into AI Characters/, so the whole roster is browsable in one Finder window. Use when the editor says "refresh the character board", "rebuild the masters board", "update the AI Characters board", "add the new characters to the board", "regenerate the character tiles", or after new character folders get added to Character Library. Idempotent — only NEW (not-yet-boarded) characters are processed; existing tiles are never touched or overwritten. NOT for building a character master itself (pfm-character-master / character-studio), JRE placements (jre-swap), or any gen.
---

# character-board — flat masters board refresher

Keeps **`AI Characters/`** as a flat, at-a-glance index of every character master, sourced from **`Character Library/`**.

- **Source (read-only):** `…/AI Generation Assets - PFM/Character Library/` — one folder per character. **Never modified.**
- **Board (destination):** `…/AI Generation Assets - PFM/AI Characters/` — flat tiles, one per character. Its pre-existing **subfolders stay untouched** (Cops, Interviewers, JRE Characters [the `jre-swap` source], Studio Anchors, etc.). This is **option A**, locked by Sam 2026-06-22.

## Locked rules (how a tile is chosen)
1. **One tile per character**, renamed to the **folder name** (e.g. `Blake Anderson - Auto.png`) so it's scannable.
2. **Distinct family members → their own tile, clustered under the lead:** `Christian Hall - Auto Home.png`, `Christian Hall - Auto Home (Wife).png`, `… (Brother).png`. They share the lead's prefix so they sort together. (Sam: "2 — include family, and rename so they stay together alphabetically.")
3. **Collapse versions** — `v01/v02/9x16/ES/"NOT grey BG"/hash` of the same person → ONE tile (highest version). Never 6 near-dupes of one face.
4. **Skip group composites** — "Jason + Wife", "Holloway Family", "Wife + Kids" (not single-character masters).
5. **Skip non-character folders** — `State Pixar Mascots` (50-mascot set, would flood), `Sam Reference Images`, `Todd Reference Images` (raw dumps). Edit `SKIP` in the script to change.
6. **Scene-heavy folders** (no file named "master") → pick the best front portrait by keyword score; if there's no clean portrait, **flag it for a manual pick** instead of boarding a prop/scene shot.

## Run it
```bash
python3 ~/.claude/skills/character-board/build_board.py dry    # preview: already-boarded / NEW / flagged
python3 ~/.claude/skills/character-board/build_board.py copy   # copy the NEW tiles in
```
- Always **dry first**, eyeball the NEW tiles + flags, then `copy`.
- It only adds NOT-yet-boarded characters; existing tiles are skipped (no overwrite).
- **Flagged folders** (no clean portrait, e.g. a character whose folder is all b-roll): resolve by hand — find the real master (often in the character's project folder under `Elements/Footage/Reference/`) and `cp` it in as `<folder name>.png`, or add a `OVERRIDES` entry in the script.

## After a refresh
Report what landed and give the Lucid handoff (📁/🔗/🦊) for the board folder:
- **📁 Path:** `/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/AI Generation Assets - PFM/AI Characters`
- **🔗 Open:** `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<that path>"`
- **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)

See [[project_character_board]] for the build history and the v1 roster.
