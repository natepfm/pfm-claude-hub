/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // clean URL for the field lander (static file in public/)
      { source: "/lander", destination: "/lander.html" },
    ];
  },
};
module.exports = nextConfig;
