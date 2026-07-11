import fs from "fs";
import path from "path";
import { marked } from "marked";

type Entry = { date: string; teaser: string; html: string };

async function getEntries(): Promise<Entry[]> {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    // Split into per-date entries. Each starts with `## YYYY-MM-DD` at line start.
    // chunks[0] is the file intro (redundant with this section's header) — skip it.
    const chunks = md.split(/^(?=## \d{4}-\d{2}-\d{2})/m).slice(1);
    return Promise.all(
      chunks.map(async (chunk) => {
        const m = chunk.match(/^## (\d{4}-\d{2}-\d{2})\s*\n?([\s\S]*)$/);
        const date = m ? m[1] : "entry";
        const body = m ? m[2] : chunk;
        const t = body.match(/^###\s+(.+?)\s*$/m); // first sub-heading = the teaser
        const teaser = t ? t[1].replace(/[`*]/g, "") : "";
        return { date, teaser, html: await marked.parse(body) };
      })
    );
  } catch {
    return [];
  }
}

export default async function ChangelogSection() {
  const entries = await getEntries();
  return (
    <section id="changelog" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep mb-1">What&apos;s new</div>
        <h2 className="text-3xl font-bold">Changelog</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Recent skill, script, and tooling changes — click a date to expand. When you see something that affects your machine, run the <strong>Update my skills</strong> command above.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted text-sm">Changelog file missing — check <code>content/CHANGELOG.md</code>.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <details
              key={e.date}
              open={i === 0}
              className="rounded-lg bg-surface shadow-elev1 ring-1 ring-ink overflow-hidden"
            >
              <summary className="cursor-pointer select-none px-4 py-3 flex items-baseline justify-between gap-4 hover:bg-surface/50 transition-colors marker:content-['']">
                <span className="font-mono text-sm font-semibold text-accent whitespace-nowrap">{e.date}</span>
                {e.teaser && (
                  <span className="text-sm text-muted truncate flex-1 text-right">{e.teaser}</span>
                )}
              </summary>
              <div
                className="prose-pfm px-4 pb-4 pt-2 border-t border-border"
                dangerouslySetInnerHTML={{ __html: e.html }}
              />
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
