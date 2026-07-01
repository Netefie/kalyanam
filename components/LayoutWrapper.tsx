"use client";

import { usePathname } from "next/navigation";

import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import OfferPopup from "@/components/popup/OfferPopup";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />

      <OfferPopup />

      <main>{children}</main>

      <Footer />
    </>
  );
}