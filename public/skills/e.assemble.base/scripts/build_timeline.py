#!/usr/bin/env python3
"""e.assemble.base / e.assemble.raw — build the stringout in the CURRENT open Resolve project.
claude-editor laws: current project ONLY (never creates/switches), refuses an existing
timeline name (never overwrites). Verifies by READBACK: count, order, in-points, durations,
zero gaps — DONE = that check passing.

--trims trims.json    -> base assembly (per-clip in/out from fit_trims.py)
--raw --src DIR       -> raw assembly (full-length clips side by side, latest takes)
--name "<timeline>"   REQUIRED — the house creative name per /pfm-naming (caller derives it;
                      match the project's existing creative/export names — sister files are
                      ground truth for the grammar).
--aspect 16x9|9x16    (default 16x9) -> 1920x1080 / 1080x1920, always 24fps.
--bin "Parent/Child"  media pool bin path — EXPLICIT OVERRIDE only.

Bin default (Sam 2026-07-26): the editor's workflow is Send to DaVinci (e.import) THEN an
assembly, so the clips + the Lucid-mirroring bins are ALREADY in the pool. When the root has
a bin named after the Lucid project folder (what e.import creates), the timeline goes into
that bin's `Creatives` subbin (house convention, same place claude_editor_assemble puts its
timelines) and clips are matched from anywhere inside the project bin — nothing re-imported.
Clips genuinely missing from the pool import into the Lucid-mirroring `Elements/Footage/...`
subbin, never into Creatives. Standalone use (no project bin found) keeps the old behavior:
one new bin named after the timeline.
"""
import argparse, json, os, re, sys

sys.path.append("/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules")
import DaVinciResolveScript as dvr


def latest_takes(src):
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
    ap.add_argument("--trims")
    ap.add_argument("--raw", action="store_true")
    ap.add_argument("--src", required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--aspect", default="16x9", choices=["16x9", "9x16"])
    ap.add_argument("--bin", default=None)
    a = ap.parse_args()
    if bool(a.trims) == a.raw:
        sys.exit("pass exactly one of --trims <json> or --raw")

    if a.trims:
        plan = json.load(open(a.trims))
    else:
        plan = [dict(file=f, inF=None, outF=None) for f in latest_takes(a.src)]
    W, H = (1920, 1080) if a.aspect == "16x9" else (1080, 1920)

    r = dvr.scriptapp("Resolve")
    pj = r.GetProjectManager().GetCurrentProject()
    assert pj, "no current project open in Resolve"
    print("project:", pj.GetName(), flush=True)
    for i in range(1, int(pj.GetTimelineCount() or 0) + 1):
        if pj.GetTimelineByIndex(i).GetName() == a.name:
            sys.exit(f"REFUSING: timeline '{a.name}' already exists — delete or rename first")

    mp = pj.GetMediaPool()
    root = mp.GetRootFolder()

    def descend(base, path):
        f = base
        for part in path.split("/"):
            nxt = next((s for s in (f.GetSubFolderList() or []) if s.GetName() == part), None)
            f = nxt or mp.AddSubFolder(f, part)
        return f

    def walk_clips(f, out):
        for c in (f.GetClipList() or []):
            out.setdefault(c.GetClipProperty("Clip Name"), c)
        for s in (f.GetSubFolderList() or []):
            walk_clips(s, out)
        return out

    # e.import's project bin = the Lucid project folder name; src sits under <proj>/Elements/…
    proj_bin, rel_media = None, None
    if "/Elements/" in a.src and not a.bin:
        proj_path, _, media_tail = a.src.partition("/Elements/")
        proj_name = os.path.basename(proj_path)
        proj_bin = next((f for f in (root.GetSubFolderList() or []) if f.GetName() == proj_name), None)
        rel_media = "Elements/" + media_tail.rstrip("/")

    if a.bin:
        media_bin = tl_bin = descend(root, a.bin)          # explicit override: old semantics
        clips_scope = tl_bin
    elif proj_bin:
        tl_bin = descend(proj_bin, "Creatives")             # timeline lives with the creatives
        media_bin = descend(proj_bin, rel_media)            # missing clips land Lucid-mirrored
        clips_scope = proj_bin                              # already-imported clips count anywhere in the project bin
        print(f"project bin: {proj_bin.GetName()} (timeline -> Creatives)", flush=True)
    else:
        media_bin = tl_bin = descend(root, a.name)          # standalone: one bin, old behavior
        clips_scope = tl_bin

    clips = walk_clips(clips_scope, {})
    need = [os.path.join(a.src, t["file"]) for t in plan if t["file"] not in clips]
    if need:
        mp.SetCurrentFolder(media_bin)
        mp.ImportMedia(need)
        print(f"imported {len(need)} clips", flush=True)
        clips = walk_clips(clips_scope, {})
    missing = [t["file"] for t in plan if t["file"] not in clips]
    assert not missing, f"missing in pool: {missing[:5]}"

    mp.SetCurrentFolder(tl_bin)
    tl = mp.CreateEmptyTimeline(a.name)
    assert tl, "CreateEmptyTimeline failed"
    pj.SetCurrentTimeline(a.name)
    tl.SetSetting("useCustomSettings", "1")
    tl.SetSetting("timelineFrameRate", "24")
    tl.SetSetting("timelineResolutionWidth", str(W))
    tl.SetSetting("timelineResolutionHeight", str(H))

    ok = 0
    for t in plan:
        spec = {"mediaPoolItem": clips[t["file"]]}
        if t.get("inF") is not None:
            spec.update(startFrame=t["inF"], endFrame=t["outF"])
        if mp.AppendToTimeline([spec]):
            ok += 1
        else:
            print(f"APPEND FAILED: {t['file']}", flush=True)
    print(f"appended {ok}/{len(plan)}", flush=True)

    tl = pj.GetCurrentTimeline()
    items = tl.GetItemListInTrack("video", 1) or []
    bad, pos = [], None
    for i, (it, t) in enumerate(zip(items, plan)):
        if it.GetName() != t["file"]:
            bad.append(f"#{i}: order {it.GetName()} != {t['file']}")
        if t.get("inF") is not None:
            if int(it.GetLeftOffset()) != t["inF"]:
                bad.append(f"#{i} {it.GetName()}: in {it.GetLeftOffset()} != {t['inF']}")
            if abs(int(it.GetDuration()) - (t["outF"] - t["inF"])) > 1:
                bad.append(f"#{i} {it.GetName()}: dur {it.GetDuration()} != {t['outF']-t['inF']}")
        if pos is not None and int(it.GetStart()) != pos:
            bad.append(f"#{i} {it.GetName()}: gap at {it.GetStart()} (expected {pos})")
        pos = int(it.GetEnd())
    if len(items) != len(plan):
        bad.append(f"count {len(items)} != {len(plan)}")
    print(f"\nVERIFY: '{tl.GetName()}' {tl.GetSetting('timelineResolutionWidth')}x"
          f"{tl.GetSetting('timelineResolutionHeight')}@{tl.GetSetting('timelineFrameRate')} "
          f"clips={len(items)}", flush=True)
    if bad:
        print("MISMATCHES:")
        for b in bad[:15]: print("  " + b)
        sys.exit(f"RESULT: {len(bad)} mismatches — NOT VERIFIED")
    total = sum(int(it.GetDuration()) for it in items)
    print(f"RESULT: {len(items)}/{len(plan)} exact — order, in/outs, durations, zero gaps. "
          f"runtime {total}f = {total/24:.1f}s", flush=True)


if __name__ == "__main__":
    main()
