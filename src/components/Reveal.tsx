import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Fades and lifts its children in the first time they scroll into view.
 * The classes live in index.css (`.reveal` / `.reveal.is-visible`).
 *
 * Motion is always on for this site — there is deliberately no
 * prefers-reduced-motion branch.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
