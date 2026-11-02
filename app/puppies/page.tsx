import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { availablePuppies, goneHomePuppies } from "@/content/puppies";
import { whatsappLink } from "@/content/site";
import { PuppyBrowser } from "@/components/puppies/PuppyBrowser";
import { SketchCard } from "@/components/puppies/SketchCard";
import { RevealScope } from "@/components/ui/RevealScope";
import { Teddy } from "@/components/teddy/Teddy";

export const metadata: Metadata = {
  title: "Available puppies",
  description: "Teacup and toy puppies available now at TeddyPups U.A.E. Real photos of every puppy, and quick answers on WhatsApp.",
  alternates: { canonical: "/puppies" },
};

/** Server-rendered grid shown until the filterable browser hydrates (and for no-JS visitors). */
function StaticGrid() {
  return (
    <ul className="tp-sketches mt-20">
      {availablePuppies.map((pup, i) => (
        <li key={pup.id}>
          <SketchCard pup={pup} index={i} preload={i < 3} />
        </li>
      ))}
    </ul>
  );
}

export default function PuppiesPage() {
  return (
    <RevealScope data-page="pups" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                from Teddy&apos;s sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength={1} />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="true">
              <Teddy pose="sit" facing="left" stop={false} label="Teddy, the TeddyPups puppy" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>

          <div className="mt-12">
            <Suspense fallback={<StaticGrid />}>
              <PuppyBrowser puppies={availablePuppies} whatsappHref={whatsappLink()} />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="true">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who&apos;ve gone home
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {goneHomePuppies.slice(0, 5).map((pup, i) => (
              <li key={pup.id}>
                <SketchCard pup={pup} index={i} sizes="9rem" small />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </RevealScope>
  );
}
