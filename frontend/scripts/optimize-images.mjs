// Downscales and re-encodes everything in /public.
//
// Why: the folder held 95MB of raster images, including two 6720x4480 (30
// megapixel, 23MB) JPEGs. Vercel's image optimizer decodes each source into a raw
// bitmap inside a serverless function — a 30MP image is ~120MB of RGBA — which
// blows memory and burns the Hobby transformation quota. Once /_next/image starts
// failing, every next/image on the site breaks at once.
//
// Uses the sharp that Next already bundles; no new dependency.
//
// Format handling (nothing is silently degraded):
//   .svg                  skipped entirely
//   .jpg/.jpeg            resized + mozjpeg
//   .avif                 resized + re-encoded avif
//   .png WITH real alpha   stays png (transparency preserved)
//   .png fully opaque      converted to .jpg  <- caller must update code refs
//
// Run: node scripts/optimize-images.mjs [--dry]
// Originals are committed, so `git checkout -- frontend/public` restores them.

import sharp from "sharp";
import { readdir, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const PUBLIC = path.resolve(import.meta.dirname, "../public");
// Cap the LONGEST edge, not the width. Capping width alone leaves a portrait
// 3000x4500 source at 2560x3840 — bigger than any screen and, with the optimizer
// off, downloaded in full. 2048 covers a full-bleed hero on a 1080p/1440p display.
const MAX_EDGE = 2048;
const DRY = process.argv.includes("--dry");

const mb = (n) => (n / 1048576).toFixed(2) + "MB";

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// True only if some pixel is actually translucent. A photo saved as PNG with a
// fully-opaque alpha channel is just a large JPEG wearing a costume.
async function usesAlpha(file, meta) {
  if (!meta.hasAlpha) return false;
  const { data } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) return true;
  return false;
}

let before = 0, after = 0, converted = [], touched = 0, skipped = 0;

for await (const file of walk(PUBLIC)) {
  const ext = path.extname(file).toLowerCase();
  const rel = path.relative(PUBLIC, file);

  if (![".png", ".jpg", ".jpeg", ".avif", ".webp"].includes(ext)) {
    skipped++;
    continue;
  }

  const originalSize = (await stat(file)).size;
  before += originalSize;

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    console.warn(`  ! unreadable, left alone: ${rel}`);
    after += originalSize;
    continue;
  }

  let pipeline = sharp(file).resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });
  let outPath = file;

  if (ext === ".png") {
    if (await usesAlpha(file, meta)) {
      pipeline = pipeline.png({ compressionLevel: 9, palette: true });
    } else {
      pipeline = pipeline.flatten({ background: "#ffffff" }).jpeg({ quality: 80, mozjpeg: true });
      outPath = file.slice(0, -4) + ".jpg";
      converted.push([rel, path.relative(PUBLIC, outPath)]);
    }
  } else if (ext === ".avif") {
    pipeline = pipeline.avif({ quality: 60 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 80 });
  } else {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();

  // Never make a file bigger. Small icons are often already optimal.
  if (out.length >= originalSize && outPath === file) {
    after += originalSize;
    continue;
  }

  after += out.length;
  touched++;
  console.log(
    `  ${rel.padEnd(34)} ${mb(originalSize).padStart(8)} -> ${mb(out.length).padStart(8)}` +
      (outPath !== file ? `  (png->jpg)` : "")
  );

  if (!DRY) {
    await writeFile(outPath, out);
    if (outPath !== file) await unlink(file);
  }
}

console.log(`\n${DRY ? "[dry run] " : ""}${touched} re-encoded, ${skipped} skipped (svg/other)`);
console.log(`public/: ${mb(before)} -> ${mb(after)}  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`);
if (converted.length) {
  console.log(`\nPNG -> JPG (code references must be updated):`);
  for (const [from, to] of converted) console.log(`  /${from}  ->  /${to}`);
}
