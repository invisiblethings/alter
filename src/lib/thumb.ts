// Small card-size copy of a content image (see scripts/images/thumbs.mjs),
// or the original when no thumbnail exists.
import fs from 'node:fs';
import path from 'node:path';

export function thumb(src?: string): string | undefined {
  if (!src || !src.startsWith('/')) return src;
  const t = '/thumbs' + src.replace(/\.(jpe?g|png|webp)$/i, '.webp');
  return fs.existsSync(path.join(process.cwd(), 'public', t)) ? t : src;
}
