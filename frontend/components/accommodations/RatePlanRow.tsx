"use client";

import { Room, RatePlan } from "./AvailableRooms";
import PriceCard from "./PriceCard";

interface Props {
  room: Room;
  plan: RatePlan;
  roomsSelected: number;
  availableForDates?: number;
}

// One rate plan, rendered as its own bordered card: name + inclusions on the
// left, the priced Select panel on the right, split by an inset divider.
export default function RatePlanRow({
  room,
  plan,
  roomsSelected,
  availableForDates,
}: Props) {
  return (
    <div
      className="
        grid
        h-full
        rounded-lg
        border
        border-gray-200
        transition-all
        duration-300
        hover:border-[#B68D40]
        hover:shadow-md
        sm:grid-cols-[1fr_auto]
      "
    >
      <div className="flex flex-col p-5">
        <h3 className="text-base font-semibold text-[#222]">{plan.name}</h3>

        {plan.inclusions.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-gray-600">
            {plan.inclusions.map((line) => (
              <li key={line} className="flex gap-2.5">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Divider is inset vertically (my-5) so it stops short of the card
          edges, matching the reference. */}
      <div className="p-5 sm:my-5 sm:w-64 sm:border-l sm:border-gray-200 sm:py-0">
        <PriceCard
          room={room}
          plan={plan}
          roomsSelected={roomsSelected}
          availableForDates={availableForDates}
        />
      </div>
    </div>
  );
}
