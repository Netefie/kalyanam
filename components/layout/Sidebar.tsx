"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
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

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
        h-[calc(100vh-92px)]
        w-[330px]
        bg-[#F5E9DD]
        shadow-xl
        transition-all
        duration-500
        ease-in-out
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Top */}

        <div className="flex justify-end p-5">

          <button
            onClick={onClose}
            className="text-[#9D6B42] hover:rotate-90 transition-all duration-300"
          >
            <X size={28} strokeWidth={1.8} />
          </button>

        </div>
                {/* Book Button */}

        <div className="px-6 pb-6">

          <button
            className="w-full h-14 bg-[#A46F44] text-white uppercase tracking-[2px]
            text-sm font-medium transition-all duration-300
            hover:bg-[#8F5E39]"
          >
            Book a Stay
          </button>

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

      </aside>
    </>
  );
}