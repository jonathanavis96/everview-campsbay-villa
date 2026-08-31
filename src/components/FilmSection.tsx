// The film.
//
// Two encodes of the same 29.9s silent cut sit in public/video, AV1 first and
// H.264 second, and the browser takes the first <source> it understands.
// Measured with SSIM against a near-lossless master at 1600x904 on 2026-08-31:
// AV1 crf48 scored 0.9775 at 6.3 MB against H.264 crf28's 0.9709 at 8.0 MB, so
// the AV1 is both smaller and cleaner. VP9 was tested and dropped — 0.8966 at
// 8.6 MB, worse than H.264 on both axes.
//
// The loop autoplays on every desktop, including ones asking for reduced
// motion — Jonathan's call on 2026-09-01: the loop IS the section, and a
// still frame there reads as a broken video rather than a considered choice.
// On a phone it is a poster image and
// nothing more until the visitor asks, because ~6 MB on every mobile visit is
// real data and a real risk to the mobile Lighthouse score, which is gated at
// >=90 and has been fought for repeatedly (MIS-459). preload="none" keeps the
// bytes unrequested until we decide to play.
//
// The full 2:23 walkthrough, with its music, opens in a dialog over the page.
// It is a separate, larger pair of files that nothing fetches until the button
// is pressed.
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import Reveal from "@/components/Reveal";

const BASE = import.meta.env.BASE_URL;
const LOOP_AV1 = `${BASE}video/everview-loop.av1.mp4`;
const LOOP_H264 = `${BASE}video/everview-loop.h264.mp4`;
const POSTER = `${BASE}video/everview-loop-poster.webp`;
const FILM_AV1 = `${BASE}video/everview-film.av1.mp4`;
const FILM_H264 = `${BASE}video/everview-film.h264.mp4`;

/** Desktop only. Width is the whole test; reduced motion is not consulted. */
function useAutoplayLoop() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const decide = () => setAllowed(wide.matches);
    decide();
    wide.addEventListener("change", decide);
    return () => wide.removeEventListener("change", decide);
  }, []);

  return allowed;
}

/**
 * The full film, at the same size as a photograph in the lightbox: the whole
 * viewport bar the control gutters, not a box floating in the middle of it.
 */
function FilmDialog({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Whatever opened the dialog gets focus back when it closes — by Escape,
    // by the close button or by the backdrop. Without this, focus falls to
    // <body> and a keyboard visitor loses their place on the page.
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // A twentieth of the original mix: the encoded file is at 10% (two passes
    // of scripts/encode-film-audio.sh, 0.2 then 0.5) and the player opens at
    // half of that. Jonathan's calls on 2026-09-01. Keeping most of the
    // reduction in the file means a visitor who drags the slider to maximum
    // still does not get the original blast.
    if (filmRef.current) filmRef.current.volume = 0.5;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The full walkthrough of Everview"
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close the film"
        className="absolute right-4 top-4 rounded-full bg-paper/90 p-2 text-ink hover:bg-paper"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-center px-4 py-14 md:px-20">
        <video
          ref={filmRef}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full"
          controls
          autoPlay
          playsInline
          preload="metadata"
        >
          <source src={FILM_AV1} type="video/mp4; codecs=av01.0.08M.08" />
          <source src={FILM_H264} type="video/mp4; codecs=avc1.640028" />
        </video>
      </div>
    </div>
  );
}

export default function FilmSection() {
  const autoplay = useAutoplayLoop();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const loopRef = useRef<HTMLVideoElement>(null);

  // The autoplay attribute alone is not always enough: Chrome ignores it if
  // the element is still laid out at zero height when it is parsed, which the
  // Reveal wrapper can cause. Ask once more after mount. It is muted, so no
  // gesture is required and a rejection is nothing to act on.
  useEffect(() => {
    if (!autoplay) return;
    loopRef.current?.play().catch(() => {});
  }, [autoplay]);

  // Two cuts of the same house playing at once is the wrong impression
  // entirely. The loop stops while the film is open and picks up again after,
  // and pausing also stops it decoding behind an opaque overlay.
  useEffect(() => {
    const v = loopRef.current;
    if (!v) return;
    if (open) v.pause();
    else if (autoplay) v.play().catch(() => {});
  }, [open, autoplay]);

  return (
    <section id="film" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The house, in motion</p>

        {/* One centred column, heading and film together — the film sitting
            hard left under a full-width rule read as an afterthought
            (Jonathan, 2026-09-01). */}
        <div className="border-t border-line pt-8 md:pt-12">
          <Reveal className="mx-auto max-w-3xl mb-6">
            <h2 className="text-display-l text-ink mb-3">Walk through it</h2>
            <p className="text-lede text-ink">
              Half a minute from the street to the terrace, taking in the pool,
              the lawn and the bay on the way. The full walkthrough, with sound,
              runs two and a half minutes.
            </p>
          </Reveal>

          <Reveal delayMs={100} className="mx-auto max-w-3xl">
            <div className="photo-frame photo-frame--static relative">
              <video
                ref={loopRef}
                key={String(autoplay)}
                className="block w-full"
                poster={POSTER}
                muted
                loop
                playsInline
                autoPlay={autoplay}
                preload={autoplay ? "metadata" : "none"}
                controls={!autoplay}
                width={1600}
                height={904}
                aria-label="A silent walkthrough of Everview: the house from the street, the pool and garden, the master bedroom, and the terrace over Camps Bay"
              >
                {/* The sources are always here, so the phone's own controls
                    can play the loop if a visitor asks. preload="none" is what
                    keeps it from costing anything until they do. */}
                <source src={LOOP_AV1} type="video/mp4; codecs=av01.0.08M.08" />
                <source src={LOOP_H264} type="video/mp4; codecs=avc1.640028" />
              </video>
              {/* On desktop the loop carries no controls of its own, so the
                  whole frame is the button — clicking the film opens the film,
                  which is what anyone expects (Jonathan, 2026-09-01). On a
                  phone the element shows its own controls and this overlay is
                  not rendered, so a tap still reaches play/pause. */}
              {autoplay && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Play the full film with sound"
                  className="group absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex items-center gap-3 bg-ink/70 px-5 py-3 text-label text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Play the full film
                  </span>
                </button>
              )}
            </div>

            {/* Below the frame, not over it — overlaid it collided with the
                phone's own control bar (2026-09-01). */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 inline-flex items-center gap-3 border border-ink bg-ink px-6 py-4 text-label text-paper transition-colors hover:bg-transparent hover:text-ink"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Play the full film — 2:23, with sound
            </button>
          </Reveal>
        </div>
      </div>

      {open && <FilmDialog onClose={close} />}
    </section>
  );
}
