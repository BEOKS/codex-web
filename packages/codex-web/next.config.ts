import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["socket.io"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("socket.io");
    }
    return config;
  },
};

export default nextConfig;
