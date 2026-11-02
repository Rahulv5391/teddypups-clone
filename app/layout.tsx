import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell",
  axes: ["INFM", "BNCE"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: ["/brand/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable} ${shantell.variable}`}>
      <body>{children}</body>
    </html>
  );
}
