"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { api, ApiError, type Booking } from "@/lib/api";

interface CancelBookingDialogProps {
  booking: Booking;
  onClose: () => void;
  onCancelled: (updated: Booking) => void;
}

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Admin cancellation. Mirrors the guard in
// backend/src/services/bookingLifecycle.js#cancelBooking: a booking with a
// captured, unrefunded payment requires a refund amount before it can be
// cancelled, so the form always shows the field once there's money to
// account for — there's no way to silently drop it on the floor.
export default function CancelBookingDialog({ booking, onClose, onCancelled }: CancelBookingDialogProps) {
  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;
  const hasCapturedPayment = ["paid", "partially_refunded"].includes(booking.payment.status) && remaining > 0;

  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState(String(remaining));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let refund: { amount?: number; reason?: string } | undefined;
    if (hasCapturedPayment) {
      const value = Number(refundAmount);
      if (!Number.isFinite(value) || value <= 0) {
        setError("Enter a valid refund amount.");
        return;
      }
      if (value > remaining) {
        setError(`Refund amount cannot exceed the remaining ${money(remaining)}.`);
        return;
      }
      refund = { amount: value, reason: reason.trim() || undefined };
    }

    setSubmitting(true);
    try {
      const updated = await api.bookings.cancelAdmin(booking._id, { reason: reason.trim() || undefined, refund });
      onCancelled(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not cancel this booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <h3>Cancel Booking</h3>
          <button type="button" onClick={onClose} className="closeBtn">
            <X size={20} />
          </button>
        </div>

        <p className="sub">
          Booking <strong>{booking.bookingCode}</strong>
          {hasCapturedPayment && ` · ${money(booking.payment.amountPaid)} captured`}
        </p>

        <form onSubmit={handleSubmit}>
          {hasCapturedPayment && (
            <div className="field">
              <label>Refund amount (₹) — up to {money(remaining)}</label>
              <input
                type="number"
                min={1}
                max={remaining}
                step={1}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
            </div>
          )}

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
              Keep booking
            </button>
            <button type="submit" className="confirmBtn" disabled={submitting}>
              {submitting ? "Cancelling…" : "Cancel booking"}
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
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1100;
        }

        .modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
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
