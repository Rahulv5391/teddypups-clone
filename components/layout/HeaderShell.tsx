"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fixed header wrapper:
 * - data-scrolled: page scrolled more than 8px (header gets its milk background + scalloped hem)
 * - data-hidden: hides while scrolling down past 220px, comes back on scroll up or keyboard focus
 * - data-home: on the home page the header starts transparent over the hero
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const isHome = usePathname() === "/";

  useEffect(() => {
    const el = ref.current!;
    let lastY = scrollY;
    let queued = false;

    const update = () => {
      const y = scrollY;
      el.dataset.scrolled = y > 8 ? "true" : "false";
      if (Math.abs(y - lastY) > 6) {
        el.dataset.hidden = y > lastY && y > 220 ? "true" : "false";
        lastY = y;
      }
      queued = false;
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    const reveal = () => (el.dataset.hidden = "false");

    update();
    addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", reveal);
    return () => {
      removeEventListener("scroll", onScroll);
      el.removeEventListener("focusin", reveal);
    };
  }, []);

  return (
    <header
      ref={ref}
      id="site-header"
      data-scrolled="false"
      data-hidden="false"
      data-home={isHome || undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      {children}
    </header>
  );
}
