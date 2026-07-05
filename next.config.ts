import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Read-only portfolio site: no server actions, no image domains needed in v1.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
