# AI writing tells — PFM kill list

Adapted from Wikipedia's "Signs of AI writing" (WP:AISIGNS), tuned for PFM direct-response
and native story copy. Origin credit: reverse-engineered from Caleb Kruse's "Un-AI Ad Copy"
material, then de-branded and re-tuned for our verticals.

**How to read this.** One tell in isolation proves nothing (real people use "not just"
sometimes). The catalog is a **density check**. AI copy stacks five of these in a
paragraph. The goal is copy where a suspicious scroller finds zero. Sections 1-3 are
mostly greppable by `scripts/slop-scan.sh`; sections 4-6 need a human/Claude reread.

**Before you "fix" anything, check the PFM allow-list in SKILL.md.** Our native ads
intentionally use lowercase, fragments, run-ons, and emotional-beat punctuation. Those are
on-voice, not tells. The tell is always the *formulaic corporate* version of a device.

---

## 1. Vocabulary tells

Words that spiked after 2022 because models overuse them. The overused word is the tell,
not its synonym, so the fix is never a thesaurus swap. Rewrite around a concrete detail.

| AI word/phrase | Do this instead |
|---|---|
| delve, dive deep, deep dive | Just say the thing |
| crucial, pivotal, vital, key (adj.) | Say why it matters with a number |
| seamless(ly), effortless(ly), frictionless | Name the friction removed ("no calls, no forms to print") |
| unlock, unleash, elevate, empower, supercharge, harness | Use the real verb: check, compare, switch, save |
| game-changing, revolutionary, groundbreaking, transformative, cutting-edge, next-level | Delete. Give the receipt |
| leverage, utilize | use |
| landscape, realm, space, ecosystem (abstract) | Name the real thing ("your renewal", "your metro") |
| tapestry, testament, underscore(s), showcase, boasts | Delete or state plainly |
| journey | Skip it |
| robust, comprehensive, holistic | The number, or the list of what's included |
| meticulous(ly), intricate, intricacies | Say what the care actually produced |
| foster(ing), garner, bolster | Plain verb |
| actionable insights, valuable insights | The actual takeaway, stated |
| streamline, optimize | What specifically gets faster/cheaper, and by how much |
| say goodbye to X, say hello to Y | State the change once, concretely |
| look no further, we've got you covered, the possibilities are endless | Delete |
| in today's..., fast-paced, ever-evolving, digital age | Delete the whole opener |

Era note: the exact buzzwords drift as models update (delve peaked 2023-24; "showcasing/
highlighting" dominate newer models). The stable pattern is inflated abstract vocabulary
standing in for a specific. New words that feel like these belong here before anyone
documents them.

---

## 2. Sentence-pattern tells

**Negative parallelism.** The loudest tell in current ad copy. Variants:
- "It's not just X, it's Y" / "isn't just another X"
- "Not only X, but also Y"
- "It's not about X. It's about Y."
- "No X. No Y. Just Z." ("No fluff. No theory. Just results.")

Real people write one of these occasionally. AI ad copy is *built* out of them. Rewrite as
the positive claim standing alone.
- Slop: "This isn't just another insurance quote. It's peace of mind."
- Human: "I put my info in once and 11 carriers had to show me their real number. Mine dropped $308 a month."

> PFM note: a bare "not just" inside natural dialogue is fine (allow-list). The tell is the
> stacked, scaffolding use, and the "No X. No Y. Just Z." triad. The scanner flags the
> stacked forms as HARD and bare "not just / not only" as REVIEW.

**Rule of three.** Exactly three parallel adjectives or phrases, over and over, to make
thin copy feel complete. Cut to two or extend to four; make items uneven.
- Slop: "Fast, easy, and reliable coverage."
- Human: "Took me about 90 seconds. No phone call."
- Allowed (concrete, uneven): "My brother switched, then a guy on my crew, then my neighbor who'd overpaid for 15 years." (real story items, not abstractions)

**Copula avoidance.** "Serves as", "stands as", "acts as", "offers a", "features a" where
a person writes "is" or "has". AI uses is/are 10%+ less than humans. Write "is" and "has".
- Slop: "This tool serves as a way to compare rates."
- Human: "It's a site that makes every carrier show you their price at once."

**Participle tails.** A benefit clause glued to the end with a comma: ", ensuring you never
overpay", ", helping you save hundreds", ", allowing you to keep your coverage". Superficial
analysis in miniature. If the benefit is real, it earns its own sentence with its own receipt.
- Slop: "You compare every carrier, saving you hundreds a year."
- Human: "I compared every carrier in one go. Mine came back $81. I'd been quoted $389."

**Rhetorical-fragment pivots.** "The result? Instant savings." "The best part? It's free."
Learned from a decade of LinkedIn posts; a strong tell. Just make the statement.
- Slop: "The catch? There isn't one."
- Human: "there's no catch that I found. it cost me nothing to check and I didn't have to cancel anything first."

**Vague attribution.** "Experts agree", "studies show", "drivers everywhere are switching".
Weasel wording. Name the person/source or cut. (For PFM, prefer the story's own character:
"the guy on my crew", not "experts".)

**Hedged grandeur.** "One of the most powerful ways to save on insurance today." AI avoids
checkable commitments while inflating tone. Commit to a verifiable specific instead, within
compliance ("most people find they can save up to [state number]"), never a guarantee.

---

## 3. Formatting tells

- **Em and en dashes.** Banned outright at PFM and a documented AI tell. Use commas,
  periods, parentheses, or "...". Automatic fail.
- **Curly quotes/apostrophes** (" " ' ') instead of straight ones: chatbot paste artifact.
  Use straight quotes.
- **Bold inline-header bullets** (`- **Fast:** get a quote in seconds`) repeated down a
  list: the signature AI list format. Not native. Kill it.
- **Emoji as bullets** or one emoji per line, mechanically. PFM native copy uses at most a
  rare single emoji at a beat, never as scaffolding.
- **Title Case On Every Line / Heading.** Native posts are sentence case or lowercase.
- **Boldface sprayed across key phrases** in a paragraph. Native posts don't self-highlight.

---

## 4. Tone tells (reread, can't grep)

- **Puffery / significance inflation.** "A trusted way to unlock real savings." Generic
  positives that could sit under any brand. Every sentence should contain something that
  only applies to this exact story/offer.
- **Press-release voice.** "We are committed to helping drivers find affordable coverage."
  Nobody talks like this, least of all in a native post.
- **Frictionless enthusiasm.** Everything is amazing, nothing has a rough edge. Real stories
  admit mess: "felt like a slap", "I almost didn't bother", "took me three tries". At least
  one honest-friction line makes copy read human and is on-voice for our stories.
- **Grand-challenge framing.** "In an era where drivers face rising premiums..." The
  "Despite challenges... a brighter future" formula in ad clothing. Open on the specific
  pain instead: "my renewal jumped $312 to $389 and nobody could tell me why."

---

## 5. What human copy does (write toward these)

- Simple is/has, used without embarrassment.
- Plain verbs: checked, switched, called around, paid off, saved, moved.
- Definitive checkable specifics; superlatives only when true.
- Natural hedges: "honestly", "pretty much", "I figured", "kind of".
- Occasional wordiness ("the fact that", "in order to"). Humans aren't maximally compressed.
  Don't inject errors on purpose; just don't sand every edge.
- Specifics only lived experience produces: odd dollar amounts, street names, vehicle years,
  times of day, what broke, how long it took.
- Varied rhythm: a fragment, a long rambly sentence, a two-word one.
- The PFM native texture: lowercase starts, 1-2 tiny imperfections at emotional beats.

---

## 6. Before / after (PFM insurance native)

**Example 1 — native long copy body**

Slop:
> Tired of overpaying for auto insurance? Our seamless platform empowers you to unlock
> game-changing savings by comparing every carrier effortlessly. It's not just a quote,
> it's peace of mind. The best part? It's completely free. Say goodbye to high premiums.

Human (PFM native voice):
> my renewal came in at $389 a month. same car, same clean record, nothing changed.
>
> I called around for two days. every quote came back worse. felt like a slap.
>
> then a guy on my crew told me about this site that makes every carrier show you their
> real price at once. took me maybe 90 seconds.
>
> mine came back $81. I sat in the truck and just stared at it.

Why it works: one lived story, odd real numbers ($389, $81, 90 seconds), plain verbs, a
guide hands over the mechanism, a friction line ("felt like a slap"), zero AI vocabulary,
zero parallelism.

**Example 2 — hook line**

Slop: `In today's fast-paced world, saving on insurance has never been easier.`
Human: `my renewal jumped to $389 and the agent just said "that's the market now."`

**Example 3 — the thesaurus trap**

Flagged: "Seamlessly compare carriers and unlock your savings."
Bad fix (synonym, still AI-shaped): "Smoothly compare carriers and find your savings."
Real fix (receipt): "put your info in once and it pulls every carrier's real price. mine was $81 vs the $389 I got quoted."

**Example 4 — participle tail**

Flagged: "You compare every carrier at once, ensuring you never overpay again."
Fix: "you see every carrier's price at once. mine was less than half what I was paying."
