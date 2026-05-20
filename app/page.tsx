import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";
import Overview from "@/components/sections/Overview";
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

      {/* Hero: Update my skills — the main action editors use day-to-day */}
      <section id="update" className="my-8 scroll-mt-8">
        <div className="border-2 border-accent rounded-xl bg-gradient-to-br from-accentMuted to-bg p-8 md:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔄</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text">Update my skills</h2>
          </div>
          {latest && (
            <p className="text-muted mb-6 ml-1">
              <span className="inline-block px-2 py-0.5 mr-2 rounded text-xs font-mono bg-accent text-bg">
                NEW {latest.date}
              </span>
              {latest.body.split("\n").find((l) => l.startsWith("### "))?.replace("### ", "") || "Latest skill changes shipped."}
              {" · "}
              <a href="#changelog" className="text-accent hover:text-accentHover underline">
                see changelog
              </a>
            </p>
          )}
          <p className="text-text mb-5 ml-1">
            Run this whenever a new entry lands on the changelog. Pulls the latest skills + settings from Lucid Link.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-2 font-semibold">🍎 Mac · Terminal</div>
              <CopyBlock
                code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-2 font-semibold">🪟 Windows · Git Bash</div>
              <CopyBlock
                code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`}
              />
            </div>
          </div>

          <p className="text-sm text-muted mt-4 ml-1">
            <strong className="text-text">After:</strong> ⌘Q (Mac) or close-tray-and-reopen (Windows) on Claude Desktop to load the new skills.
          </p>
        </div>
      </section>

      {/* New editor CTA — smaller, secondary */}
      <section className="my-12">
        <h2 className="text-xl font-bold mb-2">🚀 New to the team? Start here</h2>
        <p className="text-muted text-sm mb-4">
          First-time setup. Pick your OS and jump to the walkthrough below.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="#setup-mac"
            className="block border border-border rounded-lg p-5 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🍎</div>
              <div>
                <div className="text-base font-semibold">Setup on Mac</div>
                <div className="text-xs text-muted">~10-45 min</div>
              </div>
            </div>
          </a>
          <a
            href="#setup-windows"
            className="block border border-border rounded-lg p-5 hover:border-accent hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🪟</div>
              <div>
                <div className="text-base font-semibold">Setup on Windows</div>
                <div className="text-xs text-muted">~15-50 min</div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Full sections */}
      <Overview />
      <SetupMac />
      <SetupWindows />
      <SkillsSection />
      <Troubleshooting />
      <ChangelogSection />
    </div>
  );
}
