// src/utils/photoCatalog.ts
import { autoTagsFor } from "@/utils/autoTag";
import type { PhotoBase } from "@/utils/photoLoader";
import { loadAllBasesAuto, loadBasesFrom } from "@/utils/photoLoader";
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
  const bases = loadAllBasesAuto();
  return resolveManyForSection(bases, section);
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

/* ---------------- bedrooms selection (arrays per room) ---------------- */

export type BedroomsSelection = {
  master: ResolvedPhoto[];
  oceanking: ResolvedPhoto[];
  gardenking: ResolvedPhoto[];
  ground: ResolvedPhoto[];
  all: ResolvedPhoto[];
};

export function selectBedroomsSet(folder: string = BEDROOM_FOLDER): BedroomsSelection {
  const beds = getResolvedByFolder(folder, "bedrooms"); // slug-sorted

  const matches = (p: ResolvedPhoto, re: RegExp) =>
    re.test(p.slug) || re.test(p.title ?? "") || p.tags.some((t) => re.test(t));

  const filterBy = (patterns: RegExp[]) =>
    beds.filter((p) => patterns.some((re) => matches(p, re)));

  // Buckets (tweak patterns to your naming if needed)
  let master = filterBy([/\bmaster\b/i, /\bmaster[-_ ]?bed(room)?\b/i, /\bprimary\b/i, /\bmain\b/i]);
  let oceanking = filterBy([
    /\boceanking\b/i,
    /\bocean[-_ ]?king\b/i,
    /\b(ocean|sea|atlantic)[-_ ]?(view)?[-_ ]?king\b/i,
    /\bup(stairs|per).*(1|one)\b/i,
    /\bbed(room)?[-_ ]?1\b/i,
  ]);
  let gardenking = filterBy([
    /\bgardenking\b/i,
    /\bgarden[-_ ]?king\b/i,
    /\bgarden[-_ ]?(suite|room)\b/i,
    /\bup(stairs|per).*(2|two)\b/i,
    /\bbed(room)?[-_ ]?2\b/i,
  ]);
  let ground = filterBy([/\bground\b/i, /\bground[-_ ]?floor\b/i, /\bdownstairs\b/i, /\bground[-_ ]?king\b/i]);

  // Ensure at least one image in each bucket (fallbacks)
  const used = new Set<string>([
    ...master.map((p) => p.slug),
    ...oceanking.map((p) => p.slug),
    ...gardenking.map((p) => p.slug),
    ...ground.map((p) => p.slug),
  ]);

  const firstUnused = () => beds.find((p) => !used.has(p.slug));

  if (!master.length)     { const f = firstUnused(); if (f) { master = [f]; used.add(f.slug); } }
  if (!oceanking.length)  { const f = firstUnused(); if (f) { oceanking = [f]; used.add(f.slug); } }
  if (!gardenking.length) { const f = firstUnused(); if (f) { gardenking = [f]; used.add(f.slug); } }
  if (!ground.length)     { const f = firstUnused(); if (f) { ground = [f]; used.add(f.slug); } }

  return { master, oceanking, gardenking, ground, all: beds };
}

/* ---------------- misc ---------------- */

export function buildTagIndex(items: ResolvedPhoto[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const p of items) for (const t of p.tags) map[t] = (map[t] ?? 0) + 1;
  return map;
}