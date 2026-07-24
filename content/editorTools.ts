// PFM Editor tools — Claude's IN-APP editing helpers (DaVinci Resolve, etc.).
// Distinct from the gen/prompt Skills: these drive the editor's own apps to turn a finished
// gen batch into an edit. This list grows as we build the editing side out.
// "in-dev" = running on Sam's machine only, not yet distributed to the team.

export interface EditorTool {
  name: string;
  title: string;
  app?: string; // the app it drives, e.g. "DaVinci Resolve"
  description: string;
  status: "live" | "in-dev";
  phases?: string[]; // e.g. ["Import", "Assemble"]
}

export const editorTools: EditorTool[] = [
  {
    name: "claude-editor",
    title: "Claude Editor",
    app: "DaVinci Resolve",
    description:
      "Takes a finished podcast (LC-to-Video) gen batch to a script-ordered DaVinci timeline in seconds. Three additive phases inside your already-open project: Import (drops the folder under Master, Lucid-Link-safe), Assemble (builds the 9x16 stringout in script order into Creatives/Batch 1 — manifest take-picks honored), and Propagate (after you edit the master, duplicates it across the batch's other states + imports their clips, so all that's left is swapping the state clips), and Export (batch-renders the finished, captioned timelines with your saved render preset). Never creates, switches, or clears a project; leaves your other creatives untouched.",
    status: "in-dev",
    phases: ["Import", "Assemble", "Propagate", "Export"],
  },
  {
    name: "e.timeline",
    title: "Timeline Handoff",
    app: "DaVinci Resolve",
    description:
      "Moves a project between editors without timeline-hunting or relinking. The editor finishing a stage publishes their timeline as a .drt into the project's Creatives/Timelines/ (/e.timeline export — /e.export also does this automatically on every render); the editor picking it up runs /e.timeline import inside their own open DaVinci project and gets the timeline placed in a Finder-mirrored bin with every clip verified against the media pool. Because everyone mounts Lucid at the same /Volumes/ads path, the imported timeline relinks itself. Additive-only, never touches your other timelines; /e.timeline.export exists standalone for when you rendered manually but still owe the handoff artifact.",
    status: "live",
    phases: ["Export (.drt publish)", "Import (verified pickup)"],
  },
];
