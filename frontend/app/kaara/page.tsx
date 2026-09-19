import type { Metadata } from "next";

import { breadcrumbSchema, jsonLdGraph, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import HeroKaara from "@/components/kaara/HeroKaara";
import MenuKaara from "@/components/kaara/MenuKaara";
import AmbienceSection from "@/components/kaara/AmbienceSection";
import BannerKaara from "@/components/kaara/BannerKarra";
import ContactFormSection from "@/components/contact/ContactFormSection";

// `generateMetadata` rather than a static object so the hotel name and
// city an admin sets in /admin/settings reach this page's title, share
// card and description too — not just the root layout's.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Kaara Rooftop Restaurant",
    description:
      "Kaara, the rooftop restaurant at Kalyanam Hotel & Resort in Sikar — fine dining with panoramic city views, a curated multi-cuisine menu and a relaxed evening ambience.",
    path: "/kaara",
    settings,
  });
}

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Kaara Rooftop Restaurant", path: "/kaara" }]))} />
      <HeroKaara />
      <MenuKaara />
      <AmbienceSection />
      <BannerKaara />

      {/* Closing enquiry form, directly above the footer. */}
      <ContactFormSection
        eyebrow="RESERVE A TABLE"
        title="Dining With Us at Kaara?"
        description="Table reservations, private dinners and celebration menus — tell us what you have in mind and our team will get back to you."
        subject="Kaara enquiry"
      />
    </>
  );
}