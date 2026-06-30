"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  {
    value: "45+",
    title: "Signature Dishes",
    desc: "Handcrafted dishes inspired by global flavours and local ingredients.",
  },
  {
    value: "12+",
    title: "Years of Culinary Excellence",
    desc: "Delivering memorable dining experiences with exceptional hospitality.",
  },
  {
    value: "∞",
    title: "Memories Made",
    desc: "Celebrating countless special moments shared over remarkable food.",
  },
];

export default function MenuKaara() {
  return (
    <>
      <section className="menu-kaara">
        <div className="menu-container">

          {/* Left Content */}

          <div className="menu-content">

            <span className="eyebrow">
              ABOUT KAARA
            </span>

            <h2>
              A Culinary Journey
              <br />
              Like No Other
            </h2>

            <p>
              At Kaara, every dish tells a story crafted with the finest
              ingredients, timeless techniques, and heartfelt hospitality.
              Every visit is designed to become an unforgettable dining
              experience.
            </p>

            <Link
              href="/restaurant/menu"
              className="menu-btn"
            >
              Explore Our Menu

              <ArrowRight
                size={18}
                strokeWidth={2}
              />
            </Link>

          </div>

          {/* Image */}

          <div className="menu-image">

            <Image
              src="/menu-dish.png"
              alt="Kaara Signature Dish"
              width={550}
              height={550}
              priority
            />

          </div>

          {/* Stats */}

          <div className="menu-stats">

            {stats.map((item) => (

              <div
                key={item.title}
                className="stat-card"
              >

                <h3>
                  {item.value}
                </h3>

                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>

      <style >{`
     .menu-kaara {
  padding: 80px 0;
  background: #fbf8f4;
  overflow: hidden;
}

.menu-container {
  width: min(1450px, 94%);
  margin: 0 auto;

  display: grid;

  grid-template-columns: 1.3fr 1fr 0.7fr;

  align-items: center;

  gap: 10px;
}

/* =========================
   LEFT
========================= */

.menu-content {
  grid-column: 1 ;

  position: relative;
  z-index: 2;

  max-width: 520px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;

  color: #b78b4d;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
}

.menu-content h2 {
  margin: 0;

  font-family: "Cormorant Garamond", serif;

  font-size: clamp(38px, 3vw, 56px);

  line-height: 1.15;

  font-weight: 500;

  color: #17304b;
}

.menu-content p {
  margin: 18px 0 35px;

  max-width: 420px;

  color: #666;

  font-size: 15px;

  line-height: 1.8;
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  padding: 16px 32px;

  border: 1px solid #c49a62;

  color: #b78943;

  text-decoration: none;

  text-transform: uppercase;

  letter-spacing: 2px;

  font-size: 13px;

  font-weight: 600;

  transition: .3s;
}

.menu-btn:hover {
  background: #b78943;
  color: white;
}

.menu-btn svg {
  transition: .3s;
}

.menu-btn:hover svg {
  transform: translateX(5px);
}

/* =========================
   IMAGE
========================= */

.menu-image {
  grid-column: 2;
  margin-left:-90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-image img {
  width: 100%;
  max-width: 430px;

  height: auto;

  object-fit: contain;

  transition: .4s;
}



/* =========================
   RIGHT
========================= */

.menu-stats {
  grid-column: 3;

  display: flex;
  flex-direction: column;

  gap: 28px;
}

.stat-card {
  border-left: 2px solid #d9c6a8;

  padding-left: 16px;
}

.stat-card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", serif;

  font-size: 34px;

  line-height: 1;

  color: #b78943;
}

.stat-card h4 {
  margin: 8px 0;

  font-size: 15px;

  color: #17304b;

  font-weight: 600;
}

.stat-card p {
  margin: 0;

  color: #777;

  font-size: 13px;

  line-height: 1.6;
}

/* =========================
   TABLET
========================= */

@media (max-width:1024px){

.menu-container{

grid-template-columns:1fr;

row-gap:50px;

}

.menu-content{

grid-column:auto;

max-width:650px;

margin:auto;

text-align:center;

}

.menu-content p{

margin-inline:auto;

}

.menu-btn{

margin:auto;

}

.menu-image{

grid-column:auto;

}

.menu-image img{

max-width:420px;

}

.menu-stats{

grid-column:auto;

display:grid;

grid-template-columns:repeat(3,1fr);

gap:24px;

width:100%;

}

.stat-card{

border-left:none;

border-top:2px solid #d9c6a8;

padding-left:0;

padding-top:16px;

text-align:center;

}

}

/* =========================
   MOBILE
========================= */

@media (max-width:768px){

.menu-kaara{

padding:60px 0;

}

.menu-container{

width:92%;

row-gap:40px;

}

.menu-content h2{

font-size:40px;

}

.menu-content p{

font-size:15px;

}

.menu-image img{
margin-left:90px;
max-width:320px;

}

.menu-stats{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:16px;

}

.stat-card h3{

font-size:28px;

}

.stat-card h4{

font-size:14px;

}

.stat-card p{

font-size:12px;

line-height:1.5;

}

}

/* =========================
   SMALL MOBILE
========================= */

@media (max-width:480px){

.menu-content h2{

font-size:32px;

}

.menu-content p{

font-size:14px;

}

.menu-btn{

width:100%;

justify-content:center;

}

.menu-image img{

max-width:250px;

}

.menu-stats{

grid-template-columns:repeat(3,1fr);

gap:10px;

}

.stat-card{

padding-top:12px;

}

.stat-card h3{

font-size:24px;

}

.stat-card h4{

font-size:13px;

}

.stat-card p{

display:none;

}

}

      `}</style>
    </>
  );
}