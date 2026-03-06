import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export', // Dit dwingt de statische export af
  images: {
    unoptimized: true, // Nodig omdat een statische export geen image-server heeft
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
};

export default nextConfig;