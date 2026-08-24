import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

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

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: "/everview-campsbay-villa/", // important for GitHub Pages
  plugins: [react(), heroPreloadPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
