import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
import Overview from "@/components/sections/Overview";
import FlowSection from "@/components/sections/FlowSection";
import SystemDiagram from "@/components/sections/SystemDiagram";
import SetupMac from "@/components/sections/SetupMac";
import SetupWindows from "@/components/sections/SetupWindows";
import SkillsSection from "@/components/sections/SkillsSection";
import AssetGenSection from "@/components/sections/AssetGenSection";
import EditorSection from "@/components/sections/EditorSection";
import ChangelogSection from "@/components/sections/ChangelogSection";

function getLatestChangelogEntry() {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    const match = md.match(/##\s+(\d{4}-\d{2}-\d{2})\s*\n([\s\S]*?)(?=\n## |\n*$)/);
    if (match) return { date: match[1], body: match[2].trim() };
  } catch {}
  return null;
}

export default function ClaudePage() {
  const latest = getLatestChangelogEntry();

  return (
    <div>
      <header className="mb-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Claude</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight drop-shadow-text-depth">
          <span className="text-accent drop-shadow-text-glow-accent">Claude</span> + Higgsfield
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Your AI production assistant. Everything for the Veo + Nano Banana pipeline — how to use it, first-time setup, the skills it runs, troubleshooting, and the changelog. Bookmark this page.
        </p>
      </header>

      {/* Hero: Update my skills — the main action editors use day-to-day */}
      <section id="update" className="my-8 scroll-mt-8">
        <div className="rounded-xl bg-glass-accent backdrop-blur-xl p-8 md:p-10 shadow-glow-accent ring-1 ring-accent/40">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔄</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text drop-shadow-text-depth">Update my skills</h2>
          </div>
          {latest && (
            <p className="text-muted mb-6 ml-1">
              <span className="inline-block px-2 py-0.5 mr-2 rounded text-xs font-mono bg-success text-bg">
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

      {/* The full flow — hero diagram + stage breakdown (first thing after Update) */}
      <FlowSection />

      {/* First-time setup CTA */}
      <section className="my-12">
        <h2 className="text-xl font-bold mb-2">🚀 First time setting up Claude? Start here</h2>
        <p className="text-muted text-sm mb-4">
          First-time install. Pick your OS and jump to the walkthrough below.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="#setup-mac"
            className="block rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/60 p-5 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
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
            className="block rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/60 p-5 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
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
      <SystemDiagram />
      <details id="setup-mac" className="my-12 rounded-xl bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 overflow-hidden group scroll-mt-8">
        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 hover:bg-surface/40 transition-colors">
          <div className="border-l-4 border-accent pl-4">
            <div className="text-xs uppercase tracking-widest text-accent mb-1">Onboarding · macOS</div>
            <div className="text-2xl font-bold">🍎 Setup on Mac</div>
            <div className="text-muted text-sm mt-1">~10–45 min · first-time install · click to expand</div>
          </div>
          <span className="text-accent text-2xl shrink-0 transition-transform group-open:rotate-90 leading-none">▸</span>
        </summary>
        <div className="px-6 pb-6">
          <SetupMac />
        </div>
      </details>
      <details id="setup-windows" className="my-12 rounded-xl bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 overflow-hidden group scroll-mt-8">
        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 hover:bg-surface/40 transition-colors">
          <div className="border-l-4 border-accent pl-4">
            <div className="text-xs uppercase tracking-widest text-accent mb-1">Onboarding · Windows</div>
            <div className="text-2xl font-bold">🪟 Setup on Windows</div>
            <div className="text-muted text-sm mt-1">~15–50 min · first-time install · click to expand</div>
          </div>
          <span className="text-accent text-2xl shrink-0 transition-transform group-open:rotate-90 leading-none">▸</span>
        </summary>
        <div className="px-6 pb-6">
          <SetupWindows />
        </div>
      </details>
      <SkillsSection />
      <AssetGenSection />
      <EditorSection />
      <ChangelogSection />
    </div>
  );
}
