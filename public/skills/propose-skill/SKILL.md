---
name: propose-skill
description: "[editor-facing] Capture a repeatable workflow an editor discovered and submit it as a Skill Proposal for Sam to triage and build into the master PFM system. Use when an editor says \"propose a skill\", \"make this a skill\", \"create skill\", \"this should be a skill\", \"I keep doing this\", \"capture this workflow\", \"save this as a skill idea\", \"make this repeatable for the team\", \"submit a skill\", or — for a skill the editor already MAINTAINS — \"propose an update to <skill>\", \"I improved my <skill>\", \"update the <skill> skill\". **Two modes: a NEW skill proposal, and an UPDATE to a maintained skill** (updates route back to Sam to merge into the team version so the whole fleet gets them — editors never edit distributed skill files directly, the team sync would clobber them). The skill reconstructs the workflow (or the change) from the CURRENT session, fills gaps with a few targeted questions, and creates a structured Skill Proposal page in the Notion \"🧩 Skill Proposals\" database for Sam to triage. Editors never write a SKILL.md — Claude captures everything. NOT for: building/editing actual skills (that's Sam + skill-creator on the master machine), running gen flows, or anything other than capturing a workflow idea."
---

# propose-skill — capture a workflow, submit it for the master system

PFM editors discover repeatable workflows in their own project areas every day. This skill captures one as a **Skill Proposal** and posts it to the shared **Notion "🧩 Skill Proposals" board** so Sam can turn the good ones into real skills — the same way the rest of the system gets built. It's how your day-to-day know-how becomes team tooling.

**You (the editor) never write code or a SKILL.md.** Claude does all the writing — it was right there with you for the workflow, so it reconstructs it. You just answer a few quick questions.

## When to use
The moment you think *"I keep doing this exact thing"* — a repeatable, multi-step process you'd want Claude to do the same way every time. Say **"propose a skill"** / **"make this a skill"** / **"create skill"** / **"this should be a skill"** / **"capture this workflow."**

## 🔴 Two modes — NEW proposal vs UPDATE to a maintained skill
- **NEW** (default) — a fresh workflow that isn't a skill yet. Capture it in full (the template below).
- **UPDATE** — the editor **maintains** a shipped team skill and improved it ("propose an update to `<skill>`", "I improved my `<skill>`"). **Why this exists:** a team skill's master lives on Sam's machine and distributes one-way via `x.sync`; the team sync *overwrites by name*, so an editor's local edits to a distributed skill get **clobbered** on their next update. So a maintainer NEVER hand-edits the distributed file — they **propose the change here**, Sam merges it into the master, and it re-distributes to everyone.
  - Capture **what CHANGED** (the diff + why), not a whole re-spec: what's different from the shipped version, any new gotchas, and a real example of the improved behavior.
  - Set **`Update to`** = the exact skill name and **`Maintainer`** = the editor (they own it). Everything else (Name, Skill Type, Scope, etc.) mirrors the existing skill.
  - **Status = `Update`** (not `New`). If the skill already has a row on the board (it was proposed here originally), **flip THAT row's Status `Shipped` → `Update`** and append the change as a dated entry in its body — do NOT spawn a duplicate row. If the skill isn't on the board yet, create a fresh row with Status `Update`. Sam flips it back to `Shipped` once the merge ships — so a maintained skill's row toggles **`Shipped` ⟷ `Update`** over its life.
  - Same board, same triage, same credit — it just routes back to Sam to merge instead of build-from-scratch.
- If unsure which mode: does a skill by this name already ship? → UPDATE. Otherwise → NEW.

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
   - **Classify it** (Claude infers from the workflow — ask only if genuinely unclear):
     - **Skill Type** — **Workflow** (a multi-step orchestration / pipeline, the kind that ends in `.flow`) or **Task** (one focused action)?
     - **Scope** — **Broad** (applies across the board), or scoped to a specific **Vertical**, **Creative Type**, or **Concept**? If scoped, name which in *vertical / project area*.
3. **Compose the Skill Proposal** in the fixed template (below), filled in.
4. **Post it to the Notion Skill Proposals board.**
5. **Confirm** with the Notion page link + a one-line recap. Done — Sam takes it from there.

## The Skill Proposal template (Claude fills this — the editor doesn't)
This is the **page body**. The title, proposer, vertical, frequency, trigger, and one-liner also go into the matching page **properties** (see "Posting the proposal").
```
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
- **Stamp** the proposer's name (ask if you don't know it). Date is automatic (the board's `Submitted` created-time).

## Posting the proposal
The proposal is a **page in the Notion "🧩 Skill Proposals" database** — nothing writes to the Lucid folder anymore.

**Mode split:**
- **NEW** → create a page with `Status = "New"` (steps below).
- **UPDATE** → first **query the board for the skill's existing row** (`notion-query-data-sources`, match `Name` or `Update to` = the skill). If found → `notion-update-page` on that row: `Status = "Update"`, set `Maintainer`/`Update to`, and **append** the change to its body as a dated `> **Update requested MM.DD.YY (<editor>)** — <what changed + why>` block. If NOT found → create a fresh page with `Status = "Update"`. Never create a duplicate row for a skill that already has one.

1. Create it with the **notion-create-pages** tool:
   - **parent:** `{ "data_source_id": "84f61cb7-1c45-4874-b8e1-049afcdf912f" }`
   - **icon:** `🧩`
   - **properties:**
     ```
     {
       "Name": "<skill name>",
       "Proposed by": "<editor who submitted this entry>",
       "Maintainer": "<the editor who owns/maintains the skill ongoing — usually the proposer>",
       "Update to": "<BLANK for a new proposal; the exact existing skill name for an UPDATE>",
       "Status": "New",
       "Skill Type": "<Workflow | Task>",
       "Scope": "<Broad | Vertical | Creative Type | Concept>",
       "Vertical / Area": "<vertical / project area>",
       "Frequency": "<how often>",
       "Trigger": "<the phrase(s) that kick it off>",
       "One-liner": "<what it does in one sentence>"
     }
     ```
   - **content:** the filled proposal template above (Notion markdown).
2. If the Notion tool isn't available in the editor's session, it means their **Notion connector isn't authorized** — tell them to connect Notion (claude.ai connector settings, or `/mcp` in an interactive terminal), then retry. **Do not fall back to writing a file into the Lucid `6. Claude PFM/` tree — that path is read-only now.**
3. Confirm to the editor with the **Notion page link** the tool returns + a one-line recap:
   > 🧩 **Submitted:** [<skill name> ↗](<notion page url>) — it's on the Skill Proposals board.
   >
   > *"Sam will review it. If it ships, you'll pull it like any other skill (`claude-pfm-update.sh`), credited to you."*

## What this skill does NOT do
- It does **NOT** build or edit an actual skill — that's Sam's call on the master machine (`skill-creator` + the 3-mirror distribution). This skill only **captures and submits** the idea.
- It does **NOT** change other Notion pages, post to Slack, or touch project assets — it only creates the one proposal page.
- It does **NOT** require the editor to write any code or markdown — Claude writes the whole proposal.

## For Sam (triage, on the master machine)
- **Accounts:** editors run this from their own **@powerfoxmedia.com Claude Team seat** (the shared editor login is retired); Sam triages + builds on the **master** account `sams@powerfoxmedia.com` (this account). **The shared Notion workspace is the bridge between the two accounts** — a proposal is a page on the board both sides can see. (This replaces the old shared Lucid folder, which is now read-only for editors so a skill can't silently write executable code onto the fleet.)
- New proposals land on the **[🧩 Skill Proposals](https://app.notion.com/p/23ce28fa40a14669a67d49051a799017)** board with `Status = New`. Review, flip Status as you go (Reviewing → Building → Shipped / Declined), and build the keepers into skills as usual: `skill-creator` → validate → 3-mirror (local + Lucid + hub) + changelog → announce in `#claude-pfm`, **crediting the editor** (the credit is the incentive that keeps proposals coming).
- **🔴 On every SHIP or merged UPDATE, Slack-DM the proposer/maintainer** (standing rule, Sam 2026-07-15): what shipped, how it's triggered, that they're the maintainer, and the "propose an update to `<skill>`" loop for future improvements. Sam's go on the ship covers the DM — send it as part of shipping, don't re-ask. (Find their ID via `slack_search_users` on their @powerfoxmedia.com email.)
- **UPDATE entries (`Update to` filled) = a maintainer improved a shipped skill.** Don't build from scratch — **MERGE** the described change into the master `<skill>` SKILL.md (+ any refs), then re-distribute: `x.sync` push + hub `skillsRegistry.ts` parity + changelog. The row sits at `Status = Update` while pending — once the merge is pushed + distributed, flip it **back to `Shipped`** (the toggle closes), and announce/credit the maintainer. **Keep a `> Maintainer: <name>` line at the top of the skill body** so ownership is visible and that editor's future updates fast-track. 🔴 The maintainer must NEVER hand-edit their distributed copy — `claude-pfm-update.sh` / `x.sync` overwrite by name and clobber it; the propose→merge channel is the ONLY safe path. An editor who iterates heavily keeps a personal `<skill>-<initials>` sandbox (initials suffix = the sync never touches it) and proposes the polished version up.
- **A shipped proposal becomes a TEAM skill** (no initials suffix). Personal skills an editor builds for themselves end in their initials (e.g. `assemble-ss`) and never get proposed here.
