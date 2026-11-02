"use client";

import { useEffect, useRef } from "react";
import { site, whatsappLink } from "@/content/site";
import { Paw } from "@/components/ui/Paw";
import { NavLink } from "./NavLink";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Full-screen menu in a native <dialog> (focus trap + Escape for free), revealed with a circular wipe. */
export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);

  // Play the closing animation, then actually close.
  const close = () => {
    const dialog = ref.current;
    if (!dialog?.open || dialog.dataset.closing) return;
    if (reducedMotion()) return dialog.close();
    dialog.dataset.closing = "true";
    const done = () => {
      clearTimeout(timer);
      dialog.removeEventListener("animationend", onEnd);
      if (dialog.dataset.closing) dialog.close();
    };
    const onEnd = (e: AnimationEvent) => e.target === dialog && done();
    const timer = setTimeout(done, 600);
    dialog.addEventListener("animationend", onEnd);
  };

  // Close when a page transition starts (fired by the route curtain).
  useEffect(() => {
    const onNavigate = () => ref.current?.close();
    addEventListener("tp:navigate", onNavigate);
    return () => removeEventListener("tp:navigate", onNavigate);
  }, []);

  const linkClass = "tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]";

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <Paw className="size-4" />
        Menu
      </button>
      <dialog
        ref={ref}
        aria-label="Site menu"
        className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
        onClick={(e) => e.target === ref.current && close()}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={(e) => delete e.currentTarget.dataset.closing}
      >
        <div className="gutter flex h-full flex-col pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <span className="font-scrawl text-lg">where to, friend?</span>
            <button type="button" onClick={close} className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk">
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} onNavigate={close} className={linkClass} />
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3">
            <a href={whatsappLink()} className="btn btn-whatsapp w-full" target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
            <p className="text-center text-sm font-medium">{site.phone}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
