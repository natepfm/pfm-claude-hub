---
name: propose-skill
description: "[editor-facing] Capture a repeatable workflow an editor discovered and submit it as a Skill Proposal for Sam to triage and build into the master PFM system. Use when an editor says \"propose a skill\", \"make this a skill\", \"create skill\", \"this should be a skill\", \"I keep doing this\", \"capture this workflow\", \"save this as a skill idea\", \"make this repeatable for the team\", \"submit a skill\", or otherwise notices they have a repeatable process worth turning into a skill. The skill reconstructs the workflow from the CURRENT session (or interviews the editor if it's a manual process not yet done in Claude), fills gaps with a few targeted questions, writes a structured Workflow Proposal markdown to the shared Lucid Link inbox (6. Claude PFM/Skill Proposals/), and tells the editor Sam will triage it. Editors never write a SKILL.md — Claude captures everything. NOT for: building/editing actual skills (that's Sam + skill-creator on the master machine), running gen flows, or anything other than capturing a workflow idea."
---

# propose-skill — capture a workflow, submit it for the master system

PFM editors discover repeatable workflows in their own project areas every day. This skill captures one as a **Skill Proposal** and drops it in the shared inbox so Sam can turn the good ones into real skills — the same way the rest of the system gets built. It's how your day-to-day know-how becomes team tooling.

**You (the editor) never write code or a SKILL.md.** Claude does all the writing — it was right there with you for the workflow, so it reconstructs it. You just answer a few quick questions.

## When to use
The moment you think *"I keep doing this exact thing"* — a repeatable, multi-step process you'd want Claude to do the same way every time. Say **"propose a skill"** / **"make this a skill"** / **"create skill"** / **"this should be a skill"** / **"capture this workflow."**

## What this skill does (silent except the few questions)
1. **Figure out the workflow.** Two cases:
   - **We just did it this session** → Claude reconstructs the steps, tools, inputs, and file conventions straight from the conversation. (Best case — richest capture; don't make the editor re-explain what you watched them do.)
   - **It's a manual process not yet done in Claude** → Claude interviews the editor to lay it out.
2. **Fill the gaps** — ask the editor (plain chat) only what you don't already know:
   - Their **name** (so they get credit when it ships)
   - The **trigger** — what would they say to kick this off?
   - **How often** they do it
   - **What changes each run** (the inputs / variables)
   - **Gotchas** — anything that breaks or needs care
   - Which **vertical / project area** it's for
3. **Compose the Skill Proposal** in the fixed template (below), filled in.
4. **Drop it in the shared inbox** on Lucid Link.
5. **Confirm** where it landed + a one-line recap. Done — Sam takes it from there.

## The Skill Proposal template (Claude fills this — the editor doesn't)
```
# Skill Proposal: <name>

- Proposed by: <editor>
- Date: <YYYY-MM-DD>
- Vertical / area: <...>
- Frequency: <how often>

## One-liner
<what it does in one sentence>

## Trigger — when should Claude run this?
<the phrases the editor would say + the situation that kicks it off>

## Steps (in order)
1. ...

## Inputs — what changes each run
- ...

## Outputs + naming / file conventions
- ...

## Worked example (a real run, with real paths)
<actual inputs → actual outputs, real folder paths from this session>

## Gotchas / edge cases
- ...

## Why a skill (vs a one-off)
<how repeatable + how much it'd save>
```

## How to write it well (for Claude)
- **Reconstruct from the session first.** If the editor just did the workflow with you, you already have the steps, the exact commands, the file paths, and the conventions — pull them from the conversation. The richest proposals come from what you just watched happen.
- **Ask only for the gaps**, in **plain markdown chat — never `AskUserQuestion` cards** (Sam disabled those for PFM flows). Batch the questions into one short list so it's a 2-minute answer.
- **The worked example MUST be real** — actual folder paths, actual inputs/outputs. That's what lets Sam + Claude build the skill later *without* needing the editor again.
- **Be concrete about file / naming conventions** — where outputs go, exactly how they're named. This is the hardest thing to reconstruct after the fact, so nail it now.
- **Stamp** `Date` = today's date, `<slug>` = kebab-case of the name, `<editor>` = their name (ask if you don't know it).

## Writing the file
1. Verify the Lucid Link inbox is reachable (no output = it's there):
   ```bash
   ls "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/Skill Proposals/"
   ```
   If that errors with "No such file or directory," Lucid Link isn't mounted/synced — tell the editor to open Lucid Link, then retry. **Don't write the proposal anywhere else.**
2. Write the filled template to (mind the spaces in the path — keep the quotes):
   ```
   /Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/Skill Proposals/<editor>_<slug>_<YYYY-MM-DD>.md
   ```
3. Confirm to the editor: the filename, the folder, and a one-line recap. Then say:
   > *"Submitted ✅ — Sam will review it. If it ships, you'll pull it like any other skill (`claude-pfm-update.sh`), credited to you."*

## What this skill does NOT do
- It does **NOT** build or edit an actual skill — that's Sam's call on the master machine (`skill-creator` + the 3-mirror distribution). This skill only **captures and submits** the idea.
- It does **NOT** change Notion status, post to Slack, or touch project assets.
- It does **NOT** require the editor to write any code or markdown — Claude writes the whole proposal.

## For Sam (triage, on the master machine)
- **Two accounts:** editors run this on the shared **editor** Claude account `powerrfoxlogin@gmail.com`; Sam triages + builds on the **master** account `sams@powerfoxmedia.com` (this account). The shared **Lucid Link** folder is the bridge between the two accounts — that is why a proposal is written as a file, not handed off in-session.
- New proposals land in `6. Claude PFM/Skill Proposals/` (`<editor>_<slug>_<date>.md`). Review, then build the keepers into skills as usual: `skill-creator` → validate → 3-mirror (local + Lucid + hub) + changelog → announce in `#claude-pfm`, **crediting the editor** (the credit is the incentive that keeps proposals coming).
- **Phase 2 (pinned):** mirror proposals into a Notion "Skill Submissions" board for structured triage + a Slack ping on submit.
