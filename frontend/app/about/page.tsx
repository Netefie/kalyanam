import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import HeroAb from "@/components/about/HeroAb";
import AboutStory from "@/components/about/AboutStory";
import OurPhilosophy from "@/components/about/OurPhilosophy";
import OurJourney from "@/components/about/OurJourney";
import WhyChooseKalyanam from "@/components/about/WhyChooseUs";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "The story behind Kalyanam Hotel & Resort in Sikar — our philosophy, our journey and why guests choose us for stays, weddings and celebrations in Rajasthan.",
  path: "/about",
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "About Us", path: "/about" }]))} />
      <HeroAb />
      <AboutStory />
      <OurPhilosophy />
      <OurJourney />
      <WhyChooseKalyanam />
    </>
  );
}