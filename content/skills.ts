export interface Skill {
  name: string;
  title: string;
  description: string;
  worksIn: ("code" | "cowork")[];
  category: "pipeline" | "writing" | "image" | "video" | "utility";
}

export const skills: Skill[] = [
  {
    name: "hvg-flow",
    title: "HVG Flow",
    description:
      "End-to-end Veo video pipeline from a Notion request URL to delivered Veo clips with manifest. Runs setup silently and stops at up to 2 confirmations (reference assignment + consolidated preflight). The main editor workflow.",
    worksIn: ["code"],
    category: "pipeline",
  },
  {
    name: "hig-flow",
    title: "HIG Flow",
    description:
      "End-to-end Nano Banana b-roll pipeline. Image counterpart to hvg-flow. Defaults to NB Pro at 1k, count=1 (count=2 opt-in for a pick). Runs setup silently, stops at up to 2 confirmations (character match + a preflight that doubles as shot-list sign-off).",
    worksIn: ["code"],
    category: "pipeline",
  },
  {
    name: "vsl-state-variations",
    title: "VSL State Variations",
    description:
      "Per-state asset generation for a winning VSL — Phase 1 edit-swap slide images, then Phase 2 Veo Lite clips for every line. Downstream of an already-built broad / winner VSL; mirrors the Texas / Iowa templates.",
    worksIn: ["code"],
    category: "pipeline",
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
];
