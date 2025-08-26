import type { SectionKey, Copy } from "@/utils/photoCatalog";

export type CatalogEntry = {
  tags?: string[]; // if omitted, auto-tags will be used
  default?: Copy;
  perSection?: Partial<Record<SectionKey, Copy>>;
};

// Keyed by slug (filename w/out extension).
// Start empty; add entries only when you want to override/enrich.
export const PHOTO_CATALOG: Record<string, CatalogEntry> = {
  // Example entries (delete once you add real ones):
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
      bedrooms: { description: "Private balcony, dressing room & ocean views" },
      gallery: { category: "Bedrooms" },
    },
  },
  */
};
