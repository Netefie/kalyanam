"use client";

import { useId, useState } from "react";
import { Mail, Phone } from "lucide-react";

import { api, ApiError } from "@/lib/api";
import { mailHref, telHref } from "@/lib/contact";
import { useSettings } from "@/components/SettingsProvider";

// Closing enquiry form, placed directly above the footer on pages that end
// without one of their own (the homepage and /accommodations). Posts the same
// "contact" enquiry as the full form on /contact (components/contact/ContactInfo.tsx),
// so it lands in the admin Enquiries list and triggers the same guest
// acknowledgement and staff alert.
//
// `subject` is sent with every submission rather than asked for, so staff can
// tell which page an enquiry came from without the guest filling in a field.

interface ContactFormSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  subject: string;
}

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

export default function ContactFormSection({
  eyebrow = "GET IN TOUCH",
  title = "Planning a Stay or a Celebration?",
  description = "Tell us what you have in mind — a room for the weekend, a wedding, or an evening at Kaara — and our team will take it from there.",
  subject,
}: ContactFormSectionProps) {
  const settings = useSettings();
  const id = useId();

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Editing after a successful send starts a new enquiry.
    if (status === "sent") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }

    setStatus("sending");
    try {
      await api.enquiries.create({ type: "contact", subject, ...form });
      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof ApiError ? err.message : "Could not send your enquiry."
      );
    }
  };

  return (
    <>
      <section className="enquiry-section">
        <div className="enquiry-inner">

          <div className="enquiry-text">

            <span className="enquiry-eyebrow">{eyebrow}</span>

            <h2 className="enquiry-title">{title}</h2>

            <p className="enquiry-copy">{description}</p>

            <div className="enquiry-links">
              {settings.phone && (
                <a href={telHref(settings.phone)} className="enquiry-link">
                  <Phone size={16} />
                  {settings.phone}
                </a>
              )}

              {settings.email && (
                <a href={mailHref(settings.email)} className="enquiry-link">
                  <Mail size={16} />
                  {settings.email}
                </a>
              )}
            </div>

          </div>

          <form className="enquiry-form" onSubmit={handleSubmit} noValidate>

            <div className="enquiry-row">

              <div className="enquiry-field">
                <label htmlFor={`${id}-name`}>Full Name</label>
                <input
                  id={`${id}-name`}
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div className="enquiry-field">
                <label htmlFor={`${id}-email`}>Email Address</label>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>

            </div>

            <div className="enquiry-field">
              <label htmlFor={`${id}-phone`}>
                Phone Number <span>(optional)</span>
              </label>
              <input
                id={`${id}-phone`}
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>

            <div className="enquiry-field">
              <label htmlFor={`${id}-message`}>Your Message</label>
              <textarea
                id={`${id}-message`}
                rows={4}
                placeholder="Tell us about your stay, wedding, celebration or enquiry..."
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>

            {error && (
              <p className="enquiry-feedback error" role="alert">
                {error}
              </p>
            )}

            {status === "sent" && (
              <p className="enquiry-feedback success" role="status">
                Thank you! Your enquiry has been sent — our team will reach out
                shortly.
              </p>
            )}

            <button
              type="submit"
              className="enquiry-submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "SENDING…" : "SEND ENQUIRY →"}
            </button>

          </form>

        </div>
      </section>

      <style jsx>{`
        .enquiry-section{
          width:100%;
          padding:72px 0;
          background:#f4daae;
        }

        .enquiry-inner{
          width:90%;
          max-width:1200px;
          margin:0 auto;

          display:grid;
          /* minmax(0, …) so neither column's min-content (a long email
             address, the inputs' intrinsic width) can push the grid wider
             than the page. */
          grid-template-columns:minmax(0,5fr) minmax(0,6fr);
          align-items:center;
          gap:56px;
        }

        .enquiry-eyebrow{
          display:block;
          margin-bottom:10px;

          font-family:var(--font-playfair);
          font-size:14px;
          font-weight:600;
          text-transform:uppercase;
          letter-spacing:.08em;

          color:#a06e47;
        }

        .enquiry-title{
          margin:0 0 14px;

          font-family:var(--font-playfair);
          font-size:42px;
          font-weight:400;
          line-height:1.15;

          color:#2d2a26;
        }

        .enquiry-copy{
          margin:0;
          max-width:46ch;

          font-family:var(--font-lato);
          font-size:16px;
          line-height:1.8;

          color:#6f6b66;
        }

        .enquiry-links{
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:12px;

          margin-top:28px;
        }

        .enquiry-link{
          display:inline-flex;
          align-items:center;
          gap:10px;
          max-width:100%;

          color:#6f5636;
          text-decoration:none;
          overflow-wrap:anywhere;

          font-family:var(--font-lato);
          font-size:15px;
          font-weight:600;

          transition:color .3s ease;
        }

        .enquiry-link:hover{
          color:#2d2a26;
          text-decoration:underline;
        }

        .enquiry-form{
          display:flex;
          flex-direction:column;
          gap:18px;

          padding:36px;

          background:#fff;
          border:1px solid #efe5da;
          border-radius:10px;
          box-shadow:0 22px 60px rgba(0,0,0,.06);
        }

        .enquiry-row{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        }

        .enquiry-field{
          display:flex;
          flex-direction:column;
          min-width:0;
        }

        .enquiry-field label{
          margin-bottom:6px;

          font-family:var(--font-lato);
          font-size:12px;
          font-weight:700;
          letter-spacing:.12em;
          text-transform:uppercase;

          color:#8b6540;
        }

        .enquiry-field label span{
          font-weight:400;
          letter-spacing:.04em;
          text-transform:none;
          color:#a8998a;
        }

        .enquiry-field input,
        .enquiry-field textarea{
          width:100%;
          padding:11px 14px;

          border:1px solid #e5ddd3;
          border-radius:6px;
          background:#fff;

          font-family:var(--font-lato);
          font-size:14px;
          color:#444;

          transition:border-color .3s ease;
        }

        .enquiry-field textarea{
          resize:none;
        }

        .enquiry-field input:focus,
        .enquiry-field textarea:focus{
          outline:none;
          border-color:#b07a47;
        }

        .enquiry-feedback{
          margin:0;
          padding:12px 16px;
          border-radius:8px;

          font-family:var(--font-lato);
          font-size:14px;
        }

        .enquiry-feedback.error{
          background:#fdecec;
          border:1px solid #f5c6c6;
          color:#b91c1c;
        }

        .enquiry-feedback.success{
          background:#e9f7ef;
          border:1px solid #bfe6cf;
          color:#1b7a44;
        }

        .enquiry-submit{
          align-self:flex-start;

          padding:14px 34px;

          border:none;
          border-radius:6px;
          background:#b88a4a;
          color:#fff;
          cursor:pointer;

          font-family:var(--font-lato);
          font-size:13px;
          font-weight:700;
          letter-spacing:.1em;

          transition:background .3s ease, transform .3s ease;
        }

        .enquiry-submit:hover{
          background:#a6793e;
          transform:translateY(-2px);
        }

        .enquiry-submit:disabled{
          opacity:.7;
          cursor:not-allowed;
          transform:none;
        }

        @media (max-width:900px){
          .enquiry-section{
            padding:56px 0;
          }

          .enquiry-inner{
            grid-template-columns:minmax(0,1fr);
            gap:32px;
          }

          .enquiry-title{
            font-size:34px;
          }
        }

        @media (max-width:600px){
          .enquiry-section{
            padding:44px 0;
          }

          .enquiry-title{
            font-size:28px;
          }

          .enquiry-copy{
            font-size:15px;
          }

          .enquiry-form{
            padding:22px;
          }

          .enquiry-row{
            grid-template-columns:minmax(0,1fr);
          }

          .enquiry-submit{
            align-self:stretch;
          }
        }
      `}</style>
    </>
  );
}
