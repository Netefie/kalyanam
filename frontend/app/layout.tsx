import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

import {
  Playfair_Display,
  Inter,
  Lato,
  Montserrat,
  Cormorant_Garamond,
  Pinyon_Script,
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata = {
  title: "Kalyanam Hotel & Resort",
  description: "Luxury stays, weddings & celebrations.",
};

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
        ${cormorant.variable}
        ${pinyon.variable}
      `}
    >
      <body className="overflow-x-hidden bg-[#FCF8F2] text-black">

  <LayoutWrapper>
    {children}
  </LayoutWrapper>

</body>
    </html>
  );
}