// Lead conversions are reported from the thank-you page, not from the form:
// a conversion request sent while the browser is leaving the page can be cut
// off (Tag Assistant shows the Ads tag as "Failed"). The form saves the lead
// details here, then the thank-you page pushes generate_lead once and clears
// them, so a reload or a direct visit never counts as a second lead.
const KEY = 'apr_lead';

export function leadThen(data: Record<string, unknown>, url = '/thank-you/') {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (private mode on some browsers): report from here instead
    // and give GTM a moment before leaving.
    const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
    let done = false;
    const go = () => { if (!done) { done = true; location.href = url; } };
    dl.push({ ...data, eventCallback: go, eventTimeout: 2000 });
    setTimeout(go, 2200);
    return;
  }
  location.href = url;
}
