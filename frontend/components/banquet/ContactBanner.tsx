// ContactBanner.tsx

import React from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, MAPS_URL } from "@/lib/site";
import {
  Phone,
  MapPin,
  CalendarDays,
  Headphones,
  ArrowRight,
} from "lucide-react";

const ContactBanner = () => {
  return (
    <>
      <section className="contact-banner">
        {/* Decorative Leaves */}
        <div className="leaf left"></div>
        <div className="leaf right"></div>

        <div className="banner-container">
          {/* Left Content */}
          <div className="left-section">
            <h2>
              Let&apos;s Make Your
              <br />
              Special Day Extraordinary
            </h2>

            <div className="divider">
              <span></span>
              ✦
              <span></span>
            </div>

            <p>We’re here to help you plan every detail</p>

            <Link href="/contact" className="enquire-cta">
              ENQUIRE NOW
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Content */}
          <div className="right-section">
            <div className="info-card">
              <div className="icon-circle">
                <Phone size={28} />
              </div>

              <h3>Call Us</h3>
              <p>
                <a href={PHONE_HREF} className="card-link">
                  {PHONE}
                </a>
              </p>
            </div>

            <div className="info-card">
              <div className="icon-circle">
                <MapPin size={28} />
              </div>

              <h3>Location</h3>
              <p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-link"
                >
                  Kalyanam Marriage Lawn
                  <br />
                  Sikar
                </a>
              </p>
            </div>

            <div className="info-card">
              <div className="icon-circle">
                <CalendarDays size={28} />
              </div>

              <h3>Visit Us</h3>
              <p>
                <Link href="/contact" className="card-link">
                  Book a visit &amp; explore our venue
                </Link>
              </p>
            </div>

            <div className="info-card">
              <div className="icon-circle">
                <Headphones size={28} />
              </div>

              <h3>Event Assistance</h3>
              <p>
                <a href={PHONE_HREF} className="card-link">
                  We’re here to assist you 24/7
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-banner {
          position: relative;
          width: 100%;
          /* Clips the .leaf ornaments, which hang off both edges at -20px.
             x-axis only, so tall content is never cut off. */
          overflow-x: clip;
          background: linear-gradient(
            rgba(5, 35, 24, 0.96),
            rgba(5, 35, 24, 0.98)
          );
          padding: 55px 60px;
        }

        .banner-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          position: relative;
          z-index: 2;
        }

        /* LEFT */

        .left-section {
          width: 34%;
          padding-right: 40px;
          border-right: 1px solid rgba(212, 171, 103, 0.35);
        }

        .left-section h2 {
          font-size: 30px;
          line-height: 1;
          color: #ddb174;
          margin: 0;
          font-family: 'Georgia', serif;
          font-weight: 500;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #b88a4c;
          margin: 10px 0;
          font-size: 12px;
        }

        .divider span {
          width: 120px;
          height: 1px;
          background: rgba(212, 171, 103, 0.4);
        }

        .left-section p {
          font-size: 12px;
          color: rgba(255,255,255,0.82);
          margin-bottom: 24px;
          font-family: Arial, sans-serif;
        }

        .left-section .enquire-cta {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #c6934c;
          color: #fff;
          border: none;
          padding: 10px 30px;
          font-size: 14px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 6px;
          font-weight: 600;
        }

        .left-section .enquire-cta:hover {
          background: #b4803a;
          transform: translateY(-2px);
        }

        /* RIGHT */

        .right-section {
          width: 66%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .info-card {
          text-align: center;
          padding: 10px 24px;
          border-right: 1px solid rgba(212, 171, 103, 0.25);
        }

        .info-card:last-child {
          border-right: none;
        }

        .icon-circle {
          width: 68px;
          height: 68px;
          border: 2px solid #c6934c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          color: #d5a666;
        }

        .info-card h3 {
          font-size: 17px;
          color: #ddb174;
          margin: 0 0 12px;
          font-family: 'Georgia', serif;
          font-weight: 500;
        }

        .info-card p {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.72);
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .card-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .card-link:hover {
          color: #ddb174;
        }

        /* Decorative Leaves */

        .leaf {
          position: absolute;
          width: 170px;
          height: 170px;
          opacity: 0.12;
          z-index: 1;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .leaf.left {
          top: -20px;
          left: -20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23d5a666' stroke-width='1.5'%3E%3Cpath d='M120 30c-40 30-60 80-50 130'/%3E%3Cpath d='M100 50c20 20 30 50 20 80'/%3E%3C/g%3E%3C/svg%3E");
        }

        .leaf.right {
          bottom: -20px;
          right: -20px;
          transform: rotate(180deg);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23d5a666' stroke-width='1.5'%3E%3Cpath d='M120 30c-40 30-60 80-50 130'/%3E%3Cpath d='M100 50c20 20 30 50 20 80'/%3E%3C/g%3E%3C/svg%3E");
        }

        /* RESPONSIVE */

        @media (max-width: 1200px) {
          .banner-container {
            flex-direction: column;
          }

          .left-section,
          .right-section {
            width: 100%;
          }

          .left-section {
            border-right: none;
            border-bottom: 1px solid rgba(212, 171, 103, 0.25);
            padding-bottom: 35px;
          }

          .right-section {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px 0;
          }

          .info-card:nth-child(2) {
            border-right: none;
          }
        }

        @media (max-width: 768px) {
          .contact-banner {
            padding: 40px 24px;
            border-radius: 0;
          }

          .left-section h2 {
            font-size: 38px;
          }

          .divider span {
            width: 70px;
          }

          .right-section {
            grid-template-columns: 1fr;
          }

          .info-card {
            border-right: none;
            border-bottom: 1px solid rgba(212, 171, 103, 0.18);
            padding: 22px 0;
          }

          .info-card:last-child {
            border-bottom: none;
          }

          .icon-circle {
            width: 58px;
            height: 58px;
          }
        }
      `}</style>
    </>
  );
};

export default ContactBanner;