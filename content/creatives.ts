// PFM creative taxonomy — reconciled to the locked Notion overhaul (2026-07-11).
// A creative is no longer categorized by a hand-written title. Its identity is
// composed from structured properties, then rendered consistently for Notion,
// Lucid, timelines, filenames, and exports.

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
        description: "The committed output count. It must agree with the spec table and the request body.",
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
    shape: "Vertical·Lead - Creative Type - Concept - Variant",
    example: "Auto·Forms - LC2VID - Podcast - Car Chase - B1",
    lives: "Notion property under Status; carries the complete identity into the project system",
  },
  {
    name: "Display name",
    shape: "Creative Type - Concept - Variant",
    example: "LC2VID - Podcast - Car Chase - B1",
    lives: "VTM title; Vertical and Lead drop because the board chips already show them",
  },
  {
    name: "Compact code",
    shape: "Every rendered part abbreviated",
    example: "AU-F-LC2VID-POD-CARCHASE-B1",
    lives: "DaVinci timelines, filenames, and exports",
  },
];

export const toolChainExamples = [
  { label: "VTM title", value: "LC2VID - Podcast - Car Chase - B1" },
  { label: "Lucid folder", value: "07.11.26 - LC2VID - Podcast - Car Chase - B1" },
  { label: "Timeline / export", value: "AU-F-LC2VID-POD-CARCHASE-B1" },
];

export const namingRules = [
  {
    title: "Plain-hyphen separators",
    description: "The convention keeps the familiar separator pattern; the overhaul changes the source, not the basic reading rhythm.",
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
    title: "The variant tail names the difference",
    description: "Batch, state, character, vertical, or another differentiator may occupy the tail—only what truly varies should render.",
  },
];

export const instructionBlocks = [
  {
    name: "Spec table · top",
    description: "Videos, Platform, Aspect, Vertical, Geo, Runtime, Model, and Parent Creative at a glance. The video count must agree everywhere.",
  },
  {
    name: "Existing prose · middle",
    description: "The creative brief remains familiar. Editors still read Instructions → Assets → Examples → Copy in the same order.",
  },
  {
    name: "Parent + reuse map · bottom",
    description: "Makes lineage explicit: what is reused (footage, story, narrator) versus new (script, format, or other requested work).",
  },
];
