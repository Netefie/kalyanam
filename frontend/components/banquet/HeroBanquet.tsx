// HeroBanquet.tsx

import React from "react";

const HeroBanquet = () => {
  return (
    <>
      <section className="hero-banquet">
        {/* Background Image */}
        <img
          src="/2.AVIF"
          alt="Banquet Hall"
          className="bg-image"
        />

        {/* Overlay */}
        <div className="overlay"></div>

        {/* Content */}
        <div className="hero-content">
          <div className="line"></div>

          <h1>Banquet Hall</h1>

          <div className="ornament">
            <span></span>
            ✧
            <span></span>
          </div>

          <h2>
            Where Every Celebration
            <br />
            Finds Its Perfect Setting
          </h2>

          <p>
            Our luxurious banquet hall blends elegance with comfort, making it
            the ideal venue for weddings, receptions, engagements, birthdays,
            anniversaries, corporate events and more.
          </p>

          <button>Book a Visit</button>
        </div>
      </section>

      <style>{`
        .hero-banquet {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 80px;
        }

        .bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(20, 15, 10, 0.68) 0%,
    rgba(35, 25, 15, 0.58) 28%,
    rgba(45, 32, 20, 0.42) 40%,
    rgba(40, 28, 18, 0.18) 55%,
    rgba(0, 0, 0, 0.08) 70%
  );
  z-index: 1;
}

        .hero-content {
        margin-top: 30px;
          position: relative;
          z-index: 2;
          max-width: 520px;
        }

        .line {
          width: 120px;
          height: 1px;
          background: #c9a56b;
          margin-bottom: 10px;
        }

        .hero-content h1 {
          font-size: 52px;
          line-height: 1;
          color: #ffffff;
          margin: 0;
          font-weight: 400;
          font-family: 'Georgia', serif;
        }

        .ornament {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #c9a56b;
          margin: 10px 0 34px;
          font-size: 14px;
        }

        .ornament span {
          width: 70px;
          height: 1px;
          background: #d7b47b;
          display: block;
        }

        .hero-content h2 {
          font-size: 38px;
          line-height: 1.2;
          color: #b88645;
          margin: 0 0 28px;
          font-weight: 400;
          font-family: 'Georgia', serif;
        }

        .hero-content p {
          font-size: 14px;
          line-height: 1.4;
          color: #d7bca7;
          margin-bottom: 38px;
          font-family: Arial, sans-serif;
        }

        .hero-content button {
          background: #c08a3e;
          color: white;
          border: none;
          padding: 10px 34px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .hero-content button:hover {
          background: #a9742f;
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .hero-content h1 {
            font-size: 64px;
          }

          .hero-content h2 {
            font-size: 42px;
          }

          .hero-content p {
            font-size: 18px;
          }
        }

        @media (max-width: 768px) {
          .hero-banquet {
            padding: 50px 24px;
            min-height: auto;
          }

          .hero-content {
            max-width: 100%;
          }

          .hero-content h1 {
            font-size: 48px;
          }

          .hero-content h2 {
            font-size: 32px;
          }

          .hero-content p {
            font-size: 16px;
            line-height: 1.7;
          }

          .hero-content button {
            width: 100%;
            padding: 16px;
            font-size: 16px;
          }

          .ornament span {
            width: 45px;
          }

          .overlay {
            background: linear-gradient(
              to bottom,
              rgba(248, 244, 237, 0.92),
              rgba(248, 244, 237, 0.7)
            );
          }
        }
      `}</style>
    </>
  );
};

export default HeroBanquet;