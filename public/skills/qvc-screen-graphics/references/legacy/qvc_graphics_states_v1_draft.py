#!/usr/bin/env python3
"""QVC Live screen-graphics state renderer — ONE approved gpt base per element + PIL state swaps.
All output PNG. Values pixel-registered (same base, patched regions only) so board 'ticks' cleanly.
Regions are constants below — recalibrate per new base (render + eyeball a contact sheet)."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
Q="/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston"
B=f"{Q}/Elements/Graphics/Base Proposals"; OUT=f"{Q}/Elements/Graphics/Board States"
os.makedirs(OUT,exist_ok=True)
F=lambda size:ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Black.ttf",size)
NAVY=(11,25,55); WHITE=(255,255,255); GOLD=(212,175,55)
def sample(im,x,y): return im.getpixel((x,y))[:3]

# ---- SAVINGS BOARD states: $190 / $120 / $58 / $58 FLASH (base 2688x1520, number center ~y430-870)
bb=Image.open(f"{B}/Savings Board - 240 base.png").convert("RGB")
navy=sample(bb,1344,1150)
NUMR=(300,260,2100,900)         # region containing "$240"
BAR=(140,1075,2540,1180)        # gold meter bar span
def board(rate,frac,flash=False,name=""):
    im=bb.copy(); d=ImageDraw.Draw(im)
    d.rectangle(NUMR,fill=navy)
    txt=f"${rate}"; f=F(560)
    tw=d.textlength(txt,font=f)
    d.text(((NUMR[0]+NUMR[2])/2-tw/2, NUMR[1]+20), txt, font=f, fill=GOLD if flash else WHITE)
    fmo=F(120); d.text(((NUMR[0]+NUMR[2])/2+tw/2+30, NUMR[3]-170), "/MO", font=fmo, fill=WHITE)
    # shorten meter: cover right side of bar with panel navy
    x0,y0,x1,y1=BAR; keep=x0+int((x1-x0)*frac)
    d.rectangle((keep,y0-6,x1+8,y1+6),fill=sample(bb,2600,1128))
    if flash:
        glow=Image.new("RGB",im.size,(0,0,0)); gd=ImageDraw.Draw(glow)
        gd.rectangle((60,40,im.width-60,im.height-40),outline=GOLD,width=28)
        glow=glow.filter(ImageFilter.GaussianBlur(18))
        im=Image.blend(im,Image.composite(glow,im,glow.convert("L").point(lambda p:min(p*2,255))),0.0) or im
        d=ImageDraw.Draw(im); d.rectangle((50,34,im.width-50,im.height-34),outline=GOLD,width=16)
    im.save(f"{OUT}/{name}.png"); print("board",name)
board(240,0.97,False,"Savings Board - 240")
board(190,0.75,False,"Savings Board - 190")
board(120,0.45,False,"Savings Board - 120")
board(58,0.16,False,"Savings Board - 58")
board(58,0.16,True, "Savings Board - 58 FLASH")

# ---- CHECKLIST states (base 1744x2336): boxes col x~200-390, rows y approx
cl=Image.open(f"{B}/Discount Checklist - unchecked base.png").convert("RGB")
ROWS={"safe":(205,660,395,850),"multi_policy":(205,975,395,1165),"multi_car":(205,1290,395,1480),"paperless":(205,1585,395,1775),"homeowner":(205,1900,395,2090)}
def tick(d,box,color=GOLD,w=22):
    x0,y0,x1,y1=box; mx=(x0+x1)/2; my=(y0+y1)/2
    d.line([(x0+30,my),(mx-14,y1-40)],fill=color,width=w)
    d.line([(mx-14,y1-40),(x1-22,y0+34)],fill=color,width=w)
def checklist(checks,flash,name):
    im=cl.copy(); d=ImageDraw.Draw(im)
    for k in checks: tick(d,ROWS[k])
    if flash:
        d.rectangle((40,30,im.width-40,im.height-30),outline=GOLD,width=14)
    im.save(f"{OUT}/{name}.png"); print("checklist",name)
checklist(["safe"],False,"Checklist - 1 safe driver")
checklist(["safe","multi_policy"],False,"Checklist - 2 multi policy")
checklist(["safe","multi_policy","homeowner"],True,"Checklist - 3 HOMEOWNER FLASH")

# ---- COUNTER states + transparency (base 2688x1520, chip ~y440-700, number right side)
co=Image.open(f"{B}/Caller Counter chip base.png").convert("RGB")
chipnavy=sample(co,1300,560)
CNUM=(1870,470,2500,660)
def keyout(im, bg_tol=28):
    im=im.convert("RGBA"); px=im.load()
    bg=im.getpixel((30,30))[:3]
    for yy in range(im.height):
        for xx in range(im.width):
            r,g,b,a=px[xx,yy]
            if abs(r-bg[0])<=bg_tol and abs(g-bg[1])<=bg_tol and abs(b-bg[2])<=bg_tol:
                px[xx,yy]=(0,0,0,0)
    return im
def counter(num,name):
    im=co.copy(); d=ImageDraw.Draw(im)
    d.rectangle(CNUM,fill=chipnavy)
    f=F(150); d.text((CNUM[0]+20,CNUM[1]+10),num,font=f,fill=WHITE)
    keyout(im).save(f"{OUT}/{name}.png"); print("counter",name)
counter("4,217","Counter - 4217")
counter("4,251","Counter - 4251")
counter("4,300+","Counter - 4300plus")

# ---- CALLER LOWER THIRDS: Marcus (key base) + Linda (name swap) transparent
lt=Image.open(f"{B}/Caller Lower Third base.png").convert("RGB")
keyout(lt.copy()).save(f"{OUT}/Caller LT - MARCUS Houston.png"); print("LT marcus")
NAME=(330,470,1120,640)
im=lt.copy(); d=ImageDraw.Draw(im)
d.rectangle(NAME,fill=sample(lt,700,430))
d.text((NAME[0]+10,NAME[1]+16),"LINDA",font=F(130),fill=WHITE)
keyout(im).save(f"{OUT}/Caller LT - LINDA Houston.png"); print("LT linda")

# ---- CONNECTING overlay (pure PIL, transparent) + number (digit-exact)
cn=Image.new("RGBA",(1600,420),(0,0,0,0)); d=ImageDraw.Draw(cn)
d.rounded_rectangle((10,10,1590,410),radius=48,fill=(11,25,55,235),outline=GOLD,width=8)
d.text((90,70),"CONNECTING…",font=F(150),fill=WHITE)
d.text((90,260),"(713) 936-4745",font=F(96),fill=GOLD)
cn.save(f"{OUT}/CONNECTING overlay.png"); print("connecting")

# ---- CHANNEL BUG from SMA wordmark (transparent)
wm_path="/Volumes/ads/PFM MEDIA MASTER FOLDER/2. Client Media Assets/SMA - Brand Folder/Logos/savemaxauto-wordmark.png"
if os.path.exists(wm_path):
    wm=Image.open(wm_path).convert("RGBA")
    scale=520/wm.width; wm=wm.resize((520,int(wm.height*scale)))
    bug=Image.new("RGBA",(700,wm.height+120),(0,0,0,0)); bd=ImageDraw.Draw(bug)
    bug.paste(wm,(20,10),wm)
    bd.rounded_rectangle((20,wm.height+22,250,wm.height+108),radius=16,fill=(200,30,30,255))
    bd.text((48,wm.height+30),"LIVE",font=F(64),fill=WHITE)
    bug.save(f"{OUT}/Channel Bug - SAVEMAXAUTO LIVE.png"); print("bug ok")
else:
    print("bug SKIPPED — wordmark not found:",wm_path)
print("STATES_DONE")
