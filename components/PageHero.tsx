// Shared page hero — persimmons v3: boxed mono chip with the square
// accent bullet, then a big Playfair Display headline straight on the
// stone canvas. No card box.
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
    <header className="mb-14 pt-2">
      <div className="inline-flex items-center gap-2 border border-ink bg-surface px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-6">
        <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
        {eyebrow}
      </div>
      <h1 className="font-heading font-bold text-4xl md:text-6xl text-text leading-[1.08] text-balance">
        {title}
      </h1>
      <p className="text-muted text-lg max-w-2xl mt-5">{subtitle}</p>
    </header>
  );
}
