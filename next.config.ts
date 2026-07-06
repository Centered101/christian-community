import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avatars + activity photos in the original markup are loaded from these hosts.
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
    ],
  },
};

export default nextConfig;
