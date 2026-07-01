"use client";

export default function HeroContact() {
  return (
    <>
      <section
        className="contact-hero"
        style={{
          backgroundImage: "url('/contacthero.jpg')",
        }}
      >
        <div className="contact-overlay"></div>

        <div className="contact-container">
          <div className="contact-content">

            <span className="contact-tag">
              GET IN TOUCH
            </span>

            <h1 className="contact-title">
              We'd Love
              <br />
              To Hear
              <span> From You</span>
            </h1>

            <p className="contact-description">
              Whether you're planning a luxurious stay, a destination wedding,
              an intimate celebration, or simply have a question, our team is
              here to assist you. Connect with us and let us help create your
              next unforgettable experience at Kalyanam Hotel & Resort.
            </p>

            <div className="contact-info">

              <div className="info-item">
                <h4>Call Us</h4>
                <span>+91 98765 43210</span>
              </div>

              <div className="info-divider"></div>

              <div className="info-item">
                <h4>Email</h4>
                <span>info@kalyanamhotel.com</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      <style>{`

.contact-hero{
    position:relative;
    width:100%;
    height:100vh;

    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;

    display:flex;
    justify-content:center;
    align-items:center;

    overflow:hidden;
}

.contact-overlay{
    position:absolute;
    inset:0;

    background:linear-gradient(
        180deg,
        rgba(0,0,0,.35) 0%,
        rgba(0,0,0,.55) 55%,
        rgba(0,0,0,.70) 100%
    );
}

.contact-container{
    position:relative;
    z-index:2;

    width:100%;
    max-width:1180px;

    margin:0 auto;
    padding:0 20px;
}

.contact-content{
    max-width:720px;
    margin:0 auto;

    text-align:center;

    color:#fff;
}

.contact-tag{
    display:inline-block;

    margin-bottom:14px;

    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;

    letter-spacing:.38em;
    text-transform:uppercase;

    color:#D9B27A;
}

.contact-title{
    font-family:var(--font-playfair);

    font-size:68px;
    font-weight:400;

    line-height:.95;

    color:#fff;
}

.contact-title span{
    color:#D8A14A;
}

.contact-description{
    max-width:600px;

    margin:26px auto 40px;

    font-family:var(--font-lato);

    font-size:15px;
    line-height:1.9;

    color:rgba(255,255,255,.9);
}

.contact-info{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:34px;
}

.info-item{
    text-align:center;
}

.info-item h4{
    margin-bottom:10px;

    font-family:var(--font-playfair);
    font-size:22px;
    font-weight:400;

    color:#fff;
}

.info-item span{
    font-family:var(--font-lato);
    font-size:14px;
    color:rgba(255,255,255,.85);
}

.info-divider{
    width:1px;
    height:60px;
    background:rgba(255,255,255,.25);
}
/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .contact-container{
        max-width:1260px;
    }

    .contact-title{
        font-size:76px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .contact-title{
        font-size:58px;
    }

    .contact-description{
        max-width:560px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .contact-hero{
        height:85vh;
    }

    .contact-container{
        padding:0 30px;
    }

    .contact-title{
        font-size:50px;
    }

    .contact-description{
        font-size:14px;
        margin:22px auto 34px;
    }

    .info-item h4{
        font-size:20px;
    }

    .info-item span{
        font-size:13px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .contact-hero{
        height:80vh;
    }

    .contact-container{
        padding:0 20px;
    }

    .contact-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .contact-title{
        font-size:38px;
        line-height:1.08;
    }

    .contact-description{
        margin:20px auto 30px;
        font-size:14px;
        line-height:1.75;
    }

    .contact-info{
        flex-direction:column;
        gap:24px;
    }

    .info-divider{
        width:70px;
        height:1px;
    }

    .info-item h4{
        margin-bottom:6px;
        font-size:18px;
    }

    .info-item span{
        font-size:13px;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .contact-hero{
        height:75vh;
    }

    .contact-container{
        padding:0 16px;
    }

    .contact-title{
        font-size:32px;
    }

    .contact-description{
        font-size:13px;
    }

    .info-item h4{
        font-size:17px;
    }

    .info-item span{
        font-size:12px;
    }

}
      `}</style>
    </>
  );
}