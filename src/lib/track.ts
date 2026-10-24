// Sends a lead event to GTM and waits until GTM has fired its tags (or 2 s
// at most) before the page moves on, so conversion requests aren't cancelled
// by the redirect to the thank-you page.
export function trackThen(data: Record<string, unknown>, next: () => void) {
  let done = false;
  const go = () => { if (!done) { done = true; next(); } };
  const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
  dl.push({ ...data, eventCallback: go, eventTimeout: 2000 });
  setTimeout(go, 2200); // GTM not loaded yet or blocked: never leave the visitor waiting
}
