import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import HeroBanquet from "@/components/banquet/HeroBanquet";
import FeaturesSection from "@/components/banquet/FeaturesSection";
import ContactBanner from "@/components/banquet/ContactBanner";

export const metadata = pageMetadata({
  title: "Banquet Hall",
  description:
    "A spacious, air-conditioned banquet hall in Sikar with elegant interiors, a professional sound system, catering options and ample parking — for weddings, corporate events and private parties.",
  path: "/banquet",
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Banquet Hall", path: "/banquet" }]))} />
      <HeroBanquet />
      <FeaturesSection />
      <ContactBanner />

    </>
  );
}