// Netlify runs this automatically for every verified (non-spam) form
// submission, because of its file name. It emails the lead as a clean,
// easy-to-act-on card through Resend (https://resend.com).
//
// Netlify environment variables (Site configuration → Environment variables):
//   RESEND_API_KEY   API key from Resend (required; without it nothing is sent)
//   LEAD_EMAIL_TO    where leads go; several addresses separated by commas
//   LEAD_EMAIL_FROM  sender on a domain verified in Resend,
//                    default "Alter Phase Website <leads@alterphaseroofing.com>"

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const SITE = 'https://alterphaseroofing.com';

function phoneParts(raw) {
  const d = String(raw || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  if (d.length !== 10) return { show: raw || '', tel: String(raw || '').replace(/[^\d+]/g, '') };
  return { show: `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`, tel: `+1${d}` };
}

function row(label, value, html) {
  if (!value && !html) return '';
  return `<tr><td style="padding:9px 0;border-bottom:1px solid #e6e9ef;color:#5b6475;font-size:13px;width:38%;vertical-align:top">${esc(label)}</td>
<td style="padding:9px 0;border-bottom:1px solid #e6e9ef;color:#0f1a2e;font-size:15px;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${html || esc(value)}</td></tr>`;
}

function section(title, rows) {
  const body = rows.filter(Boolean).join('');
  if (!body) return '';
  return `<h2 style="margin:28px 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b07d10">${esc(title)}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed">${body}</table>`;
}

const link = (href, text) => `<a href="${esc(href)}" style="color:#0b4fa8">${esc(text)}</a>`;

export function buildEmail(p) {
  const d = p.data || {};
  const calc = p.form_name === 'calculator';
  const what = calc ? d.job : d.service;
  const urgent = d.service === 'EMERGENCY';
  const ph = phoneParts(d.phone);
  const when = new Date(p.created_at || Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });
  const mapUrl = d.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}` : '';
  const page = d.page || '';
  const ip = d.ip || '';
  const subject = `${urgent ? 'URGENT: ' : ''}New lead: ${what || 'Estimate request'} · ${d.name || 'No name'}${d.source ? ' · ' + d.source : ''}`;

  const btn = (href, text, bg, fg) => `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:8px;background:${bg};color:${fg};font-weight:700;font-size:15px;text-decoration:none">${text}</a>`;

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f2f4f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:${urgent ? '#b3261e' : '#08214a'};padding:22px 28px;color:#ffffff">
  <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8">${urgent ? 'Emergency · water coming in' : calc ? 'Price calculator lead' : 'Estimate request'} · ${esc(when)}</div>
  <div style="font-size:24px;font-weight:800;margin-top:6px">${esc(d.name || 'New lead')}</div>
  <div style="font-size:16px;margin-top:4px;color:#f4c24d;font-weight:700">${esc(what || '')}${d.estimated_range ? ' · ' + esc(d.estimated_range) : ''}</div>
</td></tr>
<tr><td style="padding:22px 28px 30px">
  <div style="font-size:26px;font-weight:800;color:#0f1a2e;margin-bottom:12px">${esc(ph.show)}</div>
  ${ph.tel ? btn('tel:' + ph.tel, 'Call now', '#f4b400', '#08214a') + btn('sms:' + ph.tel, 'Text', '#08214a', '#ffffff') : ''}
  ${mapUrl ? btn(mapUrl, 'Open in Maps', '#e8edf5', '#08214a') : ''}
  ${section('The job', [
    row('Address', null, mapUrl ? link(mapUrl, d.address) : ''),
    row('Customer', d.customer_type),
    row(calc ? 'Job' : 'Service', what),
    row('Details', d.details),
    row('Price shown', d.estimated_range),
    row('Area', d.area),
    row('Message', null, d.message ? esc(d.message).replace(/\n/g, '<br>') : ''),
  ])}
  ${section('How they found us', [
    row('Source', d.source),
    row('Campaign', d.campaign),
    row('Keyword', d.keyword),
    row('Google Ads click', d.gclid ? 'Yes (gclid recorded)' : ''),
    row('First page', null, d.landing_page ? link(SITE + d.landing_page, d.landing_page.split('?')[0]) : ''),
    row('Came from', d.first_referrer),
    row('Form sent from', null, page ? link(SITE + page, page) : ''),
  ])}
  ${section('Device & visit', [
    row('Device', d.device),
    row('Screen', d.screen),
    row('IP address', null, ip ? `${esc(ip)} · ${link('https://ipinfo.io/' + encodeURIComponent(ip), 'look up location')}` : ''),
    row('Pages viewed', d.pages_viewed),
    row('Time on site', d.time_on_site),
    row('Browser details', null, d.user_agent ? `<span style="font-size:12px;color:#5b6475">${esc(d.user_agent)}</span>` : ''),
  ])}
  <p style="margin:26px 0 0;font-size:12px;color:#8a92a3">Sent by alterphaseroofing.com · Netlify submission ${esc(p.id || '')}</p>
</td></tr></table></td></tr></table></body></html>`;

  const lines = [
    subject, '',
    `Name: ${d.name || ''}`, `Phone: ${ph.show}`, `Address: ${d.address || ''}`,
    d.customer_type && `Customer: ${d.customer_type}`, what && `${calc ? 'Job' : 'Service'}: ${what}`,
    d.details && `Details: ${d.details}`, d.estimated_range && `Price shown: ${d.estimated_range}`,
    d.message && `Message: ${d.message}`, '',
    `Source: ${d.source || ''}`, d.campaign && `Campaign: ${d.campaign}`, d.keyword && `Keyword: ${d.keyword}`,
    d.landing_page && `First page: ${d.landing_page.split('?')[0]}`, page && `Form sent from: ${page}`, '',
    d.device && `Device: ${d.device} (${d.screen || ''})`, ip && `IP: ${ip}`,
    d.pages_viewed && `Pages viewed: ${d.pages_viewed}`, d.time_on_site && `Time on site: ${d.time_on_site}`,
    `Received: ${when}`,
  ];
  return { subject, html, text: lines.filter((l) => l !== undefined && l !== false && l !== null).join('\n') };
}

export const handler = async (event) => {
  const { RESEND_API_KEY: key, LEAD_EMAIL_TO: to, LEAD_EMAIL_FROM: from = 'Alter Phase Website <leads@alterphaseroofing.com>' } = process.env;
  let payload;
  try { payload = JSON.parse(event.body).payload; } catch { return { statusCode: 400, body: 'Bad payload' }; }
  if (!key || !to) {
    console.log('Lead email skipped: set RESEND_API_KEY and LEAD_EMAIL_TO in Netlify.');
    return { statusCode: 200, body: 'Not configured' };
  }
  const { subject, html, text } = buildEmail(payload);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()).filter(Boolean), subject, html, text }),
  });
  if (!res.ok) {
    console.error('Lead email failed', res.status, await res.text());
    return { statusCode: 502, body: 'Email failed' };
  }
  return { statusCode: 200, body: 'Sent' };
};
