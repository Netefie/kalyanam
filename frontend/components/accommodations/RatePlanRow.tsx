"use client";

import Link from "next/link";
import { Room, RatePlan } from "./AvailableRooms";
import PriceCard from "./PriceCard";

interface Props {
  room: Room;
  plan: RatePlan;
  roomsSelected: number;
  availableForDates?: number;
}

// One rate-plan section of a room card: plan name + inclusions on the left,
// its own priced Select panel on the right.
export default function RatePlanRow({
  room,
  plan,
  roomsSelected,
  availableForDates,
}: Props) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex flex-1 flex-col">
        <h3 className="text-lg font-semibold text-[#222]">{plan.name}</h3>

        {plan.inclusions.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-gray-600">
            {plan.inclusions.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                {line}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <Link
            href={`/accommodations/${room.slug}`}
            className="text-sm font-medium text-[#B68D40] underline underline-offset-4 transition hover:text-[#9f7b37]"
          >
            Room Details
          </Link>
        </div>
      </div>

      <div className="hidden w-px bg-gray-200 sm:block" />

      <div className="sm:w-64 sm:shrink-0 sm:pl-6">
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
