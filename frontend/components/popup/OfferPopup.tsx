"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export default function OfferPopup() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    const alreadyShown = localStorage.getItem("kalyanam-popup");

    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setOpen(false);
    document.body.style.overflow = "auto";
    localStorage.setItem("kalyanam-popup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");

    try {
      await api.subscribers.create(form);
      setStatus("done");
      // Show the thank-you briefly, then dismiss (won't show again).
      setTimeout(closePopup, 1800);
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not subscribe right now. Please try again."
      );
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="popup-overlay" onClick={closePopup}></div>

      <div className="popup-panel">

        <button
          className="close-btn"
          onClick={closePopup}
        >
          ×
        </button>

        <div className="popup-content">

          <h2>
            Stay in touch for
            <br />
            exclusive offers
          </h2>

          <p>
            Share your details with us to receive
            exclusive offers and updates.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />

            {error && (
              <p className="feedback error">{error}</p>
            )}

            {status === "done" && (
              <p className="feedback success">
                Thank you for subscribing!
              </p>
            )}

            <button
              type="submit"
              className="subscribe-btn"
              disabled={status !== "idle"}
            >
              {status === "sending"
                ? "SUBSCRIBING…"
                : status === "done"
                ? "SUBSCRIBED ✓"
                : "SUBSCRIBE"}
            </button>

          </form>

          <div className="follow-text">
            Follow us on
            <span> Instagram </span>
            &
            <span> Facebook</span>
          </div>

        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9998;
  animation: fadeIn .4s ease;
}

.popup-panel {
  position: fixed;
  top: 0;
  right: 0;

  width: 30%;
  min-width: 420px;
  max-width: 520px;
  height: 100vh;

  background: #F8F5EE;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 60px;

  box-shadow: -20px 0 60px rgba(0,0,0,.18);

  animation: slideIn .6s cubic-bezier(.22,.61,.36,1);
}

.popup-content{
  width:100%;
}

.close-btn{
  position:absolute;
  top:30px;
  right:30px;

  width:44px;
  height:44px;

  border:none;
  background:white;

  border-radius:50%;

  font-size:28px;
  cursor:pointer;

  transition:.3s;
}

.close-btn:hover{
  transform:rotate(90deg);
}

.popup-content h2{
  font-family:var(--font-playfair);
  font-size:36px;
  line-height:1.2;
  font-weight:500;
  color:#6E4628;
  margin:0 0 10px;
}

.popup-content p{
  font-family:var(--font-lato);
  font-size:16px;
  line-height:1.4;
  color:#777171;
  margin-bottom:20px;
}

form{
  display:flex;
  flex-direction:column;
  gap:12px;
}

input{
  width:100%;

  padding:8px 20px;

  border:1px solid #D8D2C8;
  background:white;

  outline:none;

  font-family:var(--font-lato);
  font-size:15px;

  transition:.3s;
}

input:focus{
  border-color:#9E7047;
}

.subscribe-btn{
  margin-top:10px;
  width:100%;
  padding:8px;
  background:#A57347;
  color:white;
  border:none;
  cursor:pointer;
  font-family:var(--font-playfair);
  font-size:17px;
  font-weight:600;
  letter-spacing:.05em;
  transition:.35s;
}

.subscribe-btn:hover{
  background:#8B603C;
}

.subscribe-btn:disabled{
  opacity:.75;
  cursor:not-allowed;
}

.feedback{
  margin:4px 0 0;
  padding:10px 14px;
  border-radius:6px;
  font-family:var(--font-lato);
  font-size:14px;
}

.feedback.error{
  background:#FDECEC;
  border:1px solid #F5C6C6;
  color:#B91C1C;
}

.feedback.success{
  background:#E9F7EF;
  border:1px solid #BFE6CF;
  color:#1B7A44;
}

.follow-text{
  margin-top:35px;
  text-align:center;
  font-family:var(--font-lato);
  color:#777;
}

.follow-text span{
  color:#A57347;
  font-weight:600;
}

@keyframes slideIn{

  from{
    transform:translateX(100%);
  }

  to{
    transform:translateX(0);
  }

}

@keyframes fadeIn{

  from{
    opacity:0;
  }

  to{
    opacity:1;
  }

}

/* Tablet */

@media(max-width:1200px){

.popup-panel{
  width:40%;
  min-width:380px;
}

.popup-content h2{
  font-size:38px;
}

}

/* Mobile */

@media(max-width:768px){

.popup-panel{

  width:100%;
  min-width:100%;
  max-width:100%;

  padding:35px;

}

.popup-content h2{
  font-size:32px;
}

.popup-content p{
  font-size:15px;
}

}
      `}</style>
    </>
  );
}