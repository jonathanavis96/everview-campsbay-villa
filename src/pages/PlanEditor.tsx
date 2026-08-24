// The plan editor — development only, never routed in a production build.
//
// `src/data/floorPlan.ts` is hand-authored geometry: sixteen rectangles per
// floor, traced off the architect's drawings. Nudging one of them by hand
// meant editing numbers in a source file and flipping to the browser to see
// what moved. This page draws the same data, lets it be dragged and resized,
// and posts it back through the dev server's `/__floor-plan` endpoint, which
// rewrites that file — so Save lands as an HMR update on the real section.
//
// It is a workshop tool, not part of the site: no Reveal, no motion, no
// responsive work below the desktop breakpoint, and the styling is plain
// Tailwind on the site's own tokens rather than the page's type scale.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FLOORS as INITIAL_FLOORS,
  VIEW_H,
  VIEW_TOP,
  VIEW_W,
  type Floor,
  type Room,
  isExterior,
  type WallOpening,
} from "@/data/floorPlan";
import { wallSegments, type Segment } from "@/data/planGeometry";

/** Room corners and edges, in the order the handles are drawn. */
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type Handle = (typeof HANDLES)[number];
type DragMode = "move" | Handle;

/** How close an edge has to be to another room's edge before it snaps, in plan units. */
const EDGE_SNAP = 5;
/** A room never gets smaller than this, so it can always be grabbed again. */
const MIN_SIDE = 8;

type Rect = { x: number; y: number; w: number; h: number };

/** What the editor is clicking on: room rectangles, or the walls between them. */
type Mode = "rooms" | "walls";

/**
 * The kinds a wall cycles through, `null` being "let the derivation decide".
 * A window only belongs in a wall that faces out.
 */
type Kind = Segment["kind"];
const INTERIOR_CYCLE: (Kind | null)[] = [null, "door", "slider", "open", "wall"];
const EXTERIOR_CYCLE: (Kind | null)[] = [null, "window", "door", "slider", "open", "wall"];
const cycleFor = (seg: Segment) => (seg.b === "" ? EXTERIOR_CYCLE : INTERIOR_CYCLE);

const WALL_COLOUR: Record<Kind | "auto", string> = {
  auto: "rgba(120,120,120,0.45)",
  door: "rgb(40,110,180)",
  slider: "rgb(150,95,190)",
  open: "rgb(45,150,110)",
  window: "rgb(200,140,40)",
  wall: "rgb(170,60,45)",
};

const wallKey = (seg: Segment) =>
  seg.b === ""
    ? ["out", seg.a, seg.side, seg.stretch].join("\u0000")
    : [seg.a, seg.b].sort().join("\u0000") + "\u0000" + seg.axis;

/** Does this authored opening govern the wall this segment is drawn on? */
const governs = (o: WallOpening, seg: Segment) =>
  isExterior(o)
    ? seg.b === "" && o.room === seg.a && o.side === seg.side && (o.stretch ?? 0) === seg.stretch
    : seg.b !== "" &&
      [o.between[0], o.between[1]].sort().join("\u0000") === [seg.a, seg.b].sort().join("\u0000") &&
      (o.axis === undefined || o.axis === seg.axis);

/** A fresh authored entry for one wall, carrying over whatever it already had. */
const entryFor = (seg: Segment, kind: Kind, previous?: WallOpening): WallOpening =>
  seg.b === ""
    ? {
        ...(previous && isExterior(previous) ? previous : {}),
        room: seg.a,
        side: seg.side as NonNullable<Segment["side"]>,
        stretch: seg.stretch,
        kind,
      }
    : {
        ...(previous && !isExterior(previous) ? previous : {}),
        between: [seg.a, seg.b],
        axis: seg.axis,
        kind: kind === "window" ? "open" : kind,
      };

/**
 * Holds a rectangle inside the plan. A room dragged off the canvas is clipped
 * by the section's viewBox on the site, and one dragged *entirely* off cannot
 * be clicked again to bring it back — so it is never allowed to leave.
 */
function clampToCanvas(rect: Rect): Rect {
  const w = Math.min(Math.max(rect.w, MIN_SIDE), VIEW_W);
  const h = Math.min(Math.max(rect.h, MIN_SIDE), VIEW_H);
  return {
    w,
    h,
    x: Math.min(Math.max(rect.x, 0), VIEW_W - w),
    y: Math.min(Math.max(rect.y, 0), VIEW_H - h),
  };
}

const clone = (floors: Floor[]): Floor[] =>
  floors.map((f) => ({ ...f, rooms: f.rooms.map((r) => ({ ...r })) }));

/** Snap `v` to the nearest candidate within `tol`, else to the grid. */
function snap(v: number, candidates: number[], grid: number, tol: number) {
  let best: number | null = null;
  let bestDistance = tol;
  for (const c of candidates) {
    const d = Math.abs(c - v);
    if (d < bestDistance) {
      best = c;
      bestDistance = d;
    }
  }
  if (best !== null) return best;
  return grid > 0 ? Math.round(v / grid) * grid : Math.round(v);
}

/** Applies a drag to one rectangle, snapping the edges that actually moved. */
function applyDrag(
  start: Rect,
  mode: DragMode,
  dx: number,
  dy: number,
  grid: number,
  xEdges: number[],
  yEdges: number[]
): Rect {
  if (mode === "move") {
    // Both edges get to snap, not just the leading one: a room dragged up
    // against another from the left meets it with its *right* edge, and
    // offering only `x` as a candidate left that gap open. Subtracting the
    // room's own width turns "my right edge lands on that line" into a
    // candidate for `x`, so either edge can catch, whichever is nearer.
    const x = snap(start.x + dx, [...xEdges, ...xEdges.map((e) => e - start.w)], grid, EDGE_SNAP);
    const y = snap(start.y + dy, [...yEdges, ...yEdges.map((e) => e - start.h)], grid, EDGE_SNAP);
    // The size is carried through untouched, whichever edge snapped.
    return clampToCanvas({ ...start, x, y });
  }

  let { x, y, w, h } = start;
  const right = start.x + start.w;
  const bottom = start.y + start.h;

  if (mode.includes("w")) {
    const nx = Math.min(snap(start.x + dx, xEdges, grid, EDGE_SNAP), right - MIN_SIDE);
    w = right - nx;
    x = nx;
  }
  if (mode.includes("e")) {
    const nr = Math.max(snap(right + dx, xEdges, grid, EDGE_SNAP), x + MIN_SIDE);
    w = nr - x;
  }
  if (mode.includes("n")) {
    const ny = Math.min(snap(start.y + dy, yEdges, grid, EDGE_SNAP), bottom - MIN_SIDE);
    h = bottom - ny;
    y = ny;
  }
  if (mode.includes("s")) {
    const nb = Math.max(snap(bottom + dy, yEdges, grid, EDGE_SNAP), y + MIN_SIDE);
    h = nb - y;
  }

  return clampToCanvas({ x, y, w, h });
}

const HANDLE_CURSOR: Record<Handle, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

function handlePosition(rect: Rect, handle: Handle) {
  const midX = rect.x + rect.w / 2;
  const midY = rect.y + rect.h / 2;
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  const x = handle.includes("w") ? rect.x : handle.includes("e") ? right : midX;
  const y = handle.includes("n") ? rect.y : handle.includes("s") ? bottom : midY;
  return { x, y };
}

export default function PlanEditor() {
  const [floors, setFloors] = useState<Floor[]>(() => clone(INITIAL_FLOORS));
  const [floorIndex, setFloorIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("rooms");
  const [selectedWall, setSelectedWall] = useState<string | null>(null);
  const [grid, setGrid] = useState(2);
  const [snapEdges, setSnapEdges] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Undo only ever has to restore whole snapshots — a plan is a few kilobytes,
  // so there is nothing to gain from a finer-grained command history.
  const past = useRef<Floor[][]>([]);
  const future = useRef<Floor[][]>([]);
  // The current plan, readable synchronously. History is pushed from event
  // handlers, never from inside a setState updater: StrictMode double-invokes
  // those in development — which is the only place this page runs — and a ref
  // push inside one lands twice, so one edit took two undos to reverse.
  const floorsRef = useRef(floors);
  floorsRef.current = floors;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ name: string; mode: DragMode; start: Rect; originX: number; originY: number } | null>(null);

  const floor = floors[floorIndex];
  const room = floor.rooms.find((r) => r.name === selected) ?? null;

  const segments = useMemo(() => wallSegments(floor), [floor]);
  const wall = segments.find((seg) => wallKey(seg) === selectedWall) ?? null;

  const commit = useCallback(
    (next: Floor[] | ((current: Floor[]) => Floor[])) => {
      past.current.push(clone(floorsRef.current));
      future.current = [];
      setFloors((current) => (typeof next === "function" ? next(current) : next));
      setDirty(true);
      setStatus(null);
    },
    []
  );

  /** Mutates the selected room without pushing a second undo step mid-drag. */
  const patchRoom = useCallback(
    (name: string, patch: Partial<Room>, record: boolean) => {
      const update = (current: Floor[]) =>
        current.map((f, i) =>
          i === floorIndex
            ? { ...f, rooms: f.rooms.map((r) => (r.name === name ? { ...r, ...patch } : r)) }
            : f
        );
      if (record) commit(update);
      else {
        setFloors(update);
        setDirty(true);
      }
    },
    [commit, floorIndex]
  );

  const undo = useCallback(() => {
    const previous = past.current.pop();
    if (!previous) return;
    future.current.push(clone(floorsRef.current));
    setFloors(previous);
    setDirty(true);
  }, []);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(clone(floorsRef.current));
    setFloors(next);
    setDirty(true);
  }, []);

  // The edges every *other* room offers to snap against, recomputed per drag
  // rather than per frame.
  const snapTargets = useCallback(
    (exclude: string) => {
      if (!snapEdges) return { xEdges: [] as number[], yEdges: [] as number[] };
      const xEdges: number[] = [0, VIEW_W];
      const yEdges: number[] = [0, VIEW_H];
      for (const r of floor.rooms) {
        if (r.name === exclude) continue;
        xEdges.push(r.x, r.x + r.w);
        yEdges.push(r.y, r.y + r.h);
      }
      return { xEdges, yEdges };
    },
    [floor.rooms, snapEdges]
  );

  const toPlan = useCallback((event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const beginDrag = (event: React.PointerEvent, target: Room, mode: DragMode) => {
    event.stopPropagation();
    event.preventDefault();
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    setSelected(target.name);
    // One undo step per drag, taken before anything moves.
    past.current.push(clone(floorsRef.current));
    future.current = [];
    const origin = toPlan(event);
    drag.current = {
      name: target.name,
      mode,
      start: { x: target.x, y: target.y, w: target.w, h: target.h },
      originX: origin.x,
      originY: origin.y,
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const point = toPlan(event);
    const { xEdges, yEdges } = snapTargets(current.name);
    const rect = applyDrag(
      current.start,
      current.mode,
      point.x - current.originX,
      point.y - current.originY,
      grid,
      xEdges,
      yEdges
    );
    patchRoom(current.name, rect, false);
  };

  const endDrag = () => {
    drag.current = null;
  };

  /**
   * Rewrites the authored opening for one wall. `null` deletes it, which
   * hands the wall back to the derivation.
   */
  const setOpening = (seg: Segment, next: WallOpening | null) => {
    commit((current) =>
      current.map((f, i) => {
        if (i !== floorIndex) return f;
        const kept = (f.openings ?? []).filter((o) => !governs(o, seg));
        const openings = next ? [...kept, next] : kept;
        return { ...f, openings: openings.length ? openings : undefined };
      })
    );
    setSelectedWall(wallKey(seg));
  };

  /** The authored entry for a wall, or undefined where it is still derived. */
  const authored = (seg: Segment) => (floor.openings ?? []).find((o) => governs(o, seg));

  const cycleWall = (seg: Segment) => {
    const cycle = cycleFor(seg);
    const current = authored(seg)?.kind ?? null;
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    if (!next) return setOpening(seg, null);
    setOpening(seg, entryFor(seg, next, authored(seg)));
  };

  /** Keeps openings pointing at rooms that still exist under the names they have. */
  const renameInOpenings = (
    openings: WallOpening[] | undefined,
    from: string,
    to: string | null
  ): WallOpening[] =>
    (openings ?? [])
      .filter((o) => to !== null || !(isExterior(o) ? o.room === from : o.between.includes(from)))
      .map((o) => {
        if (isExterior(o)) return o.room === from ? { ...o, room: to as string } : o;
        return o.between.includes(from)
          ? {
              ...o,
              between: o.between.map((n) => (n === from ? (to as string) : n)) as [string, string],
              into: o.into === from ? (to as string) : o.into,
            }
          : o;
      });

  const addRoom = () => {
    let name = "New room";
    let n = 2;
    while (floor.rooms.some((r) => r.name === name)) name = `New room ${n++}`;
    commit((current) =>
      current.map((f, i) =>
        i === floorIndex
          ? { ...f, rooms: [...f.rooms, { name, x: 40, y: 40, w: 80, h: 60 }] }
          : f
      )
    );
    setSelected(name);
  };

  const duplicateRoom = () => {
    if (!room) return;
    let name = `${room.name} copy`;
    let n = 2;
    while (floor.rooms.some((r) => r.name === name)) name = `${room.name} copy ${n++}`;
    commit((current) =>
      current.map((f, i) =>
        i === floorIndex
          ? { ...f, rooms: [...f.rooms, { ...room, name, x: room.x + 10, y: room.y + 10 }] }
          : f
      )
    );
    setSelected(name);
  };

  const deleteRoom = () => {
    if (!room) return;
    commit((current) =>
      current.map((f, i) =>
        i === floorIndex
          ? {
              ...f,
              rooms: f.rooms.filter((r) => r.name !== room.name),
              openings: renameInOpenings(f.openings, room.name, null).length
                ? renameInOpenings(f.openings, room.name, null)
                : undefined,
            }
          : f
      )
    );
    setSelected(null);
  };

  const save = async () => {
    setStatus("Saving…");
    try {
      const response = await fetch("/__floor-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floors }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? response.statusText);
      setDirty(false);
      setStatus("Saved to src/data/floorPlan.ts");
    } catch (error) {
      setStatus(`Save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const revert = () => {
    commit(clone(INITIAL_FLOORS));
    setSelected(null);
    setStatus("Reverted to the file as it was loaded — Save to write it back.");
  };

  // Arrows nudge, Delete removes, Ctrl+Z/Ctrl+Shift+Z step through history.
  // Skipped entirely while a form field has focus, so typing a room name does
  // not move it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z";
      if (isUndo) {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
        return;
      }
      if (!room) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteRoom();
        return;
      }
      const step = event.shiftKey ? 10 : grid || 1;
      const nudges: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const nudge = nudges[event.key];
      if (!nudge) return;
      event.preventDefault();
      // Alt turns a nudge into a resize of the bottom-right corner.
      if (event.altKey) {
        patchRoom(room.name, clampToCanvas({ ...room, w: room.w + nudge[0], h: room.h + nudge[1] }), true);
      } else {
        patchRoom(room.name, clampToCanvas({ ...room, x: room.x + nudge[0], y: room.y + nudge[1] }), true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // The browser's own "you have unsaved changes" prompt, because the whole
  // point of this page is edits that only exist in memory until Save.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const overlaps = useMemo(() => {
    const hits = new Set<string>();
    const rooms = floor.rooms;
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const a = rooms[i];
        const b = rooms[j];
        if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
          hits.add(a.name);
          hits.add(b.name);
        }
      }
    }
    return hits;
  }, [floor.rooms]);

  const field = "w-full border border-line bg-paper px-2 py-1 text-[13px] text-ink";
  const button =
    "border border-line px-3 py-1.5 text-[12px] uppercase tracking-wider text-ink hover:border-ink disabled:opacity-40";

  return (
    <div className="min-h-screen bg-paper p-6 text-ink">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-[15px] uppercase tracking-[0.18em]">Plan editor</h1>
        <span className="text-[12px] text-stone-text">
          rooms: drag to move · handles to resize · arrows nudge · alt+arrows resize ·
          walls: click to select, click again to cycle · ctrl+z undo · ctrl+s save
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-y border-line py-2">
        {floors.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFloorIndex(i);
              setSelected(null);
            }}
            className={`${button} ${i === floorIndex ? "border-ink" : ""}`}
          >
            {f.label}
          </button>
        ))}

        <span className="mx-2 h-4 w-px bg-line" />

        <label className="flex items-center gap-1 text-[12px] text-stone-text">
          grid
          <select
            value={grid}
            onChange={(e) => setGrid(Number(e.target.value))}
            className="border border-line bg-paper px-1 py-1 text-ink"
          >
            {[0, 1, 2, 5, 10].map((g) => (
              <option key={g} value={g}>
                {g === 0 ? "off" : g}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 text-[12px] text-stone-text">
          <input type="checkbox" checked={snapEdges} onChange={(e) => setSnapEdges(e.target.checked)} />
          snap to edges
        </label>

        <span className="mx-2 h-4 w-px bg-line" />

        {(["rooms", "walls"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setSelected(null);
              setSelectedWall(null);
            }}
            className={`${button} ${mode === m ? "border-ink" : ""}`}
          >
            {m}
          </button>
        ))}

        <span className="mx-2 h-4 w-px bg-line" />

        <button type="button" className={button} onClick={addRoom}>Add</button>
        <button type="button" className={button} onClick={duplicateRoom} disabled={!room}>Duplicate</button>
        <button type="button" className={button} onClick={deleteRoom} disabled={!room}>Delete</button>
        <button type="button" className={button} onClick={undo}>Undo</button>
        <button type="button" className={button} onClick={redo}>Redo</button>
        <button type="button" className={button} onClick={revert}>Revert</button>

        <button
          type="button"
          className="border border-ink bg-ink px-4 py-1.5 text-[12px] uppercase tracking-wider text-paper"
          onClick={save}
        >
          {dirty ? "Save •" : "Save"}
        </button>
        {status && <span className="text-[12px] text-stone-text">{status}</span>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <svg
          ref={svgRef}
          viewBox={`-24 ${VIEW_TOP - 12} ${VIEW_W + 48} ${VIEW_H - VIEW_TOP + 36}`}
          className="w-full select-none border border-line bg-paper"
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerDown={() => {
            setSelected(null);
            setSelectedWall(null);
          }}
        >
          <defs>
            <pattern id="plan-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0 L0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#plan-grid)" />
          <rect
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.35"
          />

          {floor.rooms.map((r) => {
            const isSelected = r.name === selected;
            const clashes = overlaps.has(r.name);
            return (
              <g key={r.name}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx="1.5"
                  fill={clashes ? "rgba(200,80,60,0.10)" : isSelected ? "var(--sun)" : "var(--paper)"}
                  stroke={clashes ? "rgb(170,60,45)" : "currentColor"}
                  strokeWidth={isSelected ? 2 : r.outdoor ? 1 : 1.4}
                  strokeDasharray={r.outdoor ? "4 3" : undefined}
                  opacity={r.service ? 0.55 : 1}
                  style={{ cursor: "move" }}
                  pointerEvents={mode === "walls" ? "none" : undefined}
                  onPointerDown={(event) => beginDrag(event, r, "move")}
                />
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fill="currentColor"
                  pointerEvents="none"
                >
                  {r.name}
                </text>

                {isSelected &&
                  mode === "rooms" &&
                  HANDLES.map((handle) => {
                    const { x, y } = handlePosition(r, handle);
                    return (
                      <rect
                        key={handle}
                        x={x - 3.5}
                        y={y - 3.5}
                        width="7"
                        height="7"
                        fill="var(--paper)"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        style={{ cursor: HANDLE_CURSOR[handle] }}
                        onPointerDown={(event) => beginDrag(event, r, handle)}
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* The walls between rooms, clickable in wall mode. Each is drawn
              along the stretch the two rooms actually share, coloured by what
              is in it, with the opening itself picked out in solid. */}
          {mode === "walls" &&
            segments.map((seg) => {
              const key = wallKey(seg);
              const colour = WALL_COLOUR[authored(seg)?.kind ?? "auto"];
              const line = (from: number, to: number) => ({
                x1: seg.axis === "v" ? seg.at : from,
                y1: seg.axis === "v" ? from : seg.at,
                x2: seg.axis === "v" ? seg.at : to,
                y2: seg.axis === "v" ? to : seg.at,
              });
              return (
                <g key={key}>
                  <line
                    {...line(seg.lo, seg.hi)}
                    stroke={colour}
                    strokeWidth={key === selectedWall ? 3 : 1.6}
                    opacity={0.5}
                  />
                  {seg.kind !== "wall" && (
                    <line {...line(seg.from, seg.to)} stroke={colour} strokeWidth="4" />
                  )}
                  <line
                    {...line(seg.lo, seg.hi)}
                    stroke="transparent"
                    strokeWidth="10"
                    style={{ cursor: "pointer" }}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      if (key === selectedWall) cycleWall(seg);
                      else setSelectedWall(key);
                    }}
                  />
                </g>
              );
            })}
        </svg>

        <aside className="text-[13px]">
          {mode === "walls" ? (
            wall ? (
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-stone-text">
                  {wall.b === "" ? `${wall.a} / outside (${wall.side})` : `${wall.a} / ${wall.b}`}
                </p>
                <p className="text-stone-text">
                  {wall.explicit ? "Set by hand." : "Derived — currently drawn as a "}
                  {!wall.explicit && <strong className="text-ink">{wall.kind}</strong>}
                  {!wall.explicit && "."}
                </p>

                <div className="flex flex-wrap gap-1">
                  {cycleFor(wall).map((kind) => {
                    const active = (authored(wall)?.kind ?? null) === kind;
                    return (
                      <button
                        key={kind ?? "auto"}
                        type="button"
                        className={`${button} ${active ? "border-ink" : ""}`}
                        onClick={() => setOpening(wall, kind ? entryFor(wall, kind, authored(wall)) : null)}
                      >
                        {kind ?? "auto"}
                      </button>
                    );
                  })}
                </div>

                {wall.explicit && authored(wall)?.kind !== "wall" && (
                  <>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wider text-stone-text">
                        Position along the wall
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                        value={authored(wall)?.at ?? 0.5}
                        onChange={(e) =>
                          setOpening(wall, {
                            ...(authored(wall) as WallOpening),
                            at: Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wider text-stone-text">
                        Clear width (plan units)
                      </span>
                      <input
                        className={field}
                        type="number"
                        value={Math.round(wall.to - wall.from)}
                        onChange={(e) =>
                          setOpening(wall, {
                            ...(authored(wall) as WallOpening),
                            span: Number(e.target.value) || undefined,
                          })
                        }
                      />
                    </label>

                    {authored(wall)?.kind === "door" && (
                      <label className="block">
                        <span className="text-[11px] uppercase tracking-wider text-stone-text">
                          Swings into
                        </span>
                        <select
                          className={field}
                          value={authored(wall)?.into ?? ""}
                          onChange={(e) => {
                            const previous = authored(wall) as WallOpening;
                            setOpening(wall, { ...previous, into: e.target.value || undefined });
                          }}
                        >
                          {wall.b === "" ? (
                            <>
                              <option value="">{wall.a}</option>
                              <option value="outside">outside</option>
                            </>
                          ) : (
                            <>
                              <option value="">the larger room</option>
                              <option value={wall.a}>{wall.a}</option>
                              <option value={wall.b}>{wall.b}</option>
                            </>
                          )}
                        </select>
                      </label>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-stone-text">
                Click a wall to select it, then click again to cycle it. Inside walls go auto →
                door → slider → open → wall; outside walls add a window. Auto hands the wall back
                to the derivation.
              </p>
            )
          ) : room ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-stone-text">Name</span>
                <input
                  className={field}
                  value={room.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    // The section keys rooms by name, and so does selection.
                    if (name !== room.name && floor.rooms.some((r) => r.name === name)) return;
                    const previous = room.name;
                    // Openings name their rooms, so a rename has to travel
                    // into them or the wall silently reverts to derived.
                    commit((current) =>
                      current.map((f, i) =>
                        i === floorIndex
                          ? {
                              ...f,
                              rooms: f.rooms.map((r) => (r.name === previous ? { ...r, name } : r)),
                              openings: f.openings && renameInOpenings(f.openings, previous, name),
                            }
                          : f
                      )
                    );
                    setSelected(name);
                  }}
                />
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-stone-text">
                  Architect's label
                </span>
                <input
                  className={field}
                  value={room.planName ?? ""}
                  onChange={(e) =>
                    patchRoom(room.name, { planName: e.target.value || undefined }, true)
                  }
                />
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-stone-text">Area (m²)</span>
                <input
                  className={field}
                  type="number"
                  value={room.area ?? ""}
                  onChange={(e) =>
                    patchRoom(
                      room.name,
                      { area: e.target.value === "" ? undefined : Number(e.target.value) },
                      true
                    )
                  }
                />
              </label>

              <div className="grid grid-cols-4 gap-2">
                {(["x", "y", "w", "h"] as const).map((key) => (
                  <label key={key} className="block">
                    <span className="text-[11px] uppercase tracking-wider text-stone-text">{key}</span>
                    <input
                      className={field}
                      type="number"
                      value={room[key]}
                      onChange={(e) =>
                        patchRoom(
                          room.name,
                          clampToCanvas({ ...room, [key]: Number(e.target.value) || 0 }),
                          true
                        )
                      }
                    />
                  </label>
                ))}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={room.outdoor ?? false}
                  onChange={(e) => patchRoom(room.name, { outdoor: e.target.checked || undefined }, true)}
                />
                Outdoor (dashed outline)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={room.service ?? false}
                  onChange={(e) => patchRoom(room.name, { service: e.target.checked || undefined }, true)}
                />
                Service space (lift, stair, corridor)
              </label>
            </div>
          ) : (
            <p className="text-stone-text">
              Nothing selected. Click a room to edit it, or Add to make a new one.
            </p>
          )}

          <div className="mt-6 border-t border-line pt-3 text-[12px] text-stone-text">
            <p className="mb-2">
              {floor.rooms.length} rooms, {(floor.openings ?? []).length} walls set by hand.
              {overlaps.size > 0 && (
                <span className="text-[rgb(170,60,45)]"> {overlaps.size} overlapping.</span>
              )}
            </p>
            <ul className="space-y-1">
              {floor.rooms.map((r) => (
                <li key={r.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(r.name)}
                    className={`text-left hover:text-ink ${r.name === selected ? "text-ink" : ""}`}
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
