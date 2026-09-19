import type { Metadata } from "next";

import { breadcrumbSchema, jsonLdGraph, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import ExpHero from "@/components/experiences/ExpHero";
import NearbyPlaces from "@/components/experiences/NearbyPlaces";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Experiences & Places to Visit",
    description:
      "Stay at Kalyanam and explore Sikar — Khatu Shyam Ji, Salasar Balaji, Jeen Mata and Harshnath temples, Laxmangarh Fort and the Nadine Le Prince Haveli, all within easy reach.",
    path: "/experiences",
    settings,
  });
}

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Experiences", path: "/experiences" }]))} />
      <ExpHero />
      <NearbyPlaces />
    </>
  );
}