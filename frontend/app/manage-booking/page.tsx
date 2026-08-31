"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Users, BedDouble, Search, XCircle, CheckCircle2 } from "lucide-react";
import { api, ApiError, type Booking } from "@/lib/api";
import { formatINR } from "@/lib/pricing";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

type Stage = "lookup" | "found" | "cancelled";

// Guest self-service: look up a booking by its code + email (same pairing
// GET /payments/lookup already uses, so a leaked/guessed code alone can't
// pull up someone else's stay), then optionally cancel it. Cancellation
// itself is POST /bookings/cancel — see
// backend/src/controllers/bookingController.js#cancelBookingSelf for the
// refund-eligibility rules (rate plan refundability + the configured
// cancellation window) this defers to.
export default function ManageBookingPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("lookup");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const found = await api.payments.lookup(code.trim(), email.trim());
      setBooking(found);
      setStage(found.status === "Cancelled" ? "cancelled" : "found");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelError("");
    setCancelling(true);
    try {
      const updated = await api.bookings.cancel({
        code: code.trim(),
        email: email.trim(),
        reason: cancelReason.trim() || undefined,
      });
      setBooking(updated);
      setStage("cancelled");
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : "Could not cancel this booking.");
    } finally {
      setCancelling(false);
      setConfirmingCancel(false);
    }
  };

  return (
    <section className="bg-[#faf8f4] py-16 min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8 text-center">
          <h1 className="font-cormorant text-4xl text-[#2d2d2d] sm:text-5xl">Manage Your Booking</h1>
          <p className="mt-3 text-gray-500">
            Look up your reservation with your booking reference and email to view or cancel it.
          </p>
        </div>

        {stage === "lookup" && (
          <form
            onSubmit={handleLookup}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#222]">Booking Reference</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="BK-1042"
                  required
                  className="w-full rounded-lg border border-[#B68D40] p-3 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#222]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-[#B68D40] p-3 outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#B68D40] py-3.5 font-semibold text-white transition hover:bg-[#9f7b37] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Search size={16} />
              {loading ? "Looking up…" : "Find My Booking"}
            </button>
          </form>
        )}

        {stage === "found" && booking && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-cormorant text-2xl text-[#2d2d2d]">{booking.bookingCode}</p>
              <span className="rounded-full bg-[#B68D40]/10 px-4 py-1.5 text-sm font-semibold text-[#B68D40]">
                {booking.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {booking.roomName}
              {booking.ratePlanName ? ` · ${booking.ratePlanName}` : ""}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Detail icon={<CalendarDays size={16} />} label="Check In" value={fmtDate(booking.checkIn)} />
              <Detail icon={<CalendarDays size={16} />} label="Check Out" value={fmtDate(booking.checkOut)} />
              <Detail
                icon={<Users size={16} />}
                label="Guests"
                value={`${booking.adults}${booking.children ? ` + ${booking.children}` : ""}`}
              />
              <Detail icon={<BedDouble size={16} />} label="Rooms" value={`${booking.rooms} · ${booking.nights} night${booking.nights > 1 ? "s" : ""}`} />
            </div>

            <div className="mt-6 flex justify-between border-t pt-4 text-base">
              <span className="font-semibold text-[#222]">Total Paid</span>
              <span className="font-bold text-[#B68D40]">{formatINR(booking.payment.amountPaid || booking.amount)}</span>
            </div>

            {["Pending", "Confirmed"].includes(booking.status) && (
              <div className="mt-8 border-t pt-6">
                {!confirmingCancel ? (
                  <button
                    onClick={() => setConfirmingCancel(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <XCircle size={16} /> Cancel this booking
                  </button>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                      Are you sure you want to cancel this booking? If you&apos;re eligible for a refund, it
                      will be processed automatically to your original payment method.
                    </p>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason (optional)"
                      rows={2}
                      className="mt-3 w-full rounded-lg border border-red-200 p-2 text-sm outline-none"
                    />
                    {cancelError && <p className="mt-2 text-sm text-red-700">{cancelError}</p>}
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="flex-1 rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                      >
                        {cancelling ? "Cancelling…" : "Yes, cancel it"}
                      </button>
                      <button
                        onClick={() => setConfirmingCancel(false)}
                        disabled={cancelling}
                        className="flex-1 rounded-lg border border-gray-300 py-2.5 font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Keep booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setStage("lookup");
                setBooking(null);
              }}
              className="mt-6 w-full text-center text-sm font-medium text-gray-500 hover:text-[#B68D40]"
            >
              Look up a different booking
            </button>
          </div>
        )}

        {stage === "cancelled" && booking && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <CheckCircle2 size={48} className="mx-auto text-green-600" />
            <h2 className="mt-4 font-cormorant text-3xl text-[#2d2d2d]">Booking Cancelled</h2>
            <p className="mt-2 text-gray-500">
              {booking.bookingCode} has been cancelled.
              {booking.payment.refundedAmount > 0 &&
                ` A refund of ${formatINR(booking.payment.refundedAmount)} is on its way to your original payment method.`}
            </p>
            <Link
              href="/accommodations"
              className="mt-6 inline-block rounded-lg bg-[#B68D40] px-8 py-3 font-semibold text-white transition hover:bg-[#9f7b37]"
            >
              Book Another Stay
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function Detail({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-400">
        {icon && <span className="text-[#B68D40]">{icon}</span>}
        {label}
      </p>
      <p className="mt-1 font-medium text-[#222]">{value}</p>
    </div>
  );
}
