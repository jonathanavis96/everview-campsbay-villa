// Turns the plan editor's state back into `src/data/floorPlan.ts`.
//
// The editor posts JSON; this module validates it and writes the file, so the
// browser never hands the dev server a string to put on disk. Everything above
// the marker in the target file — the types, the view constants, the prose
// explaining where the geometry came from — is kept exactly as it is; only the
// `FLOORS` array below the marker is regenerated.
import fs from "node:fs";

export const MARKER =
  "// ─── generated below this line — the plan editor rewrites it ───────────────";

/** Room keys in the order they are written, so diffs stay readable. */
const ROOM_KEYS = ["name", "planName", "area", "x", "y", "w", "h", "outdoor", "service"];

const isFiniteNumber = (v) => typeof v === "number" && Number.isFinite(v);

/**
 * Accepts only the shape the plan uses, and returns a clean copy. Anything
 * else throws: this runs on a POST body, and the result is written to a source
 * file in the repository.
 */
export function validateFloors(data) {
  if (!Array.isArray(data) || data.length === 0) throw new Error("floors must be a non-empty array");

  return data.map((floor, i) => {
    for (const key of ["id", "label", "intro"]) {
      if (typeof floor?.[key] !== "string" || !floor[key]) {
        throw new Error(`floor ${i}: ${key} must be a non-empty string`);
      }
    }
    if (!/^[a-z0-9-]+$/.test(floor.id)) throw new Error(`floor ${i}: id must be kebab-case`);
    if (!Array.isArray(floor.rooms) || floor.rooms.length === 0) {
      throw new Error(`floor ${floor.id}: rooms must be a non-empty array`);
    }

    const seen = new Set();
    const rooms = floor.rooms.map((room, j) => {
      const where = `floor ${floor.id}, room ${j}`;
      if (typeof room?.name !== "string" || !room.name.trim()) {
        throw new Error(`${where}: name must be a non-empty string`);
      }
      // The section keys rooms by name, so a duplicate would drop a room.
      if (seen.has(room.name)) throw new Error(`${where}: duplicate name "${room.name}"`);
      seen.add(room.name);

      for (const key of ["x", "y", "w", "h"]) {
        if (!isFiniteNumber(room[key])) throw new Error(`${where}: ${key} must be a number`);
      }

      const out = {
        name: room.name,
        x: Math.round(room.x),
        y: Math.round(room.y),
        w: Math.round(room.w),
        h: Math.round(room.h),
      };
      // Checked *after* rounding, which is what actually reaches the file: a
      // width of 0.1 is positive but serialises as 0, and a zero-width room
      // is invisible on the plan and cannot be grabbed to fix.
      if (out.w <= 0 || out.h <= 0) {
        throw new Error(`${where}: width and height must round to at least 1`);
      }
      if (typeof room.planName === "string" && room.planName.trim()) out.planName = room.planName;
      if (room.area !== undefined && room.area !== null && room.area !== "") {
        if (!isFiniteNumber(room.area)) throw new Error(`${where}: area must be a number`);
        out.area = room.area;
      }
      if (room.outdoor === true) out.outdoor = true;
      if (room.service === true) out.service = true;
      return out;
    });

    return { id: floor.id, label: floor.label, intro: floor.intro, rooms };
  });
}

const quote = (s) => JSON.stringify(s);

function roomLine(room) {
  const parts = ROOM_KEYS.filter((k) => room[k] !== undefined).map((k) =>
    typeof room[k] === "string" ? `${k}: ${quote(room[k])}` : `${k}: ${room[k]}`
  );
  return `      { ${parts.join(", ")} },`;
}

/** The `FLOORS` declaration, formatted the way the file already is. */
export function serializeFloors(floors) {
  const body = floors
    .map((floor) => {
      const rooms = floor.rooms.map(roomLine).join("\n");
      return [
        "  {",
        `    id: ${quote(floor.id)},`,
        `    label: ${quote(floor.label)},`,
        "    intro:",
        `      ${quote(floor.intro)},`,
        "    rooms: [",
        rooms,
        "    ],",
        "  },",
      ].join("\n");
    })
    .join("\n");

  return `export const FLOORS: Floor[] = [\n${body}\n];\n`;
}

/**
 * Rewrites the generated half of `filePath` in place. Throws rather than
 * writing anything if the marker is missing, so a renamed or reorganised file
 * fails loudly instead of being flattened.
 */
export function writeFloorPlan(filePath, floors) {
  const current = fs.readFileSync(filePath, "utf-8");
  const at = current.indexOf(MARKER);
  if (at === -1) throw new Error(`marker not found in ${filePath}`);

  const header = current.slice(0, at + MARKER.length);
  fs.writeFileSync(filePath, `${header}\n\n${serializeFloors(floors)}`);
}
