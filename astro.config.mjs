import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, rehypeImages, rehypeTables, rehypeLinks, rehypeSectionGroups } from './src/lib/rehype.mjs';

// Ads landing pages and utility pages stay live but out of the index.
const NOINDEX = ['/roofing-lp/', '/brooklyn-roofing-solutions/', '/vinyl-siding-estimate/', '/roof-replacement-si/', '/thank-you/'];

// lastmod for the sitemap, read straight from content frontmatter (dates edited by hand
// when content really changes, so builds never move them). The homepage isn't a content
// file: update HOME_MODIFIED when its copy changes.
const HOME_MODIFIED = '2026-10-22';
const lastmod = new Map([['/', HOME_MODIFIED]]);
for (const dir of ['src/content/pages', 'src/content/posts']) {
  for (const f of fs.readdirSync(dir)) {
    const src = fs.readFileSync(`${dir}/${f}`, 'utf8');
    const p = src.match(/^path: "(.*)"$/m)?.[1];
    const m = src.match(/^modified: "(.*)"$/m)?.[1];
    if (p && m) lastmod.set(p, m);
    // Pages whose canonical points elsewhere stay out of the sitemap.
    if (p && /^canonical: /m.test(src)) NOINDEX.push(p);
  }
}


export default defineConfig({
  site: 'https://alterphaseroofing.com',
  // WordPress served every URL with a trailing slash; keep it identical.
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: {
    // Keep migrated text byte-identical (no curly quotes / ellipsis rewriting).
    smartypants: false,
    rehypePlugins: [rehypeSectionGroups, rehypeHeadingIds, rehypeImages, rehypeTables, rehypeLinks],
  },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) && !page.endsWith('/404/'),
      serialize: (item) => {
        const m = lastmod.get(new URL(item.url).pathname);
        return m ? { ...item, lastmod: new Date(m + 'T12:00:00Z').toISOString() } : item;
      },
    }),
  ],
});
