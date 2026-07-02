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

export type GuestErrors = Partial<Record<keyof GuestDetails, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Indian GSTIN: 2-digit state + 10-char PAN + entity + 'Z' + checksum.
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Field-level validation for the guest details form.
export function validateGuestDetails(guest: GuestDetails): GuestErrors {
  const errors: GuestErrors = {};

  if (!guest.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (guest.firstName.trim().length < 2) {
    errors.firstName = "Enter a valid first name";
  }

  if (!guest.email.trim()) {
    errors.email = "Email address is required";
  } else if (!EMAIL_RE.test(guest.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  const phoneDigits = guest.phone.replace(/\D/g, "");
  if (!guest.phone.trim()) {
    errors.phone = "Mobile number is required";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid mobile number";
  }

  if (
    guest.gstNumber.trim() &&
    !GSTIN_RE.test(guest.gstNumber.trim().toUpperCase())
  ) {
    errors.gstNumber = "Enter a valid 15-character GSTIN";
  }

  return errors;
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

  guestErrors: GuestErrors;

  setGuestErrors: Dispatch<SetStateAction<GuestErrors>>;
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

  const [guestErrors, setGuestErrors] = useState<GuestErrors>({});

  const resetBooking = () => {
    setBooking(initialBookingState);
    setGuestErrors({});
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
        guestErrors,
        setGuestErrors,
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