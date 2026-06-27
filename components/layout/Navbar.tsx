"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import useScroll from "@/hooks/useScroll";
import ReservationPopup from "@/components/reservation/ReservationPopup";

export default function Navbar() {
  const scrolled = useScroll();

  const [hovered, setHovered] = useState(false);

  const [showReservation, setShowReservation] =
    useState(false);

  const active = hovered || scrolled;

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${
        active
          ? "bg-[#F7F4E5] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1500px] mx-auto h-28 px-10 grid grid-cols-3 items-center">

        {/* LEFT */}

        <div className="flex items-center gap-10">

          <button>

            <Menu
              size={34}
              className={`transition ${
                active
                  ? "text-black"
                  : "text-white"
              }`}
            />

          </button>

          <nav className="hidden lg:flex gap-10">

            <Link
              href="/"
              className={`transition duration-300 ${
                active
                  ? "text-black"
                  : "text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/experiences"
              className={`transition duration-300 ${
                active
                  ? "text-black"
                  : "text-white"
              }`}
            >
              Experiences
            </Link>

            <Link
              href="/accommodations"
              className={`transition duration-300 ${
                active
                  ? "text-black"
                  : "text-white"
              }`}
            >
              Accommodations
            </Link>

          </nav>

        </div>

        {/* CENTER */}

        <div className="flex justify-center">

          <Link href="/">

            <Image
              src={
                active
                  ? "/logo.png"
                  : "/logo1.png"
              }
              width={110}
              height={110}
              alt="Logo"
              priority
              className="transition-all duration-500"
            />

          </Link>

        </div>

        {/* RIGHT */}

        <div className="flex justify-end">

          <div className="relative inline-block">

            <button
              onClick={() =>
                setShowReservation(
                  !showReservation
                )
              }
              className={`px-8 py-4 uppercase tracking-wide font-semibold transition duration-300
              ${
                active
                  ? "bg-[#A66F43] text-white hover:bg-[#8E623D]"
                  : "border border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              Make Reservation
            </button>

            <ReservationPopup
              open={showReservation}
              onClose={() =>
                setShowReservation(false)
              }
            />

          </div>

        </div>

      </div>
    </header>
  );
}