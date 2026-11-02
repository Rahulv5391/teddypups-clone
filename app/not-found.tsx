import type { Metadata } from "next";
import Link from "next/link";
import { TeddySvg } from "@/components/teddy/TeddySvg";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const tabs = [
  ["/", "Home"],
  ["/puppies", "Puppies"],
  ["/how-it-works", "How it works"],
  ["/faq", "Questions"],
  ["/contact", "Contact"],
];

/** A "lost" poster for the missing page, with tear-off tabs to pages that do exist. */
export default function NotFound() {
  return (
    <div className="gutter mx-auto grid min-h-[78vh] max-w-[110rem] place-items-center py-14">
      <div className="tp-poster">
        <span aria-hidden="true" className="tp-tape tp-tape--left" />
        <span aria-hidden="true" className="tp-tape tp-tape--right" />
        <p className="font-scrawl tp-poster__kicker">have you seen this page?</p>
        <h1 className="font-plush tp-poster__title">
          Lost<span className="sr-only">: this page has wandered off</span>
        </h1>
        <div className="tp-poster__photo">
          <div className="pup-buddy" data-facing="right">
            <TeddySvg pose="sniff" label="Teddy, sniffing out the missing page" />
          </div>
        </div>
        <p className="tp-poster__desc">
          One page, last seen wandering off. It answers to the address you typed, but it isn&apos;t here any more. Teddy is on the case.
        </p>
        <p className="font-scrawl tp-poster__reward">if found, take a tab:</p>
        <ul className="tp-poster__tabs" aria-label="Pages that are here">
          {tabs.map(([href, label]) => (
            <li key={href}>
              <Link className="tp-poster__tab" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
