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
  phone: "+971 54 167 6733",
  phoneHref: "tel:+971541676733",
  whatsappNumber: "971541676733",
  email: "teddypupsadmin@gmail.com",
  address: {
    locality: "Downtown Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    mapsUrl: "https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/teddypups.worldwide/" },
    { label: "TikTok", href: "https://www.tiktok.com/@teddypupsuae" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61567496944539" },
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
