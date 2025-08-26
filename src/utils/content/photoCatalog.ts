// src/content/photoCatalog.ts
import type { CatalogEntry } from "@/utils/types/photos";
/**
 * PHOTO_CATALOG is an optional override map.
 * - Keys are slugs (filename without extension, e.g. "villa-exterior-1")
 * - Values let you override title, description, category, and tags
 * - If no entry is found, defaults from the loader + autoTags are used
 */
export const PHOTO_CATALOG: Record<string, CatalogEntry> = {
  // Example entries — safe to delete once you add your own:

  /*
  "villa-exterior-1": {
    tags: ["outdoor", "exterior", "view"],
    default: {
      title: "Villa Exterior",
      description: "Stunning architecture with panoramic ocean views",
      category: "Exterior",
    },
  },

  "master-suite-1": {
    perSection: {
      gallery: { category: "Bedrooms" },
      bedrooms: { description: "Private balcony & ocean views" },
    },
  },
  */
};
