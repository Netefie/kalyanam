"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Room, RatePlan } from "../AvailableRooms";

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

// Tracks the Razorpay order lifecycle for the currently-selected stay.
// Deliberately separate from BookingState's top-level fields (room/dates/
// guest) so PaymentConfirmation can distinguish "haven't started paying
// yet" from "guest closed the checkout modal" from "Razorpay reported a
// failure" and show the right copy/retry affordance for each.
export type PaymentFlowStatus =
  | "idle"
  | "creating"
  | "awaiting-checkout"
  | "verifying"
  | "processing" // payment authorized but not yet captured — settles via webhook
  | "paid"
  | "failed"
  | "dismissed";

export interface PaymentFlowState {
  status: PaymentFlowStatus;
  bookingId: string | null;
  bookingCode: string | null; // human reference, available before payment settles
  orderId: string | null;
  keyId: string | null;
  holdExpiresAt: string | null; // ISO string
  error: string | null;
}

const initialPaymentState: PaymentFlowState = {
  status: "idle",
  bookingId: null,
  bookingCode: null,
  orderId: null,
  keyId: null,
  holdExpiresAt: null,
  error: null,
};

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

  // The rate plan chosen on the selected room (Room Only / Room with
  // Breakfast / ...). Cleared alongside selectedRoom on reset.
  selectedRatePlan: RatePlan | null;

  guest: GuestDetails;

  // The in-flight (or just-completed) Razorpay order for this stay.
  payment: PaymentFlowState;

  // Set once the booking is confirmed (shown on the confirmation screen).
  bookingCode: string | null;
}

interface BookingContextType {
  booking: BookingState;

  setBooking: Dispatch<SetStateAction<BookingState>>;

  resetBooking: () => void;

  nights: number;

  guestErrors: GuestErrors;

  setGuestErrors: Dispatch<SetStateAction<GuestErrors>>;

  // Surfaced by the search bar. Lives here rather than in BookingSearchBar's
  // own state because the room cards further down the page raise it too —
  // picking a rate plan without dates has to send the guest back up to the
  // date fields. Deliberately outside BookingState: it's transient UI, not
  // progress worth restoring from sessionStorage.
  dateError: string;

  setDateError: Dispatch<SetStateAction<string>>;
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

  selectedRatePlan: null,

  guest: {
    title: "",

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    gstNumber: "",

    specialRequest: "",
  },

  payment: initialPaymentState,

  bookingCode: null,
};

// Persisted across a refresh so a guest mid-payment (or one whose Razorpay
// modal navigates away and back, common on mobile UPI apps) doesn't lose
// their room/dates/guest details and land back at step 1. sessionStorage
// (not localStorage) is deliberate — this is per-tab progress, not
// something that should survive or leak across browser sessions.
const STORAGE_KEY = "kalyanam_booking_flow";

function loadPersistedState(): BookingState {
  if (typeof window === "undefined") return initialBookingState;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBookingState;
    const parsed = JSON.parse(raw);
    return {
      ...initialBookingState,
      ...parsed,
      checkIn: parsed.checkIn ? new Date(parsed.checkIn) : null,
      checkOut: parsed.checkOut ? new Date(parsed.checkOut) : null,
      // A resumed session should never reopen an in-progress checkout
      // widget on its own — settle back to idle and let the guest press
      // Pay again (createPaymentOrder is cheap to re-issue if the earlier
      // hold already expired).
      payment:
        parsed.payment?.status === "paid"
          ? parsed.payment
          : { ...initialPaymentState, bookingId: parsed.payment?.bookingId ?? null },
    };
  } catch {
    return initialBookingState;
  }
}

function persistState(state: BookingState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        checkIn: state.checkIn ? state.checkIn.toISOString() : null,
        checkOut: state.checkOut ? state.checkOut.toISOString() : null,
      })
    );
  } catch {
    // Private-browsing / storage-full — the flow still works in-memory for
    // this page load, it just won't survive a refresh.
  }
}

const BookingContext =
  createContext<BookingContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function BookingProvider({
  children,
}: Props) {
  // Lazy initializer so the very first client render already has any
  // resumed state (avoids a flash of the empty flow before hydration).
  const [booking, setBooking] =
    useState<BookingState>(loadPersistedState);

  const [guestErrors, setGuestErrors] = useState<GuestErrors>({});

  const [dateError, setDateError] = useState("");

  useEffect(() => {
    persistState(booking);
  }, [booking]);

  const resetBooking = () => {
    setBooking(initialBookingState);
    setGuestErrors({});
    setDateError("");
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
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
        dateError,
        setDateError,
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
