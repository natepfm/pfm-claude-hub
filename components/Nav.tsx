import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/setup/mac", label: "Setup · Mac" },
  { href: "/setup/windows", label: "Setup · Windows" },
  { href: "/skills", label: "Skills" },
  { href: "/troubleshooting", label: "Troubleshooting" },
  { href: "/changelog", label: "Changelog" },
];

export default function Nav() {
  return (
    <nav className="hidden md:flex flex-col w-60 shrink-0 border-r border-border px-6 py-10 bg-surface">
      <Link href="/" className="block mb-10">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-text">PFM </span>
          <span className="text-accent">Claude</span>
        </div>
        <div className="text-xs text-muted mt-1 uppercase tracking-widest">Hub</div>
      </Link>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block px-3 py-2 rounded text-muted hover:text-text hover:bg-surface2 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-10 text-xs text-muted">
        v1.0 · Power Fox Media
      </div>
    </nav>
  );
}
