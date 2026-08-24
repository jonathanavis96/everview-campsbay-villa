import { useEffect, useState } from "react";
import { RidgelineMark } from "@/components/Ridgeline";
import { scrollToSection } from "@/lib/belowFold";

// Before the first scroll the bar sits over the hero photograph, where white
// type on a bright sunset sky was effectively invisible. It now carries its
// own darkened, blurred band from the very first paint — the same treatment
// whether or not the guest has scrolled, only lighter — so the wordmark and
// the button always have something to sit on.
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToEnquiry = () => {
    scrollToSection("enquire");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-line shadow-[0_1px_24px_-12px_rgba(18,25,28,0.45)]"
          : "bg-gradient-to-b from-ink/55 via-ink/25 to-transparent backdrop-blur-[3px]"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <a
          href="#top"
          onClick={scrollToTop}
          aria-label="Everview — back to top"
          className="group inline-flex flex-col items-center leading-none"
        >
          <RidgelineMark
            className={`h-5 w-[9.5rem] sm:h-6 sm:w-[13rem] transition-colors duration-500 ${
              scrolled ? "text-ink" : "text-paper"
            }`}
            strokeWidth={2}
          />
          <span
            className={`text-display-m -mt-2 sm:-mt-3 transition-colors duration-500 ${
              scrolled ? "text-ink" : "text-paper"
            }`}
            style={
              scrolled
                ? undefined
                : { textShadow: "0 1px 10px rgba(11,17,20,0.65)" }
            }
          >
            Everview
          </span>
        </a>

        <button
          type="button"
          onClick={scrollToEnquiry}
          className={`text-body whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-sm border transition-colors duration-300 ${
            scrolled
              ? "border-ink text-ink hover:bg-ink hover:text-paper"
              : "border-paper text-paper hover:bg-paper hover:text-ink"
          }`}
        >
          Check dates
        </button>
      </div>
    </nav>
  );
}
