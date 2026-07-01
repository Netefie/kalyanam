"use client";

import Link from "next/link";

export default function RoomsSection() {
  return (
    <>
    <section className="rooms-section">
      <div className="rooms-wrapper">

        {/* LEFT SIDE */}

        <div className="rooms-left">

          <div className="room-card">

            <div className="room-image">
              <img
                src="/deluxe-room.jpg"
                alt="Deluxe Room"
              />
            </div>

            <div className="room-content">
  <h3>Deluxe Room</h3>
  <p>Elegant comfort for a relaxing stay.</p>
</div>  

            <Link href="/rooms/deluxe" className="room-btn">
              View Details →
            </Link>

          </div>

          <div className="room-card">

            <div className="room-image">
              <img
                src="/super-deluxe-room.jpg"
                alt="Super Deluxe Room"
              />
            </div>

        <div className="room-content">
  <h3>Super Deluxe Room</h3>
  <p>Luxury interiors with premium comfort.</p>
</div>

            <Link href="/rooms/super-deluxe" className="room-btn">
              View Details →
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="rooms-right">

          <div className="right-image">
            <img
              src="/room-banner.png"
              alt="Luxury Stay"
            />
          </div>

          <div className="right-image">
            <img
              src="/palace-icon.jpg"
              alt="Luxury Room"
            />
          </div>

        </div>

      </div>

      {/* CSS WILL COME IN PART 2 */}
    </section>

 <style >{`
  .rooms-section {
    width: 100%;
    padding: 0;
    background: #fcf7f1;
  }

 .rooms-wrapper {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 45% 55%;
  gap: 32px;
  align-items: start;
}

  /* =========================
      LEFT SIDE
  ========================= */

  .rooms-left {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }

.room-card {
  margin-top: 16px;
  background: #fcf8f4;
  border: 1px solid #d7c0a1;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  min-height: 340px;
  height: auto;
}

.room-image {
  padding: 6px;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  flex-shrink: 0;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}
.room-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 16px 18px;
}
.room-content h3 {
  margin: 0px;
  font-size: 24px;
  color: #4f2f16;
}

  .room-content p {
    margin-top: 0px;
    color: #8a7157;
    font-size: 12px;
    line-height: 1.4;
    max-width: 180px;
    font-family: "Poppins", sans-serif;
  }

.room-btn {
  margin-top: auto;

  width: 100%;
  min-height: 48px;

  background: #8b5a30;
  color: #fff;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-family: "Cormorant Garamond", serif;
  font-weight: 500;
}
  .room-btn:hover {
    background: #8b5a30;
    color: #fff;
  }

  /* =========================
      RIGHT SIDE
  ========================= */

  .rooms-right {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .right-image {
    overflow: hidden;
    border-radius: 8px;
  }

  .right-image:first-child {
    height: 150px;
  }

  .right-image:first-child img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
}

.right-image:last-child {
    height: 200px;   /* Change this value */
}

.right-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

  /* =========================
      RESPONSIVE
  ========================= */

 @media (max-width: 1024px) {
  .rooms-wrapper {
    width: 92%;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .rooms-left {
    grid-template-columns: repeat(2, 1fr);
  }

  .rooms-right {
    gap: 16px;
  }

  .right-image:first-child {
    height: 220px;
  }

  .right-image:last-child {
    height: 280px;
  }
}

@media (max-width: 768px) {
  .rooms-section {
    padding: 40px 0;
  }

  .rooms-wrapper {
    width: 94%;
    gap: 24px;
  }

  .rooms-left {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .room-content h3 {
    font-size: 22px;
  }

  .room-content p {
    font-size: 13px;
  }

  .room-btn {
    min-height: 50px;
    font-size: 15px;
  }

  .right-image:first-child {
    height: 180px;
  }

  .right-image:last-child {
    height: 220px;
  }
}
`}</style>
</>  
);
}