export default function PlaceholderCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-border rounded-lg p-5 bg-surface/30">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent border border-accent/50 rounded px-1.5 py-0.5">
          Draft
        </span>
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
      <div className="text-sm text-muted leading-relaxed">{children}</div>
    </div>
  );
}
