"use client";

const journey = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "Kalyanam Hotel & Resort opened its doors with a vision to redefine hospitality in the heart of Shekhawati.",
  },
  {
    year: "2020",
    title: "Celebrating Love",
    description:
      "Destination weddings quickly became our signature, creating unforgettable celebrations for families across Rajasthan.",
  },
  {
    year: "2022",
    title: "Expanding Luxury",
    description:
      "Premium accommodations, refined interiors and elevated guest experiences were introduced to every stay.",
  },
  {
    year: "2024",
    title: "Kaara Rooftop",
    description:
      "Our rooftop dining destination opened, offering handcrafted cuisine, beautiful evenings and panoramic views.",
  },
  {
    year: "TODAY",
    title: "Creating Memories",
    description:
      "Every guest, every celebration and every stay continues to shape the Kalyanam story with timeless hospitality.",
  },
];

export default function OurJourney() {
  return (
    <>
      <section className="journey-section">
        <div className="journey-container">

          <span className="journey-tag">
            OUR JOURNEY
          </span>

          <h2 className="journey-heading">
            Building Memories
            <br />
            Since 2018
          </h2>

          <p className="journey-description">
            From a humble beginning to becoming one of the region's preferred
            destinations for stays, weddings and celebrations, our journey is
            built on passion, dedication and genuine hospitality.
          </p>

          <div className="journey-wrapper">

            {/* Left Timeline */}

            <div className="timeline-axis">

              {journey.map((item, index) => (
                <div className="axis-item" key={index}>

                  <span className="axis-year">
                    {item.year}
                  </span>

                  <div className="axis-dot"></div>

                </div>
              ))}

              <div className="axis-line"></div>

            </div>

            {/* Waterfall */}

            <div className="waterfall">

              {journey.map((item, index) => (
                <div
                  className={`journey-card card-${index + 1}`}
                  key={index}
                >
                  <div className="card-content">

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      <style>{`

.journey-section{
    padding:50px 20px;
    background:#FCF8F2;
}

.journey-container{
    max-width:1220px;
    margin:0 auto;
}

.journey-tag{
    display:block;
    text-align:center;
    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;
    letter-spacing:.35em;
    text-transform:uppercase;
    color:#A77748;
    margin-bottom:5px;
}

.journey-heading{
    text-align:center;
    font-family:var(--font-playfair);
    font-size:44px;
    font-weight:400;
    line-height:1;
    color:#38281D;
    margin-bottom:10px;
}

.journey-description{
    max-width:720px;
    margin:0 auto 30px;
    text-align:center;
    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.3;

    color:#6C635B;
}

.journey-wrapper{
    display:flex;
    align-items:flex-start;
    gap:10px;
}

.timeline-axis{
    position:relative;
    width:120px;
    flex-shrink:0;
}

.axis-line{
    position:absolute;
    top:18px;
    right:18px;
    width:2px;
    height:calc(100% - 36px);
    background:#C39A6B;
}

.axis-item{
    position:relative;
    height:130px;
    display:flex;
    align-items:center;
    justify-content:flex-end;
    padding-right:38px;
}

.axis-year{
    font-family:var(--font-playfair);
    font-size:30px;
    color:#A77748;
}

.axis-dot{
    position:absolute;
    right:10px;
    width:16px;
    height:16px;
    border-radius:50%;
    border:2px solid #A77748;
    background:#FCF8F2;
}

.waterfall{
    flex:1;
    display:flex;
    flex-direction:column;
    gap:10px;
}

.journey-card{
    background:#fff;
    min-height:120px;
    display:flex;
    align-items:center;
    border-radius:10px;
    border:1px solid #EFE5DA;
    box-shadow:0 18px 40px rgba(0,0,0,.05);
    transition:.35s;
}

.card-1{
    width:50%;
}

.card-2{
    width:60%;
}

.card-3{
    width:70%;
}

.card-4{
    width:80%;
}

.card-5{
    width:90%;
    background:#A77748;
}

.card-content{
    padding:26px 34px;
}

.card-content h3{
    font-family:var(--font-playfair);
    font-size:28px;
    font-weight:400;
    color:#3A2A1F;
    margin-bottom:2px;
}

.card-content p{
    font-family:var(--font-lato);
    font-size:14px;
    line-height:1.3;
    color:#6B625A;
}

.card-5 h3,
.card-5 p{
    color:#fff;
}

.journey-card:hover{
    transform:translateX(12px);
}
.journey-card:hover{
    transform:translateX(12px);
    box-shadow:0 24px 60px rgba(0,0,0,.08);
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .journey-container{
        max-width:1280px;
    }

    .journey-heading{
        font-size:48px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .journey-container{
        max-width:1080px;
    }

    .journey-wrapper{
        gap:40px;
    }

    .timeline-axis{
        width:95px;
    }

    .axis-year{
        font-size:24px;
    }

    .card-content{
        padding:22px 28px;
    }

    .card-content h3{
        font-size:24px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .journey-section{
        padding:80px 30px;
    }

    .journey-heading{
        font-size:36px;
    }

    .journey-description{
        font-size:14px;
        margin-bottom:50px;
    }

    .journey-wrapper{
        gap:30px;
    }

    .timeline-axis{
        width:80px;
    }

    .axis-item{
        height:120px;
        padding-right:30px;
    }

    .axis-year{
        font-size:22px;
    }

    .axis-dot{
        width:14px;
        height:14px;
        right:8px;
    }

    .axis-line{
        right:14px;
    }

    .card-content h3{
        font-size:22px;
    }

    .card-content p{
        font-size:13px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .journey-section{
        padding:65px 20px;
    }

    .journey-heading{
        font-size:30px;
        line-height:1.2;
    }

    .journey-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .journey-description{
        font-size:14px;
        margin-bottom:35px;
    }

    .journey-wrapper{
        flex-direction:column;
        gap:28px;
    }

    .timeline-axis{
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        position:relative;
    }

    .axis-line{
        left:0;
        right:0;
        top:50%;
        width:100%;
        height:2px;
        transform:translateY(-50%);
    }

    .axis-item{
        height:auto;
        padding:0;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        z-index:2;
        background:#FCF8F2;
    }

    .axis-year{
        font-size:16px;
        margin-bottom:8px;
    }

    .axis-dot{
        position:static;
        width:12px;
        height:12px;
    }

    .waterfall{
        gap:16px;
    }

    .journey-card,
    .card-1,
    .card-2,
    .card-3,
    .card-4,
    .card-5{
        width:100%;
        min-height:auto;
    }

    .card-content{
        padding:20px;
    }

    .card-content h3{
        font-size:20px;
        margin-bottom:10px;
    }

    .card-content p{
        font-size:13px;
        line-height:1.7;
    }

    .journey-card:hover{
        transform:none;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .journey-section{
        padding:55px 16px;
    }

    .journey-heading{
        font-size:26px;
    }

    .axis-year{
        font-size:14px;
    }

    .card-content{
        padding:18px;
    }

    .card-content h3{
        font-size:18px;
    }

}
      `}</style>
    </>
  );
}