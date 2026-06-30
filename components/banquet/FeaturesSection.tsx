// FeaturesSection.tsx

import React from "react";
import {
  Sofa,
  Sparkles,
  UtensilsCrossed,
  CarFront,
  AirVent,
  Speaker,
} from "lucide-react";

const features = [
  {
    icon: <Sofa size={28} />,
    title: "Spacious Hall",
    desc: "Large and flexible space for any size of event",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Elegant Interiors",
    desc: "Sophisticated design that adds a touch of class",
  },
  {
    icon: <UtensilsCrossed size={28} />,
    title: "Catering Options",
    desc: "Delicious multi-cuisine food to delight every guest",
  },
  {
    icon: <CarFront size={28} />,
    title: "Ample Parking",
    desc: "Hassle-free and secure parking space",
  },
  {
    icon: <AirVent size={28} />,
    title: "Air Conditioned",
    desc: "Comfortable ambiance all year round",
  },
  {
    icon: <Speaker size={28} />,
    title: "Sound System",
    desc: "High-quality audio for a memorable experience",
  },
];

const FeaturesSection = () => {
  return (
    <>
      <section className="features-section">
        {/* Heading */}
        <div className="section-heading">
          <h2>Everything You Need for a Perfect Celebration</h2>

          <div className="heading-divider">
            <span></span>
            ✦
            <span></span>
          </div>
        </div>

        {/* Features */}
        <div className="features-wrapper">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="icon-wrap">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .features-section {
          width: 100%;
          background: #fff;
          padding: 50px 20px 40px;
        }

        /* Heading */

        .section-heading {
          text-align: center;
          margin-bottom: 34px;
        }

        .section-heading h2 {
          font-size: 34px;
          color: #433126;
          margin: 0;
          font-weight: 500;
          font-family: 'Georgia', serif;
          line-height: 1.3;
        }

        .heading-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 14px;
          color: #c19557;
          font-size: 12px;
        }

        .heading-divider span {
          width: 65px;
          height: 1px;
          background: #e3cfb2;
        }

        /* Features */

        .features-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          border-top: 1px solid #f0e4d5;
          border-bottom: 1px solid #f0e4d5;
        }

        .feature-card {
          text-align: center;
          padding: 28px 18px;
          border-right: 1px solid #f0e4d5;
          transition: all 0.3s ease;
        }

        .feature-card:last-child {
          border-right: none;
        }

        .feature-card:hover {
          background: #fcf8f3;
        }

        .icon-wrap {
          width: 58px;
          height: 58px;
          border: 1px solid #d9b27a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          color: #b9833b;
        }

        .feature-card h3 {
          font-size: 17px;
          font-weight: 500;
          color: #3f2d1f;
          margin: 0 0 10px;
          font-family: 'Georgia', serif;
        }

        .feature-card p {
          font-size: 14px;
          line-height: 1.7;
          color: #666;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        @media (max-width: 1200px) {
          .features-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }

          .feature-card:nth-child(3) {
            border-right: none;
          }
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 40px 14px 30px;
          }

          .section-heading h2 {
            font-size: 26px;
          }

          .heading-divider span {
            width: 45px;
          }

          .features-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-card {
            padding: 22px 14px;
          }

          .feature-card:nth-child(even) {
            border-right: none;
          }

          .icon-wrap {
            width: 50px;
            height: 50px;
          }

          .feature-card h3 {
            font-size: 15px;
          }

          .feature-card p {
            font-size: 13px;
          }
        }

        @media (max-width: 520px) {
          .features-wrapper {
            grid-template-columns: 1fr;
          }

          .feature-card {
            border-right: none;
            border-bottom: 1px solid #f0e4d5;
          }

          .feature-card:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturesSection;