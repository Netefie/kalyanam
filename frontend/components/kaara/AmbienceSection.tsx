"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function AmbienceSection() {
  return (
    <>
      <section className="ambience-section">
        <div className="ambience-container">

          {/* Left Content */}

          <div className="ambience-content">

            <span className="eyebrow">
              THE AMBIENCE
            </span>

            <h2>
              Elevate Every
              <br />
              Moment
            </h2>

           

            <p>
              From intimate dinners to grand celebrations,
              Kaara creates a refined atmosphere where every
              gathering becomes a memorable experience.
            </p>

            <Link
              href="/restaurant/ambience"
              className="ambience-btn"
            >
              Explore Ambience

              <ArrowRight
                size={18}
                strokeWidth={2}
              />
            </Link>

          </div>

          {/* Image Gallery */}

          <div className="gallery">

            {/* Large Image */}

            <div className="large-image">

              <Image
                src="/ambience-1.AVIF"
                alt="Restaurant Interior"
                fill
                priority
              />

              

            </div>

            {/* Right Images */}

            <div className="small-images">

              <div className="small-image">

                <Image
                  src="/ambience-2.JPG"
                  alt="Dining"
                  fill
                />

              </div>

              <div className="small-image">

                <Image
                  src="/ambience-3.JPG"
                  alt="Rooftop"
                  fill
                />

              </div>

            </div>

          </div>

        </div>
      </section>

      <style>{`
/* ============================
   SECTION
============================ */

.ambience-section {
  padding: 50px 0;
  background: #faf7f2;
  overflow: hidden;
}

.ambience-container {
  width: min(1200px, 94%);
  margin: 0 auto;

  display: grid;
  grid-template-columns: 30% 70%;
  gap: 50px;
  align-items: center;

  overflow: hidden;
}

/* Prevent grid overflow */
.ambience-container > * {
  min-width: 0;
}

/* ============================
   LEFT
============================ */

.ambience-content {
  max-width: 380px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;

  color: #b78943;

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 3px;

  text-transform: uppercase;
}

.ambience-content h2 {
  margin: 0;

  font-family: "Cormorant Garamond", serif;
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 500;
  line-height: 1.15;

  color: #17304b;
}

.ambience-content p {
  margin: 18px 0 35px;

  color: #666;
  font-size: 15px;
  line-height: 1.8;

  max-width: 360px;
}

.ambience-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  padding: 15px 30px;

  border: 1px solid #c49a62;

  color: #b78943;

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 2px;
  text-transform: uppercase;

  transition: .3s ease;
}

.ambience-btn:hover {
  background: #b78943;
  color: #fff;
}

.ambience-btn svg {
  transition: .3s;
}

.ambience-btn:hover svg {
  transform: translateX(5px);
}

/* ============================
   GALLERY
============================ */

.gallery {
  display: grid;

  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);

  gap: 16px;

  width: 90%;
  min-width: 0;
}

/* ============================
   LARGE IMAGE
============================ */

.large-image {
  position: relative;

  width: 100%;

  aspect-ratio: 1.35;

  border-radius: 8px;

  overflow: hidden;
}

.large-image img {
  object-fit: cover;

  transition: .4s;
}

.large-image:hover img {
  transform: scale(1.04);
}

/* ============================
   RIGHT IMAGES
============================ */

.small-images {
  display: grid;

  grid-template-rows: repeat(2, 1fr);

  gap: 16px;

  min-width: 0;
}

.small-image {
  position: relative;

  width: 100%;

  border-radius: 8px;

  overflow: hidden;
}

.small-image img {
  object-fit: cover;

  transition: .4s;
}

.small-image:hover img {
  transform: scale(1.04);
}

/* ============================
   PLAY BUTTON
============================ */

.play-btn {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  width: 80px;
  height: 80px;

  border: none;
  border-radius: 50%;

  background: white;
  color: #b78943;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  transition: .3s;

  box-shadow: 0 12px 30px rgba(0,0,0,.15);
}

.play-btn:hover {
  transform: translate(-50%, -50%) scale(1.08);

  background: #b78943;
  color: white;
}

/* ============================
   TABLET
============================ */

@media (max-width: 1100px) {

  .ambience-container {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .ambience-content {
    max-width: 650px;
    margin: 0 auto;
    text-align: center;
  }

  .ambience-content p {
    margin-inline: auto;
  }

  .ambience-btn {
    margin: 0 auto;
  }

  .gallery {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }

}

/* ============================
   MOBILE
============================ */

@media (max-width: 768px) {

  .ambience-section {
    padding: 60px 0;
  }

  .ambience-container {
    width: 92%;
  }

  .gallery {
    grid-template-columns: 1fr;
  }

  .small-images {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  .play-btn {
    width: 65px;
    height: 65px;
  }

}

/* ============================
   SMALL MOBILE
============================ */

@media (max-width: 480px) {

  .ambience-content h2 {
    font-size: 34px;
  }

  .ambience-content p {
    font-size: 14px;
  }

  .ambience-btn {
    width: 100%;
    justify-content: center;
  }

  .small-images {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .play-btn {
    width: 55px;
    height: 55px;
  }

}
      `}</style>
    </>
  );
}