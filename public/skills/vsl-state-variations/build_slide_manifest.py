#!/usr/bin/env python3
"""
build_slide_manifest.py — emit the Excel audit spreadsheet for a VSL state slide batch.

Bridges a vsl-state-variations slide shot-list (Elements/Prompts/vsl_<state>_slides_image_shots.json)
+ its delivered files into hig-flow's build_xlsx.py, so every state run ships a manifest
spreadsheet alongside the JSON (matches Minnesota's vsl_<state>_slides_shots.xlsx convention).

Usage:
  python3 build_slide_manifest.py <slides_image_shots.json> <output.xlsx> [--delivered name1,name2,...]

If --delivered is omitted, status is inferred by checking which outNames exist on disk in the
manifest's outputDir. Writes the .xlsx into the state's Slide Images folder by default.
"""
import json, sys, os, argparse, subprocess

HIG_BUILD = os.path.join(os.path.dirname(__file__), "..", "hig-flow", "build_xlsx.py")
HIG_BUILD = os.path.normpath(HIG_BUILD)
# fall back to the installed local copy if the relative authoring path isn't present
if not os.path.exists(HIG_BUILD):
    HIG_BUILD = os.path.expanduser("~/.claude/skills/hig-flow/build_xlsx.py")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest"); ap.add_argument("output")
    ap.add_argument("--delivered", default=None, help="comma-sep delivered filenames; else inferred from disk")
    ap.add_argument("--project-root", default=None, help="abs path to project root for disk inference")
    a = ap.parse_args()

    man = json.load(open(a.manifest))
    proj = man["project"]; gen = man["generation"]
    root = a.project_root or _guess_root(a.manifest)
    out_dir = os.path.join(root, proj["outputDir"]) if root else None

    delivered = set(a.delivered.split(",")) if a.delivered else None

    shots_cfg = []
    for s in man["shots"]:
        names = s.get("outNames", [])
        v01 = names[0] if len(names) > 0 else ""
        v02 = names[1] if len(names) > 1 else ""
        def have(n):
            if delivered is not None: return n in delivered
            if out_dir: return os.path.exists(os.path.join(out_dir, n))
            return False
        h01, h02 = have(v01), have(v02)
        # one-take-enough: design covered if >=1 take present
        status = "✓" if (h01 or h02) else "pending"
        shots_cfg.append({
            "shotId": s["shotId"],
            "lineMatch": "",
            "description": _desc(s),
            "references": [os.path.basename(s.get("base",""))],
            "aspectRatio": man["generation"].get("aspectRatio","16:9"),
            "style": man["generation"].get("style","edit-swap"),
            "prompt": s["prompt"],
            "status": status,
            "v01": v01 if h01 else "",
            "v02": v02 if h02 else "",
            "notes": "" if (h01 and h02) else ("v2 missing — design covered by v1 (one-take rule)" if h01 else ("v1 missing — covered by v2" if h02 else "NOT delivered")),
        })

    config = {
        "project": {
            "name": proj["name"], "slug": proj["slug"], "vertical": proj.get("vertical",""),
            "createdAt": "", "user": "Sam Schiller (Claude)", "mb": "",
            "notionUrl": proj.get("notionUrl",""), "notes": proj.get("notes",""),
        },
        "generation": {
            "modelDisplay": gen.get("modelDisplay","Nano Banana Pro"),
            "mcpModel": gen.get("mcpModel","nano_banana_2"),
            "resolution": gen.get("resolution","2k"),
            "countPerPrompt": gen.get("countPerPrompt",1),
            "estCostPerImage": gen.get("estCostPerImage",2),
        },
        "shots": shots_cfg,
    }
    tmp = a.output + ".cfg.json"
    json.dump(config, open(tmp,"w"))
    subprocess.run([sys.executable, HIG_BUILD, tmp, a.output], check=True)
    os.remove(tmp)

def _desc(s):
    # derive a short description from outNames (e.g. "L17 - Nathan Before" -> "L17 Nathan Before")
    n = s.get("outNames",[""])[0]
    return n.replace(" - v1.png","").replace(" - v1.jpeg","").replace("  "," ").strip() or s["shotId"]

def _guess_root(manifest_path):
    # manifest lives at <root>/Elements/Prompts/...; walk up to the project root
    p = os.path.abspath(manifest_path)
    marker = os.path.join("Elements","Prompts")
    if marker in p:
        return p.split(marker)[0].rstrip(os.sep)
    return None

if __name__ == "__main__":
    main()
