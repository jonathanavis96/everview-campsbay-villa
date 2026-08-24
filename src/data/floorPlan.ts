// The traced floor plan, as data.
//
// This file is the single source of truth for the plan: `FloorPlanSection`
// draws it, and the plan editor at /plan-editor (dev only) rewrites it. The
// editor's Save writes this whole file from `scripts/serialize-floor-plan.mjs`,
// so the shape below is machine-generated — keep prose in the section
// component or in that serialiser, never here, because anything hand-added
// after the marker is overwritten on the next save.
//
// Geometry is schematic and orthogonal: proportions and adjacency are true to
// Thomas Geh Architect's working drawings for House Avis, Erf 2522 (job 415
// rev B, ground floor 100wd, first floor 101wd); the angles are not. Areas are
// the square metres printed on the drawing. Nothing is served from the scans.

export type Room = {
  /** The name used elsewhere on this site. Unique within a floor. */
  name: string;
  /** The architect's label, where it differs from `name`. */
  planName?: string;
  /** Square metres as printed on the drawing. */
  area?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Outdoor spaces are drawn as a dashed outline rather than a room. */
  outdoor?: boolean;
  /** Service spaces (lift, stair, corridor) sit back in the hierarchy. */
  service?: boolean;
};

export type Floor = {
  id: string;
  /** The tab label. */
  label: string;
  /** One line under the tabs. */
  intro: string;
  rooms: Room[];
};

/** The plan's own coordinate space. The editor works in these units too. */
export const VIEW_W = 600;
export const VIEW_H = 440;
/** Headroom above the plan for the "Atlantic, this way" marker. */
export const VIEW_TOP = -14;

// ─── generated below this line — the plan editor rewrites it ───────────────

export const FLOORS: Floor[] = [
  {
    id: "living",
    label: "Living level",
    intro:
      "Kitchen, dining, lounge and the terrace, all facing the same way. The ground-floor bedroom and the entrance sit behind them, off the street.",
    rooms: [
      { name: "The terrace", planName: "Terrace 1", area: 48, x: 24, y: 34, w: 112, h: 150, outdoor: true },
      { name: "Terrace 2", area: 56, x: 148, y: 362, w: 280, h: 58, outdoor: true },
      { name: "Scullery", area: 11, x: 148, y: 34, w: 92, h: 46 },
      { name: "Indoor dining", planName: "Dining room", area: 26, x: 148, y: 88, w: 128, h: 82 },
      { name: "The kitchen", planName: "Kitchen", area: 16, x: 148, y: 178, w: 128, h: 62 },
      { name: "Formal living room", planName: "Living room", area: 23, x: 148, y: 248, w: 128, h: 106 },
      { name: "Wine cellar & TV room", planName: "TV room", area: 28, x: 284, y: 88, w: 130, h: 92 },
      { name: "The bar", planName: "Bar", area: 11, x: 284, y: 188, w: 74, h: 58 },
      { name: "Stair", x: 366, y: 188, w: 48, h: 58, service: true },
      { name: "Formal lounge", area: 44, x: 284, y: 254, w: 130, h: 100 },
      { name: "The garden", planName: "Garden", x: 422, y: 34, w: 154, h: 46, outdoor: true },
      { name: "Ground Floor King", planName: "Guest room", area: 27, x: 422, y: 88, w: 154, h: 100 },
      { name: "Entrance", area: 23, x: 422, y: 196, w: 154, h: 62 },
      { name: "Lift", x: 500, y: 266, w: 76, h: 52, service: true },
      { name: "Planted roof", area: 58, x: 436, y: 362, w: 140, h: 58, outdoor: true },
    ],
  },
  {
    id: "bedrooms",
    label: "Bedroom level",
    intro:
      "Three bedrooms upstairs, each with its own bathroom, and the study and pool room sharing the landing between them.",
    rooms: [
      { name: "Bath 1", area: 18, x: 24, y: 34, w: 118, h: 84 },
      { name: "Closet", area: 3, x: 150, y: 74, w: 62, h: 44 },
      { name: "Master Suite", planName: "Bedroom 1", area: 29, x: 24, y: 126, w: 118, h: 116 },
      { name: "Patio", area: 22, x: 24, y: 250, w: 118, h: 100, outdoor: true },
      { name: "Bath 2", area: 8, x: 150, y: 126, w: 84, h: 92 },
      { name: "Ocean King", planName: "Bedroom 2", area: 22, x: 150, y: 226, w: 138, h: 124 },
      { name: "Balcony", area: 8, x: 168, y: 358, w: 138, h: 44, outdoor: true },
      { name: "The study", planName: "Study", area: 29, x: 242, y: 34, w: 172, h: 84 },
      { name: "Open to below", planName: "Stair", area: 6, x: 296, y: 126, w: 84, h: 78, service: true },
      { name: "Pool room", planName: "Study 2", area: 20, x: 296, y: 250, w: 118, h: 100 },
      { name: "Bath 3", area: 10, x: 422, y: 34, w: 74, h: 84 },
      { name: "Dressing room", planName: "Dressing 4", area: 8, x: 504, y: 34, w: 72, h: 84 },
      { name: "Bath 4", area: 4, x: 422, y: 126, w: 56, h: 56 },
      { name: "Garden King", planName: "Bedroom 4", area: 12, x: 486, y: 126, w: 90, h: 116 },
      { name: "Corridor", area: 15, x: 422, y: 190, w: 56, h: 52, service: true },
      { name: "Lift", x: 486, y: 250, w: 90, h: 60, service: true },
    ],
  },
];
