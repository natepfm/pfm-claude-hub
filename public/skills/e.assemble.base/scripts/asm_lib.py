#!/usr/bin/env python3
"""e.assemble.base — vendored canonical audio/STT pieces so the skill is SELF-CONTAINED for
team distribution (lctovid-podcast-palmier is HOLD/local-only, so importing from it would
break on every editor machine).

PROVENANCE (vendored 07-26, verbatim behavior — if the canonical changes, re-port):
  speech_span, _extract_wav, transcribe_words (+ ElevenLabs Scribe / Whisper fallback)
      <- lctovid-podcast-palmier/scripts/palmier_helpers.py
  HOP / MIN_LEAD / MAX_LEAD / REL_DB / ABS_FLOOR / _db
      <- lctovid-podcast-palmier/scripts/head_lead.py
Do NOT re-tune constants here — they are Sam-dialed (07-07 breath-trim, 07-24 edges).
"""
import json, math, os, re, subprocess

FFMPEG = os.path.expanduser("~/bin/ffmpeg")
HOP = 0.010; MIN_LEAD = 0.15; MAX_LEAD = 0.30; REL_DB = 20.0; ABS_FLOOR = -42.0
_WHISPER_MODEL = [None]


def _db(x):
    return 20 * math.log10(x / 32768.0) if x > 0 else -90.0


def _extract_wav(path):
    """16k mono wav in tmp — robust + small upload for STT. Returns tmp path."""
    import tempfile
    fd, wav = tempfile.mkstemp(suffix=".wav"); os.close(fd)
    subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", path,
                    "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
    return wav


def speech_span(path, voiced_band=(120, 900), rel_db=6.0, min_sil=0.15, onset_cap=1.2, tail_gap=0.4):
    """Breath-trim detector (canonical recipe): bandpass to the voiced band FIRST, then a
    level gate anchored to the FILTERED MEAN. Returns (onset_sec, offset_sec, clip_sec)."""
    def run(af):
        return subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", path, "-af", af,
                               "-f", "null", "-"], capture_output=True, text=True).stderr
    filt = f"highpass=f={voiced_band[0]},lowpass=f={voiced_band[1]}"
    vd = run(filt + ",volumedetect")
    mean = float(re.search(r"mean_volume: (-?[\d.]+)", vd).group(1))
    dm = re.search(r"Duration: (\d+):(\d+):([\d.]+)", vd)
    clip = int(dm.group(1)) * 3600 + int(dm.group(2)) * 60 + float(dm.group(3)) if dm else 8.0
    sd = run(f"{filt},silencedetect=noise={mean + rel_db}dB:d={min_sil}")
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", sd)]
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", sd)]
    onset = ends[0] if ends else 0.0
    if onset > onset_cap: onset = 0.20
    tail = [s for s in starts if s > onset + tail_gap]
    offset = tail[-1] if tail else clip
    return round(onset, 3), round(offset, 3), round(clip, 3)


def _elevenlabs_key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k: return k.strip()
    kf = os.path.expanduser("~/.claude/.elevenlabs_key")
    if os.path.exists(kf):
        return open(kf).read().strip()
    return None


def _transcribe_elevenlabs(path, model_id):
    """POST /v1/speech-to-text with word granularity; normalize to Whisper shape."""
    import uuid, urllib.request as u
    key = _elevenlabs_key()
    if not key:
        raise RuntimeError("no ElevenLabs key (env ELEVENLABS_API_KEY or ~/.claude/.elevenlabs_key)")
    wav = _extract_wav(path)
    try:
        boundary = "----pfm" + uuid.uuid4().hex
        fields = {"model_id": model_id, "timestamps_granularity": "word"}
        body = b""
        for k, v in fields.items():
            body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n").encode()
        with open(wav, "rb") as fh:
            fdata = fh.read()
        body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
                 f"filename=\"audio.wav\"\r\nContent-Type: audio/wav\r\n\r\n").encode()
        body += fdata + b"\r\n" + f"--{boundary}--\r\n".encode()
        rq = u.Request("https://api.elevenlabs.io/v1/speech-to-text", data=body,
                       headers={"xi-api-key": key,
                                "Content-Type": f"multipart/form-data; boundary={boundary}"})
        data = json.loads(u.urlopen(rq, timeout=300).read().decode())
    finally:
        try: os.remove(wav)
        except OSError: pass
    words = [{"word": w.get("text", ""), "start": w.get("start"), "end": w.get("end")}
             for w in data.get("words", []) if w.get("type") == "word"]
    if not words:
        raise RuntimeError("ElevenLabs returned 0 words")
    return {"segments": [{"words": words}], "text": data.get("text", "".join(w["word"] for w in words))}


def _transcribe_whisper(path):
    import whisper
    if _WHISPER_MODEL[0] is None:
        _WHISPER_MODEL[0] = whisper.load_model("base.en")
    return _WHISPER_MODEL[0].transcribe(path, word_timestamps=True, fp16=False, language="en")


def transcribe_words(path):
    """THE spine-cut transcriber: ElevenLabs Scribe by default (tighter word ENDS — locked
    07-26 after Whisper dropped trailing words on 2/63 clips), Whisper offline fallback."""
    engine = os.environ.get("PFM_TRANSCRIBER", "elevenlabs").lower()
    if engine == "elevenlabs":
        model_id = os.environ.get("ELEVENLABS_STT_MODEL", "scribe_v2")
        try:
            r = _transcribe_elevenlabs(path, model_id)
            print(f"    [stt] elevenlabs {model_id}: {len(r['segments'][0]['words'])} words", flush=True)
            return r
        except Exception as e:
            print(f"    [stt] elevenlabs FAILED ({type(e).__name__}: {str(e)[:120]}) — "
                  f"falling back to whisper base.en", flush=True)
    return _transcribe_whisper(path)
