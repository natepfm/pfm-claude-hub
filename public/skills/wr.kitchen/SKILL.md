---
name: wr.kitchen
description: The kitchen test — rewrite RETOLD DIALOGUE in a story-ad / podcast script into spoken-human register. Keeps every who-said-what attribution tag and every fact/number/beat; kills the book words (said-bookisms, adverbial tags, written-English constructions nobody says out loud). OPT-IN, editor-invoked ONLY — never runs automatically inside a writing skill. Trigger on "/wr.kitchen", "kitchen test this", "kitchen convo pass", "kitchen this", "make this dialogue sound spoken", "this dialogue sounds stiff". NOT for: AI-tell hunting in ad copy (wr.humanize), spoken-number conversion (wr.numbers — run it separately), full LC voice transformation (wr.pod.lc owns the pipeline; this is a focused dialogue pass), or rewriting non-dialogue narration.
---

# /wr.kitchen — The Kitchen Test (retold-dialogue naturalizer)

> Maintainer: Josiah Akimenko

Story-ad speakers RETELL conversations: *"and then she goes, 'you're paying WHAT?'"* When those retold lines come from a written source (a long copy, a draft, a brief), they arrive in written-English register — words that read fine on the page and die in a human mouth. The kitchen test: **would a real person, retelling this story to a friend in their kitchen, actually say this sentence?** If not, rewrite it until they would.

## ⚠️ OPT-IN ONLY — the editor invokes this, never you

This pass runs ONLY when the editor asks for it (any trigger above). Never auto-apply it inside `veo-script-writing`, `wr.pod.lc`, `wr.bn`, or any other writer — drafting a script does NOT include kitchen-testing it. If a script obviously needs the pass, you may SAY so in one line ("this dialogue reads stiff — want a /wr.kitchen pass?") and stop. The editor's call.

## 🔴 GATE 0 — LC-sourced script? Confirm Dima's intent FIRST (Sam's condition, 2026-07-17)

LC-to-Video scripts are based on **long copies that already tested well**. Sometimes the dialogue is strange *on purpose* — Dima wants the script to stay verbatim to the LC, because **he's testing the LC copy, not a VERSION of the LC copy.** A naturalized rewrite would silently invalidate the test.

So, before touching an LC-sourced script (an "LC to Video" request, a script produced by `wr.pod.lc`, or anything whose source is a pasted long copy):

1. **STOP and surface the check to the editor:**
   > This script is LC-sourced. Before I kitchen-test the dialogue: check with Dima what he wants out of this creative request — verbatim LC copy (testing the copy itself) or a naturalized version. Which is it?
2. **Verbatim** → do NOT run the pass. Offer nothing further.
3. **Naturalized / Dima approved** → run the pass; note `Kitchen pass: Dima-approved` at the top of the delivered script.
4. Editor doesn't know → they ask Dima; you wait. Never assume either answer.

Non-LC scripts (original story ads, beats-derived scripts, briefs with no tested source copy) skip this gate — the editor's invoke is the only approval needed.

## What the pass changes — and what it never touches

**KEEP, always:**
- **Every attribution tag** — the who-said-what structure stays (*"she said"*, *"he goes"*, *"I told him"*). Retold dialogue NEEDS the tags; the fix is their register, not their existence.
- **Every fact, number, beat, and claim** — same story, same rates, same order. This is a register pass, not a rewrite. (Numbers needing spoken form → that's `wr.numbers`, run separately.)
- **Compliance language** — could-save framing, floors, banned-claim avoidance all survive untouched. The pass must never un-fix compliance.
- **Veo rules** — lines stay inside their clip windows (15–30 words), sentence-boundary cuts intact, no ALL CAPS, no dashes (except a `wr.cutoff` interruption beat, which stays as written).

**KILL — the book words:**

| Written-English tell | Kitchen version |
|---|---|
| said-bookisms: *remarked, exclaimed, declared, inquired, stated, replied* | *said, goes, told me, asked, was like* |
| adverbial tags: *she said, incredulous* / *he asked pointedly* | drop the adverb; let the quoted line carry the emotion |
| formal constructions inside quotes: *"I simply cannot fathom why…"* | *"I don't get it…"* |
| reported-speech stiffness: *He explained that the rate was excessive.* | *He just looked at me and said, "you're paying way too much."* |
| narrator-novel framing: *To my astonishment, she proceeded to…* | *And I couldn't believe it, she just…* |
| perfect-recall long quotes (nobody retells 40 verbatim words) | compress to the punch: the line the speaker would actually remember |

**The test for every rewritten line:** say it out loud as the character, mid-story, coffee in hand. If your ear catches a word no one says in a kitchen, it's not done.

## Workflow

1. **Gate 0** if LC-sourced (above).
2. Take the script (pasted, or from the Notion request's Copy — fetch, don't retype).
3. Touch ONLY lines containing retold dialogue or its attribution framing. Leave pure narration alone unless the editor widens scope.
4. Deliver the pass as **before → after pairs per changed line** (numbered by clip), so the editor sees exactly what moved — then the full clean script below. Never hand back only the rewritten script.
5. Word-count check each changed line against its clip window (15–30 words); flag any line the rewrite pushed out of window instead of silently re-cutting neighbors.
6. If the script will ship from this session, run the compliance linter before delivery like any writer pass:
   `python3 ~/.claude/skills/veo-script-writing/scripts/compliance_lint.py <script> --vertical <v>` — exit 0 required.

## Example

Before (clip 7):
> 7. She remarked, incredulous, "I am absolutely certain that you are overpaying for that coverage." I was speechless at her assertion.

After (clip 7):
> 7. And she just looks at me and goes, "you know you're overpaying for that, right?" I didn't even know what to say.

Same beat, same claim, same tag structure — kitchen register.
