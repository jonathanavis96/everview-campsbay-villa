// src/utils/autoTag.ts
/**
 * Auto-generate tags for a photo based on its filename (slug) and subfolder.
 * This gives you good defaults, but you can override later in PHOTO_CATALOG.
 */
export function autoTagsFor(slug: string, subfolder: string): string[] {
  const tags = new Set<string>([subfolder.toLowerCase()]);
  const s = slug.toLowerCase();

  // Cross-mapping based on folder
  switch (subfolder.toLowerCase()) {
    case "balcony":
    case "patio":
    case "terrace":
      tags.add("outdoor");
      break;
    case "bar":
    case "cellar":
      tags.add("entertainment");
      break;
    case "interior":
      tags.add("living");
      break;
    case "exterior":
      tags.add("outdoor");
      break;
  }

  // Keyword hints from filename (extra layer)
  if (/(exterior|facade|drive)/.test(s)) tags.add("exterior");
  if (/(interior|lounge|living|room)/.test(s)) tags.add("interior");
  if (/(view|ocean|mountain)/.test(s)) tags.add("view");
  if (/(sunset|dusk|golden)/.test(s)) tags.add("sunset");
  if (/(sunrise|dawn)/.test(s)) tags.add("sunrise");
  if (/(balcony|terrace|patio)/.test(s)) tags.add("balcony");
  if (/(fireplace)/.test(s)) tags.add("fireplace");
  if (/(bar|cellar)/.test(s)) tags.add("bar");
  if (/(island)/.test(s)) tags.add("island");
  if (/(detail|close)/.test(s)) tags.add("detail");

  return Array.from(tags);
}
