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
      <header
        className="relative mb-12 overflow-hidden rounded-2xl ring-1 ring-white/10 px-6 py-12 md:px-10 md:py-16"
        style={{ background: "linear-gradient(180deg, #18110a 0%, #110b07 58%, #0a0a0a 100%)" }}
      >
        {/* Memphis confetti */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <svg className="absolute top-8 right-10 md:right-16" width="78" height="78"><circle cx="39" cy="39" r="32" fill="none" stroke="#2DD4BF" strokeWidth="7" /></svg>
          <svg className="absolute top-28 right-28 md:right-40" width="92" height="34"><path d="M3,4 L19,30 L35,4 L51,30 L67,4 L83,30" stroke="#FDE047" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
          <svg className="absolute top-6 right-44 md:right-64" width="64" height="64"><polygon points="32,5 59,55 5,55" fill="none" stroke="#FF6B35" strokeWidth="6" /></svg>
          <svg className="absolute bottom-8 right-12 md:right-24" width="96" height="40"><path d="M3,30 Q18,3 33,20 T63,16 T93,20" stroke="#F472B6" strokeWidth="7" fill="none" strokeLinecap="round" /></svg>
        </div>

        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.3em] mb-4 font-extrabold" style={{ color: "#2DD4BF" }}>
            Editors Hub · Claude
          </div>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight italic"
            style={{
              color: "#FF6B35",
              textShadow:
                "1px 1px 0 #c25125, 2px 2px 0 #b34a22, 3px 3px 0 #a34320, 4px 4px 0 #8a3819, 5px 5px 0 #7a3216, 6px 6px 0 #6b2c13, 7px 7px 0 #561f0d, 9px 9px 0 #0a0a0a",
            }}
          >
            Claude + Higgsfield
          </h1>
          <p className="text-muted text-lg max-w-2xl mt-6">
            Your AI production assistant. Everything for the Veo + Nano Banana pipeline — how to use it, first-time setup, the skills it runs, troubleshooting, and the changelog. Bookmark this page.
          </p>
        </div>
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
