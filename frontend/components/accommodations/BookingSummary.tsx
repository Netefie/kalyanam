"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Users, BedDouble } from "lucide-react";
import { format } from "date-fns";

import {
  useBookingContext,
  validateGuestDetails,
} from "./context/BookingContext";
import { formatINR } from "@/lib/pricing";
import useBookingQuote from "@/hooks/useBookingQuote";

export default function BookingSummary() {
  const { booking, setBooking, nights, setGuestErrors } = useBookingContext();

  const [error, setError] = useState("");

  const room = booking.selectedRoom;
  const plan = booking.selectedRatePlan;

  // Authoritative price breakdown from the backend — see lib/pricing.ts for
  // why this summary no longer computes its own 18%-flat tax client-side.
  const { quote, loading: quoteLoading } = useBookingQuote({
    roomSlug: room?.slug,
    ratePlanCode: plan?.code,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    rooms: booking.rooms,
  });

  if (!room) return null;

  const handleContinue = () => {
    setError("");

    if (!booking.checkIn || !booking.checkOut) {
      setError("Please select your check-in and check-out dates first.");
      return;
    }

    const errors = validateGuestDetails(booking.guest);
    if (Object.keys(errors).length > 0) {
      setGuestErrors(errors);
      setError("Please complete the highlighted fields.");
      document
        .getElementById("booking-steps")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Proceed to the review / payment-confirmation step (the booking is
    // created there). The page scrolls to the step section on step change.
    setGuestErrors({});
    setBooking((prev) => ({ ...prev, currentStep: 3 }));
  };

  // The sticky panel is a flex column: the summary card takes the remaining
  // height and scrolls inside itself, while the Continue button is a
  // non-shrinking sibling below it. Previously the button was the card's last
  // child, so on a short screen it scrolled out of view inside the panel and
  // the guest had no visible way forward. Below `lg` the sidebar stacks last
  // in a single column and sticky has no range to work with, so there the
  // button detaches into a fixed bottom bar instead.
  return (
    <div className="sticky top-28 z-30 flex max-h-[calc(100dvh-8rem)] flex-col gap-4">

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Image */}

        <div className="relative h-64 w-full">
          <Image
            src={room.image}
            alt={room.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>

        {/* Body */}

        <div className="p-6">

          <h2 className="text-2xl font-semibold text-[#222]">
            {room.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {plan ? plan.name : "Premium Accommodation"}
          </p>

          <div className="my-3 border-t border-dashed" />

          {/* Dates */}

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
                className="text-[#B68D40]"
              />

              <div>
                <p className="text-xs uppercase text-gray-500">
                  Check In
                </p>

                <p className="font-medium">
                  {booking.checkIn
                    ? format(booking.checkIn, "dd MMM yyyy")
                    : "--"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
                className="text-[#B68D40]"
              />

              <div>
                <p className="text-xs uppercase text-gray-500">
                  Check Out
                </p>

                <p className="font-medium">
                  {booking.checkOut
                    ? format(booking.checkOut, "dd MMM yyyy")
                    : "--"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users
                size={18}
                className="text-[#B68D40]"
              />

              <div>
                <p className="text-xs uppercase text-gray-500">
                  Guests
                </p>

                <p className="font-medium">
                  {booking.adults} Adult{booking.adults > 1 ? "s" : ""}

                  {booking.children > 0 &&
                    ` • ${booking.children} Child${
                      booking.children > 1 ? "ren" : ""
                    }`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BedDouble
                size={18}
                className="text-[#B68D40]"
              />

              <div>
                <p className="text-xs uppercase text-gray-500">
                  Rooms
                </p>

                <p className="font-medium">
                  {booking.rooms}
                </p>
              </div>
            </div>

          </div>

          <div className="my-6 border-t border-dashed" />

          {/* Price */}

          {quoteLoading && !quote ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-6 rounded bg-gray-200" />
            </div>
          ) : quote ? (
            <div className="space-y-3">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  {formatINR(quote.nightlyRate)} × {nights} Night
                  {nights > 1 ? "s" : ""}
                </span>

                <span>
                  {formatINR(quote.subtotal)}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Taxes &amp; GST ({quote.taxPercent}%)
                </span>

                <span>
                  {formatINR(quote.taxAmount)}
                </span>

              </div>

              <div className="border-t pt-4 flex justify-between">

                <span className="text-xl font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#B68D40]">
                  {formatINR(quote.total)}
                </span>

              </div>

            </div>
          ) : null}

        </div>

      </div>

      {/* Action bar — outside the scrolling card so it is always reachable.
          z-40 keeps it under the navbar's z-50. */}
      <div className="fixed inset-x-0 bottom-0 z-40 shrink-0 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">

        {error && (
          <p
            role="alert"
            className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-[#B68D40] py-4 font-semibold text-white transition hover:bg-[#9f7b37]"
        >
          Continue to Payment
        </button>

      </div>

    </div>
  );
}