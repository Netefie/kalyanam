"use client";

import { Room } from "./AvailableRooms";
import { useBookingContext } from "./context/BookingContext";

interface PriceCardProps {
  room: Room;
  nights: number;
  roomsSelected: number;
  availableForDates?: number;
}

export default function PriceCard({
  room,
  nights,
  roomsSelected,
  availableForDates,
}: PriceCardProps) {
  const { setBooking } = useBookingContext();

  const total = room.offerPrice * nights * roomsSelected;
  const originalTotal = room.price * nights * roomsSelected;

  // Availability is only known once dates are picked. "Available" means there
  // are at least as many rooms free as the guest selected — no counts shown.
  const availabilityKnown = typeof availableForDates === "number";
  const available = !availabilityKnown || availableForDates >= roomsSelected;
  const selectDisabled = availabilityKnown && !available;

  const handleSelectRoom = () => {
    if (selectDisabled) return;
    setBooking((prev) => ({
      ...prev,
      selectedRoom: room,
      currentStep: 2,
    }));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-[#fcfcfc] p-6">
      <p className="text-xs uppercase tracking-[2px] text-gray-500">
        Standard Rate
      </p>

      <div className="mt-4">
        <p className="text-lg text-gray-400 line-through">
          ₹{room.price.toLocaleString()}
          <span className="ml-1 text-sm"> / Night</span>
        </p>

        <h2 className="text-4xl font-bold text-[#B68D40]">
          ₹{room.offerPrice.toLocaleString()}
        </h2>

        <p className="text-sm text-gray-500">
          Per Night
        </p>
      </div>

      <div className="my-5 border-t border-dashed border-gray-300" />

      <div className="space-y-2">

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Night(s)</span>
          <span>{nights}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Room(s)</span>
          <span>{roomsSelected}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Original Total</span>

          <span className="line-through">
            ₹{originalTotal.toLocaleString()}
          </span>
        </div>

        <div className="mt-3 border-t pt-3 flex items-center justify-between">
          <span className="text-lg font-semibold">
            Total Stay
          </span>

          <span className="text-2xl font-bold text-[#B68D40]">
            ₹{total.toLocaleString()}
          </span>
        </div>

      </div>

      {availabilityKnown && (
        <p
          className={`mt-4 flex items-center gap-2 text-sm font-medium ${
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

      <button
        onClick={handleSelectRoom}
        disabled={selectDisabled}
        className={`
          mt-4
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
        {selectDisabled ? "Sold Out" : "Select Room"}
      </button>
    </div>
  );
}