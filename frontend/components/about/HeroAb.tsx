"use client";

import Link from "next/link";

export default function HeroAb() {
  return (
    <>
      <section
        className="about-hero"
        style={{
          backgroundImage: "url('/abouthero.png')",
        }}
      >
        <div className="about-overlay"></div>

        <div className="about-container">
          <div className="about-content">
            <span className="about-tag">
              WELCOME TO KALYANAM HOTEL & RESORT
            </span>

            <h1 className="about-title">
              Where Every Stay
              <br />
              Becomes a Story
            </h1>

            <p className="about-description">
              Rooted in the timeless hospitality of Rajasthan, Kalyanam Hotel &
              Resort is more than just a destination—it is an experience crafted
              with warmth, elegance, and heartfelt service. From luxurious
              accommodations and memorable celebrations to exceptional dining
              and curated experiences, every moment is thoughtfully designed to
              make your stay truly unforgettable.
            </p>

            <Link href="#our-story" className="about-btn">
              DISCOVER OUR STORY
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero{
          position:relative;
          width:100%;
          height:100vh;
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
          display:flex;
          align-items:center;
          overflow:hidden;
        }

        .about-overlay{
          position:absolute;
          inset:0;
          background:linear-gradient(
            90deg,
            rgba(0,0,0,.70) 0%,
            rgba(0,0,0,.45) 45%,
            rgba(0,0,0,.15) 75%,
            rgba(0,0,0,0) 100%
          );
        }

        .about-container{
          position:relative;
          z-index:2;
          width:100%;
          max-width:1320px;
          margin:0 auto;
          padding:0 80px;
        }

        .about-content{
          max-width:580px;
          color:#fff;
        }

        .about-tag{
          display:inline-block;
          margin-bottom:5px;

          font-family:var(--font-lato);
          font-size:12px;
          font-weight:700;
          letter-spacing:.35em;
          text-transform:uppercase;

          color:#C9A46B;
        }

        .about-title{
          font-family:var(--font-playfair);
          font-size:56px;
          font-weight:400;
          line-height:.95;
          letter-spacing:-1px;
          color:#fff;
        }

        .about-description{
          margin-top:12px;
          max-width:470px;
          font-family:var(--font-lato);
          font-size:15px;
          line-height:1.3;
          color:rgba(255,255,255,.88);
        }

        .about-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          margin-top:30px;
          padding:15px 30px;
          background:#B37A46;
          border:1px solid #B37A46;
          color:#fff;
          text-decoration:none;
          font-family:var(--font-playfair);
          font-size:13px;
          font-weight:600;
          letter-spacing:.16em;
          text-transform:uppercase;
          transition:all .35s ease;
        }

        .about-btn:hover{
          background:transparent;
          color:#fff;
        }

        @media(max-width:1200px){
          .about-container{
            padding:0 60px;
          }
          .about-title{
            font-size:60px;
          }
        }
        
        @media(max-width:992px){

          .about-title{
            font-size:52px;
          }

          .about-description{
            max-width:430px;
          }

        }

        @media(max-width:768px){

          .about-hero{
            height:90vh;
          }

          .about-container{
            padding:0 24px;
          }

          .about-content{
            max-width:100%;
          }

          .about-tag{
            font-size:10px;
            letter-spacing:.28em;
          }

          .about-title{
            font-size:40px;
            line-height:1.05;
          }

          .about-description{
            margin-top:20px;
            font-size:14px;
            line-height:1.75;
            max-width:100%;
          }

          .about-btn{
            margin-top:30px;
            padding:13px 22px;
            font-size:12px;
          }

        }
      `}</style>
    </>
  );
}