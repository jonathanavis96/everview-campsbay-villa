# Everview Villa

Single-page marketing site for Everview Villa, a Camps Bay holiday villa. Live at
https://jonathanavis96.github.io/everview-campsbay-villa/

## Stack

Vite + React 18 + TypeScript + Tailwind + shadcn/ui.

## Local development

Requires Node.js v20.11 or newer — the build scripts use `import.meta.dirname`, which landed in 20.11.

```sh
npm install
npm run dev
```

Other scripts:

```sh
npm run build    # production build to dist/
npm run lint     # eslint
npm run preview  # preview a production build locally
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. There is no manual deploy step.

The site is served from the `/everview-campsbay-villa/` subpath (see
`vite.config.ts`'s `base` setting), not from a domain root.

## `public/old/`

`public/old/` is a frozen snapshot of the pre-revamp site, kept for before/after
comparison. It is marked `noindex` and is not part of the current site — do not
edit it.
