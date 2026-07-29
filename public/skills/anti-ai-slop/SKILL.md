---
name: anti-ai-slop
description: >-
  The FINAL human-voice pass for PFM copy before it ships. Scrubs tells that make copy read
  machine-written (negative parallelism, rule-of-three, participle tails, rhetorical-fragment
  pivots, copula avoidance, AI vocabulary, formatting tells) and fixes them by adding a
  specific receipt, not a synonym. Use as the last pass on native long copy ads, Veo/story-ad
  scripts, LC-to-Video podcasts, breaking-news story ads, LinkedIn posts, and emails. ALWAYS
  OFFER it at the end of any copy deliverable ("want me to run the final anti-AI-slop pass
  before you ship this?"). Triggers: "anti-ai-slop", "de-slop", "slop review", "final pass",
  "humanize this", "make it not sound like AI", "does this sound like ChatGPT", "AI tell
  scan", "/anti-ai-slop". Honors the PFM native-voice
  allow-list so it never sands out intentional lowercase, fragments, or emotional-beat
  punctuation. NOT a story rewrite (use native-long-copy-ad / veo-script-writing) and NOT
  Spanish naturalness (use spanish-translation).
---

# Anti-AI-Slop — the final human-voice pass

Everyone writes with AI now, and readers feel the slop. On PFM ads it is worse than
elsewhere: our entire edge is **native disguise**. The ad has to read as an organic post
from a real person. The second a reader gets the "a model wrote this" feeling, the
disguise dies and the ad reads as a low-effort ad. This skill is the last thing you run
before copy ships, to make sure nothing on the page pattern-matches to AI.

This is a scrub, not a rewrite. The story, the beats, the offer, the compliance framing
are already set by the upstream skill. Here you only fix voice-level tells.

## When to run it

**Always offer it.** After producing ANY copy or script deliverable (native long copy,
Veo/story-ad script, LC-to-Video podcast, breaking-news story ad, LinkedIn post, email,
landing copy), end your turn by offering the pass, in plain words:

> Want me to run the final anti-AI-slop pass before you ship this?

Run it immediately when the user says yes, or when they ask directly ("de-slop this",
"does this sound like AI", "final review", "/anti-ai-slop"). It is also the correct
final step inside `native-long-copy-ad`, `veo-script-writing`, and
`lc-to-video-podcast` once the draft is otherwise done.

**Sam's standing directive (2026-07-28): also apply this pass to MESSAGES WRITTEN TO
PEOPLE on Sam's behalf** — Slack updates, cross-session briefs meant for humans, emails,
Notion comments, PDF/report prose. Sam: "so you dont sound so llm." For messages this is
a silent pass (no verdict report; just write it clean), using the same kill list and the
receipt principle.

## The one idea behind every fix

LLMs regress to the mean. They swap the specific, unusual fact for a generic inflated
statement, then dress the blur in tidy parallel structure. Every tell below is a symptom
of that one habit.

**So the master fix never changes: replace the abstraction with a receipt.** A number, a
street name, a vehicle, a time, a dollar amount, a thing that actually happened. A
sentence only someone who lived it could write cannot read as AI. When a line gets
flagged, you do not reach for a synonym. You rewrite the line around a concrete detail.

- Bad (flagged): "Seamlessly get the coverage you deserve."
- Bad fix (synonym, still AI-shaped): "Smoothly get the coverage you need."
- Real fix (receipt): "I put in my info and it pulled 11 carriers in about 90 seconds. Mine came back $81. I'd been quoted $389."

For PFM insurance copy, receipts come from `vertical-offer-context` (real per-state
numbers, monthly-auto vs annual-home framing). Adding specifics must never cross a
compliance red line: no invented savings guarantees, no fabricated testimonials, no fake
scarcity. A receipt makes copy human; it does not license a claim.

## PFM native-voice allow-list (do NOT flag these)

This is the part a generic de-slopper gets wrong. Our winning native ads deliberately
break "clean writing" rules, and that is the point. The following are on-voice and are
**not** tells. Leave them alone:

- Lowercase sentence starts and run-ons used as native texture.
- Short dialogue fragments at emotional beats ("I said wait what." "She said '$389 a month.'").
- 1-2 tiny human imperfections per piece (a "??", a trailing "...", a self-interrupt) at
  a genuine emotional beat. Cap is 1-2; if there are more, that is a different problem.
- A concrete, uneven list of three real things (the social cascade: "my brother, a guy on
  my crew, my neighbor who overpaid 15 years"). Rule-of-three is only a tell when it is
  three **parallel abstractions/adjectives**, not three concrete story items.
- Odd, specific numbers ($812, Route 22, 2019 Silverado). These ARE the receipt. Keep them.
- One rare emoji at a beat (😳/🤯). Not scaffolding.

The tell is the **formulaic corporate version** of a device, not the device itself. A
punchy fragment in dialogue is fine; "The result? 3x ROAS." is a tell. A real contrast in
a sentence is fine; "No fluff. No theory. Just results." is a tell.

## The kill list (what you are scanning for)

Full catalog with PFM before/after examples in `references/ai-tells.md`. Summary:

**Vocabulary** — delve, seamless, effortless, unlock, unleash, elevate, empower,
supercharge, game-changing, revolutionary, transformative, cutting-edge, leverage,
utilize, robust, comprehensive, tapestry, testament, underscore, boasts, realm,
landscape, journey, "actionable insights", "say goodbye to", "look no further", "in
today's fast-paced world". Fix with a specific, not a synonym.

**Sentence patterns** — negative parallelism ("not just X, it's Y" / "No fluff. No
theory."), rule-of-three abstractions, copula avoidance ("serves as", "offers a" instead
of is/has), participle tails (", ensuring lower rates", ", helping you save"), rhetorical-
fragment pivots ("The best part? It's free."), vague attribution ("experts agree"),
hedged grandeur ("one of the most powerful ways").

**Formatting** — em/en dashes (already a PFM hard fail), curly quotes/apostrophes, bold
inline-header bullets, one-emoji-per-line scaffolding, Title Case On Every Line.

**Tone** — press-release puffery, frictionless enthusiasm (nothing ever has a rough
edge), grand-challenge framing ("in an era where drivers face rising costs").

## Workflow

### 1. Scan mechanically
If the draft is in a file, run the scanner and fix every hard hit:

```bash
bash scripts/slop-scan.sh <draft-file>
```

It greps for banned punctuation, vocabulary, and sentence patterns and exits nonzero on
hard tells. If you only have the draft in chat, save it to a temp file first, or do the
scan by eye against the kill list. **Em dashes are an automatic fail** (also enforced by
`native-long-copy-ad`); there must be zero.

### 2. Judgment sweep (what the scanner can't grep)
Reread against `references/ai-tells.md` sections 4-6 for the structural tells: rule-of-
three abstraction runs, uniform sentence rhythm, puffery, vague attribution, elegant
variation (calling the same offer five different names), frictionless enthusiasm. Check
each flag against the PFM allow-list above before "fixing" it.

### 3. Fix by receipt, not synonym
For every real hit, rewrite the line around a concrete detail. Pull insurance numbers
from `vertical-offer-context` so the receipt is believable and per-state accurate. Keep
the story and beats intact; you are only changing voice-level lines.

### 4. Rhythm and honesty check
- Read it aloud. Would a real person say this line out loud, in a text to a friend?
- Vary cadence: mix short and long, keep the intentional fragments, cut any stretch where
  every sentence is the same length.
- At least one line should admit friction or mess ("felt like a slap", "took me three
  tries", "I almost didn't bother"). Flawless enthusiasm is itself a tell, and it is
  on-voice for our native stories anyway.

### 5. Report
Deliver, in this order:
1. **Verdict**: `Clean to ship` or `N hard tells, M judgment flags`.
2. **The flags**: each tell found, quoted, labeled (vocab / sentence / formatting / tone),
   with the receipt-based fix. Skip anything that is on the PFM allow-list and say why if
   it looked borderline.
3. **The cleaned draft**: the full piece with fixes applied, ready to paste. Keep the
   upstream deliverable format (e.g. native long copy stays native-formatted).
4. **Em-dash gate**: confirm zero em dashes.

## Scope
Voice only. Do not touch the story structure, the beat order, the offer, or the
compliance framing set upstream. Never add a claim, number, testimonial, or "receipt"
that isn't real or isn't backed by `vertical-offer-context`. Making copy sound human is
not a license to make it say more. For Spanish copy, naturalness is handled by
`spanish-translation`; run this only on the English source.
