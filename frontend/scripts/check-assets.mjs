// Verifies every /public asset referenced from code exists WITH EXACT CASE.
//
// Why this exists: macOS is case-insensitive, Vercel's Linux filesystem is not, and
// `git config core.ignorecase` is true — so `/logo.png` pointing at a committed
// `Logo.png` works perfectly on a dev machine and 404s in production, with git
// never reporting a thing. This checks against `git ls-files` (the real committed
// names) rather than the filesystem, which is the only way to catch it locally.
//
// Run: node scripts/check-assets.mjs   (also wired into `npm run build`)

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.resolve(ROOT, "public");

// readdir reports the name as the filesystem actually stores it. macOS preserves
// case even though it matches case-insensitively, so this gives us the true name
// — the one Vercel's Linux filesystem will demand — without needing a git commit
// or a staged index first.
async function listPublic(dir, base = "") {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await listPublic(path.join(dir, e.name), rel)));
    else out.push(rel);
  }
  return out;
}

// Next's metadata file conventions turn certain files in app/ into rooted URLs
// that are served like public assets but live nowhere near /public — e.g.
// app/opengraph-image.jpg is served at /opengraph-image.jpg. They are just as
// case-sensitive on Vercel as anything in /public, so they belong in the same
// check rather than being skipped.
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/.
const METADATA_FILE =
  /^(?:favicon|icon\d*|apple-icon\d*|opengraph-image\d*|twitter-image\d*)\.(?:ico|jpe?g|png|svg|gif)$/i;

async function listAppMetadata(dir, segments = []) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      // Route groups (group) and parallel routes @slot don't appear in the URL;
      // private folders _foo aren't routable at all.
      if (e.name.startsWith("_")) continue;
      const hidden = /^[(@]/.test(e.name);
      out.push(
        ...(await listAppMetadata(
          path.join(dir, e.name),
          hidden ? segments : [...segments, e.name]
        ))
      );
    } else if (METADATA_FILE.test(e.name)) {
      out.push([...segments, e.name].join("/"));
    }
  }
  return out;
}

const committed = new Set([
  ...(await listPublic(PUBLIC)),
  ...(await listAppMetadata(path.resolve(ROOT, "app"))),
]);
const byLower = new Map([...committed].map((f) => [f.toLowerCase(), f]));

const SKIP = new Set(["node_modules", ".next", ".git", "public", "scripts"]);
const CODE = /\.(tsx?|jsx?|css)$/;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (CODE.test(e.name)) yield full;
  }
}

// Any rooted string literal that looks like an asset, plus css url(...).
const LITERAL =
  /["'`](\/[^"'`\s)]*\.(?:png|jpe?g|avif|webp|svg|gif|ico))["'`]/gi;
// (?<![\w$-]) so this matches the CSS `url(` token and not the tail of an
// identifier — `absoluteUrl("/kaara")` in lib/seo.ts otherwise reads as a CSS
// url() pointing at a missing image, and every route path becomes a false
// positive.
const CSS_URL = /(?<![\w$-])url\(\s*['"]?(\/[^"'`)\s]+)['"]?\s*\)/gi;

const missing = [];
const wrongCase = [];

for await (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const re of [LITERAL, CSS_URL]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line))) {
        const ref = m[1].replace(/^\//, "");
        if (committed.has(ref)) continue;
        const where = `${path.relative(ROOT, file)}:${i + 1}`;
        const actual = byLower.get(ref.toLowerCase());
        if (actual) wrongCase.push({ ref, actual, where });
        else missing.push({ ref, where });
      }
    }
  });
}

for (const { ref, actual, where } of wrongCase) {
  console.error(`CASE  /${ref}  ->  file on disk is /${actual}\n      ${where}`);
}
for (const { ref, where } of missing) {
  console.error(`MISS  /${ref}\n      ${where}`);
}

if (wrongCase.length || missing.length) {
  console.error(
    `\n✗ ${wrongCase.length} case mismatch(es), ${missing.length} missing file(s).` +
      `\n  These resolve on macOS but 404 on Vercel's case-sensitive filesystem.`
  );
  process.exit(1);
}
console.log("✓ every referenced asset exists with exact case");
