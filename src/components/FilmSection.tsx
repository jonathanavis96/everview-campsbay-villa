// The film.
//
// Two encodes of the same 29.9s silent cut sit in public/video, AV1 first and
// H.264 second, and the browser takes the first <source> it understands.
// Measured with SSIM against a near-lossless master at 1600x904 on 2026-08-31:
// AV1 crf48 scored 0.9775 at 6.3 MB against H.264 crf28's 0.9709 at 8.0 MB, so
// the AV1 is both smaller and cleaner. VP9 was tested and dropped — 0.8966 at
// 8.6 MB, worse than H.264 on both axes.
//
// The loop autoplays on desktop only. On a phone it is a poster image and
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

/** Desktop, and only when the visitor has not asked for less motion. */
function useAutoplayLoop() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setAllowed(wide.matches && !still.matches);
    decide();
    wide.addEventListener("change", decide);
    still.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
    };
  }, []);

  return allowed;
}

function FilmDialog({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The full walkthrough of Everview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
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

      <video
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-6xl"
        controls
        autoPlay
        playsInline
        preload="metadata"
      >
        <source src={FILM_AV1} type="video/mp4; codecs=av01.0.08M.08" />
        <source src={FILM_H264} type="video/mp4; codecs=avc1.640028" />
      </video>
    </div>
  );
}

export default function FilmSection() {
  const autoplay = useAutoplayLoop();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="film" className="py-8 md:py-12">
      <div className="container">
        <p className="text-label text-stone-text mb-4">The house, in motion</p>

        <div className="border-t border-line pt-8 md:pt-12">
          <Reveal className="max-w-3xl mb-8">
            <h2 className="text-display-l text-ink mb-4">Walk through it</h2>
            <p className="text-lede text-ink">
              Half a minute from the street to the terrace, taking in the pool,
              the lawn and the bay on the way. The full walkthrough, with sound,
              runs two and a half minutes.
            </p>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="photo-frame relative">
              <video
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

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute bottom-4 left-4 inline-flex items-center gap-3 bg-paper/90 px-5 py-3 text-label text-ink transition-colors hover:bg-paper"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Play the full film — 2:23, with sound
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {open && <FilmDialog onClose={close} />}
    </section>
  );
}
