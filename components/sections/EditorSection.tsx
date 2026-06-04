import { editorTools } from "@/content/editorTools";

export default function EditorSection() {
  return (
    <section id="editor" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold">Editor</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Claude&apos;s <span className="text-text font-medium">in-app editing tools</span> — these drive DaVinci Resolve (and the rest of the edit stack) to turn a finished gen batch into an actual edit, distinct from the prompt &amp; gen skills above. This list grows as we build the editing side out.
        </p>
      </div>

      {/* claude-editor pipeline diagram */}
      <div className="rounded-lg bg-surface-gradient-soft shadow-elev1 ring-1 ring-border/50 p-5 mb-8 overflow-x-auto">
        <div className="text-[11px] uppercase tracking-widest text-accent mb-3">The claude-editor pipeline</div>
        <svg
          viewBox="0 0 808 168"
          className="w-full h-auto block min-w-[560px]"
          role="img"
          aria-label="The claude-editor pipeline. Claude automates Import (folder to DaVinci pool) and Assemble (manifest to script-ordered stringout); you then do the creative edit on the master — speed, b-roll, captions; then Claude runs Propagate (duplicate the master across states) and Export (batch-render the finished cuts)."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="edPipe" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
          </defs>
          <line x1={160} y1={88} x2={188} y2={88} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#edPipe)" />
          <line x1={342} y1={88} x2={466} y2={88} stroke="#FF6B35" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#edPipe)" />
          <line x1={620} y1={88} x2={648} y2={88} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#edPipe)" />
          <text x={404} y={26} fill="#FF6B35" fontSize={11.5} fontWeight="bold" textAnchor="middle">✋ you edit the master</text>
          <text x={404} y={40} fill="#a1a1a1" fontSize={9.5} textAnchor="middle">speed · b-roll · captions</text>
          {[
            { x: 8, n: 1, name: "Import", d1: "folder of clips", d2: "→ DaVinci pool" },
            { x: 190, n: 2, name: "Assemble", d1: "manifest →", d2: "script stringout" },
            { x: 468, n: 3, name: "Propagate", d1: "duplicate master", d2: "across states" },
            { x: 650, n: 4, name: "Export", d1: "batch-render", d2: "finished cuts" },
          ].map((b) => (
            <g key={b.n}>
              <rect x={b.x} y={42} width={150} height={96} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
              <circle cx={b.x + 22} cy={66} r={11} fill="#FF6B35" />
              <text x={b.x + 22} y={70} fill="#0a0a0a" fontSize={12} fontWeight="bold" textAnchor="middle">{b.n}</text>
              <text x={b.x + 40} y={70} fill="#fafafa" fontSize={12.5} fontWeight="bold">{b.name}</text>
              <text x={b.x + 16} y={94} fill="#a1a1a1" fontSize={10.5}>{b.d1}</text>
              <text x={b.x + 16} y={110} fill="#a1a1a1" fontSize={10.5}>{b.d2}</text>
            </g>
          ))}
          <text x={404} y={160} fill="#a1a1a1" fontSize={10} textAnchor="middle">Claude automates each phase · you do the creative edit on the master in between</text>
        </svg>
      </div>

      <div className="space-y-3">
        {editorTools.map((t) => (
          <div key={t.name} className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:ring-border transition-all duration-200">
            <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
              <div>
                <div className="text-lg font-semibold">
                  {t.title}
                  {t.app && <span className="text-sm font-normal text-muted"> · {t.app}</span>}
                </div>
                <div className="text-xs font-mono text-muted">{t.name}</div>
              </div>
              <div className="flex gap-1.5 flex-wrap items-center">
                {t.status === "live" ? (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg">Live</span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent">
                    In dev · Sam&apos;s machine
                  </span>
                )}
                {t.phases?.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded text-xs font-mono border border-border text-muted">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted border-t border-border pt-4 mt-6">
        <strong className="text-text">In dev</strong> tools run on Sam&apos;s machine only for now — they need DaVinci Resolve with external scripting enabled. Each lands here as{" "}
        <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-accent text-bg">Live</span>{" "}
        (and in <em>Update my skills</em>) once it&apos;s rolled out to the team.
      </p>
    </section>
  );
}
