import fs from "fs";
import path from "path";
import { marked } from "marked";

// Show the most recent N date entries on the page; collapse the rest behind a `<details>`.
const RECENT_ENTRY_COUNT = 5;

type ChangelogParts = {
  intro: string;        // rendered HTML for the header / intro paragraph
  recent: string;       // rendered HTML for the top N date entries
  archived: string;     // rendered HTML for everything older (may be empty)
  archivedCount: number;
};

async function getChangelogParts(): Promise<ChangelogParts> {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");

    // Split into intro + per-date entries. Entries start with `## YYYY-MM-DD` at line start.
    const chunks = md.split(/^(?=## \d{4}-\d{2}-\d{2})/m);
    const intro = chunks[0] || "";
    const dateEntries = chunks.slice(1);

    const recent = dateEntries.slice(0, RECENT_ENTRY_COUNT).join("");
    const archived = dateEntries.slice(RECENT_ENTRY_COUNT).join("");
    const archivedCount = Math.max(0, dateEntries.length - RECENT_ENTRY_COUNT);

    return {
      intro: await marked.parse(intro),
      recent: await marked.parse(recent),
      archived: archived ? await marked.parse(archived) : "",
      archivedCount,
    };
  } catch {
    return {
      intro: "<p>Changelog file missing — check content/CHANGELOG.md.</p>",
      recent: "",
      archived: "",
      archivedCount: 0,
    };
  }
}

export default async function ChangelogSection() {
  const { intro, recent, archived, archivedCount } = await getChangelogParts();
  return (
    <section id="changelog" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">What's new</div>
        <h2 className="text-3xl font-bold">Changelog</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Recent skill, script, and tooling changes. When you see something here that affects your machine, run the <strong>Update my skills</strong> command above.
        </p>
      </div>
      <div className="prose-pfm" dangerouslySetInnerHTML={{ __html: intro + recent }} />
      {archived && (
        <details className="mt-8 border border-border rounded-lg p-5 bg-surface/30">
          <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text select-none">
            Show {archivedCount} older {archivedCount === 1 ? "entry" : "entries"} ▾
          </summary>
          <div className="prose-pfm mt-6 pt-4 border-t border-border" dangerouslySetInnerHTML={{ __html: archived }} />
        </details>
      )}
    </section>
  );
}
