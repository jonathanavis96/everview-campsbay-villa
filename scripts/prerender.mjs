// Puts the above-fold markup into dist/index.html.
//
// `npm run build` runs three passes: the client build, an SSR-target build of
// src/entry-prerender.tsx into dist-ssr, and then this. It calls the SSR
// bundle's `render()` once for the site's single route and substitutes the
// result for the empty `<div id="root"></div>` the shell ships. React then
// hydrates that markup rather than building it from nothing — see
// src/entry-prerender.tsx for the measurement that motivated it.
//
// The two builds resolve the same asset imports independently, so this also
// asserts that every asset URL in the rendered markup actually exists in
// dist/. A silent hash mismatch would ship a hero <img> pointing at nothing.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, "dist-ssr/entry-prerender.js");
const BASE = "/everview-campsbay-villa/";
const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(SSR_ENTRY).href);
const markup = render(BASE);

// Every src/srcset URL the markup names, checked against what the client
// build actually wrote.
const referenced = new Set();
for (const [, attr] of markup.matchAll(/\b(?:src|srcSet|srcset)="([^"]+)"/g)) {
  for (const candidate of attr.split(",")) {
    const url = candidate.trim().split(/\s+/)[0];
    if (url.startsWith(BASE)) referenced.add(url);
  }
}
const missing = [...referenced].filter(
  (url) => !existsSync(path.join(DIST, url.slice(BASE.length))),
);
if (missing.length) {
  console.error("prerender: markup references assets the client build did not emit:");
  for (const url of missing) console.error(`  ${url}`);
  process.exit(1);
}

const indexPath = path.join(DIST, "index.html");
const html = await readFile(indexPath, "utf-8");
if (!html.includes(PLACEHOLDER)) {
  console.error(`prerender: ${PLACEHOLDER} not found in dist/index.html`);
  process.exit(1);
}
await writeFile(indexPath, html.replace(PLACEHOLDER, `<div id="root">${markup}</div>`));

console.log(
  `prerender: ${(Buffer.byteLength(markup) / 1024).toFixed(1)} KB of above-fold markup, ` +
    `${referenced.size} asset URLs verified`,
);
