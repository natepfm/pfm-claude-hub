"use client";

import { useState } from "react";

interface Props {
  code: string;
  label?: string;
}

export default function CopyBlock({ code, label }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-4">
      {label && <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted mb-2">{label}</div>}
      {/* Terminal block — the one deliberately dark surface in Persimmon Clean v2 */}
      <div className="relative bg-darkSurface rounded-md overflow-hidden group">
        <pre className="px-4 py-3 pr-28 text-sm font-mono text-[#E8E3DA] overflow-x-auto whitespace-pre-wrap break-all">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] transition-all ${
            copied
              ? "bg-accent text-white"
              : "bg-white/10 text-white hover:bg-accent"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
