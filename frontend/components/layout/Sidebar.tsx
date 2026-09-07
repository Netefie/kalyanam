"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import useScrollLock from "@/hooks/useScrollLock";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  useScrollLock(open);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-300
        ${
          open
            ? "opacity-100 visible bg-black/20"
            : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}

      <aside
        className={`fixed left-0 top-[92px] z-50
        flex flex-col
        h-[calc(100dvh-92px)]
        max-w-full
        w-[330px]
        bg-[#F5E9DD]
        shadow-xl
        transition-transform
        duration-500
        ease-in-out
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Top — pinned, so the close control stays reachable while the
            panel below scrolls. */}

        <div className="flex shrink-0 justify-end p-5">

          <button
            onClick={onClose}
            className="text-[#9D6B42] hover:rotate-90 transition-all duration-300"
          >
            <X size={28} strokeWidth={1.8} />
          </button>

        </div>

        {/* Scrollable body — on a zoomed or short viewport the nav is taller
            than the sidebar, so it has to scroll rather than overflow off
            the bottom of the screen. */}

        <div className="flex-1 overflow-y-auto overscroll-contain">

                {/* Book Button */}

        <div className="px-6 pb-6">

          <Link
            href="/accommodations"
            onClick={onClose}
            className="flex w-full h-14 items-center justify-center
            bg-[#A46F44] text-white uppercase tracking-[2px]
            text-sm font-medium transition-all duration-300
            hover:bg-[#8F5E39]"
          >
            Book a Stay
          </Link>

        </div>

        {/* Navigation */}

        <nav className="flex flex-col">

          <Link
            href="/kaara"
            onClick={onClose}
            className="border-b border-[#DCCFC4] px-6 py-5
            text-[17px] text-[#2B2B2B]
            hover:text-[#A46F44]
            hover:pl-8
            transition-all duration-300"
          >
            Kaara – Dining Experience
          </Link>

          <Link
            href="/weddings"
            onClick={onClose}
            className="border-b border-[#DCCFC4] px-6 py-5
            text-[17px] text-[#2B2B2B]
            hover:text-[#A46F44]
            hover:pl-8
            transition-all duration-300"
          >
            Marriage Lawn by Kalyanam
          </Link>

          <Link
            href="/banquet"
            onClick={onClose}
            className="border-b border-[#DCCFC4] px-6 py-5
            text-[17px] text-[#2B2B2B]
            hover:text-[#A46F44]
            hover:pl-8
            transition-all duration-300"
          >
            Banquet Hall
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="border-b border-[#DCCFC4] px-6 py-5
            text-[17px] text-[#2B2B2B]
            hover:text-[#A46F44]
            hover:pl-8
            transition-all duration-300"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={onClose}
            className="border-b border-[#DCCFC4] px-6 py-5
            text-[17px] text-[#2B2B2B]
            hover:text-[#A46F44]
            hover:pl-8
            transition-all duration-300"
          >
            Contact Us
          </Link>

        </nav>

        </div>

      </aside>
    </>
  );
}