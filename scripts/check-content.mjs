#!/usr/bin/env node
// Fails the build pipeline (not `npm run build` itself — the Pages preview
// must keep rendering) while any invented content still carries
// `placeholder: true`. design-direction §14.2 — see src/lib/reviews.ts.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const reviewsPath = path.join(rootDir, "src/content/reviews.json");

const reviews = JSON.parse(readFileSync(reviewsPath, "utf-8"));
const placeholders = reviews.filter((r) => r.placeholder);

if (placeholders.length > 0) {
  console.error(
    `check:content FAILED — ${placeholders.length} placeholder review(s) still in src/content/reviews.json:`,
  );
  for (const r of placeholders) {
    console.error(`  - ${r.id}`);
  }
  console.error(
    "Replace each with a real guest review (and set placeholder: false) before this check can pass.",
  );
  process.exit(1);
}

console.log("check:content OK — no placeholder reviews remain.");
