import { skills } from "@/content/skills";

const categoryLabels: Record<string, string> = {
  "gen-manual": "Asset generation — manual (you fire it)",
  "gen-auto": "Asset generation — automated (AGF · the mini)",
  writing: "Writing / script craft",
  image: "Image prompting + generation",
  video: "Video generation",
  utility: "Utility",
};

export default function SkillsSection() {
  const byCategory = skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">Skills</h2>
        <p className="text-muted mt-2 max-w-3xl">
          PFM's installed Claude skills. The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg ml-1">Code</span> badge means the skill needs Claude Code locally (Higgsfield CLI, Lucid Link, Python helpers). The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent ml-1">Cowork</span> badge means it works in pure chat mode and is included in the Cowork plugin.
        </p>
      </div>

      {/* Two surfaces — Claude Code vs Cowork */}
      <div className="my-8 rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
        <svg
          viewBox="0 0 470 360"
          className="w-full h-auto block"
          role="img"
          aria-label="PFM skills split across two surfaces. Claude Code on the editor's Mac runs every skill — pipeline, gen, QC, writing — but needs the local stack (Higgsfield CLI, Lucid Link, Python); it is the only place gens fire. Cowork is hosted chat that runs the six chat-mode writing skills (veo-script, breaking-news, nano-banana, story-beats, lc-to-video, suno), needs nothing to run, but has no gens and no terminal. The six writing skills run in both; pipeline, gen, and QC are Code-only."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="skA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            <marker id="skM" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#a1a1a1" /></marker>
          </defs>
          <rect x={175} y={14} width={120} height={40} rx={8} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={235} y={39} fill="#fafafa" fontSize={13} fontWeight="bold" textAnchor="middle">PFM skills</text>
          <line x1={212} y1={54} x2={118} y2={102} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#skA)" />
          <text x={150} y={82} fill="#FF6B35" fontSize={10} fontWeight="bold" textAnchor="middle">runs all</text>
          <line x1={258} y1={54} x2={352} y2={102} stroke="#a1a1a1" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#skM)" />
          <text x={324} y={82} fill="#a1a1a1" fontSize={10} textAnchor="middle">chat subset</text>
          <rect x={14} y={106} width={210} height={214} rx={12} fill="#3a1f15" stroke="#FF6B35" strokeWidth={2} />
          <text x={32} y={134} fill="#fafafa" fontSize={15} fontWeight="bold">Claude Code</text>
          <text x={32} y={152} fill="#FF6B35" fontSize={10.5}>editor&apos;s Mac</text>
          <line x1={32} y1={164} x2={206} y2={164} stroke="#FF6B35" strokeWidth={1} opacity={0.4} />
          <text x={32} y={190} fill="#e8e8e8" fontSize={11.5} fontWeight={600}>Runs every skill</text>
          <text x={32} y={208} fill="#cfcfcf" fontSize={10}>gen (auto + manual) · QC · writing</text>
          <text x={32} y={240} fill="#a1a1a1" fontSize={10.5}>Needs the local stack:</text>
          <text x={32} y={256} fill="#a1a1a1" fontSize={10}>Higgsfield CLI · Lucid</text>
          <text x={32} y={270} fill="#a1a1a1" fontSize={10}>Link · Python</text>
          <text x={32} y={302} fill="#34D399" fontSize={11} fontWeight="bold">✓ the only place gens fire</text>
          <rect x={246} y={106} width={210} height={214} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={264} y={134} fill="#fafafa" fontSize={15} fontWeight="bold">Cowork</text>
          <text x={264} y={152} fill="#a1a1a1" fontSize={10.5}>hosted chat</text>
          <line x1={264} y1={164} x2={438} y2={164} stroke="#2a2a2a" strokeWidth={1} />
          <text x={264} y={190} fill="#e8e8e8" fontSize={11.5} fontWeight={600}>The 6 chat-mode skills</text>
          <text x={264} y={212} fill="#a1a1a1" fontSize={9} fontFamily="monospace">veo-script · breaking-news</text>
          <text x={264} y={228} fill="#a1a1a1" fontSize={9} fontFamily="monospace">nano-banana · story-beats</text>
          <text x={264} y={244} fill="#a1a1a1" fontSize={9} fontFamily="monospace">lc-to-video · suno</text>
          <text x={264} y={272} fill="#a1a1a1" fontSize={10.5}>Needs nothing — pure chat</text>
          <text x={264} y={302} fill="#fafafa" fontSize={11} fontWeight="bold">✗ no gens, no terminal</text>
          <text x={235} y={346} fill="#a1a1a1" fontSize={10} textAnchor="middle">the 6 writing skills run in both — gen + QC are Code-only</text>
        </svg>
      </div>

      <div className="my-8 rounded-lg p-6 bg-glass-accent backdrop-blur-xl shadow-glow-accent ring-1 ring-accent/40">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">For Cowork</div>
            <h3 className="text-xl font-bold mb-2">Download the Cowork plugin</h3>
            <p className="text-sm text-muted leading-relaxed">
              Bundles all six chat-mode skills (everything marked{" "}
              <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono border border-accent text-accent">Cowork</span>
              ) into a single <code className="font-mono text-accent">.plugin</code> file. Upload once to your Cowork org and every team member sees the skills under <strong>Customize skills</strong>.
            </p>
          </div>
          <a
            href="/pfm-cowork-skills.plugin"
            download
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-bg font-semibold rounded hover:bg-accentHover transition-colors whitespace-nowrap"
          >
            ⬇ Download .plugin
          </a>
        </div>
      </div>

      <div className="space-y-3 my-8">
        {Object.entries(byCategory).map(([cat, group]) => (
          <details
            key={cat}
            className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 overflow-hidden group"
          >
            <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors marker:content-['']">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-accent drop-shadow-text-depth">{categoryLabels[cat] ?? cat}</h3>
                <span className="text-xs font-mono text-muted">{group.length} {group.length === 1 ? "skill" : "skills"}</span>
              </div>
              <span className="text-accent text-xl shrink-0 transition-transform group-open:rotate-90 leading-none">▸</span>
            </summary>
            <div className="px-5 pb-5 pt-2 space-y-3 border-t border-white/[0.08]">
              {group.map((s) => (
                <div key={s.name} className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:ring-border transition-all duration-200">
                  <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
                    <div>
                      <div className="text-lg font-semibold">{s.title}</div>
                      <div className="text-xs font-mono text-muted">{s.name}</div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap items-center">
                      {s.worksIn.includes("code") && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg">Code</span>
                      )}
                      {s.worksIn.includes("cowork") && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent">Cowork</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{s.description}</p>
                  <div className="mt-3">
                    <a
                      href={`/skills/${s.name}/SKILL.md`}
                      download
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors"
                    >
                      ⬇ Download SKILL.md
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="my-8 rounded-lg p-6 bg-glass-accent backdrop-blur-xl shadow-glow-accent ring-1 ring-accent/40">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Contribute</div>
        <h3 className="text-xl font-bold mb-2">Found a workflow worth a skill? Propose it.</h3>
        <p className="text-sm text-muted leading-relaxed">
          If you keep doing the same repeatable process in your projects, it should probably be a skill — no code required on your end. In your Claude Code session, just say{" "}
          <strong className="text-text">&quot;this should be a skill&quot;</strong> (or &quot;make this a skill&quot; / &quot;propose a skill&quot;), and Claude reconstructs the workflow from what you just did, asks a couple quick questions, and drops a proposal in the shared <code className="font-mono text-accent">Skill Proposals</code> folder on Lucid Link. Sam reviews it and builds the keepers into real skills for the whole team, <strong className="text-text">credited to you</strong>. That is the <code className="font-mono text-accent">propose-skill</code> skill.
        </p>
      </div>

      <p className="text-sm text-muted border-t border-border pt-4 mt-6">
        <strong className="text-text">Updating from a downloaded file:</strong> if you uploaded an individual SKILL.md to Cowork manually (instead of using the .plugin bundle), re-download from here whenever a skill ships an update on the changelog below — Cowork only holds your last-uploaded copy.
      </p>
    </section>
  );
}
