# Alter Phase Roofing Contracting: Rebuild, SEO & Launch Plan

**Status:** Site built (v3 redesign). Ready for client review, then launch on Netlify.
**Updated:** 2026-10-22
**Data:** [`docs/data/url-inventory.csv`](data/url-inventory.csv) lists every old URL with its Search Console numbers, old title and H1, its status on the new site (live / 301), and its new title and H1.

---

## 1. What the data said, and what we did about it

From the 16-month Search Console export (US, Jun 2025 to Oct 2026) and a crawl of all 57 live URLs:

| Finding | Action in the rebuild |
|---|---|
| 870k impressions but only 1,605 clicks (0.18% CTR). Big informational pages barely got clicked (TPO guide: 199k impressions, 19 clicks) | Every title and meta description rewritten for click-through. Answer-first "quick answer" boxes, real prices and FAQs on every page |
| Staten Island is where the money is (homepage plus Staten Island queries) | Homepage and core service pages targeted at Staten Island; the Staten Island area page focuses on neighborhoods so it doesn't compete with the homepage |
| Pages competing for the same queries (3 cost pages, 2 Brooklyn flat-roof pages, 2 materials guides, 2 commercial pages, 2 Brooklyn hubs) | Merged into the strongest URL with 301s (see §3) |
| Brooklyn flat roofing: Google ranked `/service-area/brooklyn-ny/flat-roofing/` (85k impressions) although it canonicalized to `/flat-roofing-brooklyn/` | The ranking URL is now the only one; the other 301s to it |
| Expired license #2098943-DCA printed on 8 pages; two phone numbers in use | Active license #2129904-DCWP everywhere; one NAP phone (929) 370-1552 sitewide |
| Thin, templated service pages (~200 words of real content) | Rewritten as full pages: problems, process, prices, FAQs, related links |
| Ad landing pages indexable | `noindex`; they keep the tracking number (929) 800-8572 |
| Self-serving review markup on service pages | Removed. Real Google reviews are shown visibly, with no AggregateRating schema (not eligible under Google's guidelines) |
| Visibility already falling Sep–Oct 2026 | Benchmark before launch (see §8) so the migration isn't blamed for it |

---

## 2. Decisions and verified facts

| Topic | Value | Source |
|---|---|---|
| Main phone (NAP, schema, GBP) | **(929) 370-1552**, always in this exact format, because the Google Ads call-conversion tag swaps it | Client; GTM container |
| Tracking number | (929) 800-8572, used only on the ads landing pages | Client |
| Owner | Marke, owner, part of every job; family-owned, 13+ years in roofing | Client |
| Address / geo | 61 Appleby Ave, Staten Island, NY 10305 · 40.591462, -74.079555 | NYC DCWP record |
| License | NYC DCWP Home Improvement Contractor **#2129904-DCWP**, active to 2027-02-28 | NYC Open Data |
| Hours | Mon–Fri 8–8, Sat 8–5, Sun closed, emergencies 24/7 | Current site |
| Warranties | Up to 50 years manufacturer, up to 25 years workmanship | Current site |
| Credentials | GAF Master Elite®, BBB Accredited | Current site |
| Reviews | "Excellent", 108 Google reviews | Current site |
| Prices | Client's published 2026 job averages, centralized in `src/data/costs.ts` | Current site/blog (client approved) |
| Areas | Staten Island (priority), Brooklyn, Manhattan, Queens | Client |
| Hosting | Netlify (Forms, redirects, deploy previews) | Client |
| Tags | GTM-M77VVM4Q kept (GA4 G-KKQEPJ782W, Google Ads AW-397936435 call and click conversions) | Client |
| Logo | Current logo kept | Client |

**Still to confirm with the client before launch**
1. Marke's surname (for author bylines and Person schema) and approval of the owner quote: "I'm part of every job, to make sure the highest quality work is done on every property."
2. ~~Name~~ Settled: the site uses **Alter Phase Roofing Contracting**, matching the Google Business Profile. Schema keeps the DCWP legal name ALTER PHASE CONTRACTING INC as `legalName`.
3. Current GAF certification tier (the site says Master Elite®). gaf.com blocks automated checks.
4. The "starting at $5,500" offer on `/roof-replacement-si/` (copied from the current ads page). Still valid?
5. Google Business Profile: phone must be (929) 370-1552, plus categories and services as in §5.

---

## 3. Structure and URLs

Every URL that ranks keeps its exact path, with the trailing slash. Content, titles and H1s are rewritten. Six pages were merged into stronger ones:

| Old URL | Now | Why |
|---|---|---|
| `/roofing-costs-in-nyc/` | 301 → `/roof-replacement-cost-in-nyc/` | Same intent; the target has 3× the impressions |
| `/guide-roofing-material-for-home-staten-island-brooklyn/` | 301 → `/top-roofing-materials-for-homes-in-new-york/` | Duplicate topic |
| `/flat-roofing-brooklyn/` | 301 → `/service-area/brooklyn-ny/flat-roofing/` | Google already ranks the target |
| `/brooklyn-roofing-solutions/` | 301 → `/service-area/brooklyn-ny/` | Duplicate Brooklyn hub |
| `/free-roofing-estimates-brooklyn-ny/` | 301 → `/free-estimate/` | Duplicate form page |
| `/service-area/nyc/commercial-roofing/` | 301 → `/commercial-roofing/` | Duplicate commercial page |

**New pages:** `/service-area/queens-ny/` (Queens is a stated service area with no page) and `/property-managers/` (HOAs, co-op/condo boards, property managers).

WordPress system URLs (`/sitemap_index.xml`, Yoast sub-sitemaps, `/feed/`, `/author/*`, `/?p=ID`, `/?page_id=ID`, `/wp-admin/*`, `/wp-json/*`) all 301 to their closest equivalent; see `public/_redirects`. All 586 images keep their original `/wp-content/uploads/...` URLs, so image search is unaffected.

**Hub and spoke:**
- Home links to every service, area and guide cluster.
- Each service links to its area pages, cost guides and sibling services through "Related".
- Each guide links back to its money page.
- The header mega-menu and footer give every page sitewide links.
- No orphans: `scripts/qa/links.mjs` verifies all ~7,600 internal references.

---

## 4. Design and conversion

- **Look (v3):** cinematic and photo-led, following the Intent UX evaluation in [`docs/design/ux-evaluation.md`](design/ux-evaluation.md). Full-bleed photo heroes with the quote card on top, a gold credential marquee, a services bento of large photo tiles, an owner statement band, a dark estimator, outlined 01–04 process numerals, one big review, a project mosaic, typographic borough links and a photo closing CTA. Type is Archivo (expanded heavy weights for headlines). Deep navy (#061530 / #10346F) and gold (#FBC45A) are used boldly. Subtle scroll reveals are switched off for reduced motion. Real crew and job photos only; no stock imagery.
- **Readable, not oversized:** 16–17px body text, 52–58px tap targets, the phone number visible in the header at all times, and a sticky Call / Text / Quote bar on phones.
- **3-step quote wizard** (what you need → property type and address → name and phone) in the hero of every service page. It works without JavaScript, posts to Netlify Forms, and pushes a `generate_lead` event to GTM so forms can become a Google Ads conversion.
- **Live roof cost estimator** (material × size × borough) built on the client's own prices, on the homepage, cost guides and replacement pages.
- **Homeowner and Staten Island first (v4):** about 90% of the work is residential, so the homepage, estimator and service pages target Staten Island homeowners. Commercial work and property managers get their own strip and pages, and other boroughs keep their location pages.
- **Homepage conversion devices:**
  - a symptom picker ("What's going on with your roof?") with the likely cause, the Staten Island price and the next step for each problem
  - a repair-first promise backed by a real review
  - a house-type estimator (detached / semi-attached / townhouse / flat) that starts from typical Staten Island roof sizes
  - Staten Island house types and neighborhoods grouped by shore
  - a mega menu with service photos, prices, an emergency path and an inspection CTA
- **Trust everywhere:** Google rating, GAF and BBB badges, license number, warranty, owner promise, real reviews.
- **Ads landing pages:** same design, `noindex`, and every phone link and display number swaps to the tracking number.

---

## 5. SEO implementation

**Content**
- Every page has a target query, an answer-first "short answer" box (40–60 words, written for featured snippets and AI answers), plain-English sections, real price tables and a visible FAQ.
- Guides add key takeaways, a table of contents, an author byline (Marke) with an author box, and updated dates.
- One source of truth for prices (`src/data/costs.ts`), so every table, the estimator and the schema always agree.

**Schema (JSON-LD, one `@graph` per page)**
- `RoofingContractor` with a stable `@id`: NAP, geo, hours, areas served, license credential, offer catalog and `sameAs` (Google Maps CID, Facebook, LinkedIn, Yelp, BBB, Angi, GAF, BuildZoom, Birdeye, Blue Book).
- `WebSite`, `WebPage`, `BreadcrumbList` on every page.
- `Service` on service and area pages, with a price range that matches the visible tables.
- `BlogPosting` on guides, with author `Person` (Marke).
- `FAQPage` generated from the same data as the visible FAQ. QA fails the build check if a schema question isn't on the page.
- No self-serving `AggregateRating` or `Review` markup.

**Technical**
- Static HTML (Astro), zero client-side rendering of content.
- Self-referencing canonicals.
- XML sitemap with real `lastmod` (noindex and redirected URLs excluded).
- `robots.txt` allows search and AI-answer crawlers.
- `llms.txt` summary of the site.
- Lighthouse (mobile): 96–100 performance and 100 accessibility, best practices and SEO across page types; zero layout shift.
- Images keep their URLs, with width/height and responsive `srcset`.
- Fonts are self-hosted, preloaded and use a metric-matched fallback.

**Local SEO, done off-site at launch**
- Google Business Profile: primary category Roofing contractor; secondary Gutter service, Siding contractor, Skylight contractor. Services and areas to match the site; website link pointing to `/`.
- Same NAP on Apple Business Connect, Bing Places, Yelp, BBB, Angi and Houzz.
- After every job, send a review request by text.

---

## 6. How the site is built

| Layer | Choice |
|---|---|
| Framework | Astro 5, static output, trailing slashes |
| Content | Markdown content collections (`src/content/pages`, `src/content/posts`), schema-validated (title ≤ 70, description 70–170 characters, required H1) |
| Hosting | Netlify (`netlify.toml`, `public/_redirects`, Netlify Forms) |
| Analytics | GTM-M77VVM4Q loaded once in `<head>` |
| QA | `npm run check:seo` (old-URL coverage, titles, descriptions, H1, canonical, JSON-LD, FAQ matching) and `npm run check:links` |
| Migration source | `scripts/migrate/` (original WordPress export, kept for reference) |

To edit content, change the Markdown file and Netlify redeploys on push. A visual CMS (Decap or Keystatic) can be added later if the client wants to edit without Git.

---

## 7. Launch checklist

1. Client review of the deploy preview; confirm the open items in §2.
2. Netlify: connect the repo, set the production branch, add the custom domain, force HTTPS, and redirect www → apex.
3. Netlify Forms: enable form notifications to info@alterphaseroofing.com (plus a CRM/Sheets webhook if wanted).
4. GTM: add a Google Ads conversion on the `generate_lead` event; keep the existing call and click conversions.
5. Before DNS cutover:
   - Export a Search Console baseline (Performance by page and query).
   - Run `npm run build && npm run check:seo && npm run check:links`.
6. Cut DNS on a Tuesday or Wednesday morning.
7. In Search Console:
   - Submit `/sitemap-index.xml`.
   - Run URL Inspection on the top 20 URLs.
   - Watch Pages and Crawl stats daily for 2 weeks.
8. Keep WordPress on a password-protected, `noindex` subdomain for 90 days as a rollback.
9. Update Google Business Profile and the main directories with the same NAP.

## 8. Measurement

- **Primary KPI:** calls + form leads per month (GA4 / Ads conversions).
- **SEO KPIs:** non-brand clicks, CTR on the top 20 pages, Staten Island and Brooklyn local-pack visibility, impressions for "roof replacement nyc", "roof repair staten island" and "flat roofing brooklyn".
- **Expectation:** normal ranking fluctuation for 2–6 weeks after launch. Because many titles and H1s changed, judge the new copy on 8–12 weeks of data, not the first week.

## 9. Next phase (after the site settles)

- **Cost Index from real job data:** median prices by borough and roof type, published quarterly. This is original data that journalists and AI answers can cite.
- **Project pages** for real jobs (neighborhood, roof type, before/after photos), which then feed neighborhood pages.
- **Address-based "Roof Check"** using NYC Open Data (building age, footprint, permits) to give instant ranges.
- **Owner video** on the homepage and About page.
