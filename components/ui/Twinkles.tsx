const STAR = "M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z";

export type Star = { left: string; top: string; size: number };

/** Default star field, same positions as the reference footer. */
export const footerStars: Star[] = [
  { left: "6%", top: "18%", size: 12.6 },
  { left: "14%", top: "42%", size: 8.4 },
  { left: "23%", top: "12%", size: 9.8 },
  { left: "31%", top: "30%", size: 7 },
  { left: "44%", top: "9%", size: 11.2 },
  { left: "52%", top: "36%", size: 7.7 },
  { left: "63%", top: "15%", size: 10.5 },
  { left: "71%", top: "40%", size: 7 },
  { left: "92%", top: "33%", size: 8.4 },
];

/** Four-pointed stars that gently twinkle (staggered by 0.4s each). */
export function Twinkles({ stars = footerStars, className = "text-honey" }: { stars?: Star[]; className?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className={`tp-twinkle absolute ${className}`}
          style={{ left: s.left, top: s.top, width: `${s.size}px`, animationDelay: `${(i * 0.4).toFixed(2)}s` }}
        >
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
