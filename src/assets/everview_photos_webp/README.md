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
  pool-room-and-study/
  *.webp            loose files here show as "More of the bedroom level"
living-level/
  kitchen/          living-and-dining/   bar-and-cellar/
  terrace/          ground-king/
garden-level/
  pool-and-garden/
entrance/entrance/
views/
```

A folder with no files in it renders nothing — no empty carousel, no gap. A
folder that does not exist at all renders its copy without photographs, which
is deliberate.

**The folders are deliberately coarse.** Each one is a *group*, not a room: the
kitchen folder holds the sunbeds too, `living-and-dining` holds the formal
living room and the dining table, `bar-and-cellar` holds the bar, the wine
cellar and the television room, and each bedroom folder holds that bedroom's
balcony and its en-suite. Every folder is one spread on the page, so splitting a
group in two adds half a screen of scrolling — which is exactly what the
2026-08-31 merge removed. Add to a group before you add a group.

Ordering inside a folder is by the `{order}` prefix, and the 2026-08 plates
(45 MP originals, 1600px WebP) come first in every folder; the older, softer
plates follow them and are what the carousel crossfades to.

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
