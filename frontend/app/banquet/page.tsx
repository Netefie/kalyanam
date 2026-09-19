import type { Metadata } from "next";

import {
  breadcrumbSchema,
  eventVenueSchema,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import HeroBanquet from "@/components/banquet/HeroBanquet";
import FeaturesSection from "@/components/banquet/FeaturesSection";
import ContactBanner from "@/components/banquet/ContactBanner";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Banquet Hall",
    description:
      "A spacious, air-conditioned banquet hall in Sikar with elegant interiors, a professional sound system, catering options and ample parking — for weddings, corporate events and private parties.",
    path: "/banquet",
    settings,
  });
}

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([{ name: "Banquet Hall", path: "/banquet" }]),
          eventVenueSchema(
            {
              name: `${settings.hotelName || "Kalyanam"} Banquet Hall`,
              path: "/banquet",
              description:
                "A spacious, air-conditioned banquet hall with elegant interiors, a professional sound system, catering options and ample parking.",
            },
            settings
          )
        )}
      />
      <HeroBanquet />
      <FeaturesSection />
      <ContactBanner />

    </>
  );
}