# alterphaseroofing.com

Static Astro site for Alter Phase Roofing, deployed on Netlify. See [docs/PLAN.md](docs/PLAN.md) for the strategy, decisions and launch checklist.

```bash
npm install
npm run dev          # local preview
npm run build        # static build to dist/
npm run check:seo    # old-URL coverage, titles, H1s, canonicals, JSON-LD, FAQ schema
npm run check:links  # every internal link and image resolves
```

- Pages and guides: `src/content/pages/*.md`, `src/content/posts/*.md` (frontmatter is schema-validated)
- Business facts (phone, license, warranty): `src/data/business.ts`
- Prices used everywhere: `src/data/costs.ts`
- Redirects: `public/_redirects`
