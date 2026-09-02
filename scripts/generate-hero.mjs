// Regenerates the hero's responsive derivatives from the full-resolution
// original in photo-originals/hero, plus the Open Graph card, which is the
// same photograph cropped to 1200x630.
//
// The hero <img> is the page's LCP element, so these files are the single
// biggest lever on the field LCP. The widths must stay in step with the
// srcSet in src/components/HeroSection.tsx and the preload widths in
// vite.config.ts's heroPreloadPlugin.
//
//   node scripts/generate-hero.mjs
//
// The original is deliberately untracked (see .gitignore); the derivatives
// under src/assets/hero are what ship.
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "photo-originals/hero/everview-hero-4096x2732.png");
const OUT_DIR = path.join(ROOT, "src/assets/hero");
const OG_PATH = path.join(ROOT, "public/social/og-image.jpg");

const WIDTHS = [640, 960, 1280, 1920, 2048];

// Quality settings chosen against this photograph, not in the abstract: the
// sky is a smooth gradient, which is where AVIF and WebP band first, and the
// pool is a large flat field. Each value is the lowest that showed no banding
// at 2048 on a wide-gamut display.
const AVIF = { quality: 52, effort: 6, chromaSubsampling: "4:2:0" };
const WEBP = { quality: 75, effort: 6 };
const JPEG = { quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const meta = await sharp(SOURCE).metadata();
  console.log(`source: ${meta.width}x${meta.height} ${meta.format}`);

  for (const width of WIDTHS) {
    // A single decoded, resized pipeline per width, re-encoded three ways, so
    // the three formats are guaranteed to be the same pixels.
    const resized = sharp(SOURCE).resize({ width, fit: "inside", withoutEnlargement: true });

    const targets = [
      [`hero-${width}.avif`, resized.clone().avif(AVIF)],
      [`hero-${width}.webp`, resized.clone().webp(WEBP)],
      [`hero-${width}.jpg`, resized.clone().jpeg(JPEG)],
    ];

    for (const [name, pipeline] of targets) {
      const file = path.join(OUT_DIR, name);
      await pipeline.toFile(file);
      const { size } = await stat(file);
      console.log(`  ${name.padEnd(16)} ${kb(size).padStart(10)}`);
    }
  }

  // The OG card is 1200x630 — a wider crop than the photograph's 3:2, so it
  // is cropped rather than letterboxed, anchored on the centre where the
  // house and the sunset sit.
  const og = await sharp(SOURCE)
    .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  await writeFile(OG_PATH, og);
  console.log(`  og-image.jpg     ${kb(og.length).padStart(10)}`);
}

main();
