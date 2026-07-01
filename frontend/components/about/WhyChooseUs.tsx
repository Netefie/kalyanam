"use client";

import {
  BedDouble,
  CalendarHeart,
  UtensilsCrossed,
  CarFront,
  MapPinned,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <BedDouble size={34} strokeWidth={1.6} />,
    title: "Luxury Accommodation",
    value: "30+",
    description:
      "Beautifully designed rooms and suites offering comfort, elegance and premium amenities.",
  },
  {
    icon: <CalendarHeart size={34} strokeWidth={1.6} />,
    title: "Wedding Celebrations",
    value: "100+",
    description:
      "Creating unforgettable destination weddings and celebrations with exceptional hospitality.",
  },
  {
    icon: <UtensilsCrossed size={34} strokeWidth={1.6} />,
    title: "Rooftop Dining",
    value: "Kaara",
    description:
      "Experience signature cuisine with panoramic city views and memorable evenings.",
  },
  {
    icon: <CarFront size={34} strokeWidth={1.6} />,
    title: "Ample Parking",
    value: "24×7",
    description:
      "Spacious and secure parking facilities ensuring convenience for every guest.",
  },
  {
    icon: <MapPinned size={34} strokeWidth={1.6} />,
    title: "Prime Location",
    value: "Near",
    description:
      "Located close to Rajasthan's most iconic temples and heritage attractions.",
  },
  {
    icon: <Star size={34} strokeWidth={1.6} />,
    title: "Guest Satisfaction",
    value: "4.9★",
    description:
      "Known for warm hospitality, premium experiences and lasting guest relationships.",
  },
];

export default function WhyChooseKalyanam() {
  return (
    <>
      <section className="choose-section">
        <div className="choose-container">

          <span className="choose-tag">
            WHY CHOOSE KALYANAM
          </span>

          <h2 className="choose-heading">
            Crafted Around
            <br />
            Exceptional Hospitality
          </h2>

          <p className="choose-description">
            Every experience at Kalyanam Hotel & Resort is thoughtfully
            designed to combine luxury, comfort and genuine hospitality,
            creating memorable stays and celebrations for every guest.
          </p>

          <div className="choose-grid">
            {features.map((item, index) => (
              <div className="choose-card" key={index}>

                <div className="choose-icon">
                  {item.icon}
                </div>

                <h3>{item.value}</h3>

                <h4>{item.title}</h4>

                <p>{item.description}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`

.choose-section{
    background:#FCF8F2;
    padding:60px 20px;
}

.choose-container{
    max-width:1180px;
    margin:0 auto;
}

.choose-tag{
    display:block;
    text-align:center;

    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;

    letter-spacing:.34em;
    text-transform:uppercase;

    color:#A77748;

    margin-bottom:5px;
}

.choose-heading{
    text-align:center;
    font-family:var(--font-playfair);
    font-size:44px;
    font-weight:400;
    line-height:1;

    color:#3C2C20;

    margin-bottom:10px;
}

.choose-description{
    max-width:720px;
    margin:0 auto 60px;

    text-align:center;

    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.4;

    color:#6D645B;
}

.choose-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:26px;
}

.choose-card{
    background:#fff;

    padding:16px 30px;

    border:1px solid #EFE5DA;

    text-align:center;

    transition:.35s ease;
}

.choose-card:hover{
    transform:translateY(-8px);

    box-shadow:0 20px 50px rgba(0,0,0,.08);
}

.choose-icon{
    width:60px;
    height:60px;

    margin:0 auto 0px;

    border-radius:50%;

    background:#F6EFE7;

    color:#B07A47;

    display:flex;
    justify-content:center;
    align-items:center;
}

.choose-card h3{
    font-family:var(--font-playfair);
    font-size:42px;
    font-weight:400;
    color:#B07A47;
    margin-bottom:0px;
}

.choose-card h4{
    font-family:var(--font-playfair);
    font-size:22px;
    font-weight:400;
    color:#3D2D22;
    margin-bottom:10px;
}

.choose-card p{
    font-family:var(--font-lato);
    font-size:14px;
    line-height:1.4;
    color:#6B625A;
}
/* ===========================
   Hover Effects
=========================== */

.choose-card:hover .choose-icon{
    background:#B07A47;
    color:#fff;
    transform:rotate(-8deg) scale(1.08);
}

.choose-card:hover h3{
    color:#8D6036;
}

.choose-icon,
.choose-card h3{
    transition:all .35s ease;
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .choose-container{
        max-width:1240px;
    }

    .choose-grid{
        gap:30px;
    }

    .choose-heading{
        font-size:48px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .choose-container{
        max-width:1050px;
    }

    .choose-grid{
        gap:22px;
    }

    .choose-card{
        padding:34px 24px;
    }

    .choose-card h3{
        font-size:38px;
    }

    .choose-card h4{
        font-size:20px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .choose-section{
        padding:80px 30px;
    }

    .choose-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .choose-heading{
        font-size:38px;
    }

    .choose-description{
        font-size:14px;
        margin-bottom:45px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .choose-section{
        padding:65px 20px;
    }

    .choose-grid{
        grid-template-columns:1fr;
        gap:20px;
    }

    .choose-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .choose-heading{
        font-size:30px;
        line-height:1.2;
    }

    .choose-description{
        font-size:14px;
        line-height:1.8;
        margin-bottom:35px;
    }

    .choose-card{
        padding:28px 22px;
    }

    .choose-icon{
        width:64px;
        height:64px;
        margin-bottom:18px;
    }

    .choose-card h3{
        font-size:34px;
    }

    .choose-card h4{
        font-size:20px;
        margin-bottom:12px;
    }

    .choose-card p{
        font-size:13px;
        line-height:1.75;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .choose-section{
        padding:55px 16px;
    }

    .choose-heading{
        font-size:26px;
    }

    .choose-card{
        padding:24px 18px;
    }

}
      `}</style>
    </>
  );
}