"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Users, BedDouble, ChevronLeft } from "lucide-react";

import { useBookingContext } from "./context/BookingContext";
import { api, ApiError } from "@/lib/api";

export default function PaymentConfirmation() {
  const { booking, setBooking, nights } = useBookingContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const room = booking.selectedRoom;
  if (!room) return null;

  const subtotal = room.offerPrice * nights * booking.rooms;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "--");

  const guestName = `${booking.guest.firstName} ${booking.guest.lastName || ""}`.trim();

  const handleConfirm = async () => {
    setError("");

    if (!booking.checkIn || !booking.checkOut) {
      setError("Please select your check-in and check-out dates first.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.bookings.create({
        guest: booking.guest,
        roomSlug: room.slug,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        adults: booking.adults,
        children: booking.children,
        rooms: booking.rooms,
      });

      setBooking((prev) => ({ ...prev, bookingCode: created.bookingCode, currentStep: 4 }));
    } catch (err) {
      // Keep availability errors generic (don't expose inventory counts).
      if (err instanceof ApiError && err.status === 409) {
        setError("Sorry, this room is no longer available for your selected dates. Please choose different dates.");
      } else {
        setError("Could not confirm your booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => setBooking((prev) => ({ ...prev, currentStep: 2 }));

  return (
    <section className="bg-[#faf8f4] py-10">
      <div className="mx-auto max-w-5xl px-6">

        <div className="mb-6">
          <h1 className="text-4xl text-[#2d2d2d]" style={{ fontFamily: "Cormorant Garamond" }}>
            Review &amp; Confirm
          </h1>
          <p className="mt-1 text-gray-500">
            Please review your reservation details before confirming.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-56 w-full">
                <Image src={room.image} alt={room.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-[#222]">{room.title}</h2>
                <p className="mt-1 text-sm text-gray-500">Premium Accommodation</p>

                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Info icon={<CalendarDays size={18} />} label="Check In" value={fmt(booking.checkIn)} />
                  <Info icon={<CalendarDays size={18} />} label="Check Out" value={fmt(booking.checkOut)} />
                  <Info icon={<Users size={18} />} label="Guests" value={`${booking.adults}${booking.children ? ` + ${booking.children}` : ""}`} />
                  <Info icon={<BedDouble size={18} />} label="Rooms" value={`${booking.rooms} · ${nights} night${nights > 1 ? "s" : ""}`} />
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
          </div>

          {/* Price + confirm */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#222]">Price Summary</h3>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>₹{room.offerPrice.toLocaleString()} × {nights} × {booking.rooms}</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes &amp; GST (18%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#B68D40]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-[#faf8f4] px-4 py-3 text-sm text-gray-500">
                Payment is not required now — your reservation will be confirmed and our team will reach out.
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-[#B68D40] py-4 font-semibold text-white transition hover:bg-[#9f7b37] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Confirming…" : "Confirm Booking"}
              </button>

              <button
                onClick={goBack}
                disabled={submitting}
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

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
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
