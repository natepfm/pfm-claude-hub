const statuses = [
  { name: "Needs Staging", color: "#EAB308", desc: "A human still needs to prep it (resolve assets, fill the grid)." },
  { name: "Ready", color: "#22C55E", desc: "Armed — the office mini will claim and fire it." },
  { name: "Generating", color: "#3B82F6", desc: "In progress on the mini." },
  { name: "Generating (Local)", color: "#F97316", desc: "An editor is firing it in their own session." },
  { name: "Delivered", color: "#A855F7", desc: "Done — a folder-link comment lands on the request." },
  { name: "Failed", color: "#EF4444", desc: "Something broke — the reason is posted as a comment." },
];

export default function AssetGenSection() {
  return (
    <section id="asset-gen" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Workflow</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">Asset Gen Flow (AGF)</h2>
        <p className="text-muted mt-2 max-w-3xl">
          The pipeline for turning a Notion request into generated assets without hand-driving every fire. You <strong className="text-text">stage</strong> a request — Claude preps it — then it fires, either in your own session now or handed off to the always-on office mini (rolling out). Finished assets land in the project folder with a Slack ping.
        </p>
      </div>

      {/* Flow graphic */}
      <div className="my-8 rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 px-5 py-4 overflow-x-auto">
        <svg
          viewBox="0 0 815 104"
          className="w-full h-auto block min-w-[700px]"
          role="img"
          aria-label="The Asset Gen Flow: a Notion request is staged with the /stage request command, which sets Asset Gen to Ready, then it fires (in your own session now, or the office mini soon), runs auto-QC, and is delivered to the project folder plus a Slack ping."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="agfA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
          </defs>

          {/* 1. Notion request */}
          <rect x={12} y={30} width={135} height={50} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={79.5} y={59} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Notion request</text>
          <line x1={147} y1={55} x2={171} y2={55} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agfA)" />

          {/* 2. /stage request (the action) */}
          <rect x={173} y={30} width={135} height={50} rx={9} fill="#FF6B35" />
          <text x={240.5} y={52} fill="#0a0a0a" fontSize={12} fontWeight="bold" textAnchor="middle">/stage request</text>
          <text x={240.5} y={67} fill="#0a0a0a" fontSize={8.5} textAnchor="middle">you, in Claude</text>
          <line x1={308} y1={55} x2={332} y2={55} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agfA)" />

          {/* 3. Asset Gen: Ready */}
          <rect x={334} y={30} width={135} height={50} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={401.5} y={52} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Asset Gen</text>
          <text x={401.5} y={67} fill="#22C55E" fontSize={10} fontWeight={600} textAnchor="middle">Ready</text>
          <line x1={469} y1={55} x2={493} y2={55} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agfA)" />

          {/* 4. Fire */}
          <rect x={495} y={30} width={135} height={50} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={562.5} y={52} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Fire</text>
          <text x={562.5} y={67} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">your session · or the mini</text>
          <text x={642} y={46} fill="#a1a1a1" fontSize={8} textAnchor="middle">auto-QC</text>
          <line x1={630} y1={55} x2={654} y2={55} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#agfA)" />

          {/* 5. Delivered */}
          <rect x={656} y={30} width={135} height={50} rx={9} fill="#141414" stroke="#34D399" strokeWidth={1.5} />
          <text x={723.5} y={52} fill="#34D399" fontSize={12} fontWeight={600} textAnchor="middle">Delivered</text>
          <text x={723.5} y={67} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">folder + Slack</text>
        </svg>
      </div>

      {/* How to stage */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5">
          <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-3">How to stage a request <span className="text-muted normal-case font-normal">· you can do this today</span></div>
          <ol className="space-y-2 text-sm text-text list-decimal list-inside marker:text-accent">
            <li>In your Claude session, paste the Notion request link and say <span className="font-mono text-accent">stage request</span>.</li>
            <li>Claude resolves the source creative&apos;s assets, builds the project folder, and fills the <strong>🤖 Asset Gen</strong> grid on the request.</li>
            <li>It asks where to fire — pick <strong>💻 Generate locally</strong> (fires in your session now) or <strong>🤖 Send to the office mini</strong> (hands-off, rolling out).</li>
          </ol>
          <p className="text-xs text-muted mt-3">Nothing fires without your OK — staging just preps; you still confirm at the 🔥 Fire gate.</p>
        </div>

        <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5">
          <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-3">The 🤖 grid on every request</div>
          <p className="text-sm text-muted leading-relaxed">
            Every request now carries an <strong className="text-text">Asset Gen</strong> grid at the top — <span className="text-text">Project Folder · Character Refs · Prompts · Fire · Notes</span>. Staging fills it in; the <strong className="text-text">Asset Gen</strong> property is the switch that tells the system the request is armed. There&apos;s a <em>How to stage this</em> toggle right on the request if you&apos;re ever unsure.
          </p>
        </div>
      </div>

      {/* Statuses */}
      <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5 mb-6">
        <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-3">What the Asset Gen status means</div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {statuses.map((s) => (
            <div key={s.name} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span><strong className="text-text">{s.name}</strong> <span className="text-muted">— {s.desc}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* The mini + where to watch */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg bg-glass-accent backdrop-blur-xl ring-1 ring-accent/30 p-5">
          <div className="text-base font-semibold text-text mb-1">🤖 The office mini <span className="text-xs font-normal text-accent align-middle ml-1">rolling out</span></div>
          <p className="text-sm text-muted leading-relaxed">
            A dedicated always-on Mac that claims <strong className="text-text">Ready</strong> requests and runs the whole cycle hands-off — fire → QC → deliver — in <strong className="text-text">Auto → Home → Loans</strong> priority. Until it&apos;s live, choose <strong className="text-text">Generate locally</strong> when you stage.
          </p>
        </div>
        <div className="rounded-lg bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5">
          <div className="text-base font-semibold text-text mb-1">📣 Watch it live</div>
          <p className="text-sm text-muted leading-relaxed">
            Every start, delivery, and failure posts to <strong className="text-text">#pfm-asset-gen</strong> in Slack — so you always know what&apos;s generating, what landed, and what needs a look.
          </p>
        </div>
      </div>
    </section>
  );
}
