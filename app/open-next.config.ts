export default {
  default: {
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      incrementalCache: 'cloudflare-kv',
      tagCache: 'cloudflare-kv',
      queue: 'cloudflare-queue',
      imageOptimization: 'cloudflare',
    },
  },
};
