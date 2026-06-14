// Shared Memphis-orange hero — one look across every hub page.
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header
      className="relative mb-12 overflow-hidden rounded-2xl ring-1 ring-white/10 px-6 py-12 md:px-10 md:py-14"
      style={{ background: "linear-gradient(180deg, #18110a 0%, #110b07 58%, #0a0a0a 100%)" }}
    >
      {/* Memphis confetti */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute top-8 right-10 md:right-16" width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="#2DD4BF" strokeWidth="7" /></svg>
        <svg className="absolute top-24 right-28 md:right-40 hidden sm:block" width="86" height="32"><path d="M3,4 L19,28 L35,4 L51,28 L67,4 L83,28" stroke="#FDE047" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
        <svg className="absolute top-6 right-44 md:right-64 hidden md:block" width="58" height="58"><polygon points="29,5 54,50 4,50" fill="none" stroke="#FF6B35" strokeWidth="6" /></svg>
        <svg className="absolute bottom-8 right-12 md:right-24" width="90" height="38"><path d="M3,28 Q18,3 33,20 T63,16 T93,20" stroke="#F472B6" strokeWidth="7" fill="none" strokeLinecap="round" /></svg>
      </div>

      <div className="relative z-10">
        <div className="text-xs uppercase tracking-[0.3em] mb-4 font-extrabold" style={{ color: "#2DD4BF" }}>
          {eyebrow}
        </div>
        <h1
          className="text-4xl md:text-6xl font-black tracking-tight italic"
          style={{
            color: "#FF6B35",
            textShadow:
              "1px 1px 0 #c25125, 2px 2px 0 #b34a22, 3px 3px 0 #a34320, 4px 4px 0 #8a3819, 5px 5px 0 #7a3216, 6px 6px 0 #6b2c13, 7px 7px 0 #561f0d, 9px 9px 0 #0a0a0a",
          }}
        >
          {title}
        </h1>
        <p className="text-muted text-lg max-w-2xl mt-6">{subtitle}</p>
      </div>
    </header>
  );
}
