"use client";

import { Room, RatePlan } from "./AvailableRooms";
import { useBookingContext } from "./context/BookingContext";
import { formatINR, nightlyRate } from "@/lib/pricing";
import { availabilityLabel } from "@/lib/availability";

interface PriceCardProps {
  room: Room;
  plan: RatePlan;
  roomsSelected: number;
  availableForDates?: number;
}

// The price + Select panel for a single rate plan. One renders per plan inside
// RatePlanRow, so it stays compact — the full nights/rooms/tax breakdown is
// shown once the guest reaches BookingSummary.
export default function PriceCard({
  room,
  plan,
  roomsSelected,
  availableForDates,
}: PriceCardProps) {
  const { booking, setBooking, setDateError } = useBookingContext();

  const rate = nightlyRate(plan);

  // Availability is only known once dates are picked (lib/availability.ts's
  // `tone: "unknown"` when `availableForDates` is undefined). "Sold out"
  // means fewer rooms remain than the guest currently wants; below the low-
  // stock threshold the guest sees the exact count instead of a flat
  // "Available", so a scarce date range doesn't come as a surprise at
  // checkout.
  const status = availabilityLabel(availableForDates, roomsSelected);
  const selectDisabled = status.tone === "soldOut";

  const handleSelectPlan = () => {
    if (selectDisabled) return;

    // Without dates the next step has nothing to price: the summary shows
    // "--" for both days and useBookingQuote short-circuits, so the whole
    // cost breakdown vanishes — and step 2 carries no date picker and no way
    // back. Keep the guest here until the stay is defined.
    if (!booking.checkIn || !booking.checkOut) {
      setDateError(
        "Please choose your check-in and check-out dates before selecting a room."
      );
      document
        .getElementById("booking-search")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setDateError("");
    setBooking((prev) => ({
      ...prev,
      selectedRoom: room,
      selectedRatePlan: plan,
      currentStep: 2,
    }));
  };

  return (
    <div className="flex h-full flex-col">
      <p className="text-sm uppercase tracking-[1.5px] text-[#8B5E34]">
        {plan.label}
      </p>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-[#222]">
          {formatINR(rate)}
        </span>
        <span className="text-sm text-gray-500">/Night</span>
      </div>

      {status.tone !== "unknown" && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
            status.tone === "soldOut"
              ? "text-red-600"
              : status.tone === "low"
              ? "text-amber-600"
              : "text-green-700"
          }`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              status.tone === "soldOut"
                ? "bg-red-500"
                : status.tone === "low"
                ? "bg-amber-500"
                : "bg-green-600"
            }`}
          />
          {status.label}
        </p>
      )}

      <div className="mt-auto pt-5">
        <button
          onClick={handleSelectPlan}
          disabled={selectDisabled}
          className={`
            font-cormorant
            rounded
            px-9
            py-2.5
            text-lg
            text-white
            transition-all
            duration-300
            ${
              selectDisabled
                ? "cursor-not-allowed bg-gray-300"
                : "bg-[#8B6B47] hover:bg-[#75593b] hover:shadow-md active:scale-[0.97]"
            }
          `}
        >
          {selectDisabled ? "Sold Out" : "Select"}
        </button>
      </div>
    </div>
  );
}
