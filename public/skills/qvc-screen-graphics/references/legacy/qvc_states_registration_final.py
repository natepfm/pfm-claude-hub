import os
from PIL import Image, ImageDraw, ImageFont
Q="/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston"
B=f"{Q}/Elements/Graphics/Base Proposals"; OUT=f"{Q}/Elements/Graphics/Board States"
F=lambda s:ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Black.ttf",s)
WHITE=(255,255,255); GOLD=(212,175,55)
def med(im,x,y,r=20):
    px=[im.getpixel((xx,yy))[:3] for xx in range(x-r,x+r,4) for yy in range(y-r,y+r,4)]
    px.sort(key=lambda c:sum(c)); return px[len(px)//2]
def nongray_bbox(im,tol=26):
    bg=im.getpixel((10,10))[:3]; W,H=im.size
    xs=[];ys=[]
    for yy in range(0,H,6):
        for xx in range(0,W,6):
            r,g,b=im.getpixel((xx,yy))[:3]
            if abs(r-bg[0])>tol or abs(g-bg[1])>tol or abs(b-bg[2])>tol:
                xs.append(xx);ys.append(yy)
    return min(xs),min(ys),max(xs),max(ys)
def keyout(im,tol=28):
    im=im.convert("RGBA"); px=im.load(); bg=im.getpixel((10,10))[:3]
    for yy in range(im.height):
        for xx in range(im.width):
            r,g,b,a=px[xx,yy]
            if abs(r-bg[0])<=tol and abs(g-bg[1])<=tol and abs(b-bg[2])<=tol: px[xx,yy]=(0,0,0,0)
    return im

# BOARD: proper navy, full number cover
bb=Image.open(f"{B}/Savings Board - 240 base.png").convert("RGB")
cands=[med(bb,x,y) for x,y in [(200,400),(300,1000),(2500,400),(1344,1020),(150,700)]]
navy=min(cands,key=lambda c:sum(c))  # darkest = true panel navy
NUMR=(230,248,2620,1068); BAR=(140,1075,2540,1180)
barnavy=med(bb,2620,1128)
def board(rate,frac,flash,name):
    im=bb.copy(); d=ImageDraw.Draw(im)
    d.rectangle(NUMR,fill=navy)
    txt=f"${rate}"; f=F(560); tw=d.textlength(txt,font=f)
    cx=(NUMR[0]+NUMR[2])/2 - 100
    d.text((cx-tw/2, 300), txt, font=f, fill=GOLD if flash else WHITE)
    d.text((cx+tw/2+40, 730), "/MO", font=F(120), fill=WHITE)
    x0,y0,x1,y1=BAR; keep=x0+int((x1-x0)*frac)
    d.rectangle((keep,y0-8,x1+10,y1+8),fill=barnavy)
    if flash: d.rectangle((40,30,im.width-40,im.height-30),outline=GOLD,width=18)
    im.save(f"{OUT}/{name}.png"); print("board",name,"navy=",navy)
board(240,0.97,False,"Savings Board - 240")
board(190,0.75,False,"Savings Board - 190")
board(120,0.45,False,"Savings Board - 120")
board(58,0.16,False,"Savings Board - 58")
board(58,0.16,True, "Savings Board - 58 FLASH")

# COUNTER: chip bbox computed, number right-aligned INSIDE chip
co=Image.open(f"{B}/Caller Counter chip base.png").convert("RGB")
bx0,by0,bx1,by1=nongray_bbox(co)
chipnavy=med(co,(bx0+bx1)//2,(by0+by1)//2)
def counter(num,name):
    im=co.copy(); d=ImageDraw.Draw(im)
    w=bx1-bx0; h=by1-by0
    reg=(bx0+int(w*0.768), by0+int(h*0.14), bx1-int(w*0.015), by1-int(h*0.14))
    d.rectangle(reg,fill=chipnavy)
    f=F(int(h*0.46)); tw=d.textlength(num,font=f)
    d.text((reg[2]-tw-16, by0+int(h*0.26)), num, font=f, fill=WHITE)
    keyout(im).save(f"{OUT}/{name}.png"); print("counter",name,"chip",(bx0,by0,bx1,by1))
counter("4,217","Counter - 4217")
counter("4,251","Counter - 4251")
counter("4,300+","Counter - 4300plus")

# LINDA LT: chip bbox, name region after icon up to the dot separator
lt=Image.open(f"{B}/Caller Lower Third base.png").convert("RGB")
lx0,ly0,lx1,ly1=nongray_bbox(lt)
ltnavy=med(lt,(lx0+lx1)//2, ly0+int((ly1-ly0)*0.42))
im=lt.copy(); d=ImageDraw.Draw(im)
w=lx1-lx0; h=ly1-ly0
reg=(lx0+int(w*0.135), ly0+int(h*0.16), lx0+int(w*0.505), ly0+int(h*0.68))
d.rectangle(reg,fill=ltnavy)
f=F(int(h*0.34))
d.text((reg[0]+14, reg[1]+int(h*0.07)), "LINDA", font=f, fill=WHITE)
# redraw the gold underline segment across the patched span (it runs at ~0.72h)
d.line([(reg[0], ly0+int(h*0.72)), (reg[2], ly0+int(h*0.72))], fill=(212,175,55), width=max(6,int(h*0.025)))
dotx=lx0+int(w*0.525); doty=ly0+int(h*0.42)
d.ellipse((dotx-16,doty-16,dotx+16,doty+16),fill=(212,175,55))
keyout(im).save(f"{OUT}/Caller LT - LINDA Houston.png"); print("LT linda", (lx0,ly0,lx1,ly1))
print("FIX_DONE")
