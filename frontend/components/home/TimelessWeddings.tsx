"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const weddingSlides = [
  {
    id: 1,
    title: "A RESPLENDENT AFFAIR",
    shortTitle: "A RESPLENDENT AFFAIR",
    description:
      "We understand that your special day deserves nothing short of perfection, and our dedicated team is here to craft an unforgettable wedding experience that surpasses your imagination.",
    image: "/1.jpg",
  },
  {
    id: 2,
    title: "EXQUISITE MATRIMONIAL CEREMONIES",
    shortTitle: "EXQUISITE MATRIMONIAL CEREMONIES",
    description:
      "Celebrate timeless traditions amidst elegant décor, majestic venues and impeccable hospitality designed for unforgettable matrimonial ceremonies.",
    image: "/2.avif",
  },
  {
    id: 3,
    title: "PICTURE PERFECT SHOOTS",
    shortTitle: "PICTURE PERFECT SHOOTS",
    description:
      "Every corner of Kalyanam is thoughtfully designed to become the perfect backdrop for your pre-wedding, wedding and post-wedding memories.",
    image: "/3.jpg",
  },
  {
    id: 4,
    title: "LUXURY RECEPTIONS",
    shortTitle: "LUXURY RECEPTIONS",
    description:
      "Celebrate your grand reception with luxurious interiors, curated dining experiences and flawless hospitality that leaves every guest delighted.",
    image: "/4.jpg",
  },
];

export default function TimelessWeddings() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

  const previousIndex =
    current === 0 ? weddingSlides.length - 1 : current - 1;

  const nextIndex =
    current === weddingSlides.length - 1 ? 0 : current + 1;

  const activeSlide = weddingSlides[current];
  const previousSlide = weddingSlides[previousIndex];
  const nextSlide = weddingSlides[nextIndex];

  const changeSlide = (direction: "next" | "prev") => {
    setAnimate(false);

    setTimeout(() => {
      if (direction === "next") {
        setCurrent((prev) =>
          prev === weddingSlides.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrent((prev) =>
          prev === 0 ? weddingSlides.length - 1 : prev - 1
        );
      }

      setAnimate(true);
    }, 250);
  };

  return (
    <>
      <section className="timeless-section">

        {/* =======================
            DESKTOP (UNCHANGED)
        ======================== */}

        <div className="wrapper desktop-view">

          {/* Previous Panel */}

          <div className="side-panel left">

            <button
              className="circle-btn"
              onClick={() => changeSlide("prev")}
            >
              <ArrowLeft size={26} />
            </button>

            <h3>{previousSlide.shortTitle}</h3>

          </div>

          {/* Active Card */}

          <div className="center-card">

            <div
              className={`image-wrapper ${
                animate ? "fade-in" : "fade-out"
              }`}
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                priority
                className="image"
              />
            </div>

            <div
              className={`content ${
                animate ? "content-in" : "content-out"
              }`}
            >
              <h2>{activeSlide.title}</h2>

              <p>{activeSlide.description}</p>

              <button className="discover-btn">
                Discover More
              </button>

            </div>

          </div>

          {/* Next Panel */}

          <div className="side-panel right">

            <h3>{nextSlide.shortTitle}</h3>

            <button
              className="circle-btn"
              onClick={() => changeSlide("next")}
            >
              <ArrowRight size={26} />
            </button>

          </div>

        </div>

        {/* =======================
            MOBILE ONLY
        ======================== */}

        <div className="mobile-carousel">

          {weddingSlides.map((slide) => (

            <div
              className="mobile-card"
              key={slide.id}
            >

              <div className="mobile-image">

                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                />

              </div>

              <div className="mobile-content">

                <h2>{slide.title}</h2>

                <p>{slide.description}</p>

                <button className="discover-btn">
                  Discover More
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      <style>{`
      .timeless-section {
  background: #2b2929;
  padding: 50px 0;
  overflow: hidden;
}

/* ===========================
   DESKTOP
=========================== */

.desktop-view{
  display:grid;
}

.mobile-carousel{
  display:none;
}

.wrapper{
  width:100%;
  max-width:1800px;
  margin:auto;

  display:grid;
  grid-template-columns:.60fr 1fr .60fr;

  gap:40px;
  align-items:stretch;
}

/* ---------- SIDE PANELS ---------- */

.side-panel{
  background:#2c2925;
  border:1px solid rgba(255,255,255,.35);

  position:relative;

  display:flex;
  justify-content:center;
  align-items:center;

  min-height:300px;

  transition:.35s;
}

.side-panel:hover{
  background:#34302b;
}

.side-panel h3{

  color:#fff;

  font-family:"Cormorant Garamond",serif;

  font-size:28px;

  font-weight:400;

  line-height:1.2;

  text-align:center;

  text-transform:uppercase;

  max-width:180px;
}

.circle-btn{

  position:absolute;

  width:62px;
  height:62px;

  border-radius:50%;

  border:1px solid rgba(255,255,255,.8);

  background:transparent;

  color:#fff;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  transition:.3s;
}

.circle-btn:hover{

  background:#fff;
  color:#2c2925;
}

.left .circle-btn{
  left:38px;
}

.right .circle-btn{
  right:38px;
}

/* ---------- CENTER CARD ---------- */

.center-card{

  background:#fff;

  display:flex;
  flex-direction:column;

  overflow:hidden;
}

.image-wrapper{

  position:relative;

  width:100%;

  height:280px;
}

.image{

  object-fit:cover;

  transition:.8s;
}

.center-card:hover .image{

  transform:scale(1.04);
}

.content{

  padding:16px 20px;

  text-align:center;
}

.content h2{

  font-family:"Cormorant Garamond",serif;

  font-size:28px;

  color:#55473b;

  font-weight:400;

  margin-bottom:8px;
}

.content p{

  max-width:760px;

  margin:auto;

  color:#666;

  font-size:14px;

  line-height:1.8;
}

.discover-btn{

  margin-top:18px;

  background:none;

  border:none;

  color:#a87a2d;

  cursor:pointer;

  font-size:17px;

  letter-spacing:1px;
}

/* ---------- ANIMATION ---------- */

.fade-in{
  animation:imageFade .6s ease forwards;
}

.fade-out{
  opacity:0;
  transform:scale(1.05);
}

.content-in{
  animation:textFade .5s ease;
}

.content-out{
  opacity:0;
  transform:translateY(20px);
}

@keyframes imageFade{

from{
opacity:0;
transform:scale(1.05);
}

to{
opacity:1;
transform:scale(1);
}

}

@keyframes textFade{

from{
opacity:0;
transform:translateY(20px);
}

to{
opacity:1;
transform:translateY(0);
}

}

/* ==========================================================
                     MOBILE (TAJ STYLE)
========================================================== */

@media (max-width:992px){

.desktop-view{
display:none;
}

.mobile-carousel{

display:flex;

overflow-x:auto;

overflow-y:hidden;

gap:18px;

padding:0 10%;

scroll-snap-type:x mandatory;

scroll-padding:0 10%;

-webkit-overflow-scrolling:touch;

scrollbar-width:none;
}

.mobile-carousel::-webkit-scrollbar{
display:none;
}

.mobile-card{

flex:0 0 85%;

background:#fff;

scroll-snap-align:center;

border-radius:4px;

overflow:hidden;

box-shadow:0 8px 25px rgba(0,0,0,.18);
}

.mobile-image{

position:relative;

width:100%;

height:240px;
}

.mobile-image img{

object-fit:cover;
}

.mobile-content{

padding:22px;

text-align:center;
}

.mobile-content h2{

font-family:"Cormorant Garamond",serif;

font-size:24px;

font-weight:400;

color:#55473b;

margin-bottom:10px;
}

.mobile-content p{

font-size:14px;

line-height:1.8;

color:#666;
}

.mobile-content .discover-btn{

margin-top:18px;

background:none;

border:none;

color:#a87a2d;

font-size:16px;
}

}

/* ==========================================================
                     SMALL MOBILE
========================================================== */

@media (max-width:768px){

.mobile-carousel{

padding:0 4%;

gap:16px;
}

.mobile-card{

flex:0 0 76%;
}

.mobile-image{

height:210px;
}

.mobile-content{

padding:18px;
}

.mobile-content h2{

font-size:22px;
}

.mobile-content p{

font-size:13px;

line-height:1.7;
}

}
`}</style>
    </>
  );
}