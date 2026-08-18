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

// The price + Select panel for a single rate plan. One of these renders per
// plan inside RatePlanRow, so it stays deliberately compact — the full
// nights/rooms/tax breakdown is shown once the guest reaches BookingSummary.
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
      <p className="text-xs uppercase tracking-[2px] text-gray-500">{plan.label}</p>

      <div className="mt-3">
        <span className="text-3xl font-bold text-[#B68D40]">{formatINR(rate)}</span>
        <span className="ml-1 text-sm text-gray-500">/Night</span>
      </div>

      {availabilityKnown && (
        <p
          className={`mt-3 flex items-center gap-2 text-sm font-medium ${
            available ? "text-green-700" : "text-red-600"
          }`}
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              available ? "bg-green-600" : "bg-red-500"
            }`}
          />
          {available ? "Available for your dates" : "Not available for your dates"}
        </p>
      )}

      <div className="mt-auto pt-5">
        <button
          onClick={handleSelectPlan}
          disabled={selectDisabled}
          className={`
            w-full
            rounded-lg
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            ${
              selectDisabled
                ? "cursor-not-allowed bg-gray-300"
                : "bg-[#B68D40] hover:bg-[#9f7b37] active:scale-[0.98]"
            }
          `}
        >
          {selectDisabled ? "Sold Out" : "Select"}
        </button>
      </div>
    </div>
  );
}
