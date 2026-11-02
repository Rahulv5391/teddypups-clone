"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { curtainDown, prefersReducedMotion } from "@/lib/curtain";

/**
 * Reveal-on-scroll for any descendant with `data-reveal`.
 * Elements already on screen are marked revealed immediately; the rest get `data-armed`
 * (CSS hides them) and flip to `data-revealed` as they scroll into view.
 * While the route curtain is down, reveals are queued and released when it lifts.
 */
export function RevealScope({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pending = "[data-reveal]:not([data-revealed])";

    if (prefersReducedMotion()) {
      const revealAll = () => root.querySelectorAll<HTMLElement>(pending).forEach((el) => (el.dataset.revealed = "true"));
      revealAll();
      const mo = new MutationObserver(revealAll);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const queued = new Set<HTMLElement>();
    const reveal = (el: HTMLElement) => {
      el.dataset.revealed = "true";
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (curtainDown()) queued.add(el);
          else reveal(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    const arm = (el: HTMLElement) => {
      if (el.dataset.armed) return io.observe(el);
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && !curtainDown()) {
        el.dataset.revealed = "true";
        return;
      }
      el.dataset.armed = "true";
      io.observe(el);
    };

    root.querySelectorAll<HTMLElement>(pending).forEach(arm);
    const mo = new MutationObserver(() => root.querySelectorAll<HTMLElement>(pending).forEach(arm));
    mo.observe(root, { childList: true, subtree: true });

    const flush = () => {
      queued.forEach(reveal);
      queued.clear();
    };
    addEventListener("tp:arrived", flush);
    let timer: ReturnType<typeof setTimeout>;
    const poll = () => (curtainDown() ? (timer = setTimeout(poll, 400)) : flush());
    timer = setTimeout(poll, 1600);

    return () => {
      clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
      removeEventListener("tp:arrived", flush);
    };
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
