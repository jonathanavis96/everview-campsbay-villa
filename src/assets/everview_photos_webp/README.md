# Photographs — where a file sits decides where it appears

The folder tree mirrors the house. Nothing on the site matches keywords
against filenames any more: a photograph appears in a section because it sits
in that section's folder, and nowhere else. Moving a file is the whole
editing interface.

```
everview_photos_webp/
  bedroom-level/            <- loose files here: "More of the bedroom level"
    master-suite/           <- Master Suite spread
    ocean-king/             <- Ocean King spread
    garden-king/            <- Garden King spread
    bathrooms/              <- The bathrooms spread
    pool-room/              <- Pool room (billiards, media corner)
    study/                  <- The study
  living-level/
    kitchen/
    indoor-dining/
    living-room/
    bar-and-cellar/
    terrace/                <- the covered front patio
    ground-king/            <- Ground Floor King spread
  garden-level/
    pool/
    garden/
  exterior/                 <- the house from outside
  views/
```

Every photograph, wherever it sits, is also published in "The plates" index at
the foot of the page, grouped by its folder.

## Adding, moving or removing a photograph

1. Put the file in the right folder (or move it between folders).
2. Run `node scripts/generate-thumbnails.mjs`.

That regenerates the 192px and 640px derivatives in
`everview_photos_webp_thumb/` and `everview_photos_webp_lead/`, which mirror
this tree exactly, and rewrites `src/utils/photoDimensions.json`. Skipping it
means a moved photograph loads at full size, or not at all.

## Two rules worth keeping

**Filenames never reach the page.** They are internal. The site identifies
photographs by their group and a plate number, so a file called
`covered-patio-dining-sea.webp` is fine as a filename and never appears as a
caption.

**A folder with no photographs shows no photographs.** A space with an empty
folder renders as a line of text under its level. It must never borrow a
frame from another folder to fill the gap.

## Creating a new space

Add the folder here, then add one line naming it in
`src/components/HouseLevelsSection.tsx` — the folder path, the name guests
see, and a sentence of copy.
