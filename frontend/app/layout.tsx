import type { Metadata, Viewport } from "next";

import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import JsonLd from "@/components/common/JsonLd";
import { hotelSchema, jsonLdGraph, websiteSchema } from "@/lib/seo";
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

import {
  Playfair_Display,
  Inter,
  Lato,
  Montserrat,
  Cormorant_Garamond,
  Pinyon_Script,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  // Lets every other metadata field below use relative URLs; without it,
  // relative og:image/canonical values are a build error.
  metadataBase: new URL(SITE_URL),

  title: {
    // `default` is what a route inherits when it sets no title of its own;
    // `template` brands the ones that do, so pages export just "Weddings".
    default: `${SITE_NAME} — Luxury Hotel, Wedding & Banquet Venue in Sikar`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,
  category: "travel",
  alternates: { canonical: "/" },

  // Not a ranking signal any more, but still read by some regional engines and
  // by internal site search. Kept to the terms the pages genuinely serve.
  keywords: [
    "Kalyanam Hotel & Resort",
    "hotel in Sikar",
    "luxury hotel Sikar Rajasthan",
    "wedding venue Sikar",
    "banquet hall Sikar",
    "destination wedding Rajasthan",
    "rooftop restaurant Sikar",
    "Kaara rooftop restaurant",
    "resort near Khatu Shyam",
    "conference and event venue Sikar",
  ],

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Luxury Hotel, Wedding & Banquet Venue in Sikar`,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    // Images come from app/opengraph-image.jpg via the file convention.
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Luxury Hotel, Wedding & Banquet Venue in Sikar`,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without max-image-preview:large, Google shows a thumbnail at best —
      // this is what unlocks the full-width image in mobile results.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Safari turns anything that resembles a phone number into a tel: link and
  // restyles it mid-paragraph; the real numbers are already explicit links.
  formatDetection: { telephone: false, address: false, email: false },

  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

// themeColor lives here, not in `metadata` — it has been deprecated on the
// metadata object since Next 14.
export const viewport: Viewport = {
  themeColor: "#a95038",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`
        ${playfair.variable}
        ${inter.variable}
        ${lato.variable}
        ${montserrat.variable}
        ${cormorant.variable}
        ${pinyon.variable}
      `}
    >
      <body className="bg-[#FCF8F2] text-black">

        {/* Site-wide structured data. Emitted once here so every route carries
            the hotel identity; pages add their own page-level nodes on top. */}
        <JsonLd data={jsonLdGraph(hotelSchema(), websiteSchema())} />

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  );
}