"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  BedDouble,
  ChevronLeft,
  ShieldCheck,
  Lock,
  RotateCcw,
} from "lucide-react";

import { useBookingContext } from "./context/BookingContext";
import { useSettings } from "@/components/SettingsProvider";
import { api, ApiError } from "@/lib/api";
import { formatINR } from "@/lib/pricing";
import useBookingQuote from "@/hooks/useBookingQuote";
import {
  openCheckout,
  PaymentDismissedError,
  PaymentFailedError,
  type RazorpaySuccessResponse,
} from "@/lib/razorpay";

const MAX_VERIFY_ATTEMPTS = 5;
const VERIFY_RETRY_MS = 2500;

export default function PaymentConfirmation() {
  const { booking, setBooking, nights } = useBookingContext();
  const settings = useSettings();
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");

  const room = booking.selectedRoom;
  const plan = booking.selectedRatePlan;

  const { quote, loading: quoteLoading, error: quoteError } = useBookingQuote({
    roomSlug: room?.slug,
    ratePlanCode: plan?.code,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    rooms: booking.rooms,
  });

  const flow = booking.payment.status;
  const busy = flow === "creating" || flow === "awaiting-checkout" || flow === "verifying";
  const canRetry = flow === "failed" || flow === "dismissed";

  // The quote already carries live availability (POST /bookings/quote —
  // see hooks/useBookingQuote.ts); an in-progress payment attempt already
  // holds its own rooms via /payments/order, so this guard only applies
  // before that hold exists — otherwise a guest who's mid-retry after a
  // declined card would be wrongly blocked by their own hold no longer
  // showing as "available" to a fresh quote.
  const hasActiveHold =
    Boolean(booking.payment.holdExpiresAt) &&
    new Date(booking.payment.holdExpiresAt as string).getTime() > Date.now();
  const insufficientAvailability =
    Boolean(quote) && !hasActiveHold && quote!.availability.available < booking.rooms;

  if (!room) return null;

  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "--";
  const guestName = `${booking.guest.firstName} ${booking.guest.lastName || ""}`.trim();

  async function verifyAndSettle(bookingId: string, response: RazorpaySuccessResponse, attempt = 1) {
    const result = await api.payments.verify({
      bookingId,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    if (result.status === "paid") {
      setBooking((prev) => ({
        ...prev,
        bookingCode: result.booking.bookingCode,
        currentStep: 4,
        payment: { ...prev.payment, status: "paid", error: null },
      }));
      return;
    }

    if (result.status === "failed") {
      setBooking((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          status: "failed",
          error: result.booking.payment.failureReason || "Your payment was declined. Please try again.",
        },
      }));
      return;
    }

    // "processing" — authorized but not yet captured. Poll a few times
    // before settling into a persistent "still confirming" state; the
    // webhook (services/paymentReconciler.js) will finish the job even if
    // this tab is closed, so we deliberately never let this fall through to
    // "failed" (which would invite a second, duplicate charge attempt).
    if (attempt >= MAX_VERIFY_ATTEMPTS) {
      setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "processing", error: null } }));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, VERIFY_RETRY_MS));
    return verifyAndSettle(bookingId, response, attempt + 1);
  }

  async function handlePay() {
    if (!agreed) {
      setAgreeError("Please accept the cancellation & refund policy to continue.");
      return;
    }
    setAgreeError("");

    if (!booking.checkIn || !booking.checkOut || !room || !quote) {
      setBooking((prev) => ({
        ...prev,
        payment: { ...prev.payment, error: "Please select your check-in and check-out dates first." },
      }));
      return;
    }

    if (insufficientAvailability) {
      // Belt-and-suspenders: the button is already disabled for this case,
      // but the actual guarantee against overbooking is server-side (see
      // backend/src/services/availability.js#reserveInventory) — this just
      // stops a stale click from opening a Razorpay order for a room that
      // isn't there.
      setBooking((prev) => ({
        ...prev,
        payment: { ...prev.payment, error: "Sorry, this room is no longer available for your selected dates." },
      }));
      return;
    }

    try {
      let { bookingId, orderId, keyId, bookingCode } = booking.payment;
      const holdValid =
        Boolean(booking.payment.holdExpiresAt) &&
        new Date(booking.payment.holdExpiresAt as string).getTime() > Date.now();

      // Reuse the existing order on a retry (dismissed modal / declined
      // card) rather than opening a second hold on the room — only issue a
      // fresh order when there isn't one yet, or the previous hold lapsed.
      if (!bookingId || !orderId || !holdValid) {
        setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "creating", error: null } }));

        const res = await api.payments.order({
          guest: booking.guest,
          roomSlug: room.slug,
          ratePlanCode: plan?.code,
          checkIn: booking.checkIn.toISOString(),
          checkOut: booking.checkOut.toISOString(),
          adults: booking.adults,
          children: booking.children,
          rooms: booking.rooms,
        });

        bookingId = res.booking._id;
        orderId = res.order.id;
        keyId = res.keyId;
        bookingCode = res.booking.bookingCode;

        setBooking((prev) => ({
          ...prev,
          payment: {
            ...prev.payment,
            bookingId,
            bookingCode,
            orderId,
            keyId,
            holdExpiresAt: res.holdExpiresAt,
            status: "awaiting-checkout",
            error: null,
          },
        }));
      } else {
        setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "awaiting-checkout", error: null } }));
      }

      const response = await openCheckout({
        keyId: keyId as string,
        amount: Math.round(quote.total * 100),
        currency: quote.currency,
        orderId: orderId as string,
        name: settings.hotelName,
        description: `${room.title} · ${plan?.name ?? "Reservation"}`,
        prefill: {
          name: guestName,
          email: booking.guest.email,
          contact: booking.guest.phone,
        },
      });

      setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "verifying", error: null } }));
      await verifyAndSettle(bookingId as string, response);
    } catch (err) {
      if (err instanceof PaymentDismissedError) {
        setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "dismissed", error: null } }));
      } else if (err instanceof PaymentFailedError) {
        setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "failed", error: err.message } }));
      } else if (err instanceof ApiError) {
        setBooking((prev) => ({ ...prev, payment: { ...prev.payment, status: "failed", error: err.message } }));
      } else {
        setBooking((prev) => ({
          ...prev,
          payment: { ...prev.payment, status: "failed", error: "Something went wrong. Please try again." },
        }));
      }
    }
  }

  async function handleRefreshStatus() {
    if (!booking.payment.bookingId || !booking.payment.orderId) return;
    // Re-check via the guest lookup rather than re-verifying (we don't have
    // a fresh payment id to re-verify against) — this only reads state.
    try {
      const found = await api.payments.lookup(booking.payment.bookingCode || "", booking.guest.email);
      if (found.payment.status === "paid") {
        setBooking((prev) => ({
          ...prev,
          bookingCode: found.bookingCode,
          currentStep: 4,
          payment: { ...prev.payment, status: "paid", error: null },
        }));
      } else if (found.payment.status === "failed") {
        setBooking((prev) => ({
          ...prev,
          payment: { ...prev.payment, status: "failed", error: found.payment.failureReason || "Payment failed." },
        }));
      }
      // otherwise still processing — leave the state as-is
    } catch {
      // lookup failing is non-fatal here; the guest can just try again shortly
    }
  }

  const goBack = () => setBooking((prev) => ({ ...prev, currentStep: 2 }));

  // Sends the guest back to room selection with a clean slate — used when
  // the room they'd picked has since sold out for these dates, so re-review
  // & pay with the same (now-invalid) selection isn't even an option.
  const chooseDifferentRoom = () =>
    setBooking((prev) => ({
      ...prev,
      currentStep: 1,
      selectedRoom: null,
      selectedRatePlan: null,
    }));

  return (
    <section className="bg-[#faf8f4] py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6">
          <h1 className="font-cormorant text-4xl text-[#2d2d2d]">Review &amp; Pay</h1>
          <p className="mt-1 text-gray-500">
            Please review your reservation and complete a secure payment to confirm your stay.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-56 w-full">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-[#222]">{room.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{plan ? plan.name : "Premium Accommodation"}</p>

                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Info icon={<CalendarDays size={18} />} label="Check In" value={fmt(booking.checkIn)} />
                  <Info icon={<CalendarDays size={18} />} label="Check Out" value={fmt(booking.checkOut)} />
                  <Info
                    icon={<Users size={18} />}
                    label="Guests"
                    value={`${booking.adults}${booking.children ? ` + ${booking.children}` : ""}`}
                  />
                  <Info
                    icon={<BedDouble size={18} />}
                    label="Rooms"
                    value={`${booking.rooms} · ${nights} night${nights > 1 ? "s" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Guest details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#222]">Guest Details</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Info label="Name" value={guestName || "--"} />
                <Info label="Email" value={booking.guest.email || "--"} />
                <Info label="Phone" value={booking.guest.phone || "--"} />
              </div>
              {booking.guest.specialRequest && (
                <div className="mt-4">
                  <Info label="Special Request" value={booking.guest.specialRequest} />
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setAgreeError("");
                }}
                disabled={busy}
                className="mt-0.5 h-4 w-4 accent-[#B68D40]"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms-and-conditions" target="_blank" className="font-medium text-[#B68D40] underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/refund-policy" target="_blank" className="font-medium text-[#B68D40] underline">
                  Cancellation &amp; Refund Policy
                </Link>
                .
              </span>
            </label>
            {agreeError && <p className="text-sm text-red-600">{agreeError}</p>}
          </div>

          {/* Price + pay */}
          <div className="lg:col-span-1">
            {/* Capped and self-scrolling — see BookingSummary: a sticky panel
                taller than the viewport hides its own Pay button. */}
            <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#222]">Price Summary</h3>

              {quoteLoading && !quote ? (
                <div className="mt-5 space-y-3 animate-pulse">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-6 rounded bg-gray-200" />
                </div>
              ) : quoteError ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {quoteError}
                </p>
              ) : quote ? (
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {formatINR(quote.nightlyRate)} × {quote.nights} × {quote.rooms}
                    </span>
                    <span>{formatINR(quote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes &amp; GST ({quote.taxPercent}%)</span>
                    <span>{formatINR(quote.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-xl font-semibold">Total Payable</span>
                    <span className="text-2xl font-bold text-[#B68D40]">{formatINR(quote.total)}</span>
                  </div>
                </div>
              ) : null}

              {insufficientAvailability && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {quote!.availability.available === 0
                    ? "This room has just sold out for your selected dates."
                    : `Only ${quote!.availability.available} room(s) left for these dates — fewer than the ${booking.rooms} you selected.`}
                  <button
                    onClick={chooseDifferentRoom}
                    className="mt-2 block font-semibold text-red-800 underline"
                  >
                    Choose a different room or dates
                  </button>
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 rounded-lg bg-[#faf8f4] px-4 py-3 text-xs text-gray-500">
                <ShieldCheck size={16} className="shrink-0 text-[#B68D40]" />
                Payments are processed securely by Razorpay. We never see or store your card details.
              </div>

              {booking.payment.holdExpiresAt && flow !== "paid" && (
                <HoldCountdown expiresAt={booking.payment.holdExpiresAt} />
              )}

              {(booking.payment.error || (flow === "processing")) && (
                <div
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                    flow === "processing"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {flow === "processing"
                    ? "Your payment is still being confirmed by the bank. This can take a minute — you don't need to pay again. We'll email your confirmation as soon as it settles."
                    : booking.payment.error}
                  {booking.payment.bookingCode && (
                    <div className="mt-1 text-xs opacity-75">Booking reference: {booking.payment.bookingCode}</div>
                  )}
                </div>
              )}

              {flow === "processing" ? (
                <button
                  onClick={handleRefreshStatus}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#B68D40] py-3.5 font-semibold text-[#B68D40] transition hover:bg-[#faf3e6]"
                >
                  <RotateCcw size={16} /> Check payment status
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={busy || !quote || insufficientAvailability}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#B68D40] py-4 font-semibold text-white transition hover:bg-[#9f7b37] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Lock size={16} />
                  {flow === "creating"
                    ? "Preparing payment…"
                    : flow === "awaiting-checkout"
                    ? "Waiting for payment…"
                    : flow === "verifying"
                    ? "Confirming payment…"
                    : canRetry
                    ? `Try again — Pay ${quote ? formatINR(quote.total) : ""}`
                    : `Pay ${quote ? formatINR(quote.total) : ""} securely`}
                </button>
              )}

              <button
                onClick={goBack}
                disabled={busy}
                className="mt-3 flex w-full items-center justify-center gap-1 py-2 text-sm font-medium text-gray-500 transition hover:text-[#B68D40] disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Back to guest details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-400">
        {icon && <span className="text-[#B68D40]">{icon}</span>}
        {label}
      </p>
      <p className="mt-1 break-words font-medium text-[#222]">{value}</p>
    </div>
  );
}

// Small ticking countdown so a guest can see their room hold is time-boxed
// rather than being surprised by a 409 if they linger on this page.
function HoldCountdown({ expiresAt }: { expiresAt: string }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (secondsLeft <= 0) {
    return (
      <p className="mt-3 text-center text-xs font-medium text-red-600">
        Your room hold has expired — pressing Pay will start a new reservation.
      </p>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <p className="mt-3 text-center text-xs text-gray-500">
      Room held for{" "}
      <span className="font-semibold text-[#B68D40]">
        {minutes}:{String(seconds).padStart(2, "0")}
      </span>
    </p>
  );
}
