// Proves the plan editor never reaches a production build.
//
// The route is already behind `import.meta.env.DEV` and lazily imported, so
// Rollup drops it — but that is a convention, and a convention can be broken
// by a stray import from a shipped component without anyone noticing. This
// runs after `vite build` and fails the build if any trace of the editor is
// in the output. It is the difference between "live should never get it" and
// "live cannot get it".
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
// Strings that only exist because the editor does. `/plan-editor` is the
// route; the others are its own UI copy, which no shipped section uses.
const NEEDLES = ["/plan-editor", "Plan editor", "__floor-plan"];

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else yield full;
  }
}

if (!fs.existsSync(DIST)) {
  console.error("assert-no-editor: dist/ not found — run the build first");
  process.exit(1);
}

const hits = [];
for (const file of files(DIST)) {
  if (!/\.(js|css|html|map)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf-8");
  for (const needle of NEEDLES) {
    if (text.includes(needle)) hits.push(`${path.relative(DIST, file)}: ${needle}`);
  }
}

if (hits.length) {
  console.error("assert-no-editor: the plan editor reached the build —");
  for (const hit of hits) console.error(`  ${hit}`);
  console.error("The editor is a workshop tool. It must stay behind import.meta.env.DEV.");
  process.exit(1);
}

console.log("assert-no-editor: clean — no trace of the plan editor in dist/");
