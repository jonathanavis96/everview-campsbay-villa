// src/utils/photoLoader.ts
import type { Photo } from "@/components/lightbox/Lightbox";

/**
 * Core shape used by the resolver.
 * Keeps your existing fields and adds slug/subfolder/folders.
 */
export type PhotoBase = {
  slug: string;        // filename without extension
  src: string;         // URL resolved by Vite
  title?: string;      // derived from filename (or set upstream)
  category?: string;   // human name of primary folder (badge text)
  subfolder: string;   // first folder under the root (e.g. "bedrooms")
  folders?: string[];  // all folder segments under the root
  author?: string;     // preserved if you already set this elsewhere
};

// ---- Utilities ----

function toTitleCase(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

// "bedroom-master-5.webp" -> "Bedroom Master"
export function titleFromFilename(pathOrFile: string) {
  const file = (pathOrFile.split("/").pop() || "").replace(/\.(webp|jpg|jpeg|png)$/i, "");
  const cleaned = file
    .replace(/\d+\b/g, "") // drop trailing numbers
    .replace(/\s+/g, " ")
    .trim();
  return toTitleCase(cleaned);
}

/**
 * IMPORTANT: Vite requires a LITERAL string here (no variables or `${}`).
 * We glob EVERYTHING once, then filter by subfolder in JS.
 */
const ALL_IMAGES = import.meta.glob(
  "/src/assets/everview_photos_webp/**/*.{webp,jpg,jpeg,png}",
  { eager: true, as: "url" }
) as Record<string, string>;

/**
 * ORIGINAL-style loader for Lightbox (returns Photo[]).
 * Now filters from ALL_IMAGES to avoid dynamic globs.
 */
export function loadPhotosFrom(subfolder: string, category?: string): Photo[] {
  const effectiveCategory = category ?? toTitleCase(subfolder);

  const entries = Object.entries(ALL_IMAGES)
    // Match "/everview_photos_webp/<subfolder>/" anywhere in the path
    .filter(([path]) => path.includes(`/everview_photos_webp/${subfolder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

  return entries.map(([path, url]) => ({
    src: url,
    title: titleFromFilename(path),
    category: effectiveCategory,
  }));
}

/**
 * Returns PhotoBase objects for a single subfolder (flat).
 * Adds slug/subfolder/category so the resolver has what it needs.
 */
export function loadBasesFrom(subfolder: string, category?: string): PhotoBase[] {
  const effectiveCategory = category ?? toTitleCase(subfolder);

  const entries = Object.entries(ALL_IMAGES)
    .filter(([path]) => path.includes(`/everview_photos_webp/${subfolder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

  return entries.map(([path, url]) => {
    const parts = path.split("/");
    const file = parts[parts.length - 1] || "";
    const slug = file.replace(/\.(webp|jpg|jpeg|png)$/i, "");
    return {
      slug,
      src: url,
      title: titleFromFilename(file),
      category: effectiveCategory,
      subfolder,
      folders: [subfolder],
      // author: leave undefined here; preserve your upstream logic if you set it
    } as PhotoBase;
  });
}

/**
 * Automatically load ALL images from ANY depth under the root.
 * Useful for Gallery pages where you want everything without lists.
 */
export function loadAllBasesAuto(): PhotoBase[] {
  return Object.entries(ALL_IMAGES)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, url]) => {
      // path like: /src/assets/everview_photos_webp/bedrooms/master-suite/bed-1.webp
      const parts = path.split("/");
      const file = parts[parts.length - 1] || "";
      const slug = file.replace(/\.(webp|jpg|jpeg|png)$/i, "");

      // find folders after "everview_photos_webp"
      const rootIdx = parts.indexOf("everview_photos_webp");
      const folders = rootIdx >= 0 ? parts.slice(rootIdx + 1, parts.length - 1) : [];
      const primary = folders[0] || "gallery";

      return {
        slug,
        src: url,
        title: titleFromFilename(file),
        category: toTitleCase(primary),
        subfolder: primary,
        folders,
        // author: leave undefined; your pipeline can still set it elsewhere
      } as PhotoBase;
    });
}

/**
 * Helper: load multiple known subfolders and flatten.
 */
export function loadAllBasesFrom(
  folders: string[],
  withCategory?: Record<string, string>
): PhotoBase[] {
  return folders.flatMap((f) => loadBasesFrom(f, withCategory?.[f]));
}
