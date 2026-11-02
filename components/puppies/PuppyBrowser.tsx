"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import type { Puppy } from "@/content/types";
import { filterOptions, filterPuppies, hasActiveFilters, readFilters, type FilterKey } from "@/content/puppies";
import { RevealScope } from "@/components/ui/RevealScope";
import { Teddy } from "@/components/teddy/Teddy";
import { SketchCard } from "./SketchCard";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="tp-sticker-chip">
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

/**
 * Filter chips + animated grid. Filters live in the URL (?origin=&breed=&gender=&collection=)
 * so a filtered list can be shared; updates use history.replaceState, which Next.js
 * syncs into useSearchParams without a server round trip.
 */
export function PuppyBrowser({ puppies, whatsappHref }: { puppies: Puppy[]; whatsappHref: string }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const f = readFilters(params);

  const toggle = (key: FilterKey, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && f[key] !== value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };
  const clear = () => window.history.replaceState(null, "", pathname);

  const shown = useMemo(() => filterPuppies(puppies, f), [puppies, f.origin, f.breed, f.gender, f.collection]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = hasActiveFilters(f);
  const opts = filterOptions(puppies);

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <Row label="where">
          <Chip active={!f.origin && !f.collection} onClick={clear}>
            Everywhere
          </Chip>
          {opts.hasLocal && (
            <Chip active={f.origin === "local"} onClick={() => toggle("origin", "local")}>
              In Dubai
            </Chip>
          )}
          <Chip active={f.origin === "imported"} onClick={() => toggle("origin", "imported")}>
            Imported
          </Chip>
          {opts.hasKoreanTeacup && (
            <Chip active={f.collection === "korean-teacup"} onClick={() => toggle("collection", "korean-teacup")}>
              Korean Teacup
            </Chip>
          )}
        </Row>
        <Row label="breed">
          {opts.breeds.map((b) => (
            <Chip key={b.slug} active={f.breed === b.slug} onClick={() => toggle("breed", b.slug)}>
              {b.name}
            </Chip>
          ))}
        </Row>
        <Row label="boy or girl">
          <Chip active={f.gender === "male"} onClick={() => toggle("gender", "male")}>
            Boys
          </Chip>
          <Chip active={f.gender === "female"} onClick={() => toggle("gender", "female")}>
            Girls
          </Chip>
          {active && (
            <button type="button" onClick={clear} className="link-ink ml-auto text-[0.95rem] font-semibold">
              Clear filters
            </button>
          )}
        </Row>
      </div>

      <p className="font-scrawl mt-10 text-lg text-cocoa-soft" aria-live="polite">
        {shown.length === 1 ? "1 puppy" : `${shown.length} puppies`} {active ? "match" : "looking for a home"}
      </p>

      {shown.length ? (
        <RevealScope>
          <motion.ul layout className="tp-sketches mt-8">
            <AnimatePresence mode="popLayout">
              {shown.map((pup, i) => (
                <motion.li
                  key={pup.id}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                >
                  <SketchCard pup={pup} index={i} preload={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </RevealScope>
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <Teddy pose="sit" act="tilt" className="mx-auto w-44 md:w-52" label="Teddy, tilting his head" />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                Ask on WhatsApp
              </a>
              <button type="button" onClick={clear} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
