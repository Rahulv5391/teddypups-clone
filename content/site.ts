export const site = {
  name: "TeddyPups U.A.E.",
  shortName: "TeddyPups",
  tagline: "every puppy is family",
  title: "TeddyPups U.A.E. — Premium teacup puppies in Dubai",
  description:
    "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  blurb:
    "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  // Contact details as currently shown on the reference demo (updated by Insta Biz Web on 2026-11-02;
  // previously the TeddyPups number +971 54 167 6733 and teddypupsadmin@gmail.com).
  phone: "+971 50 000 0000",
  phoneHref: "tel:+971500000000",
  whatsappNumber: "919898124987",
  email: "info@instabizweb.com",
  address: {
    locality: "Downtown Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    mapsUrl: "https://www.instabizweb.com/",
  },
  socials: [
    { label: "Instagram", href: "https://www.instabizweb.com/" },
    { label: "TikTok", href: "https://www.instabizweb.com/" },
    { label: "Facebook", href: "https://www.instabizweb.com/" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Puppies", href: "/puppies" },
    { label: "Happy families", href: "/happy-families" },
    { label: "How it works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
    { label: "Visit & contact", href: "/contact" },
  ],
} as const;

export function whatsappLink(text = "Hi TeddyPups! I'd love to know more about your puppies.") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
