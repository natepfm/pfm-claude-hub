#!/usr/bin/env python3
"""
motion_qc.py — detect Veo motion artifacts on VSL keynote clips that filmstrip QC misses.

The slide behind Chad is SUPPOSED to be a frozen backdrop. Veo sometimes (stochastically):
  - zoom-blurs / smears the whole slide
  - dissolves the slide into a particle field
  - lip-syncs an on-screen photo (talking photo)
  - re-renders + duplicates slide text (garble)
All of these = high pixel change in regions that should be static.

Method: sample dense frames (default every 0.25s), grayscale-diff consecutive frames,
measure mean absolute change in two masks:
  - SLIDE region (everything ABOVE the stage line / OUTSIDE Chad's center column) — should be ~still
  - reference STAGE-FLOOR strip (genuinely static) — calibrates the camera's own dolly/sway
A clip is FLAGGED when slide-region motion is high in absolute terms AND high relative to the
floor baseline (i.e. it's not just gentle global camera move, which is allowed).

Outputs per-clip: slide_motion, floor_motion, ratio, peak_frame_t, verdict (OK / FLAG).
Usage:
  python3 motion_qc.py <clip.mp4 | dir-of-mp4s> [--fps 4] [--json out.json] [--frames-dir d]
"""
import subprocess, sys, os, json, argparse, tempfile, glob

def probe_dur(path):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                        "-of","csv=p=0",path], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except: return 8.0

def extract(path, fps, outdir):
    # grayscale, modest size keeps it fast but enough to see text churn
    subprocess.run(["ffmpeg","-nostdin","-loglevel","error","-i",path,
                    "-vf",f"fps={fps},scale=640:360,format=gray",
                    os.path.join(outdir,"f_%04d.pgm"),"-y"], check=True)
    return sorted(glob.glob(os.path.join(outdir,"f_*.pgm")))

def read_pgm(p):
    # minimal binary PGM (P5) reader -> (w,h,bytes)
    with open(p,"rb") as f:
        assert f.readline().strip()==b"P5"
        line=f.readline()
        while line.startswith(b"#"): line=f.readline()
        w,h=map(int,line.split())
        int(f.readline())
        data=f.read(w*h)
    return w,h,data

def region_meandiff(d0,d1,w,h,x0,x1,y0,y1):
    s=0; n=0
    for y in range(y0,y1):
        base=y*w
        for x in range(x0,x1,2):  # stride 2 cols for speed
            s+=abs(d0[base+x]-d1[base+x]); n+=1
    return s/n if n else 0.0

def region_cellmax(d0,d1,w,h,x0,x1,y0,y1,cell=40):
    """Max mean-diff over any small cell — catches LOCALIZED churn (talking mouth,
    duplicated text) that a whole-region average drowns out."""
    best=0.0
    yy=y0
    while yy<y1:
        xx=x0
        while xx<x1:
            s=0;n=0
            for y in range(yy,min(yy+cell,y1)):
                base=y*w
                for x in range(xx,min(xx+cell,x1),2):
                    s+=abs(d0[base+x]-d1[base+x]); n+=1
            if n: best=max(best,s/n)
            xx+=cell
        yy+=cell
    return best

def analyze(path, fps):
    with tempfile.TemporaryDirectory() as td:
        frames=extract(path,fps,td)
        if len(frames)<3: return None
        w,h,_=read_pgm(frames[0])
        # SLIDE mask: top 60% of frame, full width minus Chad's center column (~38-62%)
        sy0,sy1=int(h*0.05),int(h*0.60)
        cx0,cx1=int(w*0.38),int(w*0.62)   # exclude center where Chad stands
        # FLOOR baseline: bottom strip, full width (genuinely static stage floor)
        fy0,fy1=int(h*0.82),int(h*0.97)
        prev=None; slide_series=[]; floor_series=[]; cell_series=[]
        for i,fp in enumerate(frames):
            _,_,d=read_pgm(fp)
            if prev is not None:
                # slide = left block + right block (skip Chad column)
                sl = (region_meandiff(prev,d,w,h,0,cx0,sy0,sy1)
                      + region_meandiff(prev,d,w,h,cx1,w,sy0,sy1))/2
                fl = region_meandiff(prev,d,w,h,0,w,fy0,fy1)
                # localized hot-spot anywhere in the FULL upper slide (incl. center photo)
                cm = region_cellmax(prev,d,w,h,0,w,sy0,sy1)
                slide_series.append(sl); floor_series.append(fl); cell_series.append(cm)
            prev=d
        slide=max(slide_series); floor=(sum(floor_series)/len(floor_series)) or 0.01
        cellmax=max(cell_series)
        peak_i=slide_series.index(slide)
        return {
            "slide_motion":round(slide,2),
            "cell_max":round(cellmax,2),
            "floor_motion":round(floor,2),
            "ratio":round(slide/floor,2),
            "peak_t":round((peak_i+1)/fps,2),
            "frames":len(frames),
        }

def verdict(m):
    # Calibrated on Nebraska ground truth. The whole-slide REGIONAL signal (slide_motion)
    # cleanly separates smear / particle / zoom-blur (12-25) from clean clips (<7) because
    # averaging dilutes Chad's own localized gestures. cell_max is NOT usable for a binary
    # gate — Chad stands within the slide region so his hands spike any localized cell on
    # every clip. We surface cell_max as INFO only.
    if m is None: return "ERROR"
    if m["slide_motion"]>=12 and m["ratio"]>=1.7: return "FLAG"   # smear / particle / zoom
    if m["slide_motion"]>=20: return "FLAG"
    if m["slide_motion"]>=6.5 and m["ratio"]>=1.85: return "REVIEW"  # mild garble band (L2=7.08) — human eye
    return "OK"

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("target"); ap.add_argument("--fps",type=float,default=4)
    ap.add_argument("--json",default=None)
    a=ap.parse_args()
    paths=[a.target] if a.target.endswith(".mp4") else sorted(glob.glob(os.path.join(a.target,"*.mp4")))
    results={}
    for p in paths:
        name=os.path.basename(p)[:-4]
        m=analyze(p,a.fps)
        v=verdict(m)
        results[name]={**(m or {}),"verdict":v}
        flag="🚩" if v=="FLAG" else ("  " if v=="OK" else "❓")
        print(f"{flag} {name:18s} slide={m['slide_motion'] if m else '?':>6} cell={m['cell_max'] if m else '?':>6} floor={m['floor_motion'] if m else '?':>5} ratio={m['ratio'] if m else '?':>5} peak@{m['peak_t'] if m else '?'}s -> {v}",flush=True)
    if a.json: json.dump(results,open(a.json,"w"),indent=1)
    flagged=[k for k,v in results.items() if v["verdict"]=="FLAG"]
    print(f"\n{len(flagged)} FLAGGED / {len(results)}: {flagged}")

if __name__=="__main__": main()
