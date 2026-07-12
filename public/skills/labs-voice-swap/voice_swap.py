#!/usr/bin/env python3
"""
PFM Veo voice-swap — replace a clip's generated voice with a chosen ElevenLabs library
voice via speech-to-speech (STS), preserving the clip's exact timing so lip-sync holds.

Pipeline per clip:  extract audio (ffmpeg) -> STS via ElevenLabs API -> mux back (ffmpeg)
                    -> verify the swapped audio duration matches the original (lip-sync guard)

STS (not TTS) is the point: it keeps the original delivery/timing/cadence and only changes
the timbre, so the new voice still matches the on-screen mouth movements.

Usage:
  # one clip
  python3 voice_swap.py --clip /path/max_L04.mp4 --voice-id aS994IA3oAOJnVePk4nA
  # a whole folder, only files matching a substring (e.g. only Max's clips)
  python3 voice_swap.py --folder /path/Veo --filter max_ --voice-id aS994IA3oAOJnVePk4nA
Options:
  --out <dir>     output dir (default: <clip dir>/VoiceSwapped)
  --model <id>    STS model (default: eleven_multilingual_sts_v2)
  --suffix <s>    output filename suffix (default: _vs)
  --workers <n>   parallel clips (default: 4; STS is rate-limited, keep modest)

Key: read from $ELEVENLABS_API_KEY, else from the elevenlabs MCP server entry in
     ~/Library/Application Support/Claude/claude_desktop_config.json or ~/.claude.json.
"""
import argparse, os, sys, json, subprocess, tempfile, re
from concurrent.futures import ThreadPoolExecutor

def get_key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k: return k
    for p in [os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json"),
              os.path.expanduser("~/.claude.json")]:
        if os.path.isfile(p):
            try:
                m = re.search(r'"ELEVENLABS_API_KEY"\s*:\s*"([^"]+)"', open(p).read())
                if m: return m.group(1)
            except Exception: pass
    sys.exit("ERROR: no ElevenLabs API key (set $ELEVENLABS_API_KEY or configure the elevenlabs MCP server).")

def dur(path):
    # use ffmpeg (ffprobe may not be installed) — parse "Duration: HH:MM:SS.ss"
    r = subprocess.run(["ffmpeg","-i",path], capture_output=True, text=True)
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", r.stderr)
    if not m: return None
    h,mn,s = m.groups(); return int(h)*3600 + int(mn)*60 + float(s)

def swap_one(clip, voice_id, key, model, outdir, suffix):
    name = os.path.splitext(os.path.basename(clip))[0]
    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, f"{name}{suffix}.mp4")
    with tempfile.TemporaryDirectory() as td:
        wav = os.path.join(td, "in.wav"); newaud = os.path.join(td, "out.mp3")
        # 1. extract audio
        subprocess.run(["ffmpeg","-y","-i",clip,"-vn","-ar","44100","-ac","1",wav],
                       capture_output=True)
        if not (os.path.exists(wav) and os.path.getsize(wav) > 1000):
            return (name, "NO_AUDIO", None)
        # 2. STS via API (curl multipart)
        r = subprocess.run(["curl","-sS","-X","POST",
            f"https://api.elevenlabs.io/v1/speech-to-speech/{voice_id}",
            "-H", f"xi-api-key: {key}",
            "-F", f"audio=@{wav}",
            "-F", f"model_id={model}",
            "-F", "output_format=mp3_44100_128",
            "-o", newaud], capture_output=True, text=True)
        if not (os.path.exists(newaud) and os.path.getsize(newaud) > 1000):
            head = open(newaud,"rb").read(200) if os.path.exists(newaud) else b""
            return (name, f"STS_FAIL {head[:160]!r}", None)
        # 3. mux new audio onto original video
        subprocess.run(["ffmpeg","-y","-i",clip,"-i",newaud,"-c:v","copy",
                        "-map","0:v:0","-map","1:a:0","-shortest",out], capture_output=True)
        # 4. duration guard
        do, dn = dur(clip), dur(out)
        warn = ""
        if do and dn and abs(do-dn) > 0.20: warn = f" ⚠DURDRIFT {do:.2f}->{dn:.2f}"
        return (name, "OK"+warn, out)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--clip"); ap.add_argument("--folder"); ap.add_argument("--filter", default="")
    ap.add_argument("--voice-id", required=True); ap.add_argument("--out")
    ap.add_argument("--model", default="eleven_multilingual_sts_v2")
    ap.add_argument("--suffix", default="_vs"); ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    key = get_key()
    if a.clip:
        clips = [a.clip]; outdir = a.out or os.path.join(os.path.dirname(a.clip),"VoiceSwapped")
    elif a.folder:
        clips = sorted(os.path.join(a.folder,f) for f in os.listdir(a.folder)
                       if f.lower().endswith(".mp4") and a.filter in f)
        outdir = a.out or os.path.join(a.folder,"VoiceSwapped")
    else:
        sys.exit("need --clip or --folder")
    print(f"{len(clips)} clip(s) -> {outdir}  (voice {a.voice_id}, model {a.model})")
    with ThreadPoolExecutor(max_workers=a.workers) as ex:
        for name, status, out in ex.map(lambda c: swap_one(c, a.voice_id, key, a.model, outdir, a.suffix), clips):
            print(f"  {name}: {status}")
    print("DONE")

if __name__ == "__main__":
    main()
