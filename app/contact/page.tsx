import type { Metadata } from "next";
import type { CSSProperties } from "react";
import showroomPhoto from "@/content/data/showroom.json";
import { availablePuppies } from "@/content/puppies";
import { site, whatsappLink } from "@/content/site";
import type { Media } from "@/content/types";
import { LetterForm } from "@/components/forms/LetterForm";
import { MediaImage } from "@/components/media/MediaImage";
import { Skyline } from "@/components/scenes/FlightScene";
import { TeddySvg } from "@/components/teddy/TeddySvg";
import { Paw } from "@/components/ui/Paw";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.",
  alternates: { canonical: "/contact" },
};

/** "Max (Maltipoo, boy)" or "Korean Teacup Poodle (girl)" — same labels as the reference dropdown. */
const puppyOptions = availablePuppies.map((p) => ({
  id: p.id,
  label: p.name ? `${p.displayName} (${p.breed}, ${p.genderLabel.toLowerCase()})` : `${p.displayName} (${p.genderLabel.toLowerCase()})`,
}));

export default function ContactPage() {
  return (
    <div data-page="contact" className="tp-page">
      <section data-pup-scene="true" data-tone="light" className="tp-scene" style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" } as CSSProperties} aria-labelledby="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just
              seeking info, we&apos;d love to hear from you!
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm
                puppies={puppyOptions}
                whatsappHref={whatsappLink()}
                success={{
                  heading: "Message received!",
                  body: "Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.",
                }}
              />
              <div className="pup-buddy -mt-3 mr-6 ml-auto w-36 md:w-40" data-facing="left">
                <TeddySvg pose="sit" facing="left" label="Teddy, waiting for your letter" />
              </div>
            </div>

            <div className="lg:col-span-5 lg:row-start-1">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {site.phone}
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={site.phoneHref}>
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 text-lg font-semibold break-all">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Skyline className="absolute right-0 -bottom-1 w-3/4 text-toffee/30" />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Paw className="size-5 shrink-0 text-toffee-deep" />
                      {site.address.locality}, {site.address.country}
                    </p>
                    <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <MediaImage media={showroomPhoto as Media} sizes="(min-width: 640px) 11rem, 90vw" />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
