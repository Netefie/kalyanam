"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

export default function HeroWedding() {
  return (
    <>
      <section className="hero-wedding">

        {/* Background Image */}

        <Image
          src="/wedding-hero.jpg"
          alt="Marriage Lawn by Kalyanam"
          fill
          priority
          className="hero-bg"
        />

        {/* Left Gradient */}

        <div className="hero-overlay" />

        {/* Content */}

        <div className="hero-container">

          {/* Left */}

          <div className="hero-content">

            <span className="hero-eyebrow">
              WEDDING DESTINATION
            </span>

            <h1>
              Marriage Lawn
              <br />
              by <span>Kalyanam</span>
            </h1>

            <h3>
              Where Your Forever Begins
            </h3>

            <p>
              Celebrate life's most treasured moments in a timeless setting
              designed for unforgettable weddings, elegant receptions and
              magical celebrations.
            </p>

            <Link
              href="/contact"
              className="hero-btn"
            >
              Enquire Now

              <ArrowRight
                size={18}
                strokeWidth={2}
              />
            </Link>

          </div>

        </div>

        {/* Watch Experience */}

        <div className="watch-wrapper">

          <button
            className="play-btn"
            aria-label="Watch Experience"
          >
            <Play
              size={22}
              fill="currentColor"
            />
          </button>

          <div className="watch-text">

            <span>
              WATCH
            </span>

            <p>
              THE EXPERIENCE
            </p>

          </div>

        </div>

      </section>

      <style>{`
      /* ==========================================
   HERO SECTION
========================================== */

.hero-wedding{
  position:relative;
  width:100%;
  height:100vh;
  overflow:hidden;
  background:#000;
}
.hero-bg{
  object-fit:cover;
  object-position:center;
  z-index:1;
}

/* ==========================================
   LEFT OVERLAY
========================================== */

.hero-overlay{
  position:absolute;
  inset:0;
  z-index:2;

background: linear-gradient( 90deg, rgba(15,15,15,.98) 0%, rgba(15,15,15,.95) 20%, rgba(15,15,15,.82) 34%, rgba(15,15,15,.55) 45%, rgba(15,15,15,.18) 56%, rgba(15,15,15,0) 66% );

}

/* ==========================================
   CONTAINER
========================================== */

.hero-container{
  position:relative;
  z-index:5;

  width:min(1450px,92%);
  height:100%;

  margin:auto;

  display:flex;
  align-items:center;
}

.hero-content{
  max-width:520px;
}

/* ==========================================
   CONTENT
========================================== */

.hero-eyebrow{

  display:inline-block;

  margin-bottom:5px;

  color:#b78943;

  font-size:12px;

  font-weight:600;

  letter-spacing:4px;

  text-transform:uppercase;

}

.hero-content h1{

  margin:0;

  font-family:"Cormorant Garamond",serif;

  font-size:clamp(54px,5vw,88px);

  line-height:1;

  font-weight:500;

  color:#fff;

}

.hero-content h1 span{

  color:#b78943;

}


.hero-content h3{

  margin:0 0 16px;

  font-family:"Cormorant Garamond",serif;

  font-size:30px;

  font-style:italic;

  font-weight:400;

  color:#b78943;

}

.hero-content p{

  max-width:430px;

  margin:0;

  color:#999;

  font-size:14px;

  line-height:1.4;

}

.hero-btn{

  margin-top:42px;

  display:inline-flex;

  align-items:center;

  gap:14px;

  padding:18px 36px;

  background:#b78943;

  color:white;

  text-decoration:none;

  text-transform:uppercase;

  letter-spacing:2px;

  font-size:13px;

  font-weight:600;

  transition:.35s;

}

.hero-btn:hover{

  background:#9b7237;

}

.hero-btn svg{

  transition:.35s;

}

.hero-btn:hover svg{

  transform:translateX(6px);

}

/* ==========================================
   WATCH BUTTON
========================================== */

.watch-wrapper{

  position:absolute;

  right:6%;

  bottom:60px;

  z-index:8;

  display:flex;

  align-items:center;

  gap:18px;

}

.play-btn{

  width:78px;

  height:78px;

  border:none;

  border-radius:50%;

  background:white;

  color:#b78943;

  display:flex;

  justify-content:center;

  align-items:center;

  cursor:pointer;

  transition:.35s;

  box-shadow:0 12px 30px rgba(0,0,0,.18);

}

.play-btn:hover{

  transform:scale(1.08);

  background:#b78943;

  color:white;

}

.watch-text span{

  display:block;

  color:black;

  font-size:12px;

  letter-spacing:3px;

  font-weight:600;

}

.watch-text p{

  margin-top:5px;

  color:black;

  font-size:15px;

  letter-spacing:2px;

}

/* ==========================================
   LAPTOP
========================================== */

@media(max-width:1200px){

.hero-container{

width:94%;

}

.hero-content{

max-width:470px;

}

.hero-content h1{

font-size:64px;

}

}

/* ==========================================
   TABLET
========================================== */

@media(max-width:992px){

.hero-wedding{

height:auto;

min-height:700px;

}

.hero-overlay{

background:
linear-gradient(
180deg,
rgba(251,248,243,.92),
rgba(251,248,243,.65),
rgba(251,248,243,.15),
transparent
);

}

.hero-container{

justify-content:center;

text-align:center;

padding:130px 0 200px;

}

.hero-content p{

margin:auto;

}

.hero-divider{

justify-content:center;

}

.watch-wrapper{

left:50%;

right:auto;

transform:translateX(-50%);

bottom:60px;

}

}

/* ==========================================
   MOBILE
========================================== */

@media(max-width:768px){

.hero-wedding{

min-height:620px;

}

.hero-content h1{

font-size:46px;

}

.hero-content h3{

font-size:28px;

}

.hero-content p{

font-size:16px;

line-height:1.8;

}

.hero-btn{

width:100%;

justify-content:center;

}

.watch-wrapper{

gap:12px;

}

.play-btn{

width:64px;

height:64px;

}

.watch-text span{

font-size:11px;

}

.watch-text p{

font-size:13px;

}

}

/* ==========================================
   SMALL MOBILE
========================================== */

@media(max-width:480px){

.hero-container{

padding:110px 0 170px;

}

.hero-content h1{

font-size:38px;

}

.hero-content h3{

font-size:24px;

}

.hero-content p{

font-size:15px;

}

.hero-divider .line{

width:45px;

}

.play-btn{

width:56px;

height:56px;

}

.watch-wrapper{

bottom:40px;

}

}
      `}</style>
    </>
  );
}