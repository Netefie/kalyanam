"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutStory() {
  return (
    <>
      <section className="about-story-section" id="our-story">
        <div className="about-story-container">
          {/* Left Image */}

          <div className="about-story-image">
<Image
  src="/aboutstory.png"
  alt="Kalyanam Hotel & Resort"
  width={520}
  height={650}
  className="story-image"
/>
          </div>

          {/* Right Content */}

          <div className="about-story-content">
            <span className="story-tag">
              OUR STORY
            </span>

            <h2 className="story-heading">
              Crafting Timeless
              <br />
              Experiences,
              <br />
              Inspired by
              <span> Rajasthan.</span>
            </h2>

            <div className="story-divider"></div>

            <p>
              At Kalyanam Hotel & Resort, hospitality is not merely a service —
              it is a tradition deeply rooted in warmth, elegance, and genuine
              care. Inspired by the timeless heritage of Rajasthan, we have
              created a destination where every guest feels welcomed, valued,
              and celebrated.
            </p>

            <p>
              Whether it is a luxurious stay, a dream wedding, a family
              celebration, or an evening overlooking the city from our rooftop,
              every experience is thoughtfully designed with impeccable
              attention to detail, refined comfort, and heartfelt hospitality.
            </p>

            <p>
              Every corner of Kalyanam reflects our commitment to creating
              unforgettable memories that guests cherish long after they leave.
              We don't simply host occasions—we become a part of your most
              meaningful moments.
            </p>

            <Link href="/contact" className="story-btn">
              <span>DISCOVER MORE</span>
              <span className="story-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <style>{`

.about-story-section{
    padding:60px 20px;
    background:#FCF8F2;
}

.about-story-container{
    max-width:1180px;
    margin:0 auto;
    display:grid;
    grid-template-columns:520px 1fr;
    gap:70px;
    align-items:center;
}

.about-story-image{
    position: relative;
    width: 100%;
    height: 480px;   /* Change this */
    overflow: hidden;
}

.story-image{
    width:100%;
    height:auto;
    display:block;
    object-fit:cover;
}

.about-story-image:hover .story-image{
    transform:scale(1.05);
}

.about-story-content{
    max-width:520px;
}

.story-tag{
    display:inline-block;
    margin-bottom:5px;
    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;

    letter-spacing:.35em;
    text-transform:uppercase;

    color:#A77748;
}

.story-heading{
    font-family:var(--font-playfair);

    font-size:40px;
    font-weight:400;

    line-height:1.08;

    color:#3D2E22;
}

.story-heading span{
    color:#B07A47;
}

.story-divider{
    width:70px;
    height:2px;

    background:#B07A47;

    margin:28px 0;
}

.about-story-content p{
    margin-bottom:2px;
    font-family:var(--font-lato);
    font-size:13px;
    line-height:1.4;

    color:#6E645B;
}

.story-btn{
    margin-top:18px;

    display:inline-flex;
    align-items:center;
    gap:14px;

    padding:14px 26px;

    text-decoration:none;

    background:#B07A47;
    border:1px solid #B07A47;

    color:#fff;

    font-family:var(--font-playfair);
    font-size:13px;
    font-weight:600;

    letter-spacing:.14em;
    text-transform:uppercase;

    transition:.35s;
}

.story-btn:hover{
    background:transparent;
    color:#B07A47;
}

.story-arrow{
    transition:.35s;
}

.story-btn:hover .story-arrow{
    transform:translateX(6px);
}

.story-btn:hover .story-arrow{
    transform:translateX(6px);
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .about-story-container{
        max-width:1240px;
        gap:80px;
    }

    .story-heading{
        font-size:50px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:1024px){

    .about-story-section{
        padding:80px 30px;
    }

    .about-story-container{
        grid-template-columns:420px 1fr;
        gap:50px;
    }

    .about-story-content{
        max-width:100%;
    }

    .story-heading{
        font-size:38px;
    }

    .story-divider{
        margin:22px 0;
    }

    .about-story-content p{
        font-size:14px;
        line-height:1.8;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .about-story-section{
        padding:65px 20px;
    }

    .about-story-container{
        grid-template-columns:1fr;
        gap:35px;
    }

    .about-story-image{
        max-width:420px;
        width:100%;
        margin:0 auto;
        aspect-ratio:4/5;
    }

    .about-story-content{
        max-width:100%;
    }

    .story-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .story-heading{
        font-size:32px;
        line-height:1.15;
    }

    .story-divider{
        width:60px;
        margin:20px 0;
    }

    .about-story-content p{
        font-size:14px;
        line-height:1.75;
        margin-bottom:18px;
    }

    .story-btn{
        margin-top:12px;
        padding:12px 22px;
        font-size:12px;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .about-story-section{
        padding:55px 16px;
    }

    .about-story-image{
        max-width:100%;
    }

    .story-heading{
        font-size:28px;
    }

    .about-story-content p{
        font-size:13px;
    }

}
      `}</style>
    </>
  );
}