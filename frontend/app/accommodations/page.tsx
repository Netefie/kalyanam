"use client";

import { useEffect, useRef } from "react";
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
import PaymentConfirmation from "@/components/accommodations/PaymentConfirmation";
import BookingSuccess from "@/components/accommodations/BookingSuccess";

function BookingContent() {
  const { booking, setBooking } = useBookingContext();

  // Keep the step section in view when moving between steps, so changing step
  // never dumps the user at the hero or leaves them scrolled past the form.
  const prevStep = useRef(booking.currentStep);
  useEffect(() => {
    if (prevStep.current !== booking.currentStep) {
      prevStep.current = booking.currentStep;
      document
        .getElementById("booking-steps")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [booking.currentStep]);

  // Steps 2 and 3 both require a selected room (PersonalDetails/BookingSummary
  // and PaymentConfirmation each render nothing without one). A resumed
  // session — sessionStorage restored on a fresh load, or the guest using
  // the browser's back/forward buttons — can otherwise land on either step
  // with `selectedRoom: null`, which read as a blank page with no way
  // forward. Bounce back to room selection instead.
  useEffect(() => {
    if ((booking.currentStep === 2 || booking.currentStep === 3) && !booking.selectedRoom) {
      setBooking((prev) => ({ ...prev, currentStep: 1 }));
    }
  }, [booking.currentStep, booking.selectedRoom, setBooking]);

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

      {/* Booking Progress (scroll anchor for step changes; offset for navbar) */}
      <div id="booking-steps" className="scroll-mt-28">
        <BookingSteps currentStep={booking.currentStep} />
      </div>

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

      {/* STEP 3 — review + confirm (creates the booking) */}
      {booking.currentStep === 3 && (
        <PaymentConfirmation />
      )}

      {/* STEP 4 */}
      {booking.currentStep === 4 && <BookingSuccess />}
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