// src/content/photoCatalog.ts
import type { CatalogEntry } from "@/utils/types/photos";
/**
 * PHOTO_CATALOG is an optional override map.
 * - Keys are slugs (filename without extension, e.g. "villa-exterior-1")
 * - Values let you override title, description, category, and tags
 * - If no entry is found, defaults from the loader + autoTags are used
 */
export const PHOTO_CATALOG: Record<string, CatalogEntry> = {
  // --- the 2026-08 shoot. Described here rather than left to the auto-tagger,
  // because these are the plates that lead every space and their alt text is
  // what a screen reader and a crawler actually get.
  "1-living-kitchen": {
    default: {
      description:
        "The kitchen: a marble island with bar stools, a range under an extractor hood, and the living room and the sea beyond it.",
    },
  },
  "2-living-kitchen": {
    default: {
      description:
        "The kitchen from the other end, its island running the length of the room towards the ovens and the pale timber floor.",
    },
  },
  "1-living-formalLivingRoom": {
    default: {
      description:
        "The formal living room: a fireplace between two sofas, and the Atlantic filling the windows along the far wall.",
    },
  },
  "2-living-formalLivingRoom": {
    default: {
      description:
        "The formal living room looking back towards the entrance hall, the fireplace on the right and the bay through the glass.",
    },
  },
  "3-living-indoorDining": {
    default: {
      description:
        "The indoor dining table set for eight beneath the chandelier, with the ocean along the whole far side of the room.",
    },
  },
  "1-living-bar": {
    default: {
      description:
        "The bar: a stone-topped counter with wicker stools and glazed shelves of bottles behind it.",
    },
  },
  "2-living-wineCellar": {
    default: {
      description:
        "The television room with the glazed wine cellar behind it and a small kitchenette through the doorway.",
    },
  },
  "1-living-terrace": {
    default: {
      description:
        "The covered terrace: armchairs and a dining table under the timber ceiling, with the whole sweep of Camps Bay beach and the Atlantic in front.",
    },
  },
  "2-living-terrace": {
    default: {
      description:
        "The covered terrace looking towards Lion's Head, its chairs and low table facing out over the rooftops to the sea.",
    },
  },
  "3-living-terrace": {
    default: {
      description:
        "The terrace's casual dining end, the glass balustrade opening onto the bay and the Twelve Apostles to the left.",
    },
  },
  "4-living-terrace": {
    default: {
      description:
        "The terrace at its ocean end, wicker chairs either side of a low table, a tree framing the bay beyond the glass.",
    },
  },
  "1-living-groundKing": {
    default: {
      description:
        "The Ground Floor King: a sleigh bed and a bench, with doors opening straight onto the garden.",
    },
  },
  "1-bedroom-masterSuite": {
    default: {
      description:
        "The Master Suite: a wide upholstered bed under a chandelier, with the dressing area beyond it.",
    },
  },
  "2-bedroom-masterSuite": {
    default: {
      description:
        "The Master Suite from the dressing side, its bed facing sliding doors onto the balcony and the ocean.",
    },
  },
  "3-bedroom-masterSuiteBalcony": {
    default: {
      description:
        "The Master Suite's balcony: an open paved terrace behind glass, looking across Camps Bay to Lion's Head.",
    },
  },
  "4-bedroom-masterSuiteBathroom": {
    default: {
      description:
        "The Master Suite's en-suite: a freestanding bath by the window, twin basins, and a walk-in shower behind glass.",
    },
  },
  "1-bedroom-oceanKing": {
    default: {
      description:
        "The Ocean King: a cream upholstered bed facing sliding doors onto the balcony and the open Atlantic.",
    },
  },
  "2-bedroom-oceanKing": {
    default: {
      description:
        "The Ocean King looking out through full-width sliding doors to the bay and the sea beyond.",
    },
  },
  "3-bedroom-oceanKing": {
    default: {
      description:
        "The Ocean King with the curtains drawn back, mountain and village through the window on one side.",
    },
  },
  "4-bedroom-oceanKingBalcony": {
    default: {
      description:
        "The Ocean King's balcony, glass-railed above the village, with Table Mountain and the bay in the distance.",
    },
  },
  "5-bedroom-oceanKingBathroom": {
    default: {
      description:
        "The Ocean King's en-suite: a bath, a basin on a timber counter and a large mirror above it.",
    },
  },
  "1-bedroom-gardenKing": {
    default: {
      description:
        "The Garden King: a wide bed with navy cushions and an armchair by the window onto the garden.",
    },
  },
  "2-bedroom-gardenKingBalcony": {
    default: {
      description:
        "The Garden King's balcony, a small table and chairs among the palms with the Atlantic beyond.",
    },
  },
  "3-bedroom-gardenKingBathroom": {
    default: {
      description:
        "The Garden King's en-suite: a bath under the window and a mosaic-tiled shower alongside it.",
    },
  },
  "1-bedroom-poolRoom": {
    default: {
      description:
        "The pool room: a billiards table under a ceiling fan, bar seating at the window, and the sea behind it.",
    },
  },
  "2-bedroom-study": {
    default: {
      description:
        "The study: a run of desks along the window, with the garden and the neighbouring roofs outside.",
    },
  },
  "3-bedroom-study": {
    default: {
      description:
        "The study from the landing end, its shelving and cabinetry running the length of the wall.",
    },
  },
  "1-garden-pool": {
    default: {
      description:
        "The pool set into the lawn below the house, seen from above with Lion's Head on the skyline.",
    },
  },
  "2-garden-houseFromPool": {
    default: {
      description:
        "The house from the far end of the pool, the mountain crags rising directly behind it.",
    },
  },
  "3-garden-houseFromPool": {
    default: {
      description:
        "The house from the pool's edge, a palm in the foreground and the covered terrace along its length.",
    },
  },
  "13-exterior-arrival": {
    default: {
      description:
        "Everview from the closed end of Cramond Road: the garages, the entrance, and the house rising above them.",
    },
  },
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
  "bedroom-chandelier-terrace-sunset": {
    default: {
      title: "Bedroom at Sunset",
      description: "A bedroom with a chandelier, its doors open onto a terrace at sunset.",
    },
  },
  "bedroom-sliding-doors-ocean-sunset": {
    default: {
      title: "Bedroom, Ocean Sunset",
      description: "A bedroom with full-width sliding doors open onto an ocean sunset.",
    },
  },
  "gardenking_bathroom_1": {
    default: { description: "The Garden King en-suite bathroom." },
  },
  "gardenking_bathroom_2": {
    default: { description: "The Garden King en-suite bathroom, a second view." },
  },
  "oceanking_bathroom": {
    default: { description: "The Ocean King en-suite bathroom." },
  },
  "evening_front_of_house_1": {
    default: {
      title: "The House at Dusk",
      description: "The house from the street, lit from within as evening falls.",
    },
  },
  "study_work_upstairs_area": {
    default: { description: "A study and work area on the upper level." },
  },
  "study_work_upstairs_area_2": {
    default: { description: "The upstairs study and work area, a second view." },
  },
  "view_1": {
    default: {
      title: "The View",
      description: "The ocean view from the house, looking out over Camps Bay.",
    },
  },
};
