import type { Metadata } from "next";

import { breadcrumbSchema, jsonLdGraph, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import HeroAb from "@/components/about/HeroAb";
import AboutStory from "@/components/about/AboutStory";
import OurPhilosophy from "@/components/about/OurPhilosophy";
import OurJourney from "@/components/about/OurJourney";
import WhyChooseKalyanam from "@/components/about/WhyChooseUs";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "About Us",
    description:
      "The story behind Kalyanam Hotel & Resort in Sikar — our philosophy, our journey and why guests choose us for stays, weddings and celebrations in Rajasthan.",
    path: "/about",
    settings,
  });
}

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