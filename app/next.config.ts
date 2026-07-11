import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: configDir,
  outputFileTracingIncludes: {
    '/api/external/generate-publish': ['./lib/fonts/**/*.ttf'],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }

    return config;
  },
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
