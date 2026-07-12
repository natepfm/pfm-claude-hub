#!/usr/bin/env python3
"""
build_pixar_prompts.py — Pixar State Music Video: master prompt template + per-state token fill.

Generates the 13-image shot set for a state's Pixar Best State Music Video:
  - 1 CHARACTER master  (the singing state-outline mascot)
  - 12 b-roll SCENES     (locked structure, state-token-filled)

The 12 scenes are a FIXED structure (proven identical across Georgia/Washington/Oregon
builds 2026-05). Only the per-state tokens swap — exactly the VSL/Sarah token-fill pattern.
Vertical (auto|home) only changes scene 10's sign + scene 12's app label + the reveal copy;
the visual character/scenes are identical between Auto and Home.

Usage:
  python3 build_pixar_prompts.py <state_tokens.json> <vertical:auto|home> <out.json>

state_tokens.json schema (derive per state by looking up real state features):
{
  "state": "Oregon",
  "abbr": "OR",
  "shape": "vertical rectangle, slightly irregular, gently notched bottom edge along the California/Nevada border, clean straight top along the Washington/Columbia River border",
  "body_color": "forest green",
  "cap": "navy blue ball cap with an 'OREGON' patch and small star accents",
  "vehicle": "well-loved older tan/beige Toyota Land Cruiser-style SUV with slightly faded paint and a small dent",
  "terrain": "Mt. Hood snow-capped peak, dense Douglas-fir and larch forests, autumn foliage, ferns and moss",
  "flora": "Douglas firs, autumn larches, ferns, foxglove and lupine wildflowers",
  "landmark_city": "Portland",
  "landmark_signs": ["HISTORIC COLUMBIA RIVER HWY", "Mt. Hood"],
  "palette": ["forest green character", "tan SUV body", "Mt Hood snow white", "Douglas fir deep green", "autumn larch gold", "Oregon overcast sky"],
  "avoid_states": ["Texas", "Colorado", "California"],
  "license_plate": "Oregon plate (tree/forest motif, blue lettering)",
  "weather": "crisp Pacific Northwest overcast-to-golden light"
}
"""
import json, sys

# --- the 12 LOCKED scenes: (slug, title, action_template, scene_template) ---
# {STATE} {VEHICLE} {TERRAIN} {FLORA} {CITY} {SIGN} {REVEAL} {VERTICAL_NOUN} {VERTICAL_ICON} {PLATE}
SCENES = [
 ("01_driving_hero", "Country Road Driving (Hero / Brand)",
  "Seated behind the steering wheel of a {VEHICLE}, both mitten hands gripping the top of the wheel at 10-and-2 (mitten hands rendered as solid mittens with NO individual fingers), big open-mouth happy smile, body slightly leaning into the turn, character clearly visible through the open driver's window; a small {VERTICAL_NOUN} insurance card and a folded {STATE} state map tucked into the dashboard slot",
  "Cruising down a quiet two-lane {STATE} country highway; through the windshield and side window: {TERRAIN}, {FLORA} along the road, painted yellow centerline; a {PLATE} on the vehicle; 3/4 front-side hero angle, golden/overcast {STATE} light"),
 ("02_living_room", "Living Room — Stressed Driver with Bills",
  "{STATE} character standing supportively next to a stressed seated person at a table of bills, gentle reassuring closed-mouth smile, one mitten hand raised in a calming gesture, the other mitten hand pointing to a positive lower number on a paper as if showing a better {VERTICAL_NOUN} rate",
  "Cozy {STATE} living room interior, warm lamp light, scattered {VERTICAL_NOUN}-insurance bills on the table, a window behind showing {TERRAIN} faintly outside"),
 ("03_crt_loading", "Retro CRT — Rate Loading (Lookup)",
  "Standing centered on a vintage off-white mechanical keyboard, mitten hands gesturing slightly outward, warm closed-mouth smile, body angled to camera, a retro CRT monitor looming behind showing a {VERTICAL_NOUN}-rate lookup loading bar",
  "Warm retro desk setup, vintage beige CRT computer, soft tungsten light, a small {STATE} pennant or sticker on the monitor"),
 ("04_crt_locked", "Retro CRT — Locked In (Covered)",
  "Standing centered on the vintage keyboard, right mitten hand on hip in a confident pose, left mitten hand giving a small thumbs-up, warm friendly smile, looking directly at the viewer; the CRT behind shows a green 'COVERED' checkmark and a low {VERTICAL_NOUN} rate",
  "Same warm retro desk, CRT glowing green with a locked-in low rate on screen"),
 ("05_tow_truck", "Tow Truck Cab — Roadside Recovery (Service)",
  "Seated in the operator's chair of a heavy flatbed tow truck cab, mitten hands gripping the wheel and a winch lever confidently, wearing a bright yellow hard hat sitting on top of the {STATE} cap, slight confident half-smile",
  "Roadside {STATE} recovery scene visible through the cab windows, {TERRAIN} in the background, amber service-light glow"),
 ("06_home_selfie", "Home Selfie with Saved Customer",
  "{STATE} character holding up a modern smartphone in the left mitten hand for a selfie, big open-mouth happy smile, right mitten arm around a happy customer's shoulder; the selfie phone screen subtly shows a {VERTICAL_ICON} and a dollar-savings graphic",
  "In front of a typical {STATE} home exterior, {FLORA} in the yard, warm friendly daylight"),
 ("07_celebration", "{CITY} Tavern Celebration — “{STATE} Is The Best”",
  "{STATE} character standing on top of a heavy oak barrel center stage, both mitten arms raised triumphantly overhead, huge open-mouth joyful smile, a cheering crowd around him with raised glasses",
  "Lively {CITY} tavern interior, warm string lights, locals celebrating, a subtle '{STATE} IS THE BEST' banner on the back wall"),
 ("08_barn_dance", "Barn Dance — “Same Coverage”",
  "{STATE} character at center mid-dance, both mitten arms raised in joy, big open-mouth smile, light bounce in stance, surrounded by a circle of cheering locals clapping along",
  "Rustic {STATE} barn dance, string lights and hay bales, a framed 'SAME COVERAGE, LESS MONEY' sign on the back wall"),
 ("09_farm_porch", "Farm Porch — “Recalculate Your Rate”",
  "{STATE} character standing on a farmhouse porch beside a rocking chair, mitten hand resting friendly on the chair's armrest, warm closed-mouth smile, looking toward the viewer; a small phone on the porch rail showing a 'RECALCULATE YOUR RATE' screen",
  "Classic {STATE} farmhouse porch at golden hour, {TERRAIN} rolling out behind, {FLORA} by the steps"),
 ("10_main_street_sign", "{CITY} Main Street — Reveal Sign",
  "{STATE} character standing front and center holding up a wooden hand-painted sign reading '{SIGN_TEXT}' in big bold letters with a small line-art {VERTICAL_ICON} next to the price, big proud open-mouth smile, a happy couple flanking him",
  "Charming {CITY} main street storefront row, warm daylight, {STATE} character is the clear hero in foreground"),
 ("11_truck_5yr", "Country Road — Standing on Old Truck (“In 5 Years” / clean record)",
  "Standing triumphantly on the dented hood of the {VEHICLE}, both mitten arms raised cheerfully, big open-mouth smile, slight victorious lean",
  "Open {STATE} country road, {TERRAIN} behind, {FLORA} on the shoulder, breezy hero moment"),
 ("12_reveal_finale", "Savings Reveal — Confetti Finale (Brand Finale)",
  "Standing front-center holding up a giant oversized smartphone in both mitten hands, screen visible to viewer showing a clean savings-app UI with a small line-art {VERTICAL_ICON} at top, header text '{VERTICAL_LABEL}', green checkmarks on a coverage list, and a big '{REVEAL}' rate; huge celebratory open-mouth smile",
  "Bright celebratory {STATE} backdrop, colorful confetti raining down, festive brand-finale energy"),
]

RENDER = {
  "medium": "3D Pixar-style stylized animation render",
  "look": "Cinematic, polished, family-friendly animated film quality",
  "details": "Soft subsurface scattering on the character body, painterly state-terrain detail, soft global illumination, slight depth-of-field falloff, warm cinematic grade"
}

def char_prompt(t):
    # NB Pro takes PLAIN PROSE, not a JSON blob (JSON prompt -> HTTP 500). Flatten to a paragraph.
    avoid=", ".join(t.get("avoid_states",[]))
    return (
      f"3D Pixar-style stylized animation render of the {t['state']} state-outline character: an "
      f"anthropomorphic {t['state']} map shape ({t['shape']}), {t['body_color']} body, big expressive "
      f"cartoon eyes with full brows, warm friendly closed-mouth smile, small mitten hands rendered as "
      f"SOLID MITTENS with NO individual fingers, short little legs. Wears a {t['cap']}. The body subtly "
      f"suggests {t['state']} terrain. Standing front-on in a neutral happy hero pose, full body in frame, "
      f"on a clean soft studio gradient backdrop (warm peach to cream). Cinematic family-friendly animated "
      f"film quality, soft subsurface scattering, soft global illumination, 9:16 vertical. "
      f"Clean, recognizable, smooth {t['state']} state silhouette (not lumpy or melted edges). "
      f"Do NOT show fingers on the mittens, no extra/fused fingers, no malformed hands, no photorealistic "
      f"humans, no live action, no wrong state shape (NOT {avoid}), no generic rectangle, not blurry."
    )

def fill(s, t, vertical):
    vn = "auto" if vertical=="auto" else "home"
    vnoun = "auto" if vertical=="auto" else "home"
    vicon = "car icon" if vertical=="auto" else "house icon"
    vlabel = "AUTO INSURANCE" if vertical=="auto" else "HOME INSURANCE"
    reveal = "$39 A MONTH" if vertical=="auto" else "$369 A YEAR"
    sign_text = (f"AUTO INSURANCE $39 A MONTH" if vertical=="auto" else f"HOME INSURANCE $369 A YEAR")
    reps = {"{STATE}":t["state"],"{VEHICLE}":t["vehicle"],"{TERRAIN}":t["terrain"],"{FLORA}":t["flora"],
            "{CITY}":t["landmark_city"],"{PLATE}":t.get("license_plate",f"{t['state']} license plate"),
            "{VERTICAL_NOUN}":vnoun,"{VERTICAL_ICON}":vicon,"{VERTICAL_LABEL}":vlabel,
            "{REVEAL}":reveal,"{SIGN_TEXT}":sign_text}
    def sub(x):
        for k,v in reps.items(): x=x.replace(k,v)
        return x
    slug,title,action,scene=s
    avoid=", ".join(t.get("avoid_states",[]))
    # PLAIN PROSE for NB Pro (JSON -> HTTP 500).
    prose=(
      f"3D Pixar-style stylized animation render. {sub(action)}. The character is the {t['body_color']} "
      f"{t['state']}-shaped Pixar mascot wearing a {t['cap']}, mitten hands with NO individual fingers. "
      f"Setting: {sub(scene)}. Cinematic family-friendly animated film quality, soft subsurface scattering, "
      f"soft global illumination, slight depth-of-field, 9:16 vertical. Any on-screen sign or text appears "
      f"EXACTLY ONCE, no duplicate or echoed text. "
      f"Do NOT show fingers on the mittens, no malformed hands, no photorealistic humans, no live action, "
      f"NOT the {avoid} state shape or terrain, not blurry, not cluttered."
    )
    return {"id":slug,"title":sub(title),"prose":prose,"palette":t.get("palette",[])}

# ============================ UGC / AVERAGE-STATE MODE ============================
# "Average State" = a spoken UGC SCRIPT converted to Pixar. The state mascot TALKS
# (lip-synced VO, NO Suno song). One scene per script line, illustrating that beat.
# Numbers are STATE-SPECIFIC from the rate sheet (avg rate, standard reveal, state reveal).
#
# ugc_lines.json schema:
# { "state":"Michigan","abbr":"MI", "tokens": <same state_tokens as music mode>,
#   "numbers": {"avg_mo":"$238","avg_yr":"$2,859","reveal_std":"$30/mo","reveal_state":"$48/mo"},
#   "hooks": ["(no text hook)","If you live in Michigan watch this 👀","How much does Michigan actually pay for car insurance? 👀"],
#   "lines": ["Hi, I am Michigan, and the average car insurance bill in my state is $238 a month.", ...] }
#
# Per-line scene = the state mascot delivering that line, with on-beat visual props:
#   line w/ a $ figure  -> that figure as bold 3D floating text in scene
#   discount line       -> 3 discount icon badges + "up to 80% off"
#   reveal line         -> glowing white phone showing the rate
#   CTA line            -> mascot pointing to a "tap link below" gesture

def ugc_scene_prose(state, tokens, line, idx, numbers):
    bc=tokens["body_color"]; cap=tokens["cap"]; terr=tokens["terrain"]
    low=line.lower()
    # detect beat-specific props
    props=[]
    import re as _re
    dollars=_re.findall(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:a month|a year|/mo|/yr|per month|per year))?', line)
    if dollars: props.append(f"the figure '{dollars[0]}' shown as bold 3D floating text beside the character")
    if "discount" in low or "80%" in low: props.append("three small discount icon badges (safe-driver, multi-car, homeowner) popping up with an 'up to 80% off' badge")
    if "phone" in low or "as low as" in low or "rate as low" in low: props.append("a glowing white smartphone sliding into frame showing the low rate on screen")
    if "link" in low or "tap" in low or "click" in low: props.append("the character gesturing down toward an implied 'tap the link below' button")
    if "map" in low or idx==1 or low.startswith(("hi, i am","hi i am","hi, im","hello")): props.append("a stylized USA map behind, with the state glowing and popping out into 3D")
    prop_txt=("; on-screen this beat shows "+", ".join(props)) if props else ""
    return (
      f"3D Pixar-style stylized animation render, 9:16 vertical, cinematic family-friendly. "
      f"The {state} state-outline character ({bc} body, {cap}, mitten hands with NO individual fingers, "
      f"big expressive cartoon eyes) is talking directly to camera, mid-sentence, mouth open in natural speech, "
      f"expression matching the line's emotion. The character stands in a believable {state} setting "
      f"(subtle {terr} in the background){prop_txt}. "
      f"Line being delivered (for expression/context, do NOT render as caption text): \"{line}\". "
      f"Soft subsurface scattering, soft global illumination, warm cinematic grade. "
      f"NEGATIVE: no fingers on mittens, no extra fingers, no malformed hands, no photorealistic humans, "
      f"no live-action, no caption/subtitle text burned in, no duplicate text, no wrong-state shape, "
      f"no low resolution, no blur."
    )

def build_ugc(data, out):
    st=data["state"]; ab=data.get("abbr",st[:2].upper()); tokens=data["tokens"]
    numbers=data.get("numbers",{}); lines=data["lines"]; hooks=data.get("hooks",[])
    shots=[{"shotId":f"{ab}_character","kind":"character","prompt":char_prompt(tokens),
            "outName":f"claude_character_{st.lower().replace(' ','_')}.png"}]
    for i,line in enumerate(lines,1):
        shots.append({"shotId":f"{ab}_line{i:02d}","kind":"ugc_scene","lineNum":i,"line":line,
                      "prompt":ugc_scene_prose(st,tokens,line,i,numbers),
                      "outName":f"claude_{st.lower().replace(' ','_')}_line{i:02d}.png"})
    manifest={"project":{"name":f"Pixar Average State (UGC) — {st}","slug":f"pixar_ugc_{st.lower().replace(' ','_')}",
              "state":st,"mode":"ugc","numbers":numbers,"hooks":hooks,
              "note":"Spoken UGC script (NO Suno). State mascot talks; one scene per line. 3 hook variants are EDITOR-side text overlays, not separate gens."},
              "generation":{"model":"nano_banana_2","resolution":"2k","aspectRatio":"9:16","count":1},
              "tokens":tokens,"shots":shots}
    json.dump(manifest,open(out,"w"),indent=2)
    print(f"✓ {st} (UGC): 1 character + {len(lines)} line-scenes = {len(shots)} shots -> {out}")
    print(f"  numbers: {numbers}")
    print(f"  hooks ({len(hooks)}): editor adds as text overlays, not gens")

def main():
    args=sys.argv[1:]
    # --mode ugc <ugc_lines.json> <out.json>   OR   <tokens.json> <auto|home> <out.json>
    if args and args[0]=="--mode" and len(args)>=4 and args[1]=="ugc":
        build_ugc(json.load(open(args[2])), args[3]); return
    if args and args[0]=="--mode" and args[1]=="music": args=args[2:]
    tokens=json.load(open(args[0])); vertical=args[1].lower(); out=args[2]
    assert vertical in ("auto","home")
    st=tokens["state"]; ab=tokens.get("abbr",st[:2].upper())
    shots=[{"shotId":f"{ab}_character","kind":"character","prompt":char_prompt(tokens),
            "outName":f"{st} PIXAR.png"}]
    for i,s in enumerate(SCENES,1):
        f=fill(s,tokens,vertical)
        shots.append({"shotId":f"{ab}_{f['id']}","kind":"scene","sceneNum":i,
                      "prompt":f["prose"],"outName":f"{st.lower().replace(' ','_')}_{i:02d}.png"})
    manifest={"project":{"name":f"Pixar Best State Music Video — {st} ({vertical.title()})",
              "slug":f"pixar_{st.lower().replace(' ','_')}_{vertical}","state":st,"vertical":vertical,"mode":"music",
              "revealRate":"$39/mo" if vertical=="auto" else "$369/yr"},
              "generation":{"model":"nano_banana_2","resolution":"2k","aspectRatio":"9:16","count":1},
              "tokens":tokens,"shots":shots}
    json.dump(manifest,open(out,"w"),indent=2)
    print(f"✓ {st} ({vertical}): 1 character + 12 scenes = 13 shots -> {out}")

if __name__=="__main__": main()
