"use client";

import { useEffect } from "react";

// Hands the signed token back to the FoxView app. ASWebAuthenticationSession intercepts the
// foxio:// navigation; the visible card is only for the beat before that happens (or if the
// user somehow opened this page in a normal browser).
export default function RedirectClient({ url, email }: { url: string; email: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <div className="max-w-md mx-auto pt-10 md:pt-20">
      <div className="bg-surface border border-ink shadow-elev2">
        <div aria-hidden className="h-1.5 bg-accent border-b border-ink" />
        <div className="p-6 md:p-8">
          <div className="inline-flex items-center gap-2 border border-ink bg-bg px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-5">
            <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
            FoxView sign-in
          </div>
          <h1 className="font-heading font-bold text-2xl text-text leading-tight">
            Returning you to FoxView…
          </h1>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Signed in as <strong className="text-text">{email}</strong>. If FoxView doesn&apos;t
            come forward on its own,{" "}
            <a href={url} className="text-accentDeep underline">
              click here
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
