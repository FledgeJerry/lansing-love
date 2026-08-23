import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/governance/issues", destination: "/governance/cases", permanent: true },
      { source: "/governance/issues/:slug", destination: "/governance/cases/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
