"use client";

import Image from "next/image";
import Link from "next/link";

export default function BannerKaara() {
  return (
    <>
      <Link
        href="https://dinein.petpooja.com/qr/nre1djqbag/T-5"
        className="banner-link"
      >
        <section className="banner-kaara">
          <Image
            src="/kaara-banner.png"
            alt="Kaara Restaurant"
            fill
            priority
            className="banner-image"
          />
        </section>
      </Link>

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