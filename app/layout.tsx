import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/Nav";
import { auth, signOut } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Power Fox Media — Editors Hub",
  description: "Update your Claude skills and browse the PFM skill catalog.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pfm-hub-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      {/* Persimmon Clean v2 — flat stone canvas; the old dark atmosphere
          (orbs, radial glows, dot grid) is gone by design. */}
      <body className="min-h-screen bg-bg text-text font-sans">
        <TopNav userEmail={session?.user?.email ?? null} signOutAction={signOutAction} />
        <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">{children}</main>
        <footer className="border-t border-ink py-6 text-center text-sm text-muted">
          Power Fox Media · Editors Hub
        </footer>
      </body>
    </html>
  );
}
