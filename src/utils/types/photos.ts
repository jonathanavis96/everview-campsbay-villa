// src/types/photos.ts
export type Copy = {
  title?: string;
  description?: string;
  category?: string; // badge text (per-section override if you want)
};

// If you want per-section overrides, "section" is a free-form string.
export type CatalogEntry = {
  tags?: string[]; // if omitted, auto-tags will be used
  default?: Copy;
  perSection?: Record<string, Copy>; // no union; use any string section name
};
