import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { allPuppySlugs, getPuppy, hasVideo, neighbours } from "@/content/puppies";
import { site, whatsappLink } from "@/content/site";
import type { Puppy } from "@/content/types";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { MediaImage } from "@/components/media/MediaImage";
import { PuppyGallery } from "@/components/puppies/PuppyGallery";
import { StoryRibbon } from "@/components/puppies/StoryRibbon";
import { TeddySvg } from "@/components/teddy/TeddySvg";
import { Paw } from "@/components/ui/Paw";
import { RevealScope } from "@/components/ui/RevealScope";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPuppySlugs().map((slug) => ({ slug }));
}

const originWord = (p: Puppy) => (p.origin?.slug === "local" ? "in Dubai" : "imported");
const whereLabel = (p: Puppy) => (p.origin?.slug === "local" ? "In Dubai" : "Imported for you");
const formLabel = (p: Puppy) => (p.name ? `${p.displayName} (${p.breed})` : p.displayName);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pup = getPuppy((await params).slug);
  if (!pup) return {};
  const title = pup.name ? `${pup.displayName}, ${pup.breed} puppy` : `${pup.displayName} puppy (${pup.genderLabel.toLowerCase()})`;
  const who = pup.name ? pup.displayName : `this ${pup.displayName}`;
  const description = `Meet ${who}: ${pup.breed}, ${pup.genderLabel.toLowerCase()}, ${pup.age} old, ${originWord(pup)}. Real photos${hasVideo(pup) ? " and video" : ""} from ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: `/puppies/${pup.slug}` },
    openGraph: { title, description, images: pup.cover ? [pup.cover.url] : undefined },
  };
}

function Chapter({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden="true" className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  );
}

const Check = () => (
  <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
    <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const importSteps = [
  ["Reserve your puppy", "Tell us which puppy has captured your heart."],
  ["Personalized consultation", "We finalize details with you and share updates on your puppy's journey."],
  ["Import and arrival", "We manage health checks, travel arrangements, and documentation."],
  ["Welcome home", "We help your new puppy settle in and ensure a smooth transition into your home."],
];

export default async function PuppyPage({ params }: Params) {
  const { slug } = await params;
  const pup = getPuppy(slug);
  if (!pup) notFound();

  const gone = pup.status === "rehomed";
  const near = neighbours(slug);
  const showTrail = !gone && pup.origin?.slug === "imported";
  let n = 1;
  const tint = pup.cover?.color ?? "#f2be6b";
  const facts: [string, string][] = [
    ["Breed", pup.breed],
    ["Boy or girl", pup.genderLabel],
    ["Age", pup.age],
    ...(pup.colour ? ([["Colour", pup.colour]] as [string, string][]) : []),
    ["Where", whereLabel(pup)],
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Puppies", item: `${site.url}/puppies` },
      { "@type": "ListItem", position: 2, name: pup.displayName, item: `${site.url}/puppies/${pup.slug}` },
    ],
  };

  return (
    <RevealScope data-page="pup" className="tp-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article
        className="tp-storybook"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${tint} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` } as CSSProperties}
      >
        <StoryRibbon />
        <div className="gutter mx-auto max-w-[110rem] pt-8 pb-20 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={gone ? "/gone-home" : "/puppies"}>
              {gone ? "Gone home" : "Available puppies"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{pup.displayName}</span>
          </nav>
          <Chapter n={n++}>{gone ? "the day they went home" : "hello, it's me"}</Chapter>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <PuppyGallery name={pup.displayName} media={pup.media} />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="true">
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <div className="pup-buddy absolute -top-[4.8rem] right-6 w-[9.5rem]" data-facing="right">
                    <TeddySvg pose="peek" label={`Teddy, peeking over ${pup.displayName}'s tag`} />
                  </div>
                  {gone ? (
                    <span className="font-scrawl inline-grid -rotate-6 place-items-center rounded-full border-[3px] border-current px-3 py-1 text-sm tracking-wide text-toffee-deep uppercase">
                      Gone home ♥
                    </span>
                  ) : (
                    <span className="chip">
                      <Paw className="size-4 text-toffee" />
                      Available
                    </span>
                  )}
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.displayName}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                  {pup.description && <p className="mt-4 text-cocoa-soft">{pup.description}</p>}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {facts.map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      {gone ? "Ask about a puppy like this" : `Ask about ${pup.displayName} on WhatsApp`}
                    </a>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>

                <div className="tp-paper mt-8 -rotate-1">
                  <Chapter n={n++}>what comes with {pup.displayName}</Chapter>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"].map((t) => (
                      <li key={t} className="flex items-start gap-3 font-semibold">
                        <Check />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {showTrail && (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
              <Chapter n={n++}>the way home</Chapter>
              <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
                Coming home from abroad
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {importSteps.map(([title, body], i) => (
                  <li key={title}>
                    <span aria-hidden="true" className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl leading-tight font-bold">{title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{body}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id={`enquire-${pup.slug}`} aria-labelledby={`enquire-title-${pup.slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
            <span aria-hidden="true" className="tp-letter__stamp">
              <Paw className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <Chapter n={n++}>dear TeddyPups…</Chapter>
              <h2 id={`enquire-title-${pup.slug}`} className="font-plush text-big mt-2">
                {gone ? "Looking for a puppy like this?" : `Ask about ${pup.displayName}`}
              </h2>
              <p className="mt-4 text-cocoa-soft">Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm
                puppy={{ id: pup.id, label: formLabel(pup) }}
                whatsappHref={whatsappLink()}
                success={{
                  heading: "Message received!",
                  body: "Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.",
                }}
              />
            </div>
          </section>

          {near && (
            <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["Previous pup", near.prev],
                  ["Next pup", near.next],
                ] as const
              ).map(([label, p]) => (
                <Link
                  key={label}
                  href={`/puppies/${p.slug}`}
                  className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
                >
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
                    {p.cover && <MediaImage media={p.cover} sizes="80px" />}
                  </span>
                  <span>
                    <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
                    <span className="font-plush text-[1.6rem]">{p.displayName}</span>
                  </span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </article>
    </RevealScope>
  );
}
