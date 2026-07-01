"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export default function HeroAcc() {
  return (
    <>
      <section
        className="heroacc-section"
        style={{
          backgroundImage: "url('/ahero.png')",
        }}
      >
        <div className="heroacc-container">
          <div className="heroacc-content">
            {/* Heading */}

            <h1 className="heroacc-heading">
              <span>Stay in Comfort,</span>
              <span>Wake Up to</span>
              <span className="heroacc-accent">Memories</span>
            </h1>

            {/* Description */}

            <p className="heroacc-description">
              Wake up to tranquil mornings, refined interiors, and heartfelt
              hospitality. Every room at Kalyanam is thoughtfully crafted to
              offer the perfect balance of comfort, sophistication, and
              unforgettable experiences.
            </p>

            {/* CTA */}

            <div className="heroacc-actions">
              <Link href="/accommodation" className="heroacc-btn">
                <span>EXPLORE MORE</span>
                <span className="heroacc-arrow">→</span>
              </Link>

              <button className="heroacc-video">
                <div className="heroacc-play">
                  <Play
                    size={18}
                    fill="currentColor"
                    strokeWidth={2}
                  />
                </div>

                <span>WATCH ROOM TOUR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
       .heroacc-section {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
}

.heroacc-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 80px;
}

.heroacc-content {
  max-width: 560px;
  color: #fff;
}

.heroacc-heading {
  display: flex;
  flex-direction: column;
  font-family: var(--font-playfair);
  font-weight: 400;
  line-height: 1;
}

.heroacc-heading span {
  display: block;
  font-size: 54px;
  font-weight: 400;
  letter-spacing: -1px;
}

.heroacc-accent {
  margin-top: 8px;
  font-family: var(--font-pinyon);
  font-size: 90px !important;
  font-weight: 400;
  font-style: normal;
  color: #D8A14A;
  line-height: .8;
  letter-spacing: 0;
}

.heroacc-description {
  margin-top: 12px;
  max-width: 450px;
  font-family: var(--font-lato);
  font-size: 15px;
  line-height: 1.3;
  color: rgba(255,255,255,.9);
}

.heroacc-actions {
  display: flex;
  align-items: center;
  gap: 26px;
  margin-top: 22px;
}

.heroacc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  padding: 14px 28px;

  background: #B37A46;
  border: 1px solid #B37A46;

  color: #fff;
  text-decoration: none;

  font-family: var(--font-playfair);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .16em;
  text-transform: uppercase;

  transition: all .35s ease;
}

.heroacc-btn:hover {
  background: transparent;
  color: #B37A46;
}

.heroacc-arrow {
  font-size: 18px;
  transition: transform .35s ease;
}

.heroacc-btn:hover .heroacc-arrow {
  transform: translateX(5px);
}

.heroacc-video {
  display: flex;
  align-items: center;
  gap: 16px;

  background: transparent;
  border: none;

  color: #fff;
  cursor: pointer;
}

.heroacc-video span {
  font-family: var(--font-playfair);
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.heroacc-play {
  width: 52px;
  height: 52px;

  border: 1px solid rgba(255,255,255,.95);
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: all .35s ease;
}

.heroacc-play svg {
  width: 16px;
  height: 16px;
  margin-left: 3px;
  transition: .35s;
}

.heroacc-video:hover .heroacc-play {
  background: #fff;
  color: #000;
}

.heroacc-video:hover .heroacc-play svg {
  transform: scale(1.08);
}

/* ================= Tablet ================= */

@media (max-width:1024px){

  .heroacc-container{
    padding:0 50px;
  }

  .heroacc-content{
    max-width:500px;
  }

  .heroacc-heading span{
    font-size:52px;
  }

  .heroacc-accent{
    font-size:90px !important;
  }

  .heroacc-description{
    font-size:14px;
    max-width:420px;
  }

}

/* ================= Mobile ================= */

@media (max-width:768px){

  .heroacc-section{
    height:90vh;
    align-items:center;
  }

  .heroacc-container{
    padding:0 24px;
  }

  .heroacc-content{
    max-width:100%;
  }

  .heroacc-heading span{
    font-size:40px;
    line-height:1;
  }

  .heroacc-accent{
    font-size:68px !important;
    margin-top:4px;
  }

  .heroacc-description{
    margin-top:20px;
    max-width:100%;
    font-size:14px;
    line-height:1.7;
  }

  .heroacc-actions{
    margin-top:30px;
    flex-direction:column;
    align-items:flex-start;
    gap:18px;
  }

  .heroacc-btn{
    padding:12px 22px;
    font-size:12px;
  }

  .heroacc-play{
    width:46px;
    height:46px;
  }

  .heroacc-video span{
    font-size:12px;
  }

}
      `}</style>
    </>
  );
}