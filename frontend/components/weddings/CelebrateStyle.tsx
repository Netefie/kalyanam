// CelebrateStyle.tsx

import React from "react";

const cards = [
  {
    image: "/wedding-ceremony.jpg",
    title: "Wedding Ceremonies",
    description: "A perfect canvas for your sacred vows.",
  },
  {
    image: "/grand-reception.jpg",
    title: "Grand Receptions",
    description: "Host lavish receptions under the stars.",
  },
  {
    image: "/pre-wedding.jpg",
    title: "Pre-Wedding Functions",
    description: "From mehendi to sangeet, we've got you covered.",
  },
  {
    image: "/custom-experience.jpg",
    title: "Custom Experiences",
    description: "Tailored setups for your unique celebrations.",
  },
];

const CelebrateStyle = () => {
  return (
    <>
      <section className="celebrate-style">
        <div className="heading">
          <span>CRAFTED FOR MAGICAL MOMENTS</span>
          <h2>Celebrate in Style</h2>
          <div className="diamond"></div>
        </div>

        <div className="cards-grid">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <img src={card.image} alt={card.title} />
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .celebrate-style {
          width: 100%;
          background: #fbf8f3;
          padding: 40px 60px;
          font-family: 'Georgia', serif;
        }

        .heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .heading span {
          display: block;
          font-size: 10px;
          letter-spacing: 2px;
          color: #b28a52;
          margin-bottom: 5px;
          font-family: Arial, sans-serif;
          font-weight: 600;
        }

        .heading h2 {
          font-size: 44px;
          color: #2f2b28;
          margin: 0;
          font-weight: 400;
        }

        .diamond {
          width: 10px;
          height: 10px;
          background: #c8a36a;
          margin: 10px auto 0;
          transform: rotate(45deg);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card {
          background: #fff;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #eee6db;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        .card-content {
          padding: 12px;
        }

        .card-content h3 {
          font-size: 22px;
          color: #2e2a27;
          margin: 0 0 14px;
          font-weight: 400;
          line-height: 1.3;
        }

        .card-content p {
          font-size: 14px;
          line-height: 1.4;
          color: #66615d;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        @media (max-width: 1100px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .celebrate-style {
            padding: 60px 24px;
          }

          .heading h2 {
            font-size: 34px;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .card img {
            height: 240px;
          }
        }
      `}</style>
    </>
  );
};

export default CelebrateStyle;