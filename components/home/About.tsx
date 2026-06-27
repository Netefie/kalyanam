"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      <section className="about-section">
        <div className="about-container">
          <div className="about-grid">

            {/* LEFT IMAGE */}

            <div className="about-image-wrapper">
              <div className="about-image">
                <Image
                  src="/about.webp"
                  alt="Kalyanam Hotel"
                  fill
                  priority
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}

            <div className="about-content">

              <p className="about-subtitle">
                EXPERIENCE THE SOUL OF SHEKHAWATI
              </p>

              <h2 className="about-title">
                Curating Memorable Celebrations
                <br />
                <span>With Kalyanam Hotel & Resort</span>
              </h2>

              <p className="about-description">
                At Kalyanam, hospitality is more than a service—it is a
                tradition. From destination weddings and family
                celebrations to comfortable stays and fine dining
                experiences, every moment is crafted with care.
                Located in Sikar, the gateway to Shekhawati's rich
                heritage, Kalyanam brings together elegant
                accommodations, grand banquet spaces, rooftop dining,
                and exceptional event experiences under one roof.
                Whether you are planning a wedding, hosting a corporate
                gathering, or seeking a comfortable stay, our commitment
                remains the same—creating unforgettable experiences
                for every guest.
              </p>

              <h4 className="about-director">
                ARPIT SHARMA | MANAGING DIRECTOR
              </h4>

              <div className="signature-wrapper">
                <Image
                  src="/Signature.png"
                  alt="Signature"
                  width={190}
                  height={95}
                />
              </div>

              <div className="about-link-wrapper">
                <Link href="/about" className="about-link">
  <span className="link-text">
    LEARN MORE ABOUT US
  </span>

  <span className="arrow">→</span>
</Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CSS will come here */}
      <style jsx>{`
      .about-section {
  background: #FCF7F1;
  padding: 3rem 0;
}

.about-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 4rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 5rem;
  align-items: center;
}

.about-image-wrapper {
  width: 100%;
}

.about-image {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
}

.about-image :global(img) {
  object-fit: cover;
}

.about-content {
  display: flex;
  flex-direction: column;
}

.about-subtitle {
  font-family: var(--font-inter);
  font-size: 12px;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: #9b958b;
  margin-bottom: 0.5rem;
}

.about-title {
  font-family: var(--font-playfair);
  font-size: 38px;
  line-height: 1.08;
  color: #171717;
  font-weight: 400;
  margin-bottom: 0.75rem;
}

.about-title span {
  font-style: italic;
}

.about-description {
  font-family: var(--font-lato);
  font-size: 14px;
  line-height: 1.7;
  color: #656565;
  max-width: 460px;
  margin: 0;
}

.about-director {
  margin-top: 1rem;
  font-family: var(--font-montserrat);
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b6b6b;
}

.signature-wrapper {
  margin-top: 2rem;
}

.about-link-wrapper {
  margin-top: 12px;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #A87749;
  font-family: var(--font-playfair);
  font-size: 15px;
  font-weight: 600;
}

.link-text {
  display: inline-block;
  position: relative;
  color: #A87749;
  padding-bottom: 3px;
}

.link-text::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background: #A87749;

  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}

.about-link:hover .link-text::after {
  transform: scaleX(1);
}

.arrow {
  font-size: 18px;
  font-weight: 700;
  color: #A87749;
  line-height: 1;
  transition: transform .3s ease;
}

.about-link:hover .arrow {
  transform: translateX(5px);
}

/* Tablet */

@media (max-width: 1024px) {
  .about-container {
    padding: 0 2rem;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-image {
    height: 420px;
  }

  .about-description {
    max-width: 100%;
  }

  .about-title {
    font-size: 32px;
  }
}

/* Mobile */

@media (max-width: 768px) {
  .about-section {
    padding: 4rem 0;
  }

  .about-container {
    padding: 0 1.5rem;
  }

  .about-image {
    height: 300px;
  }

  .about-subtitle {
    font-size: 11px;
  }

  .about-title {
    font-size: 28px;
  }

  .about-description {
    font-size: 14px;
    line-height: 1.8;
  }

  .about-director {
    font-size: 13px;
  }

  .signature-wrapper img {
    width: 150px;
    height: auto;
  }

  .about-link {
    font-size: 15px;
  }
}
      `}</style>
    </>
  );
}