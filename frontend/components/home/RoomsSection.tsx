import Link from "next/link";

import type { Room } from "@/lib/api";
import { formatINR } from "@/lib/pricing";
import { roomFromRate, roomPath } from "@/lib/seo";

// Server component. It used to fetch through hooks/useRooms.ts, which meant
// the room names and descriptions — the homepage's most valuable text — only
// existed after hydration and never reached a crawler. The rooms are handed in
// by app/page.tsx, which reads them through the cached server reader instead.
export default function RoomsSection({ rooms }: { rooms: Room[] }) {
  return (
    <>
    <section className="rooms-section">
      <div className="rooms-wrapper">

        {/* LEFT SIDE */}

        <div className="rooms-left">

          {rooms.map((room) => {
            const image = room.image || room.images[0];
            const rate = roomFromRate(room);

            return (
              <div key={room.slug} className="room-card">

                <div className="room-image">
                  {image ? (
                    <img src={image} alt={room.name} loading="lazy" decoding="async" />
                  ) : (
                    <div className="room-image-placeholder" />
                  )}
                </div>

                <div className="room-content">
                  {/* The room name is the link, so the indexed anchor text is
                      "Deluxe Room" rather than "View Details". */}
                  <h3>
                    <Link href={roomPath(room.slug)}>{room.name}</Link>
                  </h3>
                  {room.description && <p>{room.description}</p>}
                  {rate > 0 && (
                    <p className="room-rate">From {formatINR(rate)} / night</p>
                  )}
                </div>

                <Link href={roomPath(room.slug)} className="room-btn">
                  View Details →
                </Link>

              </div>
            );
          })}

          {/* API down or no active rooms — still point at the booking page
              rather than leave an empty column. */}
          {rooms.length === 0 && (
            <div className="room-card room-card-fallback">
              <div className="room-content">
                <h3>Our Rooms</h3>
                <p>See rooms and live availability on the booking page.</p>
              </div>

              <Link href="/accommodations" className="room-btn">
                Explore Rooms →
              </Link>
            </div>
          )}

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
    /* fr, not %: percentages summing to 100 leave no room for the gap, which
     made this grid 32px wider than its container at every width. */
  grid-template-columns: 9fr 11fr;
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

.room-content h3 a {
  color: inherit;
  text-decoration: none;
}

.room-content h3 a:hover {
  color: #a95038;
}

.room-rate {
  margin-top: 6px;
  color: #8b5a30;
  font-size: 13px;
  font-family: "Poppins", sans-serif;
}

  .room-content p {
    margin-top: 0px;
    color: #8a7157;
    font-size: 12px;
    line-height: 1.4;
    max-width: 180px;
    font-family: "Poppins", sans-serif;

    /* Descriptions come from the admin panel and can run long. */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

.room-image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #efe3d3;
}

.room-card-fallback {
  grid-column: 1 / -1;
  min-height: 0;
}

.room-card-fallback .room-content {
  padding: 32px 18px;
}

.room-card-fallback .room-content p {
  max-width: none;
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