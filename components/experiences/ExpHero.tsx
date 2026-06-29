"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function ExpHero() {
  return (
    <>
      <section
        className="experience-hero"
        style={{
          backgroundImage: "url('/exphero.png')",
        }}
      >
        <div className="experience-overlay"></div>

        <div className="experience-container">
          <div className="experience-content">
            <span className="experience-tag">
              KALYANAM HOTEL & RESORT
            </span>

            <h1 className="experience-title">
              Curated
              <br />
              Experiences
            </h1>

            <p className="experience-description">
              Discover moments beyond your stay. From intimate rooftop dinners
              and luxurious wedding celebrations to rejuvenating mornings,
              handcrafted hospitality, and unforgettable leisure experiences,
              every corner of Kalyanam is designed to create memories that stay
              with you forever.
            </p>

            <Link href="#experiences" className="experience-btn">
              EXPLORE EXPERIENCES
            </Link>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>SCROLL</span>

          <div className="scroll-circle">
            <ChevronDown size={18} />
          </div>
        </div>
      </section>

      <style>{`
        .experience-hero{
          position:relative;
          width:100%;
          height:100vh;
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
          overflow:hidden;
          display:flex;
          align-items:center;
        }

        .experience-overlay{
          position:absolute;
          inset:0;
          background:linear-gradient(
            90deg,
            rgba(0,0,0,.62) 0%,
            rgba(0,0,0,.42) 38%,
            rgba(0,0,0,.15) 65%,
            rgba(0,0,0,.05) 100%
          );
        }

        .experience-container{
          position:relative;
          z-index:2;
          width:100%;
          max-width:1400px;
          margin:0 auto;
          padding:0 90px;
        }

        .experience-content{
          max-width:650px;
          color:#fff;
        }

        .experience-tag{
          display:inline-block;
          margin-bottom:5px;
          color:#C7A16A;
          font-family:var(--font-lato);
          font-size:14px;
          font-weight:600;
          letter-spacing:.35em;
          text-transform:uppercase;
        }

        .experience-title{
          font-family:var(--font-playfair);
          font-size:62px;
          font-weight:400;
          line-height:.95;
          letter-spacing:-2px;
          color:#fff;
        }

        .experience-description{
          margin-top:20px;
          max-width:520px;
          font-family:var(--font-lato);
          font-size:15px;
          line-height:1.5;
          color:rgba(255,255,255,.88);
        }

        .experience-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;

          margin-top:42px;
          padding:16px 34px;

          border:1px solid #C7A16A;
          background:#C7A16A;

          color:#fff;
          text-decoration:none;

          font-family:var(--font-playfair);
          font-size:13px;
          font-weight:600;
          letter-spacing:.18em;
          text-transform:uppercase;

          transition:.35s;
        }

        .experience-btn:hover{
          background:transparent;
          color:#fff;
        }

        .scroll-indicator{
          position:absolute;
          left:50%;
          bottom:38px;
          transform:translateX(-50%);
          z-index:3;

          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
        }

        .scroll-indicator span{
          font-family:var(--font-lato);
          font-size:11px;
          letter-spacing:.28em;
          color:#fff;
        }

        .scroll-circle{
          width:48px;
          height:48px;
          border-radius:50%;
          border:1px solid rgba(255,255,255,.7);

          display:flex;
          justify-content:center;
          align-items:center;

          color:#fff;

          animation:float 2.2s ease-in-out infinite;
        }

        @keyframes float{

          0%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(8px);
          }

          100%{
            transform:translateY(0px);
          }

        }

        @media(max-width:1024px){

          .experience-container{
            padding:0 55px;
          }

          .experience-title{
            font-size:66px;
          }

          .experience-description{
            max-width:480px;
          }

        }

        @media(max-width:768px){

          .experience-hero{
            height:90vh;
          }

          .experience-container{
            padding:0 24px;
          }

          .experience-content{
            max-width:100%;
          }

          .experience-tag{
            font-size:11px;
            letter-spacing:.25em;
          }

          .experience-title{
            font-size:46px;
            line-height:1;
          }

          .experience-description{
            margin-top:22px;
            font-size:14px;
            line-height:1.75;
          }

          .experience-btn{
            margin-top:30px;
            padding:14px 24px;
            font-size:12px;
          }

          .scroll-indicator{
            bottom:22px;
          }

          .scroll-circle{
            width:42px;
            height:42px;
          }

        }
      `}</style>
    </>
  );
}