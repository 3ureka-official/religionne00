import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.microcms-assets.io',
      'firebasestorage.googleapis.com'
    ],
  },
};

export default nextConfig;
