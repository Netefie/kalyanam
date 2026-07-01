"use client";

import Image from "next/image";

const features = [
  {
    icon: "/venue-icon-1.png",
    title: "Expansive Lawn",
    desc: "Spacious & lush green lawn for grand celebrations.",
  },
  {
    icon: "/venue-icon-2.png",
    title: "Custom Décor",
    desc: "Beautiful décor tailored for your special occasion.",
  },
  {
    icon: "/venue-icon-3.png",
    title: "Premium Hospitality",
    desc: "Exceptional service ensuring every guest feels special.",
  },
  {
    icon: "/venue-icon-4.png",
    title: "Ample Parking",
    desc: "Convenient parking facilities for large gatherings.",
  },
];

export default function WeddingVenueSection() {
  return (
    <>
      <section className="venue-section">
        <div className="venue-container">

          {/* Left Content */}

          <div className="venue-content">

            <span className="venue-tag">
              THE PERFECT VENUE
            </span>

            <h2>
              Timeless Elegance,
              <br />
              Unforgettable Celebrations
            </h2>

            <p>
              Our expansive marriage lawn is thoughtfully designed to host
              grand celebrations with elegance, comfort and exceptional
              hospitality. Every corner is crafted to create unforgettable
              wedding memories.
            </p>

            {/* Features */}

            <div className="venue-features">

              {features.map((feature) => (

                <div
                  key={feature.title}
                  className="feature-card"
                >

                  <div className="feature-icon">

                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={44}
                      height={44}
                    />

                  </div>

                  <h4>
                    {feature.title}
                  </h4>

                  <p>
                    {feature.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Right Gallery */}

          <div className="venue-gallery">

            {/* Large */}

            <div className="gallery-large">

              <Image
                src="/venue-large.jpg"
                alt="Wedding Lawn"
                fill
                priority
              />

            </div>

            {/* Right Images */}

            <div className="gallery-small">

              <div className="gallery-item">

                <Image
                  src="/venue-small-1.jpg"
                  alt="Wedding Decor"
                  fill
                />

              </div>

              <div className="gallery-item">

                <Image
                  src="/venue-small-2.jpg"
                  alt="Wedding Entrance"
                  fill
                />

              </div>

            </div>

          </div>

        </div>
      </section>

      <style>{`
/* ==========================================
   SECTION
========================================== */

.venue-section{
  padding:50px 0;
  background:#fbf8f3;
  overflow:hidden;
}

.venue-container{

  width:min(1400px,92%);
  margin:0 auto;

  display:grid;

  grid-template-columns:1fr 1.05fr;

  align-items:center;

  gap:60px;

}

/* ==========================================
   LEFT
========================================== */

.venue-content{

  width:100%;
  max-width:620px;

}

.venue-tag{

  display:inline-block;

  margin-bottom:5px;

  color:#b78943;

  font-size:12px;

  font-weight:600;

  letter-spacing:4px;

  text-transform:uppercase;

}

.venue-content h2{

  margin:0;

  font-family:"Cormorant Garamond",serif;

  font-size:clamp(44px,4vw,64px);

  line-height:1;

  font-weight:500;

  color:#17304b;

}

.venue-content > p{

  margin:10px 0 42px;

  max-width:480px;

  color:#666;

  font-size:14px;

  line-height:1.4;

}

/* ==========================================
   FEATURES
========================================== */

.venue-features{

  display:grid;

  grid-template-columns:repeat(4,minmax(0,1fr));

  gap:18px;

}

.feature-card{

  text-align:center;

}

.feature-icon{

  width:84px;
  height:84px;

  margin:0 auto 18px;

  border:1px solid #e7d8c2;

  border-radius:50%;

  display:flex;

  justify-content:center;

  align-items:center;

  background:#fff;

  transition:.35s ease;

}

.feature-card:hover .feature-icon{

  border-color:#b78943;

  transform:translateY(-4px);

}

.feature-icon img{

  width:42px;
  height:42px;

  object-fit:contain;

}

.feature-card h4{

  margin:0 0 10px;

  color:#17304b;

  font-size:17px;

  font-weight:600;

  line-height:1.4;

}

.feature-card p{

  margin:0;

  color:#777;

  font-size:13px;

  line-height:1.7;

}

/* ==========================================
   GALLERY
========================================== */

.venue-gallery{

  display:grid;

  grid-template-columns:2fr 1fr;

  gap:16px;

  width:100%;

  min-width:0;

}

.gallery-large{

  position:relative;

  width:100%;

  min-height:560px;

  border-radius:12px;

  overflow:hidden;

}

.gallery-large img{

  object-fit:cover;

  transition:.45s ease;

}

.gallery-large:hover img{

  transform:scale(1.04);

}

.gallery-small{

  display:grid;

  grid-template-rows:1fr 1fr;

  gap:16px;

}

.gallery-item{

  position:relative;

  width:100%;

  border-radius:12px;

  overflow:hidden;

}

.gallery-item img{

  object-fit:cover;

  transition:.45s ease;

}

.gallery-item:hover img{

  transform:scale(1.04);

}
  /* ==========================================
   LAPTOP
========================================== */

@media (max-width:1200px){

.venue-container{

grid-template-columns:1fr;

gap:60px;

}

.venue-content{

max-width:760px;

margin:0 auto;

text-align:center;

}

.venue-content > p{

margin-left:auto;
margin-right:auto;

}

.venue-gallery{

max-width:900px;

margin:0 auto;

}

.venue-features{

grid-template-columns:repeat(4,1fr);

gap:24px;

}

}

/* ==========================================
   TABLET
========================================== */

@media (max-width:992px){

.venue-section{

padding:70px 0;

}

.venue-container{

width:94%;

gap:50px;

}

.venue-content h2{

font-size:50px;

}

.venue-content > p{

font-size:15px;

line-height:1.8;

}

.gallery-large{

min-height:480px;

}

.gallery-small{

gap:14px;

}

.gallery-item{

min-height:230px;

}

.venue-features{

grid-template-columns:repeat(2,1fr);

gap:30px;

}

}

/* ==========================================
   MOBILE
========================================== */

@media (max-width:768px){

.venue-section{

padding:60px 0;

}

.venue-container{

width:92%;

gap:40px;

}

.venue-content{

text-align:center;

}

.venue-content h2{

font-size:40px;

line-height:1.15;

}

.venue-content > p{

font-size:15px;

max-width:100%;

margin:18px auto 35px;

}

.venue-gallery{

grid-template-columns:1fr;

gap:14px;

}

.gallery-large{

min-height:360px;

}

.gallery-small{

grid-template-columns:1fr 1fr;

grid-template-rows:auto;

gap:14px;

}

.gallery-item{

min-height:180px;

}

.venue-features{

grid-template-columns:repeat(2,1fr);

gap:22px;

}

.feature-icon{

width:72px;

height:72px;

}

.feature-icon img{

width:36px;

height:36px;

}

.feature-card h4{

font-size:15px;

}

.feature-card p{

font-size:13px;

line-height:1.6;

}

}

/* ==========================================
   SMALL MOBILE
========================================== */

@media (max-width:480px){

.venue-section{

padding:50px 0;

}

.venue-container{

width:90%;

}

.venue-content h2{

font-size:34px;

}

.venue-content > p{

font-size:14px;

line-height:1.7;

}

.venue-features{

grid-template-columns:repeat(2,1fr);

gap:18px;

}

.feature-icon{

width:64px;

height:64px;

margin-bottom:14px;

}

.feature-icon img{

width:30px;

height:30px;

}

.feature-card h4{

font-size:14px;

}

.feature-card p{

font-size:12px;

line-height:1.5;

}

.gallery-large{

min-height:280px;

}

.gallery-small{

grid-template-columns:1fr;

gap:12px;

}

.gallery-item{

min-height:180px;

}

}

      `}</style>
    </>
  );
}