// Generates three things from src/assets/everview_photos_webp/**:
//   1. src/assets/everview_photos_webp_thumb/** — 192px-wide WebP derivatives,
//      for the 62x62 CSS thumbnail strips (HouseLevelsSection, BedroomsSection)
//      that were downloading the full ~1200px plate per thumbnail (MIS-459).
//   2. src/assets/everview_photos_webp_lead/** — 640px-wide WebP derivatives,
//      for the "lead" spread photo in each space/room, which renders at
//      ~637 device-px on mobile but was shipping the full ~1200px plate
//      (image-delivery-insight still flagged these after the thumb fix).
//   3. src/utils/photoDimensions.json — intrinsic width/height of the
//      *original* plate, so components can set <img width height> and stop
//      the unsized-images CLS risk.
//
// Re-run after adding/removing photos under src/assets/everview_photos_webp.
import { readdir, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "src/assets/everview_photos_webp");
const THUMB_DIR = path.join(ROOT, "src/assets/everview_photos_webp_thumb");
const LEAD_DIR = path.join(ROOT, "src/assets/everview_photos_webp_lead");
const MANIFEST_PATH = path.join(ROOT, "src/utils/photoDimensions.json");
const THUMB_WIDTH = 192; // ~3x a 64px (w-16) CSS box, covers up to 3x DPR
const LEAD_WIDTH = 640; // matches the ~637 device-px width Lighthouse measured for lead spreads

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
  // The previous manifest carries each photograph's content hash, which is
  // what tells us whether a derivative is stale.
  let previous = {};
  try {
    previous = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    previous = {};
  }
  let count = 0;

  for await (const file of walk(SRC_DIR)) {
    const rel = path.relative(SRC_DIR, file); // e.g. "kitchen/breakfast_table_kitchen.webp"
    const slug = path.basename(rel).replace(/\.(webp|jpg|jpeg|png)$/i, "");

    const image = sharp(file);
    const meta = await image.metadata();
    manifest[slug] = { width: meta.width, height: meta.height };

    const derivativeRel = rel.replace(/\.(jpe?g|png)$/i, ".webp");

    const thumbPath = path.join(THUMB_DIR, derivativeRel);
    const leadPath = path.join(LEAD_DIR, derivativeRel);
    await mkdir(path.dirname(thumbPath), { recursive: true });
    await mkdir(path.dirname(leadPath), { recursive: true });

    // Freshness is decided on the *content* of the original, not on its
    // modification time. Reordering a folder by renaming files swaps their
    // contents while carrying the old mtimes along, so an mtime check happily
    // leaves every derivative pointing at the photograph that used to have
    // that name — thumbnails that silently show the wrong room (2026-08-24).
    const srcBytes = await readFile(file);
    const srcHash = createHash("sha1").update(srcBytes).digest("hex").slice(0, 16);
    const previousHash = previous[slug]?.hash;
    manifest[slug].hash = srcHash;

    async function needsGenerate(outPath) {
      if (previousHash !== srcHash) return true;
      try {
        await stat(outPath);
        return false;
      } catch {
        return true;
      }
    }

    if (await needsGenerate(thumbPath)) {
      await sharp(file)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 65 })
        .toFile(thumbPath);
    }

    // Skip the lead derivative when the original is already narrower than
    // LEAD_WIDTH — withoutEnlargement would just copy it, wasting a file.
    if ((meta.width ?? 0) > LEAD_WIDTH && (await needsGenerate(leadPath))) {
      await sharp(file)
        .resize({ width: LEAD_WIDTH, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(leadPath);
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
