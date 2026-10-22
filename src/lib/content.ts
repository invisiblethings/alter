import { getCollection, type CollectionEntry } from 'astro:content';
import { services, areas, company } from '../data/nav';

export type Entry = CollectionEntry<'pages'> | CollectionEntry<'posts'>;

let cache: Entry[] | null = null;
export async function allEntries(): Promise<Entry[]> {
  if (!cache) cache = [...(await getCollection('pages')), ...(await getCollection('posts'))];
  return cache;
}

export async function posts() {
  const list = await getCollection('posts');
  return list.sort((a, b) => (b.data.published || '').localeCompare(a.data.published || ''));
}

// Short labels for breadcrumbs, taken from the menu where possible.
const navTitles = new Map<string, string>();
for (const s of services) {
  navTitles.set(s.url, s.title);
  for (const c of s.children) navTitles.set(c.url, c.title);
}
for (const a of areas) {
  navTitles.set(a.url, a.title);
  for (const c of a.children || []) navTitles.set(c.url, c.title);
}
for (const c of company) navTitles.set(c.url, c.title);
navTitles.set('/service-area/', 'Service Area');
navTitles.set('/blog/', 'Blog');

export async function crumbsFor(path: string, ownTitle: string) {
  const entries = await allEntries();
  const crumbs = [{ name: 'Home', url: '/' }];
  if (path === '/') return crumbs;
  const segs = path.split('/').filter(Boolean);
  const isPost = entries.find((e) => e.data.path === path)?.collection === 'posts';
  if (isPost) crumbs.push({ name: 'Blog', url: '/blog/' });
  for (let i = 1; i < segs.length; i++) {
    const p = '/' + segs.slice(0, i).join('/') + '/';
    const e = entries.find((x) => x.data.path === p);
    if (e || navTitles.has(p)) crumbs.push({ name: navTitles.get(p) || e!.data.h1, url: p });
  }
  crumbs.push({ name: navTitles.get(path) || ownTitle, url: path });
  return crumbs;
}

const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// FAQ pairs exactly as they appear on the page (same rule as the accordion
// in rehypeSectionGroups), so FAQPage markup always matches visible text.
export function extractFaq(body: string) {
  const lines = body.split('\n');
  const out: { q: string; a: string }[] = [];
  let run: { level: number; q: string; a: string[] }[] = [];
  const flush = () => {
    const qs = run.filter((r) => r.q.endsWith('?')).length;
    if (run.length >= 3 && qs / run.length >= 0.6) {
      for (const r of run) if (r.q.endsWith('?') && r.a.length) out.push({ q: r.q, a: stripMd(r.a.join(' ')) });
    }
    run = [];
  };
  let cur: { level: number; q: string; a: string[] } | null = null;
  for (const line of lines) {
    const m = line.match(/^(#{2,6})\s+(.*)$/);
    if (m) {
      const level = m[1].length;
      if (level <= 2 || (run.length && level !== run[0].level)) { flush(); cur = null; if (level <= 2) continue; }
      if (level === 3 || level === 4) { cur = { level, q: stripMd(m[2]), a: [] }; run.push(cur); }
      else cur = null;
      continue;
    }
    if (cur && line.trim()) cur.a.push(line);
  }
  flush();
  return out;
}

export function excerpt(body: string, words = 28) {
  const para = body.split('\n\n').map(stripMd).find((p) => p.split(' ').length > 12) || '';
  const w = para.split(' ');
  return w.length > words ? w.slice(0, words).join(' ') + '…' : para;
}

export function areaFor(path: string, title: string) {
  const s = (path + ' ' + title).toLowerCase();
  if (s.includes('brooklyn')) return 'Brooklyn';
  if (s.includes('manhattan')) return 'Manhattan';
  if (s.includes('queens')) return 'Queens';
  if (s.includes('staten')) return 'Staten Island';
  if (s.includes('nyc') || s.includes('new york')) return 'New York City';
  return 'Staten Island';
}

export function headingsOf(body: string) {
  return body
    .split('\n')
    .map((l) => l.match(/^##\s+(.*)$/))
    .filter(Boolean)
    .map((m) => stripMd(m![1]));
}
