#!/usr/bin/env python3
"""compliance_lint.py — PFM's mechanical compliance gate for ad scripts (G2).

THE gate every writing skill runs before a script ships (veo-script-writing,
lc-to-video-podcast, story-beats, breaking-news-story-ads; human-ad-copy adds it
after its tell-scan). Turns the prose compliance checklists into a machine check:
exit 0 = clean, exit 1 = FAIL lines present (fix + re-run), exit 2 = usage error.
WARN lines never block alone — they're judgment calls surfaced for the runner.

Usage:
  python3 compliance_lint.py <script.md>                # file
  cat script | python3 compliance_lint.py -             # stdin
  ... --vertical auto|home-forms|home-calls|loans       # enables rate-floor checks
  ... --sma                                             # require the exact AI-performer disclaimer
"""
import argparse, re, sys

FAIL_PATTERNS = [
    # (regex, message)
    (r"\bwill save\b", 'claims must be "could save", never "will save" (PFM rule 4)'),
    (r"\bno sales? calls?\b", 'banned claim: "no sales call(s)" (locked 2026-07-14, rule 8)'),
    (r"\bno calling around\b", 'banned claim: "no calling around" (rule 8)'),
    (r"\b(nobody|no one|no-one) (will|is going to) call\b", 'banned claim: "nobody will call you" (rule 8)'),
    (r"\bwon'?t (get|receive) (any )?calls?\b", 'banned claim variant: promises no calls (rule 8)'),
    (r"\b(state farm|progressive|geico|allstate|liberty mutual|usaa|farmers insurance|walmart)\b",
     "no carrier/brand names in creatives (PFM rule 5)"),
    (r"\$\s?\d[\d,.]*\s?(a|per)\s?(day|week)\b", "rates must be monthly or yearly, never daily/weekly (PFM rule 6)"),
    (r"\bfree\s+(month|year|coverage|insurance|rate check|trial)\b",
     '"free" is only allowed for free QUOTE or free SIGNUP (PFM rule 7)'),
]

WARN_PATTERNS = [
    (r"\bprogram\b", '"program" as OFFER language is banned (rule 3: service/option/tool/site) — ordinary uses (TV program etc.) are fine; verify context'),
    (r"\b(ex[- ])?insurance agent\b", "if this is the AUTHORITY character, rule 1 bans it — a passing mention is fine; verify context"),
    (r"[—–]", "em/en dash in text — banned in Veo dialogue EXCEPT the wr.cutoff interruption exception; verify"),
    (r"\.\.\.|…", "ellipsis — banned in Veo dialogue, rewrite with comma/period (wr.cutoff covers cut-offs)"),
    (r"\bguarantee[ds]?\b", "guarantee language — usually a compliance problem, verify"),
    (r"\b100 ?%\b", "absolute claim — verify it isn't a savings/approval promise"),
]

# Monthly absolute floors (a spoken/written rate BELOW this = FAIL). Yearly derived.
FLOORS = {  # vertical: (monthly_floor, yearly_floor)
    "auto":       (19, 228),
    "home-forms": (30, 360),
    "home-calls": (50, 600),
    "loans":      (None, None),  # no rate floor — loans creatives don't quote insurance rates
}

SMA_LINE = "This advertisement contains synthetic performers created with artificial intelligence."

MONEY = re.compile(r"\$\s?(\d[\d,]*(?:\.\d+)?)\s*(?:(a|per)\s+)?(month|mo\b|monthly|year|yr\b|yearly|annually)?", re.I)
SPOKEN = re.compile(r"\b(\w[\w\s-]*?)\s+(?:dollars?|bucks)\s+(a|per)\s+(month|year)\b", re.I)


def floor_check(text, vertical, findings):
    mfloor, yfloor = FLOORS.get(vertical, (None, None))
    if not mfloor:
        return
    for ln_no, line in enumerate(text.splitlines(), 1):
        for m in MONEY.finditer(line):
            try:
                val = float(m.group(1).replace(",", ""))
            except ValueError:
                continue
            unit = (m.group(3) or "").lower()
            if unit.startswith(("month", "mo")) and val < mfloor:
                findings.append(("FAIL", ln_no, line.strip()[:80],
                                 f"${val:g}/month is BELOW the {vertical} floor (${mfloor}/mo)"))
            elif unit.startswith(("year", "yr", "annual")) and val < yfloor:
                findings.append(("FAIL", ln_no, line.strip()[:80],
                                 f"${val:g}/year is BELOW the {vertical} floor (${yfloor}/yr)"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script", help="script file path, or - for stdin")
    ap.add_argument("--vertical", choices=list(FLOORS), default=None,
                    help="enables rate-floor FAILs for that vertical")
    ap.add_argument("--sma", "--ny", dest="sma", action="store_true", help="NY creative: require the exact AI-performer disclaimer line (NY-only requirement)")
    a = ap.parse_args()

    text = sys.stdin.read() if a.script == "-" else open(a.script, encoding="utf-8").read()
    if not text.strip():
        print("ERROR: empty input", file=sys.stderr); sys.exit(2)

    findings = []
    for ln_no, line in enumerate(text.splitlines(), 1):
        low = line.lower()
        for rx, msg in FAIL_PATTERNS:
            if re.search(rx, low):
                findings.append(("FAIL", ln_no, line.strip()[:80], msg))
        for rx, msg in WARN_PATTERNS:
            if re.search(rx, line):
                findings.append(("WARN", ln_no, line.strip()[:80], msg))

    if a.vertical:
        floor_check(text, a.vertical, findings)

    if a.sma and SMA_LINE not in text:
        findings.append(("FAIL", 0, "(whole script)",
                         "NY creative but the exact AI-performer disclaimer line is ABSENT (NY-only requirement)"))

    fails = [f for f in findings if f[0] == "FAIL"]
    warns = [f for f in findings if f[0] == "WARN"]
    for kind, ln, snippet, msg in findings:
        loc = f"L{ln}" if ln else "GLOBAL"
        print(f"{kind}  {loc}: {msg}\n      | {snippet}")

    if fails:
        print(f"\n❌ COMPLIANCE LINT: {len(fails)} FAIL, {len(warns)} WARN — script may NOT ship. Fix FAILs + re-run.")
        sys.exit(1)
    print(f"✓ COMPLIANCE LINT PASS — 0 FAIL, {len(warns)} WARN{' (review warns)' if warns else ''}")


if __name__ == "__main__":
    main()
