import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import { telHref } from "@/lib/contact";
import { getSiteSettings } from "@/lib/settings";

// Closing band on the homepage: the last thing a visitor scrolls past before
// the footer, pointing them at the enquiry form on /contact. The weddings and
// banquet pages already end this way (components/weddings/WeddingsEnd.tsx,
// components/banquet/ContactBanner.tsx) — the homepage had no equivalent, so
// a visitor who read to the bottom had nothing to act on.
//
// A Server Component so the phone number comes from the admin-editable
// settings singleton. Class names are prefixed because this <style> tag has no
// `jsx` attribute (styled-jsx needs a Client Component) and is therefore
// global — the neighbouring sections' generic `.content` / `.text-content`
// leak site-wide for exactly this reason.
export default async function ContactCta() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="home-cta">
        <div className="home-cta-inner">

          <div className="home-cta-text">

            <span className="home-cta-eyebrow">GET IN TOUCH</span>

            <h2 className="home-cta-title">
              Planning a Stay or a Celebration?
            </h2>

            <p className="home-cta-copy">
              Tell us what you have in mind — a room for the weekend, a wedding,
              or an evening at Kaara — and our team will take it from there.
            </p>

          </div>

          <div className="home-cta-actions">

            <Link href="/contact" className="home-cta-button">
              CONTACT US
              <ArrowUpRight size={18} />
            </Link>

            {settings.phone && (
              <a
                href={telHref(settings.phone)}
                className="home-cta-phone"
              >
                <Phone size={16} />
                {settings.phone}
              </a>
            )}

          </div>

        </div>
      </section>

      <style>{`
        .home-cta{
          width:100%;
          padding:64px 0;
          background:#f4daae;
        }

        .home-cta-inner{
          width:90%;
          max-width:1200px;
          margin:0 auto;

          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:48px;
        }

        .home-cta-text{
          /* Without this the text column can't shrink below its longest line,
             so the actions get pushed off the right edge on narrow desktops. */
          min-width:0;
        }

        .home-cta-eyebrow{
          display:block;
          margin-bottom:10px;

          font-family:var(--font-playfair);
          font-size:14px;
          font-weight:600;
          text-transform:uppercase;
          letter-spacing:.08em;

          color:#a06e47;
        }

        .home-cta-title{
          margin:0 0 12px;

          font-family:var(--font-playfair);
          font-size:42px;
          font-weight:400;
          line-height:1.15;

          color:#2d2a26;
        }

        .home-cta-copy{
          margin:0;
          max-width:56ch;

          font-family:var(--font-lato);
          font-size:16px;
          line-height:1.8;

          color:#6f6b66;
        }

        .home-cta-actions{
          display:flex;
          flex-direction:column;
          align-items:stretch;
          gap:14px;

          flex-shrink:0;
        }

        .home-cta-button{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;

          padding:16px 34px;

          background:#b88a4a;
          color:#fff;
          text-decoration:none;
          white-space:nowrap;

          font-family:var(--font-lato);
          font-size:13px;
          font-weight:600;
          letter-spacing:.1em;

          transition:background .3s ease, transform .3s ease;
        }

        .home-cta-button:hover{
          background:#a6793e;
          transform:translateY(-2px);
        }

        .home-cta-phone{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;

          color:#6f5636;
          text-decoration:none;
          white-space:nowrap;

          font-family:var(--font-lato);
          font-size:15px;
          font-weight:600;

          transition:color .3s ease;
        }

        .home-cta-phone:hover{
          color:#2d2a26;
          text-decoration:underline;
        }

        @media (max-width:900px){
          .home-cta{
            padding:52px 0;
          }

          .home-cta-inner{
            flex-direction:column;
            align-items:flex-start;
            gap:28px;
          }

          .home-cta-title{
            font-size:34px;
          }

          .home-cta-actions{
            width:100%;
          }
        }

        @media (max-width:480px){
          .home-cta{
            padding:44px 0;
          }

          .home-cta-title{
            font-size:28px;
          }

          .home-cta-copy{
            font-size:15px;
          }
        }
      `}</style>
    </>
  );
}
