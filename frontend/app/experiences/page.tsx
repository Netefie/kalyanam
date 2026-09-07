import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import ExpHero from "@/components/experiences/ExpHero";
import NearbyPlaces from "@/components/experiences/NearbyPlaces";

export const metadata = pageMetadata({
  title: "Experiences & Places to Visit",
  description:
    "Stay at Kalyanam and explore Sikar — Khatu Shyam Ji, Salasar Balaji, Jeen Mata and Harshnath temples, Laxmangarh Fort and the Nadine Le Prince Haveli, all within easy reach.",
  path: "/experiences",
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Experiences", path: "/experiences" }]))} />
      <ExpHero />
      <NearbyPlaces />
    </>
  );
}