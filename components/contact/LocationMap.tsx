"use client";

import {
  MapPin,
  Navigation,
  Train,
  Plane,
} from "lucide-react";

export default function LocationMap() {
  return (
    <>
      <section className="location-section">

        <div className="location-container">

          <span className="location-tag">
            FIND US
          </span>

          <h2 className="location-heading">
            Visit Kalyanam
            <br />
            Hotel & Resort
          </h2>

          <p className="location-description">
            Conveniently located on Jaipur Road, Kalyanam Hotel & Resort offers
            easy accessibility while providing a peaceful destination for
            luxurious stays, destination weddings, celebrations and memorable
            experiences.
          </p>

          <div className="location-grid">

            {/* ================= Map ================= */}

            <div className="map-card">

              <iframe
  src="https://maps.google.com/maps?q=Kalyanam%20Hotel%20%26%20Resort%20Sikar&t=&z=15&ie=UTF8&iwloc=&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
/>

            </div>

            {/* ================= Details ================= */}

            <div className="location-card">

              <h3>Getting Here</h3>

              <div className="location-item">

                <div className="location-icon">
                  <MapPin size={22} strokeWidth={1.8}/>
                </div>

                <div>

                  <h4>Address</h4>

                  <p>
                    Kalyanam Hotel & Resort
                    <br />
                    Jaipur Road,
                    <br />
                    Sikar, Rajasthan
                  </p>

                </div>

              </div>

              <div className="location-item">

                <div className="location-icon">
                  <Navigation size={22} strokeWidth={1.8}/>
                </div>

                <div>

                  <h4>By Road</h4>

                  <p>
                    Easily accessible via Jaipur Road and
                    connected to Jaipur, Delhi,
                    Bikaner and nearby cities.
                  </p>

                </div>

              </div>

              <div className="location-item">

                <div className="location-icon">
                  <Train size={22} strokeWidth={1.8}/>
                </div>

                <div>

                  <h4>By Rail</h4>

                  <p>
                    Sikar Junction Railway Station is
                    just a short drive from the resort.
                  </p>

                </div>

              </div>

              <div className="location-item">

                <div className="location-icon">
                  <Plane size={22} strokeWidth={1.8}/>
                </div>

                <div>

                  <h4>By Air</h4>

                  <p>
                    Jaipur International Airport is the
                    nearest major airport with convenient
                    road connectivity.
                  </p>

                </div>

              </div>

              <a
                href="https://maps.google.com/?q=Kalyanam+Hotel+%26+Resort+Sikar"
                target="_blank"
                rel="noopener noreferrer"
                className="direction-btn"
              >
                GET DIRECTIONS →
              </a>

            </div>

          </div>

        </div>

      </section>

      <style>{`
      .location-section{
    padding:50px 20px;
    background:#FCF8F2;
}

.location-container{
    max-width:1180px;
    margin:0 auto;
}

.location-tag{
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

.location-heading{
    text-align:center;

    font-family:var(--font-playfair);
    font-size:46px;
    font-weight:400;
    line-height:1;

    color:#3D2D22;

    margin-bottom:10px;
}

.location-description{
    max-width:720px;
    margin:0 auto 30px;

    text-align:center;

    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.4;

    color:#6C635B;
}

.location-grid{
    display:grid;
    grid-template-columns:1.4fr .9fr;
    gap:34px;
    align-items:stretch;
}

.map-card{
    overflow:hidden;
    border-radius:12px;
    background:#fff;

    border:1px solid #EFE5DA;

    box-shadow:0 18px 50px rgba(0,0,0,.06);

    min-height:500px;
}

.map-card iframe{
    width:100%;
    height:100%;
    display:block;
}

.location-card{
    background:#fff;

    border:1px solid #EFE5DA;
    border-radius:12px;

    padding:40px;

    box-shadow:0 18px 50px rgba(0,0,0,.05);
}

.location-card h3{
    margin-bottom:32px;
    font-family:var(--font-playfair);
    font-size:28px;
    font-weight:400;
    color:#3C2D22;
}

.location-item{
    display:flex;
    align-items:flex-start;
    gap:10px;
    margin-bottom:12px;
}

.location-icon{
    width:52px;
    height:52px;

    flex-shrink:0;

    border-radius:50%;

    background:#FCF8F2;
    color:#B07A47;

    display:flex;
    justify-content:center;
    align-items:center;

    transition:.35s;
}

.location-item:hover .location-icon{
    background:#B07A47;
    color:#fff;
}

.location-item h4{
    margin-bottom:4px;

    font-family:var(--font-playfair);
    font-size:20px;
    font-weight:400;

    color:#3C2D22;
}

.location-item p{
    font-family:var(--font-lato);
    font-size:12px;
    line-height:1.4;
    color:#6C635B;
}

.direction-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;

    margin-top:18px;

    padding:15px 30px;

    background:#B07A47;
    border:1px solid #B07A47;
    border-radius:6px;

    text-decoration:none;

    color:#fff;

    font-family:var(--font-playfair);
    font-size:13px;
    font-weight:600;

    letter-spacing:.14em;
    text-transform:uppercase;

    transition:.35s;
}

.direction-btn:hover{
    background:transparent;
    color:#B07A47;
}
    /* ===========================
   Hover Effects
=========================== */

.map-card,
.location-card{
    transition:all .35s ease;
}

.map-card:hover,
.location-card:hover{
    transform:translateY(-6px);
    box-shadow:0 24px 60px rgba(0,0,0,.08);
}

.location-icon{
    transition:all .35s ease;
}

.direction-btn{
    transition:all .35s ease;
}

.direction-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 18px 40px rgba(176,122,71,.25);
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .location-container{
        max-width:1240px;
    }

    .location-heading{
        font-size:50px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .location-grid{
        gap:28px;
    }

    .location-card{
        padding:34px;
    }

    .map-card{
        min-height:600px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .location-section{
        padding:80px 30px;
    }

    .location-grid{
        grid-template-columns:1fr;
    }

    .location-heading{
        font-size:38px;
    }

    .location-description{
        font-size:14px;
        margin-bottom:45px;
    }

    .map-card{
        min-height:450px;
        order:2;
    }

    .location-card{
        order:1;
        padding:32px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .location-section{
        padding:65px 20px;
    }

    .location-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .location-heading{
        font-size:30px;
        line-height:1.2;
    }

    .location-description{
        font-size:14px;
        line-height:1.75;
        margin-bottom:35px;
    }

    .location-card{
        padding:24px;
    }

    .location-card h3{
        font-size:24px;
        margin-bottom:24px;
    }

    .location-item{
        gap:14px;
        margin-bottom:22px;
    }

    .location-icon{
        width:46px;
        height:46px;
    }

    .location-item h4{
        font-size:18px;
    }

    .location-item p{
        font-size:13px;
        line-height:1.7;
    }

    .map-card{
        min-height:350px;
    }

    .direction-btn{
        width:100%;
        padding:14px 20px;
        text-align:center;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .location-section{
        padding:55px 16px;
    }

    .location-heading{
        font-size:26px;
    }

    .location-card{
        padding:20px;
    }

    .map-card{
        min-height:300px;
    }

}
      `}</style>
    </>
  );
}