import Image from "next/image";
import type { CSSProperties } from "react";
import type { Media } from "@/content/types";

type Props = {
  media: Media;
  sizes?: string;
  alt?: string;
  className?: string;
  /** Above the fold: load eagerly with high priority. */
  preload?: boolean;
  eager?: boolean;
  quality?: number;
  /** "fill" crops to the parent using the focal point; "natural" keeps the aspect ratio. */
  layout?: "fill" | "natural";
  style?: CSSProperties;
};

/** next/image with the CMS extras: focal-point cropping, dominant-colour background, blur placeholder. */
export function MediaImage({ media, sizes, alt, className, preload, eager, quality = 75, layout = "fill", style }: Props) {
  const common = {
    src: media.url,
    sizes,
    quality,
    preload,
    loading: preload || eager ? ("eager" as const) : ("lazy" as const),
    fetchPriority: preload ? ("high" as const) : undefined,
    placeholder: (media.blurDataUrl ?? "empty") as `data:image/${string}` | "empty",
    className,
  };
  if (layout === "natural") {
    return (
      <Image
        {...common}
        alt={alt ?? media.alt}
        width={media.width}
        height={media.height}
        style={{ width: "100%", height: "auto", backgroundColor: media.color, ...style }}
      />
    );
  }
  return (
    <Image
      {...common}
      alt={alt ?? media.alt}
      fill
      style={{
        objectFit: "cover",
        objectPosition: `${(media.focalX * 100).toFixed(1)}% ${(media.focalY * 100).toFixed(1)}%`,
        backgroundColor: media.color,
        ...style,
      }}
    />
  );
}
