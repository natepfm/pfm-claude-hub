---
name: human-ad-copy
description: >-
  Write ad copy that reads fully human — none of the known signs of AI writing
  (Wikipedia's WP:AISIGNS catalog adapted for direct-response ads, plus a mechanical
  tell-scanner and a 15-framework swipe library). Use whenever an editor drafts or
  revises written ad copy: FB/Meta long copy (LC), primary text, headlines, hooks,
  organic/social posts, landing copy — or says "humanize this", "this sounds like AI",
  "make it not sound like ChatGPT", "de-slop this", "check this for AI tells", "write
  it with the First Person / Testimonial / Hook framework" (all 15 live in
  references/copy-frameworks.md), or "/human-ad-copy". Run it as the FINAL pass on any
  written-copy deliverable before turn-in. Composes with veo-script-writing /
  lc-to-video-podcast — their dialogue rules still bind on scripts; PFM compliance
  language ALWAYS beats any rule here. NOT for: Veo prompt bodies (nano-banana-prompting
  / the Veo masters), Notion request structure (notion-state-batches), or Suno lyrics
  (suno-songwriter).
---

# Human ad copy — write like a person, not a model

> Adapted for PFM from Caleb Kruse's (Mr. Paid Social) `human-ad-copy` skill, 2026-07-06.
> The engine — `references/ai-tells.md`, `references/copy-frameworks.md`,
> `scripts/ai-tell-scan.sh` — is his, intact. The workflow wrapper below is PFM's.

## Why this matters here

PFM's ads live or die on feeling REAL — iPhone-authentic, joy-maxing, a neighbor
telling you something that actually happened. The audience scrolls past a thousand
AI-written ads a day and smells slop in one line of primary text. The moment copy reads
as machine-written, the story-ad illusion dies and the creative underperforms. This is
not about beating detector software; it is about a sharp human reader never getting
that "a model wrote this" feeling.

## The root cause, so the fixes make sense

LLMs regress to the mean: they replace specific, unusual facts with generic, inflated
statements that could apply to anything, then dress the blur up in tidy parallel
structures. Every tell in the catalog is a symptom of that one behavior. So the master
move is not swapping banned words for synonyms. It is replacing abstraction with
receipts: a number, a name, a thing that actually happened. A sentence that could only
have been written by someone who did the thing cannot read as AI.

## 🔴 PFM compliance overrides (read before rule 9)

The receipts this skill demands MUST stay compliance-shaped — a compliant vague line
beats a non-compliant specific one, always (`context/pfm-creative-rules.md` is canon):

- Savings are a POSSIBILITY: "could save up to $815/yr" — never "will save", never a
  flat committed savings claim. Rule 9's "commit flat" applies to everything EXCEPT
  savings/results claims.
- Rates monthly or yearly only (never daily/weekly); respect the vertical floors.
- No "program" language; no brands/carriers/celebrities; "free" only for quote/signup.
- Never fabricate results, testimonials, or member/customer quotes. A receipt must be
  a real number from the request/brief or the vertical's approved claims list.

## Workflow

### 1. Load the voice

PFM voice is the baseline (global CLAUDE.md + `context/pfm-creative-rules.md`):
feel-good, joy-maxing, narrative-driven, emotionally honest, zero sales sleaze. If the
copy belongs to a specific creative/character, that character's established diction
wins — pull it from the request's Copy or the parent creative's script. Plain guru-hype
("crush it", "game-changing", "secret sauce", "10x") is banned twice over.

### 2. Collect receipts before writing a word

Gather the concrete raw material the copy will be made of: the request's actual numbers
(the state rate, the approved savings claim, the monthly price), the vertical's approved
claim lines, real details from the brief/creative (the character's job, the specific
bill, the tow truck). Write the claim list first. Any claim you cannot back with a
specific, COMPLIANT detail gets cut, not softened. This step does more anti-AI work
than every rule below combined.

### 3. Pick a framework, then draft plainly using the ten rules

Choose the copy skeleton from `references/copy-frameworks.md` — 15 frameworks (First
Person, Feature Benefits, Testimonial, Urgency, Statistic, Top 3 Reasons, Before/After
Journey, Relatable, Puns/Teasers, Challenge Status Quo, Founders Story,
I-saw-this-on-TikTok, Hook, IF Statements), each with an example and its specific
AI-tell watchouts. Match the framework to the angle and receipts from step 2. The
framework supplies the structure; the rules below govern every sentence inside it.

1. **Every claim carries a receipt.** A number, a name, an artifact. "My Camry went
   from $210 to $89 a month" beats any adjective. (Savings receipts stay could-shaped.)
2. **Say "is" and "has".** Not "serves as", "stands as", "boasts", "offers a
   comprehensive". Plain verbs: use (not utilize/leverage), built (not crafted),
   tried (not attempted).
3. **Never negative parallelism.** "It's not just X, it's Y", "This isn't another
   insurance ad", "No fluff. No theory. Just results." are the single loudest AI tells
   in 2024–2026 ad copy. State the positive claim and let it stand.
4. **Break the rule of three.** If you catch yourself listing exactly three adjectives
   or three parallel phrases, cut one or add two. Uneven lists read human.
5. **No em dashes, ever.** House rule across PFM (Veo scripts, Suno, now copy) and an
   AI tell. Commas, periods, parentheses.
6. **No AI vocabulary.** delve, seamless, effortless, elevate, unlock, unleash,
   game-changing, transformative, landscape, journey, empower... full list in
   `references/ai-tells.md`. The fix is never a synonym; it is a specific.
7. **No participle tails.** Sentences that end ", ensuring consistent results" or
   ", helping you save faster" are superficial analysis glued on. If the benefit is
   real, give it its own sentence with its own receipt.
8. **Vary the rhythm.** Mix short and long sentences. Fragments are fine. Parenthetical
   asides are fine. Uniform, polished cadence is itself a tell.
9. **Commit to checkable claims** — EXCEPT savings/results, which stay could-framed
   (see the compliance overrides above). AI hedges with grandeur ("one of the most
   powerful options"); humans commit on facts ("$97", "took 4 minutes", "three kids").
10. **Open like a person, not like a model.** No "In today's fast-paced world of
    insurance...". Straight into the concrete hook or the character's situation. No
    throat-clearing, no scene-setting.

### 4. Mechanical scan

Save the draft to a file and run:

```bash
bash ~/.claude/skills/human-ad-copy/scripts/ai-tell-scan.sh <draft-file>
```

It greps for the banned punctuation, vocabulary, and phrase patterns and exits nonzero
if hard tells are present. Fix every hard hit. "Review" hits are judgment calls: keep
them only if they are the character's real diction or literal usage (e.g. "optimize for
purchases" as literal Meta vocabulary).

### 5. Judgment sweep

The scanner cannot catch structural tells. Reread the draft against
`references/ai-tells.md` for: rule-of-three runs, uniform sentence rhythm, puffery and
significance inflation, vague attribution ("experts agree"), elegant variation (calling
the lander five different things), bold inline-header bullet lists, and Title Case
Headings.

### 6. Fix by adding specifics, not by thesaurus

When a line gets flagged, do not swap the flagged word for a synonym; the sentence
stays AI-shaped. Rewrite the line around a concrete detail. "Seamlessly compare quotes"
does not become "smoothly compare quotes"; it becomes "answered 6 questions and had 3
quotes on my screen before my coffee was done".

### 7. Final gut checks

- Read it aloud. Would the character say this sentence on camera, verbatim? Would a
  real person post this?
- The fake-Lambo test (Caleb's): if a line would look at home on a guru's Instagram,
  delete it.
- Does at least one line admit friction or mess? ("I put it off for two months",
  "the first quote was actually higher"). Flawless enthusiasm is a tell; real people
  share the annoying part.

## Format notes for Meta ads

- **Primary text**: first ~125 characters show before "See more"; the receipt or the
  pain goes there, not a warm-up.
- **Headlines** (~40 chars): concrete beats clever. "3 quotes in 4 minutes" beats
  "Unlock real savings".
- **Variations**: when a request asks for 3-5 primary-text variations, vary the angle,
  the receipt, AND the framework, not just the phrasing. Five paraphrases of one claim
  look machine-generated as a set even when each passes alone; three different
  frameworks carrying three different receipts read like a real campaign.

## Where this skill stops

It governs how WRITTEN COPY reads. Veo dialogue/scripts keep their own locked rules
(`veo-script-writing` — sentence-boundary clips, 17-22 words, contractions, no dashes,
no ALL CAPS); this skill's tell-catalog can polish a script's lines, but never override
those mechanics. Compliance (`context/pfm-creative-rules.md` + the vertical files)
overrides everything here.
