interface Props {
  type?: "info" | "warn" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info:    { border: "border-accent",       bg: "bg-accentMuted",       icon: "💡" },
  warn:    { border: "border-yellow-500",   bg: "bg-yellow-950/40",     icon: "⚠️" },
  danger:  { border: "border-red-500",      bg: "bg-red-950/40",        icon: "🛑" },
  success: { border: "border-emerald-500",  bg: "bg-emerald-950/40",    icon: "✅" },
};

export default function Callout({ type = "info", title, children }: Props) {
  const s = styles[type];
  return (
    <div className={`my-4 border-l-4 ${s.border} ${s.bg} pl-4 pr-4 py-3 rounded-r`}>
      {title && (
        <div className="font-semibold text-text mb-1">
          <span className="mr-2">{s.icon}</span>
          {title}
        </div>
      )}
      <div className="text-sm text-text leading-relaxed">{children}</div>
    </div>
  );
}
