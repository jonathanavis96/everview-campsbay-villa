// Generates two things from src/assets/everview_photos_webp/**:
//   1. src/assets/everview_photos_webp_thumb/**  — 192px-wide WebP derivatives,
//      for the 62x62 CSS thumbnail strips (HouseLevelsSection, BedroomsSection)
//      that were downloading the full ~1200px plate per thumbnail (MIS-459).
//   2. src/utils/photoDimensions.json — intrinsic width/height per photo, so
//      components can set <img width height> and stop the unsized-images CLS risk.
//
// Re-run after adding/removing photos under src/assets/everview_photos_webp.
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "src/assets/everview_photos_webp");
const THUMB_DIR = path.join(ROOT, "src/assets/everview_photos_webp_thumb");
const MANIFEST_PATH = path.join(ROOT, "src/utils/photoDimensions.json");
const THUMB_WIDTH = 192; // ~3x a 64px (w-16) CSS box, covers up to 3x DPR

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      yield full;
    }
  }
}

async function main() {
  const manifest = {};
  let count = 0;

  for await (const file of walk(SRC_DIR)) {
    const rel = path.relative(SRC_DIR, file); // e.g. "kitchen/breakfast_table_kitchen.webp"
    const slug = path.basename(rel).replace(/\.(webp|jpg|jpeg|png)$/i, "");

    const image = sharp(file);
    const meta = await image.metadata();
    manifest[slug] = { width: meta.width, height: meta.height };

    const thumbRel = rel.replace(/\.(jpe?g|png)$/i, ".webp");
    const thumbPath = path.join(THUMB_DIR, thumbRel);
    await mkdir(path.dirname(thumbPath), { recursive: true });

    let needsGenerate = true;
    try {
      const [srcStat, thumbStat] = await Promise.all([stat(file), stat(thumbPath)]);
      needsGenerate = srcStat.mtimeMs > thumbStat.mtimeMs;
    } catch {
      needsGenerate = true;
    }

    if (needsGenerate) {
      await sharp(file)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 65 })
        .toFile(thumbPath);
    }

    count += 1;
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`generate-thumbnails: ${count} photos processed, manifest written to ${path.relative(ROOT, MANIFEST_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
