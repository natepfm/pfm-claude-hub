import Link from "next/link";
import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";

function getLatestChangelogEntry() {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    const match = md.match(/##\s+(\d{4}-\d{2}-\d{2})\s*\n([\s\S]*?)(?=\n## |\n*$)/);
    if (match) return { date: match[1], body: match[2].trim() };
  } catch {}
  return null;
}

export default function Home() {
  const latest = getLatestChangelogEntry();

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-5xl font-bold mb-3 tracking-tight">
          PFM <span className="text-accent">Claude</span> Hub
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Setup, updates, and reference for Power Fox Media's Claude + Higgsfield pipeline. Bookmark this page.
        </p>
      </header>

      {latest && (
        <Callout type="info" title={`Latest skill update — ${latest.date}`}>
          <div className="text-muted">
            {latest.body.split("\n").find((l) => l.startsWith("### "))?.replace("### ", "") || "See changelog for details."}
            {" · "}
            <Link href="/changelog" className="text-accent hover:text-accentHover underline">
              full changelog
            </Link>
          </div>
        </Callout>
      )}

      <section className="my-10">
        <h2 className="text-2xl font-bold mb-2">🚀 New editor? Start here</h2>
        <p className="text-muted mb-4">
          Pick your operating system and follow the setup walkthrough.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/setup/mac"
            className="block border border-border rounded-lg p-6 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="text-2xl mb-2">🍎</div>
            <div className="text-xl font-semibold mb-1">Setup on Mac</div>
            <div className="text-sm text-muted">Homebrew, Git, Node, Higgsfield CLI, PFM skills — ~10-45 min.</div>
          </Link>
          <Link
            href="/setup/windows"
            className="block border border-border rounded-lg p-6 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="text-2xl mb-2">🪟</div>
            <div className="text-xl font-semibold mb-1">Setup on Windows</div>
            <div className="text-sm text-muted">Git Bash, Node, Python, Higgsfield CLI, PFM skills — ~15-50 min.</div>
          </Link>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-2">🔄 Update my skills</h2>
        <p className="text-muted mb-2">
          When you see a new entry on the{" "}
          <Link href="/changelog" className="text-accent hover:text-accentHover underline">
            changelog
          </Link>
          , run this in Terminal (Mac) or Git Bash (Windows) to pull the latest:
        </p>
        <CopyBlock
          label="Mac"
          code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`}
        />
        <CopyBlock
          label="Windows (Git Bash, drive letter may vary)"
          code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`}
        />
        <p className="text-sm text-muted mt-2">
          Then ⌘Q (Mac) or close-tray-and-reopen (Windows) on Claude Desktop to pick up the new skills.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-2">🔑 Switch Higgsfield account</h2>
        <p className="text-muted mb-2">
          When the team moves to a new Higgsfield workspace, run this:
        </p>
        <CopyBlock
          label="Mac"
          code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`}
        />
        <CopyBlock
          label="Windows (Git Bash)"
          code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`}
        />
        <p className="text-sm text-muted mt-2">
          Then also re-authenticate the Higgsfield MCP in Claude Desktop (Settings → Connectors → Higgsfield → Disconnect / Reconnect).
        </p>
      </section>

      <section className="my-12 grid md:grid-cols-3 gap-4">
        <Link
          href="/skills"
          className="block border border-border rounded-lg p-5 hover:border-accent hover:bg-surface transition-colors"
        >
          <div className="text-lg font-semibold mb-1">📦 Skills</div>
          <div className="text-sm text-muted">All PFM skills + which work in Cowork vs Code-only.</div>
        </Link>
        <Link
          href="/troubleshooting"
          className="block border border-border rounded-lg p-5 hover:border-accent hover:bg-surface transition-colors"
        >
          <div className="text-lg font-semibold mb-1">🛠 Troubleshooting</div>
          <div className="text-sm text-muted">Smart-quote bite, workspace foot-guns, Lucid Link sync.</div>
        </Link>
        <Link
          href="/changelog"
          className="block border border-border rounded-lg p-5 hover:border-accent hover:bg-surface transition-colors"
        >
          <div className="text-lg font-semibold mb-1">📝 Changelog</div>
          <div className="text-sm text-muted">What's shipped recently.</div>
        </Link>
      </section>
    </div>
  );
}
