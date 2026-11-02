import Link from "next/link";
import { site, whatsappLink } from "@/content/site";

// Temporary home page for block 0 (foundation check). Replaced by the scene sections in block 5.
export default function Home() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-[var(--gutter)] text-center">
      <p className="font-scrawl text-xl text-toffee-deep">{site.tagline}</p>
      <h1 className="font-plush mt-3 text-5xl sm:text-7xl">Premium teacup puppies in Dubai</h1>
      <p className="mt-5 max-w-xl text-cocoa-soft">
        Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted
        breeders worldwide.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/puppies" className="btn btn-primary">
          View available puppies
        </Link>
        <a href={whatsappLink()} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
