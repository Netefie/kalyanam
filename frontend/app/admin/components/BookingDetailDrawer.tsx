"use client";

import { useState } from "react";
import { X, CreditCard, RotateCcw, LogIn, LogOut, XCircle, AlertTriangle } from "lucide-react";
import { api, ApiError, type Booking } from "@/lib/api";
import PaymentStatusPill from "./PaymentStatusPill";
import RefundDialog from "./RefundDialog";
import CancelBookingDialog from "./CancelBookingDialog";

// The routine forward moves this drawer offers directly — mirrors
// backend/src/services/bookingLifecycle.js's ALLOWED_TRANSITIONS minus
// Cancelled, which always goes through CancelBookingDialog instead (a plain
// PATCH to Cancelled is rejected server-side once there's a captured
// payment to account for).
const NEXT_STATUS: Partial<Record<Booking["status"], { label: string; status: Booking["status"] }>> = {
  Confirmed: { label: "Check In", status: "CheckedIn" },
  CheckedIn: { label: "Check Out", status: "CheckedOut" },
};

const CANCELLABLE_STATUSES: Booking["status"][] = ["Pending", "Confirmed", "CheckedIn"];

interface BookingDetailDrawerProps {
  booking: Booking;
  onClose: () => void;
  onUpdated: (updated: Booking) => void;
}

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Slide-over with the full picture of one booking: guest, stay, price
// breakdown, and the payment/refund trail — the admin table row only has
// room for a summary, this is where staff go to actually act on a payment.
export default function BookingDetailDrawer({ booking, onClose, onUpdated }: BookingDetailDrawerProps) {
  const [current, setCurrent] = useState(booking);
  const [showRefund, setShowRefund] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");

  const fullName = `${current.guest.firstName} ${current.guest.lastName || ""}`.trim();
  const remaining = current.payment.amountPaid - current.payment.refundedAmount;
  const canRefund = ["paid", "partially_refunded"].includes(current.payment.status) && remaining > 0;
  const nextStatus = NEXT_STATUS[current.status];
  const canCancel = CANCELLABLE_STATUSES.includes(current.status);
  const needsAttention = Boolean(current.notifications?.needsAttentionAt);

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setAdvanceError("");
    setAdvancing(true);
    try {
      const updated = await api.bookings.updateStatus(current._id, nextStatus.status);
      setCurrent(updated);
      onUpdated(updated);
    } catch (err) {
      setAdvanceError(err instanceof ApiError ? err.message : "Could not update the booking status.");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}>
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="head">
            <div>
              <h3>{current.bookingCode}</h3>
              <div className="pills">
                <span className={`statusPill ${current.status.toLowerCase()}`}>{current.status}</span>
                <PaymentStatusPill status={current.payment.status} />
                {needsAttention && <span className="statusPill attention">Needs Attention</span>}
              </div>
            </div>
            <button className="closeBtn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="body">
            {needsAttention && (
              <div className="attentionBox">
                <AlertTriangle size={16} />
                This booking&apos;s payment was captured after its room hold lapsed, and the room had
                already sold to someone else. Refund the guest from here — the stay itself was cancelled
                automatically.
              </div>
            )}

            {(nextStatus || canCancel) && (
              <div className="quickActions">
                {nextStatus && (
                  <button className="advanceBtn" onClick={handleAdvance} disabled={advancing}>
                    {nextStatus.status === "CheckedIn" ? <LogIn size={16} /> : <LogOut size={16} />}
                    {advancing ? "Updating…" : nextStatus.label}
                  </button>
                )}
                {canCancel && (
                  <button className="cancelActionBtn" onClick={() => setShowCancel(true)}>
                    <XCircle size={16} /> Cancel Booking
                  </button>
                )}
              </div>
            )}
            {advanceError && <p className="advanceError">{advanceError}</p>}

            <Section title="Guest">
              <Row label="Name" value={fullName || "—"} />
              <Row label="Email" value={current.guest.email} />
              <Row label="Phone" value={current.guest.phone} />
              {current.guest.gstNumber && <Row label="GSTIN" value={current.guest.gstNumber} />}
              {current.guest.specialRequest && <Row label="Special Request" value={current.guest.specialRequest} />}
            </Section>

            <Section title="Stay">
              <Row label="Room" value={`${current.roomName}${current.ratePlanName ? ` · ${current.ratePlanName}` : ""}`} />
              <Row label="Check-in" value={formatDate(current.checkIn)} />
              <Row label="Check-out" value={formatDate(current.checkOut)} />
              <Row label="Nights / Rooms" value={`${current.nights} night(s) · ${current.rooms} room(s)`} />
              <Row label="Guests" value={`${current.adults} adult(s)${current.children ? `, ${current.children} child(ren)` : ""}`} />
              <Row label="Source" value={current.source === "admin" ? "Admin / Offline" : "Website"} />
            </Section>

            <Section title="Price Breakdown">
              <Row label="Nightly Rate" value={money(current.pricing?.nightlyRate ?? current.nightlyRate ?? 0)} />
              <Row label="Subtotal" value={money(current.pricing?.subtotal ?? 0)} />
              <Row label={`Tax (${current.pricing?.taxPercent ?? 0}%)`} value={money(current.pricing?.taxAmount ?? 0)} />
              <Row label="Total" value={<strong>{money(current.pricing?.total ?? current.amount)}</strong>} />
            </Section>

            <Section title="Payment">
              <Row label="Provider" value={current.payment.provider || "—"} />
              <Row label="Order ID" value={current.payment.orderId || "—"} />
              <Row label="Payment ID" value={current.payment.paymentId || "—"} />
              <Row
                label="Method"
                value={
                  current.payment.method
                    ? `${current.payment.method}${current.payment.cardLast4 ? ` •••• ${current.payment.cardLast4}` : ""}`
                    : "—"
                }
              />
              <Row label="Amount Paid" value={money(current.payment.amountPaid)} />
              <Row label="Paid At" value={formatDate(current.payment.paidAt)} />
              {current.payment.failureReason && (
                <Row label="Failure Reason" value={current.payment.failureReason} />
              )}
              {current.payment.refundedAmount > 0 && (
                <Row label="Refunded" value={money(current.payment.refundedAmount)} />
              )}
            </Section>

            {current.payment.refunds.length > 0 && (
              <Section title="Refund History">
                {current.payment.refunds.map((r) => (
                  <Row
                    key={r.refundId}
                    label={formatDate(r.createdAt)}
                    value={`${money(r.amount)}${r.reason ? ` — ${r.reason}` : ""}`}
                  />
                ))}
              </Section>
            )}

            {canRefund && (
              <button className="refundBtn" onClick={() => setShowRefund(true)}>
                <RotateCcw size={16} /> Issue Refund ({money(remaining)} available)
              </button>
            )}

            {current.payment.status === "created" && (
              <p className="note">
                <CreditCard size={14} /> This booking hasn&apos;t been paid yet — nothing to refund.
              </p>
            )}
          </div>
        </div>
      </div>

      {showRefund && (
        <RefundDialog
          booking={current}
          onClose={() => setShowRefund(false)}
          onRefunded={(updated) => {
            setCurrent(updated);
            onUpdated(updated);
            setShowRefund(false);
          }}
        />
      )}

      {showCancel && (
        <CancelBookingDialog
          booking={current}
          onClose={() => setShowCancel(false)}
          onCancelled={(updated) => {
            setCurrent(updated);
            onUpdated(updated);
            setShowCancel(false);
          }}
        />
      )}

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 900;
          display: flex;
          justify-content: flex-end;
        }

        .drawer {
          width: 100%;
          max-width: 460px;
          height: 100%;
          background: #f8f5ef;
          overflow-y: auto;
          box-shadow: -20px 0 50px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 24px 16px;
          background: #fff;
          border-bottom: 1px solid #ece4d6;
          position: sticky;
          top: 0;
        }

        .head h3 {
          margin: 0 0 8px;
          font-size: 24px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .statusPill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: #fef3c7;
          color: #b45309;
        }

        .statusPill.confirmed {
          background: #dcfce7;
          color: #15803d;
        }
        .statusPill.cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }
        .statusPill.checkedin {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .statusPill.checkedout {
          background: #ede9fe;
          color: #6d28d9;
        }
        .statusPill.expired {
          background: #f3f4f6;
          color: #6b7280;
        }
        .statusPill.attention {
          background: #fee2e2;
          color: #b91c1c;
        }

        .attentionBox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .quickActions {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }

        .advanceBtn {
          flex: 1;
          height: 46px;
          border: none;
          border-radius: 12px;
          background: #b68d40;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .advanceBtn:hover:not(:disabled) {
          background: #a57d35;
        }

        .advanceBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancelActionBtn {
          flex: 1;
          height: 46px;
          border: 1px solid #f5c6c6;
          border-radius: 12px;
          background: #fff;
          color: #b91c1c;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .cancelActionBtn:hover {
          background: #fdecec;
        }

        .advanceError {
          color: #b91c1c;
          font-size: 13px;
          margin: 8px 0 16px;
        }

        .closeBtn {
          border: none;
          background: #f4efe6;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .body {
          padding: 20px 24px 32px;
        }

        .refundBtn {
          width: 100%;
          margin-top: 8px;
          height: 48px;
          border: none;
          border-radius: 12px;
          background: #b91c1c;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .refundBtn:hover {
          background: #991616;
        }

        .note {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #999;
        }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section">
      <h4>{title}</h4>
      {children}
      <style jsx>{`
        .section {
          background: #fff;
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }
        h4 {
          margin: 0 0 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #b68d40;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      <style jsx>{`
        .row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 7px 0;
          font-size: 14px;
          border-bottom: 1px dashed #f0ece2;
        }
        .row:last-child {
          border-bottom: none;
        }
        .label {
          color: #888;
          flex-shrink: 0;
        }
        .value {
          color: #222;
          text-align: right;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
