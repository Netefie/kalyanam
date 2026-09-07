import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import HeroWedding from "@/components/weddings/HeroWedding";
import WeddingVenueSection from "@/components/weddings/WeddingVenueSection";
import WeddingsEnd from "@/components/weddings/WeddingsEnd";
import CelebrateStyle from "@/components/weddings/CelebrateStyle";

export const metadata = pageMetadata({
  title: "Wedding Venue",
  description:
    "Host your wedding at Kalyanam Hotel & Resort, Sikar. Elegant indoor and outdoor venues for receptions, engagements and sangeet, with catering, décor and on-site guest rooms.",
  path: "/weddings",
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Weddings", path: "/weddings" }]))} />
      <HeroWedding />
      <WeddingVenueSection />
       <CelebrateStyle />
      <WeddingsEnd />
     
    </>
  );
}