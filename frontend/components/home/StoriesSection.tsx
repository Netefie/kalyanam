"use client";

import Image from "next/image";

const stories = [
  {
    id: 1,
    image: "/story-1.png",
    subtitle: "A Celebration Beneath the Evening Sky",
    title: "An unforgettable wedding where tradition met timeless elegance.",
    description: "As the sun dipped below the horizon, vows were exchanged beneath a canopy of flowers, surrounded by family, friends, and thousands of glowing lights. Every detail—from the décor to the dining experience—was thoughtfully curated, creating an evening that will be cherished for generations.",    
    footer: "Wedding • 320 Guests",
  },
  {
    id: 2,
    image: "/story-2.png",
    subtitle: "Moments Wrapped In Luxury",
    title: "Where every celebration became a cherished memory.",
    description:
      "A rooftop anniversary crafted with breathtaking views and heartfelt moments. Under a sky painted in shades of gold, a private candlelit dinner transformed into an unforgettable celebration of love. Fine cuisine and panoramic city views created the perfect setting for an extraordinary evening.",
    footer: "Reception • 250 Guests",
  },
  {
    id: 3,
    image: "/story-3.png",
    subtitle: "Dining Under The Stars",
    title: "An evening filled with conversations and fine cuisine.",
    description:
      "A family getaway filled with comfort, celebration, and togetherness. From luxurious accommodations to joyful dining experiences, every corner of Kalyanam became a gathering place where stories were shared, milestones were celebrated, and memories were created across three generations.",
    footer: "Dinner • Rooftop Experience",
  },
];

export default function StoriesSection() {
  return (
    <>
      <section className="stories-section">

        <div className="stories-container">

          {/* Heading */}

 {/* Heading */}

<div className="stories-heading">

  <div className="stories-icon">
    <Image
      src="/stories-logo.png"
      alt="Kalyanam"
      width={70}
      height={70}
    />
  </div>

  <h2>कहानियाँ</h2>

  <p>that live forever.</p>

</div>

          {/* Cards */}

          <div className="stories-grid">

            {stories.map((story) => (

              <div
                key={story.id}
                className="story-card"
              >

                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="story-image"
                />

                <div className="story-overlay" />

                <div className="story-content">

                  <span className="story-subtitle">
                    {story.subtitle}
                  </span>

                  <h3 className="story-title">
                    {story.title}
                  </h3>

                  <div className="story-hidden">

                    <p>
                      {story.description}
                    </p>

                    <span>
                      {story.footer}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      <style>{`
      .stories-section{
  background:#FCF7F1;
  padding:30px 0;
}

.stories-container{
  width:90%;
  max-width:1200px;
  margin:0 auto;
}

/* =========================
        HEADING
========================= */

.stories-heading{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  margin-bottom:35px;
}

.stories-icon{
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  margin-bottom:12px;
}

.stories-heading h2{
  margin:0;
  font-family:"Noto Serif Devanagari", serif;
  font-size:62px;
  font-weight:500;
  color:#C49449;
  line-height:1;
}

.stories-heading p{
  margin-top:6px;
  font-family:"Cormorant Garamond", serif;
  font-size:44px;
  color:#6a4325;
}

/* =========================
          GRID
========================= */

.stories-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
}

/* =========================
          CARD
========================= */

.story-card{
  position:relative;
  height:420px;
  overflow:hidden;
  border-radius:8px;
  cursor:pointer;
}

.story-image{
  object-fit:cover;
  transition:transform .7s ease;
}

.story-card:hover .story-image{
  transform:scale(1.08);
}

/* =========================
        OVERLAY
========================= */

.story-overlay{
  position:absolute;
  inset:0;

  background:
  linear-gradient(
      to top,
      rgba(74,40,16,.82) 0%,
      rgba(74,40,16,.55) 45%,
      rgba(0,0,0,.08) 100%
  );

  transition:.45s ease;
}

.story-card:hover .story-overlay{

  background:
  linear-gradient(
      to top,
      rgba(74,40,16,.92),
      rgba(74,40,16,.82)
  );
}

/* =========================
        CONTENT
========================= */

.story-content{
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  padding:20px;
  color:#fff;
  text-align:center;
  display:flex;
  flex-direction:column;
  align-items:center;
}

.story-subtitle{
  font-family:"Cormorant Garamond", serif;
  font-size:14px;
  opacity:.95;

}

.story-title{

  margin-top:20px;

  font-family:"Cormorant Garamond", serif;

  font-size:20px;

  line-height:1.2;

  font-weight:400;

  max-width:280px;

  transition:.45s ease;
}

/* =========================
      HIDDEN CONTENT
========================= */

.story-hidden{
  max-height:0;
  overflow:hidden;

  opacity:0;

  transform:translateY(30px);

  transition:
    max-height .55s ease,
    opacity .45s ease,
    transform .45s ease;

  display:flex;
  flex-direction:column;
  gap:14px;

  margin-top:0;
}

.story-hidden p{
  margin:0;

  font-family:"Lato",sans-serif;

  font-size:16px;

  line-height:1.3;

  color:rgba(255,255,255,.95);
}

.story-hidden span{
  font-family:"Cormorant Garamond",serif;

  font-size:15px;

  letter-spacing:.5px;

  color:#F7D8A8;
}

/* =========================
      HOVER EFFECT
========================= */

.story-card:hover .story-content{
  padding-bottom:34px;
}

.story-card:hover .story-title{
  transform:translateY(-16px);
}

.story-card:hover .story-hidden{

  max-height:220px;

  opacity:1;

  transform:translateY(0);

  margin-top:14px;
}

/* =========================
      RESPONSIVE
========================= */

@media (max-width:1024px){

  .stories-grid{
    grid-template-columns:1fr;
    gap:24px;
  }

  .story-card{
    height:480px;
  }

  .stories-heading h2{
    font-size:52px;
  }

  .stories-heading p{
    font-size:36px;
  }

}

@media (max-width:768px){

  .stories-section{
    padding:60px 0;
  }

  .stories-container{
    width:92%;
  }

  .stories-heading{
    margin-bottom:40px;
  }

  .stories-heading img{
    width:54px;
    height:auto;
  }

  .stories-heading h2{
    font-size:42px;
  }

  .stories-heading p{
    font-size:30px;
  }

  .story-card{
    height:420px;
  }

  .story-content{
    padding:22px;
  }

  .story-subtitle{
    font-size:13px;
  }

  .story-title{
    font-size:28px;
    line-height:1.25;
  }

  .story-hidden p{
    font-size:15px;
  }

  .story-hidden span{
    font-size:16px;
  }

}

/* =========================
      SMALL MOBILE
========================= */

@media (max-width:480px){

  .story-card{
    height:380px;
  }

  .stories-heading h2{
    font-size:36px;
  }

  .stories-heading p{
    font-size:26px;
  }

  .story-title{
    font-size:22px;
  }

  .story-hidden p{
    font-size:14px;
  }

}
`}</style>
    </>
  );
}