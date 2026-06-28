"use client";
import Image from "next/image";

export default function Experience() {
  return (
    <>
      <section className="experience-section">
        <div className="experience-container">

          {/* LEFT CONTENT */}

          <div className="experience-content">

            <div className="experience-heading">

              <Image
                src="/icon1.png"
                alt="Experience Comfort"
                width={26}
                height={26}
              />

              <span className="experience-subtitle">
                EXPERIENCE COMFORT
              </span>

            </div>

            <h2 className="experience-title">
              Luxury Stays
              <br />
              Crafted For Every Journey
            </h2>

            <div className="experience-description">

              <p>
                Whether you're visiting Sikar for business, family
                celebrations, spiritual tourism, or destination weddings,
                Kalyanam Hotel & Resort offers thoughtfully designed
                accommodations that combine modern comfort with warm
                Rajasthani hospitality.
              </p>

              <p>
                Strategically located near the Jaipur–Bikaner Highway and
                close to the cultural landmarks of Shekhawati, our rooms
                are designed to provide a relaxing retreat after a day of
                travel, celebrations, or exploration. Guests enjoy
                spacious interiors, air-conditioned comfort,
                complimentary Wi-Fi, in-room dining, and attentive
                hospitality that ensures a seamless stay experience.
              </p>

              <p>
                From elegant Deluxe Rooms for business and leisure
                travelers to expansive Luxury Rooms designed for families
                and wedding guests, every stay is complemented by modern
                amenities, fine dining experiences, ample parking,
                banquet facilities, and personalized service.
              </p>

              <p>
                At Kalyanam, every room is more than accommodation—it is
                a space where comfort, convenience, and memorable
                hospitality come together.
              </p>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="experience-image-wrapper">

            <div className="experience-image">

              <Image
                src="/icon2.jpg"
                alt="Luxury Stay"
                fill
              />

            </div>

          </div>

        </div>
      </section>

      <style >{`
        .experience-section {
  background: #FCF7F1;
  padding: 2rem 0rem 1rem 0rem;
}

.experience-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 45% 55%;
  gap: 2rem;
  align-items: center;
}

.experience-content {
  width: 100%;
}

.experience-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.experience-subtitle {
  font-family: var(--font-playfair);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a06e47;
}

.experience-title {
  margin: 0 0 1rem;
  font-family: var(--font-playfair);
  font-size: 42px;
  line-height: 1.18;
  font-weight: 400;
  color: #000;
}

.experience-description {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-description p {
  margin: 0;
  font-family: var(--font-lato);
  font-size: 14px;
  line-height: 1.7;
  color: #6e6e6e;
}

.experience-image-wrapper {
  width: 100%;
  
}

.experience-image {
  position: relative;
  width: 100%;
  height: 620px;
  overflow: hidden;
  border-radius: 12px;
}

.experience-image :global(img) {
  object-fit: cover;
    object-position: 65% center;
}

/* Tablet */
/* =========================
   TABLET
========================= */

@media (max-width: 1024px) {

  .experience-section {
    padding: 3rem 0;
  }

  .experience-container {
    width: 90%;
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .experience-content,
  .experience-image-wrapper {
    width: 100%;
  }

  .experience-heading {
    margin-bottom: 0.8rem;
  }

  .experience-title {
    font-size: 38px;
    line-height: 1.2;
  }

  .experience-description p {
    font-size: 15px;
    line-height: 1.8;
  }

  .experience-image {
    height: 500px;
  }
}

/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

  .experience-section {
    padding: 2.5rem 0;
  }

  .experience-container {
    width: 92%;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .experience-content,
  .experience-image-wrapper {
    width: 100%;
  }

  .experience-heading {
    gap: 10px;
    margin-bottom: 0.8rem;
  }

  .experience-subtitle {
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  .experience-title {
    font-size: 30px;
    line-height: 1.2;
  }

  .experience-description {
    gap: 0.8rem;
  }

  .experience-description p {
    font-size: 14px;
    line-height: 1.7;
  }

  .experience-image {
    height: 360px;
  }
}

/* =========================
   SMALL MOBILE
========================= */

@media (max-width: 480px) {

  .experience-container {
    width: 94%;
    gap: 1.5rem;
  }

  .experience-title {
    font-size: 26px;
  }

  .experience-subtitle {
    font-size: 11px;
  }

  .experience-description p {
    font-size: 13px;
    line-height: 1.6;
  }

  .experience-image {
    height: 280px;
    border-radius: 10px;
  }
}
      `}</style>
    </>
  );
}