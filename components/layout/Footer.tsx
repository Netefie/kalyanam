"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);

      document.querySelectorAll(".footer-reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight - 120) {
          el.classList.add("active");
        }
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="footer">

        <div className="footer-container">

          {/* =========================
                TOP SECTION
          ========================= */}

          <div className="footer-top">

            {/* Logo */}

            <div className="footer-brand">

              <Image
                src="/logo1.png"
                alt="Kalyanam"
                width={120}
                height={120}
              />

              <h2>
                Kalyanam
                <span>Hotel & Resort</span>
              </h2>

              <p>
                Experience timeless hospitality where luxury,
                celebrations and unforgettable memories come
                together in the heart of Rajasthan.
              </p>

              <Link
                href="/reservation"
                className="footer-btn"
              >
                Make Reservation
                <ArrowUpRight size={18} />
              </Link>

            </div>

            {/* =====================
                Explore
            ===================== */}

            <div className="footer-column">

              <h3>Explore</h3>

              <ul>

                <li>
                  <Link
                    href="/"
                    className="footer-reveal"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="footer-reveal"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/accommodation"
                    className="footer-reveal"
                  >
                    Accommodation
                  </Link>
                </li>

                <li>
                  <Link
                    href="/experiences"
                    className="footer-reveal"
                  >
                    Experiences
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="footer-reveal"
                  >
                    Contact
                  </Link>
                </li>

              </ul>

            </div>

            {/* =====================
                Celebrations
            ===================== */}

            <div className="footer-column">

              <h3>Celebrations</h3>

              <ul>

                <li>
                  <Link
                    href="/weddings"
                    className="footer-reveal"
                  >
                    Weddings
                  </Link>
                </li>

                <li>
                  <Link
                    href="/banquet"
                    className="footer-reveal"
                  >
                    Banquet Hall
                  </Link>
                </li>

                <li>
                  <Link
                    href="/kaara"
                    className="footer-reveal"
                  >
                    Kaara Rooftop
                  </Link>
                </li>

                

              </ul>

            </div>
                        {/* =====================
                Contact
            ===================== */}

            <div className="footer-column">

              <h3>Contact</h3>

              <ul>

                <li>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="footer-reveal"
                  >
                    Jaipur Road,
                    <br />
                    Sikar, Rajasthan
                  </a>
                </li>

                <li>
                  <a
                    href="tel:+919876543210"
                    className="footer-reveal"
                  >
                    +91 98765 43210
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:info@kalyanamhotel.com"
                    className="footer-reveal"
                  >
                    info@kalyanamhotel.com
                  </a>
                </li>

                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    className="footer-reveal"
                  >
                    Instagram
                  </a>
                </li>

                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    className="footer-reveal"
                  >
                    Facebook
                  </a>
                </li>

              </ul>

            </div>

            {/* =====================
                Quick Links
            ===================== */}

            <div className="footer-column">

              <h3>Quick Links</h3>

              <ul>

                <li>
                  <Link
                    href="/privacy-policy"
                    className="footer-reveal"
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="footer-reveal"
                  >
                    Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link
                    href="/refund-policy"
                    className="footer-reveal"
                  >
                    Refund Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/cancellation-policy"
                    className="footer-reveal"
                  >
                    Cancellation Policy
                  </Link>
                </li>

                <li>
  <Link
    href="/#faq"
    className="footer-reveal"
  >
    FAQs
  </Link>
</li>

              </ul>

            </div>

          </div>

          {/* =========================
                Divider
          ========================= */}

          <div className="footer-divider"></div>

          {/* =========================
                Bottom
          ========================= */}

          <div className="footer-bottom">

            <div className="footer-copy">

              <p>
                © {new Date().getFullYear()} Kalyanam Hotel & Resort.
                All Rights Reserved.
              </p>

            </div>


            <div className="footer-credit">

              <p>

                Designed & Developed by{" "}

                <a
                  href="https://www.netefie.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-reveal"
                >
                  Netefie
                </a>

              </p>

            </div>

          </div>

        </div>

        {/* =========================
              Back To Top
        ========================= */}

        <button
          className={`back-top ${showTop ? "show" : ""}`}
          onClick={scrollTop}
        >
          ↑
        </button>

      </footer>

      <style>{`
      .footer{
    position:relative;
    overflow:hidden;
    background:#111111;
    color:#ECE6DB;
}

.footer::before{
    content:"";
    position:absolute;
    inset:0;

    background:
        radial-gradient(circle at top right,
        rgba(176,122,71,.08),
        transparent 42%);

    pointer-events:none;
}

.footer-container{
    position:relative;
    z-index:2;

    max-width:1320px;
    margin:0 auto;

    padding:30px 28px 35px;
}

.footer-top{
    display:grid;
    grid-template-columns:2fr 1fr 1fr 1fr 1fr;
    gap:55px;
    align-items:flex-start;
}

/* ===========================
   BRAND
=========================== */

.footer-brand{
    max-width:360px;
}

.footer-brand img{
    margin-bottom:20px;
}

.footer-brand h2{
    display:flex;
    flex-direction:column;

    margin:0 0 20px;

    font-family:var(--font-playfair);
    font-size:42px;
    font-weight:400;
    line-height:1.05;

    color:#fff;
}

.footer-brand h2 span{
    margin-top:6px;

    font-size:18px;
    font-family:var(--font-lato);

    letter-spacing:.25em;
    text-transform:uppercase;

    color:#B07A47;
}

.footer-brand p{
    margin-bottom:34px;

    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.9;

    color:#BEB7AC;
}

.footer-btn{
    display:inline-flex;
    align-items:center;
    gap:14px;

    padding:15px 26px;

    border-radius:8px;

    text-decoration:none;

    background:#B07A47;
    border:1px solid #B07A47;

    color:#fff;

    font-family:var(--font-playfair);
    font-size:14px;
    font-weight:600;

    letter-spacing:.12em;
    text-transform:uppercase;

    transition:all .35s ease;
}

.footer-btn svg{
    transition:.35s ease;
}

.footer-btn:hover{
    background:transparent;
    color:#B07A47;
}

.footer-btn:hover svg{
    transform:translate(4px,-4px);
}
    /* ===========================
   FOOTER COLUMNS
=========================== */

.footer-column h3{
    position:relative;

    margin:0 0 28px;

    font-family:var(--font-playfair);
    font-size:24px;
    font-weight:400;

    color:#fff;
}

.footer-column h3::after{
    content:"";

    position:absolute;

    left:0;
    bottom:-12px;

    width:42px;
    height:2px;

    background:#B07A47;
}

.footer-column ul{
    list-style:none;
    padding:0;
    margin:0;

    display:flex;
    flex-direction:column;
    gap:18px;
}

.footer-column li{
    display:block;
    width:100%;
}

.footer-column li a{
    display:inline-block;

    position:relative;

    text-decoration:none;

    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.8;

    color:#C9C1B5;

    transition:all .35s ease;
}

/* ===========================
   LINKS
=========================== */

.footer-column a,
.footer-column li a,
.footer-column li{
    position:relative;
    display:inline-block;

    text-decoration:none;

    font-family:var(--font-lato);
    font-size:15px;
    font-weight:400;

    line-height:1.8;

    color:#C9C1B5;

    transition:all .35s ease;
}

/* ===========================
   SCROLL UNDERLINE ANIMATION
=========================== */

.footer-reveal{
    position:relative;
}

.footer-reveal::after{

    content:"";

    position:absolute;

    left:0;
    bottom:-4px;

    width:0%;
    height:1px;

    background:#B07A47;

    transition:width .55s ease;
}

/* Active when scrolled */

.footer-reveal.active::after{
    width:100%;
}

/* Hover */

.footer-column a:hover,
.footer-bottom a:hover,
.footer-credit a:hover{
    color:#fff;
}

.footer-column a:hover::after,
.footer-bottom a:hover::after,
.footer-credit a:hover::after{
    width:100%;
}

/* ===========================
   ADDRESS
=========================== */

.footer-column li:first-child a{
    line-height:1.9;
}

/* ===========================
   COLUMN SPACING
=========================== */

.footer-column li:last-child{
    margin-bottom:0;
}

/* ===========================
   PREMIUM MICRO ANIMATION
=========================== */

.footer-column a{
    transform:translateX(0);
}

.footer-column a:hover{
    transform:translateX(6px);
}

/* ===========================
   TEXT SELECTION
=========================== */

.footer a::selection,
.footer p::selection,
.footer h2::selection,
.footer h3::selection{
    background:#B07A47;
    color:#fff;
}
    /* ===========================
   DIVIDER
=========================== */

.footer-divider{
    width:100%;
    height:1px;

    margin:70px 0 35px;

    background:linear-gradient(
        90deg,
        transparent,
        rgba(176,122,71,.55),
        transparent
    );
}

/* ===========================
   FOOTER BOTTOM
=========================== */

.footer-bottom{
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    gap:24px;
}

.footer-copy{
    justify-self:start;
}

.footer-copy p{
    margin:0;

    font-family:var(--font-lato);
    font-size:14px;
    line-height:1.8;

    color:#BDB4A8;
}

/* ===========================
   LEGAL LINKS
=========================== */

.footer-bottom-links{
    display:flex;
    align-items:center;
    gap:28px;
}

.footer-bottom-links a{
    position:relative;

    text-decoration:none;

    font-family:var(--font-lato);
    font-size:14px;
    font-weight:500;

    color:#CFC6BA;

    transition:.35s;
}

.footer-bottom-links a::after{

    content:"";

    position:absolute;

    left:0;
    bottom:-5px;

    width:0;
    height:1px;

    background:#B07A47;

    transition:width .35s ease;

}

.footer-bottom-links a:hover{
    color:#fff;
}

.footer-bottom-links a:hover::after{
    width:100%;
}

/* ===========================
   CREDIT
=========================== */

.footer-credit{
    justify-self:end;
}

.footer-credit p{
    margin:0;

    font-family:var(--font-lato);
    font-size:14px;

    color:#BDB4A8;
}

.footer-credit a{
    position:relative;

    text-decoration:none;

    color:#B07A47;

    font-weight:600;

    transition:.35s;
}

.footer-credit a::after{

    content:"";

    position:absolute;

    left:0;
    bottom:-5px;

    width:0;
    height:1px;

    background:#B07A47;

    transition:.35s;

}

.footer-credit a:hover{
    color:#fff;
}

.footer-credit a:hover::after{
    width:100%;
}

/* ===========================
   BACK TO TOP
=========================== */

.back-top{

    position:fixed;

    right:34px;
    bottom:34px;

    width:58px;
    height:58px;

    border:none;
    outline:none;

    border-radius:50%;

    cursor:pointer;

    background:#B07A47;
    color:#fff;

    font-size:22px;

    display:flex;
    justify-content:center;
    align-items:center;

    opacity:0;
    visibility:hidden;

    transform:translateY(30px);

    transition:all .4s ease;

    box-shadow:0 15px 35px rgba(176,122,71,.28);

    z-index:999;
}

.back-top.show{

    opacity:1;
    visibility:visible;

    transform:translateY(0);

}

.back-top:hover{

    transform:translateY(-6px);

    background:#fff;
    color:#B07A47;

}

/* ===========================
   EXTRA LUXURY EFFECTS
=========================== */

.footer-column,
.footer-brand,
.footer-bottom{

    animation:fadeFooter .8s ease forwards;

}

@keyframes fadeFooter{

    from{

        opacity:0;
        transform:translateY(30px);

    }

    to{

        opacity:1;
        transform:translateY(0);

    }

}

/* Soft glow on CTA */

.footer-btn:hover{

    box-shadow:
        0 15px 40px rgba(176,122,71,.25),
        0 0 30px rgba(176,122,71,.12);

}

/* Subtle separator between columns */

.footer-column{

    position:relative;

}

.footer-column::before{

    content:"";

    position:absolute;

    left:-28px;
    top:8px;

    width:1px;
    height:85%;

    background:rgba(255,255,255,.04);

}

.footer-column:first-of-type::before{
    display:none;
}
    /* ==========================================
   RESPONSIVE - LARGE LAPTOP
========================================== */

@media (max-width:1200px){

    .footer-container{
        max-width:1100px;
        padding:85px 28px 30px;
    }

    .footer-top{
        grid-template-columns:1.7fr 1fr 1fr 1fr 1fr;
        gap:40px;
    }

    .footer-brand h2{
        font-size:36px;
    }

    .footer-brand p{
        font-size:14px;
        line-height:1.8;
    }

    .footer-column h3{
        font-size:22px;
    }

}

/* ==========================================
   RESPONSIVE - TABLET
========================================== */

@media (max-width:992px){

    .footer-container{
        padding:70px 28px 30px;
    }

    .footer-top{

        display:grid;

        grid-template-columns:repeat(2,1fr);

        gap:50px;

    }

    .footer-brand{

        max-width:100%;

        grid-column:1 / -1;

        text-align:center;

    }

    .footer-brand img{
        margin:0 auto 20px;
    }

    .footer-brand h2{
        align-items:center;
        font-size:34px;
    }

    .footer-brand p{
        max-width:600px;
        margin:0 auto 30px;
    }

    .footer-btn{
        margin:0 auto;
    }

    .footer-column{

        padding-top:0;

    }

    .footer-column::before{
        display:none;
    }

    .footer-column h3{

        font-size:22px;

        margin-bottom:24px;

    }

    .footer-column ul li{

        margin-bottom:14px;

    }

    .footer-divider{

        margin:55px 0 28px;

    }

    .footer-bottom{

        grid-template-columns:1fr;

        text-align:center;

        gap:18px;

    }

    .footer-copy,
    .footer-credit{

        justify-self:center;

    }

    .footer-bottom-links{

        justify-content:center;
        flex-wrap:wrap;

    }

}

/* ==========================================
   RESPONSIVE - MOBILE
========================================== */

@media (max-width:768px){

    .footer-container{

        padding:60px 22px 25px;

    }

    .footer-top{

        grid-template-columns:1fr;

        gap:42px;

    }

    .footer-brand{

        text-align:center;

    }

    .footer-brand h2{

        font-size:30px;

    }

    .footer-brand h2 span{

        font-size:15px;

        letter-spacing:.18em;

    }

    .footer-brand p{

        font-size:14px;

        line-height:1.75;

    }

    .footer-btn{

        width:100%;

        justify-content:center;

        padding:15px 18px;

    }

    .footer-column{

        text-align:center;

    }

    .footer-column h3::after{

        left:50%;

        transform:translateX(-50%);

    }

    .footer-column li{

        margin-bottom:12px;

    }

    .footer-column a{

        font-size:14px;

    }

    .footer-divider{

        margin:40px 0 24px;

    }

    .footer-bottom-links{

        gap:18px;

    }

    .footer-copy p,
    .footer-credit p{

        font-size:13px;

    }

    .back-top{

        right:18px;
        bottom:18px;

        width:52px;
        height:52px;

        font-size:18px;

    }

}
    /* ==========================================
   SMALL MOBILE
========================================== */

@media (max-width:480px){

    .footer-container{

        padding:50px 18px 22px;

    }

    .footer-top{

        gap:36px;

    }

    .footer-brand img{

        width:72px;
        height:72px;

    }

    .footer-brand h2{

        font-size:26px;

    }

    .footer-brand h2 span{

        font-size:13px;

        letter-spacing:.14em;

    }

    .footer-brand p{

        font-size:13px;

        line-height:1.7;

        margin-bottom:24px;

    }

    .footer-btn{

        width:100%;

        padding:14px 16px;

        font-size:12px;

    }

    .footer-column h3{

        font-size:20px;

        margin-bottom:20px;

    }

    .footer-column li{

        margin-bottom:10px;

    }

    .footer-column a{

        font-size:13px;

    }

    .footer-divider{

        margin:32px 0 20px;

    }

    .footer-bottom{

        gap:14px;

    }

    .footer-bottom-links{

        flex-direction:column;

        gap:10px;

    }

    .footer-copy p,
    .footer-credit p{

        font-size:12px;
        line-height:1.6;

    }

    .back-top{

        width:46px;
        height:46px;

        right:14px;
        bottom:14px;

        font-size:16px;

    }

}

/* ==========================================
   PREMIUM SMOOTHNESS
========================================== */

html{
    scroll-behavior:smooth;
}
.footer *{
    box-sizing:border-box;
}
.footer a{
    -webkit-tap-highlight-color:transparent;
}
.footer a,
.footer-btn,
.back-top{
    will-change:transform;
}

/* Smooth underline animation */

.footer-reveal{
    overflow:hidden;
}
.footer-reveal::after{
    transform-origin:left center;
}
/* Beautiful fade */
.footer{
    animation:footerFade .8s ease;
}

@keyframes footerFade{
    from{
        opacity:0;
    }
    to{
        opacity:1;
    }
}
      `}</style>
    </>
  );
}