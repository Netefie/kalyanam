import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import OfferPopup from "@/components/popup/OfferPopup";

import {
  Playfair_Display,
  Inter,
  Lato,
  Montserrat,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${playfair.variable}
        ${inter.variable}
        ${lato.variable}
        ${montserrat.variable}
      `}
    >
      <body>
        <Navbar />

        {/* Newsletter Popup */}
        <OfferPopup />

        {children}
      </body>
    </html>
  );
}