# Photographs

**Where a file sits decides where it appears on the site.** There is no
filename keyword-matching anywhere in the code any more — a photograph shows
up under "The kitchen" because it is in `living-level/kitchen/`, and for no
other reason. To move a photograph from one part of the page to another, move
the file.

## Naming

```
{order}-{floor}-{roomName}.webp
```

- `{order}` — the position the photo takes within its folder, `1` first. It is
  a display order, not a floor number.
- `{floor}` — `bedroom`, `living`, `garden`, `exterior`, `view`.
- `{roomName}` — camelCase when it is more than one word: `masterSuite`,
  `indoorDining`, `formalLivingRoom`.

Examples: `1-living-kitchen.webp`, `3-bedroom-masterSuite.webp`,
`2-living-formalLivingRoom.webp`.

The filename never reaches the page — it is for you, not for guests. Captions
come from the component that renders the folder.

## The tree

```
bedroom-level/
  master-suite/     ocean-king/      garden-king/
  bathrooms/        pool-room/       study/
  *.webp            loose files here show as "More of the bedroom level"
living-level/
  kitchen/          indoor-dining/   formal-living-room/
  outside-lounge/   sunbeds/         wine-cellar/
  terrace/          ground-king/
garden-level/
  pool/             garden/
exterior/
views/
```

A folder with no files in it renders nothing — no empty carousel, no gap. A
folder that does not exist at all (e.g. `entrance/`) renders its copy without
photographs, which is deliberate.

## After moving or adding a file

```sh
node scripts/generate-thumbnails.mjs
```

Run it from the repository root. It writes the `_thumb` (192px) and `_lead`
(640px) derivatives beside each photo and rebuilds
`src/utils/photoDimensions.json`, which is what stops the page reflowing while
images load. **A photo without derivatives will still display, but it will
ship the full-size file to a phone.** Commit the derivatives along with the
photo.
