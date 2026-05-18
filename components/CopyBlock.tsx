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
      {label && <div className="text-xs uppercase tracking-widest text-muted mb-2">{label}</div>}
      <div className="relative bg-surface2 border border-border rounded-md overflow-hidden group">
        <pre className="px-4 py-3 pr-28 text-sm font-mono text-text overflow-x-auto whitespace-pre-wrap break-all">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
            copied
              ? "bg-accent text-bg"
              : "bg-surface text-text border border-border hover:bg-accent hover:text-bg hover:border-accent"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
