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
      "End-to-end Veo video pipeline. Walks 9 confirmation gates from a Notion request URL to delivered Veo clips with manifest. The main editor workflow.",
    worksIn: ["code"],
    category: "pipeline",
  },
  {
    name: "hig-flow",
    title: "HIG Flow",
    description:
      "End-to-end Nano Banana b-roll pipeline. Image counterpart to hvg-flow. Defaults to NB Pro at 1k, count=2. 9 confirmation gates.",
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
  {
    name: "iphone-cameraroll-prompting",
    title: "iPhone Camera-Roll Prompting",
    description:
      "Prompt style for real-phone-snap aesthetic b-roll. Anti-stock, anti-glossy. Pair with hig-flow for batch generation.",
    worksIn: ["code", "cowork"],
    category: "image",
  },
  {
    name: "higgsfield-image-generation",
    title: "Higgsfield Image Generation (CLI)",
    description:
      "Fire one-off image generations through the Higgsfield CLI. Pre-upload refs to UUIDs, fire via higgsfield generate create, download into project folder. CLI-only — the Higgsfield MCP is forbidden for actual firing (read-only inspection only).",
    worksIn: ["code"],
    category: "image",
  },
  {
    name: "higgsfield-veo-batch",
    title: "Higgsfield Veo Batch (Legacy HVG.1)",
    description:
      "Reads an HVG.1 webapp manifest + fires the Veo batch via CLI. Kept for legacy projects; new projects use hvg-flow instead.",
    worksIn: ["code"],
    category: "video",
  },
  {
    name: "audio-qc",
    title: "Audio QC",
    description:
      "Post-download audio quality check for Veo mp4 clips. Two phases: ffmpeg flags silent / clipped / no-audio in ~90s, then Whisper transcribes each clip and fuzzy-matches against the Excel manifest's dialogue column to catch wrong-words / mid-syllable cuts in ~2 min. Total ~3-4 min for ~350 clips on M-series. Auto-offered by hvg-flow and higgsfield-veo-batch after downloads.",
    worksIn: ["code"],
    category: "utility",
  },
];
