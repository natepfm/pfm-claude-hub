export default function PlaceholderCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg p-5 bg-surface border border-dashed border-borderInput shadow-elev1">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-accentDeep bg-accentMuted/60 border border-accent/40 rounded px-1.5 py-0.5">
          Draft
        </span>
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
      <div className="text-sm text-muted leading-relaxed">{children}</div>
    </div>
  );
}
