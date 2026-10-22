import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const base = {
  path: z.string().regex(/^\/.*\/$|^\/$/),
  seoTitle: z.string(),
  description: z.string().default(''),
  h1: z.string(),
  intro: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  noindex: z.boolean().default(false),
  canonical: z.string().optional(),
  published: z.string().optional(),
  modified: z.string().optional(),
  projects: z.array(z.object({ title: z.string(), location: z.string(), image: z.string().optional() })).optional(),
};

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    ...base,
    template: z.enum(['home', 'archive', 'service', 'location', 'contact', 'reviews', 'company', 'legal', 'landing']),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    ...base,
    template: z.literal('post'),
    categories: z.array(z.number()).default([1]),
  }),
});

export const collections = { pages, posts };
