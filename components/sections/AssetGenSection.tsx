const statuses = [
  { name: "Needs Staging", color: "#EAB308", desc: "A human still needs to prep it (resolve assets, fill the grid)." },
  { name: "Ready", color: "#22C55E", desc: "Armed — the office mini will claim and fire it." },
  { name: "Generating", color: "#3B82F6", desc: "In progress on the mini." },
  { name: "Generating (Local)", color: "#F97316", desc: "An editor is firing it manually in their own session." },
  { name: "Delivered", color: "#A855F7", desc: "Done — a folder-link comment lands on the request." },
  { name: "Failed", color: "#EF4444", desc: "Something broke — the reason is posted as a comment." },
];

export default function AssetGenSection() {
  return (
    <section id="asset-gen" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Workflow</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">Asset Generation — one system, two ways to fire</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Every gen runs the same engine, conventions, and delivery. The only difference is <strong className="text-text">who pulls the trigger</strong>: the always-on office mini fires it for you <span className="italic">(automated — the main flow)</span>, or you fire it yourself in your own session <span className="italic">(manual)</span>. Both land in the project folder with a Slack ping.
        </p>
      </div>

      {/* Fork graphic — one request, two lanes, one delivery */}
      <div className="my-8 rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 px-5 py-4 overflow-x-auto">
        <svg
          viewBox="0 0 820 200"
          className="w-full h-auto block min-w-[720px]"
          role="img"
          aria-label="One request forks into two lanes. Automated lane (the main flow): /stage request hands off to the office mini, which fires it. Manual lane: you run hvg-flow or hig-flow and fire it yourself in your own session. Both lanes converge to auto-QC and then Delivered, landing in the project folder plus a Slack ping."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="agf2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
          </defs>

          {/* lane labels */}
          <text x={250} y={16} fill="#FF6B35" fontSize={9.5} fontWeight={700} textAnchor="middle" letterSpacing="0.6">AUTOMATED · THE MAIN FLOW</text>
          <text x={250} y={196} fill="#a1a1a1" fontSize={9.5} fontWeight={700} textAnchor="middle" letterSpacing="0.6">MANUAL · YOU FIRE IT</text>

          {/* start: the request */}
          <rect x={10} y={78} width={116} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={68} y={104} fill="#fafafa" fontSize={11.5} fontWeight={600} textAnchor="middle">Notion request</text>
          {/* fan out */}
          <line x1={126} y1={92} x2={170} y2={54} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />
          <line x1={126} y1={108} x2={170} y2={146} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />

          {/* automated lane — top row (y center 50) */}
          <rect x={172} y={28} width={140} height={44} rx={9} fill="#FF6B35" />
          <text x={242} y={48} fill="#0a0a0a" fontSize={11.5} fontWeight="bold" textAnchor="middle">/stage request</text>
          <text x={242} y={62} fill="#0a0a0a" fontSize={8} textAnchor="middle">you, in Claude</text>
          <line x1={312} y1={50} x2={350} y2={50} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />
          <rect x={352} y={28} width={150} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={427} y={48} fill="#fafafa" fontSize={11.5} fontWeight={600} textAnchor="middle">🤖 Office mini</text>
          <text x={427} y={62} fill="#a1a1a1" fontSize={8} textAnchor="middle">fires it hands-off</text>

          {/* manual lane — bottom row (y center 150) */}
          <rect x={172} y={128} width={140} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={242} y={148} fill="#fafafa" fontSize={11} fontWeight={600} textAnchor="middle">hvg-flow / hig-flow</text>
          <text x={242} y={162} fill="#a1a1a1" fontSize={8} textAnchor="middle">video · images</text>
          <line x1={312} y1={150} x2={350} y2={150} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />
          <rect x={352} y={128} width={150} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={427} y={148} fill="#fafafa" fontSize={11.5} fontWeight={600} textAnchor="middle">💻 You fire it</text>
          <text x={427} y={162} fill="#a1a1a1" fontSize={8} textAnchor="middle">in your session</text>

          {/* converge to QC */}
          <line x1={502} y1={50} x2={560} y2={92} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />
          <line x1={502} y1={150} x2={560} y2={108} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />
          <rect x={562} y={78} width={88} height={44} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={606} y={104} fill="#fafafa" fontSize={11} fontWeight={600} textAnchor="middle">Auto-QC</text>
          <line x1={650} y1={100} x2={676} y2={100} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agf2)" />

          {/* delivered */}
          <rect x={678} y={78} width={132} height={44} rx={9} fill="#141414" stroke="#34D399" strokeWidth={1.5} />
          <text x={744} y={98} fill="#34D399" fontSize={11.5} fontWeight={600} textAnchor="middle">Delivered</text>
          <text x={744} y={112} fill="#a1a1a1" fontSize={8} textAnchor="middle">folder + Slack</text>
        </svg>
      </div>

      {/* The two lanes explained */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg bg-glass-accent backdrop-blur-xl ring-1 ring-accent/30 p-5">
          <div className="text-base font-semibold text-text mb-1">🤖 Automated — the main flow <span className="text-xs font-normal text-accent align-middle ml-1">mini rolling out</span></div>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Stage the request and the <strong className="text-text">office mini</strong> takes it from there — fires, QCs, delivers, hands-off. You don&apos;t sit and drive it. Best for volume, state batches, and overnight runs.
          </p>
          <ol className="space-y-1.5 text-sm text-text list-decimal list-inside marker:text-accent">
            <li>Paste the request link in Claude, say <span className="font-mono text-accent">stage request</span>.</li>
            <li>Claude resolves the assets, builds the folder, fills the 🤖 grid, sets <strong>Asset Gen → Ready</strong>.</li>
            <li>The mini claims <strong>Ready</strong> requests and runs the cycle.</li>
          </ol>
        </div>

        <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5">
          <div className="text-base font-semibold text-text mb-1">💻 Manual — you fire it</div>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Run it yourself in your own session — <em>not</em> sent to the mini. Same gen engine and conventions, but you drive it and watch it land. Best for one-offs, iterations, and anything you want eyes on.
          </p>
          <ul className="space-y-1.5 text-sm text-text">
            <li><span className="font-mono text-accent">hvg-flow</span> — Veo video gens (or just say <em>&quot;fire the gens&quot;</em>)</li>
            <li><span className="font-mono text-accent">hig-flow</span> — Nano Banana b-roll (or <em>&quot;fire the b-roll&quot;</em>)</li>
            <li className="text-muted text-xs pt-1">Staging can also fire locally — pick <strong className="text-text">Generate locally</strong> at the stage fork to run the staged batch in your session instead of the mini.</li>
          </ul>
        </div>
      </div>

      {/* Statuses (automated/staged side) */}
      <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5 mb-6">
        <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">The <span className="font-mono normal-case">Asset Gen</span> status on a request</div>
        <p className="text-xs text-muted mb-3">Set on staged requests so the mini knows what&apos;s armed. (Manual hvg/hig fires don&apos;t need it.)</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {statuses.map((s) => (
            <div key={s.name} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span><strong className="text-text">{s.name}</strong> <span className="text-muted">— {s.desc}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Watch it live */}
      <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5">
        <div className="text-base font-semibold text-text mb-1">📣 Watch it live</div>
        <p className="text-sm text-muted leading-relaxed">
          Every start, delivery, and failure posts to <strong className="text-text">#pfm-asset-gen</strong> in Slack — so you always know what&apos;s generating, what landed, and what needs a look. The mini works the queue in <strong className="text-text">Auto → Home → Loans</strong> priority.
        </p>
      </div>
    </section>
  );
}
