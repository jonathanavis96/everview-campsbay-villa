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

/** Opening keys, likewise. */
const OPENING_KEYS = ["between", "room", "side", "stretch", "kind", "axis", "at", "span", "into"];
const INTERIOR_KINDS = ["wall", "door", "slider", "open"];
const EXTERIOR_KINDS = ["wall", "window", "door", "slider", "open"];
const SIDES = ["l", "r", "t", "b"];

const isFiniteNumber = (v) => typeof v === "number" && Number.isFinite(v);

/** The plan's coordinate space, mirroring VIEW_W / VIEW_H in floorPlan.ts. */
const VIEW_W = 600;
const VIEW_H = 440;

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
      // A room outside the canvas is clipped by the section's viewBox, and one
      // fully outside cannot be clicked in the editor to drag it back.
      if (out.x < 0 || out.y < 0 || out.x + out.w > VIEW_W || out.y + out.h > VIEW_H) {
        throw new Error(
          `${where}: "${room.name}" falls outside the ${VIEW_W}x${VIEW_H} plan`
        );
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

    // Openings name rooms, so they are checked against the names above: an
    // entry for a room that has been renamed or deleted is dead weight in the
    // file and silently stops overriding anything.
    const openings = (floor.openings ?? []).map((opening, j) => {
      const where = `floor ${floor.id}, opening ${j}`;

      // An exterior opening names one room and a side of it; an interior one
      // names the two rooms it sits between.
      if (opening && opening.between === undefined) {
        if (!seen.has(opening.room)) throw new Error(`${where}: no room named "${opening.room}"`);
        if (!SIDES.includes(opening.side)) {
          throw new Error(`${where}: side must be one of ${SIDES.join(", ")}`);
        }
        if (!EXTERIOR_KINDS.includes(opening.kind)) {
          throw new Error(`${where}: kind must be one of ${EXTERIOR_KINDS.join(", ")}`);
        }
        const out = { room: opening.room, side: opening.side, kind: opening.kind };
        if (opening.stretch) {
          if (!Number.isInteger(opening.stretch) || opening.stretch < 0) {
            throw new Error(`${where}: stretch must be a whole number`);
          }
          out.stretch = opening.stretch;
        }
        if (opening.at !== undefined && opening.at !== null) {
          if (!isFiniteNumber(opening.at) || opening.at < 0 || opening.at > 1) {
            throw new Error(`${where}: at must be between 0 and 1`);
          }
          out.at = Math.round(opening.at * 100) / 100;
        }
        if (opening.span !== undefined && opening.span !== null) {
          if (!isFiniteNumber(opening.span) || opening.span <= 0) {
            throw new Error(`${where}: span must be a positive number`);
          }
          out.span = Math.round(opening.span);
        }
        if (opening.into === "outside") out.into = "outside";
        return out;
      }

      const between = opening?.between;
      if (!Array.isArray(between) || between.length !== 2) {
        throw new Error(`${where}: between must be a pair of room names`);
      }
      for (const name of between) {
        if (!seen.has(name)) throw new Error(`${where}: no room named "${name}"`);
      }
      if (between[0] === between[1]) throw new Error(`${where}: a room cannot open onto itself`);
      if (!INTERIOR_KINDS.includes(opening.kind)) {
        throw new Error(`${where}: kind must be one of ${INTERIOR_KINDS.join(", ")}`);
      }

      const out = { between: [between[0], between[1]], kind: opening.kind };
      if (opening.axis === "v" || opening.axis === "h") out.axis = opening.axis;
      if (opening.at !== undefined && opening.at !== null) {
        if (!isFiniteNumber(opening.at) || opening.at < 0 || opening.at > 1) {
          throw new Error(`${where}: at must be between 0 and 1`);
        }
        out.at = Math.round(opening.at * 100) / 100;
      }
      if (opening.span !== undefined && opening.span !== null) {
        if (!isFiniteNumber(opening.span) || opening.span <= 0) {
          throw new Error(`${where}: span must be a positive number`);
        }
        out.span = Math.round(opening.span);
      }
      if (opening.into !== undefined && opening.into !== null && opening.into !== "") {
        if (!between.includes(opening.into)) {
          throw new Error(`${where}: into must be one of the two rooms`);
        }
        out.into = opening.into;
      }
      return out;
    });

    // A pair may be spoken for once per axis, and once for "both axes". Two
    // entries claiming the same wall would make the drawing depend on array
    // order, which is not something anyone can see in the editor.
    const claimed = new Set();
    for (const o of openings) {
      const key = o.between
        ? [...o.between].sort().join("\u0000") + "\u0000" + (o.axis ?? "*")
        : [o.room, o.side, o.stretch ?? 0].join("\u0000");
      if (claimed.has(key)) {
        const what = o.between ? o.between.join(" / ") : `${o.room} (${o.side})`;
        throw new Error(`floor ${floor.id}: two openings claim ${what}`);
      }
      claimed.add(key);
    }

    return { id: floor.id, label: floor.label, intro: floor.intro, rooms, openings };
  });
}

const quote = (s) => JSON.stringify(s);

function openingLine(opening) {
  const parts = OPENING_KEYS.filter((k) => opening[k] !== undefined).map((k) =>
    k === "between"
      ? `between: [${opening.between.map(quote).join(", ")}]`
      : typeof opening[k] === "string"
        ? `${k}: ${quote(opening[k])}`
        : `${k}: ${opening[k]}`
  );
  return `      { ${parts.join(", ")} },`;
}

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
      const openings = (floor.openings ?? []).map(openingLine).join("\n");
      return [
        "  {",
        `    id: ${quote(floor.id)},`,
        `    label: ${quote(floor.label)},`,
        "    intro:",
        `      ${quote(floor.intro)},`,
        "    rooms: [",
        rooms,
        "    ],",
        // Omitted entirely when empty, so a floor with nothing overridden
        // keeps reading as "everything here is derived".
        ...(openings ? ["    openings: [", openings, "    ],"] : []),
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
