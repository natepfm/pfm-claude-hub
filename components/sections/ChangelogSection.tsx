import fs from "fs";
import path from "path";
import { marked } from "marked";

async function getChangelogHtml(): Promise<string> {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    return await marked.parse(md);
  } catch {
    return "<p>Changelog file missing — check content/CHANGELOG.md.</p>";
  }
}

export default async function ChangelogSection() {
  const html = await getChangelogHtml();
  return (
    <section id="changelog" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">What's new</div>
        <h2 className="text-3xl font-bold">Changelog</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Recent skill, script, and tooling changes. When you see something here that affects your machine, run the <strong>Update my skills</strong> command above.
        </p>
      </div>
      <div className="prose-pfm" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
