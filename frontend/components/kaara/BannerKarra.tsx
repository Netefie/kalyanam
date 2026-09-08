"use client";

import Image from "next/image";

import { KAARA_MENU_URL } from "@/lib/site";

export default function BannerKaara() {
  return (
    <>
      <a
        href={KAARA_MENU_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="banner-link"
        aria-label="Open the Kaara menu"
      >
        <section className="banner-kaara">
          <Image
            src="/kaara-banner.jpg"
            alt="Kaara Restaurant"
            fill
            sizes="(max-width: 1650px) 80vw, 1320px"
            priority
            className="banner-image"
          />
        </section>
      </a>

      <style>{`
        .banner-link{
          display:block;
          text-decoration:none;
        }

        .banner-kaara{
          position:relative;
          width:80%;
          /* /kaara-banner.jpg is 1536x1024. The old fixed 450px height made
             the box ~2.5:1 on a desktop viewport, so cover cropped roughly
             40% of the image away top and bottom; only mobile (where the box
             happened to land near 3:2) looked right. Matching the asset's own
             ratio means no crop at any width — the same approach
             AmbienceSection uses for the gallery images just above. */
          aspect-ratio:3 / 2;
          max-width:1320px;
          margin:0 auto 50px;
          overflow:hidden;
          cursor:pointer;
        }

        .banner-image{
          object-fit:cover;
          transition:transform .4s ease;
        }

        .banner-kaara:hover .banner-image{
          transform:scale(1.02);
        }

        @media (max-width:768px){
          .banner-kaara{
            width:88%;
            margin-bottom:36px;
          }
        }
      `}</style>
    </>
  );
}