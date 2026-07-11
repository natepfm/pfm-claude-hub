import Link from "next/link";
import PageHero from "@/components/PageHero";

const SOP_URL =
  "https://www.notion.so/powerfoxmedia/EDITOR-ONBOARDING-SOP-15216771e78080d6b609d29a04928a6f";

// New model (07.10.26): local editors' laptops are PRE-BUILT before day one.
// The editor arrives to a working system — day one is orientation, not install.
const checklist = [
  {
    title: "Sign in + confirm you're connected",
    desc: "Your accounts are already created and most apps are already signed in. Open Claude, Slack, Notion, and check Finder for the “ads” drive (LucidLink). If any app asks you to log in, your credentials are in the Password Vault (Notion → Shared) — grab them from Sam.",
  },
  {
    title: "Run your onboarding check",
    desc: "Open a Terminal and run the read-only check — it proves your machine is production-ready (skills, Lucid mount, tools) in a few seconds and spends nothing. Sam will point you to the one-line command.",
  },
  {
    title: "Install FoxView (2 min)",
    desc: "PFM's own media browser for the Lucid drive — the Finder replacement you'll live in. Quick install below (or already done for you — just log in).",
  },
  {
    title: "Watch the training SOPs in order",
    desc: "Five short videos take you from the file system to your first finished export. Start with the DaVinci Overview. This is the real work of day one — the setup is already handled.",
  },
  {
    title: "Meet Claude",
    desc: "Your AI production assistant is already installed and loaded with the PFM skills. Head to the Claude page to learn how it turns a Notion request into delivered clips + b-roll.",
  },
  {
    title: "Run your first task",
    desc: "Open the Notion board, pick a task, build it in DaVinci, save it to the right project folder, link the folder back in Notion, and mark it Done.",
  },
];

// What's on the machine + where each login lives. In the pre-built model the editor
// doesn't install these — this is a reference of the toolkit and its credentials.
const toolkit = [
  {
    name: "LucidLink Classic",
    for: "Our media file system — every asset and project lives here, mounted at /Volumes/ads.",
    access: `Signed in for you. Your filespace login lives in the Password Vault.`,
  },
  {
    name: "DaVinci Resolve Studio",
    for: "Our primary video editor, with the PFM plug-ins (Snap Captions, Magic Zoom, transitions) pre-installed.",
    access: `Installed + Studio-activated. Blackmagic Cloud invite comes by email on day one.`,
  },
  {
    name: "Claude",
    for: "Your AI production assistant — drives Veo clips + Nano Banana b-roll from a Notion request.",
    access: `Installed with the full PFM skill set. Signed in on your Team seat.`,
  },
  {
    name: "Higgsfield",
    for: "The image + video generation engine Claude fires for you.",
    access: `CLI installed; logged into the PowerFox workspace (editors only).`,
  },
  {
    name: "Notion",
    for: "The Video Task Manager — where every request lives.",
    access: `Signed in on your PFM email. Favorite the board.`,
  },
  {
    name: "Slack",
    for: "Team comms — Trend + PFM workspaces.",
    access: `Both invites accepted for you.`,
  },
  {
    name: "Chrome",
    for: "Your PFM login, plus the shared PFM profile alongside it.",
    access: `Both profiles signed in. Shared-profile login is in the Password Vault.`,
  },
  {
    name: "LinkYourFile",
    for: "Large-file transfer to and from Lucid Link.",
    access: `Installed. Your license key is in the Password Vault.`,
  },
  {
    name: "Adobe Creative Cloud",
    for: "Photoshop, After Effects, and the rest of the suite.",
    access: `Installed. Login in the Password Vault.`,
  },
];

// The gen tools Claude orchestrates — reference, not install targets.
const aiTools = [
  { name: "Higgsfield", for: "Image + video gens — what Claude drives for you.", href: "https://higgsfield.ai/" },
  { name: "Flow / Veo 3", for: "Google's video generation.", href: "https://labs.google/flow/about" },
  { name: "ElevenLabs", for: "AI voiceover.", href: "https://elevenlabs.io/app/home" },
  { name: "HeyGen", for: "AI avatars.", href: "https://www.heygen.com/" },
];

const foxviewSteps = [
  {
    t: "Make sure LucidLink is mounted",
    d: "You should see the “ads” drive in Finder. FoxView reads everything from Lucid, so it has to be connected first.",
  },
  {
    t: "Open the FoxView folder on Lucid",
    d: "In Finder: ads → PFM MEDIA MASTER FOLDER → 6. Claude PFM → FoxView.",
  },
  {
    t: "Double-click “Install FoxView.command”",
    d: "A small black window runs a few lines and says “✅ FoxView installed and launched.” It copies FoxView into your Applications folder and opens it — you can close the window.",
  },
  {
    t: "First launch: if macOS blocks it",
    d: "Right-click FoxView in your Applications folder → Open → Open. You only do this once.",
  },
  {
    t: "Log in",
    d: "Use your PFM email and the shared FoxView password (from Sam / the Password Vault). Check “Remember me” to stay signed in.",
  },
];

const training = [
  {
    n: 1,
    title: "PFM Media Master Folder Overview",
    desc: "How the file system is laid out, what lives in each folder, and the naming conventions you'll follow.",
    href: "https://www.notion.so/15216771e7808064a83ae4a5a24324b3",
    flag: null,
  },
  {
    n: 2,
    title: "PFM DaVinci Overview",
    desc: "DaVinci setup, Power Bins, asset management, and the plug-ins (already installed on your machine).",
    href: "https://www.notion.so/15216771e78080cd85e6e48a120d85b7",
    flag: "Watch first",
  },
  {
    n: 3,
    title: "TikTok Titles in Power Bins",
    desc: "Dropping in and customizing the TikTok-style title templates — sizing, safe zones, emojis.",
    href: "https://www.notion.so/15216771e78080f8aa30e4b81eb29daf",
    flag: null,
  },
  {
    n: 4,
    title: "Creating + Editing a Project",
    desc: "The full workflow — folder setup, importing assets, cutting, music, B-roll, captions, watermark, and export + naming.",
    href: "https://www.notion.so/15216771e78080989332df9aa2dfefe8",
    flag: null,
  },
  {
    n: 5,
    title: "Using Notion",
    desc: "How a task flows on the board: open it, read the brief, build it, link your folder, and mark it Done.",
    href: "https://www.notion.so/19816771e78080fd971ec2ff6fc30c7e",
    flag: null,
  },
];

const courses = [
  "DaVinci Resolve Basics (skip the practice project)",
  "Part-Time Creator Academy",
  "Viral Hooks Masterclass",
  "High Retention Editing Masterclass",
];

export default function OnboardingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Editors Hub · Onboarding"
        title="Welcome to Power Fox Media"
        subtitle="Your machine is already set up — accounts, apps, DaVinci, and Claude are ready to go. This page gets you oriented and to your first creative. Keep it bookmarked as a reference."
      />

      {/* First-day ribbon — the new pre-built flow at a glance */}
      <div className="mb-12 rounded-lg bg-surface shadow-elev1 ring-1 ring-ink px-5 py-3 overflow-x-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep mb-2">Your first day, in order</div>
        <svg
          viewBox="0 0 862 64"
          className="w-full h-auto block min-w-[700px]"
          role="img"
          aria-label="The first-day flow, left to right: sign in and confirm you're connected, run your onboarding Check, install FoxView, watch the Training SOPs, meet Claude, then run your First task."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="obRib" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#EA580C" /></marker>
          </defs>
          {[
            { label: "Sign in", sub: "confirm connected" },
            { label: "Check", sub: "prove it works" },
            { label: "FoxView", sub: "2-min install" },
            { label: "Training", sub: "5 SOPs in order" },
            { label: "Meet Claude", sub: "already installed" },
            { label: "First task", sub: "build + deliver", goal: true },
          ].map((n, i) => {
            const x = 12 + i * 142;
            const cx = x + 58;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <line x1={x - 24} y1={32} x2={x - 2} y2={32} stroke="#EA580C" strokeWidth={2} markerEnd="url(#obRib)" />
                )}
                <rect x={x} y={10} width={116} height={44} rx={0} fill={n.goal ? "#EA580C" : "#FFFFFF"} stroke={n.goal ? "#EA580C" : "#D1D5DB"} strokeWidth={1.5} />
                <text x={cx} y={30} fill={n.goal ? "#FFFFFF" : "#1A1A1A"} fontSize={12.5} fontWeight={600} textAnchor="middle">{n.label}</text>
                <text x={cx} y={45} fill={n.goal ? "#FFFFFF" : "#52525B"} fontSize={9} textAnchor="middle">{n.sub}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Welcome + the pre-built model */}
      <section id="welcome" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">👋 Welcome</h2>
        </div>
        <p className="text-text leading-relaxed max-w-3xl">
          You&apos;re joining the team behind PFM&apos;s story-ad pipeline — high-volume video creatives in the Auto, Home Insurance, and Concealed Carry verticals. This hub is your map: <strong className="text-text">Onboarding</strong> (this page) gets you oriented, <strong className="text-text">Claude</strong> covers your AI production assistant, and <strong className="text-text">Resources</strong> is where the briefs and shared assets live.
        </p>
        <div className="mt-5 p-4 bg-accentMuted border border-ink shadow-elev1 text-sm text-text max-w-3xl">
          <div className="font-semibold mb-1">✅ Your laptop arrives ready</div>
          <div className="text-muted">
            Sam builds your machine before your first day — accounts created, apps installed and signed in, DaVinci + plug-ins in place, and Claude loaded with the full PFM skill set. You don&apos;t install anything. Day one is about getting oriented and shipping your first creative, not setup. Every shared login lives in the <strong className="text-text">Password Vault</strong> (Notion → Shared) — ask Sam if an app ever asks you to sign in.
          </div>
        </div>
        <p className="text-sm text-muted mt-5">
          The complete behind-the-scenes runbook (how the machine gets built) lives in the{" "}
          <a href={SOP_URL} target="_blank" rel="noopener noreferrer" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
            Editor Onboarding SOP in Notion ↗
          </a>. You won&apos;t need it — it&apos;s Sam&apos;s checklist.
        </p>
      </section>

      {/* Day-one checklist */}
      <section id="checklist" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">✅ Day-one checklist</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">Your first day, in order — orientation and your first creative. The install work is already done for you.</p>
        <ol className="space-y-3">
          {checklist.map((c, i) => (
            <li key={i} className="flex gap-4 items-start rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-ink">
              <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text">{c.title}</div>
                <div className="text-sm text-muted leading-relaxed mt-0.5">{c.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Your toolkit — reference, not install */}
      <section id="toolkit" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🧰 Your toolkit</h2>
        </div>

        <div className="mb-6 p-4 bg-accentMuted border border-ink shadow-elev1 text-sm text-text">
          <div className="font-semibold mb-1">🔐 Where your logins live</div>
          <div className="text-muted">
            These are all installed and signed in on your machine — this is just a reference of what&apos;s there and where each credential lives if you&apos;re ever asked. Every shared login is in the{" "}
            <strong className="text-text">Password Vault</strong> (Notion → Shared) — ask Sam for access.
          </div>
        </div>

        <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accentDeep font-medium mb-3">On your machine</h3>
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {toolkit.map((app) => (
            <div key={app.name} className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-ink">
              <div className="font-semibold text-text mb-1">{app.name}</div>
              <div className="text-sm text-muted leading-relaxed">{app.for}</div>
              <div className="text-xs text-muted/80 mt-2 border-t border-border pt-2">{app.access}</div>
            </div>
          ))}
        </div>

        <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accentDeep font-medium mb-1">AI gen tools Claude orchestrates</h3>
        <p className="text-xs text-muted mb-3">You rarely touch these directly — Claude fires them for you. Here&apos;s what&apos;s under the hood.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {aiTools.map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg p-3 bg-surface-gradient shadow-elev1 ring-1 ring-ink hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
            >
              <div className="font-semibold text-text text-sm">{t.name} <span className="text-accent">↗</span></div>
              <div className="text-xs text-muted leading-relaxed mt-0.5">{t.for}</div>
            </a>
          ))}
        </div>
      </section>

      {/* FoxView — PFM's own media browser */}
      <section id="foxview" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🦊 FoxView</h2>
          <span className="self-center font-mono text-[10px] uppercase tracking-[0.08em] text-white bg-accent border border-ink px-1.5 py-0.5 font-medium">PFM app</span>
        </div>
        <p className="text-text leading-relaxed max-w-3xl mb-5">
          FoxView is PFM&apos;s own media browser for the Lucid drive — a{" "}
          <strong className="text-text">Finder replacement built for editors</strong>, with Notion requests, review tools (scrub player, A/B compare, QC badges), and one-click asset handoff layered on top. It works just like Finder from minute one — the extra power is additive, nothing new to learn. It may already be installed for you; if so, just log in.
        </p>

        <div className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-ink max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep mb-3">Install — about 2 minutes</div>
          <ol className="space-y-3">
            {foxviewSteps.map((s, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-surface2 text-accentDeep text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text text-sm">{s.t}</div>
                  <div className="text-sm text-muted leading-relaxed mt-0.5">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 pt-3 border-t border-border text-xs text-muted">
            <strong className="text-text">Updates:</strong> new version? Double-click “Install FoxView.command” again — it replaces the old one. · <strong className="text-text">Requires:</strong> LucidLink mounted. · Stuck? Message Sam.
          </div>
        </div>
      </section>

      {/* Training path */}
      <section id="training" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🎓 Training path</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Five short SOPs (each with a video) that take you from the file system to a finished, exported creative. This is the real work of day one — work through them in order, open each in Notion.
        </p>
        <div className="space-y-3 mb-8">
          {training.map((t) => (
            <a
              key={t.n}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-start rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-ink hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface2 text-accentDeep font-bold flex items-center justify-center">
                {t.n}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text">{t.title}</span>
                  <span className="text-xs">🎬</span>
                  {t.flag && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-white bg-accent border border-ink px-1.5 py-0.5 font-medium">
                      {t.flag}
                    </span>
                  )}
                  <span className="text-accent text-sm ml-auto">↗</span>
                </div>
                <div className="text-sm text-muted leading-relaxed mt-0.5">{t.desc}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-ink">
          <div className="font-semibold text-text mb-1">📚 Courses <span className="text-xs font-normal text-muted">— do these out of office, as needed</span></div>
          <p className="text-sm text-muted mb-3">
            On{" "}
            <a href="https://courses.tmsmedia.io/login" target="_blank" rel="noopener noreferrer" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
              courses.tmsmedia.io ↗
            </a>{" "}
            (login in the Password Vault). Complete in this order:
          </p>
          <ol className="ml-5 list-decimal text-sm text-muted space-y-1">
            {courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Meet Claude — already installed */}
      <section id="claude-setup" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🤖 Meet Claude</h2>
        </div>
        <Link
          href="/claude"
          className="block bg-accentMuted border border-ink shadow-glow-accent p-6 md:p-8 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <div className="text-2xl font-bold text-text">How Claude runs the PFM pipeline →</div>
          </div>
          <p className="text-muted max-w-2xl">
            Claude is your AI production assistant — already installed on your machine and loaded with the PFM skills. It turns a Notion request into delivered Veo clips and Nano Banana b-roll. The Claude page shows how to use it, the skills it runs, how to pull updates, and troubleshooting. <span className="text-accent font-medium">Go to the Claude page →</span>
          </p>
        </Link>
      </section>

      {/* Self-setup — the secondary path for VAs / remote / re-setup */}
      <section id="self-setup" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🛠 Setting up a machine yourself?</h2>
          <span className="self-center font-mono text-[10px] uppercase tracking-[0.08em] text-muted bg-surface2 border border-ink px-1.5 py-0.5 font-medium">Most editors skip this</span>
        </div>
        <p className="text-text leading-relaxed max-w-3xl mb-4">
          Local editors&apos; laptops are pre-built, so you won&apos;t normally do this. It&apos;s here for <strong className="text-text">remote / VA setups, a second machine, or a re-install.</strong> Once LucidLink is mounted and you&apos;re signed into Claude, one Terminal command installs the whole PFM stack (Homebrew, Node, Higgsfield CLI, ffmpeg, Whisper, and every team skill):
        </p>
        <div className="rounded-lg p-4 bg-surface shadow-elev1 ring-1 ring-ink max-w-3xl font-mono text-xs text-text overflow-x-auto">
          bash &quot;/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup.sh&quot;
        </div>
        <p className="text-sm text-muted mt-3 max-w-3xl">
          It ends with a verification checklist and a card of the few logins it can&apos;t do for you (Higgsfield, the Claude Notion connector). Remote VAs follow the dedicated VA path — ask Nicolai. Full details in the{" "}
          <a href={SOP_URL} target="_blank" rel="noopener noreferrer" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
            Onboarding SOP ↗
          </a>.
        </p>
      </section>
    </div>
  );
}
