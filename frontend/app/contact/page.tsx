import { pageMetadata, breadcrumbSchema, jsonLdGraph } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import HeroContact from "@/components/contact/HeroContact";
import ContactInfo from "@/components/contact/ContactInfo";
import LocationMap from "@/components/contact/LocationMap";
import Faq from "@/components/home/Faq";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Kalyanam Hotel & Resort, Jaipur Road, Sikar — reservations, event enquiries, directions and answers to the questions guests ask most.",
  path: "/contact",
});

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