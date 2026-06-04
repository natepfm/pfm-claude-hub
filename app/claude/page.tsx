import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
import Overview from "@/components/sections/Overview";
import SystemDiagram from "@/components/sections/SystemDiagram";
import SetupMac from "@/components/sections/SetupMac";
import SetupWindows from "@/components/sections/SetupWindows";
import SkillsSection from "@/components/sections/SkillsSection";
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
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Claude</span> + Higgsfield
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Your AI production assistant. Everything for the Veo + Nano Banana pipeline — how to use it, first-time setup, the skills it runs, troubleshooting, and the changelog. Bookmark this page.
        </p>
      </header>

      {/* Pipeline ribbon — the whole flow at a glance */}
      <div className="mb-10 rounded-lg bg-surface-gradient-soft shadow-elev1 ring-1 ring-border/50 px-5 py-3 overflow-x-auto">
        <svg
          viewBox="0 0 820 72"
          className="w-full h-auto block min-w-[680px]"
          role="img"
          aria-label="The whole pipeline at a glance: a Notion request goes to Claude, which fires Veo plus b-roll, then a DaVinci edit, ending in delivered creative."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="ribA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
          </defs>
          <rect x={12} y={14} width={135} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={79.5} y={40} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Notion request</text>
          <line x1={149} y1={36} x2={175} y2={36} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ribA)" />
          <rect x={177} y={14} width={135} height={44} rx={9} fill="#FF6B35" />
          <text x={244.5} y={40} fill="#0a0a0a" fontSize={13} fontWeight="bold" textAnchor="middle">Claude</text>
          <line x1={314} y1={36} x2={340} y2={36} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ribA)" />
          <rect x={342} y={14} width={135} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={409.5} y={40} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Veo + b-roll</text>
          <line x1={479} y1={36} x2={505} y2={36} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ribA)" />
          <rect x={507} y={14} width={135} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={574.5} y={40} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">DaVinci edit</text>
          <line x1={644} y1={36} x2={670} y2={36} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ribA)" />
          <rect x={672} y={14} width={135} height={44} rx={9} fill="#141414" stroke="#FF6B35" strokeWidth={1.5} />
          <text x={739.5} y={40} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Delivered</text>
        </svg>
      </div>

      {/* Hero: Update my skills — the main action editors use day-to-day */}
      <section id="update" className="my-8 scroll-mt-8">
        <div className="rounded-xl bg-gradient-to-br from-accentMuted to-bg p-8 md:p-10 shadow-glow-accent ring-1 ring-accent/50">
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
      <details id="setup-mac" className="my-12 rounded-xl bg-surface-gradient-soft shadow-elev1 ring-1 ring-border/50 overflow-hidden group scroll-mt-8">
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
      <details id="setup-windows" className="my-12 rounded-xl bg-surface-gradient-soft shadow-elev1 ring-1 ring-border/50 overflow-hidden group scroll-mt-8">
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
      <EditorSection />
      <ChangelogSection />
    </div>
  );
}
