---
name: lc-to-video-podcast
description: PFM's LC-to-Video Podcast pipeline — convert a working Facebook long-copy ad into a Veo-numbered podcast-style monologue script that a single dad-on-podcast speaker delivers in 6-8 second clips. Use whenever the editor pastes a long-copy Facebook ad and asks for a podcast story-ad version, drops a Notion request titled "LC to Video — [concept]", or says any of "convert this LC to a podcast script", "LC to video", "LC to video podcast", "format this long-copy for Veo as a podcast", "make this LC into a podcast story ad", "rebalance this for podcast voice". Sits upstream of `hvg-flow` (this skill produces the script; hvg-flow consumes it and fires the Veo gens). NOT for: writing a Veo story-ad script from scratch with no LC source (use `veo-script-writing`), running the actual video generations (use `hvg-flow`), Spanish translation of a locked English script (use `spanish-translation`), or marketplace product cards.
---

# LC to Video Podcast — PFM Script Formatter

This skill turns a working Facebook long-copy (LC) ad into a Veo-ready podcast story-ad script. The "LC to Video Podcast" format is a PFM-original: a single dad-on-podcast speaker re-tells the LC's story across 60-80 numbered Veo clips. The voice has to sound like a guy talking on a podcast, not a guy reading his own Facebook post out loud.

## Why this skill exists

A working long-copy ad is written for the eye. Sentence fragments like "Five words." or "Total: $30,050." land as visual punctuation when you're scrolling Facebook. They die when a person says them out loud. Hard dollar figures like `$1,970` and `$23,800` read fine on the page but sound like a robot reading a spreadsheet when spoken.

The LC-to-Video Podcast format takes the same story, same facts, same beats, and re-voices it so a real human on a podcast would actually say it that way. Spoken numbers. Light filler. Natural intensifiers. Dropped FB-post tics. Then every line gets balanced for Veo's 6-8 second clip window.

This is a different job than `veo-script-writing`. That skill encodes Veo's hard rules and applies to every Veo script PFM ships. This skill layers an LC-source workflow and a podcast voice transformation on top of those rules.

## When to invoke

Invoke when:
- The editor pastes the body text of a working Facebook ad and asks for a podcast story-ad version.
- The editor drops a Notion Video Task Manager URL where the page title starts with "LC to Video —" or the brief Instructions block describes a podcast story ad sourced from a long-copy FB ad.
- The editor says "convert this LC", "LC to video", "rebalance this for podcast voice", or any near phrase.

Do not invoke for:
- Writing a Veo script from scratch with no LC source. That's `veo-script-writing`.
- Running the gens. That's `hvg-flow`.
- Spanish translation of a locked script. That's `spanish-translation`.

If a request is ambiguous (e.g., editor asks for a Veo script and there's also a long-copy ad attached), invoke this skill — the LC-source signal is the trigger.

## Inputs to confirm before drafting

Before writing the script, get the editor's read on these five things. Ask plainly in chat — no AskUserQuestion cards, Sam has disabled those for PFM flows.

1. **Source LC**. Paste the verbatim long-copy text, or confirm the Notion brief's Copy section contains it. This is the source of truth for every fact, number, and beat.
2. **Vertical**. Loans, Auto, Home, Concealed Carry, etc. Affects brand-clean rules.
3. **Brandless?** Most LC-to-Video Podcasts are brandless (the LC works because it doesn't name a lender/aggregator). Confirm.
4. **Broad or state-variant?** Default is broad (single video, no state tokens). If the brief asks for state variants, isolate state-token lines per `veo-script-writing` Rule 4.
5. **Character archetype**. The dad-on-podcast (blue-collar, middle-aged, exhausted-by-debt or denied-loan vibe) is the standard speaker. Confirm reuse of an existing master (e.g., Jason Whitaker) or pick a new face.

## The voice transformation

The core move: re-voice the LC line-by-line so it sounds like a guy on a podcast retelling what happened to him. Every transformation below should make the script feel more spoken and less like a Facebook caption.

### Spoken numbers

Hard dollar figures kill spoken cadence. Convert them.

| LC (written) | Podcast (spoken) |
|---|---|
| `$30,050` | "30 thousand" or "thirty thousand dollars" (depending on beat) |
| `$1,970` | "just over 19 hundred dollars" |
| `$23,800` | "almost twenty four thousand" or "almost twenty four grand" |
| `$6,420` | "sixty four hundred bucks" |
| `$3,840` | "almost four thousand dollars" |
| `$847` | "eight hundred forty seven a month" |
| `$10,164` | "over ten grand a year" |
| `$120` | "a hundred twenty dollar minimum" |
| `0% for 24 months` | "zero percent for 24 months" |
| `29.99%` | "29.99 percent" |

Mix "grand", "thousand", "hundred", "bucks" to keep it human. Don't pick one form and ride it.

**Keep exact** small/punchy numbers that the speaker would actually say verbatim:
- Dates (`March 2030`)
- Specific shortfalls (`$47 below`, `47 dollars short`)
- Score moves (`45 points`, `62 points`)
- Time spans (`11 years`, `365 days`, `54 months`, `4 months`)
- Card counts (`9 credit cards`, `7 of the 9`)

### Drop FB-post tics

Facebook long-copy uses sentence fragments as visual punctuation. They land flat when spoken. Fold them into the narrative or drop them.

**Example — fold the callout:**
- LC: `"Looks like we couldn't get you approved today." Five words. Said the way you'd say it to a stranger on the bus.`
- Podcast: `He said those polite words again. Said the way you'd say it to a stranger on the bus.`

**Example — drop the visual list header:**
- LC: `Total: $30,050. Minimum payments: $847 a month.`
- Podcast: `Total? Thirty thousand dollars. Minimum payments alone, eight hundred forty seven a month.`

### Natural intensifiers and asides

Brief color additions that sound like a person remembering something. These should sharpen what's already there, never invent new facts.

- "right in front of" (vs "in front of")
- "I just stood there" (vs "I stood there")
- "in disbelief", "not saying a word", "by any means"
- "she's smart" (the kid already knew the TV wasn't coming home — small aside)
- "here's the kicker" (before a stat reveal)

### Dialogue attribution and soft stutters

When the LC has a quoted line, attribute it like a podcast guest retelling. Small natural stutters inside the quote are fine on emotional beats.

- LC: `"Looks like we couldn't get you approved today."`
- Podcast: `The clerk was polite about it, he said, "I'm sorry, but, looks like we couldn't get you approved today."`

### Light filler — sparingly

"you know", "I mean", "so", "look", "honestly" — used where a person would actually say them, not every line. **"Um" sparingly**, ideally 2-3 per script max, placed on natural beats: emotional pivots (the math reveal, the wife's "okay") and list-recall moments where the speaker is mentally pulling up the next item ("social security number, annual income, um, employer, how long I'd worked there..."). The goal is natural cadence, not transcription-style stuttering.

If you find yourself adding "you know" to more than ~10% of lines, you're overdoing it. Pull back.

### Conversational connectors

Start a line with "And then", "So", "But", "I mean" where the LC just had a period and a new sentence. This is what tips the rhythm from "reading" to "telling."

- LC: `That night, after the kids went to bed, I sat at the kitchen table with my wife.`
- Podcast: `So that night, after the kids went to bed, I sat at the kitchen table with my wife.`

### Periods → commas inside a single Veo clip

This is the big one. When multiple short sentences sit back-to-back inside a single Veo clip, swap the internal periods for commas. The LC uses periods as visual punctuation — a written staccato rhythm that lands on the page. Spoken aloud, the same beats come out as a single breath with comma pauses, not full stops.

Two patterns where this rule kicks in:

**1. Machine-gun fragment lists** (the speaker is rattling off items they remember).

- LC: `Full name. Full address. Date of birth. Social Security number.`
- Podcast (Veo line 10): `Then he handed me a tablet. Not a form, a tablet. Full name, full address, date of birth.`
- Podcast (Veo line 11): `Social security number, annual income, um, employer, how long I'd worked there, monthly rent, previous address from before we moved.`

Notice the capital letters drop too — "Full" → "full", "Bank" → "bank" — because the fragments are now clauses inside a sentence, not standalone sentences.

**2. Connective ideas the speaker would say in one breath** (an "and" or "when" links two related thoughts that the LC happened to split into two sentences).

- LC: `We finally decided it was time. When the guy at the register asked if I wanted to open a store card and finance it,`
- Podcast: `So we finally decided it was time, and when the guy at the register asked if I wanted to open a store card and finance it,`

Keep full periods only where the speaker would naturally take a real breath — at a real sentence boundary, a tonal pivot, or a beat of emphasis. Inside the same Veo clip, comma flow is almost always the right call.

### Contractions throughout

Every "do not" → "don't", "I will" → "I'll", "we are" → "we're". The LC is usually already contracted; just don't undo it.

## Veo line balance

After the voice pass, recount every line. Veo's hard rules from `veo-script-writing`:

- **17-22 words per line** (target). **15 word floor, 24 word ceiling.** Lean long.
- **No em dashes, no en dashes**, no hyphen-as-pause.
- **No ALL CAPS** outside `[BRACKETED_TOKENS]`.
- **No hyphens in compound words being spoken** (`one-day` → `one day`, `co-signed` → `co signed`, `7-year-old` → `7 year old`, `24-hour` → `24 hour`).
- **Numbered list**, each line is one Veo clip.
- **Closing line** is the only allowed short line — 12-15 words for held-silence impact on the final beat.

**🛑 NEVER produce 3-4 second "punchy beats" — even if the LC has staccato fragments like `"Impact. Bumper gone."` or `"Traffic. Full stop."`** Those are written-rhythm devices on the page; spoken at podcast pace they belong INSIDE a 6-8s line, separated by commas or kept as internal short sentences within a longer line. They never become standalone Veo clips. PFM does not ship sub-6s clips.

**Combine short fragments** (under 15 words) with adjacent lines. Two 11-word fragments back-to-back will both feel rushed on screen; combined into a 19-word line, they breathe. If a brief mentions "punchy dramatic beats," that's a cue to make the emphasis land inside a longer line — not to ship 3-4s clips.

**Split long beats** (over 24 words) at natural breath points — a comma, a sentence boundary, an emotional pivot. Don't break mid-clause.

Read every line aloud at podcast pace before finalizing. If it doesn't fit a steady breath, it won't fit in Veo's 8 second window.

## Content preservation rules

Voice can change. Facts cannot.

- **All numbers, story beats, and CTAs from the LC must survive the rewrite.** Card counts, dollar shortfalls, time spans, the wife's site, the soft-pull, the score gain, the end date, the four-minute claim — all of it carries through.
- **No new claims, no new characters, no new dramatic events.** The aside "she's smart" is fine (it's interpretive color, not a new fact). Adding a brother-in-law who told the speaker about the site is not.
- **Brand-clean**: If the LC is brandless, the script stays brandless. Don't insert a lender, aggregator, or comparison-site name.
- **Preserve flagged words** (e.g., `goddamn`, profanity from the LC). Flag them in your delivery message so the editor can decide whether to swap for Veo compliance — never quietly soften.

## Compliance scan before delivery

Run a final pass before showing the editor:

| Check | What to verify |
|---|---|
| Em/en dashes | Zero. Replaced with commas, periods, or rewrites |
| ALL CAPS | None outside `[BRACKETED_TOKENS]` |
| Compound hyphens | None in spoken words (`one-day` → `one day`, etc.) |
| Spoken numbers | Hard dollar figures converted; small punchy numbers kept exact |
| Brand names | None (unless brief explicitly requires) |
| Named camera devices | None (`iPhone`, `phone`, `GoPro` — these belong in negatives, not the script) |
| Word count | Every line 12-24 words, target 17-22 |
| Closer | Final line 12-15 words for held-silence impact |
| Flagged words | Surface any preserved swears or compliance-sensitive lines for editor review |

## Structural output

Format the deliverable so it drops cleanly into a Notion Video Task Manager page Copy callout.

```
### [Concept Name] — [Vertical] LC — Veo Numbered (Broad, Brandless)

1. [first line, 17-22 words, podcast voice]
2. [second line, 17-22 words, podcast voice]
...
N. [closing line, 12-15 words, held-silence impact]

---

<details>
<summary>Original Long-Copy (unedited, source LC)</summary>

[verbatim LC text, preserved exactly as the editor provided it]

</details>
```

The `<details>` block matters. The original LC stays underneath the numbered version as the source of truth for any future revisions, Spanish translations, or quality checks.

If the brief is state-variant, use `### [Concept Name] — [Vertical] LC — Veo Numbered (State Variants)` and isolate state-token lines on their own numbers per `veo-script-writing` Rule 4.

## Workflow

1. **Confirm inputs** — source LC, vertical, brandless yes/no, broad vs state-variant, character archetype. Ask plainly in chat if anything's missing from the brief.
2. **Voice pass** — go line-by-line through the LC, applying spoken numbers, dropping FB-post tics, adding natural intensifiers, dialogue attribution, light filler, and conversational connectors. Don't worry about Veo word counts yet.
3. **Veo balance pass** — recount every line. Combine fragments under 13 words. Split lines over 24 words. Target 17-22 per line. Closer can dip to 12-15 for impact.
4. **Compliance scan** — run the checklist above. Flag any preserved swears for the editor.
5. **Deliver in chat** — show the full numbered script for editor review. Flag any compliance/Veo concerns in a short note above or below the script.
6. **Push to Notion on approval** — once the editor approves, replace the existing Copy callout block (numbered list + `<details>` source LC). Use `notion-update-page` with a `content_updates` `old_str`/`new_str` replacement targeting the numbered list block. Preserve any Sam-edited lines exactly if they appear in the current Notion state — fetch first, integrate any human edits to the early lines, then push the full balanced script.

## Integration with other PFM skills

- **Upstream of `hvg-flow`** — this skill produces the script that lives in the Copy callout. `hvg-flow` reads that callout to build the per-clip Veo manifest and fire generations.
- **Pairs with `veo-script-writing`** — that skill owns Veo's universal rules (no dashes, no caps, no named devices, 6-8s clips). This skill layers an LC-source workflow and podcast voice transformation on top.
- **Hand off to `spanish-translation`** for a Spanish version once the English script is locked. Run that skill against the final numbered script, not against the source LC.
- **Camera-roll b-roll** for the podcast (cutaways of the speaker's life — kitchen table, Best Buy register, etc.) uses `iphone-cameraroll-prompting` via `hig-flow`.

## PFM Context

- **Lineage**: LC-to-Video Podcast started in Auto (Repossessed Florida → Denied Car Loan → Permission Slip Podcast). The format is now porting to Loans (Best Buy TV Denial is the first Loans LC2V Podcast as of 2026-05).
- **Speaker character**: The dad-on-podcast is a single speaker on the show. The wife and kids are referenced in the story but never appear as on-mic voices. Don't write the wife or kids as separate Veo lines.
- **Reference projects**: When you need a tone or pacing reference, fetch one of the source projects from Notion (Denied Car Loan, Repossessed Florida, Permission Slip Podcast) and read the Copy callout. They follow the same format.

## Before / after examples (from Loans Best Buy Denial Podcast, 2026-05-13)

These show the LC-to-podcast transformation at the line level. The "After" lines are the locked production version.

### Opening line — spoken numbers, intensifier

LC:
> I have nine credit cards and $30,050 of debt. Last week Best Buy denied me for a $1,970 TV in front of my wife and my two kids.

After (split into two Veo lines):
> 1. I have nine credit cards and 30 thousand in debt. Last week Best Buy denied me a purchase for a TV that was just over 19 hundred dollars.
> 2. Right in front of my wife and my two kids. I just stood at the register, staring at the pin pad in disbelief.

### The clerk beat — dialogue attribution, drop "Five words" callout

LC:
> The clerk was polite about it. "Looks like we couldn't get you approved today." Five words, said the way you'd say it to a stranger on the bus.

After:
> 3. The clerk was polite about it, he said, "I'm sorry, but, looks like we couldn't get you approved today."
> 4. Said the way you'd say it to a stranger on the bus, and the people behind us pretended not to listen.

### Tablet field list — combined into clean Veo beats

LC:
> Full name. Full address. Date of birth. Social Security number. Annual income. Employer. How long I'd worked there. Monthly rent. Previous address from before we moved. Mother's maiden name. Four security questions. Bank name, account number, debit card "for verification."

After (three Veo lines, balanced):
> 10. Then he handed me a tablet. Not a form, a tablet. Full name, full address, date of birth.
> 11. Social security number, annual income, employer, how long I'd worked there, monthly rent, previous address from before we moved.
> 12. Mother's maiden name. Four security questions. Bank name, account number, my debit card for "verification."

### Card-reading beat — spoken figures, "bucks/grand/hundred" mix

LC:
> Main Visa $6,420. Gas card $890. Target RedCard $2,150. Medical card from when my wife had her gallbladder out, $3,840.

After:
> 25. Nine cards. I can still name every single one. Main Visa, sixty four hundred bucks. Gas card, almost nine hundred.
> 26. Target RedCard, just over two grand. Medical card from when my wife had her gallbladder out, almost four thousand dollars.

### The wife's "trap" line — connector + aside

LC:
> My wife looked at me across the table and said five words of her own. "This isn't a system. It's a trap." That was the moment.

After:
> 47. So my wife looked at me across the table and said five words of her own. "This isn't a system. It's a trap."
> 48. And, you know, that was the moment. She found a site that night, after the Best Buy tablet.

### The math reveal — only "um" in the script lands here

LC:
> And I still owe what I owed. Here's the part nobody tells you. I wasn't buying Gucci. I wasn't gambling.

After:
> 35. And I still owe what I owed. Um, and here's the part nobody tells you. I wasn't buying Gucci, I wasn't gambling.

### The closer — held-silence shorter line for impact

LC:
> Four minutes. That's the whole thing. The rest of your life is on the other side of it.

After (two Veo lines, the closer trimmed to 13 words for held silence):
> 72. After the worst day of our marriage. Four minutes. That's the whole thing.
> 73. And the rest of your life, you know, is right on the other side of it.

## TLDR

1. Re-voice the LC line-by-line: spoken numbers, drop FB-post fragments, natural intensifiers, dialogue attribution, light filler, conversational connectors.
2. Balance every line to 17-22 words (12-24 hard floor/ceiling). Closer can dip to 12-15 for impact.
3. Strip em/en dashes, ALL CAPS, and compound hyphens.
4. Preserve every fact, number, beat, and CTA from the source LC. No new claims.
5. Output as a numbered list with the verbatim LC tucked into a `<details>` block underneath.
6. Hand off to `hvg-flow` when the editor approves.
