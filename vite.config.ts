import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
// @ts-expect-error - plain ESM helper, shared with the plan editor's Save
import { validateFloors, writeFloorPlan } from "./scripts/serialize-floor-plan.mjs";

// The hero <img> is the page's LCP element, but its filename is content-hashed
// and only known after the bundle is written — so the browser can't discover
// it until the JS bundle parses and React renders. That late discovery is the
// PSI-measured LCP/FCP gap. This plugin injects a <link rel=preload> for the
// hero's responsive AVIF set straight after the build, using the real hashed
// filenames, so the browser fetches it in parallel with the JS bundle instead
// of after it.
function heroPreloadPlugin(): Plugin {
  return {
    name: "hero-preload",
    apply: "build",
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const assetsDir = path.join(outDir, "assets");
      const files = fs.readdirSync(assetsDir);
      const widths = [640, 960, 1280, 1920, 2048];
      const avifByWidth = new Map(
        widths.map((w) => [
          w,
          files.find((f) => new RegExp(`^hero-${w}-.*\\.avif$`).test(f)),
        ]),
      );
      if ([...avifByWidth.values()].some((f) => !f)) {
        this.warn("hero-preload: missing a hero AVIF derivative, skipping preload injection");
        return;
      }
      const base = "/everview-campsbay-villa/assets/";
      const imagesrcset = widths
        .map((w) => `${base}${avifByWidth.get(w)} ${w}w`)
        .join(", ");
      const fallbackHref = `${base}${avifByWidth.get(1920)}`;
      const preloadTag = `    <link rel="preload" as="image" type="image/avif" href="${fallbackHref}" imagesrcset="${imagesrcset}" imagesizes="100vw" fetchpriority="high" />\n`;

      const indexPath = path.join(outDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      fs.writeFileSync(indexPath, html.replace("</head>", `${preloadTag}  </head>`));
    },
  };
}

// The plan editor (/plan-editor, dev only) saves straight back into
// `src/data/floorPlan.ts` through this endpoint, so dragging a room and
// pressing Save updates the site over HMR — no copying a blob of TypeScript
// out of the browser and pasting it into the file by hand.
//
// It writes to one fixed path and takes JSON, never a string to put on disk:
// the file text is built on this side by `serialize-floor-plan.mjs` after the
// payload has been validated.
//
// Three checks stand in front of it, and the loopback one is not enough on its
// own. A page on any website open in the same browser can POST to
// `localhost:8080` — the request leaves the machine's own loopback interface,
// so an address check waves it straight through. That is a cross-origin write
// to a file in the repository. So the endpoint also requires
// `Sec-Fetch-Site: same-origin`, which browsers set themselves and page script
// cannot forge, and a JSON content type, which a form post cannot send without
// a preflight the endpoint never answers.
function floorPlanEditorApi(): Plugin {
  const ENDPOINT = "/__floor-plan";
  const isLoopback = (address?: string) =>
    address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";

  return {
    name: "floor-plan-editor-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(ENDPOINT, (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (req.method !== "POST") return send(405, { error: "POST only" });
        if (!isLoopback(req.socket.remoteAddress ?? undefined)) {
          return send(403, { error: "the plan editor only saves from localhost" });
        }
        // Absent on a non-browser client (curl, a test) — which is fine; what
        // must never pass is a browser telling us the request came from
        // somewhere else.
        const site = req.headers["sec-fetch-site"];
        if (site !== undefined && site !== "same-origin") {
          return send(403, { error: "cross-origin save refused" });
        }
        if (!String(req.headers["content-type"] ?? "").startsWith("application/json")) {
          return send(415, { error: "expected application/json" });
        }

        let raw = "";
        req.on("data", (chunk) => {
          raw += chunk;
          // A plan is a couple of kilobytes; anything larger is not one.
          if (raw.length > 256_000) {
            send(413, { error: "payload too large" });
            req.destroy();
          }
        });
        req.on("end", () => {
          if (res.writableEnded) return;
          try {
            const floors = validateFloors(JSON.parse(raw).floors);
            writeFloorPlan(path.resolve(__dirname, "src/data/floorPlan.ts"), floors);
            send(200, { ok: true });
          } catch (error) {
            send(400, { error: error instanceof Error ? error.message : String(error) });
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: "/everview-campsbay-villa/", // important for GitHub Pages
  plugins: [react(), heroPreloadPlugin(), floorPlanEditorApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
