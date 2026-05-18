import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";
import SetupMac from "@/components/sections/SetupMac";
import SetupWindows from "@/components/sections/SetupWindows";
import SkillsSection from "@/components/sections/SkillsSection";
import Troubleshooting from "@/components/sections/Troubleshooting";
import ChangelogSection from "@/components/sections/ChangelogSection";

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
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          PFM <span className="text-accent">Claude</span> Hub
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          The single source of truth for Power Fox Media's Claude + Higgsfield pipeline. Setup, updates, skills, troubleshooting, and changelog — all in one place. Bookmark this page.
        </p>
      </header>

      {latest && (
        <Callout type="info" title={`Latest skill update — ${latest.date}`}>
          <div className="text-muted">
            {latest.body.split("\n").find((l) => l.startsWith("### "))?.replace("### ", "") || "See changelog below."}
            {" · "}
            <a href="#changelog" className="text-accent hover:text-accentHover underline">
              jump to changelog
            </a>
          </div>
        </Callout>
      )}

      {/* Quick actions */}
      <section id="quick" className="my-12 scroll-mt-8">
        <h2 className="text-2xl font-bold mb-2">⚡ Quick actions</h2>
        <p className="text-muted mb-4">Most-used commands. Copy → paste in Terminal (Mac) or Git Bash (Windows).</p>

        <div className="my-6">
          <h3 className="text-lg font-semibold mb-2">🔄 Update my skills</h3>
          <p className="text-muted text-sm mb-2">
            Run after any new <a href="#changelog" className="text-accent hover:text-accentHover underline">changelog</a> entry to pull the latest skills + settings.
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
            Then ⌘Q (Mac) or close-tray-and-reopen (Windows) on Claude Desktop to load the new skills.
          </p>
        </div>
      </section>

      {/* New editor CTA */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-2">🚀 New editor? Start here</h2>
        <p className="text-muted mb-4">
          Pick your operating system and jump to the setup walkthrough below.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="#setup-mac"
            className="block border border-border rounded-lg p-6 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="text-2xl mb-2">🍎</div>
            <div className="text-xl font-semibold mb-1">Setup on Mac</div>
            <div className="text-sm text-muted">Homebrew, Git, Node, Higgsfield CLI, PFM skills — ~10-45 min.</div>
          </a>
          <a
            href="#setup-windows"
            className="block border border-border rounded-lg p-6 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="text-2xl mb-2">🪟</div>
            <div className="text-xl font-semibold mb-1">Setup on Windows</div>
            <div className="text-sm text-muted">Git Bash, Node, Python, Higgsfield CLI, PFM skills — ~15-50 min.</div>
          </a>
        </div>
      </section>

      {/* Full sections */}
      <SetupMac />
      <SetupWindows />
      <SkillsSection />
      <Troubleshooting />
      <ChangelogSection />
    </div>
  );
}
