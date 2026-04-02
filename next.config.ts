import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/matteros-intake",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
