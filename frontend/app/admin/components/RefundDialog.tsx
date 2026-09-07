"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { api, ApiError, type Booking } from "@/lib/api";

interface RefundDialogProps {
  booking: Booking;
  onClose: () => void;
  onRefunded: (updated: Booking) => void;
}

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Full or partial refund for a paid booking. Mirrors the guard logic in
// backend/src/controllers/paymentController.js#refundBooking (amount must
// be between ₹1 and the remaining refundable balance) so the dialog can
// show a useful inline error instead of just surfacing the API's 400.
export default function RefundDialog({ booking, onClose, onRefunded }: RefundDialogProps) {
  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;

  const [amount, setAmount] = useState(String(remaining));
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid refund amount.");
      return;
    }
    if (value > remaining) {
      setError(`Refund amount cannot exceed the remaining ${money(remaining)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const updated = await api.payments.refund(booking._id, { amount: value, reason: reason.trim() });
      onRefunded(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not process the refund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <h3>Issue Refund</h3>
          <button type="button" onClick={onClose} className="closeBtn">
            <X size={20} />
          </button>
        </div>

        <p className="sub">
          Booking <strong>{booking.bookingCode}</strong> · Paid {money(booking.payment.amountPaid)}
          {booking.payment.refundedAmount > 0 && ` · Already refunded ${money(booking.payment.refundedAmount)}`}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Refund amount (₹) — up to {money(remaining)}</label>
            <input
              type="number"
              min={1}
              max={remaining}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Reason (optional, shown to the guest)</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          {error && (
            <div className="errorBox">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div className="actions">
            <button type="button" className="cancelBtn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="confirmBtn" disabled={submitting}>
              {submitting ? "Processing…" : `Refund ${amount ? money(Number(amount) || 0) : ""}`}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          /* "safe" degrades to start-alignment once the modal is taller than the
             viewport, instead of overflowing equally off the top and bottom
             where the top half is beyond the reach of any scrollbar. */
          align-items: safe center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
          z-index: 1100;
        }

        .modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          /* A fixed overlay sits outside page scroll, so anything past the
             bottom of the viewport can never be scrolled to. Cap it to the
             space inside the backdrop padding and scroll internally instead —
             this is what breaks when the browser is zoomed in. */
          max-height: calc(100dvh - 48px);
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 28px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
        }

        .modalHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .modalHead h3 {
          margin: 0;
          font-size: 24px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .closeBtn {
          border: none;
          background: #f4efe6;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sub {
          margin: 0 0 20px;
          font-size: 13px;
          color: #777;
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
          color: #666;
        }

        input,
        textarea {
          border: 1px solid #e2d9c8;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
        }

        input:focus,
        textarea:focus {
          border-color: #b68d40;
        }

        .errorBox {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        .cancelBtn {
          height: 44px;
          padding: 0 20px;
          border-radius: 10px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
        }

        .confirmBtn {
          height: 44px;
          padding: 0 22px;
          border: none;
          border-radius: 10px;
          background: #b91c1c;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .confirmBtn:disabled,
        .cancelBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .confirmBtn:hover:not(:disabled) {
          background: #991616;
        }
      `}</style>
    </div>
  );
}
