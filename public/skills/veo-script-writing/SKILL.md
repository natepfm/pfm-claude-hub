---
name: veo-script-writing
description: Write or review story ad scripts for Google Veo 3.1. Use whenever the user asks to draft a new Veo script, rebalance an existing script into Veo-ready clips, review a script for Veo compliance, or format dialogue for the PFM `hvg-flow` Excel manifest. Triggers on mentions of Veo, Veo 3.1, story ad scripts, state-variable scripts, per-clip line balancing, "Veo-ready," or the PFM Story Ads workflow.
---

# Veo Script Writing — PFM Story Ads

This skill encodes the writing rules Power Fox Media uses for every story ad script that will be generated with Google Veo 3.1. Follow these rules whenever you draft, rebalance, or review a script that will be fed into Veo (directly or via the `hvg-flow` skill, which builds the project's Excel manifest of per-clip Veo prompts).

## Gate 0 — Source check (before any rewriting)

**If the source is an LC-to-Video request, hand off to `lc-to-video-podcast` first.** The signals:
- Notion request page title starts with `LC to Video —` or contains `LC to Video`
- Notion brief Instructions describe a podcast story ad sourced from a long-copy Facebook ad
- The pasted source is a multi-paragraph long-copy Facebook ad (not a pre-numbered script)
- The editor mentions "long copy," "LC," "convert this LC," "podcast version of this ad," or similar

If any of those match, **stop and surface**:

> This looks like an LC-to-Video request. The `lc-to-video-podcast` skill handles the voice transformation (filler, intensifiers, period→comma combining, dialogue attribution) PLUS the Veo rules in this skill. I'll run `lc-to-video-podcast` for the full conversion — confirm or tell me to stay in `veo-script-writing` only.

Wait for editor confirmation before proceeding. If they confirm LC handoff, run `lc-to-video-podcast` end-to-end (this skill's rules are layered in by that skill automatically). If they explicitly say to stay in `veo-script-writing`, proceed with the rules below — but expect the output to be Veo-compliant only, not podcast-voice transformed.

## Why this skill exists

Veo 3.1 generates one short video clip per prompt. Each clip is capped at 8 seconds. If a script line runs long, the generated clip cuts off mid-sentence. If a line is too short, the clip ends with dead air or awkward pacing. Veo also chokes on two specific formatting habits that are easy to avoid: words in ALL CAPS and em/en dashes. Follow the rules below and every line will drop cleanly into the `hvg-flow` Excel manifest and render the way it was intended.

## The hard rules

### Rule 1. Every numbered line fits a 6 to 8 second clip — lean long, never short

Podcast-pace narration runs about 2.5 to 3 words per second. Working window: **17 to 22 words per line** (sweet spot). Hard ceiling: 30 words. Hard floor: 15 words. Lean toward the long side by default.

Quick math:
- 6 seconds ≈ 15 to 18 words
- 7 seconds ≈ 18 to 21 words (target sweet spot — comfortable podcast pace)
- 8 seconds ≈ 21 to 24 words (still in window — lands at clip cap)
- 9-10 seconds ≈ 24 to 30 words (upper edge — use sparingly, only when the beat really earns it)

**🛑 NEVER produce "punchy 3-4 second beats" — even if the brief mentions them.** PFM does not ship sub-6s Veo clips. If a brief calls for "punchy dramatic beats," interpret that as **emphasis cues to apply within a 6-8s line** (e.g., short clauses inside the line separated by commas or periods for written rhythm — but the line itself is still 15-30 words). NOT as a license to produce 3-4s clips.

Lines like `"Impact. Bumper gone."` or `"Traffic. Full stop."` — even if they read punchy on the page — are **always merge candidates**. Combine them with adjacent context until the full line lands in the 6-8s window. The dramatic punch survives because the speaker emphasizes those short clauses naturally; you don't need a separate Veo clip for them.

**The only allowed short line is the closing line**, which may be 12-15 words for held-silence impact on the final beat. Every other line must be 15-30 words (with 18-22 as the comfortable sweet spot).

When in doubt, lean LONG. A 22-word line that runs ~7.5s is always better than a 14-word line that ends with awkward silence.

### Rule 2. No ALL CAPS words (except inside placeholders)

Veo misreads all caps as emphasis or shouting, which distorts delivery. Use italics or a period for emphasis instead. The one exception: token placeholders like `[STATE]`, `{CITY}`, `[STATE_RATE_YEAR]` stay in caps because the generator needs them that way for detection and swap.

- Bad: `HOW is this more expensive than California?`
- Good: `How is this more expensive than California?`
- Bad: `Everything is better AND cheaper.`
- Good: `Everything is better and cheaper.`

### Rule 3. No dashes

Em dashes (—), en dashes (–), and hyphen-as-pause all confuse Veo's phrasing. Replace with commas, periods, or rewrite the clause.

- Bad: `Your new rate is $4,695 a year — that's $391 a month.`
- Good: `Your new rate is $4,695 a year. That's $391 a month.`
- Bad: `The [METRO] is considered high-risk.`
- Good: `The [METRO] is considered high risk.`

### Rule 3b. Never name camera devices in the dialogue or scene description

Words like `iPhone`, `phone`, `GoPro`, `DSLR`, `dash cam`, `Ring camera` inside the spoken dialogue or the script's scene description make Veo render that physical device in frame — a phone held up, a GoPro on a chest harness, a literal dashboard camera mounted to the windshield. The aesthetic (vertical phone-snap framing, fisheye GoPro lens, low-res dashcam look) belongs in the Veo prompt's visual block as indirect outcome markers, NOT named devices in the script.

If the script needs to refer to the camera ("our home camera picked it up," "the dash cam caught it"), describe what the camera *saw* in subsequent lines instead, or rewrite the line to leave the device implicit.

- Bad: `I pulled out my iPhone and recorded it.`
- Good: `I started recording it on my way back to the truck.`
- Bad: `The GoPro on my helmet caught everything.`
- Good: `Everything got caught on camera.`

Veo also pulls device-naming cues from negatives — keep those device names in the negative-prompt block of the Veo prompt (per `hvg-flow`), not in the dialogue itself.

### Rule 4. Isolate state-variable lines on their own number

Any line that contains a `[STATE]`, `[CITY]`, `[ROAD]`, `[STATE_RATE_YEAR]`, or any other token gets its own numbered line, separated from non-state content. This lets the `hvg-flow` Excel manifest render it once per state (for example, 5x for a 5-state batch) without re-rendering the unchanged beats. Never mix state tokens and non-state dialogue in the same numbered clip.

> 🛑 **Never append `[STATE LINE]`, `[state lines]`, `[STATE LINES]`, or any similar trailing annotation tag to the end of a line.** The generator already detects state lines by the presence of the actual token (`[STATE]`, `[ROAD]`, `[STATE_RATE_YEAR]`, etc.). Trailing meta-annotations are clutter and must be stripped before delivery. **Run a scan-and-strip pass before handing off the script.** Real placeholder tokens INSIDE the line stay; trailing annotations come out.

Bad (mixed):
> I called to set up coverage on our new place off [ROAD]. They put me on hold, then told me my rate is $[STATE_RATE_YEAR] a year.

Good (isolated, no trailing annotation):
> 14. I called to set up coverage on our new place off [ROAD]. They put me on hold and waited.
> 15. Your new rate is $[STATE_RATE_YEAR] a year. That's $[STATE_RATE_MONTH] a month, and I just sat there staring at it.

### Rule 5. Token formats Veo and the generator both accept

All three formats below are valid and treated identically. Pick whichever reads cleanest and stay consistent within a script:

- `{state}` — curly braces
- `[STATE]` — square brackets
- `**state**` — bold markdown

Inside the token, caps are fine. Use `UPPER_SNAKE_CASE` for multi-word variables (for example `[STATE_RATE_YEAR]`, `[KID_CITY]`, `[NEIGHBOR_OLD_MONTH]`).

### Rule 6. Underlined text means re-purposed line from a prior creative

When a numbered line is underlined, it means the script is a re-purposed version of an earlier creative, and the underlined text marks the lines or words that changed from the previous version. Underlines are a diffing tool for the team, not a Veo directive. Veo itself ignores underlines and generates the line like any other.

- Net-new script: no underlines anywhere.
- Forked from an existing winner: underline only the lines that changed.
- Partial-line edits: underline just the changed words, not the whole line.
- Never add, remove, or reformat underlines based on how a line reads aloud. Underlines exist so the team can scan the delta at a glance.

## Writing habits that make Veo scripts sing

### Short sentences, natural breath points

Long compound sentences don't just blow the word count, they also sound unnatural when Veo speaks them. Break at natural breath points. Two short sentences beat one long one almost every time.

- Bad: `I spent the next week calling around and got quotes from four different companies and every single one was higher than California which made me livid.`
- Good: `So I spent the next week calling around, and got quotes from four different companies. Every single one was higher than California.`

### Numbers as words when small, digits when they're amounts

- Spell out: one, two, three, four... fifteen, twenty (when counting or casual)
- Keep digits for money and rates: $3,000, $4,695, $948
- Time: "90 seconds" reads cleaner than "ninety seconds"

### Read it aloud before finalizing

The single best sanity check: read every numbered line aloud at podcast pace. If you run out of breath or the clip feels like it drags, adjust. A line that feels long to say will always blow the 8 second cap.

### Punctuation checklist

- Commas for brief pauses
- Periods for full stops
- Ellipses (...) only when the character is genuinely trailing off. Don't overuse.
- Question marks OK
- Exclamation points sparingly, only for real excitement
- No em dashes, no en dashes, no hyphen-as-pause

## Before/after rewrite examples

### Example A: too long + has a dash + has ALL CAPS

Bad:
> In California I was paying $3,000 a year — that's $250 a month — on our Silver Lake house, and figured when we moved to [STATE] it would fall like everything else had, but HOW did it go UP?

Good (split into three clips, caps removed, dashes replaced):
> 11. Home insurance. In California I was paying $3,000 a year, which is $250 a month, on our Silver Lake house.
> 13. Figured when we moved to [STATE], it would fall like everything else had.
> 19. I literally moved from Los Angeles. How is this more expensive than Los Angeles?

### Example B: too short (merge it)

Bad (dead air):
> 32. He texted me the link.

Good (merged with next beat):
> 44. He texted me the link. I pulled it up right there in my truck. 90 seconds.

### Example C: state + non-state mixed (isolate)

Bad (mixed):
> I was livid. We'd spent everything on the move. An extra $[DELTA_MONTH] a month felt like a slap.

Good (isolated):
> 26. I was livid. We'd spent everything on the move.
> 27. An extra $[DELTA_MONTH] a month just for insurance felt like a slap in the face.

## Final checklist before a script ships

| Check | What to verify |
|---|---|
| Line length | Every numbered line 15 to 22 words (hard cap 30) |
| Caps | No ALL CAPS words outside of [PLACEHOLDERS] |
| Dashes | Zero dashes. All replaced with commas, periods, or rewrites |
| State isolation | Every line with a token lives on its own number |
| Token format | `{token}`, `[TOKEN]`, or `**token**` only. Consistent across the script |
| Underlines | Only present if re-purposing a prior script. Mark only the lines or words that changed |
| Read-aloud test | Every line spoken at podcast pace lands under 8 seconds |
| Compliance | No brands. No "will save." $900/yr floor. No "program" language |

## TLDR

1. 15 to 22 words per numbered line. 30 max.
2. No ALL CAPS except inside placeholders.
3. No dashes. Use commas or periods.
4. State tokens get their own numbered line.
5. Underlines = changed lines in a re-purposed script. Don't invent them.
6. Read it out loud before sending.
