// Fills the hidden "how did this lead find us" fields (LeadContextFields.astro)
// right before a lead form is sent. The visit data is saved by the small
// script in Base.astro: apr_src (localStorage, 30 days) holds the latest ad or
// campaign visit, apr_pv / apr_st (sessionStorage) count pages and time.
const read = (s: Storage, k: string) => { try { return s.getItem(k); } catch { return null; } };

function source(s: any): string {
  if (s.gclid) return 'Google Ads';
  if (s.utm_source) return [s.utm_source, s.utm_medium].filter(Boolean).join(' / ');
  if (!s.ref) return 'Direct / unknown';
  const host = (() => { try { return new URL(s.ref).hostname.replace(/^www\./, ''); } catch { return s.ref; } })();
  const engine = /(google|bing|yahoo|duckduckgo|ecosia|aol)\./.exec(host);
  if (engine) return `Organic search (${engine[1][0].toUpperCase() + engine[1].slice(1)})`;
  if (/facebook|instagram|fb\.|t\.co|twitter|x\.com|linkedin|nextdoor|tiktok|youtube/.test(host)) return `Social (${host})`;
  return `Referral (${host})`;
}

function device(): string {
  const ua = navigator.userAgent;
  const ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const type = ipad || (/Android/.test(ua) && !/Mobile/.test(ua)) ? 'Tablet' : /Mobi|iPhone|Android/.test(ua) ? 'Mobile' : 'Desktop';
  const os = /iPhone/.test(ua) ? 'iPhone' : ipad ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /CrOS/.test(ua) ? 'ChromeOS' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const browser = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /OPR\//.test(ua) ? 'Opera'
    : /FxiOS|Firefox/.test(ua) ? 'Firefox' : /CriOS|Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Other';
  return `${type} · ${os} · ${browser}`;
}

export function fillContext(form: HTMLFormElement) {
  let s: any = {};
  try { s = JSON.parse(read(localStorage, 'apr_src') || '{}') || {}; } catch {}
  const start = +(read(sessionStorage, 'apr_st') || 0);
  const mins = start ? Math.max(0, Math.round((Date.now() - start) / 60000)) : 0;
  const set = (name: string, value: string) => { const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`); if (el) el.value = value; };
  set('source', source(s));
  set('campaign', s.utm_campaign || '');
  set('keyword', s.utm_term || '');
  set('gclid', s.gclid || '');
  set('landing_page', s.landing || '');
  set('first_referrer', s.ref || '');
  set('device', device());
  set('screen', `${screen.width}×${screen.height}`);
  set('pages_viewed', read(sessionStorage, 'apr_pv') || '1');
  set('time_on_site', mins < 1 ? 'under 1 min' : `${mins} min`);
}
