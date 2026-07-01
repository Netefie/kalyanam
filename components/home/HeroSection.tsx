import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarDays, Users, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
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

      {/* Floating Booking Search */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-7xl">
        <div className="backdrop-blur-xl bg-[#5d5048]/75 border border-white/20 rounded-2xl shadow-2xl p-3">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

            {/* Hotel */}
            <button className="flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition">
  <div className="flex items-center gap-4">
    <Building2 size={28} />
    <div className="text-left">
      <p className="text-xs uppercase tracking-widest text-white/60">
        Room
      </p>
      <p className="text-lg">Select Room</p>
    </div>
  </div>

  <ChevronDown />
</button>

            {/* Date */}
            <button className="flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <CalendarDays size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Date
                  </p>
                  <p className="text-lg">Check-in • Check-out</p>
                </div>
              </div>
              <ChevronDown />
            </button>

            {/* Guests */}
            <button className="flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <Users size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Guests
                  </p>
                  <p className="text-lg truncate">
                    1 Room, 2 Adults
                  </p>
                </div>
              </div>
              <ChevronDown />
            </button>

           

            {/* Book */}
            <Link
  href="/accommodations"
  className="h-20 rounded-xl bg-[#d8b46b] text-black font-semibold text-lg hover:bg-[#e5c47c] transition flex items-center justify-center tracking-wide"
>
  BOOK NOW
</Link>

          </div>
        </div>
      </div>
    </section>
  );
}