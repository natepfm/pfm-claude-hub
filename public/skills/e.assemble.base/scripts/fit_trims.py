#!/usr/bin/env python3
"""e.assemble.base — trim fit for a talking-head clip set (proven 07-26, DaughterRanOverFerrari
Gavin Broad 16x9, Sam-approved after the tail refit).

HEAD  speech_span() from palmier_helpers (CANONICAL — energy onset, 120-900Hz voiced-band
      bandpass, guardrail >1.2s -> 0.20s). trim = max(0, round(onset*24) - LEAD_IN(2)).
TAIL  transcribe_words() (ElevenLabs Scribe, Whisper offline fallback — Scribe is SUPERIOR,
      proven 07-26: base.en Whisper dropped trailing words on 2/63 clips, cutting speech) ->
      last real word end (non-lexical fillers stripped) -> tail_pos(): clamp back to last
      actually-voiced moment, pad forward to first sustained room tone +0.03s, floor TAIL_PAD
      cap TAIL_CAP, NEVER the clip end. (tail_pos itself is the VERBATIM fit_lctovid.py port —
      pad/cap are overridden at the CALL SITE, the function is untouched.)
      -> FILLER CEILING (added 07-27, Sam-approved by ear): when a trailing filler was stripped,
      the cut may never reach within FILLER_GAP of where that filler STARTS. Needed because
      Scribe's timestamps run late at both ends, so the forward pad was landing back on top of
      the off-camera "mm-hmm" the strip had just removed. Verified on L15/L01/L05.
      KNOWN GAP: verbal acknowledgments ("Right.", "okay", "sure") are NOT in FILLERS, so a
      host backchannel using those still survives. Deliberate — they are real words and
      stripping them risks cutting genuine speech. Sam's call to extend.

Latest-take law: when clips carry _vNN, only the highest take per line is fitted.
Transcripts are SAVED in the json so script_match.py never re-transcribes.

Usage: fit_trims.py --src "<clips dir>" --out trims.json
"""
import argparse, json, os, re, sys, wave, audioop

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asm_lib import (transcribe_words, _extract_wav, speech_span,
                     HOP, MIN_LEAD, MAX_LEAD, ABS_FLOOR, REL_DB, _db)

FPS, LEAD_IN = 24, 2
# TAIL pad floor, overriding asm_lib's vendored MIN_LEAD (0.15) at the CALL SITE — the vendored
# constants stay verbatim per the provenance note. Why: tail_pos's floor OVERRIDES its own silence
# detector, so a cut the detector placed 20-40ms after the last real word got pushed out to 150ms —
# landing back inside the "mm-hmm" the filler-strip had just removed. Measured 07-27 on
# DaughterRanOverFerrari Broad: audible content (15-45dB over room tone) in the final 0.15s of 20/20
# clips sampled. 0.10 lets the detector win on most clips while keeping words from sounding clipped.
# Head trims are UNAFFECTED (they use LEAD_IN frames, not this).
TAIL_PAD = 0.10
# TAIL cap — the CEILING on how far past the last real word the detector may hold. Measured
# 07-27: this, not the floor, is what binds on podcast clips (lowering the floor alone moved
# 0-2 frames). Vendored MAX_LEAD is 0.30; overridden at the call site, vendored value untouched.
TAIL_CAP = 0.30
# Gap held BEFORE a stripped trailing filler starts, so the cut never reaches into it.
# 0.04 was not enough — Scribe's START timestamp also runs late, so the cut still caught the
# onset of the "mm-hmm" (Sam, by ear, 07-27). Backed off further; the real word's tail is
# unaffected because tail_pos's own boundary still wins whenever it lands earlier than this.
FILLER_GAP = 0.12
FILLERS = {"yeah", "yea", "mmhmm", "mm-hmm", "mhm", "mm", "hmm", "uh", "uhhuh", "uh-huh",
           "huh", "-hmm", "umm", "um"}
def nrm(w): return re.sub(r"[^a-z-]", "", w.lower())


def tail_pos(path, word_end, pad=MIN_LEAD, cap=MAX_LEAD):
    """VERBATIM port of fit_lctovid.py tail_pos (Sam-dialed 07-24). Do not re-tune."""
    w = _extract_wav(path)
    wf = wave.open(w, "rb"); sr = wf.getframerate(); n = wf.getnframes()
    raw = wf.readframes(n); wf.close()
    sw = 2; hop = int(sr * HOP); dur = n / float(sr)
    def rms_at(t):
        i = int(t * sr) * sw
        if i < 0 or i + hop * sw > len(raw): return -90.0
        return _db(audioop.rms(raw[i:i + hop * sw], sw))
    speech = max(rms_at(word_end - k * HOP) for k in range(1, 30))
    floor = max(ABS_FLOOR, speech - REL_DB)
    back = 0
    while back < 40 and rms_at(word_end - (back + 1) * HOP) < floor: back += 1
    word_end = max(0.0, word_end - back * HOP)
    SIL_RUN = 5; run = 0; boundary = None
    for k in range(1, int(cap / HOP) + SIL_RUN + 1):
        t = word_end + k * HOP
        if t >= dur: break
        if rms_at(t) < floor:
            run += 1
            if run >= SIL_RUN: boundary = k - run + 1; break
        else:
            run = 0
    tail = word_end + (min(cap, max(pad, boundary * HOP + 0.03)) if boundary else pad)
    try: os.unlink(w)
    except Exception: pass
    return min(tail, dur)


def latest_takes(src):
    """All mp4s; when L##/_vNN naming is present, keep only the highest take per line."""
    files = sorted(f for f in os.listdir(src) if f.endswith(".mp4"))
    byline = {}
    for f in files:
        m = re.match(r"(L\d+\w*).*_v(\d+)\.mp4$", f)
        if m:
            key, v = m.group(1), int(m.group(2))
            if key not in byline or v > byline[key][0]:
                byline[key] = (v, f)
        else:
            byline[f] = (0, f)
    return [f for _, f in sorted(byline.values(), key=lambda x: x[1])]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--tail-pad", type=float, default=TAIL_PAD,
                    help=f"tail pad floor in seconds (default {TAIL_PAD}; lower = tighter ends)")
    ap.add_argument("--tail-cap", type=float, default=TAIL_CAP,
                    help=f"tail pad CEILING in seconds (default {TAIL_CAP}). This is the binding "
                         f"constraint on podcast clips: the detector scans forward for sustained "
                         f"silence and will hold up to this long, which is how a trailing 'mm-hmm' "
                         f"survives. Lower = tighter ends.")
    a = ap.parse_args()
    clips = latest_takes(a.src)
    print(f"fitting {len(clips)} clips (latest takes)", flush=True)
    rows = []
    for i, f in enumerate(clips, 1):
        p = os.path.join(a.src, f)
        onset, _off_e, clip = speech_span(p)
        r = transcribe_words(p)
        words = [(x["word"].strip(), x["end"], x.get("start")) for seg in r.get("segments", [])
                 for x in seg.get("words", [])]
        keep = list(words)
        # Remember where the FIRST stripped trailing filler begins — that is the hard ceiling for
        # the cut. Without it, Scribe's (late-running) end time for the last real word plus the
        # forward pad lands on top of the off-camera "mm-hmm" the strip just removed. Verified by
        # ear 07-27 (L15: host's "Mm-hmm" audible inside the kept range after "record").
        filler_start = None
        while keep and nrm(keep[-1][0]) in FILLERS:
            if keep[-1][2] is not None: filler_start = keep[-1][2]
            keep.pop()
        if not keep: keep = words; filler_start = None
        we = keep[-1][1] if keep else clip
        tail_s = tail_pos(p, we, pad=a.tail_pad, cap=a.tail_cap) if keep else clip
        if filler_start is not None:
            tail_s = min(tail_s, max(0.0, filler_start - FILLER_GAP))
        inF = max(0, round(onset * FPS) - LEAD_IN)
        srcmax = int(clip * FPS)
        outF = min(round(tail_s * FPS), srcmax)
        text = " ".join(w for w, _, _ in words)
        rows.append(dict(file=f, inF=inF, outF=outF, durF=outF - inF, clip=clip,
                         onset=onset, transcript=text))
        print(f"[{i}/{len(clips)}] {f}  in={inF}f out={outF}f dur={outF-inF}f", flush=True)
    json.dump(rows, open(a.out, "w"), indent=1)
    tot = sum(r["durF"] for r in rows)
    print(f"\nDONE {len(rows)} clips -> {a.out}  runtime {tot}f = {tot/FPS:.1f}s", flush=True)


if __name__ == "__main__":
    main()
