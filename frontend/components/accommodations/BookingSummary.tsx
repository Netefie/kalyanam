"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Users, BedDouble } from "lucide-react";

import { useBookingContext } from "./context/BookingContext";

export default function BookingSummary() {
  const { booking, setBooking, nights } = useBookingContext();

  const [error, setError] = useState("");

  if (!booking.selectedRoom) return null;

  const room = booking.selectedRoom;

  const handleContinue = () => {
    setError("");

    if (!booking.checkIn || !booking.checkOut) {
      setError("Please select your check-in and check-out dates first.");
      return;
    }

    const { firstName, email, phone } = booking.guest;
    if (!firstName || !email || !phone) {
      setError("Please enter your name, email and phone to continue.");
      return;
    }

    // Proceed to the review / payment-confirmation step (the booking is
    // created there). Scroll up so the next step starts at the top.
    setBooking((prev) => ({ ...prev, currentStep: 3 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subtotal =
    room.offerPrice *
    nights *
    booking.rooms;

  const taxes = Math.round(subtotal * 0.18);

  const total = subtotal + taxes;

  return (
    <div className="sticky top-28">

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Image */}

        <div className="relative h-64 w-full">
          <Image
            src={room.image}
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Body */}

        <div className="p-6">

          <h2 className="text-2xl font-semibold text-[#222]">
            {room.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Premium Accommodation
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
                    ? booking.checkIn.toLocaleDateString()
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
                    ? booking.checkOut.toLocaleDateString()
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
                  {booking.adults} Adults

                  {booking.children > 0 &&
                    ` • ${booking.children} Children`}
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

          <div className="space-y-3">

            <div className="flex justify-between">

              <span className="text-gray-600">
                ₹{room.offerPrice.toLocaleString()} × {nights} Night
                {nights > 1 ? "s" : ""}
              </span>

              <span>
                ₹{subtotal.toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Taxes & GST
              </span>

              <span>
                ₹{taxes.toLocaleString()}
              </span>

            </div>

            <div className="border-t pt-4 flex justify-between">

              <span className="text-xl font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-[#B68D40]">
                ₹{total.toLocaleString()}
              </span>

            </div>

          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            onClick={handleContinue}
            className="
              mt-8
              w-full
              bg-[#B68D40]
              py-4
              font-semibold
              text-white
              transition
              hover:bg-[#9f7b37]
            "
          >
            Continue to Payment
          </button>

        </div>

      </div>

    </div>
  );
}