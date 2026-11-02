"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/content/types";
import { MediaImage } from "@/components/media/MediaImage";

const PAGE_SIZES = "(min-width: 1024px) 55vw, 92vw";

/** Width (px) the photo will occupy in the full-screen viewer, so we request the right size. */
const viewerWidth = (m: Media) => Math.ceil(Math.min(innerWidth, Math.max(1, innerHeight - 150) * (m.width / m.height)));

/** Full-screen photo: shows the already-loaded page image, then swaps in a sharp copy once decoded. */
function ViewerPhoto({ media }: { media: Media }) {
  const [sharp, setSharp] = useState(false);
  return (
    <>
      <MediaImage
        media={media}
        sizes={PAGE_SIZES}
        quality={85}
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
        quality={85}
        loading="eager"
        className="tp-viewer__sharp object-contain"
        data-sharp={sharp || undefined}
        onLoad={(e) => e.currentTarget.decode().catch(() => {}).then(() => setSharp(true))}
      />
    </>
  );
}

/** Warm the cache for the neighbouring photos so swiping feels instant. */
function Prefetch({ items, at }: { items: Media[]; at: number }) {
  const n = items.length;
  if (n < 2) return null;
  const idx = [...new Set([(at - 1 + n) % n, (at + 1) % n])].filter((i) => items[i].kind === "image");
  return (
    <span aria-hidden="true" className="sr-only">
      {idx.map((i) => (
        <Image key={items[i].id} src={items[i].url} alt="" fill sizes={`${viewerWidth(items[i])}px`} quality={85} loading="eager" />
      ))}
    </span>
  );
}

export function PuppyGallery({ name, media }: { name: string; media: Media[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const count = media.length;
  const current = media[index];

  const go = useCallback(
    (to: number) => {
      setDir(to > index ? 1 : -1);
      setIndex(((to % count) + count) % count);
    },
    [index, count],
  );

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [viewerOpen, index, go]);

  if (!current) return null;
  const describe = (i: number) => `${name}, ${media[i].kind === "video" ? "video" : "photo"} ${i + 1} of ${count}`;

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.button
            key={current.id}
            type="button"
            custom={dir}
            className="absolute inset-0 block size-full"
            initial={{ clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", rotateY: -14 * dir, transformPerspective: 1400 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", rotateY: 0 }}
            exit={{ opacity: 0.4, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: dir > 0 ? "0% 50%" : "100% 50%" }}
            onClick={() => {
              dialog.current?.showModal();
              setViewerOpen(true);
            }}
            aria-label={`Open ${describe(index)} full screen`}
          >
            {current.kind === "video" ? (
              <video src={current.url} poster={current.poster?.url} className="size-full object-cover" muted loop playsInline autoPlay aria-label={current.alt} />
            ) : (
              <MediaImage media={current} sizes={PAGE_SIZES} preload={index === 0} quality={85} />
            )}
          </motion.button>
        </AnimatePresence>
        {count > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button type="button" onClick={() => go(index - 1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Previous photo">
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={() => go(index + 1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Next photo">
              ›
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pt-2 pb-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((m, i) => {
            const thumb = m.kind === "video" ? m.poster : m;
            return (
              <li key={m.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={describe(i)}
                  aria-current={i === index}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    i === index ? "-translate-y-1 -rotate-3 border-toffee-deep" : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                  }`}
                >
                  {thumb && <MediaImage media={thumb} sizes="96px" alt="" />}
                  {m.kind === "video" && <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-label={`${name} photos`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
        onClose={() => setViewerOpen(false)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        {viewerOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="font-scrawl text-lg">{describe(index)}</p>
              <button type="button" onClick={() => dialog.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
                Close
              </button>
            </div>
            <div className="relative flex-1 touch-pan-y">
              <motion.div
                key={current.id}
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(index + 1);
                  else if (info.offset.x > 80) go(index - 1);
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {current.kind === "video" ? (
                  <video src={current.url} poster={current.poster?.url} controls autoPlay playsInline className="size-full object-contain" />
                ) : (
                  <ViewerPhoto media={current} />
                )}
              </motion.div>
              <Prefetch items={media} at={index} />
            </div>
            {count > 1 && (
              <div className="flex justify-center gap-3 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => go(index - 1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
                  Previous
                </button>
                <button type="button" onClick={() => go(index + 1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
