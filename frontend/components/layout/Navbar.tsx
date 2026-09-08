"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { useSettings } from "@/components/SettingsProvider";
import useScroll from "@/hooks/useScroll";
import ReservationPopup from "@/components/reservation/ReservationPopup";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const settings = useSettings();
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
        {/* The 92px height is load-bearing — Sidebar positions itself with
            top-[92px] / h-[calc(100dvh-92px)]. So rather than let the bar grow,
            the contents shrink to stay inside it when the viewport narrows
            (which is what zooming in does). */}
        <div className="max-w-[1500px] mx-auto h-[92px] px-4 sm:px-6 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-4 lg:gap-12">

            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <Menu
                size={34}
                strokeWidth={1.7}
                className={`h-6 w-6 shrink-0 transition-colors duration-300 sm:h-[34px] sm:w-[34px] ${
                  active ? "text-black" : "text-white"
                }`}
              />
            </button>

            <nav className="hidden xl:flex items-center gap-10 uppercase tracking-wide text-[15px]">

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
                alt={settings.hotelName}
                priority
                className="h-auto w-[62px] transition-all duration-500 sm:w-[90px] lg:w-[115px]"
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
                className={`whitespace-nowrap px-3 py-2.5 text-[10px] uppercase tracking-[1px] font-semibold transition-all duration-300 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[2px] lg:px-8 lg:py-4 lg:text-sm ${
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