import type { OpenNextConfig } from 'open-next/types/open-next';

const config = {
  default: {
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'cloudflare',
      incrementalCache: 'cloudflare-kv',
      tagCache: 'cloudflare-kv',
      queue: 'cloudflare-queue',
      imageOptimization: 'cloudflare',
    },
  },
} satisfies OpenNextConfig;

export default config;
