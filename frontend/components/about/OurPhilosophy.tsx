"use client";

import {
  BedDouble,
  HeartHandshake,
  Sparkles,
  UtensilsCrossed,
  MapPinned,
  Award,
} from "lucide-react";

const values = [
  {
    icon: <BedDouble size={34} strokeWidth={1.6} />,
    title: "Luxury Living",
    description:
      "Beautifully designed rooms, refined interiors, and modern comforts come together to create a stay that feels effortlessly luxurious.",
  },
  {
    icon: <HeartHandshake size={34} strokeWidth={1.6} />,
    title: "Warm Hospitality",
    description:
      "Our team believes genuine hospitality begins with care, ensuring every guest feels welcomed, valued, and at home.",
  },
  {
    icon: <Sparkles size={34} strokeWidth={1.6} />,
    title: "Memorable Celebrations",
    description:
      "From destination weddings to intimate gatherings, every celebration is thoughtfully curated with elegance and perfection.",
  },
  {
    icon: <UtensilsCrossed size={34} strokeWidth={1.6} />,
    title: "Exceptional Dining",
    description:
      "Experience authentic flavours and handcrafted culinary delights served with impeccable hospitality at every meal.",
  },
  {
    icon: <MapPinned size={34} strokeWidth={1.6} />,
    title: "Local Experiences",
    description:
      "Discover the heritage of Shekhawati through temples, forts, culture, and unforgettable nearby attractions.",
  },
  {
    icon: <Award size={34} strokeWidth={1.6} />,
    title: "Excellence Always",
    description:
      "Every detail reflects our commitment to quality, comfort, and creating unforgettable experiences for every guest.",
  },
];

export default function OurPhilosophy() {
  return (
    <>
      <section className="philosophy-section">
        <div className="philosophy-container">
          <span className="philosophy-tag">
            OUR PHILOSOPHY
          </span>

          <h2 className="philosophy-heading">
            The Values That Define
            <br />
            Every Stay
          </h2>

          <p className="philosophy-description">
            Every experience at Kalyanam Hotel & Resort is guided by timeless
            values of hospitality, elegance, and thoughtful service. From the
            moment you arrive until your farewell, every detail is designed to
            create memories that last a lifetime.
          </p>

          <div className="philosophy-grid">
            {values.map((item, index) => (
              <div className="value-card" key={index}>
                <div className="gold-line"></div>

                <div className="value-icon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`

.philosophy-section{
    background:#FFFFFF;
    padding:50px 20px;
}

.philosophy-container{
    max-width:1180px;
    margin:0 auto;
}

.philosophy-tag{
    display:block;
    text-align:center;

    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;

    letter-spacing:.34em;
    text-transform:uppercase;

    color:#A77748;

    margin-bottom:10px;
}

.philosophy-heading{
    text-align:center;

    font-family:var(--font-playfair);

    font-size:44px;
    font-weight:400;
    line-height:1;

    color:#37281D;

    margin-bottom:10px;
}

.philosophy-description{
    max-width:720px;

    margin:0 auto 60px;

    text-align:center;

    font-family:var(--font-lato);

    font-size:15px;
    line-height:1.4;

    color:#6C635B;
}

.philosophy-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:28px;
}

.value-card{
    background:#FCF8F2;

    padding:20px 34px;

    text-align:center;

    transition:.35s ease;

    border:1px solid #EFE5DA;
}

.value-card:hover{
    transform:translateY(-8px);

    box-shadow:0 22px 50px rgba(0,0,0,.08);
}

.gold-line{
    width:46px;
    height:2px;

    margin:0 auto 26px;

    background:#B07A47;
}

.value-icon{
    display:flex;
    justify-content:center;
    align-items:center;

    color:#B07A47;

    margin-bottom:20px;
}

.value-card h3{
    font-family:var(--font-playfair);

    font-size:24px;
    font-weight:400;

    color:#3E2F24;

    margin-bottom:18px;
}

.value-card p{
    font-family:var(--font-lato);

    font-size:14px;
    line-height:1.8;

    color:#6B625A;
}
/* ===========================
   Hover Effects
=========================== */

.value-card:hover .gold-line{
    width:70px;
    transition:.35s ease;
}

.value-card:hover .value-icon{
    transform:scale(1.08);
    transition:.35s ease;
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .philosophy-container{
        max-width:1240px;
    }

    .philosophy-grid{
        gap:32px;
    }

    .philosophy-heading{
        font-size:48px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .philosophy-container{
        max-width:1050px;
    }

    .philosophy-grid{
        gap:24px;
    }

    .value-card{
        padding:34px 28px;
    }

    .value-card h3{
        font-size:22px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .philosophy-section{
        padding:80px 30px;
    }

    .philosophy-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .philosophy-heading{
        font-size:38px;
    }

    .philosophy-description{
        margin-bottom:50px;
        font-size:14px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .philosophy-section{
        padding:65px 20px;
    }

    .philosophy-heading{
        font-size:30px;
        line-height:1.2;
    }

    .philosophy-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .philosophy-description{
        font-size:14px;
        margin-bottom:38px;
    }

    .philosophy-grid{
        grid-template-columns:1fr;
        gap:20px;
    }

    .value-card{
        padding:28px 24px;
    }

    .gold-line{
        margin-bottom:20px;
    }

    .value-icon{
        margin-bottom:18px;
    }

    .value-card h3{
        font-size:20px;
        margin-bottom:14px;
    }

    .value-card p{
        font-size:13px;
        line-height:1.75;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .philosophy-section{
        padding:55px 16px;
    }

    .philosophy-heading{
        font-size:26px;
    }

    .value-card{
        padding:24px 20px;
    }

}
      `}</style>
    </>
  );
}