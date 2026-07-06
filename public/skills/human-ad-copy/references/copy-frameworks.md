# Copy frameworks — Caleb's swipe sheet, humanized

Caleb's 15 top ad-copy frameworks (from his framework Google Sheet), each distilled and
rewritten for The Ai Ads Alchemists so the structure survives but the AI-writing tells
don't. The originals on the sheet are consumer-product ads (wallets, silk pillowcases,
bone broth) that lean hard on the exact moves this hub bans: checkmark spam, invented
stats, siren-emoji urgency, "not X but Y" parallelism. The framework is the skeleton;
`../SKILL.md` rule set governs every sentence you hang on it.

**How to use:** pick the framework that fits your angle and receipts (SKILL.md step 3),
write the example, then run `scripts/ai-tell-scan.sh` on it. Every example below is
scanner-clean. When you write 3-5 variations, use 3-5 *different* frameworks so the set
doesn't read as machine-generated paraphrase.

**Approved receipts** (never invent past these; verify anything new in the project files):
500+ media buyers ($97/mo) · Caleb: 12 yrs, $150M+ managed · monthly guest calls (June:
Camilo, agency runs ~90% of creatives for a skincare brand spending $1M+/mo) · free member
tools: Claude Code competitor-ad scraper into Airtable (~2 hrs to build), AdTable Light,
custom GPTs · 23 courses incl. MC1-MC5 Meta Masterclass · ~1,700-ad swipe library (skews
ecom) · member topics: DPAs, CBO restructures, $50/day scaling, Magnific/KIE/Seedance.

---

## 1. First Person

**When to use:** Default for feed-native ads. Reads like a post from a peer, not a brand.
Best when you have a real story or a mild confession to open with.

**Structure:**
```
Open with "I" and a real moment
The specific thing that happened (numbers, tools)
What it means for the reader
Low-friction ask
```

**Watchouts:** The sheet's version leans on hype punctuation ("AT LEAST I AIN'T BROKE 🤑").
Keep it grounded. The AI failure mode here is a too-clean arc where every sentence is the
same length. Let it wobble: a fragment, then a long rambly one. One emoji max.

**Example:**
> I spent about 2 hours last week building a Claude Code agent that pulls every ad my
> competitors are running straight into an Airtable base. No Foreplay subscription, no
> manual screenshotting. I gave the whole thing away free to everyone in my community
> the same afternoon. That is kind of the deal over there: I build media buying tools
> live and hand them out. 500+ of us in the room now, all running real budgets. $97/mo
> if you want in.

**Headline:** `I built an ad-spy tool in 2 hours`

---

## 2. Feature Benefits

**When to use:** When the offer genuinely stacks up and you want the value legible fast.
Good for a cold audience that needs to see what is inside.

**Structure:**
```
Hook (one line, concrete)
What you get (short lines, real items)
A real quote or proof if you have one
Price / terms
CTA
```

**Watchouts:** The original is checkmark-spam with a rule-of-three cadence and a GQ pull
quote. Checklists are one of the loudest AI list tells, so keep the items in Caleb's plain
dashed style, make them uneven in length, and never pad to a tidy 3 or 5. Only include a
quote if it is real. Do not invent a review count.

**Example:**
> Everything I use to build and test ads now lives in one $97/mo room.
>
> - The full Meta Masterclass (MC1 through MC5)
> - AdTable Light, free, the same tool I use to launch 100s of ads at once
> - Custom GPTs for copy, hooks, and compliance
> - A swipe library of ~1,700 real ads you can filter by format
> - Monthly calls where actual $1M/mo buyers walk through their process
>
> That is the whole thing. skool.com/mrpaidsocial if you want it.

**Headline:** `The Meta Masterclass plus the tools`

---

## 3. Testimonial

**When to use:** When you have a genuinely good member quote. Social proof does the whole
job, so the copy is just the quote.

**Structure:**
```
"[verbatim member quote]" - [Real First + Last initial]
```

**Watchouts:** This is the highest-fabrication-risk framework in the set. There is NO
member testimonial file to pull from yet, so you cannot ship this one until you have a
real quote (a screenshot from a Skool comment, a DM Caleb okays, a wall post). Paste it
verbatim, keep the real attribution, fix nothing but obvious typos. Never write a quote
"in the spirit of" what a member might say. If you have no real quote, use a different
framework.

**Example (template only, fill with a real quote before shipping):**
> "[paste the member's exact words here, e.g. what they posted in the ad questions
> channel the day their CPA finally dropped]" - [First name + last initial]

**Headline:** `In their words, not mine`

---

## 4. First Person Testimonial

**When to use:** A member's win told in their own first-person voice. Same social proof as
#3 but reads as a story rather than a pull quote.

**Structure:**
```
"I kept seeing / I finally tried / I wasn't sure, and then..."
The specific result in their words
```

**Watchouts:** Same hard rule as #3: the quote must be real and attributed. The consumer
examples on the sheet ("I may end up pregnant") lean on shock. For this audience the
believable receipt (a CPA number, a hook rate, hours saved) beats any punchline. Do not
manufacture the member's voice.

**Example (template only, fill with a real member's words):**
> "[member, first person: what they were stuck on, what they did inside the community,
> the number that changed]" - [First name + last initial]

**Headline:** `A member on why their test finally won`

---

## 5. Urgency

**When to use:** Only when the deadline is real. A live call date, a cohort close, a price
change that is actually happening.

**Structure:**
```
The real deadline, stated plainly
What they miss if they wait
One clear action
```

**Watchouts:** The single most dangerous framework for the anti-guru brand. The sheet
version is siren emojis, fake "SALE EXTENDED," and manufactured scarcity, which is exactly
the guru energy this hub exists to reject. Real urgency only. No 🚨, no invented
percentages, no "last chance" unless it is. If the deadline is soft, pick another
framework.

**Example (anchored to a real event):**
> The next guest call is this Thursday. Last month Camilo, whose agency makes about 90%
> of the creatives for a skincare brand spending over $1M a month, walked us through how
> he treats every ad as a hypothesis and reviews the learnings after. This one is live
> and I do not always post the full recording. If you want to be in the room and ask
> your own questions, join before Thursday: skool.com/mrpaidsocial

**Headline:** `Thursday: a $1M/mo buyer goes live`

---

## 6. Statistic

**When to use:** When you have one real, checkable number that reframes the problem.

**Structure:**
```
The statistic, up front
What it means for them
Real third-party validation (only if true)
```

**Watchouts:** Every number must be real and yours to cite. The AI/guru move is a
suspiciously round invented stat ("95% cheaper"). Use numbers you can defend: your managed
spend, real member pains, actual tool costs. Skip the "as seen in" line unless it is true.

**Example:**
> I have managed north of $150M in ad spend over 12 years, and the pattern never changes:
> the accounts that win are not the ones with the best single ad, they are the ones with
> a testing system. That is the whole reason I run this community. 500+ media buyers
> comparing what is actually working right now, plus the Masterclass and the tools I
> build. $97/mo at skool.com/mrpaidsocial.

**Headline:** `$150M in spend taught me one thing`

---

## 7. Top 3 Reasons

**When to use:** Quick, skimmable pitch when three concrete reasons genuinely stand out.

**Structure:**
```
One-line frame
Reason
Reason
Reason
Soft proof line
```

**Watchouts:** Three is the rule-of-three danger zone. It reads AI when the three items
are grammatically identical and emoji-led. Break the symmetry: vary the length, drop the
emoji or use one, and make the reasons specific enough that they could not be swapped onto
any other community. Do not pad the closing line with puffery.

**Example:**
> Three honest reasons media buyers stick around in here:
>
> The tools are free. I built a Claude Code agent that scrapes competitor ads into
> Airtable and gave it away, and AdTable Light comes with the membership.
>
> The calls are real practitioners, like Camilo breaking down how his agency tests for a
> brand spending seven figures a month.
>
> And nobody is selling you a dream. It is just buyers trading what works.
>
> $97/mo, skool.com/mrpaidsocial.

**Headline:** `Free tools, real calls, no dream-selling`

---

## 8. First Person Before/After Journey

**When to use:** A transformation story with a clear before and after. Works when the arc
is real (yours or, with permission and real words, a member's).

**Structure:**
```
Where it started (the pain)
The turn (what changed)
Where it is now (the specific after)
CTA
```

**Watchouts:** The sheet's day-by-day emoji timeline ("Day 7: Bloating gone") is a
health-supplement tell and would look invented here. Skip the fake calendar. Tell the real
arc in plain sentences. If it is a member's journey, the words and the numbers must be
theirs, not a reconstruction.

**Example:**
> A couple years ago I was hand-building every ad and screenshotting competitors one at
> a time like everyone else. Slow, and my testing was mostly guessing. Then I started
> wiring AI into the boring parts: an agent that pulls competitor ads into Airtable,
> AdTable to launch 100s at once, GPTs for the first-draft copy. Now most of my statics
> are AI-generated and I spend my time on the actual decisions. I teach that whole setup
> inside the community. 500+ buyers, $97/mo, skool.com/mrpaidsocial.

**Headline:** `From hand-building ads to AI systems`

---

## 9. Relatable

**When to use:** Top of funnel, when you want the reader to feel seen before you offer
anything. Name the exact pain they have not said out loud.

**Structure:**
```
The precise, slightly uncomfortable truth about their situation
Why it happens (a little insight)
Where the answer lives
```

**Watchouts:** The sheet closes with a four-checkmark benefit block that undoes the human
open. Resist it. Stay in plain prose. The pain has to be specific to media buyers (CPA
creeping, the 11th AI tool subscription, the creative that tanked on launch), not a generic
"struggling to grow." No checklists.

**Example:**
> You have got 9 AI tools open, three of them you are paying for, and you still spent
> yesterday afternoon staring at a creative that died on launch. It is not a you problem.
> The tools moved faster than anyone's system for using them, so everybody is
> improvising. That is basically why I started this community. 500+ media buyers figuring
> out the workflow together instead of alone. $97/mo if that sounds like your week.

**Headline:** `9 AI tools open and a dead creative`

---

## 10. Puns / Teasers

**When to use:** Rarely, and only paired with a strong visual. A short witty line that
earns a look. Not a standalone pitch.

**Structure:**
```
One short, clever line (5-15 words)
```

**Watchouts:** Caleb is dry, not corny. The sheet examples ("SLAYYY MAMA") are the wrong
register for 8-figure buyers. No emoji stacks. Wit that respects the reader's intelligence.
If it needs an emoji to land, it is not landing.

**Example:**
> Your competitors' entire ad library, scraped into a spreadsheet, before your coffee is
> cold.

**Headline:** `Spy on every competitor by 9am`

---

## 11. Challenge Status Quo

**When to use:** When you can name a real, wrong belief in the space and show a better way.
Caleb's anti-guru positioning is built for this one. Probably the best-fit framework in the
set.

**Structure:**
```
The thing everyone in the space sells / believes
Why it is wrong (with your evidence)
What actually works
How the community is built around that
Low-key CTA
```

**Watchouts:** The sheet version ("one student made $1M") uses an unverifiable big-number
flex, the exact guru move to avoid. Challenge the norm with your real receipts, not a
fantasy outcome. The trap here is the "not X, it's Y" parallelism (see ai-tells.md); make
the contrast with plain sentences instead of a rhetorical seesaw.

**Example:**
> Most people selling ad education want you to believe there is a secret hook formula or
> a magic scaling trick. There is not. I have spent 12 years and $150M+ in spend finding
> that out. What actually moves CPA is boring: a real testing system, a fast way to make
> creative, and other sharp buyers to check your logic. So that is what I built. No
> course-of-the-week. 500+ media buyers, the tools I use daily, monthly calls with people
> running seven figures a month. $97/mo, skool.com/mrpaidsocial.

**Headline:** `There is no secret hook formula`

---

## 12. Founders Story

**When to use:** Brand-building, warmer audiences, when the mission carries the ad. First
person, Caleb telling why this exists.

**Structure:**
```
Where you were / what frustrated you
What you found or built
Why you made it for others
Where it is now (honest, not inflated)
```

**Watchouts:** The sheet example piles on the significance ("redefine the future of
health"). That legacy-inflation is a documented AI tell (ai-tells.md section 1). Keep it
grounded in what actually happened. Caleb's real story is enough without a mission
statement. End on a real number, not a vision.

**Example:**
> I have been buying media for 12 years, most of it managing other people's budgets,
> $150M+ all in. The last two years the AI tools got genuinely good, but every course
> about them was either hype or someone who had never spent real money. That annoyed me
> enough to build the thing I wanted: a room where working media buyers actually share
> the AI workflows that hold up in a live account. I build tools live and give them away.
> 500+ of us now. It is $97/mo and I am still adding to it every week.
> skool.com/mrpaidsocial

**Headline:** `Why I built this instead of a course`

---

## 13. I Saw This On TikTok

**When to use:** Native social-proof framing. Reframe the "I saw this trending" hook for
where these buyers actually discover tools: a peer's feed, a group chat, this community.

**Structure:**
```
"I saw / someone showed me [thing] and..."
The honest reaction
What it turned out to be
```

**Watchouts:** A literal "I saw this on TikTok" is off-audience for 8-figure buyers. Keep
the mechanic (peer discovery, mild disbelief) but move it to a believable channel. Do not
fake a trend. The reaction should be real, a little skeptical, then won over.

**Example:**
> Someone in my community posted a Claude Code workflow that builds a full batch of ads
> from one product photo, and honestly I did not believe it until I ran it myself. Then
> I filmed the whole setup and dropped it in the classroom. That is a pretty normal
> Tuesday in here: a member finds something, we pressure-test it, everyone gets the
> recipe. 500+ media buyers, $97/mo, skool.com/mrpaidsocial.

**Headline:** `I did not believe this workflow either`

---

## 14. Hook

**When to use:** When your video or visual already has a killer opening line. Lift it as
the primary text so the copy and the creative hit the same note.

**Structure:**
```
The hook line from the creative, verbatim (or close)
```

**Watchouts:** The sheet leans on a giant fake-precise number ("liked over 17 MILLION
times"). Only use a number if it is real. A concrete, specific hook beats a clever one.
It should sound like a line a person would actually say out loud, not a headline.

**Example:**
> Most of my static ads cost me between 10 and 50 cents to make now.

**Headline:** `My static ads cost me cents`

---

## 15. IF Statements

**When to use:** Cold traffic qualification. The "if" filters for exactly the person you
want and makes them feel called out in a good way.

**Structure:**
```
"If [specific painful situation they are in]..."
"...then [the shift, plainly stated]"
Where to go
```

**Watchouts:** Keep the "if" clause specific to this audience's real pain (a losing test
queue, CPA creeping, tool overwhelm), not a generic dream. The AI trap is following the
"if" with a "not just X, it's Y" flourish; resolve it with a plain "then." One "if" per
ad, not a stacked list of them.

**Example:**
> If you are launching creative every week and most of it dies before you learn anything
> from it, the problem is usually the system around the test, not the ad. That is the
> whole thing we work on inside The Ai Ads Alchemists. 500+ media buyers, monthly calls
> with seven-figure buyers, and the AI tools I build to make testing cheap and fast.
> $97/mo, skool.com/mrpaidsocial.

**Headline:** `If your tests die before you learn`

---

## Quick picker

| You have... | Reach for |
|---|---|
| A real build story or confession | First Person (#1), Before/After (#8) |
| A stacked, legible offer | Feature Benefits (#2), Top 3 (#7) |
| A real member quote | Testimonial (#3), First Person Testimonial (#4) |
| A genuine deadline / live call | Urgency (#5) |
| One strong real number | Statistic (#6), Hook (#14) |
| A wrong belief to call out | Challenge Status Quo (#11) |
| The origin / mission | Founders Story (#12) |
| A pain to name out loud | Relatable (#9), IF Statements (#15) |
| Peer-discovery social proof | I Saw This (#13) |
| A witty line + strong visual | Puns/Teasers (#10) |

Never ship #3 or #4 with an invented quote. When in doubt, the receipt beats the
adjective, and a different framework beats a fabrication.
