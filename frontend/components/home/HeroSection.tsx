import Image from "next/image";
import Link from "next/link";
import HeroBookingBar from "./HeroBookingBar";

export default function HeroSection() {
  return (
    // A flex column rather than a fixed-height box with the booking bar pinned
    // `absolute bottom-8`: zoomed in, the bar collapses to a four-row stack and
    // used to land on top of the headline, and `h-screen` clipped whichever of
    // the two lost. Now the hero grows instead and the page scrolls. `min-h-svh`
    // so mobile browser chrome collapsing doesn't reflow it mid-scroll.
    <section className="relative flex min-h-svh w-full flex-col overflow-x-clip">
      {/* Background (clip the image here, not the whole section, so the
          booking bar's dropdowns can overflow the hero) */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Kalyanam Banquet Hall"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Hero Content — `safe` centring falls back to top-alignment once the
          copy is taller than the space, instead of overflowing off both edges. */}
      <div className="relative z-10 flex flex-1 items-center-safe justify-center px-6 pt-32 pb-10">
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
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-[#e9dccd] transition"
            >
              Book a Visit
            </Link>

            <Link
              href="/banquet"
              className="px-8 py-4 rounded-full border border-white/40 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
            >
              Explore Venue
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Booking Search (functional) — in normal flow, so it can never
          overlap the copy above it however tall either one gets. */}
      <HeroBookingBar />
    </section>
  );
}
