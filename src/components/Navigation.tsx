import { useEffect, useState } from "react";
import { RidgelineMark } from "@/components/Ridgeline";

// Section links return once MIS-449 lands the content sections they point
// to — a nav item that scrolls nowhere is the same defect as a play button
// with no video.
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
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-paper border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <a
          href="#top"
          onClick={scrollToTop}
          aria-label="Everview — back to top"
          className="inline-flex flex-col items-start"
        >
          <span
            className={`text-display-m transition-colors duration-300 ${
              scrolled ? "text-ink" : "text-paper"
            }`}
          >
            Everview
          </span>
          <RidgelineMark
            className={`h-3 w-32 -mt-1 transition-colors duration-300 ${
              scrolled ? "text-stone" : "text-paper/70"
            }`}
          />
        </a>

        <button
          type="button"
          onClick={scrollToEnquiry}
          className={`text-body px-5 py-2.5 rounded-sm border transition-colors duration-300 ${
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
