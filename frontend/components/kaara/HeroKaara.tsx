"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

import WatchVideoLink from "@/components/common/WatchVideoLink";
import { VIDEO_URLS } from "@/lib/site";

export default function HeroKaara() {
  return (
    <>
      <section className="hero">
        {/* Background */}
        <Image
          src="/3.jpg"
          alt="Kaara Restaurant"
          fill
          sizes="100vw"
          priority
          className="bg"
        />

        <div className="overlay" />

        <div className="container">
          {/* Left Content */}
          <div className="content">
            <Image
              src="/kaara-logo.png"
              alt="Kaara"
              width={200}
              height={100}
              priority
            />

            <p>
              Experience refined rooftop dining where exquisite cuisine,
              handcrafted cocktails, and panoramic city views come together to
              create unforgettable evenings.
            </p>

            <Link href="/contact" className="cta">
              Reserve Your Table
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Bottom */}
          <div className="watch">
            <WatchVideoLink
              url={VIDEO_URLS.kaaraExperience}
              className="play"
              ariaLabel="Watch the Kaara experience"
            >
              <Play fill="white" size={24} />
            </WatchVideoLink>

            <div>
              <span>WATCH</span>
              <h4>Experience</h4>
            </div>
          </div>
        </div>
      </section>

      <style >{`
        .hero {
          position: relative;
          width: 100%;
          /* min-height, not height: zoomed in the content outgrows the viewport
             and a fixed height clipped it out of scroll range. svh so mobile
             browser chrome collapsing does not reflow the hero mid-scroll.
             The container below stretches to fill this, so the copy keeps
             sitting on the hero floor exactly as before. */
          min-height: 100svh;
          display: flex;
          overflow-x: clip;
        }

        .bg {
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.65) 0%,
            rgba(0, 0, 0, 0.35) 35%,
            rgba(0, 0, 0, 0.15) 100%
          );
        }

        .container {
          position: relative;
          z-index: 2;
          width: min(1400px, 90%);
          /* margin-inline only — an auto block margin would cancel the flex
             stretch that gives this its height. */
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 120px 0 80px;
        }

        .content {
          max-width: 500px;
        }

        .content p {
          margin: 35px 0;
          color: rgba(255, 255, 255, 0.92);
          font-size: 18px;
          line-height: 1.9;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 34px;
          background: #b88a4f;
          color: white;
          text-decoration: none;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 13px;
          transition: 0.35s;
        }

        .cta:hover {
          background: #9f743f;
          transform: translateY(-3px);
        }

        .watch {
          /* Vertically centred in the hero rather than sitting on its floor
             next to the copy — the container is align-items:flex-end for the
             text column, so this opts out of it. */
          align-self: center;
          display: flex;
          align-items: center;
          gap: 18px;
          color: white;
        }

        .play {
          text-decoration: none;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.95);
          background: rgba(184, 138, 79, 0.42);
          backdrop-filter: blur(12px);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          /* Halo + drop shadow so the control reads against a busy photo
             instead of dissolving into it. */
          box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.12),
            0 16px 40px rgba(0, 0, 0, 0.35);
          transition: 0.35s;
        }

        .play:hover {
          transform: scale(1.08);
          background: rgba(184, 138, 79, 0.75);
          box-shadow: 0 0 0 14px rgba(255, 255, 255, 0.16),
            0 20px 46px rgba(0, 0, 0, 0.4);
        }

        .watch span {
          font-size: 12px;
          letter-spacing: 3px;
          opacity: 0.8;
        }

        .watch h4 {
          margin-top: 4px;
          font-family: "Cormorant Garamond", serif;
          font-size: 28px;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            justify-content: safe center;
            align-items: flex-start;
            gap: 60px;
            padding: 100px 0 60px;
          }

          .content {
            max-width: 100%;
          }

          .content p {
            font-size: 16px;
          }

          .cta {
            width: 100%;
            justify-content: center;
          }

          .watch {
            /* Stacked layout: align-self runs along the horizontal axis
               here, so keep it on the left with the rest of the column. */
            align-self: flex-start;
            margin-top: 20px;
          }

          .play {
            width: 66px;
            height: 66px;
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.12),
              0 14px 32px rgba(0, 0, 0, 0.35);
          }

          .watch h4 {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}