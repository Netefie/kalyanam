"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

export default function HeroKaara() {
  return (
    <>
      <section className="hero">
        {/* Background */}
        <Image
          src="/3.jpg"
          alt="Kaara Restaurant"
          fill
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

            <Link href="/reservation" className="cta">
              Reserve Your Table
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Bottom */}
          <div className="watch">
            <button className="play">
              <Play fill="white" size={20} />
            </button>

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
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
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
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
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
          display: flex;
          align-items: center;
          gap: 18px;
          color: white;
        }

        .play {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.35s;
        }

        .play:hover {
          transform: scale(1.08);
          background: rgba(184, 138, 79, 0.45);
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
            justify-content: center;
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
            margin-top: 20px;
          }

          .play {
            width: 60px;
            height: 60px;
          }

          .watch h4 {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}