import type { Metadata } from "next";

import { breadcrumbSchema, jsonLdGraph, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import HeroContact from "@/components/contact/HeroContact";
import ContactInfo from "@/components/contact/ContactInfo";
import LocationMap from "@/components/contact/LocationMap";
import Faq from "@/components/home/Faq";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Contact Us",
    description:
      "Get in touch with Kalyanam Hotel & Resort, Jaipur Road, Sikar — reservations, event enquiries, directions and answers to the questions guests ask most.",
    path: "/contact",
    settings,
  });
}

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Contact", path: "/contact" }]))} />
      <HeroContact />
      <ContactInfo />
      <LocationMap />
    <Faq />
    </>
  );
}