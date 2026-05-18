interface Props {
  id?: string;
  number?: string | number;
  title: string;
  children: React.ReactNode;
}

export default function Section({ id, number, title, children }: Props) {
  return (
    <section id={id} className="my-12 scroll-mt-8">
      <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
        {number !== undefined && (
          <span className="text-accent font-mono text-sm">{number}</span>
        )}
        <h2 className="text-2xl font-bold text-text">{title}</h2>
      </div>
      <div className="prose-pfm">{children}</div>
    </section>
  );
}
