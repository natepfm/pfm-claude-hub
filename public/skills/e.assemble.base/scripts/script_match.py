#!/usr/bin/env python3
"""e.assemble.base / e.assemble.raw — script match: verify every clip SAYS its script line
(audio-qc Phase-2 method: normalized SequenceMatcher vs expected, threshold 0.70).

--trims trims.json     reuses the transcripts fit_trims.py saved (no re-transcription)
--src DIR              transcribe now (raw assembly path; ElevenLabs Scribe w/ Whisper fallback)
--expected exp.json    {"L01_....mp4": "line text", ...} OR {"1": "line text", ...} keyed by
                       line number (clip's L## is matched). Values may be a string or a list
                       of candidate strings (per-state variants) — best similarity wins.
--manifest-dir DIR     build expected directly from DIR's *_dialogue.md manifests (the house
                       `STATE · L## · Speaker — "text"` form). All tables merge; per-state
                       variants of the same L## become candidates. No manifest found →
                       SKIPPED, exit 0. A line missing from expected is reported as
                       UNMATCHED, never a fail (parse gap != content gap — 07-26, L61/L62).
"""
import argparse, difflib, glob, json, os, re, sys


def norm(s):
    s = re.sub(r"[‘’']", "", s.lower())
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def from_manifests(d):
    exp = {}
    for path in sorted(glob.glob(os.path.join(d, "*_dialogue.md"))):
        for line in open(path, encoding="utf-8"):
            m = re.search(r"\bL(\d+)\b", line)
            spans = re.findall(r"[“\"](.+?)[”\"]", line)
            if not (m and spans):
                continue
            exp.setdefault(str(int(m.group(1))), []).append(max(spans, key=len))
    return exp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trims")
    ap.add_argument("--src")
    ap.add_argument("--expected")
    ap.add_argument("--manifest-dir")
    a = ap.parse_args()
    if a.expected:
        exp = json.load(open(a.expected))
    elif a.manifest_dir:
        exp = from_manifests(a.manifest_dir)
        if not exp:
            print(f"SKIPPED: no *_dialogue.md manifest in {a.manifest_dir} — script match not run")
            sys.exit(0)
    else:
        sys.exit("pass --expected or --manifest-dir")

    if a.trims:
        rows = [(t["file"], t.get("transcript", "")) for t in json.load(open(a.trims))]
    elif a.src:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from asm_lib import transcribe_words
        files = sorted(f for f in os.listdir(a.src) if f.endswith(".mp4"))
        rows = []
        for f in files:
            r = transcribe_words(os.path.join(a.src, f))
            rows.append((f, " ".join(x["word"].strip() for seg in r.get("segments", [])
                                     for x in seg.get("words", []))))
    else:
        sys.exit("pass --trims or --src")

    okc, flags, unmatched = 0, [], []
    for f, heard in rows:
        key = f if f in exp else None
        if key is None:
            m = re.match(r"L(\d+)", f)
            if m and str(int(m.group(1))) in exp:
                key = str(int(m.group(1)))
        if key is None:
            unmatched.append(f)
            continue
        cands = exp[key] if isinstance(exp[key], list) else [exp[key]]
        sim, best = max(
            (difflib.SequenceMatcher(None, norm(c), norm(heard)).ratio(), c) for c in cands
        )
        if sim >= 0.70:
            okc += 1
        else:
            flags.append((f, sim, best, heard))
    print(f"RESULT: {okc}/{len(rows)-len(unmatched)} match >= 0.70"
          f"{f'  ({len(unmatched)} UNMATCHED in expected — check manifest parse)' if unmatched else ''}")
    for f in unmatched:
        print(f"  UNMATCHED {f}")
    for f, s, e, g in flags:
        print(f"\nFLAG {f} sim={s:.2f}\n  expected: {e}\n  heard:    {g}")
    sys.exit(1 if flags else 0)


if __name__ == "__main__":
    main()
