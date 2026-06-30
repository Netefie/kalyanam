"use client";

import {
  BookingProvider,
  useBookingContext,
} from "@/components/accommodations/context/BookingContext";

import HeroAcc from "@/components/accommodations/HeroAcc";
import BookingSteps from "@/components/accommodations/BookingSteps";
import BookingSearchBar from "@/components/accommodations/BookingSearchBar";
import AvailableRooms from "@/components/accommodations/AvailableRooms";
import PersonalDetails from "@/components/accommodations/PersonalDetails";

// Future Components
// import PaymentDetails from "@/components/accommodations/PaymentDetails";
// import BookingSuccess from "@/components/accommodations/BookingSuccess";

function BookingContent() {
  const { booking } = useBookingContext();

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