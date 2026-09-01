#!/usr/bin/env python3
# PURPOSE:  Shell entry point for hf_client.fire(). Parses argv, prints, returns an exit code.
# OWNS:     argv → Request translation, and the exit-code contract.
# DOES NOT: anything hf_client does. It holds no fire logic of its own.
"""hf_fire.py — call the Higgsfield transport layer from a shell.

  --param  k=v     one valued flag, repeatable, order preserved  → --k v
  --repeat k=v     one value of a repeatable flag, repeatable     → --k v --k v
  --flag   name    one bare flag, repeatable                      → --name

Flag names are passed to Higgsfield VERBATIM. Spell them the way the vendor spells them
(image-references, start-image, extension_mode, bitrate_mode) — this layer fixes nothing.

Fire a video:
  hf_fire.py --model seedance_2_5 --prompt-file g01.txt --dest out/g01_v01.mp4 \
    --repeat image-references=her.png --repeat image-references=wide.png \
    --param duration=20 --param resolution=720p --param aspect_ratio=9:16 \
    --param bitrate_mode=high --param generate_audio=true --flag wait

Continue it (extend):
  hf_fire.py --model seedance_2_5 --prompt-file g02.txt --dest out/g02_v01.mp4 \
    --param model=video_extension --param extension_mode=forward --param video=g01_v01.mp4 \
    --param duration=22 --param resolution=720p --flag wait

  hf_fire.py --dry-run ...            print the exact command, spend nothing
  hf_fire.py --resume --work-dir DIR  adopt a killed session's live job

Exit: 0 landed · 1 refused (nothing submitted) · 2 exhausted · 3 pending (resume later).
"""
import argparse
import json
import sys

import hf_client

EXIT = {"landed": 0, "refused": 1, "exhausted": 2, "pending": 3}


def kv(pairs, label):
    out = {}
    for p in pairs:
        if "=" not in p:
            sys.exit(f"REFUSED: --{label} needs k=v, got {p!r}")
        k, v = p.split("=", 1)
        out.setdefault(k, []).append(v)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model")
    ap.add_argument("--prompt-file", dest="prompt_file")
    ap.add_argument("--prompt-text", dest="prompt_text")
    ap.add_argument("--dest")
    ap.add_argument("--work-dir", dest="work_dir")
    ap.add_argument("--param", action="append", default=[], metavar="k=v")
    ap.add_argument("--repeat", action="append", default=[], metavar="k=v")
    ap.add_argument("--flag", action="append", default=[])
    ap.add_argument("--label", default="")
    ap.add_argument("--allow-overwrite", dest="allow_overwrite", action="store_true")
    ap.add_argument("--no-submit-retries", dest="no_submit_retries", type=int, default=1)
    ap.add_argument("--dry-run", dest="dry_run", action="store_true",
                    help="validate + print the command, spend nothing")
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--json", action="store_true", help="print the Result as json")
    a = ap.parse_args()

    if a.resume:
        if not a.work_dir:
            sys.exit("REFUSED: --resume needs --work-dir")
        results = hf_client.resume(a.work_dir, dest=a.dest, allow_overwrite=a.allow_overwrite)
        if a.json:
            print(json.dumps([r.to_json() for r in results], indent=1))
        if any(r.ok for r in results):
            return 0
        if results and all(r.status == "refused" for r in results):
            return 1
        return 3

    if not (a.model and a.dest and (a.prompt_file or a.prompt_text)):
        sys.exit("REFUSED: --model, --dest and one of --prompt-file/--prompt-text are required")

    prompt = (a.prompt_text if a.prompt_text
              else open(a.prompt_file, encoding="utf-8").read().strip())

    params = {k: v[-1] for k, v in kv(a.param, "param").items()}
    req = hf_client.Request(
        model=a.model, prompt=prompt, dest=a.dest, work_dir=a.work_dir,
        params=params, repeated=kv(a.repeat, "repeat"), flags=a.flag,
        label=a.label, allow_overwrite=a.allow_overwrite,
        no_submit_retries=a.no_submit_retries)

    if a.dry_run:
        try:
            hf_client.validate(req)
        except hf_client.Refused as r:
            print(f"REFUSED: {r}", file=sys.stderr)
            return 1
        print("DRY RUN — validated, nothing fired. Command would be:\n")
        print("  " + " \\\n    ".join(hf_client.build_command(req)))
        return 0

    res = hf_client.fire(req)
    if res.status == "refused":
        print(f"REFUSED: {res.detail}", file=sys.stderr)
    if a.json:
        print(res.to_json())
    return EXIT.get(res.status, 2)


if __name__ == "__main__":
    sys.exit(main())
