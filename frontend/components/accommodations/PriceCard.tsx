"use client";

import { Room, RatePlan } from "./AvailableRooms";
import { useBookingContext } from "./context/BookingContext";
import { formatINR, nightlyRate } from "@/lib/pricing";

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
  const { setBooking } = useBookingContext();

  const rate = nightlyRate(plan);

  // Availability is only known once dates are picked. "Available" means there
  // are at least as many rooms free as the guest selected — no counts shown.
  const availabilityKnown = typeof availableForDates === "number";
  const available = !availabilityKnown || availableForDates >= roomsSelected;
  const selectDisabled = availabilityKnown && !available;

  const handleSelectPlan = () => {
    if (selectDisabled) return;
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

      {availabilityKnown && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
            available ? "text-green-700" : "text-red-600"
          }`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              available ? "bg-green-600" : "bg-red-500"
            }`}
          />
          {available ? "Available" : "Not available"}
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
