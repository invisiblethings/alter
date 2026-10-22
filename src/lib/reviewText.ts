// Makes long reviews scannable: escapes the text, then highlights the first
// sentence that says what customers value most (price, speed, honesty...).
const praise = /(one day|1 day|single day|honest|no hidden|price|fair|reasonabl|spotless|clean|recommend|best|on time|professional|quality|warrant|repair)/i;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function emphasize(text: string, max = 0): string {
  let t = text;
  if (max && t.length > max) t = t.slice(0, t.lastIndexOf(' ', max - 5)) + '…';
  const sentences = t.match(/[^.!?]+[.!?]*\s*/g) || [t];
  const i = sentences.findIndex((s) => praise.test(s) && s.trim().length > 25);
  return sentences.map((s, k) => (k === i ? `<mark>${esc(s.trim())}</mark> ` : esc(s))).join('').trim();
}
