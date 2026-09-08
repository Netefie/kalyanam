import type { Metadata, Viewport } from "next";

import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import JsonLd from "@/components/common/JsonLd";
import { hotelSchema, jsonLdGraph, websiteSchema } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
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

// A function rather than a static object so the hotel name and tagline an
// admin edits in /admin/settings reach the <title>, the meta description and
// the share cards. Falls back to the lib/site.ts constants when a field is
// unset or the API is unreachable.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const name = settings.hotelName || SITE_NAME;
  const description = settings.tagline || SITE_DESCRIPTION;
  const headline = `${name} — Luxury Hotel, Wedding & Banquet Venue in Sikar`;

  return {
  // Lets every other metadata field below use relative URLs; without it,
  // relative og:image/canonical values are a build error.
  metadataBase: new URL(SITE_URL),

  title: {
    // `default` is what a route inherits when it sets no title of its own;
    // `template` brands the ones that do, so pages export just "Weddings".
    default: headline,
    template: `%s | ${name}`,
  },
  description,

  applicationName: name,
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
    siteName: name,
    title: headline,
    description,
    locale: "en_IN",
    // Images come from app/opengraph-image.jpg via the file convention.
  },

  twitter: {
    card: "summary_large_image",
    title: headline,
    description,
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
}

// themeColor lives here, not in `metadata` — it has been deprecated on the
// metadata object since Next 14.
export const viewport: Viewport = {
  themeColor: "#a95038",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetched once here and handed down, so no client component has to fetch it
  // and the values are already in the server-rendered HTML (which is what the
  // JSON-LD below and the crawlers reading it need).
  const settings = await getSiteSettings();

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
        <JsonLd
          data={jsonLdGraph(hotelSchema(settings), websiteSchema(settings))}
        />

        <LayoutWrapper settings={settings}>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  );
}