# Roofing CRM: Research & Build Plan

**Status:** Proposal, before discovery
**Updated:** 2026-10-23
**First customer:** Alter Phase Roofing Contracting (Staten Island, residential and flat/commercial, mostly retail work, Google Ads driven). The data model is multi-tenant from day one so the product can be sold to other roofers later.

---

## 1. What the market looks like (October 2026)

| Product | Best at | Pricing (verify with vendor) | Where it falls short |
|---|---|---|---|
| **AccuLynx** | Insurance and storm restoration: supplements, ESX import, mortgage-check and permit tracking, supplier integrations (ABC, QXO, SRS) | Quote only; third parties estimate $60–120 per user/mo, with add-ons for e-sign and texting | Expensive per seat; mobile app gets worse reviews than desktop; "every new feature costs extra" |
| **JobNimbus** | Flexible mid-market pipeline, Kanban production boards, texting, supplier ordering; absorbed SumoQuote for proposals | Quote only (roughly $225/mo and up), 14-day trial | Unreliable email (one reviewer got a BBB complaint from a missed email), clunky automations, no job costing |
| **Roofr** | Fastest from satellite measurement to signed proposal; instant website estimator; payments | Free tier; Essentials $249/mo, Scale $349/mo, **unlimited users**; estimator add-on about $149/mo; reports about $13 each | No native mobile app as of mid-2026; light on production and crews, so many shops pair it with a second tool |
| **Leap** | In-home sales and digital proposals | $79/mo (1 user) to $750/mo+, one-year contracts | Sales-focused, contracts lock you in |
| **Jobber** | Cheapest, easiest general field-service tool | From $29/mo | Not built for roofing: no measurements or roofing proposals |
| **ServiceTitan** | Enterprise depth and reporting | Enterprise pricing | Built for $10M+ shops; 2–6 month rollout |
| **RoofLink, Zuper, Contractors Cloud** | Job costing (RoofLink), field AI (Zuper), MCP server for AI tools (Contractors Cloud) | Quote only | Small review bases, dated UIs, or setup that feels overwhelming |

### What roofers complain about
1. **Pricing that grows with headcount.** Per-seat fees punish seasonal crews, and add-ons (texting, e-sign, payments, reports) roughly double the sticker price. A 3–5 user shop lands around $500–700/mo.
2. **Communication they can't trust.** Missed emails and texts lose jobs and reviews.
3. **Mobile apps that crash or fail offline**, on roofs and in basements where signal is poor.
4. **Slow lead response.** The speed-to-lead stats roofing vendors cite (78% of customers hire whoever responds first; leads reached within 5 minutes convert far better than leads reached after 30) come from vendor material, but the direction is uncontested.
5. **Paying for depth they don't use.** Retail roofers don't need supplement workflows; storm shops can't live without them. Review sites put the line at roughly 30% insurance revenue.
6. **Payments.** No way to pass card or ACH fees on, and payments kept separate from the job's financials.
7. **Tool sprawl.** CRM, measurements, proposals, scheduling, invoicing and reviews often live in 3–5 different products.

### What the best roofing CRM does
- **One job record from first call to warranty.** Contact, property, photos, measurements, estimate, contract, payments, crew, materials, permit and warranty all hang off a single job.
- **Answers every lead in minutes:** missed-call text-back, web-form auto-reply, a round-robin alert to the salesperson, and an AI receptionist after hours.
- **Inspection to signed proposal on site, on a phone:** photos with GPS and time stamps, a measurement import, a good/better/best proposal, e-signature and a deposit link in one visit.
- **A mobile app that works offline**, so crews actually use it.
- **Flat, predictable pricing with unlimited users**, and texting, e-sign and payments included.
- **Job costing**, estimate against actual, so the owner knows each job's margin.
- **Insurance as an optional module**, not forced on retail shops.
- **Closes the marketing loop:** shows which ad, keyword or referral produced paid revenue, and sends that back to Google Ads.
- **Integrations that matter:** QuickBooks, measurements (EagleView, Hover, Roofr, GAF QuickMeasure), suppliers (ABC Supply has a public API; SRS, QXO and Beacon need partner agreements), Google reviews.

---

## 2. Build or buy: be honest first

Roofr costs about $250/mo with unlimited users, and JobNimbus has a free trial. **If Alter Phase only needs a CRM, buying one is cheaper than building one.** Building is worth it when one of these holds:

1. **It becomes a product.** Small retail roofers (under 10 crews) are poorly served: AccuLynx is priced for storm shops, Jobber isn't roofing-specific, and Roofr is weak in production and mobile. A flat-priced, mobile-first, retail-focused CRM has room.
2. **It ties into things off-the-shelf tools can't reach:** the website's price book (`src/data/costs.ts`), Google Ads offline conversions, NYC-specific contracts and permits, and Alter Phase's own way of working.

**Recommendation:** run the two-week discovery (Phase 0) before writing code. If the answer is "internal tool only", trial Roofr and JobNimbus side by side first. The rest of this plan assumes we build.

---

## 3. Product scope

### Pipeline (retail roofing, configurable per company)
`New lead → Contacted → Inspection booked → Inspected → Proposal sent → Signed (cancel window) → Deposit received → Permit & materials → Scheduled → In progress → Complete → Invoiced → Paid → Review requested → Warranty registered`
Lost leads record a reason (price, timing, chose a competitor, no response) so the reports can show where jobs leak.

### Core modules
| Module | What it does |
|---|---|
| **Lead intake** | Website form webhook (Netlify Forms), tracking phone numbers (Twilio) with call recording and the source attached, manual entry, CSV import. Captures `gclid`/UTM from the site so revenue can be attributed |
| **Contacts & properties** | One person can own several properties; a property keeps roof type (shingle, TPO, EPDM, modified bitumen, slate), stories, access notes, NYC BIN/BBL and full job history |
| **Communication** | Two-way SMS, email and call log on the job timeline. Delivery and failure status is visible, never silent. Templates and missed-call text-back |
| **Inspections** | Offline mobile capture: photos with GPS and time stamps, annotations, checklists by roof type, voice notes turned into text |
| **Measurements** | v1: manual entry plus PDF upload of EagleView, Hover or Roofr reports, and a rough estimate from Google Solar API roof segments. Later: direct API ordering |
| **Estimates & proposals** | Price book with materials, labor and margin; good/better/best options; branded proposal page; e-signature with an audit trail |
| **Contracts (NYC/NYS compliant)** | Template carries the license number, salesperson, work and materials description, start and finish dates, the 3-business-day cancellation statement plus a detachable Notice of Cancellation, the permit undertaking and the mechanic's lien notice. Tracks where deposits are held (escrow or bond). **Template must be reviewed by a NY attorney** |
| **Payments** | Stripe card and ACH: deposit links, progress billing, optional fee pass-through where state rules allow, consumer financing link |
| **Production** | Crew and sub calendar, work orders, material lists generated from measurements, ABC Supply order API (others by export at first), permit tracking, delivery dates |
| **Job costing** | Estimated against actual materials, labor and subs, with margin per job and per salesperson |
| **Invoicing & accounting** | Invoices, accounts receivable aging, two-way QuickBooks Online sync |
| **Customer portal** | Homeowner sees status, photos, documents, can pay and message |
| **Reviews & referrals** | Automatic Google review request on completion; referral source tracking |
| **Warranty & maintenance** | Records manufacturer registration (GAF) and workmanship expiry; annual flat-roof inspection reminders become repeat work |
| **Reports** | Speed-to-lead, close rate by source and salesperson, revenue and margin, pipeline value, A/R, cost per signed job by ad campaign |
| **Insurance (optional module)** | Claim number, carrier, adjuster, ESX/Xactimate import, supplement tracking, mortgage-check and depreciation tracking |

### AI features (worth building, not gimmicks)
- **After-hours receptionist:** answers, qualifies (address, leak or replacement, urgency), books the inspection and writes the lead into the CRM.
- **Call and voice-note summaries** on the job timeline.
- **Photo assist:** suggests captions and damage tags; drafts the inspection report.
- **Proposal drafting** from inspection notes, measurements and the price book.
- **Follow-up nudges:** "Proposal opened 3 times, no signature, call today."
- **MCP server**, so the owner can ask Claude or other assistants "what's my close rate on Staten Island flat roofs this quarter?"

---

## 4. Architecture

| Layer | Choice | Why |
|---|---|---|
| App | **Next.js (TypeScript)** web app plus a **PWA** for field use | One codebase; PWA gives offline mode and camera without app-store delays. Native apps (React Native) come later if needed |
| Database | **Postgres (Supabase)** with row-level security keyed on `org_id` | Multi-tenant from day one; built-in auth and file storage for photos |
| Offline | IndexedDB queue with background sync for photos and notes; conflict rule is "last write wins per field" plus a visible history | Fixes the most common complaint about competitors |
| Phone/SMS | **Twilio** (numbers, call tracking, recording, SMS); A2P 10DLC registration | Missed-call text-back and source tracking |
| Email | **Postmark** with SPF, DKIM and DMARC; inbound parsing onto the job timeline | Reliable delivery is a selling point |
| Payments | **Stripe** (Connect, once multi-tenant) | Card, ACH, payment links, payouts |
| E-sign | Built in (ESIGN/UETA audit trail: IP, time stamp, document hash) or self-hosted DocuSeal | No per-envelope fees |
| Maps | Google Maps, Places and Solar API | Address autocomplete, satellite view, roof segment estimates |
| AI | Claude API (Sonnet for drafting and reasoning, Haiku for tagging and summaries); voice agent through a Twilio media stream | |
| Accounting | QuickBooks Online API | Accounting sync is the integration small shops need most |
| Hosting | Vercel or Netlify for the app, Supabase for the database, a background job worker (Inngest or a queue) | Fits the team's current Netlify setup |

### Core data model
`Organization · User(role: owner, office, sales, crew, sub) · Contact · Property · Job(stage, source, value, assigned_to) · Activity(call, sms, email, note, stage change) · Task · Inspection · Photo · Measurement · PriceBookItem · Estimate · EstimateOption · LineItem · Contract(signatures, cancel_deadline) · PaymentSchedule · Invoice · Payment · WorkOrder · Crew · ScheduleEvent · MaterialOrder · Permit · JobCost · Warranty · ReviewRequest · InsuranceClaim · Attachment · Automation`

Every table carries `org_id`, `created_by`, `created_at` and `updated_at`. An append-only `Activity` table is the job's timeline and its audit log.

---

## 5. Roadmap

| Phase | Length | Deliverable | Done when |
|---|---|---|---|
| **0. Discovery** | 2 weeks | Shadow Marke and the office for a week; map current tools, lead volume by source, close rate, the paperwork. Decide build or buy. Lawyer reviews the contract template | Signed-off scope and baseline numbers |
| **1. MVP: sell** | 6–8 weeks | Auth and roles, lead intake (web form, tracking numbers, manual), contacts and properties, pipeline board, tasks, two-way SMS and email, missed-call text-back, offline inspection photos, price book, estimate, proposal, e-sign, Stripe deposit, calendar | Alter Phase runs every new lead through it for 2 weeks with nothing lost |
| **2. Produce & get paid** | 6 weeks | Crew scheduling, work orders, material lists, ABC Supply ordering, permits, job costing, invoices, QuickBooks sync, customer portal | A job runs lead to paid with no spreadsheet |
| **3. Grow** | 4–6 weeks | Review requests, referrals, Google Ads offline conversion upload, reports dashboard, warranty registry and maintenance reminders, instant estimator on the website (Solar API) | Owner sees cost per signed job by campaign |
| **4. AI & insurance** | 6 weeks | After-hours AI receptionist, call and voice summaries, photo tagging, proposal drafts, MCP server; optional insurance module | Speed-to-lead under 5 minutes, 24/7 |
| **5. Productize** | 6–8 weeks | Self-serve onboarding, Stripe subscription billing, CSV import from JobNimbus, AccuLynx and Roofr, help docs, SOC 2-ready logging, 3–5 pilot roofers | Second paying customer |

About 7–9 months to a sellable product with 1–2 full-stack developers; the MVP Alter Phase uses daily lands in about 2.5 months.

### Pricing to test if it becomes a product
A flat price with **unlimited users**, texting, e-sign and payments included (for example, $199/mo Starter, $349/mo Pro with production and costing). Measurement reports and AI minutes priced at cost plus a small margin. This answers the top two complaints directly.

---

## 6. Success metrics (baseline in Phase 0)
- Median time to first response under **5 minutes**, around the clock
- Lead-to-inspection and inspection-to-signed rates, by source
- Days from lead to signature, and from completion to payment
- Share of jobs with a complete photo record (target 100%)
- Margin per job, estimate against actual
- Google review requests sent and reviews received
- Weekly active use by every crew lead (adoption is the risk that sinks most rollouts)

---

## 7. Risks
| Risk | Mitigation |
|---|---|
| Building costs more than buying | Phase 0 gate; build only if it becomes a product or the custom integrations pay back |
| Crews don't adopt it | PWA with few taps, offline mode, crew-only simplified view; Marke champions it |
| Integration access (EagleView, Hover, SRS, QXO, Beacon) | Start with PDF import and order export; apply for partner programs early. ABC Supply's API is the first live connection |
| Legal compliance (NYC/NYS contracts, escrow, TCPA, 10DLC, call-recording consent) | Attorney-reviewed templates; consent captured at intake; recording disclosure on every call |
| Data security (PII, payments) | Row-level security, Stripe holds card data, encrypted storage, audit log, backups |
| Feature creep | Each phase has a "done when" test; anything else waits for the next phase |

---

## Sources
- [Zuper: Best Roofing CRM in 2026](https://www.zuper.co/blog/best-roofing-crm-2026) (vendor blog)
- [Roofing Software Guide: Best CRM for Small Companies](https://roofingsoftwareguide.com/roundups/best-roofing-crm-small-business/)
- [SPOTIO: Best Roofing CRM Software](https://spotio.com/blog/best-roofing-crm-software/)
- [SkillMammoth: AccuLynx, JobNimbus, Roofr, RoofLink](https://skillmammoth.com/blog/best-crm-for-roofers)
- [Capterra: JobNimbus reviews](https://capterra.com/p/126797/JobNimbus/reviews/?page=2) and [AccuLynx reviews](https://www.capterra.com/p/116187/Acculynx/reviews/?page=4)
- [Roofr pricing update 2026](https://help.roofr.com/en/articles/15545259-roofr-pricing-and-packaging-update-2026), [PricingSaaS: Roofr](https://pricingsaas.com/companies/roofr), [ContractorToolStack: Roofr pricing](https://contractortoolstack.com/software/roofr/pricing/)
- [ABC Supply API announcement](https://www.abcsupply.com/media-center/press-release/abc-supply-co-inc-gives-customers-unprecedented-access-to-data-with-new-api/), [Roofr supplier integrations](https://help.roofr.com/en/collections/19671399-supplier-integrations)
- [EagleView and Verisk integration](https://www.verisk.com/company/newsroom/eagleview-and-verisk-join-forces-to-streamline-property-insurance-claims/)
- [NY Attorney General: Home improvement fact sheet](https://ag.ny.gov/home-improvement-fact-sheet), [NYC DCWP: HIC contractual compliance](https://www.nyc.gov/assets/dca/downloads/pdf/businesses/Home-Improvement-Contractor-Contractual-Compliance.pdf), [NY GBL §771](https://codes.findlaw.com/ny/general-business-law/gbs-sect-771/)
- [Sameday: roofing answering services 2026](https://sameday.ai/post/the-best-roofing-answering-service-in-2026) (vendor; speed-to-lead stats attributed to JobNimbus research)
