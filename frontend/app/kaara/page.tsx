import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import HeroKaara from "@/components/kaara/HeroKaara";
import MenuKaara from "@/components/kaara/MenuKaara";
import AmbienceSection from "@/components/kaara/AmbienceSection";
import BannerKaara from "@/components/kaara/BannerKarra";

export const metadata = pageMetadata({
  title: "Kaara Rooftop Restaurant",
  description:
    "Kaara, the rooftop restaurant at Kalyanam Hotel & Resort in Sikar — fine dining with panoramic city views, a curated multi-cuisine menu and a relaxed evening ambience.",
  path: "/kaara",
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Kaara Rooftop Restaurant", path: "/kaara" }]))} />
      <HeroKaara />
      <MenuKaara />
      <AmbienceSection />
      <BannerKaara />
        
    </>
  );
}