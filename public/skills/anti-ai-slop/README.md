# anti-ai-slop — PFM final human-voice pass

The last look-through before any PFM copy or script ships. Scrubs the tells that make
copy read machine-written and fixes them by adding a concrete receipt, not a synonym.
Tuned for our native story voice, so it never sands out our intentional lowercase,
fragments, or emotional-beat punctuation.

## What's inside
- `SKILL.md` — the workflow: when to offer it, the scan, the PFM allow-list, the
  receipt-fix principle, output format, em-dash gate.
- `references/ai-tells.md` — the full kill list with PFM insurance-native before/after
  examples.
- `scripts/slop-scan.sh` — mechanical grep scan. `bash scripts/slop-scan.sh <draft-file>`

## Install
Move the `anti-ai-slop` folder into your skills directory via Settings → Capabilities
(or drop the `.skill` bundle in). It should sit alongside the other PFM skills.

## Use
- It offers itself at the end of any copy deliverable: "want me to run the final
  anti-AI-slop pass before you ship this?"
- Or trigger directly: "de-slop this", "does this sound like AI", "/anti-ai-slop".
- Sam's standing directive (2026-07-28): messages written to people on Sam's behalf get
  this pass silently.

## Note on scope
This is a voice scrub, not a rewrite. Story structure stays with `native-long-copy-ad` /
`veo-script-writing`. Spanish naturalness stays with `spanish-translation`. It never adds
a claim or number that isn't real or backed by `vertical-offer-context`.

Origin: distilled from Caleb Kruse's "Un-AI Ad Copy" material, de-branded and re-tuned
for PFM. The 15 consumer/B2B frameworks from the original were intentionally left out as
off-genre for our narrative insurance ads.
