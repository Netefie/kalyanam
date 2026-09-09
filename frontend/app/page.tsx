import JsonLd from "@/components/common/JsonLd";
import { faqSchema, jsonLdGraph } from "@/lib/seo";
import HeroSection from "@/components/home/HeroSection";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Celebration from "@/components/home/Celebration";
import RoomsSelection from "@/components/home/RoomsSection";
import TimelessWeddings from "@/components/home/TimelessWeddings";
import Faq from "@/components/home/Faq";
import StoriesSection from "@/components/home/StoriesSection";
import MomentsSection from "@/components/home/MomentsSection";
import KaaraRestaurantSection from "@/components/home/KaaraRestaurantSection";
import ContactCta from "@/components/home/ContactCta";


export default function Home() {
  return (
    <main>
      {/* The homepage FAQ, restated for search engines — Google can surface
          these as expandable Q&A directly in the result. */}
      <JsonLd data={jsonLdGraph(faqSchema())} />

      {/* Hero Section */}
      <HeroSection />
      {/* About Section */}
      <About />

      {/* Experience Section */}
      <Experience />
      <RoomsSelection />
      {/* Celebration Section */}
      <Celebration />
      

      <TimelessWeddings />
      <KaaraRestaurantSection />
      <MomentsSection />
      <StoriesSection />

      <Faq />

      {/* Closing call to action — hands the reader off to the enquiry form. */}
      <ContactCta />
    </main>
  );
}