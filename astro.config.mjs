import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, rehypeImages, rehypeTables, rehypeLinks, rehypeSectionGroups } from './src/lib/rehype.mjs';

// Ads landing pages and utility pages stay live but out of the index.
const NOINDEX = ['/roofing-lp/', '/vinyl-siding-estimate/', '/roof-replacement-si/', '/thank-you/'];

export default defineConfig({
  site: 'https://alterphaseroofing.com',
  // WordPress served every URL with a trailing slash; keep it identical.
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: {
    rehypePlugins: [rehypeSectionGroups, rehypeHeadingIds, rehypeImages, rehypeTables, rehypeLinks],
  },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
    }),
  ],
});
