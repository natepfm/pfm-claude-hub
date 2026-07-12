#!/usr/bin/env python3
"""Refresh the AI Characters flat "masters board" from Character Library.

Usage:  python3 build_board.py [dry|copy]    (default: dry)

Copies ONE tile per character (plus each distinct family member, versions
collapsed) FLAT into AI Characters/, renamed to the character so leads + family
cluster alphabetically. Folders already represented on the board are skipped, so
a refresh only processes newly-added characters. Anything with no clean portrait
is reported for a manual pick — never guessed onto the board blindly.

Character Library is NEVER modified. AI Characters subfolders are left untouched.
"""
import os, re, sys, shutil

BASE = "/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/AI Generation Assets - PFM"
CL   = os.path.join(BASE, "Character Library")     # source (read-only)
DEST = os.path.join(BASE, "AI Characters")         # the flat board
MODE = sys.argv[1] if len(sys.argv) > 1 else "dry"
IMG  = (".png", ".jpg", ".jpeg", ".webp")

# folders that are NOT single-character masters -> never boarded
SKIP = {"State Pixar Mascots", "Sam Reference Images", "Todd Reference Images"}
VERT = [" - Auto Home", " - Auto Loans", " - Auto", " - Home", " - Loans", " - SMA", " - SMH"]
COMPOSITE = ["+", " and ", " & ", "family", "couple"]     # group shots, not single-person masters
PORTRAIT_POS = ["neutral","front","headshot","portrait","model sheet","modelsheet","reference","podcast","master","interview","close up"]
SCENE_NEG = ["holding","@ bar","pool","jet","penthouse","rolls","royce","barabus","credit","card","bills","statement","watch","money","screen","soil","quote","gesture","eviction","repo","car chase","field","dark office","dark studio","library","desk","garage","window","stacks","dinner","outside","police"]
# manual picks for known scene-heavy folders (filename inside the char folder)
OVERRIDES = {"Chad Chapman - Auto": "Chad Chapman - Full 1.png",
             "Rachel Torres - Auto Home": "Rachel Torres - Field Reporter (Car Chase).png"}

def imgs_of(folder):
    out=[]
    try:
        for e in os.scandir(folder):
            if e.is_file() and not e.name.startswith(".") and e.name.lower().endswith(IMG):
                out.append(e.name)
    except Exception: pass
    return sorted(out)

def char_of(folder):
    c=folder
    for v in VERT:
        if c.endswith(v): c=c[:-len(v)]; break
    return c.strip()

def version_num(fn):
    m=re.findall(r"[vV](\d+)", fn)
    return max(int(x) for x in m) if m else 0

def clean_person(fn):
    s=os.path.splitext(fn)[0]
    s=re.sub(r"\[.*?\]","",s); s=s.replace("_"," ")
    s=re.split(r"(?i)\bmaster\b", s, maxsplit=1)[0]
    s=re.sub(r"(?i)\b(podcast|interview|couch|9x16|16x9|v\d+|es|topaz|upscaled|gs|not grey bg|neutral)\b"," ",s)
    s=re.sub(r"\b[0-9a-fA-F]{4,8}\b"," ",s); s=re.sub(r"[()\-]+"," ",s)
    return re.sub(r"\s+"," ",s).strip()

def is_composite(fn):
    low=" "+fn.lower()+" "
    return any(m in low for m in COMPOSITE)

def portrait_score(fn, first):
    n=fn.lower(); s=0
    if first.lower() in n: s+=2
    for k in PORTRAIT_POS:
        if k in n: s+=2
    for k in SCENE_NEG:
        if k in n: s-=2
    return s

# what's already on the board?
existing=[d for d in os.listdir(DEST) if os.path.isfile(os.path.join(DEST,d)) and d.lower().endswith(IMG)]
def represented(name):
    return any(os.path.splitext(d)[0]==name or d.startswith(name+" (") for d in existing)

new_tiles=[]; flags=[]; already=0
for entry in sorted(os.scandir(CL), key=lambda e:e.name.lower()):
    if not entry.is_dir() or entry.name in SKIP: continue
    name=entry.name
    if represented(name): already+=1; continue          # refresh: skip what's already boarded
    char=char_of(name); first=char.split()[0] if char.split() else char
    imgs=imgs_of(entry.path); masters=[f for f in imgs if "master" in f.lower()]
    if masters:
        people={}
        for m in masters:
            if is_composite(m): continue
            p=clean_person(m)
            key="__LEAD__" if (p=="" or p.lower()==char.lower() or p.lower()==first.lower()) else p
            people.setdefault(key,[]).append(m)
        for key,files in people.items():
            best=sorted(files,key=lambda f:(version_num(f),"not grey" in f.lower(),-len(f)))[-1]
            ext=os.path.splitext(best)[1]
            if key=="__LEAD__": dest=f"{name}{ext}"
            else:
                lab=key
                if lab.lower().startswith(first.lower()+" "): lab=lab[len(first)+1:]
                dest=f"{name} ({lab.strip()}){ext}"
            new_tiles.append((os.path.join(entry.path,best),dest))
    elif len(imgs)==1:
        new_tiles.append((os.path.join(entry.path,imgs[0]), name+os.path.splitext(imgs[0])[1]))
    elif len(imgs)==0:
        flags.append((name,"empty folder"))
    else:
        if name in OVERRIDES and OVERRIDES[name] in imgs:
            best=OVERRIDES[name]
        else:
            best=sorted(imgs,key=lambda f:portrait_score(f,first))[-1]
            if portrait_score(best,first)<0:
                flags.append((name, "no clean portrait — only scene/prop shots: " + ", ".join(imgs[:4]))); continue
        new_tiles.append((os.path.join(entry.path,best), name+os.path.splitext(best)[1]))

new_tiles.sort(key=lambda x:x[1].lower())
print("MODE:",MODE,"| already on board:",already,"| NEW to add:",len(new_tiles),"| flagged:",len(flags))
print("\n--- NEW tiles ---")
for s,d in new_tiles: print("  +",d,"  <=",os.path.basename(s))
print("\n--- FLAGGED (manual pick — copy by hand or add an OVERRIDE) ---")
for n,why in flags: print("  ?",n,"—",why)

if MODE=="copy":
    done=0
    for s,d in new_tiles:
        dp=os.path.join(DEST,d)
        if os.path.exists(dp): continue
        shutil.copy2(s,dp); done+=1
    print(f"\nCOPIED {done} new tile(s) to the board.")
