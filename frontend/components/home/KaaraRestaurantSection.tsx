"use client";

import Image from "next/image";
import Link from "next/link";

const features = [
  {
    image: "/rooftop-icon.png",
    title: "Open-Air Rooftop Dining",
    description:
      "Enjoy breathtaking sunsets and refreshing evening breezes in an elegant rooftop setting.",
  },
  {
    image: "/cuisine-icon.png",
    title: "Multi Cuisine Experience",
    description:
      "Delight in Indian, Chinese, Continental, snacks, desserts and handcrafted beverages.",
  },
  {
    image: "/occasion-icon.png",
    title: "Perfect For Every Occasion",
    description:
      "Romantic dinners, family outings, birthdays, anniversaries, corporate gatherings and celebrations.",
  },
];

export default function KaaraRestaurantSection() {
  return (
    <>
      <section className="kaaraSection">
        <div className="container">

          {/* LEFT IMAGE */}

          <div className="leftSide">
            <Image
              src="/restaurant-main.png"
              alt="Kaara Rooftop Restaurant"
              fill
              className="leftImage"
            />
          </div>

          {/* RIGHT CONTENT */}

          <div className="rightSide">

            {/* Decorative Palace */}

           <div className="palaceImage">
  <Image
    src="/palace-top.png"
    alt="Palace"
    fill
    style={{ objectFit: "contain" }}
  />
</div>
            {/* Logo */}

            <div className="logoWrapper">
              <Image
                src="/kaara-logo.png"
                alt="Kaara"
                width={260}
                height={90}
              />
            </div>

            {/* Heading */}

            <h2 className="heading">
              Rooftop Restaurant
            </h2>

            <p className="subHeading">
              Elevated Dining • Unforgettable Evenings
            </p>

            {/* Divider */}

            <div className="divider">

              <span className="line" />

              <Image
                src="/icon1.png"
                alt=""
                width={24}
                height={24}
              />

              <span className="line" />

            </div>

            {/* Description */}

            <p className="description">
              Perched atop Kalyanam Hotel & Resort, Kaara is more than
              just a restaurant—it's a destination where exceptional
              cuisine meets breathtaking rooftop views.
              Whether you're planning a romantic dinner, celebrating
              with family, or enjoying a relaxed evening with friends,
              every visit is thoughtfully designed to become a lasting
              memory.
            </p>

            {/* Feature Cards */}

            <div className="cardsGrid">

              {features.map((item, index) => (

                <div
                  key={index}
                  className="card"
                >

                  <div className="cardIcon">

                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                    />

                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>

              ))}

            </div>

            {/* CTA */}

            <Link
              href="/restaurant"
              className="exploreButton"
            >
              Explore More
              <span>→</span>
            </Link>

          </div>

        </div>

        {/* Bottom Banner */}

<div className="bottomBanner">
    <Image
        src="/bottom-banner.png"
        alt="Bottom Banner"
        fill
        className="bottomBannerImage"
    />
</div>

      </section>

      <style >{`

/* ===========================
   SECTION
=========================== */

.kaaraSection {
  width: 100%;
  background: #fbf7f1;
  padding: 50px 0;
}

.container {
  width: min(1320px, 92%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 470px 1fr;
  gap: 70px;
  align-items: center;
}

/* ===========================
   LEFT IMAGE
=========================== */

.leftSide {
  position: relative;
  height: 660px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
}

.leftImage {
  object-fit: cover;
  transition: 0.6s ease;
}

.leftSide:hover .leftImage {
  transform: scale(1.04);
}

/* ===========================
   RIGHT CONTENT
=========================== */

.rightSide {
  position: relative;
}

.palaceImage {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 220px;
  height: 220px;
  z-index: 1;
}

.logoWrapper {
  display: flex;
  justify-content: center;
}

.heading {
  margin-top: 0px;
  text-align: center;
  font-size: 54px;
  color: #6f4a2d;
  font-weight: 600;
  line-height: 1.1;
  font-family: Georgia, serif;
}

.subHeading {
  margin-top: 4px;
  text-align: center;
  color: #c79c6b;
  font-size: 28px;
  font-style: italic;
  font-family: Georgia, serif;
}

/* ===========================
   DIVIDER
=========================== */

.divider {
  margin: 8px auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.line {
  width: 160px;
  height: 1px;
  background: #c9a472;
}

/* ===========================
   DESCRIPTION
=========================== */

.description {
  max-width: 660px;
  margin: auto;
  text-align: center;
  font-size: 15px;
  line-height: 1.2;
  color: #6d6d6d;
}

/* ===========================
   CARDS
=========================== */

.cardsGrid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card {
  background: white;
  border: 1px solid #e3c39c;
  border-radius: 18px;
  padding: 5px 12px;
  text-align: center;
  transition: .35s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 40px rgba(0,0,0,.12);
}

.cardIcon {
  width: 82px;
  height: 82px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card h3 {
  margin-top: 0px;
  font-size: 24px;
  color: #6b4728;
  line-height: 1.2;
  font-weight: 600;
}

.card p {
  margin-top: 10px;
  font-size: 15px;
  color: #757575;
  line-height: 1.2;
}

/* ===========================
   CTA
=========================== */

.exploreButton {
  width: fit-content;
  margin: 15px auto 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 34px;
  background: #5b3923;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: 600;
  transition: .35s;
}

.exploreButton:hover {
  background: #8b633c;
}

.exploreButton span {
  transition: .3s;
}

.exploreButton:hover span {
  transform: translateX(6px);
}

/* ===========================
   BOTTOM BANNER
=========================== */

.bottomBanner {
  width: min(1320px, 92%);
  margin: 20px auto 0;
  position: relative;
  height: 145px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0,0,0,.18);
}

.bottomBannerImage {
  object-fit: cover;
}

/* ===========================================================
   RESPONSIVE - LARGE LAPTOPS
=========================================================== */

@media (max-width: 1280px) {

  .container {
    grid-template-columns: 430px 1fr;
    gap: 50px;
  }

  .leftSide {
    height: 700px;
  }

  .heading {
    font-size: 48px;
  }

  .subHeading {
    font-size: 24px;
  }

  .cardsGrid {
    gap: 18px;
  }

  .card {
    padding: 28px 22px;
  }

  .bannerContent {
    gap: 60px;
    padding: 0 50px;
  }

  .bannerContent h2 {
    font-size: 60px;
  }

  .bannerContent p {
    font-size: 20px;
  }

}

/* ===========================================================
   TABLET
=========================================================== */

@media (max-width: 1024px) {

  .kaaraSection {
    padding: 70px 0;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .leftSide {
    height: 550px;
    max-width: 700px;
    margin: auto;
  }

  .rightSide {
    width: 100%;
  }

  .palaceImage {
    width: 140px;
    height: auto;
    right: 10px;
    top: -10px;
  }

  .heading {
    font-size: 42px;
  }

  .subHeading {
    font-size: 22px;
  }

  .description {
    font-size: 16px;
  }

  .cardsGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }

  .card:last-child {
    grid-column: span 2;
    max-width: 420px;
    margin: auto;
  }

  .bottomBanner {
    height: 170px;
  }

  .bannerContent {
    flex-direction: column;
    gap: 8px;
    padding: 25px;
  }

  .bannerContent h2 {
    font-size: 52px;
  }

  .bannerContent p {
    font-size: 18px;
  }

}

/* ===========================================================
   MOBILE
=========================================================== */

@media (max-width: 768px) {

  .kaaraSection {
    padding: 55px 0;
  }

  .container {
    width: 92%;
    gap: 35px;
  }

  .leftSide {
    height: 420px;
    border-radius: 20px;
  }

  .logoWrapper img {
    width: 180px !important;
    height: auto !important;
  }

  .palaceImage {
    display: none;
  }

  .heading {
    font-size: 34px;
  }

  .subHeading {
    font-size: 19px;
  }

  .divider {
    gap: 12px;
    margin: 22px auto 28px;
  }

  .line {
    width: 90px;
  }

  .description {
    font-size: 15px;
    line-height: 1.8;
  }

  .cardsGrid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .card:last-child {
    grid-column: auto;
    max-width: 100%;
  }

  .card {
    padding: 28px 22px;
  }

  .card h3 {
    font-size: 22px;
  }

  .card p {
    font-size: 15px;
  }

  .exploreButton {
    width: 100%;
    justify-content: center;
    padding: 16px;
  }

  .bottomBanner {
    height: 200px;
    border-radius: 16px;
  }

  .bannerOverlay {
    padding: 20px;
  }

  .bannerContent {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 0;
  }

  .bannerContent h2 {
    font-size: 44px;
  }

  .bannerContent p {
    font-size: 16px;
    line-height: 1.6;
    max-width: 100%;
  }

}

/* ===========================================================
   SMALL MOBILE
=========================================================== */

@media (max-width: 480px) {

  .kaaraSection {
    padding: 45px 0;
  }

  .leftSide {
    height: 340px;
  }

  .heading {
    font-size: 28px;
  }

  .subHeading {
    font-size: 17px;
  }

  .line {
    width: 55px;
  }

  .description {
    font-size: 14px;
  }

  .card {
    padding: 24px 18px;
  }

  .cardIcon {
    width: 70px;
    height: 70px;
  }

  .cardIcon img {
    width: 46px !important;
    height: 46px !important;
  }

  .card h3 {
    font-size: 20px;
  }

  .card p {
    font-size: 14px;
    line-height: 1.7;
  }

  .bottomBanner {
    height: 180px;
  }

  .bannerContent h2 {
    font-size: 38px;
  }

  .bannerContent p {
    font-size: 15px;
  }

}

/* ===========================================================
   OPTIONAL SMOOTH ANIMATIONS
=========================================================== */

.card,
.leftImage,
.exploreButton,
.bottomBanner {
  transition: all .35s ease;
}

.card:hover {
  transform: translateY(-8px);
}

.bottomBanner:hover .bottomBannerImage {
  transform: scale(1.05);
}

.bottomBannerImage {
  transition: transform .8s ease;
}

.heading,
.subHeading,
.description {
  animation: fadeUp .8s ease;
}

@keyframes fadeUp {

  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }

}
      `}</style>
    </>
  );
}