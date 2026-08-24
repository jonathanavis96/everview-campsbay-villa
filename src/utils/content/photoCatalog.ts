// src/content/photoCatalog.ts
import type { CatalogEntry } from "@/utils/types/photos";
/**
 * PHOTO_CATALOG is an optional override map.
 * - Keys are slugs (filename without extension, e.g. "villa-exterior-1")
 * - Values let you override title, description, category, and tags
 * - If no entry is found, defaults from the loader + autoTags are used
 */
export const PHOTO_CATALOG: Record<string, CatalogEntry> = {
  "garden-dusk-lions-head": {
    default: {
      title: "Roof Garden at Dusk",
      description:
        "The roof garden at dusk, koi pond in the foreground and Lion's Head on the skyline behind the house.",
    },
  },
  "garden-dusk-pool-loungers": {
    default: {
      title: "Garden and Pool at Dusk",
      description:
        "The house seen from the garden at dusk, pool and loungers in the foreground, lit from within.",
    },
  },
  "bedroom-master-16": {
    default: {
      description:
        "The Master Suite, a queen bed facing full-width glass with an uninterrupted ocean view.",
    },
  },
  "bedroom-5-oceanking": {
    default: {
      description:
        "The Ocean King bedroom, its queen bed set between a sea view on one side and Camps Bay's mountains on the other.",
    },
  },
  "gardenking_upstairs_1": {
    default: {
      description:
        "The Garden King bedroom, its private balcony looking out over a tranquil garden and mountain outlook.",
    },
  },
  "bedroom-6-ground": {
    default: {
      description:
        "The Ground Floor King bedroom, opening directly onto the garden with a private outlook.",
    },
  },
};
