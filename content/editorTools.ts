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
      "Takes a finished podcast (LC-to-Video) gen batch to a script-ordered DaVinci timeline in seconds. Two additive phases that run inside your already-open project: Import (drops the project folder under Master, Lucid-Link-safe) then Assemble (builds the 9x16 stringout in script order — manifest take-picks honored — into the Creatives bin). It never creates, switches, or clears a project, and leaves your other creatives untouched. Then you take over: flow tweaks, speed, b-roll, captions.",
    status: "in-dev",
    phases: ["Import", "Assemble"],
  },
];
