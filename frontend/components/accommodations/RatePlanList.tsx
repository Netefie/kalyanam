"use client";

import { Star } from "lucide-react";

import { Room } from "./AvailableRooms";
import RatePlanRow from "./RatePlanRow";

interface Props {
  room: Room;
  roomsSelected: number;
  availableForDates?: number;
}

// Right-hand column of a room card: the room name, then one bordered section
// per rate plan the room sells. Each section is `flex-1`, so the plans split
// the column height equally and stretch to meet the left column's bottom —
// that's what keeps cards from ending in a large empty area.
//
// `room.ratePlans` is never empty; the API always resolves at least one plan
// per room (backend/src/services/ratePlans.js).
export default function RatePlanList({
  room,
  roomsSelected,
  availableForDates,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-cormorant text-2xl font-bold uppercase tracking-wide text-[#8B5E34]">
          {room.title}
        </h2>

        <span className="flex items-center gap-1 text-sm">
          <Star size={15} className="text-[#F5A623]" fill="currentColor" />
          <span className="font-medium text-gray-700">{room.rating}</span>
          <span className="text-gray-400">({room.reviews})</span>
        </span>
      </div>

      {room.ratePlans.map((plan) => (
        <div key={plan.code} className="flex-1 min-h-[190px]">
          <RatePlanRow
            room={room}
            plan={plan}
            roomsSelected={roomsSelected}
            availableForDates={availableForDates}
          />
        </div>
      ))}
    </div>
  );
}
