# Alter Phase Roofing: Rebuild & Migration Plan

**Status:** Draft for approval (no code written yet)
**Date:** 2026-10-22
**Scope:** Move alterphaseroofing.com off WordPress/Elementor onto a fast static site, keep every ranking it has, then grow from there.

Supporting data: [`docs/data/url-inventory.csv`](data/url-inventory.csv) lists all 57 live URLs with their Search Console clicks, impressions, position, title, H1, canonical, and the action planned for each one at launch and afterwards.

---

## 0. Decisions and verified facts (updated 2026-10-22)

| Topic | Decision / fact | Source |
|---|---|---|
| Main phone (NAP, schema, GBP) | **(929) 370-1552**, always written in exactly this format, because the Google Ads call-conversion tag swaps this exact string for a forwarding number | Client; GTM container |
| Tracking number | 929-800-8572 is for tracking only. It never appears in schema or the footer NAP | Client |
| Owner | **Marke**, owner. Family-owned, local, 13+ years in roofing; Marke is on every job | Client |
| Legal entity | NYC DCWP lists the business as **ALTER PHASE CONTRACTING INC**; the website footer says "Alter Phase Roofing Inc." | NYC Open Data `w7w3-xahh` |
| License | **Home Improvement Contractor #2129904-DCWP**, active until 2027-02-28. The old #2098943-DCA expired in Feb 2025 but is still printed on 8 pages; the new site fixes this | NYC Open Data |
| Address / geo | 61 Appleby Ave, Staten Island, NY 10305 · 40.591462, -74.079555 (BIN 5106001) | DCWP record |
| Hours | Mon–Fri 8am–8pm, Sat 8am–5pm, Sun closed; emergency line 24/7 | Current site |
| Warranties | Manufacturer warranty up to **50 years**, workmanship warranty up to **25 years**, both written | Current site |
| Certifications | GAF Master Elite (claimed on the current site), BBB Accredited. GAF's directory page couldn't be checked automatically, so this needs confirming before launch | Current site |
| Reviews | Google: "Excellent", 108 reviews (Trustindex widget). Birdeye: 5.0 from 101 | Current site; Birdeye |
| Profiles (`sameAs`) | Google Maps CID 15794678866958250729, Facebook, LinkedIn, Yelp, BBB, Angi, GAF, BuildZoom, D&B, Birdeye, The Blue Book, BestCompany | Current schema plus web search |
| Service-area priority | **Staten Island first**, then Brooklyn, Manhattan, **Queens** (Queens gets its own borough page in Phase 2) | Client |
| Costs | Reuse the cost figures already published on the site and blog; they're averages from Alter Phase jobs | Client |
| Hosting | **Netlify** (native Forms, `_redirects`, deploy previews) | Client |
| Tags | Keep **GTM-M77VVM4Q** as is. It contains GA4 `G-KKQEPJ782W`, Google Ads `AW-397936435`, Ads call conversion (number swap), and Ads conversions on `tel:` and `sms:` clicks. **New:** a `generate_lead` dataLayer event on successful form submits, so forms can become an Ads conversion | Client; GTM container v9 |
| Logo | Keep the current logo for launch | Client |
| Blog author | Bylines move from the generic "alterphaseroofing" account to **Marke**, with an author page (experience, license, certifications) | Plan §7.4 |
| Hidden LP | `/roof-replacement-si/` is published but `noindex` and missing from the sitemap. It's kept as a `noindex` ads landing page | Crawl |

**Still to confirm with the client:** Marke's surname for the author byline, which legal name to show (Alter Phase Contracting Inc vs Alter Phase Roofing Inc), the current GAF certification tier, and the founding year (schema says 2018; client says 13+ years in roofing, so "since 2013").

---

## 1. What the data says (read this first)

Sources: the Search Console export (US web search, 16 months, Jun 2025 to Oct 2026), the live sitemap, and a crawl of all 57 URLs on 2026-10-22.

| Metric (16 months) | Value |
|---|---|
| Clicks | **1,605** |
| Impressions | 870,562 |
| Average CTR | 0.18% |
| Average position | 32.5 |
| Mobile vs desktop clicks | 686 vs 901 (mobile CTR is higher: 0.23% vs 0.16%) |

**1. The site has a lot of visibility but gets few clicks.** Most of the 870k impressions come from informational blog queries that rarely get clicked:

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| /tpo-roofing-guide/ | 199,254 | 19 | 16.6 |
| /service-area/brooklyn-ny/flat-roofing/ | 85,297 | 24 | 62.8 |
| /service-area/nyc/ | 82,341 | 7 | 58.9 |
| /roof-replacement-cost-in-nyc/ | 75,748 | 12 | 29.2 |
| /cost-to-repair-roof-leak/ | 41,266 | 2 | 52.6 |

"tpo roofing" alone accounts for 137k impressions and 9 clicks. That's a national, research-stage query, so it doesn't bring in jobs.

**2. The money is local, mainly Staten Island.** Non-branded Staten Island queries earned **140 clicks**, about 36% of all non-branded query clicks, at positions 3 to 13. The homepage (390 clicks) and branded searches (267 clicks) carry the business. Brooklyn, Manhattan and NYC service pages get impressions but sit at positions 35 to 60.

**3. Pages at positions 5 to 20 are the fastest wins.** These are a few positions short of page-one clicks: "roof replacement nyc" (4.1k impressions, position 17), "roofing staten island" (2.4k, 12), "roof repair staten island" (1.5k, 6.8), "roofers staten island" (1.2k, 5.8), "flat roofing brooklyn" (1.4k, 8.4), "best brands for roofing new york" (5.9k, 6.5), "tpo roof" (21k, 8.0), and "do you need a permit to replace a roof in nyc" (position 3.5, 3.4% CTR).

**4. Visibility is falling.** Monthly impressions were 45k to 60k for most of 2026, then 34k in September and about 26k in October (with 3 days still missing). We should find out why before launch: possibly a core update, seasonality, or a competitor. Otherwise the migration will get blamed for a drop that started before it.

**Implication:** the migration risk is real, but most of what's at stake is impressions on informational pages, and few clicks depend on them. A clean migration protects the roughly 1,600 clicks. The bigger opportunity is turning the impressions into clicks and the clicks into calls.

### Problems found on the current site

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | **Two phone numbers** | 929-370-1552 (in schema, ~900 times) and 929-800-8572 (~85 times, probably call tracking) | Decide on one primary number for NAP and schema. Run call tracking through dynamic number insertion, never hard-coded into the page. |
| 2 | Duplicate Brooklyn flat-roof pages | `/service-area/brooklyn-ny/flat-roofing/` canonicalizes to `/flat-roofing-brooklyn/`, but Google ranks the first one anyway (85k vs 12k impressions) | Phase 2: reverse the relationship (see the inventory) |
| 3 | Cost pages competing with each other | `/roof-replacement-cost-in-nyc/`, `/roofing-costs-in-nyc/`, `/roof-replacement-cost-in-brooklyn-ny/` | Phase 2: one cost hub plus a borough cost page |
| 4 | Ad landing pages are indexable | `/roofing-lp/`, `/vinyl-siding-estimate/` | Add `noindex` at launch |
| 5 | Thin, templated service subpages | e.g. `/roof-repair/commercial/`, `/residential-roofing/roof-inspections/`, about 1.4k words each including navigation, positions 60 to 75 | Phase 2 rewrite with real project proof |
| 6 | Review markup on service pages | 6 pages carry `Review`/`AggregateRating`. Search Console shows a "Review snippet" appearance (571k impressions) | Find which pages earn the snippet. Self-serving LocalBusiness reviews are ineligible under Google's policy, so we keep only compliant markup |
| 7 | Inconsistent schema graph | `RoofingContractor` appears on only 2 pages; other pages use `LocalBusiness` or Yoast defaults | One entity `@id`, referenced everywhere |
| 8 | Elementor bloat | Homepage is 338 KB of HTML before assets | Static rebuild |
| 9 | Pages that may target a competitor's name | `/all-seasons-roofing-staten-island/` | Review the intent and the trademark risk |

---

## 2. Rules for a migration that doesn't lose rankings

Google re-evaluates a site when its URLs, content, internal links or templates change. The more of those change at once, the longer rankings wobble. The rules:

1. **Every URL stays the same at launch**, including the trailing slash. All 57 URLs keep their exact paths. No consolidation until Phase 2.
2. **Ranking content stays the same at launch:** title tag, meta description, H1, H2/H3 headings, body text, and the FAQ blocks. Only the design around them changes. Copy rewrites happen in Phase 2, one cluster at a time, so each change can be measured.
3. **Heading anchor IDs are preserved.** Search Console shows Google sending "jump to" traffic to fragments such as `#How_Much_Does_a_Roof_Replacement_Cost_in_NYC` (3.4k impressions at position 6.5). The new build generates the same IDs, so those sitelinks keep working.
4. **Internal links stay at least as strong as today.** We crawl the old site's link graph and diff it against the new build before launch. No page loses inbound internal links.
5. **Image URLs that Google has indexed keep working.** Anything under `/wp-content/uploads/...` gets a 301 to the new image path. That covers all 141 media items, not just the ones visible in the Search Console export.
6. **WordPress system URLs are handled:** `/feed/`, `/?p=ID`, `/wp-json/`, `/author/*`, `/page/2/`, `/tag/*`, `/wp-login.php`, `?s=`, attachment pages, and `/sitemap_index.xml` plus the Yoast sub-sitemaps (these 301 to `/sitemap.xml`; the old subsitemap URLs keep resolving for a few months).
7. **The launch is gated by checks** (§10). We don't flip DNS until the redirect test is at 100%, the URL diff is empty, and the schema validates.
8. **WordPress stays available as a rollback** on a subdomain (password-protected, `noindex`) for 90 days.

---

## 3. Technical architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output, no JavaScript by default, interactive islands only where needed) | Fastest delivery of plain HTML; Markdown/MDX content collections; reliable Core Web Vitals |
| Hosting | **Netlify** (client decision) | Global CDN, `_redirects` and headers at the edge, native Forms, deploy previews, Netlify Functions for the address lookup (§6A) |
| CMS for the client | **Keystatic** (git-based, visual editor) | No database or plugins to maintain; content lives in the repo as Markdown; non-technical editing. Alternative: Sanity if several staff will edit. |
| Content source | Export from the live WP REST API (`/wp-json/wp/v2/*` responds publicly) → convert to Markdown with frontmatter | Keeps text, dates, authors, categories and media references exactly |
| Images | Astro image pipeline → AVIF/WebP, responsive `srcset`, explicit width/height, lazy below the fold, `fetchpriority=high` on the LCP image | LCP and CLS |
| Fonts | Self-hosted, subset, `font-display: swap`, preloaded | No Google Fonts round-trip |
| Forms | **Netlify Forms** (honeypot spam filtering, no puzzle CAPTCHA) → email notification to info@ + optional webhook to CRM/Sheet/SMS; `generate_lead` dataLayer event on success | No WPForms; leads aren't lost |
| Analytics | Existing GTM container `GTM-M77VVM4Q` (GA4 + Google Ads) loaded once in `<head>`; phone shown as `(929) 370-1552` so Ads call swap keeps working | Ads tracking unchanged on launch day |
| Search signals | XML sitemap with accurate `lastmod`, IndexNow ping on deploy (Bing, Yandex), Search Console and Bing Webmaster Tools verified before launch | Fast recrawl after cutover |

**Performance targets** (field data, p75 mobile): LCP < 1.8 s, INP < 150 ms, CLS < 0.05. Page weight < 300 KB on a typical page. JavaScript: 0 KB on content pages, except the call/estimate widgets.

---

## 4. Audience and site structure: one site, three entry points

The audience is mostly homeowners over 40, plus business owners, property managers, HOAs and co-op/condo boards. These groups need different things:

| | Homeowner (40+) | Business owner | Property manager / HOA / co-op board |
|---|---|---|---|
| Main worry | "Will they rip me off? Will they show up? Will it leak again?" | Downtime, cost, getting it done quickly | Liability, documentation, board approval, multiple buildings |
| What converts them | A real person, a clear price range, local proof, the warranty in writing | Fast response, commercial references, scheduling around business hours | COI, license and W-9 on demand; a proposal the board can read; maintenance plans |
| Preferred contact | **Phone call** | Phone or form | Form plus attachments, email thread |

The homepage hero offers these three choices in plain words ("My home", "My business", "A building I manage"). Each leads to its own path, but they share the same service and location pages, so authority isn't split across three copies.

### Information architecture (Phase 2 target)

The launch keeps today's URLs. These are additions and gradual improvements:

```
/                                   Home (three entry points)
/roof-repair/ …                     Existing service tree (kept)
/residential-roofing/ …             Existing (kept, enriched)
/commercial-roofing/ …              Existing (kept, enriched)
/flat-roofing/                      Existing → becomes the flat-roof hub (TPO, EPDM, mod-bit)
/service-area/<borough>/ …          Existing → neighborhood sub-pages ONLY where we have real projects
/property-managers/                 NEW: building owners, PMs, HOAs, co-op/condo boards
/projects/<slug>/                   NEW: project ledger (§6C)
/roof-cost/ (or keep cost URL)      NEW hub: NYC Roof Cost Index (§6B)
/roof-check/                        NEW: address lookup tool (§6A)
/leak-help/                         NEW: leak triage (§6E)
/blog/ → /guides/ (optional, P3)    Only if we redirect; NOT at launch
```

---

## 5. Design direction: "Brick, Slate & Daylight"

The goal is a site that looks like it was made by a trustworthy local tradesperson with high standards, not a template.

- **Palette:** slate navy (roofs, authority), warm brick terracotta for the single CTA color, warm paper off-white backgrounds, deep charcoal text. One accent color only, so the call button is always the most visible thing on the page.
- **Type:** headings in a sturdy serif with character (e.g. Fraunces or Source Serif 4). Body text in **Atkinson Hyperlegible**, a typeface designed by the Braille Institute for low-vision readers. **Base size 19 to 20 px**, line height 1.6, no light-grey text. This choice matters for a 40+ audience.
- **Imagery:** only real crew and real NYC roofs: rowhouse tops, brownstones, Staten Island colonials. No stock photos. Before/after sliders on project pages. The owner's face and name appear above the fold on the homepage.
- **Signature visual:** a drawn line illustration of NYC rooftops (water towers, parapets, chimneys) that runs along section dividers and the footer, used as a brand device across the site.
- **Pattern for older users:** large tap targets (≥ 48 px); the phone number in text on every screen, not just an icon; a sticky bottom bar on mobile with **Call** / **Text us** / **Free estimate**; no carousels, autoplay video, or chat bubbles covering content; forms with 3 fields to start (name, phone, address) and the rest optional; visible labels, not placeholders.
- **"What happens after you click":** a 4-step timeline next to every form (We call you within 1 business hour → visit → written quote with photos → no-pressure decision). This addresses the fear of a pushy sales visit.
- **Accessibility:** WCAG 2.2 AA at minimum, AAA contrast on body text. A text-size control (A / A+ / A++) stored per visitor.

---

## 6. Distinctive features

These would make the site a resource nobody else in NYC roofing offers, and give other sites and AI tools something original to cite.

### A. "Roof Check": instant facts about your building from its address
A visitor types their address. The site pulls public **NYC Open Data**: year built, building class, floors and lot size from MapPLUTO; roof footprint area and height from NYC Building Footprints; past roofing-related permits from the DOB permit datasets. It then returns:
- "Your 1928 attached two-family in Dongan Hills has a roughly 900 sq ft flat roof."
- A cost range from the Cost Index (§6B) for that roof type and size
- The likely roof system and the problems typical for that building type
- Permit history, plus a note on whether a permit is likely needed (that question already ranks at position 3.5)
- A one-tap **"Have a person confirm this"** button

This is the main lead magnet. It qualifies leads before the call (address, roof size, building type), and property managers can paste in several addresses at once. It runs as a Netlify Function with cached responses. Caveats on the results page: footprint area isn't exact roof area, and the range is an estimate to be confirmed in person.

### B. NYC Roof Cost Index, built from Alter Phase's own jobs
Publish anonymized median prices by roof type (TPO, mod-bit, EPDM, asphalt shingle), borough and roof size, from completed jobs, updated quarterly with a methodology note. This:
- Merges the three competing cost pages into one page that is clearly the best answer
- Gives journalists, local blogs and AI answer engines **original data to cite**, which is the most reliable way to earn citations and links
- Supports the "Roof Check" price ranges

*Needed from the client:* a spreadsheet of past jobs (date, borough, roof type, size, price). About 30 jobs is enough to start.

### C. Project ledger: real jobs as proof, not doorway pages
Every completed job becomes a short page: neighborhood (never the exact address unless the client agrees), roof type, problem, solution, duration, before/after photos, crew, and the warranty issued. Project pages feed:
- Neighborhood pages (e.g. Tottenville, Great Kills, Bay Ridge, Park Slope), which are **created only once 2 or more real projects exist there**. That avoids thin, copy-paste location pages, which Google's scaled-content policy targets.
- A map of "roofs we've done near you" on each borough page
- `ImageObject` with real captions; fresh content signals

### D. "Board-ready" kit for property managers, HOAs and co-op/condo boards
A dedicated `/property-managers/` section with:
- Instant downloads: Certificate of Insurance request, license, W-9, warranty specimens, safety program
- A multi-building **bid request** (upload drawings or photos, set the deadline)
- A **one-page proposal template formatted for a board meeting**, written for non-roofers
- Explanations of NYC compliance relevant to roof work: the cool-roof requirement (Local Law 21 of 2011), the sustainable roofing zone requirements (Local Laws 92/94 of 2019), and how roof work interacts with Local Law 11/FISP facade cycles. Each statement links to and is reviewed against the current DOB text.
- Preventive maintenance plans (semi-annual inspections with photo reports)

This is where the larger, recurring contracts are, and most local roofing sites only address homeowners (to be confirmed in a competitor check during Phase 0).

### E. Leak triage in 60 seconds
A guided flow: "Is water coming in right now?" → "Where?" → "Upload a photo (optional)". It routes either to **Call now (emergency)** or **Book an inspection**, and gives safe interim steps (bucket, move valuables, never go on the roof). This serves the 34k impressions on leak queries, which currently get almost no clicks, and turns panic into a phone call.

### F. A real person on the other end
- A 45-second owner video on the homepage and about page ("I'm ___, I answer this phone")
- **"Pick a callback time"** in addition to "call now"
- Response-time promise shown next to the phone number
- A printable **"Homeowner's Roof Folder"** PDF: warranty, materials used, photos, maintenance calendar, given to every customer. This is also a natural reason for them to leave a review.

---

## 7. SEO plan

### 7.1 Technical
- Self-referencing canonicals; `noindex` on landing pages, thank-you pages and the tool's result states
- Clean XML sitemap (canonical 200 URLs only) with real `lastmod`; a separate image sitemap
- Breadcrumbs on every page (visible and in `BreadcrumbList`)
- `robots.txt` with explicit crawler choices. **Recommendation:** allow search and AI-answer crawlers (OAI-SearchBot, PerplexityBot, Bingbot, Googlebot), because being cited in AI answers helps a local service business. Whether to opt out of AI *training* (GPTBot, the Google-Extended token) is the client's call and doesn't affect search.
- `llms.txt` with a curated map of the best pages. It's cheap to add. It isn't a ranking factor, and no major engine is confirmed to use it, so it's treated as optional.
- Speculation Rules API to prerender likely next pages (estimate, services), so navigation feels instant
- Security headers, HTTPS, HSTS; 404 page with search and the phone number

### 7.2 Structured data: one consistent entity graph
- One `RoofingContractor` node with a stable `@id` (`https://alterphaseroofing.com/#business`), referenced from every page. It includes NAP, geo, `areaServed` (Staten Island, Brooklyn, Manhattan…), `hasOfferCatalog`, opening hours, `sameAs` (Google Business Profile, Yelp, BBB, Facebook, Instagram, Houzz, Angi, NYC DCWP license lookup if present), `foundingDate` 2018, logo, and `founder` → `Person`.
- `Service` on each service page; `BlogPosting` with a real author `Person` (credentials, photo, bio page); `FAQPage` only where the FAQ is visible (it no longer produces rich results for most sites, but it helps answer extraction); `HowTo` is skipped because Google has deprecated it.
- **Reviews:** no self-serving `AggregateRating` on the business entity. Real reviews are shown visibly, sourced from Google with the reviewer's name and date. Before removing anything, we find which current markup produces the "Review snippet" appearance and decide case by case (§1, issue 6).
- Every page is validated (Rich Results Test and the Schema.org validator) in CI.

### 7.3 Local SEO (where the clicks are)
- Make the Google Business Profile match the site exactly: one phone number, categories (primary: Roofing contractor; secondary: Gutter service, Siding contractor, Skylight contractor), services, and service areas. Weekly GBP posts using project ledger content.
- A system for asking customers for reviews (an SMS link after the job, plus the Roof Folder); reply to every review
- Consistent listings on the main directories (Apple Business Connect, Bing Places, Yelp, BBB, Angi, Houzz, Nextdoor)
- Borough pages rebuilt around real projects, local building types (Staten Island detached homes, Brooklyn brownstones with flat roofs) and local rules

### 7.4 Content strategy (Phase 2 onward)
- **Rework rather than delete.** The TPO guide has 199k impressions: add an NYC-specific section ("TPO on NYC rowhouses: cost, permits, cool-roof rule"), a dedicated comparison table and a clear call to action, and sharpen the title and meta for CTR.
- **Cluster ownership:** one canonical page per intent. Cost pages are merged (§1, issue 3). Brooklyn flat roofing gets one URL.
- **First-hand experience** on every guide: real photos from Alter Phase jobs, "what we see on Staten Island roofs", a named author who is a roofer, and a reviewed-by line.
- **Answer-first formatting** for featured snippets and AI answers: a 40 to 60 word direct answer under each question heading, followed by detail, tables and sources.
- **Content gaps from the query data:** shingle brand comparisons ("best brands for roofing new york", 5.9k impressions at position 6.5), emergency skylight repair (940 impressions at position 16), roof permit FAQ (already at position 3 to 5; expand into the definitive NYC answer).

### 7.5 AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Copilot)
- Consistent entity facts everywhere (site, GBP, directories, schema)
- Original data (Cost Index) and tools (Roof Check), which are the formats these engines tend to cite
- Fast plain HTML with no client-side rendering, so every crawler sees full content
- Monitor brand mentions and citations quarterly against a fixed set of prompts (e.g. "best roofer in Staten Island", "how much is a flat roof replacement in Brooklyn")

**Not doing:** no fake reviews, no doorway pages for every ZIP code, no hidden text, no automated AI blog spam, no expired-domain or link-buying schemes. These are the "hacks" that get local contractors penalized, and the gains don't last.

---

## 8. Conversion plan

- **Primary action:** phone call (the 40+ audience). Secondary: 3-field estimate form. Tertiary: text message.
- A CTA in every section without being pushy; a sticky mobile call bar; click-to-call tracked as a GA4 conversion
- Trust stack near every CTA: years in business (since 2018), license number, insurance, warranty length, Google rating (live, via the API or a static snapshot with date), photos of the crew
- Clear financing information if offered
- Speed to lead: form submissions text the owner instantly; the target is a callback within 15 minutes during business hours, because the first contractor to call back usually gets the visit
- A/B tests after launch: hero copy, form length, CTA wording ("Get my free estimate" vs "Have someone look at my roof")

---

## 9. Measurement

- **Before launch:** benchmark Search Console (clicks, impressions, positions per URL and per query), GA4 conversions, call volume, and Core Web Vitals. Export the full Search Console data via the API (more than the UI's 1,000-row limit) and save it in the repo.
- **After launch:** daily Search Console checks for 2 weeks (coverage, 404s, redirect errors, crawl stats), then weekly for 3 months
- **KPIs:** calls plus forms per month (primary), non-brand clicks, Staten Island and Brooklyn local-pack visibility, CTR on the top 20 pages, Core Web Vitals pass rate

---

## 10. Phases and timeline

| Phase | Weeks | Deliverables | Gate to the next phase |
|---|---|---|---|
| **0. Discovery** | 1 | Phone number decision, GBP access, Search Console/GA4 access, full Search Console API export, investigate the Sep/Oct decline, brand assets, job data for the Cost Index, owner interview, photo shoot planning | Client inputs received (§11) |
| **1. Design** | 2 to 3 | Design system (tokens, type, components), homepage + service + blog + location + property-manager templates, mobile first, reviewed with 3 or more real customers over 40 if possible | Client sign-off |
| **2. Build** | 3 to 6 | Astro site, WP → Markdown export of all 57 URLs (same paths, titles, H1s, headings, anchors, body text), redirect map for system URLs and media, schema graph, forms, analytics, CMS | Staging site complete |
| **3. Pre-launch QA** | 6 | Crawl old vs new (URL set, titles, H1s, canonicals, robots, internal links), redirect tests, Lighthouse/CWV, accessibility audit, schema validation, form tests, call tracking test | **All checks pass** |
| **4. Launch** | 7 | DNS cutover on a Tuesday or Wednesday morning (not Friday); submit the sitemap; IndexNow; request indexing for the top 20 URLs; monitor | No critical errors after 72 h |
| **5. Stabilize** | 7 to 12 | Daily, then weekly monitoring; fix anything that drops; **no content changes** | Rankings back to baseline or better |
| **6. Grow (Phase 2)** | 12+ | Cost Index, project ledger, Roof Check, property-manager section, leak triage, cost page consolidation, Brooklyn canonical fix, rewrites of thin service pages, one cluster at a time | Ongoing monthly |

Features from §6 can be designed in Phase 1 and built in Phase 2, but they **launch after the stabilization period**, so their effect can be separated from the migration.

---

## 11. Client inputs

Answered on 2026-10-22 (see §0): main phone, owner, warranties, costs, profiles, borough priority, hosting (Netlify), Google Ads tags, logo. Search Console data comes from the export, so no access is needed.

Still open:
1. Marke's surname for bylines and the author page
2. Which legal name to show (DCWP has "Alter Phase Contracting Inc")
3. Confirm the current GAF certification tier (Master Elite?)
4. Job data and photos for the Cost Index and project ledger (Phase 2)
5. Netlify account access, and the DNS registrar at cutover

## 12. Risks

| Risk | Mitigation |
|---|---|
| Rankings dip after launch (normal: 2 to 6 weeks of fluctuation) | Identical URLs and content at launch, redirects tested in CI, WP kept as a rollback |
| Traffic was already declining before launch | Investigate the cause in Phase 0, document the baseline |
| The client can't edit content without WordPress | Keystatic visual editor plus short training video |
| Leads lost because of form changes | Forms send to email, a webhook and SMS; end-to-end test before launch |
| Review snippet appearance disappears | Identify its source first; keep compliant markup; replace with real, visible reviews |
| Open Data APIs change (Roof Check) | Cache, fall back gracefully to "a person will confirm this" |
