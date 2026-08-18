"use client";

import { Room } from "./AvailableRooms";
import RatePlanRow from "./RatePlanRow";

interface Props {
  room: Room;
  roomsSelected: number;
  availableForDates?: number;
}

// Right-hand column of a room card: one stacked, divided section per rate
// plan the room sells (Room Only, Room with Breakfast, ...). `room.ratePlans`
// is never empty — the API always resolves at least one plan per room, see
// backend/src/services/ratePlans.js.
export default function RatePlanList({
  room,
  roomsSelected,
  availableForDates,
}: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {room.ratePlans.map((plan) => (
        <div key={plan.code} className="p-7">
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
