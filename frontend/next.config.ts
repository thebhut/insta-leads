import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes are false for static hosting compatibility on Hostinger
  trailingSlash: false,
};

export default nextConfig;
