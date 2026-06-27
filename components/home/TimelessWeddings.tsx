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
    image: "/1.png",
  },
  {
    id: 2,
    title: "EXQUISITE MATRIMONIAL CEREMONIES",
    shortTitle: "EXQUISITE MATRIMONIAL CEREMONIES",
    description:
      "Celebrate timeless traditions amidst elegant décor, majestic venues and impeccable hospitality designed for unforgettable matrimonial ceremonies.",
    image: "/2.png",
  },
  {
    id: 3,
    title: "PICTURE PERFECT SHOOTS",
    shortTitle: "PICTURE PERFECT SHOOTS",
    description:
      "Every corner of Kalyanam is thoughtfully designed to become the perfect backdrop for your pre-wedding, wedding and post-wedding memories.",
    image: "/3.png",
  },
  {
    id: 4,
    title: "LUXURY RECEPTIONS",
    shortTitle: "LUXURY RECEPTIONS",
    description:
      "Celebrate your grand reception with luxurious interiors, curated dining experiences and flawless hospitality that leaves every guest delighted.",
    image: "/4.png",
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
        <div className="wrapper">

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
      </section>
<style jsx>{`
  .timeless-section {
    background: #2b2929;;
    padding: 50px 0;
    overflow: hidden;
  }

  .wrapper {
    width: 100%;
    max-width: 1800px;
    margin: auto;

    display: grid;
    grid-template-columns: 0.60fr 1fr 0.60fr;
    gap: 40px;
    align-items: stretch;
  }

  /* ---------- SIDE PANELS ---------- */

  .side-panel {
    background: #2c2925;
    border: 1px solid rgba(255,255,255,.35);
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    min-height: 300px;

    transition: .35s ease;
  }

  .side-panel:hover{
    background:#34302b;
  }

  .side-panel h3{
    color:#fff;

    font-family:"Cormorant Garamond", serif;

    font-size:28px;

    font-weight:400;

    line-height:1.2;

    text-align:center;

    text-transform:uppercase;

    letter-spacing:.5px;

    max-width:180px;

    transition:.35s ease;
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

    transition:.35s ease;
  }

  .circle-btn:hover{
    background:white;
    color:#2c2925;
    transform:scale(1.08);
  }

  .left .circle-btn{
    left:38px;
  }

  .right .circle-btn{
    right:38px;
  }

  /* ---------- CENTER ---------- */

  .center-card{
    background:white;
    overflow:hidden;
    display:flex;
    flex-direction:column;
  }

  .image-wrapper{
    position:relative;
    width:100%;
    height:280px;
    overflow:hidden;
  }

  .image{
    object-fit:cover;
    transition:transform .8s ease;
  }

  .center-card:hover .image{
    transform:scale(1.04);
  }

  .content{
    padding:10px 20px;
    text-align:center;
    transition:.4s ease;
    min-height:80px;
  }

  .content h2{
    font-family:"Cormorant Garamond", serif;
    font-size:28px;
    font-weight:400;
    color:#55473b;
    margin-bottom:2px;
    letter-spacing:.5px;
  }

  .content p{
    max-width:760px;
    margin:auto;
    color:#666;
    font-size:14px;
    line-height:1.8;
  }

  .discover-btn{

    margin-top:12px;

    border:none;

    background:none;

    color:#a87a2d;

    font-size:17px;

    cursor:pointer;

    letter-spacing:1px;

    transition:.3s;
  }

  .discover-btn:hover{
    color:#7f5b18;
  }

  /* ---------- ANIMATION ---------- */

  .fade-in{
    animation:imageFade .6s ease forwards;
  }

  .fade-out{
    opacity:0;
    transform:scale(1.06);
    transition:.25s;
  }

  .content-in{
    animation:textFade .55s ease;
  }

  .content-out{
    opacity:0;
    transform:translateY(25px);
    transition:.25s;
  }

  @keyframes imageFade{

    from{
      opacity:0;
      transform:scale(1.08);
    }

    to{
      opacity:1;
      transform:scale(1);
    }

  }

  @keyframes textFade{

    from{
      opacity:0;
      transform:translateY(25px);
    }

    to{
      opacity:1;
      transform:translateY(0);
    }

  }

  /* ---------- TABLET ---------- */

  @media(max-width:1200px){

    .wrapper{
      grid-template-columns:240px 1fr 240px;
      gap:25px;
    }

    .side-panel{
      min-height:600px;
    }

    .side-panel h3{
      font-size:30px;
    }

    .image-wrapper{
      height:450px;
    }

    .content{
      padding:45px;
    }

  }

  @media(max-width:992px){

    .wrapper{
      grid-template-columns:1fr;
    }

    .side-panel{
      min-height:170px;
    }

    .left{
      order:2;
    }

    .center-card{
      order:1;
    }

    .right{
      order:3;
    }

    .side-panel h3{
      max-width:none;
      font-size:26px;
    }

    .circle-btn{
      position:static;
      margin:0 25px;
    }

    .left,
    .right{
      display:flex;
      justify-content:center;
      gap:30px;
      flex-direction:row;
    }

    .image-wrapper{
      height:400px;
    }

  }

  @media(max-width:768px){

    .timeless-section{
      padding:60px 0;
    }

    .wrapper{
      width:95%;
      gap:18px;
    }

    .image-wrapper{
      height:280px;
    }

    .content{
      padding:30px 22px;
    }

    .content h2{
      font-size:30px;
    }

    .content p{
      font-size:16px;
    }

    .side-panel h3{
      font-size:20px;
    }

    .circle-btn{
      width:50px;
      height:50px;
    }

  }
      `}</style>
    </>
  );
}