import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set trailing slashes to true to force Next.js to generate index.html files inside directories.
  // This prevents Apache/Hostinger from throwing 403 Forbidden errors when it sees a folder.
  trailingSlash: true,
};

export default nextConfig;
