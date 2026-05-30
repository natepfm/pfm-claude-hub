// PFM Creative Library — the registry of creative TYPES, VARIATION types, and the
// BUILDING BLOCKS each skill produces, mapped to the skill that builds it.
// Source of truth: "6. Claude PFM/context/creative-library.md" (this mirrors it for the hub).
// Reconciled 2026-05-29 from a knowledge-base inventory (memory · PFM CONTEXT · skills · hub).

export interface CreativeEntry {
  name: string;
  aka?: string;
  description: string;
  skill: string; // skill that builds it, or "manual" / "none"
  appliesTo?: string; // variation types only
  group?: string; // building blocks only
}

// ── Creative types: the deliverable ad formats ──────────────────────────────
export const creativeTypes: CreativeEntry[] = [
  {
    name: "Story Ad",
    aka: "Veo story ad",
    description:
      "The core PFM format — a ~1:30–3:00 narrative ad on the 6-beat structure, built from per-line dialogue Veo clips of a character speaking to camera.",
    skill: "hvg-flow (via story-beats + veo-script-writing)",
  },
  {
    name: "Breaking News Story Ad",
    aka: "LATU News wrapper",
    description:
      "A story ad wrapped as a local 6pm news segment — anchor desk, field reporter, SOTs, chyrons / lower thirds.",
    skill: "breaking-news-story-ads",
  },
  {
    name: "Podcast Story Ad",
    aka: "LC-to-Video",
    description:
      "A long-copy Facebook ad reworked as a dad-on-a-podcast monologue, delivered in 6-8s Veo clips.",
    skill: "lc-to-video-podcast → hvg-flow",
  },
  {
    name: "UGC Testimonial / Dialogue",
    description:
      "Talent-to-camera selfie-style ad with cold-open dialogue and a locked voice / audio block.",
    skill: "veo-script-writing + hvg-flow",
  },
  {
    name: "VSL",
    aka: "Video Sales Letter / Pitch",
    description:
      "Long-form single-speaker pitch (40+ captioned lines) with per-line on-screen slides, run as hvg-flow Format B.",
    skill: "hvg-flow (Format B)",
  },
  {
    name: "Song Ad",
    aka: "music ad",
    description:
      "An ad script turned into a Suno v5 song — hook-driven and offer-forward (feeds the Veo claymation ad pipeline).",
    skill: "suno-songwriter",
  },
  {
    name: "3D Pixar / Claymation Ad",
    aka: "Pixar ad, claymation ad",
    description:
      "Animated Pixar / claymation-style ad with recurring 3D characters (Marcus, Robert, Max the Dog) — spans character ads, podcasts, and music videos; song forms ride a Suno track.",
    skill: "hvg-flow (Veo) + suno-songwriter",
  },
];

// ── Variation types: creative / market variations we test ───────────────────
export const variationTypes: CreativeEntry[] = [
  {
    name: "State Variation",
    aka: "50-state",
    description:
      "Per-state swaps ([STATE] / [CITY] / [RATE]) where the speaker names the state — swap 2-5 clips + text, no full re-edit.",
    skill: "hvg-flow + notion-state-batches · vsl-state-variations (VSL)",
    appliesTo: "Story Ad · Breaking News · VSL",
  },
  {
    name: "State-Batch Continuation",
    description:
      "Sequential Notion batches that close the remaining states after Batch 1 validates (batch count + cadence vary by creative).",
    skill: "notion-state-batches",
    appliesTo: "State creatives",
  },
  {
    name: "Hook Variation",
    aka: "A / B / C",
    description:
      "Multiple opening sequences on the same concept — different angle or inciting trigger — tested separately for performance.",
    skill: "story-beats",
    appliesTo: "Story Ad · Breaking News",
  },
  {
    name: "Inciting-Incident / Skit Swap",
    description:
      "Same root cause with a different visible crisis — car repo vs smoking engine vs tow chase vs locksmith.",
    skill: "story-beats",
    appliesTo: "Story Ad",
  },
  {
    name: "Reaction-Hook Variant",
    description:
      "An alternative presell hook using reaction / response footage, built as a named variant batch.",
    skill: "notion-state-batches",
    appliesTo: "Breaking News · Story Ad",
  },
  {
    name: "Calls vs Forms",
    aka: "offer / CTA swap",
    description:
      "Same skit re-cut for a form-fill lander vs a click-to-call lander; differs at Beat 5 + CTA wording.",
    skill: "veo-script-writing / iterate-creative",
    appliesTo: "All",
  },
  {
    name: "Vertical Pivot",
    aka: "Auto → Home → CC",
    description:
      "Reframe the same story for a different vertical — authority figure, mechanism, and rate floors re-anchored.",
    skill: "veo-script-writing / iterate-creative",
    appliesTo: "All",
  },
  {
    name: "Spanish Localization",
    aka: "en español",
    description:
      "Same skit with a Spanish dialogue track + Spanish overlays, run as a separate Forms lead type.",
    skill: "spanish-translation",
    appliesTo: "All dialogue creatives",
  },
  {
    name: "Aspect-Ratio Variant",
    aka: "9:16 / 16:9",
    description:
      "Same creative at multiple ratios — 9:16 organic / social, 16:9 paid / YouTube. Each state batch ships both.",
    skill: "hvg-flow",
    appliesTo: "All",
  },
  {
    name: "Rate / Savings-Floor",
    description:
      "Swap the specific rate / savings number in dialogue to test value props ($39 vs $29/mo Auto).",
    skill: "manual",
    appliesTo: "Story Ad · VSL · Breaking News",
  },
  {
    name: "Ending / CTA Swap",
    description:
      "Change how the story resolves or the CTA is framed — final beat, wording, or closing visual.",
    skill: "manual",
    appliesTo: "All",
  },
  {
    name: "Music / Audio-Bed Swap",
    description: "Replace the music bed over the same cut for different emotional coloring.",
    skill: "manual (Suno)",
    appliesTo: "All with audio",
  },
  {
    name: "Text-Overlay / Graphics Swap",
    description: "Different on-screen text, headlines, or CTAs over the same footage.",
    skill: "manual",
    appliesTo: "All video",
  },
];

// ── Building blocks: what each skill produces (the skill → output map) ───────
export const buildingBlocks: CreativeEntry[] = [
  {
    group: "Scripts & structure",
    name: "Story Beats",
    description: "Locked 6-beat skeleton with must-hit dialogue anchors, before the dialogue pass.",
    skill: "story-beats",
  },
  {
    group: "Scripts & structure",
    name: "Veo Script",
    description: "Numbered dialogue formatted for Veo — 6-8s lines, no dashes / caps, state tokens.",
    skill: "veo-script-writing",
  },
  {
    group: "Images & graphics",
    name: "Character Master",
    description:
      "Full-body neutral studio portrait — the locked identity reference for all downstream b-roll + Veo. Regenerate to recast.",
    skill: "hig-flow",
  },
  {
    group: "Images & graphics",
    name: "Camera-Roll B-Roll",
    description: "iPhone-camera-roll-style candids of characters, locked to script line numbers.",
    skill: "hig-flow",
  },
  {
    group: "Images & graphics",
    name: "Phone-Screen B-Roll",
    description: "Screen-only images (app UIs, alerts, posts) cut against reaction shots.",
    skill: "hig-flow",
  },
  {
    group: "Images & graphics",
    name: "Social-Proof Selfies",
    description: "Diverse multi-person candid selfies for social-proof beats.",
    skill: "hig-flow",
  },
  {
    group: "Images & graphics",
    name: "VSL Slides",
    description:
      "On-screen pitch slides carrying state rates / names / amounts; edit-swappable per state.",
    skill: "higgsfield-image-generation",
  },
  {
    group: "Images & graphics",
    name: "Lower-Thirds / Chyrons",
    description: "News-style lower thirds in the LATU News Canva brand kit.",
    skill: "breaking-news-story-ads (Canva)",
  },
  {
    group: "QC",
    name: "Audio QC",
    description: "ffmpeg physics + Whisper dialogue match + unexpected-music scan of a Veo batch.",
    skill: "audio-qc",
  },
  {
    group: "QC",
    name: "Visual QC",
    description: "5-frame filmstrips reviewed for background morphs, slide-text garble, hard cuts.",
    skill: "visual-qc",
  },
];

// ── Verticals: the markets we run creatives for ─────────────────────────────
export interface Vertical {
  name: string;
  offers?: string;
  aka?: string;
}

export interface VerticalGroup {
  group: string;
  items: Vertical[];
}

export const verticals: VerticalGroup[] = [
  {
    group: "Insurance",
    items: [
      { name: "Auto", offers: "Forms · Calls" },
      { name: "Home", offers: "Forms · Calls" },
      { name: "Concealed Carry" },
      { name: "Life", offers: "Forms" },
      { name: "Medicare" },
      { name: "Final Expense", offers: "Calls" },
    ],
  },
  {
    group: "Home Services",
    items: [
      { name: "HVAC" },
      { name: "Windows", offers: "Forms" },
      { name: "Bathroom", offers: "Forms" },
      { name: "Home Services" },
    ],
  },
  {
    group: "Financial / Legal",
    items: [
      { name: "Loans" },
      { name: "Debt Relief" },
      { name: "MVA", aka: "Motor Vehicle Accident", offers: "Forms" },
    ],
  },
];
