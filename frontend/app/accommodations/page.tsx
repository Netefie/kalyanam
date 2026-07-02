"use client";

import { useEffect } from "react";
import {
  BookingProvider,
  useBookingContext,
} from "@/components/accommodations/context/BookingContext";
import { readReservationParams } from "@/lib/reservation";

import HeroAcc from "@/components/accommodations/HeroAcc";
import BookingSteps from "@/components/accommodations/BookingSteps";
import BookingSearchBar from "@/components/accommodations/BookingSearchBar";
import AvailableRooms from "@/components/accommodations/AvailableRooms";
import PersonalDetails from "@/components/accommodations/PersonalDetails";

// Future Components
// import PaymentDetails from "@/components/accommodations/PaymentDetails";
// import BookingSuccess from "@/components/accommodations/BookingSuccess";

function BookingContent() {
  const { booking, setBooking, resetBooking } = useBookingContext();

  // Prefill "PLAN YOUR STAY" from ?roomType&checkIn&checkOut&adults&children&rooms
  // (set by the hero bar / navbar reservation widget) and auto-run the search.
  useEffect(() => {
    const parsed = readReservationParams(window.location.search);
    if (!parsed) return;

    setBooking((prev) => ({
      ...prev,
      roomType: parsed.roomType || prev.roomType,
      checkIn: parsed.checkIn ?? prev.checkIn,
      checkOut: parsed.checkOut ?? prev.checkOut,
      adults: parsed.adults ?? prev.adults,
      children: parsed.children ?? prev.children,
      rooms: parsed.rooms ?? prev.rooms,
      currentStep: 1,
      // Auto-run the search only when dates are present.
      searched: parsed.hasDates ? true : prev.searched,
    }));

    if (parsed.hasDates) {
      setTimeout(() => {
        document
          .getElementById("available-rooms")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [setBooking]);

  return (
    <>
      {/* Hero */}
      <HeroAcc />

      {/* Booking Progress */}
      <BookingSteps currentStep={booking.currentStep} />

      {/* STEP 1 */}
      {booking.currentStep === 1 && (
        <>
          <div className="mx-auto max-w-6xl px-6">
            <BookingSearchBar />
          </div>

          <AvailableRooms />
        </>
      )}

      {/* STEP 2 */}
      {booking.currentStep === 2 && (
        <PersonalDetails />
      )}

      {/* STEP 3 */}
      {booking.currentStep === 3 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2
              className="text-5xl text-[#2d2d2d]"
              style={{
                fontFamily: "Cormorant Garamond",
              }}
            >
              Payment Details
            </h2>

            <p className="mt-4 text-gray-500">
              Payment module will be implemented next.
            </p>
          </div>
        </section>
      )}

      {/* STEP 4 */}
      {booking.currentStep === 4 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2
              className="text-5xl text-[#2d2d2d]"
              style={{
                fontFamily: "Cormorant Garamond",
              }}
            >
              Booking Confirmed
            </h2>

            <p className="mt-4 text-gray-500">
              Your reservation has been successfully confirmed.
            </p>

            {booking.bookingCode && (
              <p className="mt-6 inline-block rounded-full bg-[#B68D40]/10 px-6 py-3 text-lg font-semibold text-[#B68D40]">
                Booking Reference: {booking.bookingCode}
              </p>
            )}

            <div className="mt-8">
              <button
                onClick={resetBooking}
                className="rounded-lg bg-[#B68D40] px-8 py-3 font-semibold text-white transition hover:bg-[#9f7b37]"
              >
                Book Another Stay
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function Home() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}