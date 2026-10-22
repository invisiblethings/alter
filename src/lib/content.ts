import { getCollection, type CollectionEntry } from 'astro:content';
import { allLinks, company } from '../data/nav';

export type PageEntry = CollectionEntry<'pages'>;
export type PostEntry = CollectionEntry<'posts'>;
export type Entry = PageEntry | PostEntry;

let cache: Entry[] | null = null;
export async function allEntries(): Promise<Entry[]> {
  if (!cache) cache = [...(await getCollection('pages')), ...(await getCollection('posts'))];
  return cache;
}

export async function posts() {
  const list = await getCollection('posts');
  return list.sort((a, b) => (b.data.modified || b.data.published || '').localeCompare(a.data.modified || a.data.published || ''));
}

export async function byPath(path: string) {
  return (await allEntries()).find((e) => e.data.path === path);
}

// Short breadcrumb labels from the menu; page H1s are too long for crumbs.
const labels = new Map<string, string>();
for (const l of [...allLinks(), ...company]) labels.set(l.url, l.title);
labels.set('/service-area/', 'Service Areas');
labels.set('/services/', 'Services');
labels.set('/blog/', 'Roofing Guides');
labels.set('/residential-roofing/', 'Residential Roofing');
labels.set('/commercial-roofing/', 'Commercial Roofing');
labels.set('/siding-gutter/', 'Siding & Gutters');
labels.set('/roof-repair/', 'Roof Repair');

export async function crumbsFor(path: string, ownTitle: string) {
  const crumbs = [{ name: 'Home', url: '/' }];
  if (path === '/') return crumbs;
  const entries = await allEntries();
  const self = entries.find((e) => e.data.path === path);
  if (self?.collection === 'posts') crumbs.push({ name: 'Roofing Guides', url: '/blog/' });
  const segs = path.split('/').filter(Boolean);
  for (let i = 1; i < segs.length; i++) {
    const p = '/' + segs.slice(0, i).join('/') + '/';
    const e = entries.find((x) => x.data.path === p);
    if (e || labels.has(p)) crumbs.push({ name: labels.get(p) || e!.data.h1, url: p });
  }
  crumbs.push({ name: labels.get(path) || ownTitle, url: path });
  return crumbs;
}

export const readTime = (body = '') => Math.max(3, Math.round(body.split(/\s+/).length / 230));

export const fmtDate = (s?: string) => (s ? new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
