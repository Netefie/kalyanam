import Image from "next/image";
import HeroBookingBar from "./HeroBookingBar";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      {/* Background (clip the image here, not the whole section, so the
          booking bar's dropdowns can overflow the hero) */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero.png"
          alt="Kalyanam Banquet Hall"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
  <div className="max-w-4xl text-center text-white">
         

          <h1 className="font-playfair text-4xl md:text-6xl font-light leading-tight">
            Celebrate Your
            <br />
            Perfect Moments
          </h1>

          <p className="mt-4 mx-auto max-w-3xl text-lg md:text-xl text-white/85 leading-relaxed">
  Elegant spaces crafted for weddings, receptions, engagements,
  and unforgettable celebrations with timeless luxury.
</p>

<div className="flex flex-wrap justify-center gap-5 mt-4">
  <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-[#e9dccd] transition">
    Book a Visit
  </button>

  <button className="px-8 py-4 rounded-full border border-white/40 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition">
    Explore Venue
  </button>
          </div>
        </div>
      </div>

      {/* Floating Booking Search (functional) */}
      <HeroBookingBar />
    </section>
  );
}