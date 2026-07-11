import Link from "next/link";
import PageHero from "@/components/PageHero";

const SOP_URL =
  "https://www.notion.so/powerfoxmedia/EDITOR-ONBOARDING-SOP-15216771e78080d6b609d29a04928a6f";

const checklist = [
  {
    title: "Get your accounts",
    desc: "Get into 1Password first (ask Sam or Doug for an invite) — every shared login lives there. Then connect LucidLink, join both Slack workspaces (Trend + PFM), accept your Notion invite, and sign into the shared Google account.",
  },
  {
    title: "Install your apps",
    desc: "DaVinci Resolve Studio 19, Adobe Creative Cloud, Notion, Canva, ChatGPT, Chrome (two profiles), and LinkYourFile. Full list with links below.",
  },
  {
    title: "Install the DaVinci plug-ins",
    desc: "From the New Editor Assets folder on Lucid Link — Snap Captions, Magic Zoom, transitions, timer bars. Then add the Higgsfield plug-in (AI gens right on your timeline) once DaVinci is installed and logged in.",
  },
  {
    title: "Set up Claude",
    desc: "Your AI production assistant for Veo clips + Nano Banana b-roll. Full Mac / Windows walkthrough on the Claude page.",
  },
  {
    title: "Watch the training SOPs in order",
    desc: "Start with the DaVinci Overview (watch first). Five short videos take you from the file system to your first finished export.",
  },
  {
    title: "Run your first task",
    desc: "Open the Notion board, pick a task, build it in DaVinci, save it to the right project folder, link the folder back in Notion, and mark it Done.",
  },
];

const coreApps = [
  {
    name: "1Password",
    for: "Password manager — the key to every shared login below. Set this up first.",
    href: "https://1password.com/downloads/",
    access: `Ask Sam or Doug for a team invite, then add the Chrome extension to both profiles.`,
  },
  {
    name: "LucidLink Classic",
    for: "Our media file system — every asset and project lives here, mounted at /Volumes/ads.",
    href: "https://www.lucidlink.com/download-lucidlink-classic",
    access: `Filespace + login sent to you directly. Ask Doug (tech) for help with Mac permissions.`,
  },
  {
    name: "Slack",
    for: "Team comms. You'll be invited to two workspaces — Trend and PFM.",
    href: "https://slack.com/downloads",
    access: `Invites arrive by email.`,
  },
  {
    name: "DaVinci Resolve Studio 19",
    for: "Our primary video editor.",
    href: "https://www.blackmagicdesign.com/products/davinciresolve",
    access: `Choose "Download Only" — don't register. Studio key from Sam; Blackmagic Cloud invite comes by email.`,
  },
  {
    name: "Higgsfield DaVinci plug-in",
    for: "Higgsfield gens, reframe, upscale, and BG removal right inside the Resolve timeline.",
    href: "https://higgsfield.ai/plugins/davinci",
    access: `Install AFTER DaVinci is set up and logged in — the installer adds it to Workspace → Workflow Integrations. Sign in with the shared PFM Google account (1Password).`,
  },
  {
    name: "Notion",
    for: "The task board (Creative Status Board) — where every request lives.",
    href: "https://www.notion.com/desktop",
    access: `Invite sent to your PFM email. Favorite the Creative Status Board.`,
  },
  {
    name: "Adobe Creative Cloud",
    for: "Photoshop, After Effects, and the rest of the suite.",
    href: "https://creativecloud.adobe.com/apps/download/creative-cloud",
    access: `Login in 1Password.`,
  },
  {
    name: "Canva",
    for: "Decks + graphics (e.g. state lower-thirds).",
    href: "https://www.canva.com/download/mac/",
    access: `Login from Dima.`,
  },
  {
    name: "ChatGPT (desktop)",
    for: "General-purpose AI assistant.",
    href: "https://chatgpt.com/download",
    access: `Shared PFM account in 1Password.`,
  },
  {
    name: "Google Chrome",
    for: "Your PFM login plus a second shared PFM profile.",
    href: "https://www.google.com/chrome/",
    access: `Second-profile login in 1Password. Add the 1Password extension to both profiles.`,
  },
  {
    name: "LinkYourFile",
    for: "Large-file transfer to and from Lucid Link.",
    href: "https://www.linkyourfile.com/",
    access: `License key from Dima.`,
  },
];

const aiTools = [
  { name: "Higgsfield", for: "Image + video gens — what Claude drives for you.", href: "https://higgsfield.ai/" },
  { name: "Flow / Veo 3", for: "Google's video generation.", href: "https://labs.google/flow/about" },
  { name: "ElevenLabs", for: "AI voiceover.", href: "https://elevenlabs.io/app/home" },
  { name: "HeyGen", for: "AI avatars.", href: "https://www.heygen.com/" },
  { name: "Arcads", for: "UGC-style ad generation (credentials from David).", href: "https://app.arcads.ai/" },
  { name: "Sora 2", for: "Video generation.", href: "https://sora.chatgpt.com/explore" },
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
    d: "Use your PFM email and the shared FoxView password (in 1Password / from Sam). Check “Remember me” to stay signed in.",
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
    desc: "DaVinci setup, Power Bins, asset management, and installing the plug-ins.",
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
        subtitle="Everything a new editor needs to get up and running — accounts, apps, and the workflow — in one place. Work through it top to bottom on your first day, then keep it bookmarked as a reference."
      />

      {/* First-day ribbon — the whole onboarding flow at a glance */}
      <div className="mb-12 rounded-lg bg-surface shadow-elev1 ring-1 ring-ink px-5 py-3 overflow-x-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep mb-2">Your first day, in order</div>
        <svg
          viewBox="0 0 862 64"
          className="w-full h-auto block min-w-[700px]"
          role="img"
          aria-label="The first-day flow, left to right: get your Accounts, install your Apps, add the DaVinci Plug-ins, set up Claude, watch the Training SOPs, then run your First task."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="obRib" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#EA580C" /></marker>
          </defs>
          {[
            { label: "Accounts", sub: "1Password first" },
            { label: "Apps", sub: "DaVinci + tools" },
            { label: "Plug-ins", sub: "Snap Captions…" },
            { label: "Set up Claude", sub: "Mac / Windows" },
            { label: "Training", sub: "5 SOPs in order" },
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

      {/* Welcome + page map */}
      <section id="welcome" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">👋 Welcome</h2>
        </div>
        <p className="text-text leading-relaxed max-w-3xl">
          You&apos;re joining the team behind PFM&apos;s story-ad pipeline — high-volume video creatives in the Auto, Home Insurance, and Concealed Carry verticals. This hub is your map: <strong className="text-text">Onboarding</strong> (this page) gets you set up, <strong className="text-text">Claude</strong> covers your AI production assistant, and <strong className="text-text">Resources</strong> is where the briefs and shared assets live.
        </p>
        {/* Hub navigation trio lives on the Dashboard now */}
        <p className="text-sm text-muted mt-5">
          This page is the short version. The complete walkthrough — exact credentials, LucidLink mount-point setup, Blackmagic Cloud, and the training videos — lives in the{" "}
          <a href={SOP_URL} target="_blank" rel="noopener noreferrer" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
            full Editor Onboarding SOP in Notion ↗
          </a>.
        </p>
      </section>

      {/* Day-one checklist */}
      <section id="checklist" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">✅ Day-one checklist</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">Your first day, in order. Each step expands below.</p>
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

      {/* Apps & accounts */}
      <section id="apps" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🔑 Apps &amp; accounts</h2>
        </div>

        <div className="mb-6 p-4 bg-accentMuted border border-ink shadow-elev1 text-sm text-text">
          <div className="font-semibold mb-1">🔐 Set up 1Password first</div>
          <div className="text-muted">
            Every shared login lives in 1Password — get an invite (ask Sam or Doug) before anything else. This page lists what to install and how access is handled; for the exact credentials and detailed steps, follow the{" "}
            <a href={SOP_URL} target="_blank" rel="noopener noreferrer" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
              full SOP in Notion ↗
            </a>.
          </div>
        </div>

        <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accentDeep font-medium mb-3">Core apps</h3>
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {coreApps.map((app) => (
            <div key={app.name} className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-ink">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-text">{app.name}</span>
                {app.href && (
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accentDeep font-medium hover:text-accentHover underline underline-offset-2 shrink-0"
                  >
                    download ↗
                  </a>
                )}
              </div>
              <div className="text-sm text-muted leading-relaxed">{app.for}</div>
              <div className="text-xs text-muted/80 mt-2 border-t border-border pt-2">{app.access}</div>
            </div>
          ))}
        </div>

        {/* Two Chrome profiles — the setup that trips people up */}
        <div className="mb-8 rounded-lg bg-surface shadow-elev1 ring-1 ring-ink p-5 max-w-xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep mb-3">Chrome — two profiles, not one</div>
          <svg
            viewBox="0 0 460 210"
            className="w-full h-auto block"
            role="img"
            aria-label="Google Chrome runs two profiles. Profile 1 is your own PFM login; Profile 2 is the shared PFM account (its login is in 1Password). Add the 1Password extension to both profiles."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="obChrome" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#EA580C" /></marker>
            </defs>
            <rect x={160} y={14} width={140} height={42} rx={0} fill="#FFFFFF" stroke="#D1D5DB" strokeWidth={1.5} />
            <text x={230} y={34} fill="#1A1A1A" fontSize={13} fontWeight="bold" textAnchor="middle">Google Chrome</text>
            <text x={230} y={49} fill="#52525B" fontSize={9.5} textAnchor="middle">two profiles</text>
            <line x1={206} y1={56} x2={120} y2={92} stroke="#EA580C" strokeWidth={2} markerEnd="url(#obChrome)" />
            <line x1={254} y1={56} x2={340} y2={92} stroke="#EA580C" strokeWidth={2} markerEnd="url(#obChrome)" />
            <rect x={16} y={94} width={200} height={100} rx={0} fill="#FFFFFF" stroke="#D1D5DB" strokeWidth={1.5} />
            <circle cx={40} cy={120} r={10} fill="#EA580C" />
            <text x={40} y={124} fill="#FFFFFF" fontSize={11} fontWeight="bold" textAnchor="middle">1</text>
            <text x={58} y={124} fill="#1A1A1A" fontSize={12.5} fontWeight={600}>Profile 1</text>
            <text x={32} y={150} fill="#52525B" fontSize={10.5}>Your own PFM login</text>
            <text x={32} y={172} fill="#52525B" fontSize={10}>+ 1Password extension</text>
            <rect x={244} y={94} width={200} height={100} rx={0} fill="#FFEDD5" stroke="#EA580C" strokeWidth={2} />
            <circle cx={268} cy={120} r={10} fill="#EA580C" />
            <text x={268} y={124} fill="#FFFFFF" fontSize={11} fontWeight="bold" textAnchor="middle">2</text>
            <text x={286} y={124} fill="#1A1A1A" fontSize={12.5} fontWeight={600}>Profile 2</text>
            <text x={260} y={150} fill="#52525B" fontSize={10.5}>Shared PFM account</text>
            <text x={260} y={172} fill="#52525B" fontSize={10}>login in 1Password · + ext.</text>
          </svg>
          <div className="mt-3 text-xs text-muted">Add the 1Password extension to <strong className="text-text">both</strong> profiles — second-profile login lives in 1Password.</div>
        </div>

        <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accentDeep font-medium mb-1">AI &amp; creative tools</h3>
        <p className="text-xs text-muted mb-3">Most use the shared PFM Google account or 1Password. Higgsfield is the one Claude drives for gens.</p>
        <div className="grid md:grid-cols-3 gap-3">
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
          <strong className="text-text">Finder replacement built for editors</strong>, with Notion requests, review tools (scrub player, A/B compare, QC badges), and one-click asset handoff layered on top. It works just like Finder from minute one — the extra power is additive, nothing new to learn.
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
          Five short SOPs (each with a video) that take you from the file system to a finished, exported creative. Work through them in order — open each in Notion.
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
            (login in the SOP / 1Password). Complete in this order:
          </p>
          <ol className="ml-5 list-decimal text-sm text-muted space-y-1">
            {courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Set up Claude — live handoff */}
      <section id="claude-setup" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="font-heading font-bold text-[26px] text-text">🤖 Set up Claude</h2>
        </div>
        <Link
          href="/claude"
          className="block bg-accentMuted border border-ink shadow-glow-accent p-6 md:p-8 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <div className="text-2xl font-bold text-text">Install Claude + the PFM pipeline →</div>
          </div>
          <p className="text-muted max-w-2xl">
            Claude is your AI production assistant — it turns a Notion request into delivered Veo clips
            and Nano Banana b-roll. The Claude page has the full Mac / Windows install walkthrough, how
            to use it, the skills it runs, and troubleshooting. <span className="text-accent font-medium">Go to the Claude page →</span>
          </p>
        </Link>
      </section>
    </div>
  );
}
