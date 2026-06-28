"use client";

import Image from "next/image";
import Link from "next/link";

export default function Celebration() {
  return (
    <>
      <section className="celebration-section">
        <div className="celebration-container">

          {/* Logo */}

          <div className="logo-wrapper">
            <Image
              src="/logo.png"
              alt="Kalyanam"
              width={105}
              height={105}
            />
          </div>

          {/* Heading */}

          <h2 className="celebration-heading">
            WHERE EVERY CELEBRATION BECOMES A TIMELESS MEMORY
          </h2>

          {/* Description */}

          <p className="celebration-description">
            At Kalyanam Hotel & Resort, every celebration is transformed into
            an unforgettable experience. From grand weddings and elegant
            receptions to engagement ceremonies and family gatherings, our
            thoughtfully designed venues provide the perfect setting for every
            occasion. Surrounded by warm hospitality, luxurious accommodations,
            and beautifully curated event spaces, your special moments deserve
            nothing less than perfection. Whether you're planning an intimate
            celebration or a large-scale wedding, our team ensures every detail
            is executed flawlessly. With spacious banquet facilities,
            personalized event planning, premium guest experiences, and
            exceptional service, Kalyanam creates celebrations that become
            lifelong memories. Let your story begin with us.
          </p>

          {/* Button */}

          <Link href="/weddings" className="explore-btn">
  <span>EXPLORE MORE</span>
  <span className="arrow">→</span>
</Link>

        </div>
      </section>

      <style >{`
        .celebration-section {
          background: #fcf7f1;
          padding: 30px 20px;
        }

        .celebration-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
}

        .celebration-heading {
          font-family: var(--font-playfair);
          font-size: 36px;
          font-weight: 500;
          line-height: 1.18;
          color: #764d2c;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .celebration-description {
          max-width: 1120px;
          margin: 0 auto;
          font-family: var(--font-lato);
          font-size: 14px;
          line-height: 1.7;
          color: #777171;
        }

 .explore-btn {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
 border-radius: 6px;
  padding: 10px 22px;

  background: #9D6D45;
  color: #fff;

  text-decoration: none;

  font-family: var(--font-playfair);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  border: 1px solid #9D6D45;

  transition: all .35s ease;
}

.explore-btn:hover {
  background: transparent;
  color: #9D6D45;
}

.arrow {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  transition: transform .35s ease;
}

.explore-btn:hover .arrow {
  transform: translateX(6px);
  color: #9D6D45;
  
}

        @media (max-width:1024px){

          .celebration-heading{
            font-size:42px;
          }

          .celebration-description{
            font-size:16px;
            line-height:1.9;
          }

          .explore-btn{
            font-size:18px;
            padding:16px 30px;
          }

        }

        @media (max-width:768px){

          .celebration-section{
            padding:70px 20px;
          }

          .celebration-heading{
            font-size:30px;
          }

          .celebration-description{
            font-size:15px;
            line-height:1.8;
          }

          .explore-btn{
            font-size:16px;
            padding:15px 28px;
          }

          .arrow{
            font-size:20px;
          }

        }
      `}</style>
    </>
  );
}