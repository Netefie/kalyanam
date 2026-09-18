// Finds images that render at zero size — a hole in the page where a photo
// should be.
//
// Why this exists: next/image with `fill` renders the <img> as position:absolute,
// so its parent has no content size of its own. The parent has to get its size
// from CSS at *every* breakpoint, and must not be shrink-to-fit. When a media
// query takes that size away — `margin:auto` on a grid item, a grid row that
// switches to `auto`, `height:auto` on an absolutely positioned box — the image
// collapses to 0px. It still loads, the console stays silent, and the only
// symptom is a blank gap that nobody sees until they open the site on a phone.
// Three of these shipped before this check existed.
//
// The interesting part is telling a broken image from a deliberately hidden one:
// plenty of sections legitimately hide a desktop-only layout on mobile. So an
// element only counts as broken when it has NO display:none / visibility:hidden
// ancestor but still measures under 2px.
//
// Run: npm run dev, then in another shell:
//        npm run check:mobile-images
//      BASE_URL=http://localhost:3001 npm run check:mobile-images
//      WIDTHS=360,414 npm run check:mobile-images
//
// Not part of `npm run build` — unlike check-assets.mjs this needs a server
// already running and a local Chrome.

import { spawn } from "node:child_process";
import { readdir, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.resolve(ROOT, "app");

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const WIDTHS = (process.env.WIDTHS || "360,390,768")
  .split(",")
  .map((w) => Number(w.trim()))
  .filter((w) => Number.isFinite(w) && w > 0);

// Routes that render a shell the guest never sees standing still (the admin
// panel needs a login) or aren't pages at all.
const SKIP_SEGMENTS = new Set(["admin", "api"]);

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------ route discovery ---------------------------- */

// Every app/**/page.tsx is a route; the path to it IS the URL. Dynamic segments
// ([slug]) can't be fetched without knowing a value, and route groups ((foo))
// don't appear in the URL — neither exists today, both are handled so this
// doesn't quietly break later.
async function listRoutes(dir = APP, base = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_SEGMENTS.has(entry.name)) continue;
      if (entry.name.startsWith("[")) continue; // dynamic segment
      const segment = entry.name.startsWith("(") ? "" : `/${entry.name}`; // route group
      out.push(...(await listRoutes(path.join(dir, entry.name), base + segment)));
    } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
      out.push(base || "/");
    }
  }
  return out.sort();
}

/* ---------------------------------- chrome --------------------------------- */

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error(
      "No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary:\n" +
        CHROME_CANDIDATES.map((p) => `  tried ${p}`).join("\n")
    );
    process.exit(1);
  }
  return found;
}

// A CDP session over Node's built-in WebSocket — no puppeteer dependency for
// what amounts to "navigate, measure, repeat".
async function connect(port) {
  let pageTarget;
  for (let i = 0; i < 60; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      pageTarget = targets.find((t) => t.type === "page");
      if (pageTarget) break;
    } catch {
      // Chrome hasn't opened the port yet.
    }
    await sleep(250);
  }
  if (!pageTarget) throw new Error("Chrome did not expose a debugging target");

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("Could not open a CDP connection"));
  });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const resolve = pending.get(message.id);
    if (resolve) {
      pending.delete(message.id);
      resolve(message);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const messageId = ++id;
      pending.set(messageId, resolve);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });

  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return res.result?.result?.value;
  };

  return { ws, send, evaluate };
}

/* --------------------------------- the audit -------------------------------- */

// Runs in the page. Returns every <img> that is laid out (no hidden ancestor)
// yet measures under 2px in either direction.
const AUDIT = `(() => {
  const label = (el) => {
    const bits = [];
    for (let n = el; n && n.nodeType === 1 && bits.length < 3; n = n.parentElement) {
      const cls = typeof n.className === "string" && n.className.trim()
        ? "." + n.className.trim().split(/\\s+/).slice(0, 2).join(".")
        : "";
      bits.unshift(n.tagName.toLowerCase() + cls);
    }
    return bits.join(">");
  };

  // A section that hides its desktop layout on mobile is doing its job — only
  // an element that is *supposed* to be on screen counts as broken.
  const deliberatelyHidden = (el) => {
    for (let n = el; n && n.tagName !== "BODY"; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") return true;
    }
    return false;
  };

  const out = [];
  for (const img of document.querySelectorAll("img")) {
    if (deliberatelyHidden(img)) continue;
    const r = img.getBoundingClientRect();
    if (r.width >= 2 && r.height >= 2) continue;
    out.push({
      where: label(img),
      w: Math.round(r.width),
      h: Math.round(r.height),
      src: (img.currentSrc || img.src).split("/").pop().split("?")[0],
    });
  }
  return JSON.stringify(out);
})()`;

async function measure({ send, evaluate }, route) {
  await send("Page.navigate", { url: BASE_URL + route });
  for (let i = 0; i < 200; i++) {
    if ((await evaluate("document.readyState")) === "complete") break;
    await sleep(200);
  }
  // Hydration, client-side fetches (the room list), and fonts.
  await sleep(2500);
  // Lazy-loaded images below the fold never get a size until they're reached.
  await evaluate("window.scrollTo(0, document.body.scrollHeight); true");
  await sleep(1200);
  await evaluate("window.scrollTo(0, 0); true");
  await sleep(500);
  return JSON.parse((await evaluate(AUDIT)) || "[]");
}

/* ----------------------------------- main ----------------------------------- */

const chromePath = findChrome();

try {
  const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(
    `Could not reach ${BASE_URL} (${err.message}).\n` +
      "Start the site first (npm run dev), or point BASE_URL at a running one."
  );
  process.exit(1);
}

const routes = await listRoutes();
const port = 9222 + Math.floor(Math.random() * 500);
const profile = await mkdtemp(path.join(tmpdir(), "kalyanam-image-check-"));

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--hide-scrollbars",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" }
);

let session;
const problems = [];

try {
  session = await connect(port);
  await session.send("Page.enable");
  await session.send("Runtime.enable");

  for (const width of WIDTHS) {
    await session.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 844,
      deviceScaleFactor: 1,
      mobile: width < 800,
    });

    for (const route of routes) {
      for (const hit of await measure(session, route)) {
        problems.push({ route, width, ...hit });
      }
    }
  }
} finally {
  session?.ws.close();
  chrome.kill();
}

if (problems.length > 0) {
  for (const p of problems) {
    console.error(
      `COLLAPSED  ${p.route}  @${p.width}px  ${p.where}  [${p.w}x${p.h}]  ${p.src}`
    );
  }
  console.error(
    `\n${problems.length} image(s) render at zero size while laid out on the page.\n` +
      "Each one is a blank gap. The container of a `fill` image needs a height or an\n" +
      "aspect-ratio at this breakpoint, and must not be shrink-to-fit (no margin:auto\n" +
      "on a grid item, no float, no auto-sized grid row)."
  );
  process.exit(1);
}

console.log(
  `✓ no collapsed images (${routes.length} routes × ${WIDTHS.length} widths: ${WIDTHS.join(", ")}px)`
);
