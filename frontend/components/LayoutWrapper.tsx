"use client";

import { usePathname } from "next/navigation";

import type { SiteSettings } from "@/lib/api";
import SettingsProvider from "./SettingsProvider";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import OfferPopup from "@/components/popup/OfferPopup";

export default function LayoutWrapper({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  // The provider wraps the admin branch too — the admin shell doesn't read it,
  // but keeping one tree means a client component moved between the two
  // doesn't suddenly throw for want of a provider.
  return (
    <SettingsProvider settings={settings}>
      {isAdmin ? (
        <main>{children}</main>
      ) : (
        <>
          <Navbar />

          <OfferPopup />

          <main>{children}</main>

          <Footer />
        </>
      )}
    </SettingsProvider>
  );
}
