import fs from "fs";
import path from "path";
import CopyBlock from "@/components/CopyBlock";
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
      <header className="mb-14 pt-2">
        <div className="inline-flex items-center gap-2 border border-ink bg-surface px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-6">
          <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
          Editors Hub · Claude
        </div>
        <h1 className="font-heading font-bold text-4xl md:text-6xl text-text leading-[1.08]">
          Claude + <em>Higgsfield.</em>
        </h1>
        <p className="text-muted text-lg max-w-2xl mt-5">
          Your AI production assistant. Everything for the Veo + Nano Banana pipeline — how to use it, first-time setup, the skills it runs, troubleshooting, and the changelog. Bookmark this page.
        </p>
      </header>

      {/* Account migration banner — time-sensitive; remove once everyone has switched */}
      <section className="my-8">
        <div className="bg-accentMuted p-6 md:p-8 border border-ink shadow-glow-accent">
          <div className="flex items-start gap-3">
            <span className="text-4xl leading-none">⚡</span>
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-text">Switch to your own Claude account</h2>
              <p className="text-muted mt-2 max-w-2xl">
                We&apos;re retiring the shared login. Move to your own Team seat under your{" "}
                <strong className="text-text">@powerfoxmedia.com</strong> email — your skills, automations, and files
                all carry over. It&apos;s just a login swap + reconnecting a couple connectors (~10 min, one time).
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                <a
                  href="/PFM-Editor-SOP-Claude-Team-Switch.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-accent text-white font-mono text-xs font-medium uppercase tracking-[0.08em] px-5 py-3 border border-ink shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  ⬇ Download the switch SOP (PDF)
                </a>
                <span className="text-sm text-muted">
                  Accept your invite → sign out → sign in with your email → reconnect → smoke test.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero: Update my skills — the main action editors use day-to-day */}
      <section id="update" className="my-8 scroll-mt-8">
        <div className="bg-accentMuted p-8 md:p-10 border border-ink shadow-glow-accent">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔄</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text">Update my skills</h2>
          </div>
          {latest && (
            <p className="text-muted mb-6 ml-1">
              <span className="inline-block px-2 py-0.5 mr-2 rounded text-xs font-mono bg-success text-white border border-ink">
                NEW {latest.date}
              </span>
              {latest.body.split("\n").find((l) => l.startsWith("### "))?.replace("### ", "") || "Latest skill changes shipped."}
              {" · "}
              <a href="#changelog" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
                see changelog
              </a>
            </p>
          )}
          <p className="text-text mb-5 ml-1">
            Run this whenever a new entry lands on the changelog. Pulls the latest skills + settings from Lucid Link.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep mb-2 font-semibold">🍎 Mac · Terminal</div>
              <CopyBlock
                code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`}
              />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep mb-2 font-semibold">🪟 Windows · Git Bash</div>
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
        <h2 className="font-heading font-bold text-xl mb-2">🚀 First time setting up Claude? Start here</h2>
        <p className="text-muted text-sm mb-4">
          First-time install. Pick your OS and jump to the walkthrough below.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="#setup-mac"
            className="block rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-ink p-5 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
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
            className="block rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-ink p-5 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
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
      <SystemDiagram />
      <details id="setup-mac" className="my-12 rounded-xl bg-surface shadow-elev1 ring-1 ring-ink overflow-hidden group scroll-mt-8">
        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 hover:bg-bg transition-colors">
          <div className="border-l-4 border-accent pl-4">
            <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep mb-1">Onboarding · macOS</div>
            <div className="text-2xl font-bold">🍎 Setup on Mac</div>
            <div className="text-muted text-sm mt-1">~10–45 min · first-time install · click to expand</div>
          </div>
          <span className="text-accent text-2xl shrink-0 transition-transform group-open:rotate-90 leading-none">▸</span>
        </summary>
        <div className="px-6 pb-6">
          <SetupMac />
        </div>
      </details>
      <details id="setup-windows" className="my-12 rounded-xl bg-surface shadow-elev1 ring-1 ring-ink overflow-hidden group scroll-mt-8">
        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-6 hover:bg-bg transition-colors">
          <div className="border-l-4 border-accent pl-4">
            <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep mb-1">Onboarding · Windows</div>
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
