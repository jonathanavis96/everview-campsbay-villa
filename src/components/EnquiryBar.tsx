import { useEffect, useState } from "react";

export default function EnquiryBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollToEnquiry = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-ink text-paper transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        <p className="text-data text-sm truncate">
          4 bedrooms · sleeps 8 · Camps Bay
        </p>
        <button
          type="button"
          onClick={scrollToEnquiry}
          className="shrink-0 bg-paper text-ink px-5 py-2.5 text-body font-medium rounded-sm hover:bg-paper/90 transition-colors"
        >
          Check dates
        </button>
      </div>
    </div>
  );
}
