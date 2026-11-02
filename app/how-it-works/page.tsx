import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { whatsappLink } from "@/content/site";
import { Journeys, type Journey } from "@/components/how/Journeys";
import { FlightScene, Skyline } from "@/components/scenes/FlightScene";
import { TeddySvg } from "@/components/teddy/TeddySvg";
import { StampEntry, stampIcons } from "@/components/ui/Stamp";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Meet a local puppy in our Downtown Dubai showroom or reserve a premium teacup breed imported for you — every step, from choosing to coming home.",
  alternates: { canonical: "/how-it-works" },
};

const journeys: Journey[] = [
  {
    key: "local",
    label: "In Dubai",
    hint: "meet in person",
    heading: "Meet your puppy in person",
    body: "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    steps: [
      { title: "Explore our puppies", text: "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information." },
      {
        title: "Choose your puppy",
        text: "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.",
      },
      { title: "Meet before you choose", text: "Spend time bonding before making your decision." },
      {
        title: "Pick-up or delivery",
        text: "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.",
      },
    ],
  },
  {
    key: "imported",
    label: "Imported",
    hint: "order upon request",
    heading: "Order upon request",
    body: "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    note: "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    steps: [
      {
        title: "Reserve your puppy",
        text: "Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.",
      },
      { title: "Personalized consultation", text: "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey." },
      {
        title: "Import and arrival",
        text: "We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.",
      },
      {
        title: "Welcome home",
        text: "Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.",
      },
    ],
  },
];

const delivery = [
  ["Take your puppy home the same day", "Local puppies are available immediately — visit, fall in love, and go home together."],
  ["Delivery within Dubai", "Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably."],
  ["Safe international cargo", "We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free."],
  [
    "Worldwide delivery",
    "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
  ],
];

const reasons = [
  {
    title: "International cargo",
    text: "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
    icon: stampIcons.plane,
  },
  {
    title: "Support 24/7",
    text: "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away.",
    icon: stampIcons.chat,
  },
  {
    title: "Health guarantee",
    text: "All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.",
    icon: stampIcons.heartbeat,
  },
];

const toc = [
  ["two-ways", "Two ways home"],
  ["promise", "Our premium puppy promise"],
  ["delivery", "Delivery & collection"],
  ["why", "Why choose us"],
];

export default function HowItWorksPage() {
  return (
    <div data-page="how" className="tp-page">
      <section data-pup-scene="true" data-tone="light" className="tp-scene" style={{ "--sky-top": "#fffbf3", "--sky-bottom": "#f6cc85" } as CSSProperties} aria-labelledby="how-title">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="grid gap-8 md:grid-cols-12 md:items-end">
            <h1 id="how-title" className="font-plush text-giant md:col-span-7">
              How it works
            </h1>
            <p className="text-lede text-[var(--ink-soft)] md:col-span-5 md:pb-4">
              Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.
            </p>
          </header>

          <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
            {toc.map(([id, label], i) => (
              <a key={id} href={`#${id}`} className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft">
                <span className="font-plush text-toffee">{i + 1}</span> {label}
              </a>
            ))}
          </nav>

          <div id="two-ways">
            <Journeys journeys={journeys} />
          </div>

          <section id="promise" aria-labelledby="promise-title" className="tp-paper mt-24 -rotate-[0.6deg]">
            <p aria-hidden="true" className="font-scrawl text-lg text-toffee-ink">
              puppy passport
            </p>
            <h2 id="promise-title" className="font-plush text-huge mt-1 max-w-[16ch]">
              Our premium puppy promise
            </h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <StampEntry shape="round" ink="#a24a1a" tilt={-8} index={0} icon={stampIcons.heartbeat} title="Hand-selected breeders">
                We work only with breeders who uphold the highest ethical and health standards.
              </StampEntry>
              <StampEntry shape="ticket" ink="#1f6b45" tilt={5} index={1} icon={stampIcons.plane} title="Full transparency">
                Photos, videos, and health certificates are shared before your puppy travels.
              </StampEntry>
              <StampEntry shape="oval" ink="#5a3a28" tilt={-4} index={2} icon={stampIcons.chat} title="Safe, stress-free delivery">
                We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.
              </StampEntry>
            </ul>
          </section>

          <section id="delivery" aria-labelledby="delivery-title" className="mt-24 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 id="delivery-title" className="font-plush text-huge">
                Delivery &amp; collection
              </h2>
              <p className="text-lede mt-5 text-[var(--ink-soft)]">
                From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.
              </p>
              <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {delivery.map(([title, text]) => (
                  <li key={title}>
                    <h3 className="font-plush-text text-[1.3rem] leading-snug font-bold">{title}</h3>
                    <p className="mt-1.5 text-[var(--ink-soft)]">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
              <Skyline className="absolute inset-x-0 bottom-0 w-full text-cocoa/25" />
              <FlightScene />
            </div>
          </section>

          <section id="why" aria-labelledby="why-title" className="mt-24 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="why-title" className="font-plush text-huge">
                Why choose us
              </h2>
              <p className="text-lede mt-6 text-[var(--ink-soft)]">
                We&apos;re here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door,
                we&apos;re with you every step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.
              </p>
            </div>
            <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
              {reasons.map((r) => (
                <li key={r.title} className="flex gap-5">
                  <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden="true">
                    {r.icon}
                  </svg>
                  <div>
                    <h3 className="font-plush text-[1.7rem]">{r.title}</h3>
                    <p className="mt-2 text-[var(--ink-soft)]">{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="care-title" className="tp-board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:!p-12">
            <div>
              <h2 id="care-title" className="font-plush text-big">
                Unique and high quality puppies
              </h2>
              <p className="text-lede measure mt-5 text-cocoa-soft">
                When you choose TeddyPups, you can trust that you&apos;re getting a puppy of the highest quality. We also provide guidance and support to new
                pet owners, offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Ask us on WhatsApp
                </a>
                <Link className="btn btn-ghost" href="/puppies">
                  See available puppies
                </Link>
              </div>
            </div>
            <div className="pup-buddy mx-auto w-48 md:w-56" data-facing="left">
              <TeddySvg pose="bow" facing="left" label="Teddy, ready to play" />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
