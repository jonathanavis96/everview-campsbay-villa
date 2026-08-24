// src/utils/photoCatalog.ts
import { autoTagsFor } from "@/utils/autoTag";
import type { PhotoBase } from "@/utils/photoLoader";
import { loadAllBases, loadAllBasesAuto, loadBasesFrom, loadBasesInFolder, loadBasesUnderFolder } from "@/utils/photoLoader";
import type { CatalogEntry, Copy } from "@/utils/types/photos";
import { PHOTO_CATALOG } from "./content/photoCatalog";

// UI-agnostic shape that matches your Lightbox Photo structurally
type LightboxLike = { src: string; title?: string; category?: string };

export type ResolvedPhoto = PhotoBase & {
  description?: string;
  tags: string[];
};

export const BEDROOM_FOLDER = "bedrooms";

/* ---------------- core resolve ---------------- */

export function resolvePhotoForSection(
  base: PhotoBase,
  section: string
): ResolvedPhoto {
  const entry: CatalogEntry | undefined = PHOTO_CATALOG[base.slug];

  let title = base.title ?? base.slug;
  let description: string | undefined;
  let category = base.category;

  if (entry?.default) {
    title = entry.default.title ?? title;
    description = entry.default.description ?? description;
    category = entry.default.category ?? category;
  }

  const o: Copy | undefined = entry?.perSection?.[section];
  if (o) {
    title = o.title ?? title;
    description = o.description ?? description;
    category = o.category ?? category;
  }

  const manual = entry?.tags;
  const auto = autoTagsFor(base.slug, base.subfolder);
  const folderTags = (base.folders ?? []).map((f) => f.toLowerCase());
  const tags = Array.from(new Set([...(manual ?? auto), ...folderTags]));

  return { ...base, title, description, category, tags };
}

export function resolveManyForSection(
  bases: PhotoBase[],
  section: string
): ResolvedPhoto[] {
  return bases.map((b) => resolvePhotoForSection(b, section));
}

export function loadAndResolveAll(section: string): ResolvedPhoto[] {
  return resolveManyForSection(loadAllBases(), section);
}

/** Photographs sitting directly in one folder, e.g. "living-level/kitchen". */
export function getResolvedInFolder(folder: string, section: string = folder): ResolvedPhoto[] {
  return resolveManyForSection(loadBasesInFolder(folder), section);
}

/** Photographs in one folder and everything beneath it. */
export function getResolvedUnderFolder(folder: string, section: string = folder): ResolvedPhoto[] {
  return resolveManyForSection(loadBasesUnderFolder(folder), section);
}

export function getResolvedByFolder(
  folder: string,
  section: string = folder
): ResolvedPhoto[] {
  const bases = loadBasesFrom(folder);
  bases.sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));
  return resolveManyForSection(bases, section);
}

/* ---------------- lightbox helpers ---------------- */

// Accepts a single item OR an array; always returns an array of lightbox-shaped objects
export function toLightbox(
  input?: ResolvedPhoto | ResolvedPhoto[]
): LightboxLike[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr.map((p) => ({ src: p.src, title: p.title, category: p.category }));
}

/* ---------------- misc ---------------- */

export function buildTagIndex(items: ResolvedPhoto[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const p of items) for (const t of p.tags) map[t] = (map[t] ?? 0) + 1;
  return map;
}