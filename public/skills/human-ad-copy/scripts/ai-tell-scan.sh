#!/usr/bin/env bash
# ai-tell-scan.sh — mechanical scan for AI-writing tells in ad copy.
#
# Usage: bash ai-tell-scan.sh <draft-file>
# Exit codes: 0 = no hard tells, 1 = hard tells found, 2 = usage error.
#
# HARD tells should always be rewritten. REVIEW tells are judgment calls:
# keep only if literal usage or genuine Caleb diction (see voice/voice.md).
# Structural tells (rule of three, rhythm, puffery, elegant variation) can't
# be grepped; sweep for those manually per references/ai-tells.md.

f="${1:?usage: ai-tell-scan.sh <draft-file>}"
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
scan HARD "em/en dash (banned in this hub)" -E '—|–'
scan HARD "curly quotes/apostrophes (chatbot paste artifact)" -E "“|”|‘|’"
scan HARD "bold inline-header bullet (signature AI list format)" -E '^[[:space:]]*[-*•][[:space:]]*\*\*[^*]+\*\*'
LC_ALL=C scan REVIEW "line starts with emoji (emoji-as-bullet)" -E $'^\xF0\x9F'

# ---- vocabulary: hard ----------------------------------------------------
scan HARD "AI vocabulary" -iwE 'delve|delves|delving|pivotal|tapestry|testament|meticulous|meticulously|intricate|intricacies|garner|garnered|bolster|bolstered|underscores|underscored|seamless|seamlessly|effortless|effortlessly|frictionless|elevate|elevates|elevating|unleash|supercharge|revolutionize|revolutionary|groundbreaking|transformative|empower|empowers|empowering|utilize|utilizes|utilizing|realm|ever-evolving|boasts'
scan HARD "guru/AI hype (banned by voice doc too)" -iE 'game-chang(er|ing)|cutting-edge|next-level|crush it|secret sauce|10x your|6-figure|future-proof'
scan HARD "canned ad-slop phrases" -iE "say goodbye|say hello to|look no further|we've got you covered|possibilities are endless|in today's|fast-paced|digital age|to the next level|actionable insights|valuable insights"

# ---- vocabulary: review --------------------------------------------------
scan REVIEW "abstract-noun tells (ok if literal)" -iwE 'landscape|journey|ecosystem|tapestries|harness|harnessing|fostering|foster'
scan REVIEW "corporate verbs (prefer plain: use, build, speed up)" -iwE 'leverage|leveraging|streamline|streamlined|robust|holistic|comprehensive'

# ---- sentence patterns ---------------------------------------------------
scan HARD "negative parallelism (the #1 tell)" -iE "isn't just|aren't just|not just|not only|it's not about|isn't another|isn't about|more than just|no fluff"
scan HARD "rhetorical-fragment pivot" -E '(The result|The best part|The catch|The kicker|The difference|The problem)\?'
scan REVIEW "negative parallelism (generic isn't-X, it's-Y)" -iE "isn'?t [^.?!]{0,45}[.,] *(it|that|this)'?s"
scan REVIEW "ad-slop stock phrases" -iE "here's the truth|the truth is|sound familiar\?|spray and pray|10x |down the drain"
scan HARD "participle tail (glued-on benefit clause)" -iE ', (ensuring|enabling|allowing you|highlighting|showcasing|underscoring|reflecting|emphasizing|fostering|empowering)'
scan REVIEW "participle tail (softer variants)" -iE ', (helping you|giving you|letting you|making it eas)'
scan REVIEW "copula avoidance (prefer is/has)" -iE 'serves as|stands as|acts as a|marks a|represents a'
scan REVIEW "vague attribution (name the source or cut)" -iE 'experts (say|agree)|industry reports|top media buyers (agree|say)|professionals everywhere|widely regarded'
scan REVIEW "throat-clearing opener" -iE '^(In a world|In an era|Imagine a world|What if I told you|Picture this)'

# ---- summary -------------------------------------------------------------
echo ""
echo "----------------------------------------"
if [ "$hard" -eq 0 ] && [ "$review" -eq 0 ]; then
  echo "Clean. No mechanical tells found."
  echo "Still do the judgment sweep: rule of three, rhythm, puffery, elegant variation."
  exit 0
fi
echo "Hard tells:   $hard  (rewrite every one, add a receipt, don't thesaurus-swap)"
echo "Review tells: $review  (keep only if literal or genuine Caleb diction)"
echo "Then do the judgment sweep per references/ai-tells.md sections 4-6."
[ "$hard" -gt 0 ] && exit 1
exit 0
