"use client";

import { Room } from "./AvailableRooms";
import RoomSummary from "./RoomSummary";
import RatePlanList from "./RatePlanList";

interface RoomCardProps {
  room: Room;
  roomsSelected: number;
  availableForDates?: number;
}

// A room in the Available Rooms list: an info column (photo, specs,
// amenities) beside a stacked list of rate plans, each independently priced
// and selectable.
export default function RoomCard({
  room,
  roomsSelected,
  availableForDates,
}: RoomCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-4 lg:border-r lg:border-gray-200">
          <RoomSummary room={room} />
        </div>

        <div className="lg:col-span-8">
          <RatePlanList
            room={room}
            roomsSelected={roomsSelected}
            availableForDates={availableForDates}
          />
        </div>
      </div>
    </div>
  );
}
