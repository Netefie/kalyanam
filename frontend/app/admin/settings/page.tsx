"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type SiteSettings } from "@/lib/api";

// Editable form state mirrors SiteSettings minus `key` (immutable) and the
// timestamps the API adds — see backend/src/models/Settings.js.
type FormState = Omit<SiteSettings, "key">;

const EMPTY: FormState = {
  hotelName: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  taxPercent: 18,
  currency: "INR",
  cancellationWindowHours: 24,
  socials: { instagram: "", facebook: "", youtube: "" },
  policies: { cancellation: "", houseRules: "" },
};

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.settings
      .get()
      .then(({ key: _key, ...rest }) => setForm(rest))
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const setSocial = (key: keyof FormState["socials"], value: string) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));

  const setPolicy = (key: keyof FormState["policies"], value: string) =>
    setForm((f) => ({ ...f, policies: { ...f.policies, [key]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { key: _key, ...rest } = await api.settings.update(form);
      setForm(rest);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading settings…</p>;
  }

  return (
    <div className="settingsPage">
      <div className="header">
        <div>
          <h2>Settings</h2>
          <p>Site-wide details used across the website, emails and booking flow.</p>
        </div>
      </div>

      {error && <div className="errorBox">{error}</div>}
      {saved && <div className="successBox">Settings saved.</div>}

      <form onSubmit={handleSubmit}>
        <section className="card">
          <h3>Hotel details</h3>
          <div className="row">
            <div className="field">
              <label>Hotel name</label>
              <input value={form.hotelName} onChange={(e) => set("hotelName", e.target.value)} />
            </div>
            <div className="field">
              <label>Tagline</label>
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>Contact email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Address</label>
            <textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
        </section>

        <section className="card">
          <h3>Stay policy</h3>
          <p className="hint">
            Drives what the booking flow actually charges and enforces — the GST rate on every quote
            (backend/src/services/pricing.js) and how close to check-in a guest can still cancel online for a
            full refund (backend/src/controllers/bookingController.js#cancelBookingSelf).
          </p>
          <div className="row">
            <div className="field">
              <label>Check-in time</label>
              <input type="time" value={form.checkInTime} onChange={(e) => set("checkInTime", e.target.value)} />
            </div>
            <div className="field">
              <label>Check-out time</label>
              <input type="time" value={form.checkOutTime} onChange={(e) => set("checkOutTime", e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>GST / tax (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.taxPercent}
                onChange={(e) => set("taxPercent", Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Free cancellation window (hours before check-in)</label>
              <input
                type="number"
                min={0}
                value={form.cancellationWindowHours}
                onChange={(e) => set("cancellationWindowHours", Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="card">
          <h3>Policies</h3>
          <div className="field">
            <label>Cancellation policy (shown on the public policy page)</label>
            <textarea
              rows={4}
              value={form.policies.cancellation}
              onChange={(e) => setPolicy("cancellation", e.target.value)}
            />
          </div>
          <div className="field">
            <label>House rules</label>
            <textarea
              rows={4}
              value={form.policies.houseRules}
              onChange={(e) => setPolicy("houseRules", e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <h3>Socials</h3>
          <div className="row">
            <div className="field">
              <label>Instagram URL</label>
              <input value={form.socials.instagram} onChange={(e) => setSocial("instagram", e.target.value)} />
            </div>
            <div className="field">
              <label>Facebook URL</label>
              <input value={form.socials.facebook} onChange={(e) => setSocial("facebook", e.target.value)} />
            </div>
            <div className="field">
              <label>YouTube URL</label>
              <input value={form.socials.youtube} onChange={(e) => setSocial("youtube", e.target.value)} />
            </div>
          </div>
        </section>

        <button type="submit" className="saveBtn" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>

      <style jsx>{`
        .settingsPage {
          padding: 4px;
          max-width: 860px;
        }

        .header {
          margin-bottom: 26px;
        }

        .header h2 {
          margin: 0;
          font-size: 34px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .header p {
          margin-top: 6px;
          color: #777;
        }

        .muted {
          color: #999;
          padding: 40px 0;
        }

        .errorBox {
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .successBox {
          background: #eefbf1;
          border: 1px solid #bfe8cb;
          color: #1c7a3c;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          padding: 24px;
          margin-bottom: 20px;
        }

        .card h3 {
          margin: 0 0 6px;
          font-size: 18px;
          color: #222;
        }

        .hint {
          margin: 0 0 16px;
          font-size: 13px;
          color: #888;
          line-height: 1.5;
        }

        .row {
          display: flex;
          gap: 16px;
        }

        .row .field {
          flex: 1;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #555;
        }

        input,
        textarea {
          border: 1px solid #e2ddd0;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
          color: #222;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #b68d40;
        }

        .saveBtn {
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          background: #b68d40;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .saveBtn:hover {
          background: #a57d35;
        }

        .saveBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
