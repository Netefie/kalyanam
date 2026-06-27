import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Celebration from "@/components/home/Celebration";
import TimelessWeddings from "@/components/home/TimelessWeddings";
import Faq from "@/components/home/Faq";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      
      {/* About Section */}
      <About />

      {/* Experience Section */}
      <Experience />

      {/* Celebration Section */}
      <Celebration />
      <TimelessWeddings />
      <Faq />
    </main>
  );
}