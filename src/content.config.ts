import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.array(z.object({ q: z.string(), a: z.string() })).default([]);

const base = {
  path: z.string().regex(/^\/(.*\/)?$/),
  seoTitle: z.string().max(70),
  description: z.string().min(70).max(170),
  h1: z.string(),
  kicker: z.string().optional(),
  intro: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  answer: z.string().optional(), // 40-60 word direct answer shown first (AEO)
  faq,
  related: z.array(z.string()).default([]),
  noindex: z.boolean().default(false),
  estimator: z.boolean().default(false),
  published: z.string().optional(),
  modified: z.string().optional(),
};

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    ...base,
    template: z.enum(['service', 'location', 'hub', 'company', 'contact', 'legal', 'landing', 'reviews', 'archive']),
    highlights: z.array(z.string()).default([]),
    service: z.string().optional(), // Service schema name / wizard preset
    area: z.string().optional(),
    prices: z.array(z.enum(['repairs', 'tiers', 'flat', 'pitched', 'boroughs', 'skylights'])).default([]),
    wizard: z.string().optional(),
    trackingPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).optional(), // ads landing pages only
    projects: z.array(z.object({ title: z.string(), location: z.string(), image: z.string() })).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    ...base,
    template: z.literal('post').default('post'),
    cardTitle: z.string().optional(),
    takeaways: z.array(z.string()).default([]),
    categories: z.array(z.number()).default([1]),
  }),
});

export const collections = { pages, posts };
