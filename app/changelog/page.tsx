import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";

export const metadata = { title: "Changelog — PFM Claude Hub" };

async function getChangelogHtml(): Promise<string> {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    const processed = await remark().use(remarkHtml).process(md);
    return processed.toString();
  } catch {
    return "<p>Changelog file missing — check content/CHANGELOG.md.</p>";
  }
}

export default async function ChangelogPage() {
  const html = await getChangelogHtml();
  return (
    <div>
      <header className="mb-8">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">What's new</div>
        <h1 className="text-4xl font-bold mb-3">Changelog</h1>
        <p className="text-muted max-w-2xl">
          Recent skill, script, and tooling changes. When you see something here that affects your machine, run the <strong>Update my skills</strong> command from the Home page.
        </p>
      </header>
      <div className="prose-pfm" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
