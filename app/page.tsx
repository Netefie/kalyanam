import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Celebration from "@/components/home/Celebration";
import RoomsSelection from "@/components/home/RoomsSection";
import TimelessWeddings from "@/components/home/TimelessWeddings";
import Faq from "@/components/home/Faq";
import StoriesSection from "@/components/home/StoriesSection";
import MomentsSection from "@/components/home/MomentsSection";
import KaaraRestaurantSection from "@/components/home/KaaraRestaurantSection";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      
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
    </main>
  );
}