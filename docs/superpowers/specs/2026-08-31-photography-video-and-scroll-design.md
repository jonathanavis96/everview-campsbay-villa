# New photography, the film, and a shorter page

**Date:** 2026-08-31
**Status:** approved, in implementation

## Why

Three things arrived or came due at once:

1. A professional shoot delivered **33 photographs at 8191×5463 (45 MP)** and a
   **2:23 4K walkthrough film with a music track**. The site's existing plates
   are ~1200 px and visibly softer.
2. The page had grown to **13 sections and 24 photographed spaces**, each space
   its own half-screen spread. Scrolling to the enquiry takes far too long, and
   the photography sections are the bulk of it.
3. There was no motion anywhere on the page.

## What we are building

### 1. Originals live in the repo, untracked

`photo-originals/` holds the 33 JPEGs and `Video.MP4`, filed into the same
folder tree the site uses. It is in `.gitignore`: 678 MB must never enter Git
history, which is permanent and cannot be slimmed afterwards. Keeping them
inside the project — rather than on a stray disk — is what stops them being
lost.

Only the derived WebP under `src/assets/everview_photos_webp` and the encoded
video under `src/assets/video` ship.

### 2. Twenty-four spaces collapse to eleven

`PhotoCarousel` already renders one framed spread with the rest of the space's
photographs crossfading behind it, and opens the full set in the lightbox on
click. The page is long because there are **24 spaces**, not because each
spread is large. So the fix is to merge folders, not to build a new component.

Merged groups, with the folder each one reads:

| Group | Folder | Was |
|---|---|---|
| The kitchen and sunbeds | `living-level/kitchen` | kitchen, sunbeds |
| The living room and dining | `living-level/living-and-dining` | formal-living-room, indoor-dining |
| The bar, wine cellar and TV room | `living-level/bar-and-cellar` | bar, wine-cellar |
| The terrace | `living-level/terrace` | terrace, outside-lounge, outside-dining |
| Pool room and study | `bedroom-level/pool-room-and-study` | pool-room, study |
| The pool and garden | `garden-level/pool-and-garden` | pool, garden, exterior (house-from-pool) |
| Street level | `entrance/entrance` | *(was empty; now the arrival photograph)* |
| Master Suite | `bedroom-level/master-suite` | + its bathroom and balcony |
| Ocean King | `bedroom-level/ocean-king` | + its bathroom and balcony |
| Garden King | `bedroom-level/garden-king` | + its bathroom and balcony |
| Ground Floor King | `living-level/ground-king` | unchanged |

The standalone `bedroom-level/bathrooms` group disappears: each bathroom now
sits with the bedroom it serves, which is how a guest thinks about it. Mapping
confirmed by Jonathan: the twin-basin ensuite is the Master's, the mosaic
shower is the Garden King's, the white one is the Ocean King's.

Ordering inside a folder is by filename prefix. **New plates lead, old ones
follow**, except where an old frame is a near-duplicate of a new one — those go.
Old plates survive wherever the new shoot has no coverage: the sunbeds, extra
terrace angles, the second Ground King frame, and the formal living and indoor
dining frames Jonathan called out as good.

### 3. The film

**Loop.** A 29.9 s silent cut, assembled on the source's own scene boundaries
(the film is a fast-cut montage, one cut every ~2.2 s, and cutting between
boundaries drags in fragments of the neighbouring shot):

- 0.03–2.30 s — the house from the street
- 57.40–69.30 s — covered patio running into pool, lawn and Lion's Head
- 121.25–123.25 s — the master bedroom, two clean seconds
- 129.83–143.53 s — terrace, the bay, closing on the pool

**Encoding.** AV1 first, H.264 second, in one `<video>` element; the browser
takes the first source it understands. Measured with SSIM against a
near-lossless master at 1600×904:

| encode | size | SSIM |
|---|---|---|
| AV1 crf48 | 6.3 MB | 0.9775 |
| AV1 crf42 | 8.4 MB | 0.9829 |
| H.264 crf28 | 8.0 MB | 0.9709 |
| H.264 crf30 | 6.1 MB | 0.9634 |
| VP9 crf42 | 8.6 MB | 0.8966 |

AV1 crf48 ships: smaller *and* better than any H.264 point measured. VP9 is
dropped — it lost on both axes. SVT-AV1 preset 5 is used; preset 3 scored
0.9829 vs 0.9820 at the same size, which does not pay for the encode time.

**Behaviour.** Poster image on mobile with a play control; muted autoplay loop
on desktop. A phone visitor spends no video bytes unless they ask. This
protects the mobile Lighthouse score, which is gated at ≥90 and has been fought
for repeatedly (MIS-459).

**The full film** — the whole 2:23 with its music — is re-encoded to 1080p AV1
+ H.264 and opens in the lightbox on click. `preload="none"`, so it costs
nothing until played.

**Placement.** Its own section between the beach band and the house tour. The
film previews the whole house, which is what lets the room-by-room detail that
follows be shorter without feeling thin.

### 4. Sections removed and trimmed

- **Sunset band deleted.** Its photograph is the lowest-resolution plate on the
  page and nothing in the new shoot is golden hour, so it cannot be upgraded.
- **Camps Bay section keeps its text, loses its photograph.**
- **Beach band keeps its slot**, upgraded to the new 45 MP beach aerial.
- **Arrival section** loses "How the house runs" (four facts) and the six house
  rules — both are already in the welcome brochure. What remains: the lede, the
  three times on one row, and a large brochure button.
- **Plate index stays as it is**, listing every photograph, new and old. It sits
  below the enquiry; nobody reaches it by accident, so completeness is free.
- **Floor plan, the solar and water diagrams, and the reviews are untouched.**

### 5. Alt text

New plates get `PHOTO_CATALOG` entries so their alt text describes the actual
room rather than falling back to the auto-tagger. The existing catalog is keyed
on legacy slugs that no longer match any file, so it is currently doing almost
nothing.

## Out of scope

- **The hero.** It stays the existing sunset photograph. Jonathan is sourcing a
  higher-resolution original; nothing in this shoot is golden hour, so swapping
  it now would trade the site's mood for sharpness.
- A reshoot list for what the shoot missed — sunbeds, the garden at ground
  level, any golden hour — is reported, not built.

## Verification

- `npm run build` clean, `npm run lint` clean, `npm run check:content` clean.
- `node scripts/generate-thumbnails.mjs` regenerates every derivative and
  `photoDimensions.json`; no photograph ships without its `_thumb`, `_lead` and
  `_mid` derivatives, and none ships without intrinsic `width`/`height` (CLS).
- Every merged folder renders: no empty carousel, no space borrowing another
  folder's frame.
- Lighthouse mobile ≥90 with the video section in place, measured under
  devtools throttling, not simulate.
