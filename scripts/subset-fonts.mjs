// Shrinks the three self-hosted variable fonts down to (1) the variable
// axes the site actually varies and (2) the characters the site and the
// brochure actually render.
//
// Why this exists: the three woff2 files under src/assets/fonts/ sit on the
// hero's critical path (MIS perf work, 2026-08-24). They already ship as
// "-latin" subsets from the font vendor, but that is still the whole Latin
// script's worth of glyphs across every axis position, most of which this
// site never asks for.
//
// Two separate savings, in order:
//
// 1. Axis pinning (fonttools varLib.instancer). Read src/index.css (grepped
//    2026-08-24, see AXIS_PINS below and the repo-wide grep this script
//    would need re-running if new copy shows up): Fraunces is only ever
//    used at "SOFT" 0, "WONK" 0, with opsz/wght varying. Archivo declares
//    `font-stretch: 62% 125%` on its @font-face but nothing in the site
//    ever sets a width other than the default 100. SOFT carries a full set
//    of deltas — pinning it before subsetting is most of Fraunces' saving.
//    WONK is NOT pinned despite always being set to 0 — see the long
//    comment on AXIS_PINS for why (a real fontTools instancer bug on this
//    font, not a site-usage question). IBM Plex Mono is a static font (no
//    fvar) and is left alone. Axes that ARE pinned here are DROPPED from
//    the font entirely — pin only an axis nothing on the site varies, and
//    verify the pinned value actually matches what the live font renders
//    at that value (see the WONK story), or the browser/the font silently
//    renders something different. Pinning Archivo's wdth means
//    `font-stretch: 62% 125%` must also be removed from every @font-face
//    declaring Archivo (src/index.css and public/brochures/*.html) — a
//    stretch range on a font with no width axis left asks the browser to
//    synthesize a width, which is a visible regression this script cannot
//    catch on its own. This script does not edit those @font-face blocks;
//    that was done by hand alongside it.
//
// 2. Glyph subsetting (pyftsubset), same as before: the charset is derived
//    from every .ts/.tsx file under src/, the JSON content files, and the
//    static brochure HTML, unioned together, then the whole of Basic Latin
//    (0x20-0x7E) and Latin-1 Supplement (0xA0-0xFF) is added as a safety
//    margin — cheap in bytes, and it means a glyph nobody screenshotted
//    still renders. A short list of typographic characters the design uses
//    that fall outside Latin-1 (em/en dash, curly quotes, ellipsis, bullet,
//    euro, arrow, ≥, box-drawing rule) is added explicitly, since they
//    cannot come from a codepoint-range safety margin.
//
// Hinting is kept (pyftsubset's default) rather than passing the more usual
// `--no-hinting`: measured 2026-08-24 that dropping it shifts Chromium's
// glyph-advance rounding by a few px across a paragraph, which was enough
// to flip a line wrap in a testimonial quote. An isolated @font-face test
// confirmed keeping hinting produces 0px difference against the original
// font. The extra bytes are worth it for byte-identical layout.
//
// Re-run this whenever:
//   - new site or brochure copy could introduce a character outside
//     "printable ASCII + Latin-1 + the extra punctuation listed below" (a
//     guest name with an unusual accent, a new symbol in rates/reviews
//     JSON, a new brochure page) — re-deriving the charset is cheap and
//     safe, worst case it produces byte-identical output.
//   - new site or brochure copy sets `font-variation-settings`,
//     `font-stretch`, or `font-weight` to a value outside what AXIS_PINS
//     below assumes (see the repo-wide grep note above) — in that case,
//     update AXIS_PINS (or stop pinning that axis) BEFORE re-running, or
//     the new copy will render with a synthesized/wrong axis value.
//
// Requires fontTools' pyftsubset and varLib.instancer
// (`pip install fonttools[woff]` — variable font + woff2 support needs the
// `[woff]` extra for brotli). This repo was processed with fontTools 4.61.1
// via `~/.local/bin/pyftsubset` and `~/.local/bin/fonttools`.
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
// it carries its own copy of these fonts).
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

// Axes to pin (drop) per font before subsetting. Verified against
// src/index.css and public/brochures/welcome-brochure.html 2026-08-24: the
// site only ever sets Fraunces' SOFT/WONK to 0 and never sets Archivo's
// width away from its default 100. Axes NOT listed here (opsz, wght) are
// left as full ranges because the site varies them.
//
// WONK is deliberately NOT pinned even though the site always sets it to
// 0. Measured 2026-08-24: pinning WONK via varLib.instancer breaks
// Fraunces' GSUB "rvrn" (required variation) resolution for at least the
// ampersand — an isolated @font-face test held font-variation-settings at
// "WONK" 0 for both fonts and got a plain "&" from the live/unpinned font
// but a swash "&" from the WONK-pinned one, i.e. pinning it changes what
// explicitly requesting the pinned value renders. That is a fontTools
// instancer limitation on this specific font, not a case of the site
// varying the axis — pinning WONK is unsafe regardless. It also barely
// contributes bytes on its own (121,016 -> 120,496 B pinned alone), so
// nothing meaningful is given up by leaving it live. SOFT pins cleanly
// (verified the same way: matches the live font exactly) and carries
// nearly all of Fraunces' pinning saving.
const AXIS_PINS = {
  "fraunces-variable-latin.woff2": { SOFT: 0 },
  "archivo-variable-latin.woff2": { wdth: 100 },
  "ibm-plex-mono-400-latin.woff2": null, // static font, no fvar — skip instancer
};

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

function findTool(names) {
  for (const c of names) {
    try {
      execFileSync(c, ["--help"], { stdio: "ignore" });
      return c;
    } catch {
      // try next
    }
  }
  throw new Error(
    `none of [${names.join(", ")}] found. Install fontTools: pip install fonttools[woff]`,
  );
}

function main() {
  const { chars, fileCount } = deriveCharset();
  console.log(`Derived charset from ${fileCount} source files: ${chars.length} unique characters`);

  const home = process.env.HOME ?? "";
  const pyftsubset = findTool([path.join(home, ".local/bin/pyftsubset"), "pyftsubset"]);
  const fonttools = findTool([path.join(home, ".local/bin/fonttools"), "fonttools"]);

  const charsFile = path.join(ROOT, ".font-subset-charset.txt");
  fs.writeFileSync(charsFile, chars, "utf8");

  for (const fontFile of FONTS) {
    const src = path.join(FULL_DIR, fontFile);
    if (!fs.existsSync(src)) {
      throw new Error(`missing full source font: ${src}`);
    }
    const originalBytes = fs.statSync(src).size;

    // Step 1: pin axes the site never varies (skip for static fonts).
    const pins = AXIS_PINS[fontFile];
    let instancerInput = src;
    let pinnedTmp = null;
    if (pins) {
      pinnedTmp = path.join(ROOT, `.${fontFile}.pinned.tmp`);
      const pinArgs = Object.entries(pins).map(([axis, value]) => `${axis}=${value}`);
      execFileSync(fonttools, [
        "varLib.instancer",
        src,
        ...pinArgs,
        `-o`,
        pinnedTmp,
        "--no-recalc-timestamp",
      ]);
      instancerInput = pinnedTmp;
    }
    const afterPinBytes = fs.statSync(instancerInput).size;

    // Step 2: subset glyphs to the derived charset, keeping hinting and
    // every remaining variable axis.
    const tmpOut = path.join(ROOT, `.${fontFile}.subset.tmp`);
    execFileSync(pyftsubset, [
      instancerInput,
      `--output-file=${tmpOut}`,
      `--text-file=${charsFile}`,
      "--flavor=woff2",
      "--layout-features=*",
      // Hinting kept — see file header. fvar/gvar/avar/STAT are not in
      // pyftsubset's default drop-tables list, so any axis instancer left
      // alone (opsz, wght) survives subsetting untouched.
    ]);

    const finalBytes = fs.statSync(tmpOut).size;
    const pinNote = pins ? ` (pin: ${JSON.stringify(pins)} -> ${afterPinBytes.toLocaleString()} B)` : "";
    console.log(
      `${fontFile}: ${originalBytes.toLocaleString()} B -> ${finalBytes.toLocaleString()} B ` +
        `(${(100 * (1 - finalBytes / originalBytes)).toFixed(1)}% smaller)${pinNote}`,
    );

    for (const destDir of DEST_DIRS) {
      fs.copyFileSync(tmpOut, path.join(destDir, fontFile));
    }
    fs.rmSync(tmpOut);
    if (pinnedTmp) fs.rmSync(pinnedTmp);
  }

  fs.rmSync(charsFile);
  console.log(
    "Done. Verify fvar axes: read the fvar table of each font in src/assets/fonts/ and confirm pinned axes are gone, others intact.",
  );
}

main();
