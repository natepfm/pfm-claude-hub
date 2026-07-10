export interface Skill {
  name: string;
  title: string;
  description: string;
  worksIn: ("code" | "cowork")[];
  category: "gen-auto" | "gen-manual" | "writing" | "image" | "video" | "utility";
}

export const skills: Skill[] = [
  {
    name: "hvg-flow",
    title: "HVG Flow",
    description:
      "End-to-end Veo video pipeline from a Notion request URL to delivered Veo clips with manifest. Runs setup silently and stops at up to 2 confirmations (reference assignment + consolidated preflight). The main editor workflow.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "hig-flow",
    title: "HIG Flow",
    description:
      "End-to-end Nano Banana b-roll pipeline. Image counterpart to hvg-flow. Defaults to NB Pro at 1k, count=1 (count=2 opt-in for a pick). Runs setup silently, stops at up to 2 confirmations (character match + a preflight that doubles as shot-list sign-off).",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "vsl-state-variations",
    title: "VSL State Variations",
    description:
      "Per-state asset generation for a winning VSL — Phase 1 edit-swap slide images, then Phase 2 Veo Lite clips for every line. Downstream of an already-built broad / winner VSL; mirrors the Texas / Iowa templates.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "pixar-state-music-video",
    title: "Pixar State Music Video",
    description:
      "Per-state Pixar Best State Music Video asset generator (Auto + Home). Fires a 3D Pixar anthropomorphic state-outline mascot character master + 12 locked-structure scene frames via NB Pro using state-derived tokens (shape, signature terrain, body color, cap, vehicle), and preps the state-filled lyrics + ready-to-paste Suno style block. Semi-auto: skill auto-fires Higgsfield + preps Suno; human runs Suno take-gen + pick; Mark assembles the edit.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "stage-request",
    title: "Stage Request (AGF)",
    description:
      "Stage a Video Task Manager request for Asset Gen Flow. Resolves the source creative's master prompt + reference images, sets up the project folder on Lucid, writes the verbatim dialogue manifest + 🤖 Asset Generation section, then routes it — send to AGF (the office mini fires it hands-off) or generate locally now. Eligibility is resolvability, not creative shape: state batches, VSL→Calls conversions, single-state re-edit regens all qualify. Needs Lucid access for the file steps (handled gracefully in Cowork).",
    worksIn: ["code", "cowork"],
    category: "gen-auto",
  },
  {
    name: "veo-script-writing",
    title: "Veo Script Writing",
    description:
      "Veo 3.1 script formatting + per-clip line balancing. Enforces 6-8s lines (lean long), no dashes, no ALL CAPS, no [STATE LINE] trailing annotations, and Gate 0 LC-handoff detection.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "lc-to-video-podcast",
    title: "LC to Video Podcast",
    description:
      "Convert a working long-copy Facebook ad into a Veo-numbered podcast monologue script. Layers podcast voice (filler, intensifiers, period→comma combining, dialogue attribution) on top of Veo rules.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "story-beats",
    title: "Story Beats",
    description:
      "Generate locked beat skeletons for PFM story ads from a reference creative or original idea. 6-beat baseline with must-hit dialogue anchors.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "breaking-news-story-ads",
    title: "Breaking News Story Ads",
    description:
      "Wrap a PFM story ad as a local 6pm news segment (LATU News or equivalent). Anchor copy, field reporter packages, chyrons / lower thirds.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "human-ad-copy",
    title: "Human Ad Copy",
    description:
      "Make written ad copy read fully human — the WP:AISIGNS AI-tell catalog adapted for direct-response ads, a mechanical tell-scanner, and 15 copy frameworks. Final pass on LC, primary text, headlines, and hooks. Adapted from Caleb Kruse (Mr. Paid Social); PFM compliance language always wins.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "nano-banana-prompting",
    title: "Nano Banana Prompting",
    description:
      "Prompt patterns for Nano Banana Pro — photorealistic social-proof images, character-consistent scenes, iPhone-style candids.",
    worksIn: ["code", "cowork"],
    category: "image",
  },
  // NOTE: `iphone-cameraroll-prompting` was retired 2026-05-27 and folded into
  // `nano-banana-prompting` as the "iPhone camera-roll style" section.
  {
    name: "higgsfield-image-generation",
    title: "Higgsfield Image Generation (CLI)",
    description:
      "Fire one-off image generations through the Higgsfield CLI. Pre-upload refs to UUIDs, fire via higgsfield generate create, download into project folder. CLI-only — the Higgsfield MCP is forbidden for actual firing (read-only inspection only).",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "pfm-character-master",
    title: "PFM Character Master",
    description:
      "Generate scale-anchored character masters for any character — human, animal, mascot — as a single locked-format reference sheet showing the character at correct proportional scale next to a 5'10\" human silhouette anchor, in 5 angles (front / side / 3-quarter / back / sitting). Fires via Higgsfield NB Pro. The scale anchor is the load-bearing part: without it, NB Pro improvises and renders dogs at human-scale or kids at adult-height. Downstream b-roll prompts that include this master as a reference inherit the scale lock.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "audio-qc",
    title: "Audio QC",
    description:
      "Post-download audio quality check for Veo mp4 clips. Two phases: ffmpeg flags silent / clipped / no-audio in ~90s, then Whisper transcribes each clip and fuzzy-matches against the Excel manifest's dialogue column to catch wrong-words / mid-syllable cuts in ~2 min. Total ~3-4 min for ~350 clips on M-series. Auto-offered by hvg-flow after downloads.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "visual-qc",
    title: "Visual QC",
    description:
      "Post-download visual quality check for Veo mp4 clips. Sibling to audio-qc — catches what you can see that audio can't (background morphs, slide text garble, hallucinated overlays, hard cuts). Per-clip 5-frame filmstrip via ffmpeg (0/2/4/6/7.8s × 480px wide, hstacked); for caption-slide clips, also pulls full-res 4/6/7.8s frames. Claude reads each strip and calls ✓ / ✗ / 🔍 VERIFY per clip. Best for VSL-style projects with per-line slide refs. Auto-offered after audio QC by hvg-flow Step 11.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "notion-asset-delivery",
    title: "Notion Asset Delivery",
    description:
      "Posts the delivery comment to a Notion request when creatives are done — \"✅ Completed Creatives (#): <link>\" plus any manual-fire notes. Auto-builds the LinkYourFile folder link (no more hand-making it) and composes the house-format comment, then posts only after one hard confirm — it never auto-posts. Auto-offered by hvg-flow at its final report; usable standalone otherwise.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "propose-skill",
    title: "Propose a Skill",
    description:
      "Editor-facing — turn a repeatable workflow you keep doing into a Skill Proposal for the master system. Say \"this should be a skill\" and Claude reconstructs the workflow from your session, asks a few quick gaps, and drops a structured proposal in the shared Lucid inbox (6. Claude PFM/Skill Proposals/) for Sam to triage and build. You never write a SKILL.md — Claude captures it all. Approved proposals ship back to everyone via Update my skills, credited to you.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "suno-songwriter",
    title: "Suno Songwriter",
    description:
      "Turn an ad script into a Suno v5 song — lyrics + style block, hook-driven and offer-forward. The validated ad-to-song workflow; output feeds the downstream Veo claymation ad pipeline.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "ugc-cinematic-prompt",
    title: "UGC Cinematic Prompt",
    description:
      "Write Seedance 2.0 video prompts with a strict 11-block structure (STYLE, ENVIRONMENT, CHARACTER, PRODUCT, CONTEXT, ENERGY, CAMERA, LIGHTING, PHYSICS, AUDIO, TIME STAMPS). The user is authoritative — no forced default style; adapts to cinematic / UGC / anime / horror / etc. Scales beats to a chosen duration (15s hard cap). The prompt is the deliverable, with an optional Higgsfield CLI fire path (seedance_2_0 / kling3_0). Credit: Drake.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "reskin-trending-video",
    title: "Reskin Trending Video",
    description:
      "Reskin a trending / reference clip into a brand-safe gen prompt that keeps the trend's structure and pacing but swaps the subject for your character. Inspects the ref first (ffmpeg contact sheet), flags IP/watermark/PII/brand-unsafe pitfalls, picks the engine (Seedance for concept reskins, Kling Motion Control for literal motion transfer), writes the body via ugc-cinematic-prompt with a REFERENCES block + spread exclusions, and hands over a post-pro plan for what won't render. Optional CLI fire. Credit: Drake.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "ugc-interview-flow",
    title: "UGC Interview Flow (No-Cuts)",
    description:
      "PFM's fake-continuous one-take pipeline (by Zach Hustead): a host walks a location interviewing the cast, generated as Seedance clips chained off each clip's real last frame with pixel-gated joints — the editor butt-joins them into one seamless take. Handles full demographic matrices off one script.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "iphone-broll",
    title: "iPhone B-Roll",
    description:
      "Camera-roll b-roll sets: identity-swap an existing creative's whole photo set to a new character, or build a fresh set from the script's beats. Locked masters + environment plates, never the original images as refs.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "jre-swap",
    title: "JRE Swap",
    description:
      "Put a new character onto the existing JRE-style podcast set by recreating the locked reference frame with only the person swapped — set, framing, and composition match previous creatives exactly.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "social-proof-phone-quote",
    title: "Social Proof Phone Quote",
    description:
      "The customer-holding-their-phone-with-the-quote shot: person + phone + readable branded quote page in ONE generation, using the screen graphic as reference one. Never post-composited.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "broadcast-news-stills",
    title: "Broadcast News Stills",
    description:
      "Anchor-desk shots, field-reporter standups, and sit-down interviews that read as freeze-frames from a real local broadcast — the b-roll for breaking-news creatives.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "object-inserts",
    title: "Object Inserts",
    description:
      "No-people cutaways: the bill on the counter, keys on the table, hands on the wheel. Lived-in anti-stock texture shots between talking beats — no character reference needed.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "assetgen-rokuctv-calls-breakingnews",
    title: "Roku CTV BN Pipeline",
    description:
      "End-to-end asset factory for a Roku CTV Calls Breaking News variant: standups, banner + end card, chyrons, wall composites, both close halves — one job, digit-verified, additively imported to DaVinci. Alias: /ag.rctv.c.bn.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "ag.rctv.c.bn",
    title: "/ag.rctv.c.bn (alias)",
    description:
      "Typing shortcut that loads the Roku CTV Breaking News pipeline.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "call-graphics",
    title: "Call Graphics",
    description:
      "Banner + EndCard phone graphics for any Calls creative, from the brand's template library, with the tracking number rendered digit-perfect and verified.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "anchor-wall-composite",
    title: "Anchor Wall Composite",
    description:
      "Composites the verified EndCard onto the studio anchor's video wall — the locked reference frame for close-line clips. Breaking-news creatives only.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "bn-lower-thirds",
    title: "BN Lower Thirds (FROZEN)",
    description:
      "⚠️ Frozen: was Canva-based and PFM has exited Canva — rebuild on the HTML render method is pending. Don't run; ask Sam for BN strips.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "ctv-bn-variation",
    title: "CTV BN Variation (retired)",
    description:
      "Retired 07-09 — superseded by the Roku CTV BN Pipeline. This stub redirects automatically.",
    worksIn: ["code"],
    category: "gen-manual",
  },
  {
    name: "labs-voice-swap",
    title: "Labs Voice Swap",
    description:
      "Replace a generated clip's voice with an ElevenLabs library voice via speech-to-speech — timing preserved so lip-sync holds. Every Max the Dog creative goes through this.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "podcast-guest-veo",
    title: "Podcast Guest Veo",
    description:
      "The locked voice/audio prompt treatment for podcast-guest characters — keeps the voice clean and consistent across every clip of a guest.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "ugc-talking-head-ref",
    title: "UGC Talking Head Ref",
    description:
      "Generates the locked UGC presenter reference still — the paused-mid-sentence phone-video look that makes AI presenters read as real people.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "ugc-talking-head-veo",
    title: "UGC Talking Head Veo",
    description:
      "Writes the locked Veo master prompt + verbatim dialogue manifest that turns a UGC reference still into talking clips.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "veo-life",
    title: "Veo Life",
    description:
      "Brings finished stills to life as 6-second locked-camera cinemagraph clips (breathing, blinks, one atmospheric motion, no audio).",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "pixar-mascot-broll",
    title: "Pixar Mascot B-Roll",
    description:
      "Turns a VSL script into Pixar-3D vignettes where the brand mascot acts out selected lines — gpt_image_2 with the canon mascot as reference, ready for Kling image-to-video.",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "character-board",
    title: "Character Board",
    description:
      "Rebuilds the visual tile index of all AI characters from the Character Library so anyone can browse the cast at a glance.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "naturalize-numbers",
    title: "Naturalize Numbers",
    description:
      "Converts dollar digits in a script to natural spoken reads (forty-seven hundred, three ninety-one) so the AI voice never reads like a robot. The single owner of the spoken-number rules.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "notion-state-batches",
    title: "Notion State Batches",
    description:
      "Fans a completed Batch 1 out to Batches 2-6 in the Video Task Manager, covering all 50 states with the locked cadence and per-state fills.",
    worksIn: ["code", "cowork"],
    category: "writing",
  },
  {
    name: "find-skills",
    title: "Find Skills (external)",
    description:
      "Searches the public skills registry for external community skills — explicit ask only; PFM internal skills always take precedence. Editors propose, never install.",
    worksIn: ["code"],
    category: "utility",
  },
  {
    name: "add-ai-disclaimer",
    title: "Add AI Disclaimer",
    description:
      "Burns the required AI-performer disclaimer onto finished videos in the locked house style — auto-detects vertical vs horizontal, re-encodes clean, never touches the source.",
    worksIn: ["code"],
    category: "utility",
  },
];
