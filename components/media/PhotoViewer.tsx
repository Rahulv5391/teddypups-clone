"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/content/types";
import { MediaImage } from "./MediaImage";

/** Width (px) the photo will occupy in the full-screen viewer, so we request the right size. */
const viewerWidth = (m: Media) => Math.ceil(Math.min(innerWidth, Math.max(1, innerHeight - 150) * (m.width / m.height)));

/** Shows the already-loaded page image instantly, then swaps in a sharp full-size copy once decoded. */
export function ViewerPhoto({ media, pageSizes, quality = 75 }: { media: Media; pageSizes: string; quality?: number }) {
  const [sharp, setSharp] = useState(false);
  return (
    <>
      <MediaImage
        media={media}
        sizes={pageSizes}
        quality={quality}
        alt=""
        eager
        className={sharp ? "tp-viewer__first tp-viewer__first--done" : "tp-viewer__first"}
        style={{ objectFit: "contain", objectPosition: "50% 50%", backgroundColor: "transparent" }}
      />
      <Image
        src={media.url}
        alt={media.alt}
        fill
        sizes={`${viewerWidth(media)}px`}
        quality={quality}
        loading="eager"
        className="tp-viewer__sharp object-contain"
        data-sharp={sharp || undefined}
        onLoad={(e) => e.currentTarget.decode().catch(() => {}).then(() => setSharp(true))}
      />
    </>
  );
}

/** Warms the cache for the neighbouring photos so swiping feels instant. */
export function PrefetchNeighbours({ items, at, quality = 75 }: { items: Media[]; at: number; quality?: number }) {
  const n = items.length;
  if (n < 2) return null;
  const idx = [...new Set([(at - 1 + n) % n, (at + 1) % n])].filter((i) => items[i].kind === "image");
  return (
    <span aria-hidden="true" className="sr-only">
      {idx.map((i) => (
        <Image key={items[i].id} src={items[i].url} alt="" fill sizes={`${viewerWidth(items[i])}px`} quality={quality} loading="eager" />
      ))}
    </span>
  );
}

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: 70 * dir, rotate: 5 * dir, scale: 0.92 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
  exit: (dir: number) => ({ opacity: 0, x: -70 * dir, rotate: -5 * dir, scale: 0.92, transition: { duration: 0.22 } }),
};

/**
 * Full-screen photo viewer for a list of photos (memory wall, home photo wall).
 * Returns `open(index)` and the `viewer` element to render once.
 */
export function usePhotoViewer(photos: Media[], pageSizes: string) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const n = photos.length;
  const wrap = useCallback((i: number) => ((i % n) + n) % n, [n]);
  const go = useCallback(
    (i: number, d: number) => {
      setDir(d);
      setAt(wrap(i));
    },
    [wrap],
  );

  useEffect(() => {
    if (at === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(at + 1, 1);
      if (e.key === "ArrowLeft") go(at - 1, -1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [at, go]);

  const current = at === null ? null : photos[at];

  const viewer = (
    <dialog
      ref={dialog}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onClose={() => setAt(null)}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      {current && at !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg">
              {at + 1} / {n}
              {current.caption ? ` — ${current.caption}` : ""}
            </p>
            <button type="button" onClick={() => dialog.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={current.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(at + 1, 1);
                  else if (info.offset.x > 80) go(at - 1, -1);
                }}
              >
                <ViewerPhoto media={current} pageSizes={pageSizes} />
              </motion.div>
            </AnimatePresence>
            <PrefetchNeighbours items={photos} at={at} />
          </div>
          <div className="flex justify-center gap-3 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button type="button" onClick={() => go(at - 1, -1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
              Previous
            </button>
            <button type="button" onClick={() => go(at + 1, 1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  );

  return {
    open: (i: number) => {
      setDir(1);
      setAt(i);
      dialog.current?.showModal();
    },
    viewer,
  };
}
