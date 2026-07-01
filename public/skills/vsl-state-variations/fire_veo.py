#!/usr/bin/env python3
"""
fire_veo.py — VSL state-variation Veo Lite batch firer (PFM vsl-state-variations skill).

Encodes the lessons banked across the Minnesota + Iowa runs (2026-05-29):
  - Higgsfield CLI returns a JSON ARRAY; result_url is on [0] (not the list).
  - Batch-level parallel retry, never serial-long-timeout (avoids the 45-min hang).
  - count=1, --generate_audio true MANDATORY on veo3_1_lite (default false -> silent).
  - SFW-reinforced master (--sfw) for NSFW-casualty refire pass.
  - /tmp staging then one bulk copy into the Lucid Link Veo/<State> folder.

Usage:
  python3 fire_veo.py --manifest clips.json --refs ref_uuids.json \
      --out-dir "<.../Elements/Footage/Veo/Iowa>" [--sfw] [--attempts 4] [--workers 8]

manifest clips.json: [{"out":"L1_ia_v01","ref":"title_wide_v1","dialogue":"..."}, ...]
refs ref_uuids.json: {"title_wide_v1":"<uuid>", "pool_a":"<uuid>", ...}
Writes <out-dir>/<out>.mp4 for each success; prints + JSON-dumps copied/failed.
"""
import subprocess, json, os, shutil, urllib.request, time, argparse
from concurrent.futures import ThreadPoolExecutor, as_completed

PREFIX = "Veo video prompt: "

def master(dialogue, sfw=False):
    char = ("Chad Chapman — bald man in his early 50s, slim build, neatly trimmed short "
            "white beard, warm confident expression")
    wardrobe = "fitted black mock-neck turtleneck, medium-wash blue jeans, dark leather minimalist sneakers"
    style = ("Still frame extracted from the live multi-camera broadcast feed of a tech keynote "
             "event. Broadcast cinema camera on long zoom. Bloomed highlights on the bright white "
             "screen, slight halation, mild chromatic aberration at high-contrast edges, subtle "
             "sensor noise in darker areas, broadcast codec compression texture, flat controlled "
             "color grade. Must look like video footage from a YouTube livestream of a live "
             "keynote — NOT cinematic, NOT editorial, NOT a commercial.")
    if sfw:  # NSFW-casualty refire: reinforce clean signal (Iowa: recovered 4/5)
        char += ", professionally dressed, fully clothed, conservative corporate keynote presenter"
        wardrobe = "professional relaxed-fit black mock-neck turtleneck, medium-wash blue jeans, dark leather minimalist sneakers"
        style = style.replace("event.", "event, broadcast-safe, family-friendly corporate keynote footage.")
    return PREFIX + json.dumps({
        "shot": {"framing": "matches the uploaded reference frame exactly — hold the reference composition throughout",
                 "camera_movement": "ABSOLUTELY STATIC locked-off tripod shot. The camera does NOT move at all — no zoom, no push-in, no pull-out, no dolly, no pan, no handheld sway, no drift.",
                 "lens_style": "clean neutral broadcast lens, flat and undistorted, no warping, no chromatic aberration"},
        "screen_lock": ("The bright LED screen behind Chad shows a STATIC, FROZEN, projected still graphic — it does NOT zoom, scale, "
                 "pulse, shimmer, blur, dissolve, drift, or animate. No particle effects, no light sweeps, no motion-blur. Text is pin-sharp, "
                 "shown once, never duplicated. Any photo of a person shown on the screen is a frozen still image — it does NOT move, blink, "
                 "breathe, or speak. Only the live speaker on the stage floor moves."),
        "subject": {"character": char, "wardrobe": wardrobe,
                    "match_reference": "face, build, wardrobe, and stage position must match the uploaded reference image exactly"},
        "action": ("Chad delivers his line with natural keynote speaker energy — steady eye contact "
                   "with the audience, expressive but controlled hand gestures matching the cadence of "
                   "his words, subtle weight shifts, occasional slight smile. Mouth movements sync "
                   "naturally to the dialogue. No walking or large blocking changes — he stays roughly "
                   "in the position shown in the reference frame. He is the ONLY thing in the entire frame that moves."),
        "dialogue": dialogue,
        "voice_lock": {"description": ("Warm, measured, confident male baritone in his early 50s. Calm "
                       "authoritative keynote delivery in the style of a seasoned tech industry CEO. Subtle "
                       "American accent with a touch of Southern warmth. Deliberate steady pacing, clear "
                       "articulation, friendly authority, never rushed. Mid-to-low pitch. Clean captured "
                       "audio as if picked up through a high-end stage lavalier microphone."),
                       "tone": "confident, friendly, authoritative, trustworthy",
                       "pace": "measured and deliberate, podcast-pace cadence",
                       "pitch": "mid-to-low, warm baritone", "delivery": "direct-address keynote style"},
        "setting": {"location": ("large indoor tech keynote stage, dark polished stage floor, massive "
                    "bright LED presentation screen filling the background, audience silhouettes at the "
                    "bottom of the frame (when in frame)"),
                    "lighting": ("Chad is primarily lit by the bright LED screen behind him washing forward "
                    "across the stage, cool-neutral color temperature, soft frontal fill. He is softly "
                    "backlit / edge-lit by the screen glow. No visible warm spotlight beam. Audience area "
                    "in deep silhouette.")},
        "audio": {"dialogue_mix": "Chad's voice prominent and clean, captured through a stage lavalier mic with subtle natural room reverb from the venue",
                  "ambient": "very subtle muted audience presence, faint ambient room tone, no audience reactions",
                  "music": "none"},
        "style": style, "duration_seconds": 8, "aspect_ratio": "16:9", "frame_rate": 24})

def parse_url(out):
    obj = out
    if isinstance(obj, str):
        try: obj = json.loads(obj)
        except Exception:
            ls = [l for l in obj.splitlines() if l.strip().startswith(("[", "{"))]
            obj = json.loads(ls[-1]) if ls else {}
    if isinstance(obj, list): obj = obj[0] if obj else {}
    return (obj.get("result_url") or obj.get("url")), (obj.get("status") if isinstance(obj, dict) else None)

def attempt(ref_uuid, dialogue, sfw, timeout):
    cmd = ["higgsfield", "generate", "create", "veo3_1_lite", "--prompt", master(dialogue, sfw),
           "--start-image", ref_uuid, "--aspect_ratio", "16:9", "--duration", "8",
           "--generate_audio", "true", "--wait", "--wait-timeout", "6m", "--json"]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0: return None, f"rc={r.returncode} {r.stderr.strip()[:90]}"
    u, st = parse_url(r.stdout); return (u, None if u else f"status={st}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True); ap.add_argument("--refs", required=True)
    ap.add_argument("--out-dir", required=True); ap.add_argument("--sfw", action="store_true")
    ap.add_argument("--attempts", type=int, default=2); ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--stage", default="/tmp/vsl_veo_out"); ap.add_argument("--log", default="/tmp/vsl_veo.log")
    a = ap.parse_args()
    clips = json.load(open(a.manifest)); refs = json.load(open(a.refs))
    os.makedirs(a.stage, exist_ok=True); os.makedirs(a.out_dir, exist_ok=True)
    open(a.log, "w").close()
    def log(m):
        with open(a.log, "a") as f: f.write(m + "\n")
        print(m, flush=True)

    def run(c):
        out, ref_uuid = c["out"], refs[c["ref"]]
        for i in range(1, a.attempts + 1):
            try: u, err = attempt(ref_uuid, c["dialogue"], a.sfw, 400)
            except Exception as e: u, err = None, type(e).__name__
            if u:
                try:
                    dest = os.path.join(a.stage, out + ".mp4")
                    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=150) as resp, open(dest, "wb") as fh: fh.write(resp.read())
                    sz = os.path.getsize(dest)
                    if sz > 10000: log(f"OK {out} (attempt {i}{'/sfw' if a.sfw else ''}, {sz//1024}KB)"); return (out, sz, None)
                    err = f"tiny:{sz}"
                except Exception as e: err = f"dl:{type(e).__name__}"
            log(f"  {out} attempt {i}/{a.attempts}: {err}")
        return (out, 0, "FAILED")

    log(f"FIRING {len(clips)} clips{' [SFW]' if a.sfw else ''} @ {time.strftime('%H:%M:%S')}")
    results = []
    with ThreadPoolExecutor(max_workers=a.workers) as ex:
        for f in as_completed({ex.submit(run, c): c for c in clips}): results.append(f.result())
    copied, failed = [], []
    for out, sz, err in results:
        if err: failed.append(out)
        else: shutil.copy2(os.path.join(a.stage, out + ".mp4"), os.path.join(a.out_dir, out + ".mp4")); copied.append(out)
    log(f"\nDONE: {len(copied)}/{len(clips)} delivered")
    log(f"COPIED: {sorted(copied)}")
    log(f"FAILED (refire --sfw, then flag manual): {sorted(failed) if failed else 'none'}")
    json.dump({"copied": sorted(copied), "failed": sorted(failed)}, open("/tmp/vsl_veo_result.json", "w"))

if __name__ == "__main__":
    main()
