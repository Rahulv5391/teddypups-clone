"use client";

import type { CSSProperties } from "react";
import type { Media } from "@/content/types";
import { Polaroid } from "@/components/media/Polaroid";
import { usePhotoViewer } from "@/components/media/PhotoViewer";
import { Paw } from "@/components/ui/Paw";
import { RevealScope } from "@/components/ui/RevealScope";

const SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw";

/** Masonry wall of polaroids; each bounces in with a paw "pat" and opens the full-screen viewer. */
export function MemoryWall({ photos }: { photos: Media[] }) {
  const { open, viewer } = usePhotoViewer(photos, SIZES);
  return (
    <>
      <RevealScope>
        <ul className="tp-wall" aria-label="Photos from TeddyPups families">
          {photos.map((photo, i) => (
            <li key={photo.id} className="tp-wall__item" data-reveal="true" style={{ "--d": `${(i % 4) * 60}ms` } as CSSProperties}>
              <button
                type="button"
                className="tp-wall__print"
                onClick={() => open(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
              >
                <Polaroid media={photo} order={i} sizes={SIZES} preload={i < 2} />
                <Paw className="tp-wall__paw" />
              </button>
            </li>
          ))}
        </ul>
      </RevealScope>
      {viewer}
    </>
  );
}
