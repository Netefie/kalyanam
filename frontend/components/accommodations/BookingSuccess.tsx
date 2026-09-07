"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CalendarDays,
  Users,
  BedDouble,
  Printer,
  Mail,
  CreditCard,
} from "lucide-react";

import { useBookingContext } from "./context/BookingContext";
import { api, type Booking } from "@/lib/api";
import { formatINR } from "@/lib/pricing";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// "14:00" -> "2:00 PM" — Settings stores check-in/out as 24h "HH:mm" (see
// backend/src/models/Settings.js), this is purely a display convenience.
function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// The confirmation screen — fetches the fully-settled booking (pricing +
// payment breakdown) via the same public receipt lookup a guest could use
// later, rather than trusting whatever was last held in context, so what's
// shown here always matches what was actually charged and stored.
export default function BookingSuccess() {
  const { booking, resetBooking } = useBookingContext();
  const [record, setRecord] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  // Defaults match Settings' own schema defaults (backend/src/models/
  // Settings.js), so this reads correctly even before the fetch below
  // resolves rather than showing a blank time.
  const [times, setTimes] = useState({ checkInTime: "14:00", checkOutTime: "11:00" });

  useEffect(() => {
    api.settings
      .get()
      .then((s) => setTimes({ checkInTime: s.checkInTime, checkOutTime: s.checkOutTime }))
      .catch(() => {});
  }, []);

  const code = booking.bookingCode;
  const email = booking.guest.email;

  useEffect(() => {
    if (!code || !email) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api.payments
      .lookup(code, email)
      .then((data) => {
        if (!cancelled) setRecord(data);
      })
      .catch(() => {
        if (!cancelled) setRecord(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code, email]);

  return (
    <section className="bg-[#faf8f4] py-16 print:bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <CheckCircle2 size={56} className="mx-auto text-green-600" />

          <h2 className="mt-6 font-cormorant text-4xl text-[#2d2d2d] sm:text-5xl">Booking Confirmed</h2>

          <p className="mt-3 text-gray-500">
            Thank you{booking.guest.firstName ? `, ${booking.guest.firstName}` : ""} — your payment was
            successful and your reservation is confirmed.
          </p>

          {code && (
            <p className="mx-auto mt-6 inline-block rounded-full bg-[#B68D40]/10 px-6 py-3 text-lg font-semibold text-[#B68D40]">
              Booking Reference: {code}
            </p>
          )}

          {loading ? (
            <div className="mt-10 animate-pulse space-y-3">
              <div className="mx-auto h-4 w-2/3 rounded bg-gray-200" />
              <div className="mx-auto h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ) : record ? (
            <>
              <div className="mt-10 grid grid-cols-2 gap-6 text-left sm:grid-cols-4">
                <Detail icon={<CalendarDays size={16} />} label="Check In" value={fmtDate(record.checkIn)} sub={`from ${fmtTime(times.checkInTime)}`} />
                <Detail icon={<CalendarDays size={16} />} label="Check Out" value={fmtDate(record.checkOut)} sub={`by ${fmtTime(times.checkOutTime)}`} />
                <Detail
                  icon={<Users size={16} />}
                  label="Guests"
                  value={`${record.adults}${record.children ? ` + ${record.children}` : ""}`}
                />
                <Detail icon={<BedDouble size={16} />} label="Rooms" value={`${record.rooms} · ${record.nights} night${record.nights > 1 ? "s" : ""}`} />
              </div>

              <div className="mt-8 rounded-xl bg-[#faf8f4] p-6 text-left">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {record.roomName}
                  {record.ratePlanName ? ` · ${record.ratePlanName}` : ""}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      {formatINR(record.pricing.nightlyRate)} × {record.nights} × {record.rooms}
                    </span>
                    <span>{formatINR(record.pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes &amp; GST ({record.pricing.taxPercent}%)</span>
                    <span>{formatINR(record.pricing.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-[#222]">
                    <span>Total Paid</span>
                    <span className="text-[#B68D40]">{formatINR(record.payment.amountPaid || record.amount)}</span>
                  </div>
                </div>

                {record.payment.paymentId && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <CreditCard size={14} />
                    Payment ID: {record.payment.paymentId}
                    {record.payment.method ? ` · Paid via ${record.payment.method}` : ""}
                  </div>
                )}
              </div>
            </>
          ) : null}

          {email && (
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Mail size={15} /> A copy of this receipt has been sent to {email}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:border-[#B68D40] hover:text-[#B68D40]"
            >
              <Printer size={16} /> Print Receipt
            </button>

            <button
              onClick={resetBooking}
              className="rounded-lg bg-[#B68D40] px-8 py-3 font-semibold text-white transition hover:bg-[#9f7b37]"
            >
              Book Another Stay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({
  icon,
  label,
  value,
  sub,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-400">
        {icon && <span className="text-[#B68D40]">{icon}</span>}
        {label}
      </p>
      <p className="mt-1 font-medium text-[#222]">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
