// PFM creative taxonomy — reconciled to the locked naming system (2026-07-14).
// A creative is no longer categorized by a hand-written title. Its identity is
// composed from structured properties, then rendered consistently for Notion,
// Lucid, timelines, filenames, and exports. Single skill source: pfm-naming.

export interface CreativeProperty {
  name: string;
  description: string;
  example: string;
  note?: string;
}

export interface CreativePropertyGroup {
  name: string;
  purpose: string;
  properties: CreativeProperty[];
}

export const propertyGroups: CreativePropertyGroup[] = [
  {
    name: "Identity",
    purpose: "What the creative is. These fields generate the name instead of hiding inside it.",
    properties: [
      {
        name: "Vertical · Lead",
        description: "The market and conversion lane. These lead the Full Name but drop from the VTM display title because the board already shows the chip.",
        example: "Auto · Forms",
      },
      {
        name: "Creative Type",
        description: "The format family. It may stack to two levels when one format sits on top of another.",
        example: "LC2VID → Podcast",
        note: "Maximum two type levels",
      },
      {
        name: "Concept",
        description: "The durable creative idea—the thing teammates actually recognize and search for.",
        example: "Car Chase",
      },
      {
        name: "Variant",
        description: "The tail that identifies what differs from the parent or sibling creative.",
        example: "B1 · Florida · New Host",
        note: "May represent batch, state, character, or another real differentiator",
      },
    ],
  },
  {
    name: "Distribution",
    purpose: "Where and how it runs. Every dimension is filterable without parsing a title.",
    properties: [
      {
        name: "Geo",
        description: "Broad or the named markets represented by the request.",
        example: "Broad · FL · TX · WA",
      },
      {
        name: "Platform",
        description: "The destination platform that determines presentation defaults.",
        example: "Facebook · Roku CTV",
      },
      {
        name: "Aspect",
        description: "The output frame. It renders only when it breaks the platform default.",
        example: "9:16 · 16:9",
      },
      {
        name: "Language",
        description: "The spoken/written language. English stays invisible because it is the default.",
        example: "English · Spanish",
      },
      {
        name: "Batch",
        description: "The production wave for a parent creative or scaled request.",
        example: "B1",
      },
      {
        name: "Runtime",
        description: "Expected finished duration, carried as data instead of prose.",
        example: "≈ 2:45",
      },
      {
        name: "Brand",
        description: "The brand when the creative is not intentionally brandless.",
        example: "SaveMaxAuto",
      },
    ],
  },
  {
    name: "Lineage & production",
    purpose: "What this request inherits, what is new, and what the body must deliver.",
    properties: [
      {
        name: "Parent Creative",
        description: "The explicit upstream creative. Derivatives no longer rely on a prose paragraph to explain their origin.",
        example: "Stories - Car Chase - Broad + State Breaking News - Batch 1",
      },
      {
        name: "Reuse map",
        description: "The Instructions footer separates inherited ingredients from the work created in this request.",
        example: "REUSE footage/story/narrator · NEW script/format",
      },
      {
        name: "Videos",
        description: "The committed output count. It must agree with the request body — and its rendering in the auto Full Name (\" - 8 Video(s)\") is a display artifact that never carries into any folder, timeline, or export name.",
        example: "8",
      },
    ],
  },
];

export interface NamingRendering {
  name: string;
  shape: string;
  example: string;
  lives: string;
}

export const namingRenderings: NamingRendering[] = [
  {
    name: "Full Name",
    shape: "Vertical - Lead - Creative Type - Concept - Variant ( - N Video(s), auto)",
    example: "Auto - Forms - LC2VID - Podcast - Car Chase - B1 - 8 Video(s)",
    lives: "Auto formula property on the request; board sorting only. The Video(s) tail is a display artifact — it never carries into any derived name",
  },
  {
    name: "Display name (request title)",
    shape: "[Platform - ] Creative Type - Concept - Variant",
    example: "LC2VID - Podcast - Car Chase - B1",
    lives: "The VTM page title; Vertical and Lead drop because the board chips already show them",
  },
  {
    name: "Project folder",
    shape: "MM.DD.YY - [Platform - ] Creative Type - Concept - Variant",
    example: "07.14.26 - LC2VID - Podcast - Car Chase - B1",
    lives: "Lucid — the date plus the display name. No Vertical/Lead, no VARIABLE: one folder holds all the project's timelines/states",
  },
  {
    name: "Timeline / Creative / Export",
    shape: "Vertical - Lead - [Platform] - VARIABLE - Creative Type - Concept - [tail] - MM.DD.YY",
    example: "Auto - Forms - Texas - LC2VID - Podcast - Car Chase - B1 - 07.14.26",
    lives: "DaVinci timelines, creative names, and export filenames — one rule for all three (exports render by timeline name). VARIABLE = this timeline's state or text hook (H1/H2/H3); the date ends the name",
  },
];

export const toolChainExamples = [
  { label: "VTM title", value: "LC2VID - Podcast - Car Chase - B1" },
  { label: "Lucid folder", value: "07.14.26 - LC2VID - Podcast - Car Chase - B1" },
  { label: "Timeline (Texas cut)", value: "Auto - Forms - Texas - LC2VID - Podcast - Car Chase - B1 - 07.14.26" },
  { label: "Export file", value: "Auto - Forms - Texas - LC2VID - Podcast - Car Chase - B1 - 07.14.26.mp4" },
];

export const namingRules = [
  {
    title: "Plain-hyphen separators",
    description: "Every segment joins with \" - \" (space-hyphen-space) — never squished dashes, never em dashes.",
  },
  {
    title: "Defaults stay invisible",
    description: "English, 9:16, Facebook, and Broad do not render unless they actually vary.",
  },
  {
    title: "Aspect follows platform",
    description: "Facebook assumes 9:16; Roku CTV assumes 16:9. Aspect appears only when it breaks the platform default.",
  },
  {
    title: "Creative Type stacks to two",
    description: "A format on top of a format renders as a two-part type, such as LC2VID → Podcast.",
  },
  {
    title: "VARIABLE names the per-timeline difference",
    description: "The state (each state-swap gets its own timeline) or the text hook (H1/H2/H3). Only this segment changes across a project's timelines, so families sort together in DaVinci.",
  },
  {
    title: "Timelines and exports end with the date",
    description: "MM.DD.YY closes every timeline/creative/export name, matching the project folder's date.",
  },
  {
    title: "The Video(s) tail never carries",
    description: "The auto Full Name appends \" - N Video(s)\" for the board — strip it from every folder, timeline, and export name.",
  },
];

export const instructionBlocks = [
  {
    name: "Properties · the spec",
    description: "The at-a-glance spec lives in the VTM properties (Creative Type, Concept, Geo, Platform, Aspect, Batch, …) shown as board columns — no spec table in the request body.",
  },
  {
    name: "Four callouts · in order",
    description: "Instructions → Assets → Examples → Copy. Examples always includes this creative's derived timeline/export name so the editor sees exactly what to name it. Copy holds ONE static numbered script.",
  },
  {
    name: "Parent + reuse map · derivatives",
    description: "Makes lineage explicit: Parent Creative relation plus what is reused (footage, story, narrator) versus new (script, format, or other requested work).",
  },
];
