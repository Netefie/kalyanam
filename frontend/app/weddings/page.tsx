import type { Metadata } from "next";

import {
  breadcrumbSchema,
  eventVenueSchema,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import HeroWedding from "@/components/weddings/HeroWedding";
import WeddingVenueSection from "@/components/weddings/WeddingVenueSection";
import WeddingsEnd from "@/components/weddings/WeddingsEnd";
import CelebrateStyle from "@/components/weddings/CelebrateStyle";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Wedding Venue",
    description:
      "Host your wedding at Kalyanam Hotel & Resort, Sikar. Elegant indoor and outdoor venues for receptions, engagements and sangeet, with catering, décor and on-site guest rooms.",
    path: "/weddings",
    settings,
  });
}

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([{ name: "Weddings", path: "/weddings" }]),
          // "wedding venue Sikar" is a venue query, not a hotel query. Without
          // an EventVenue node this page had nothing but prose to match on.
          eventVenueSchema(
            {
              name: `${settings.hotelName || "Kalyanam"} Wedding Venue`,
              path: "/weddings",
              description:
                "Indoor and outdoor wedding venues for receptions, engagements and sangeet, with catering, décor and on-site guest rooms.",
            },
            settings
          )
        )}
      />
      <HeroWedding />
      <WeddingVenueSection />
       <CelebrateStyle />
      <WeddingsEnd />
     
    </>
  );
}