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
            sizes="100vw"
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
          height:450px;
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

        @media (max-width:1200px){
          .banner-kaara{
            height:450px;
          }
        }

        @media (max-width:768px){
          .banner-kaara{
            height:320px;
          }
        }

        @media (max-width:480px){
          .banner-kaara{
            height:240px;
          }
        }
      `}</style>
    </>
  );
}