---
name: naturalize-numbers
description: >-
  Convert digit dollar amounts in a Veo / talking-head script to natural spoken-read
  form so the TTS reads them the way a person says them ("$4,695" → "forty-seven
  hundred", "$391" → "three ninety one"), not robotically ("four thousand six hundred
  ninety-five"). Encodes PFM's locked B6 spoken-number rules with the high-vs-low rate
  distinction. Use when an editor says "naturalize the numbers", "the numbers are off /
  need to be spoken naturally", "make the numbers natural", "spoken numbers", "fix how
  the rates read", or before firing/staging any podcast / talking-head Veo script whose
  dialogue carries dollar figures. Pairs with / called by veo-script-writing (which owns
  the broader Veo line rules). NOT for: VSL slides (those spell full thousands — opposite
  rule), non-spoken on-screen text, or re-balancing line length (that's veo-script-writing).
---

# Naturalize Numbers — spoken-read dollar amounts for Veo

A digit on the page reads robotically through Veo TTS. A person reading "$4,695" aloud says **"forty seven hundred"** or **"forty six ninety five"**, never "four thousand six hundred ninety-five." This skill converts every dollar figure in a script to its natural spoken form, using PFM's locked rules — and crucially keeps the *low/payoff* numbers attractive while rounding the *high/bad* ones clean.

Built 2026-06-12 on the Christian Hall Home Moving States build (the Blake-pivot podcast story).

## The helper (do the math with code, never by hand)

`naturalize.py` does the conversion. Don't eyeball it — call it:

```bash
python3 ~/.claude/skills/naturalize-numbers/naturalize.py <amount> <type>
# 4695 high   -> forty seven hundred      6587 high  -> sixty six hundred
# 1968 low    -> nineteen sixty eight     5016 quote -> fifty sixteen
# 391  month  -> three ninety one         141  delta -> one forty one
# 876  savings-> over eight hundred fifty  900  plain -> nine hundred
```

For a whole script, import it (`from naturalize import naturalize`) and map each figure through its type — that's how the Christian B1 master + all 10 state fills were converted in one pass.

## The locked rules (Sam, B6 — the high/low distinction is load-bearing)

| Type | Field examples | Treatment | Why |
|---|---|---|---|
| **high** | state rate, neighbor's old rate, narrator's old CA rate | round to nearest 100 → **"X hundred"** (4695→"forty seven hundred") | big "bad" numbers; rounding kills the cents-sound ("forty two ninety six" = .96) |
| **low** | the lander's low rate, "my new quote" | **EXACT two-pair**, NO rounding (1968→"nineteen sixty eight") | rounding these UP weakens the pitch / crosses psychological lines ($2k). Keep them low + accurate |
| **quote** | bare quote-lists ("$4,440. $4,872…") | **EXACT two-pair**, NO rounding | a rattled-off list; exact is natural |
| **month** | any monthly rate | **EXACT two-pair** (391→"three ninety one") | 3-digit reads fine + stays accurate |
| **delta** | "an extra $X a month" | natural (141→"one forty one", 75→"seventy-five") | small, conversational |
| **savings** | "we've saved $X" | floor to nearest 50, prefix **"over"** (876→"over eight hundred fifty") | a person rounds down + hedges when bragging |
| **plain** | round references ($900, $950) | spoken words ("nine hundred") | already clean |
| **million** | "$1.2 million" | "one point two million" (handle inline) | — |

**🛑 The high-vs-low call is the one that bites.** Blanket-rounding everything rounds the LOW payoff rate UP ($1,968 → "two thousand"), which guts the whole "look how cheap it is now" pitch. Always classify each figure as the *bad* number (round) or the *good/payoff* number (exact two-pair) before converting. Sam corrected exactly this on the Christian build.

**Exception — VSL slides** spell full thousands (their on-screen TTS truncates "[teen] hundred"). This skill is for *spoken* podcast/talking-head dialogue only; do NOT apply it to VSL slide text.

## Workflow

1. **Identify** every dollar figure in the script (master template fixed numbers + per-state fills).
2. **Classify** each as high / low / quote / month / delta / savings / plain / million (the table above). For a state creative, the field name tells you (STATE_RATE = high, LOW_RATE / MY_LOW = low, QUOTE = quote, *_MONTH = month, *_SAVINGS = savings, NEIGHBOR_OLD = high).
3. **Confirm the style with the editor first** (hard rule, Sam 2026-06-01) — show the treatment on a sample state + the master fixed numbers, and confirm the high/low split before rewriting. Ask in plain markdown (the sanctioned cards are Fire?/stage-routing/missing-ref only).
4. **Convert** with `naturalize.py` (never hand-math). Capitalize sentence-initial reads.
5. **Clean pass** — fix `a`/`an` before the state ("an Oklahoma", "an Illinois", "an Alabama"), strip dashes + ALL CAPS (veo-script-writing rules ride along).
6. **Apply** — write the naturalized dialogue as the firing manifest in the project, AND (if asked) rewrite the Notion request's Copy in place. For the in-place Notion rewrite: match the exact bolded/escaped figure (`**\$4,695**`) per line with `update_content`; verify 0 leftover `**$digit**` remain in the spoken lines afterward. The fill table + master token lines (`$[TOKEN]`) are data/pattern reference and can stay digits.

## Provenance + cross-references

- Locked 2026-06-12 (Christian Hall Home Moving States B1). Memory: `feedback_veo_number_naturalization`.
- `veo-script-writing` — owns the broader Veo line rules; defers here for the spoken-number conversion.
- `lc-to-video-podcast`, `hvg-flow`, `stage-request` — downstream consumers of the naturalized dialogue.
- Counterpart rule lives in `veo-script-writing` under "Numbers as words"; this skill is the executable version with the high/low split.
