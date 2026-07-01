import HeroContact from "@/components/contact/HeroContact";
import ContactInfo from "@/components/contact/ContactInfo";
import LocationMap from "@/components/contact/LocationMap";
import Faq from "@/components/home/Faq";

export default function Home() {
  return (
    <>
      <HeroContact />
      <ContactInfo />
      <LocationMap />
    <Faq />
    </>
  );
}