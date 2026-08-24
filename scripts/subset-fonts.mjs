// Subsets the three self-hosted variable fonts down to the characters the
// site and the brochure actually render, keeping every variable axis alive
// (Fraunces' opsz/SOFT/WONK, Archivo's width axis via font-stretch) so
// `font-variation-settings` and `font-weight: 100 900` keep working exactly
// as before — only the *glyph table* shrinks, not the design space.
//
// Why this exists: the three woff2 files under src/assets/fonts/ are 211 KB
// combined and sit on the hero's critical path (MIS perf work, 2026-08-24).
// They already ship as "-latin" subsets from the font vendor, but that is
// still the whole Latin script — thousands of glyphs this site never uses.
//
// Re-run this whenever new site or brochure copy could plausibly introduce a
// character outside "printable ASCII + Latin-1 + the extra punctuation
// listed below": a new guest name with an unusual accent, a new symbol in
// rates/reviews JSON, a new brochure page. Re-running is cheap and safe —
// worst case it re-derives the same charset and produces byte-identical
// output.
//
// How the charset is derived (see CHARSET below): every .ts/.tsx file under
// src/, the JSON content files, and the static brochure HTML are read and
// their literal characters unioned together, then the whole of Basic Latin
// (0x20-0x7E) and Latin-1 Supplement (0xA0-0xFF) is added as a safety
// margin — cheap in bytes, and it means a glyph nobody screenshotted still
// renders. A short list of typographic characters the design uses that fall
// outside Latin-1 (em/en dash, curly quotes, ellipsis, bullet, euro, arrow,
// ≥, box-drawing rule) is added explicitly, since they cannot come from a
// codepoint-range safety margin.
//
// Requires fontTools' pyftsubset (`pip install fonttools[woff]` — variable
// font + woff2 support needs the `[woff]` extra for brotli). This repo was
// subset with fontTools 4.61.1 via `~/.local/bin/pyftsubset`.
//
// Usage: node scripts/subset-fonts.mjs

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FULL_DIR = path.join(ROOT, "src/assets/fonts/full");
const DEST_DIRS = [
  path.join(ROOT, "src/assets/fonts"),
  path.join(ROOT, "public/fonts"),
];

// Source files whose literal text contributes to the charset. Covers every
// place a human-authored string can reach the page: component copy, content
// JSON, and the standalone brochure (which can't import the bundled CSS, so
// it carries its own copy of these fonts — see public/fonts/README below).
const TEXT_SOURCE_GLOBS = [
  "src", // walked recursively below, .ts/.tsx only
  "src/content/rates.json",
  "src/content/reviews.json",
  "public/brochures/welcome-brochure.html",
  "index.html",
];

// Typographic characters the design system uses that fall outside Latin-1,
// so a codepoint-range safety margin can't catch them. Curly quotes are
// included even though no current source string uses a literal ’ or “ —
// they are exactly the kind of character a future edit introduces without
// anyone thinking about font coverage.
const EXTRA_CHARS =
  "‘’“”" + // ‘ ’ “ ”
  "–—" + // – —
  "•" + // •
  "…" + // …
  "€" + // €
  "→" + // →
  "≥" + // ≥
  "─"; // ─

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx?|json)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

function deriveCharset() {
  const files = [];
  for (const rel of TEXT_SOURCE_GLOBS) {
    const full = path.join(ROOT, rel);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }

  const chars = new Set(EXTRA_CHARS);
  for (const file of files) {
    for (const ch of fs.readFileSync(file, "utf8")) chars.add(ch);
  }
  // Basic Latin + Latin-1 Supplement safety margin.
  for (let cp = 0x20; cp <= 0x7e; cp++) chars.add(String.fromCodePoint(cp));
  for (let cp = 0xa0; cp <= 0xff; cp++) chars.add(String.fromCodePoint(cp));

  return { chars: [...chars].join(""), fileCount: files.length };
}

const FONTS = [
  "fraunces-variable-latin.woff2",
  "archivo-variable-latin.woff2",
  "ibm-plex-mono-400-latin.woff2",
];

function findPyftsubset() {
  const candidates = [
    path.join(process.env.HOME ?? "", ".local/bin/pyftsubset"),
    "pyftsubset",
  ];
  for (const c of candidates) {
    try {
      execFileSync(c, ["--help"], { stdio: "ignore" });
      return c;
    } catch {
      // try next
    }
  }
  throw new Error(
    "pyftsubset not found (tried ~/.local/bin/pyftsubset and PATH). Install fontTools: pip install fonttools[woff]",
  );
}

function main() {
  const { chars, fileCount } = deriveCharset();
  console.log(`Derived charset from ${fileCount} source files: ${chars.length} unique characters`);

  const pyftsubset = findPyftsubset();
  const charsFile = path.join(ROOT, ".font-subset-charset.txt");
  fs.writeFileSync(charsFile, chars, "utf8");

  for (const fontFile of FONTS) {
    const src = path.join(FULL_DIR, fontFile);
    if (!fs.existsSync(src)) {
      throw new Error(`missing full source font: ${src}`);
    }
    const before = fs.statSync(src).size;

    const tmpOut = path.join(ROOT, `.${fontFile}.subset.tmp`);
    execFileSync(pyftsubset, [
      src,
      `--output-file=${tmpOut}`,
      `--text-file=${charsFile}`,
      "--flavor=woff2",
      "--layout-features=*",
      // Hinting is kept (the default), deliberately overriding the
      // otherwise-standard `--no-hinting` webfont recipe. Measured
      // 2026-08-24: with --no-hinting, Chromium's glyph-advance rounding
      // shifts by a few px across a full paragraph, which is enough to
      // flip a line wrap at the container's exact width (verified with an
      // isolated @font-face test: --no-hinting reflows a Fraunces
      // testimonial paragraph, keeping hinting does not — 0px difference).
      // The bytes hinting instructions cost are worth it for byte-identical
      // layout; see the isolated-test note in the perf/subset-fonts PR.
      //
      // fvar/gvar/avar/STAT are not in pyftsubset's default drop-tables
      // list, so the variable axes (weight, Archivo's width, Fraunces'
      // opsz/SOFT/WONK) survive subsetting untouched — no extra flag
      // needed. Verified per-font after this script runs.
    ]);

    const after = fs.statSync(tmpOut).size;
    console.log(
      `${fontFile}: ${before.toLocaleString()} B -> ${after.toLocaleString()} B (${(100 * (1 - after / before)).toFixed(1)}% smaller)`,
    );

    for (const destDir of DEST_DIRS) {
      fs.copyFileSync(tmpOut, path.join(destDir, fontFile));
    }
    fs.rmSync(tmpOut);
  }

  fs.rmSync(charsFile);
  console.log(
    "Done. Verify fvar axes survived: fonttools ttLib.woff2 decompress, then check the fvar table of each font in src/assets/fonts/.",
  );
}

main();
