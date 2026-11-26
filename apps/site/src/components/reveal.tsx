import type { ReactNode } from "react";

/**
 * Fades and lifts content in as it scrolls into view, using CSS scroll-driven animations.
 * No JavaScript: content is always visible first, and browsers without support simply skip the effect.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={`reveal ${className}`}>
      {children}
    </div>
  );
}
