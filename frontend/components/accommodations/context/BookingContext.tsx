"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import type { Room } from "../AvailableRooms";

export interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gstNumber: string;
  specialRequest: string;
}

export interface BookingState {
  roomType: string;

  checkIn: Date | null;

  checkOut: Date | null;

  adults: number;

  children: number;

  rooms: number;

  searched: boolean;

  currentStep: number;

  selectedRoom: Room | null;

  guest: GuestDetails;

  // Set once the booking is created on the backend (shown on confirmation).
  bookingCode: string | null;
}

interface BookingContextType {
  booking: BookingState;

  setBooking: Dispatch<SetStateAction<BookingState>>;

  resetBooking: () => void;

  nights: number;
}

const initialBookingState: BookingState = {
  roomType: "",

  checkIn: null,

  checkOut: null,

  adults: 2,

  children: 0,

  rooms: 1,

  searched: false,

  currentStep: 1,

  selectedRoom: null,

  guest: {
    title: "",

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    gstNumber: "",

    specialRequest: "",
  },

  bookingCode: null,
};

const BookingContext =
  createContext<BookingContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function BookingProvider({
  children,
}: Props) {
  const [booking, setBooking] =
    useState<BookingState>(initialBookingState);

  const resetBooking = () => {
    setBooking(initialBookingState);
  };

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) {
      return 1;
    }

    const difference =
      booking.checkOut.getTime() -
      booking.checkIn.getTime();

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0
      ? calculatedNights
      : 1;
  }, [booking.checkIn, booking.checkOut]);

  return (
    <BookingContext.Provider
      value={{
        booking,
        setBooking,
        resetBooking,
        nights,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      "useBookingContext must be used inside BookingProvider."
    );
  }

  return context;
}