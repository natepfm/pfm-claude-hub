/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // On the lander's own hostname, "/" IS the lander — so the shared link is a
    // bare domain with no path and never shows the staff login. The hub keeps
    // its own behaviour on every other host. proxy.ts exempts the same case.
    //
    // This MUST be beforeFiles. The array form of rewrites() is afterFiles, which
    // only runs when nothing else matched — and "/" always matches app/page.tsx,
    // so an afterFiles rule for "/" never fires (verified: it fell through to the
    // hub page's own auth redirect). beforeFiles runs ahead of filesystem routes.
    //
    // Read at BUILD time: changing LANDER_HOST on Railway requires a redeploy.
    const beforeFiles = process.env.LANDER_HOST
      ? [
          {
            source: "/",
            has: [{ type: "host", value: process.env.LANDER_HOST }],
            destination: "/lander.html",
          },
        ]
      : [];

    return {
      beforeFiles,
      // clean URL for the field lander (static file in public/)
      afterFiles: [{ source: "/lander", destination: "/lander.html" }],
      fallback: [],
    };
  },
};
module.exports = nextConfig;
