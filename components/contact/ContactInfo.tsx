"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock3,
} from "lucide-react";

export default function ContactInfo() {
  return (
    <>
      <section className="contact-info-section">
        <div className="contact-info-container">

          {/* Heading */}

          <span className="contact-info-tag">
            CONNECT WITH US
          </span>

          <h2 className="contact-info-heading">
            We'd Love To
            <br />
            Welcome You
          </h2>

          <p className="contact-info-description">
            Whether you're planning a luxurious stay, an unforgettable wedding,
            a corporate gathering, or simply have a question, our team is always
            ready to assist you. Reach out to us and we'll make your Kalyanam
            experience effortless from the very first conversation.
          </p>

          <div className="contact-grid">

            {/* ===========================
                Contact Form
            =========================== */}

            <div className="contact-form-card">

              <h3>Send An Enquiry</h3>

              <form className="contact-form">

                <div className="form-row">

                  <div className="form-group">
                    <label>Full Name</label>

                    <input
                      type="text"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>Phone Number</label>

                    <input
                      type="text"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject</label>

                    <input
                      type="text"
                      placeholder="How can we help?"
                    />
                  </div>

                </div>

                <div className="form-group">

                  <label>Your Message</label>

                  <textarea
                    rows={7}
                    placeholder="Tell us about your stay, wedding, celebration or enquiry..."
                  ></textarea>

                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                >
                  SEND ENQUIRY →
                </button>

              </form>

            </div>

            {/* ===========================
                Contact Details
            =========================== */}

            <div className="contact-details-card">

              <h3>Contact Information</h3>

              <div className="detail-item">

                <div className="detail-icon">
                  <MapPin size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h4>Visit Us</h4>

                  <p>
                    Kalyanam Hotel & Resort
                    <br />
                    Jaipur Road, Sikar
                    <br />
                    Rajasthan, India
                  </p>
                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">
                  <Phone size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h4>Call Us</h4>

                  <p>+91 XXXXX XXXXX</p>
                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">
                  <Mail size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h4>Email</h4>

                  <p>info@kalyanamhotel.com</p>
                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">
                  <Clock3 size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h4>Reception</h4>

                  <p>Open 24 Hours</p>
                </div>

              </div>

              <div className="social-wrapper">

  <h4>Follow Us</h4>

  <div className="social-links">

    <a
      href="https://instagram.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Instagram
    </a>

    <a
      href="https://facebook.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Facebook
    </a>

  </div>

</div>

            </div>

          </div>

        </div>
      </section>

      <style>{`
      .contact-info-section{
    padding:50px 20px;
    background:#FCF8F2;
}

.contact-info-container{
    max-width:1180px;
    margin:0 auto;
}

.contact-info-tag{
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

.contact-info-heading{
    text-align:center;

    font-family:var(--font-playfair);
    font-size:46px;
    font-weight:400;
    line-height:1;

    color:#3C2D22;

    margin-bottom:10px;
}

.contact-info-description{
    max-width:700px;
    margin:0 auto 60px;

    text-align:center;

    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.4;

    color:#6C635B;
}

.contact-grid{
    display:grid;
    grid-template-columns:1.4fr .9fr;
    gap:35px;
}

.contact-form-card,
.contact-details-card{
    background:#fff;
    border:1px solid #EFE5DA;
    border-radius:10px;
    padding:42px;
}

.contact-form-card h3,
.contact-details-card h3{
    margin-bottom:12px;
    font-family:var(--font-playfair);
    font-size:30px;
    font-weight:400;

    color:#3A2B21;
}

.contact-form{
    display:flex;
    flex-direction:column;
    gap:22px;
}

.form-row{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
}

.form-group{
    display:flex;
    flex-direction:column;
}

.form-group label{
    margin-bottom:2px;
    font-family:var(--font-lato);
    font-size:12px;
    font-weight:700;

    letter-spacing:.12em;
    text-transform:uppercase;

    color:#8B6540;
}

.form-group input,
.form-group textarea{
    width:100%;

    padding:8px 12px;

    border:1px solid #E5DDD3;
    border-radius:6px;

    background:#fff;

    font-family:var(--font-lato);
    font-size:14px;

    color:#444;

    transition:.3s;
}

.form-group textarea{
    resize:none;
}

.form-group input:focus,
.form-group textarea:focus{
    outline:none;
    border-color:#B07A47;
}

.contact-submit-btn{
    align-self:flex-start;

    margin-top:6px;

    padding:12px 32px;

    border:none;
    border-radius:6px;

    background:#B07A47;
    color:#fff;

    cursor:pointer;

    font-family:var(--font-playfair);
    font-size:14px;
    font-weight:600;

    letter-spacing:.14em;
    text-transform:uppercase;

    transition:.35s;
}

.contact-submit-btn:hover{
    background:#956338;
}

.detail-item{
    display:flex;
    align-items:flex-start;
    gap:18px;

    margin-bottom:12px;
}

.detail-icon{
    width:52px;
    height:52px;

    border-radius:50%;

    background:#FCF8F2;
    color:#B07A47;

    display:flex;
    justify-content:center;
    align-items:center;

    flex-shrink:0;
}

.detail-item h4{
    margin-bottom:0px;

    font-family:var(--font-playfair);
    font-size:22px;
    font-weight:400;

    color:#3B2C22;
}

.detail-item p{
    font-family:var(--font-lato);
    font-size:14px;
    line-height:1.4;

    color:#6C635B;
}

.social-wrapper{
    margin-top:20px;
    padding-top:10px;
    border-top:1px solid #EFE5DA;
}

.social-wrapper h4{
    margin-bottom:18px;

    font-family:var(--font-playfair);
    font-size:22px;
    font-weight:400;

    color:#3B2C22;
}

.social-links{
    display:flex;
    gap:22px;
    flex-wrap:wrap;
}

.social-links a{
    position:relative;

    text-decoration:none;

    font-family:var(--font-playfair);
    font-size:16px;
    font-weight:500;

    color:#B07A47;

    transition:color .3s ease;
}

.social-links a::after{
    content:"";

    position:absolute;

    left:0;
    bottom:-4px;

    width:0;
    height:1px;

    background:#B07A47;

    transition:width .35s ease;
}

.social-links a:hover{
    color:#7C5632;
}

.social-links a:hover::after{
    width:100%;
}
    /* ===========================
   Hover Effects
=========================== */

.contact-form-card,
.contact-details-card{
    transition:all .35s ease;
}

.contact-form-card:hover,
.contact-details-card:hover{
    transform:translateY(-6px);
    box-shadow:0 22px 60px rgba(0,0,0,.08);
}

.detail-icon,
.social-icons a{
    transition:all .35s ease;
}

.detail-item:hover .detail-icon{
    background:#B07A47;
    color:#fff;
}

.contact-submit-btn{
    transition:all .35s ease;
}

.contact-submit-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 15px 35px rgba(176,122,71,.25);
}

.social-icons a:hover{
    transform:translateY(-4px);
}

/* ===========================
   Large Desktop
=========================== */

@media (min-width:1600px){

    .contact-info-container{
        max-width:1240px;
    }

    .contact-info-heading{
        font-size:50px;
    }

}

/* ===========================
   Laptop
=========================== */

@media (max-width:1200px){

    .contact-grid{
        gap:28px;
    }

    .contact-form-card,
    .contact-details-card{
        padding:36px;
    }

}

/* ===========================
   Tablet
=========================== */

@media (max-width:992px){

    .contact-info-section{
        padding:80px 30px;
    }

    .contact-grid{
        grid-template-columns:1fr;
    }

    .contact-info-heading{
        font-size:38px;
    }

    .contact-info-description{
        font-size:14px;
        margin-bottom:45px;
    }

}

/* ===========================
   Mobile
=========================== */

@media (max-width:768px){

    .contact-info-section{
        padding:65px 20px;
    }

    .contact-info-tag{
        font-size:10px;
        letter-spacing:.28em;
    }

    .contact-info-heading{
        font-size:30px;
        line-height:1.2;
    }

    .contact-info-description{
        font-size:14px;
        line-height:1.75;
        margin-bottom:35px;
    }

    .contact-form-card,
    .contact-details-card{
        padding:24px;
    }

    .contact-form-card h3,
    .contact-details-card h3{
        font-size:24px;
        margin-bottom:22px;
    }

    .form-row{
        grid-template-columns:1fr;
        gap:18px;
    }

    .contact-submit-btn{
        width:100%;
        justify-content:center;
        text-align:center;
    }

    .detail-item{
        gap:14px;
        margin-bottom:22px;
    }

    .detail-icon{
        width:46px;
        height:46px;
    }

    .detail-item h4{
        font-size:18px;
    }

    .detail-item p{
        font-size:13px;
        line-height:1.7;
    }

    .social-wrapper{
        margin-top:28px;
        padding-top:24px;
    }

    .social-wrapper h4{
        font-size:18px;
    }

    .social-icons a{
        width:44px;
        height:44px;
    }

}

/* ===========================
   Small Mobile
=========================== */

@media (max-width:480px){

    .contact-info-section{
        padding:55px 16px;
    }

    .contact-info-heading{
        font-size:26px;
    }

    .contact-form-card,
    .contact-details-card{
        padding:20px;
    }

    .form-group input,
    .form-group textarea{
        padding:13px 15px;
        font-size:13px;
    }

    .contact-submit-btn{
        padding:14px 20px;
        font-size:13px;
    }

}
      `}</style>
    </>
  );
}