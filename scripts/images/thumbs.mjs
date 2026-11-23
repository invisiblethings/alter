// Card thumbnails: related-page and blog cards show images at ~400 px wide,
// so they load a 640 px WebP copy instead of the full photo. Writes
// public/thumbs/<same path>.webp for every content image over 40 KB.
// Run after adding images: npm run thumbs (src/lib/thumb.ts falls back to
// the original when no thumbnail exists).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PUB = path.join(ROOT, 'public');
const dirs = ['wp-content/uploads', 'images/guides'];
const exts = /\.(jpe?g|png|webp)$/i;
let made = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const dir of dirs) {
  for (const file of walk(path.join(PUB, dir))) {
    if (!exts.test(file) || fs.statSync(file).size < 40 * 1024) continue;
    const rel = path.relative(PUB, file);
    const out = path.join(PUB, 'thumbs', rel.replace(exts, '.webp'));
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(file).mtimeMs) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(file).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
    made++;
  }
}
console.log(`thumbnails written: ${made}`);
