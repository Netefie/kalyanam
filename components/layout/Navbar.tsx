"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import useScroll from "@/hooks/useScroll";
import ReservationPopup from "@/components/reservation/ReservationPopup";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const scrolled = useScroll();

  const [hovered, setHovered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  const active = hovered || scrolled;

  return (
    <>
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          active
            ? "bg-[#F7F4E5] shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1500px] mx-auto h-[92px] px-10 grid grid-cols-3 items-center">

          {/* LEFT */}

          <div className="flex items-center gap-12">

            <button
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <Menu
                size={34}
                strokeWidth={1.7}
                className={`transition-colors duration-300 ${
                  active ? "text-black" : "text-white"
                }`}
              />
            </button>

            <nav className="hidden lg:flex items-center gap-10 uppercase tracking-wide text-[15px]">

              <Link
                href="/"
                className={`transition-colors duration-300 ${
                  active
                    ? "text-black hover:text-[#A66F43]"
                    : "text-white hover:text-[#F7F4E5]"
                }`}
              >
                Home
              </Link>

              <Link
                href="/experiences"
                className={`transition-colors duration-300 ${
                  active
                    ? "text-black hover:text-[#A66F43]"
                    : "text-white hover:text-[#F7F4E5]"
                }`}
              >
                Experiences
              </Link>

              <Link
                href="/accommodations"
                className={`transition-colors duration-300 ${
                  active
                    ? "text-black hover:text-[#A66F43]"
                    : "text-white hover:text-[#F7F4E5]"
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
                src={active ? "/logo.png" : "/logo1.png"}
                width={115}
                height={115}
                alt="Kalyanam"
                priority
                className="transition-all duration-500"
              />
            </Link>

          </div>
                    {/* RIGHT */}

          <div className="flex justify-end">

            <div className="relative">

              <button
                onClick={() =>
                  setShowReservation(!showReservation)
                }
                className={`px-8 py-4 uppercase tracking-[2px] text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#A66F43] text-white hover:bg-[#8E623D]"
                    : "border border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                Make Reservation
              </button>

              <ReservationPopup
                open={showReservation}
                onClose={() => setShowReservation(false)}
              />

            </div>

          </div>

        </div>
      </header>

      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

    </>
  );
}