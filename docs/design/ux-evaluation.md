# UX evaluation: staging site v2 (alterphas.netlify.app)

Method: Intent `/evaluate`. Heuristic review, a cognitive walkthrough of the two money tasks, and an anti-pattern scan. Scope: homepage and a service page (`/roof-repair/`) at 1440px and 390px. Not covered: forms on a live backend, analytics, real-user testing.

Client verdict: "ugly and non-engaging". The findings below explain why.

## Anti-pattern verdict: clean

No fake urgency, no prechecked consent, no confirmshaming. Reviews are real and the prices are honest. Protect this in the redesign.

## Priority issues

### P1: The first screen shows no roof, no house and no people

The hero is a wall of text on the left and a white form on the right. Roofing is a visual, trust-based purchase: a 50-year-old homeowner decides "do I trust these people with my house?" in seconds, and nothing on screen answers it visually. The crew photo is shrunk to an 84px thumbnail.

- Violates: H8, H2 (doesn't match the real-world mental model of "a roofer").
- Route: `/wireframe` (hero anatomy), visual direction.

### P1: Monotonous rhythm reads as "template"

The homepage stacks 14 sections that all follow the same pattern: small kicker, big headline, grid of identical white cards on beige or white. Around 40 cards in all. With no change in pace, scale or imagery, nothing stands out and the eye has nowhere to land. It feels like SaaS, not craft.

- Violates: H8.
- Route: `/wireframe` (section variety, focal points), `/organize` (cut redundant sections).

### P1: Too long, too repetitive

The homepage is 15,400px on desktop and about 24,000px on mobile. "What kind of help" (4 cards) and "Services" (6 cards) overlap. Reviews, process, owner promise and FAQ all repeat the same trust claims. The second quote form sits at the very bottom, after 20 screens.

- Violates: H8.
- Route: `/organize`.

### P2: No brand personality

Generic geometric sans, pastel badge chips and emoji-free icon tiles. Nothing says New York, roofs, weather or craftsmanship. The navy and gold of the logo are used as UI colors, not as an identity.

- Route: visual direction (outside Intent's scope; Intent is not a visual system).

### P2: Imagery is underused

Real project photos are the strongest asset the business has, but they appear as small card thumbnails or 4:5 tiles at the bottom of the page.

- Route: `/wireframe`.

### P2: The mobile hero is text-only and the form is far down

On a phone, the first screen is headline and paragraph only. The form is about 2.5 screens down. The sticky call bar saves the task.

- Route: `/transpose`.

### P3: No sense of motion or feedback while scrolling

Everything is static, which adds to the "flat" feeling.

- Route: visual direction (keep motion subtle and honor reduced motion).

## Cognitive walkthrough

**Task A: "I have a leak, I want someone to come today"**
1. Land on home: pass (the phone number is visible).
2. Find emergency help: hesitation. It's the fourth card in a row, below the fold.
3. Call: pass.

**Task B: "I need a new roof, what will it cost and can I trust them"**
1. Land: hesitation. No visual proof of their work above the fold.
2. Find price: hesitation. The estimator is about 6 screens down.
3. Trust: pass. Reviews and credentials are good, but deep.
4. Request a quote: pass. The wizard is clear.

## Positive findings to protect

- The honest, specific copy and real prices.
- The 3-step quote wizard.
- The cost estimator.
- The phone number visible everywhere, and the sticky call bar on mobile.
- Accessibility (100), speed (Lighthouse 96–100), the text-size control.
- No dark patterns.

## Recommended actions (redesign brief)

1. **Hero:** full-bleed real photography with a confident headline. Put trust proof (rating, warranty, license) and the quote card on top of the photo.
2. **Cut the homepage to about 9 sections, each with a different shape:**
   - photo hero
   - credential marquee
   - services bento with large photos
   - full-bleed statement band
   - dark estimator
   - numbered process strip
   - one big review plus a few short ones
   - project mosaic
   - areas plus FAQ, then the closing CTA
3. **Visual identity:** a characterful display face (Archivo, expanded weights for headlines), deep navy and gold used boldly, real photography as the main material, and an editorial layout with asymmetry and big type.
4. **Emergency path:** promote it into the hero itself.
5. **Estimator:** move it higher on the homepage.
6. **Inner pages:** a photographic hero, the same component vocabulary, and fewer boxed cards.
