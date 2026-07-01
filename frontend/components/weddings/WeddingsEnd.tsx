// WeddingsEnd.tsx
import React from "react";

const WeddingsEnd = () => {
  return (
    <>
      <section className="weddings-end">
        <div className="overlay-pattern left"></div>
        <div className="overlay-pattern right"></div>

        <div className="content">
          <div className="text-content">
            <h2>Let&apos;s Create Your Dream Celebration</h2>
            <p>
              Our team is here to make your special day truly unforgettable.
            </p>
          </div>

          <button className="enquire-btn">
            ENQUIRE NOW <span>→</span>
          </button>
        </div>
      </section>

      <style>{`
        .weddings-end {
          position: relative;
          width: 100%;
          background: #f4daae;
          padding: 50px 80px;
          overflow: hidden;
          font-family: 'Georgia', serif;
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          position: relative;
          z-index: 2;
        }

        .text-content h2 {
          font-size: 34px;
          font-weight: 400;
          color: #2d2a26;
          margin: 0 0 10px;
          line-height: 1.2;
        }

        .text-content p {
          font-size: 15px;
          color: #6f6b66;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .enquire-btn {
          background: #b88a4a;
          color: white;
          border: none;
          padding: 16px 34px;
          font-size: 13px;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-family: Arial, sans-serif;
        }

        .enquire-btn:hover {
          background: #a6793e;
          transform: translateY(-2px);
        }

        .enquire-btn span {
          font-size: 16px;
        }

        .overlay-pattern {
          position: absolute;
          width: 220px;
          height: 220px;
          opacity: 0.08;
          background-repeat: no-repeat;
          background-size: contain;
          z-index: 1;
        }

        .overlay-pattern.left {
          left: -40px;
          top: -20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23b88a4a' stroke-width='1'%3E%3Cpath d='M40 100c20-40 60-40 80 0'/%3E%3Cpath d='M70 70c10 20 10 40 0 60'/%3E%3Cpath d='M100 60c15 25 15 55 0 80'/%3E%3C/g%3E%3C/svg%3E");
        }

        .overlay-pattern.right {
          right: -40px;
          bottom: -20px;
          transform: rotate(180deg);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23b88a4a' stroke-width='1'%3E%3Cpath d='M40 100c20-40 60-40 80 0'/%3E%3Cpath d='M70 70c10 20 10 40 0 60'/%3E%3Cpath d='M100 60c15 25 15 55 0 80'/%3E%3C/g%3E%3C/svg%3E");
        }

        @media (max-width: 768px) {
          .weddings-end {
            padding: 40px 24px;
          }

          .content {
            flex-direction: column;
            align-items: flex-start;
          }

          .text-content h2 {
            font-size: 28px;
          }

          .enquire-btn {
            padding: 14px 28px;
          }
        }
      `}</style>
    </>
  );
};

export default WeddingsEnd;