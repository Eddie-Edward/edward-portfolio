import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Read-only portfolio site: no server actions, no image domains needed in v1.
  reactStrictMode: true,
  poweredByHeader: false,
  // This site moved to https://edwardlei.vercel.app; every path redirects to
  // the same path there (308, permanent).
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://edwardlei.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
