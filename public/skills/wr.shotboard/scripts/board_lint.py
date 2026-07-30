#!/usr/bin/env python3
"""
board_lint.py — mechanical pre-delivery lint for wr.shotboard boards (born 2026-07-29).

Why this exists: the board's grammar + AI-production laws lived as mid-file prose and kept
getting skipped during authoring ("sorry, I just skipped that" — Sam, Seedance creatives).
Attention dilution is real; a grep is immune to it. This script checks the DRAFTED
SHOTBOARD.md against every machine-checkable law and prints PASS/FAIL per rule.

A board does not ship until this exits 0. Judgment-only rules (comedy timing, cut-every-
3-4s pacing) stay with the author — the lint prints them as MANUAL so they get eyeballed,
never silently assumed.

Usage: python3 board_lint.py <SHOTBOARD.md>
Exit:  0 = all hard checks pass · 1 = violations (each printed with the offending row)
"""

import re
import sys
from pathlib import Path

FRAMING_VOCAB = re.compile(r"\b(WIDE|MS|MCU|CU|ECU|OTS|react|insert)\b", re.I)
TIGHT_ENOUGH = re.compile(r"\b(MCU|CU|ECU|OTS)\b", re.I)  # dialogue-legal framings
SUBJECT = re.compile(r"\b([A-Z]{3,})\b")  # first ALL-CAPS name in the blocking cell
DIALOGUE = re.compile(r"[\"“][^\"”]{2,}[\"”]")  # a quoted spoken line
NON_SPEAKING = re.compile(r"non-?speaking|no dialogue|silent", re.I)

fails = []
warns = []


def check(name, ok, detail=""):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}" + (f" — {detail}" if detail and not ok else ""))
    if not ok:
        fails.append(name)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    p = Path(sys.argv[1])
    if not p.is_file():
        print(f"FAIL: no board at {p}")
        sys.exit(1)
    text = p.read_text()

    print(f"board_lint — {p.name}")
    print("— header —")
    head = text.split("| # |")[0] if "| # |" in text else text
    check("geography states BOTH screen directions (room-relative)",
          re.search(r"screen-?LEFT", head, re.I) and re.search(r"screen-?RIGHT", head, re.I),
          "header must derive screen-left/right from the locked room")
    check("at least one axis defined in the header",
          re.search(r"\bAxis\b", head, re.I), "state the line of action and which side cameras stay on")
    check("eyelines assigned (frame-RIGHT and frame-LEFT both appear)",
          re.search(r"frame-?RIGHT", head, re.I) and re.search(r"frame-?LEFT", head, re.I),
          "each speaker pairing needs opposed eyelines")

    print("— board table —")
    rows = []  # (id, shotcol, blocking)
    for m in re.finditer(r"^\|\s*(S\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|", text, re.M):
        rows.append((m.group(1).strip(), m.group(3).strip(), m.group(4).strip()))
    check(f"board table parses ({len(rows)} shots)", len(rows) >= 4,
          "expected `| S## | Beat | Shot | Framing & blocking | Cut logic |` rows")

    bad_vocab = [r[0] for r in rows if not FRAMING_VOCAB.search(r[1])]
    check("every Shot cell uses the framing vocabulary (WIDE/MS/MCU/CU/ECU/OTS/react/insert)",
          not bad_vocab, f"unknown framing on: {', '.join(bad_vocab)}")

    talking_wides = []
    for sid, shot, blk in rows:
        if DIALOGUE.search(blk) and not NON_SPEAKING.search(blk):
            if re.search(r"\b(WIDE|MS)\b", shot, re.I) and not TIGHT_ENOUGH.search(shot):
                talking_wides.append(sid)
    check("dialogue lands ONLY on MCU or tighter (lip-sync law) — no spoken lines on bare WIDE/MS",
          not talking_wides, f"dialogue on a wide/medium: {', '.join(talking_wides)}")

    wides = [sid for sid, shot, _ in rows if re.search(r"\bWIDE\b", shot, re.I)]
    check(f"wides are scarce and spent on action ({len(wides)} found, max 2)", len(wides) <= 2,
          f"wides: {', '.join(wides)} — commercials get ONE wide, spent on an entrance/reveal")
    speaking_wides = [sid for sid, shot, blk in rows
                      if re.search(r"\bWIDE\b", shot, re.I) and DIALOGUE.search(blk)
                      and not NON_SPEAKING.search(blk)]
    check("every wide is non-speaking", not speaking_wides, f"wide with dialogue: {', '.join(speaking_wides)}")

    same_cut = []
    for (a_id, a_shot, a_blk), (b_id, b_shot, b_blk) in zip(rows, rows[1:]):
        a_f = sorted(set(x.upper() for x in FRAMING_VOCAB.findall(a_shot)))
        b_f = sorted(set(x.upper() for x in FRAMING_VOCAB.findall(b_shot)))
        a_s = SUBJECT.search(a_blk)
        b_s = SUBJECT.search(b_blk)
        if a_f and a_f == b_f and a_s and b_s and a_s.group(1) == b_s.group(1):
            same_cut.append(f"{a_id}->{b_id}")
    check("size changes on every cut (no back-to-back identical framing on the same subject)",
          not same_cut, f"identical consecutive framing: {', '.join(same_cut)}")

    punches = sum(1 for _, shot, blk in rows if re.search(r"punch-?in", shot + " " + blk, re.I))
    check(f"axial punch-in reserved for THE beat ({punches} found, max 2)", punches <= 2,
          "punch-ins are an emphasis tool, not a habit")

    print("— downstream sections —")
    check("gen-unit grouping section present", re.search(r"gen-?unit", text, re.I),
          "map shots -> Seedance/Veo gen units")
    unit_text = text[re.search(r"gen-?unit", text, re.I).start():] if re.search(r"gen-?unit", text, re.I) else ""
    orphans = [sid for sid, _, _ in rows if sid not in unit_text]
    check("every shot appears in a gen unit", not orphans, f"unmapped shots: {', '.join(orphans)}")
    check("prompt-seed section present with a Common block",
          re.search(r"seed", text, re.I) and re.search(r"\bCommon\b", text, re.I) is not None,
          "section 4: Common look/negatives block + per-shot framing lines")
    check("commercial register locked (no handheld / phone-camera look in the Common block)",
          re.search(r"no handheld|no phone-?camera", text, re.I) is not None,
          "the Common negatives must ban the iPhone register — do not mix registers")

    print("— manual (judgment — eyeball these, the grep can't) —")
    for m in ["comedy cuts land ON the last word, reactions held ~1s",
              "cut pace ~every 3-4s via inserts/reactions",
              "cold open is TIGHT (hook first, no establishing wide)",
              "OTS two-speaker clips favor the ANSWERER (one mouth syncs)",
              "every prompt seed names its env plate + master(s), ref aspect == render aspect"]:
        print(f"  [MANUAL] {m}")

    print("----------------------------------------")
    if fails:
        print(f"BOARD LINT: FAIL ({len(fails)}) — fix before delivering; do not hand the editor an unlinted board")
        sys.exit(1)
    print("BOARD LINT: PASS — deliver with 'board_lint PASS' named in the handoff")
    sys.exit(0)


if __name__ == "__main__":
    main()
