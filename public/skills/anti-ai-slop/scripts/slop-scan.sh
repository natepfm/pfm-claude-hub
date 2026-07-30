#!/usr/bin/env bash
# slop-scan.sh — mechanical scan for AI-writing tells in PFM copy/scripts.
#
# Usage: bash slop-scan.sh <draft-file>
# Exit codes: 0 = no hard tells, 1 = hard tells found, 2 = usage error.
#
# HARD tells always get rewritten (fix with a receipt, not a synonym).
# REVIEW tells are judgment calls: keep only if it's genuine PFM native voice
# (see the allow-list in SKILL.md) or literal/correct usage.
# Structural tells (rule of three, rhythm, puffery, elegant variation) can't be
# grepped. Sweep for those by hand against references/ai-tells.md sections 4-6.

f="${1:?usage: bash slop-scan.sh <draft-file>}"
[ -r "$f" ] || { echo "cannot read: $f" >&2; exit 2; }

hard=0
review=0

scan() { # scan <HARD|REVIEW> <label> <grep args...>
  local sev="$1" label="$2"; shift 2
  local out
  out=$(grep -n "$@" "$f" 2>/dev/null)
  [ -z "$out" ] && return 0
  printf '\n[%s] %s\n' "$sev" "$label"
  printf '%s\n' "$out" | sed 's/^/    /'
  local n
  n=$(printf '%s\n' "$out" | wc -l | tr -d ' ')
  if [ "$sev" = "HARD" ]; then hard=$((hard + n)); else review=$((review + n)); fi
}

# ---- punctuation & formatting -------------------------------------------
scan HARD "em/en dash (PFM hard fail)" -E '—|–'
scan HARD "curly quotes/apostrophes (chatbot paste artifact)" -E "“|”|‘|’"
scan HARD "bold inline-header bullet (signature AI list format)" -E '^[[:space:]]*[-*•][[:space:]]*\*\*[^*]+\*\*'
LC_ALL=C scan REVIEW "line starts with emoji (emoji-as-bullet; 1 rare beat emoji is ok)" -E $'^\xF0\x9F'

# ---- vocabulary: hard ----------------------------------------------------
scan HARD "AI vocabulary" -iwE 'delve|delves|delving|pivotal|tapestry|testament|meticulous|meticulously|intricate|intricacies|garner|garnered|bolster|bolstered|underscores|underscored|seamless|seamlessly|effortless|effortlessly|frictionless|elevate|elevates|elevating|unleash|unlock|unlocks|unlocking|supercharge|revolutionize|revolutionary|groundbreaking|transformative|empower|empowers|empowering|utilize|utilizes|utilizing|realm|ever-evolving|boasts'
scan HARD "hype/guru vocabulary" -iE 'game-chang(er|ing)|cutting-edge|next-level|crush it|secret sauce|10x|future-proof'
scan HARD "canned ad-slop phrases" -iE "say goodbye|say hello to|look no further|we've got you covered|possibilities are endless|in today's|fast-paced|digital age|to the next level|actionable insights|valuable insights|peace of mind"

# ---- vocabulary: review --------------------------------------------------
scan REVIEW "abstract-noun tells (ok only if literal)" -iwE 'landscape|journey|ecosystem|harness|harnessing|fostering|foster'
scan REVIEW "corporate verbs (prefer plain: use, check, compare, switch)" -iwE 'leverage|leveraging|streamline|streamlined|optimize|robust|holistic|comprehensive'

# ---- sentence patterns ---------------------------------------------------
scan HARD "negative parallelism, scaffolding form (the #1 tell)" -iE "isn't just another|aren't just|not only .* but also|it's not about|more than just|no fluff|no theory|no gimmicks"
scan HARD "'No X. No Y. Just Z.' triad" -iE 'no [a-z]+\. *no [a-z]+\. *just '
scan HARD "rhetorical-fragment pivot" -E '(The result|The best part|The catch|The kicker|The difference|The problem|The twist)\?'
scan REVIEW "negative parallelism, bare (ok in natural dialogue)" -iE "not just|isn'?t just|isn'?t another"
scan HARD "participle tail (glued-on benefit clause)" -iE ', (ensuring|enabling|allowing you|helping you save|highlighting|showcasing|underscoring|reflecting|emphasizing|fostering|empowering)'
scan REVIEW "participle tail (softer variants)" -iE ', (giving you|letting you|making it eas|so you never)'
scan REVIEW "copula avoidance (prefer is/has)" -iE 'serves as|stands as|acts as a|offers a|features a|represents a'
scan REVIEW "vague attribution (name the character or cut)" -iE 'experts (say|agree)|studies show|industry reports|drivers everywhere|professionals everywhere|widely regarded'
scan REVIEW "hedged grandeur" -iE 'one of the most|among the most|arguably the'
scan REVIEW "throat-clearing / grand-challenge opener" -iE '^(In a world|In an era|In today|Imagine|Picture this|What if)'

# ---- summary -------------------------------------------------------------
echo ""
echo "----------------------------------------"
if [ "$hard" -eq 0 ] && [ "$review" -eq 0 ]; then
  echo "Clean. No mechanical tells found."
  echo "Still do the judgment sweep: rule of three, rhythm, puffery, elegant variation,"
  echo "frictionless enthusiasm (ai-tells.md sections 4-6)."
  exit 0
fi
echo "Hard tells:   $hard  (rewrite each with a receipt, never a synonym swap)"
echo "Review tells: $review  (keep only if genuine PFM native voice or literal usage)"
echo "Then do the judgment sweep per references/ai-tells.md sections 4-6."
[ "$hard" -gt 0 ] && exit 1
exit 0
