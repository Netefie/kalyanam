import JsonLd from "@/components/common/JsonLd";
import { faqSchema, jsonLdGraph, roomListSchema } from "@/lib/seo";
import { getRooms } from "@/lib/rooms";
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
import ContactFormSection from "@/components/contact/ContactFormSection";


export default async function Home() {
  // Read on the server so the room cards below are in the served HTML. The
  // section used to fetch them in the browser, which left the homepage's
  // room names, descriptions and rates invisible to search.
  const rooms = await getRooms();

  return (
    <main>
      {/* The homepage FAQ, restated for search engines — Google can surface
          these as expandable Q&A directly in the result. Alongside it, the
          room catalogue as an ItemList, so the cards below read as one set of
          alternatives rather than loose links. */}
      <JsonLd data={jsonLdGraph(faqSchema(), roomListSchema(rooms, "/"))} />

      {/* Hero Section */}
      <HeroSection />
      {/* About Section */}
      <About />

      {/* Experience Section */}
      <Experience />
      <RoomsSelection rooms={rooms} />
      {/* Celebration Section */}
      <Celebration />
      

      <TimelessWeddings />
      <KaaraRestaurantSection />
      <MomentsSection />
      <StoriesSection />

      <Faq />

      {/* Closing enquiry form, directly above the footer. */}
      <ContactFormSection subject="Homepage enquiry" />
    </main>
  );
}