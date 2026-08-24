import hero640Avif from "@/assets/hero/hero-640.avif";
import hero960Avif from "@/assets/hero/hero-960.avif";
import hero1280Avif from "@/assets/hero/hero-1280.avif";
import hero1920Avif from "@/assets/hero/hero-1920.avif";
import hero2048Avif from "@/assets/hero/hero-2048.avif";
import hero640Webp from "@/assets/hero/hero-640.webp";
import hero960Webp from "@/assets/hero/hero-960.webp";
import hero1280Webp from "@/assets/hero/hero-1280.webp";
import hero1920Webp from "@/assets/hero/hero-1920.webp";
import hero2048Webp from "@/assets/hero/hero-2048.webp";
import hero640Jpg from "@/assets/hero/hero-640.jpg";
import hero960Jpg from "@/assets/hero/hero-960.jpg";
import hero1280Jpg from "@/assets/hero/hero-1280.jpg";
import hero1920Jpg from "@/assets/hero/hero-1920.jpg";
import hero2048Jpg from "@/assets/hero/hero-2048.jpg";

const heroAvifSrcSet = `${hero640Avif} 640w, ${hero960Avif} 960w, ${hero1280Avif} 1280w, ${hero1920Avif} 1920w, ${hero2048Avif} 2048w`;
const heroWebpSrcSet = `${hero640Webp} 640w, ${hero960Webp} 960w, ${hero1280Webp} 1280w, ${hero1920Webp} 1920w, ${hero2048Webp} 2048w`;
const heroJpgSrcSet = `${hero640Jpg} 640w, ${hero960Jpg} 960w, ${hero1280Jpg} 1280w, ${hero1920Jpg} 1920w, ${hero2048Jpg} 2048w`;

// The type sits in the photograph's own quiet band, but a sunset frame has
// no reliably dark pixel anywhere — so every line above the fold carries its
// own shadow, and the wordmark a hairline dark stroke as well.
const TITLE_SHADOW =
  "0 2px 10px rgba(11,17,20,0.55), 0 0 26px rgba(11,17,20,0.35)";
const LEDE_SHADOW =
  "0 1px 4px rgba(11,17,20,0.7), 0 0 14px rgba(11,17,20,0.35)";
const LABEL_SHADOW = "0 1px 4px rgba(11,17,20,0.7)";

export default function HeroSection() {
  const scrollToEnquiry = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative h-screen min-h-[560px] overflow-hidden">
      <picture>
        <source type="image/avif" srcSet={heroAvifSrcSet} sizes="100vw" />
        <source type="image/webp" srcSet={heroWebpSrcSet} sizes="100vw" />
        <img
          src={hero1920Jpg}
          srcSet={heroJpgSrcSet}
          sizes="100vw"
          width={2048}
          height={1366}
          decoding="async"
          {...{ fetchpriority: "high" }}
          alt="Everview at sunset, seen from the garden, with the Atlantic and Lion's Head behind the house"
          className="absolute inset-0 w-full h-full object-cover animate-hero-drift"
        />
      </picture>

      {/* Legibility insurance for the type block below — nearly invisible,
          bottom of frame only. The type sits in the photograph's own quiet
          band (design-direction §6.1's luminance grid), so this is a small
          top-up, not the reason the type reads. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(11,17,20,0.62), rgba(11,17,20,0.18) 46%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-xl">
            <p
              className="text-label text-paper/85 mb-4 animate-fade-up"
              style={{ animationDelay: "150ms", textShadow: LABEL_SHADOW }}
            >
              Camps Bay · Cape Town
            </p>
            <h1
              className="text-display-xl text-paper mb-4 animate-fade-up"
              style={{
                animationDelay: "260ms",
                WebkitTextStrokeWidth: "0.6px",
                WebkitTextStrokeColor: "rgba(11,17,20,0.35)",
                textShadow: TITLE_SHADOW,
              }}
            >
              Everview
            </h1>
            <p
              className="text-lede text-paper mb-8 max-w-[34ch] animate-fade-up"
              style={{ animationDelay: "400ms", textShadow: LEDE_SHADOW }}
            >
              Four bedrooms above the Atlantic, at the end of a quiet road.
            </p>
            <button
              type="button"
              onClick={scrollToEnquiry}
              className="inline-flex items-center justify-center bg-paper text-ink px-8 py-4 text-body font-medium rounded-sm shadow-lg shadow-ink/30 hover:bg-paper/90 hover:-translate-y-0.5 transition-[background-color,transform] duration-300 animate-fade-up"
              style={{ animationDelay: "540ms" }}
            >
              Check dates
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
