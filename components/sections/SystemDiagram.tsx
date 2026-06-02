import type { ReactNode } from "react";

function CmdGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted mb-1.5">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CmdRow({ phrase, note }: { phrase: string; note: string }) {
  return (
    <div className="leading-snug">
      <code className="font-mono text-xs text-accent">&quot;{phrase}&quot;</code>
      <span className="text-[10px] text-muted"> — {note}</span>
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <section id="how-it-works" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold">How the system works</h2>
        <p className="text-muted mt-2 max-w-3xl">
          One shared skill system across two Claude accounts, bridged by Lucid Link. Skills flow{" "}
          <em className="text-text not-italic">out</em> to the team; the repeatable workflows editors
          discover flow <em className="text-text not-italic">back in</em> — a flywheel that gets better
          the more everyone uses it.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
        {/* LEFT — the diagram */}
        <div className="border border-border rounded-lg bg-bg p-5">
          <svg
            viewBox="0 0 380 472"
            className="w-full h-auto block max-w-md mx-auto"
            role="img"
            aria-label="Cycle diagram: skills are built on the master account, synced out through Lucid Link, and pulled by editors; the workflows editors propose loop back through Lucid Link to the master account to become new skills."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="pfmArrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" />
              </marker>
            </defs>

            {/* loop-back arc: Editor → Master, up the right side */}
            <path d="M 264,422 C 356,414 356,54 268,48" fill="none" stroke="#FF6B35" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#pfmArrow)" />
            <text x="361" y="243" fill="#FF6B35" fontSize="17" textAnchor="middle">↺</text>

            {/* forward connectors */}
            <line x1="144" y1="94" x2="144" y2="196" stroke="#FF6B35" strokeWidth="2" markerEnd="url(#pfmArrow)" />
            <line x1="144" y1="286" x2="144" y2="388" stroke="#FF6B35" strokeWidth="2" markerEnd="url(#pfmArrow)" />

            {/* edge labels (rect masks the line) */}
            <rect x="108" y="135" width="72" height="18" rx="4" fill="#0a0a0a" />
            <text x="144" y="148" fill="#a1a1a1" fontSize="10.5" textAnchor="middle" fontFamily="monospace">skills out</text>
            <rect x="104" y="328" width="80" height="18" rx="4" fill="#0a0a0a" />
            <text x="144" y="341" fill="#a1a1a1" fontSize="10.5" textAnchor="middle" fontFamily="monospace">update.sh</text>

            {/* Node 1 — Master */}
            <rect x="24" y="22" width="240" height="72" rx="12" fill="#141414" stroke="#2a2a2a" strokeWidth="1.5" />
            <circle cx="48" cy="50" r="11" fill="#FF6B35" />
            <text x="48" y="54" fill="#0a0a0a" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
            <text x="68" y="52" fill="#FF6B35" fontSize="12.5" fontWeight="bold" letterSpacing="0.5">MASTER ACCOUNT</text>
            <text x="68" y="72" fill="#a1a1a1" fontSize="11">builds + maintains every skill</text>

            {/* Node 2 — Lucid Link (the bridge) */}
            <rect x="24" y="202" width="240" height="82" rx="12" fill="#3a1f15" stroke="#FF6B35" strokeWidth="2" />
            <circle cx="48" cy="230" r="11" fill="#FF6B35" />
            <text x="48" y="234" fill="#0a0a0a" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
            <text x="68" y="232" fill="#FF6B35" fontSize="12.5" fontWeight="bold" letterSpacing="0.5">LUCID LINK</text>
            <text x="68" y="252" fill="#fafafa" fontSize="11">the shared bridge</text>
            <text x="68" y="270" fill="#a1a1a1" fontSize="10.5" fontFamily="monospace">skills/ · Skill Proposals/</text>

            {/* Node 3 — Editors */}
            <rect x="24" y="392" width="240" height="72" rx="12" fill="#141414" stroke="#2a2a2a" strokeWidth="1.5" />
            <circle cx="48" cy="420" r="11" fill="#FF6B35" />
            <text x="48" y="424" fill="#0a0a0a" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
            <text x="68" y="422" fill="#FF6B35" fontSize="12.5" fontWeight="bold" letterSpacing="0.5">EDITOR ACCOUNT</text>
            <text x="68" y="442" fill="#a1a1a1" fontSize="11">run the flows · deliver assets</text>
          </svg>

          <p className="text-xs text-muted mt-3 leading-relaxed text-center">
            <span className="text-accent">↺</span>{" "}
            <strong className="text-text">The flywheel:</strong> editors propose workflows with{" "}
            <code className="font-mono text-accent">propose-skill</code> → built on the master account →
            shipped back to everyone, credited to the editor.
          </p>
        </div>

        {/* RIGHT — command cheat-sheet */}
        <aside className="mt-6 lg:mt-0 border border-border rounded-lg bg-bg p-5">
          <div className="text-xs uppercase tracking-widest text-accent mb-1">Quick start</div>
          <h3 className="text-lg font-bold mb-3">Say this to start a skill</h3>
          <div className="space-y-4">
            <CmdGroup title="Generate">
              <CmdRow phrase="run the HVG flow" note="Veo video batch" />
              <CmdRow phrase="run the HIG flow" note="b-roll images" />
              <CmdRow phrase="run the VSL for [state]" note="VSL slides + clips" />
              <CmdRow phrase="do the [state] pixar music video" note="Pixar assets" />
            </CmdGroup>
            <CmdGroup title="Write">
              <CmdRow phrase="write a Veo script" note="story-ad script" />
              <CmdRow phrase="convert this LC to a podcast" note="LC → podcast" />
              <CmdRow phrase="beat this out" note="story beats" />
            </CmdGroup>
            <CmdGroup title="Check">
              <CmdRow phrase="QC the clips" note="audio QC" />
              <CmdRow phrase="run visual QC" note="frame QC" />
            </CmdGroup>
            <CmdGroup title="Deliver">
              <CmdRow phrase="post the assets" note="delivery comment" />
              <CmdRow phrase="report this, mark done" note="turn-in → Done" />
            </CmdGroup>
            <CmdGroup title="Contribute">
              <CmdRow phrase="this should be a skill" note="propose-skill" />
            </CmdGroup>
          </div>
          <p className="text-[11px] text-muted mt-4">
            Full list + descriptions in{" "}
            <a href="#skills" className="text-accent hover:text-accentHover underline">Skills</a> below.
          </p>
        </aside>
      </div>

      <p className="text-xs text-muted mt-6 text-center">
        📖 It&apos;s all documented here on <strong className="text-text">the Hub</strong> — reference,
        changelog &amp; downloads.
      </p>
    </section>
  );
}
