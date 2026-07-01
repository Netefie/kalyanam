"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const moments = [
  {
    id: 1,
    image: "/moment-1.jpg",
  },
  {
    id: 2,
    image: "/moment-2.jpg",
  },
  {
    id: 3,
    image: "/moment-3.jpg",
  },
  {
    id: 4,
    image: "/moment-4.jpg",
  },
];

export default function MomentsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? moments.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      prev === moments.length - 1 ? 0 : prev + 1
    );
  };

  const leftMain =
    moments[
      (current - 1 + moments.length) % moments.length
    ];

  const leftSmall =
    moments[
      (current - 2 + moments.length) % moments.length
    ];

  const rightMain =
    moments[
      (current + 1) % moments.length
    ];

  const rightSmall =
    moments[
      (current + 2) % moments.length
    ];

  return (
    <>
      <section className="moments-section">

        <div className="moments-wrapper">

          {/* LEFT SMALL */}

          <div className="small-card left-small">

            <Image
              src={leftSmall.image}
              alt=""
              fill
              className="moment-image"
            />

          </div>

          {/* LEFT LARGE */}

          <div className="large-card left-large">

            <Image
              src={leftMain.image}
              alt=""
              fill
              className="moment-image"
            />

          </div>

          {/* CENTER CONTENT */}

          <div className="center-content">

            <h2>
              Moments at
            </h2>

            <h1>
              Kalyanam
            </h1>

            <div className="divider">

              <span />

              <Image
                src="/icon1.png"
                alt="icon"
                width={18}
                height={18}
              />

              <span />

            </div>

            <h4>
              WHERE EVERY CELEBRATION
              BECOMES A TIMELESS MEMORY.
            </h4>

            <p>
              A collection of unforgettable experiences—
              from grand weddings and rooftop dining to
              luxurious stays, joyful family gatherings and
              intimate celebrations. Every corner of
              Kalyanam is designed to create memories that
              last forever.
            </p>

            <Link
              href="/gallery"
              className="know-more"
            >
              KNOW MORE →
            </Link>

            <div className="navigation">

              <button onClick={prev}>
                <ArrowLeft size={22} />
              </button>

              <button onClick={next}>
                <ArrowRight size={22} />
              </button>

            </div>

          </div>

          {/* RIGHT LARGE */}

          <div className="large-card right-large">

            <Image
              src={rightMain.image}
              alt=""
              fill
              className="moment-image"
            />

          </div>

          {/* RIGHT SMALL */}

          <div className="small-card right-small">

            <Image
              src={rightSmall.image}
              alt=""
              fill
              className="moment-image"
            />

          </div>

        </div>
      </section>

      <style>{`
.moments-section{
  background:#FCF7F1;
  padding:50px 0;
  overflow:hidden;
}

.moments-wrapper{
  width:100%;
  max-width:1700px;
  margin:0 auto;

  display:grid;
  grid-template-columns:140px 340px 1fr 340px 140px;
  align-items:center;
  gap:34px;
}

/* ===========================
      IMAGE CARDS
=========================== */

.large-card,
.small-card{
  position:relative;
  overflow:hidden;
  border-radius:14px;
  transition:.45s ease;
}

.large-card{
  height:510px;
}

.small-card{
  height:430px;
  opacity:.35;
  filter:blur(2px);
}

.moment-image{
  object-fit:cover;
  transition:transform .6s ease;
}

.large-card:hover .moment-image{
  transform:scale(1.05);
}

/* ===========================
      CENTER
=========================== */

.center-content{
  text-align:center;
  max-width:560px;
  margin:auto;
}

.center-content h2{
  margin:0;

  font-family:"Cormorant Garamond",serif;
  font-size:72px;
  font-weight:400;
  color:#734827;
  line-height:1;
}

.center-content h1{
  margin:0;

  font-family:"Great Vibes",cursive;
  font-size:95px;
  font-weight:400;
  color:#C28B4A;
  line-height:.95;
}

.divider{
  margin:30px auto 24px;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:18px;
}

.divider span{
  width:145px;
  height:1px;
  background:#d9c7b1;
}

.center-content h4{
  margin:0 0 18px;

  font-size:16px;
  font-weight:500;
  letter-spacing:.12em;
  color:#C18A49;
}

.center-content p{
  margin:auto;

  max-width:470px;

  color:#888;

  font-size:18px;
  line-height:1.8;
}

.know-more{
  display:inline-block;

  margin-top:26px;

  color:#8C5A30;

  text-decoration:none;

  font-family:"Cormorant Garamond",serif;

  font-size:22px;

  transition:.3s;
}

.know-more:hover{
  letter-spacing:1px;
}

/* ===========================
      BUTTONS
=========================== */

.navigation{
  display:flex;
  justify-content:center;
  gap:18px;
  margin-top:34px;
}

.navigation button{
  width:52px;
  height:52px;

  border-radius:50%;

  background:transparent;

  border:1px solid #C18A49;

  color:#C18A49;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  transition:.35s;
}

.navigation button:hover{
  background:#C18A49;
  color:#fff;
}

/* ===========================
      RESPONSIVE
=========================== */

@media(max-width:1400px){

  .moments-wrapper{
    grid-template-columns:90px 260px 1fr 260px 90px;
    gap:24px;
  }

  .large-card{
    height:430px;
  }

  .small-card{
    height:360px;
  }

  .center-content h2{
    font-size:58px;
  }

  .center-content h1{
    font-size:82px;
  }

}

@media(max-width:1100px){

  .moments-wrapper{
    grid-template-columns:1fr;
  }

  .left-small,
  .right-small{
    display:none;
  }

  .left-large,
  .right-large{
    display:none;
  }

  .center-content{
    max-width:95%;
  }

  .center-content h2{
    font-size:48px;
  }

  .center-content h1{
    font-size:72px;
  }

  .center-content p{
    font-size:16px;
  }

}

@media(max-width:768px){

  .moments-section{
    padding:60px 0;
  }

  .center-content h2{
    font-size:40px;
  }

  .center-content h1{
    font-size:58px;
  }

  .divider span{
    width:70px;
  }

  .center-content h4{
    font-size:13px;
  }

  .center-content p{
    font-size:15px;
    line-height:1.8;
  }

  .navigation button{
    width:46px;
    height:46px;
  }

  .know-more{
    font-size:18px;
  }

}
`}</style>

    </>
  );
}