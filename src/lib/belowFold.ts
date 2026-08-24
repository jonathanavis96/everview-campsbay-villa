// The hero paints first; everything under it arrives a moment later (see
// `useAfterHero` in src/pages/Index.tsx). That deferral is worth real
// milliseconds, but it means the anchors that live below the fold — #enquire
// above all — are not in the document when a guest clicks "Enquire" on a page
// that has only just appeared.
//
// So the scroll targets go through here instead of straight to
// getElementById. A request both pulls the below-fold chunk forward and waits
// for the element to actually exist before scrolling to it.

let revealed = false;
const listeners = new Set<() => void>();

/** True once the below-fold sections have been asked for. */
export const isBelowFoldRevealed = () => revealed;

/** Bring the below-fold sections forward now, whatever the idle timer was doing. */
export function revealBelowFold() {
  if (revealed) return;
  revealed = true;
  for (const listener of [...listeners]) listener();
}

/** Subscribe to the reveal. Returns its own unsubscribe. */
export function onBelowFoldReveal(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** How long to keep looking for the element before giving up, in ms. */
const WAIT_MS = 5000;

/**
 * Scroll to an element by id, mounting the below-fold sections first if that
 * is where it lives. The element cannot appear until the lazy chunk has been
 * fetched and React has rendered it, so this polls per frame rather than
 * assuming one tick is enough — and stops after `WAIT_MS` so a bad id on a
 * failed chunk load cannot spin forever.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  revealBelowFold();

  const attempt = () => {
    const element = document.getElementById(id);
    if (!element) return false;
    element.scrollIntoView({ behavior });
    return true;
  };

  if (attempt()) return;

  const deadline = Date.now() + WAIT_MS;
  const tick = () => {
    if (attempt() || Date.now() > deadline) return;
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}
