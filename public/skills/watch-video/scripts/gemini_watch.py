#!/usr/bin/env python3
"""gemini_watch — let Claude ACTUALLY WATCH a video (frames + audio) via Gemini.

The QC sense PFM was missing: reads REAL motion/audio, not stills. Answers targeted
questions ("does the mouth move while they listen?", "does the retime stutter?",
"is there a screen in the background?", "music under the dialogue?") that single-frame
renders and audio-qc can't reach.

Key handling (Claude never sees the secret):
  key is read from --key, env GEMINI_API_KEY, or the file ~/.claude/.gemini_key
  You create the key at Google AI Studio and place it yourself:
      echo "YOUR_KEY" > ~/.claude/.gemini_key && chmod 600 ~/.claude/.gemini_key

Usage:
  python3 gemini_watch.py --video "/abs/clip.mp4" --ask "your question"
  python3 gemini_watch.py --video "/abs/clip.mp4" --preset mouth-hold
  python3 gemini_watch.py --list-models          # after a key is present
  python3 gemini_watch.py --check                # verify SDK + key wiring, no spend

Batch a folder:
  python3 gemini_watch.py --folder "/abs/dir" --glob "*R*.mp4" --preset mouth-hold
Exit 0 = answered; 3 = no key (prints how to add one); 2 = usage/other error.
"""
import argparse, glob as globmod, json, os, shutil, subprocess, sys, tempfile, time

KEY_FILE = os.path.expanduser("~/.claude/.gemini_key")
# Never analyze a whole long/large SOURCE file — for real footage most of it is unused
# (Sam, 07-11). Over these thresholds, warn hard; pass --clip START END to watch only the
# used slice (or pre-extract the in/out range for a batch — see the timeline-b-roll recipe).
LONG_SECONDS = 60
BIG_MB = 100


def _ff(tool):
    envv = os.environ.get("PFM_FFMPEG" if tool == "ffmpeg" else "PFM_FFPROBE")
    home = os.path.expanduser(f"~/bin/{tool}")
    return envv or (home if os.path.exists(home) else shutil.which(tool))


def probe_seconds(path):
    fp = _ff("ffprobe")
    if not fp:
        return None
    try:
        r = subprocess.run([fp, "-v", "0", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                           capture_output=True, text=True, timeout=30)
        return float(r.stdout.strip())
    except Exception:
        return None


def extract_clip(path, start, end, workdir):
    """Extract [start,end]s to a small downscaled proxy so only the USED slice uploads."""
    ff = _ff("ffmpeg")
    if not ff:
        return path, "no ffmpeg — uploading full file"
    out = os.path.join(workdir, "clip_" + os.path.splitext(os.path.basename(path))[0][:24] + ".mp4")
    dur = max(0.4, end - start)
    subprocess.run([ff, "-y", "-i", path, "-ss", f"{start:.3f}", "-t", f"{dur:.3f}",
                    "-vf", "scale=-2:480", "-c:v", "libx264", "-crf", "30", "-preset", "veryfast",
                    "-c:a", "aac", "-b:a", "128k", out], capture_output=True, timeout=180)
    if os.path.exists(out) and os.path.getsize(out) > 500:
        return out, None
    return path, "clip extract failed — uploading full file"


def prep_target(path, clip, workdir):
    """(path_to_upload, note): extract the clip range if given; warn on whole long/big files."""
    if clip:
        return extract_clip(path, clip[0], clip[1], workdir)
    secs = probe_seconds(path)
    mb = (os.path.getsize(path) / 1e6) if os.path.exists(path) else 0
    if (secs and secs > LONG_SECONDS) or mb > BIG_MB:
        return path, (f"WARN LONG/LARGE SOURCE ({(secs or 0):.0f}s, {mb:.0f}MB) — analyzing the WHOLE "
                      f"file. For real footage pass --clip START END (or pre-extract the used in/out) "
                      f"so only the used slice is watched.")
    return path, None


# Default to the ALWAYS-CURRENT-BEST alias `gemini-pro-latest` — it auto-tracks the newest
# Pro so the name NEVER goes stale (hardcoded gemini-3-pro/2.0-flash 404'd once Google
# rotated the lineup — QVC 07-11). QC accuracy is the whole point; on paid tier quota is a
# non-issue. Cheap BULK passes: --model gemini-flash-latest.
DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-pro-latest")
# best-first, all -latest aliases + stable concretes as backstop; step down on 404/403.
MODEL_FALLBACKS = ["gemini-pro-latest", "gemini-flash-latest", "gemini-2.5-pro", "gemini-2.5-flash"]

PRESETS = {
    "mouth-hold": ("Watch this clip closely. The person is supposed to be LISTENING silently, not "
                   "talking. Do their lips/mouth move as if speaking at any point? Answer YES or NO "
                   "first, then give the exact timestamps of any mouth movement and describe it."),
    "retime": ("Watch the motion in this clip. Does the playback stutter, jump, judder, or look "
               "unnaturally sped-up/slowed at any point? Answer YES or NO first, then timestamps."),
    "screen-bg": ("Look at the BACKGROUND behind the person/subject. Is there any TV, monitor, phone, "
                  "or screen visible? Answer YES or NO first, then describe where and what's on it."),
    "music": ("Listen to the audio. Is there any music, musical sting, or background music bed under "
              "or around the speech? Answer YES or NO first, then timestamps and describe it."),
    "lipsync": ("Watch the mouth against the audio. Is the lip-sync accurate, or do the lips drift out "
                "of sync with the spoken words? Answer YES (in sync) or NO first, then worst moments."),
    "describe": ("Describe exactly what happens in this clip, second by second — subject, action, "
                 "camera, audio/dialogue, and anything that looks like an AI-generation artifact."),
}


def load_key(cli_key):
    if cli_key:
        return cli_key
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"]
    if os.path.exists(KEY_FILE):
        k = open(KEY_FILE).read().strip()
        if k:
            return k
    return None


def no_key_msg():
    print("NO GEMINI KEY. This tool is installed and ready; it just needs your key.\n"
          "  1. Create a free key at Google AI Studio (aistudio.google.com/apikey)\n"
          f"  2. Place it (you enter it, Claude never sees it):\n"
          f'       echo "YOUR_KEY" > {KEY_FILE} && chmod 600 {KEY_FILE}\n'
          "  3. Re-run the same command.", file=sys.stderr)


def get_client(key):
    from google import genai
    return genai.Client(api_key=key)


def watch(client, model, video_path, question):
    from google import genai  # noqa
    myfile = client.files.upload(file=video_path)
    # wait for ACTIVE (video processing)
    for _ in range(150):
        st = getattr(myfile.state, "name", str(myfile.state))
        if st == "ACTIVE":
            break
        if st == "FAILED":
            raise RuntimeError("Gemini file processing FAILED")
        time.sleep(2)
        myfile = client.files.get(name=myfile.name)
    models_to_try = [model] + [m for m in MODEL_FALLBACKS if m != model]
    last_err = None
    for m in models_to_try:
        try:
            resp = client.models.generate_content(model=m, contents=[myfile, question])
            return m, resp.text
        except Exception as e:
            last_err = e
            s = str(e).lower()
            # step down on model-not-found (404) OR permission-gated (403); a 429
            # (quota) is account-wide, not model-specific — stop and surface it.
            if "not found" in s or "404" in s or "403" in s or "permission" in s:
                continue
            raise
    raise RuntimeError(f"all models failed; last: {last_err}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video")
    ap.add_argument("--files", nargs="+", help="explicit list — e.g. the clips audio-qc flagged (Tier-2 escalation)")
    ap.add_argument("--files-from", dest="files_from", help="path to a file of newline-separated video paths (robust for paths with spaces)")
    ap.add_argument("--folder")
    ap.add_argument("--glob", default="*.mp4")
    ap.add_argument("--sample", type=int, help="watch N RANDOM clips from --folder (big-batch spot-check, not all)")
    ap.add_argument("--clip", nargs=2, type=float, metavar=("START", "END"),
                    help="watch only START..END seconds (extracts a small proxy first) — use for long/large real footage")
    ap.add_argument("--ask")
    ap.add_argument("--preset", choices=list(PRESETS))
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--key")
    ap.add_argument("--list-models", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    key = load_key(a.key)
    if not key:
        no_key_msg(); sys.exit(3)

    try:
        client = get_client(key)
    except Exception as e:
        print("SDK/client error:", repr(e)[:200], file=sys.stderr); sys.exit(2)

    if a.check:
        print("SDK OK, key present. Default model:", a.model); sys.exit(0)
    if a.list_models:
        for m in client.models.list():
            acts = getattr(m, "supported_actions", None) or getattr(m, "supported_generation_methods", "")
            print(m.name, acts)
        sys.exit(0)

    question = a.ask or (PRESETS[a.preset] if a.preset else PRESETS["describe"])
    targets = []
    if a.video:
        targets = [a.video]
    elif a.files_from:
        targets = [ln.strip() for ln in open(a.files_from) if ln.strip()]
    elif a.files:
        targets = a.files
    elif a.folder:
        targets = sorted(globmod.glob(os.path.join(a.folder, a.glob)))
        if a.sample and 0 < a.sample < len(targets):
            import random
            picked = sorted(random.sample(targets, a.sample))
            print(f"[SAMPLE: watching {a.sample} random of {len(targets)} — spot-check, NOT the full batch]")
            targets = picked
    else:
        ap.error("need --video, --files, --files-from, or --folder")

    workdir = tempfile.mkdtemp(prefix="gemini_watch_")
    for v in targets:
        if not os.path.exists(v):
            print(f"\n### {os.path.basename(v)}\nMISSING ON DISK"); continue
        print(f"\n### {os.path.basename(v)}", flush=True)
        upload_path, note = prep_target(v, a.clip, workdir)
        if note:
            print(f"[{note}]", flush=True)
        try:
            used, text = watch(client, a.model, upload_path, question)
            print(f"[watched with {used}]\n{text}", flush=True)
        except Exception as e:
            print("WATCH ERROR:", repr(e)[:300], flush=True)


if __name__ == "__main__":
    main()
