"use client";

import { Room } from "./AvailableRooms";
import RoomSummary from "./RoomSummary";
import RatePlanList from "./RatePlanList";

interface RoomCardProps {
  room: Room;
  roomsSelected: number;
  availableForDates?: number;
  index?: number;
}

// A room in the Available Rooms list: a compact info column (photo + specs)
// beside a column of equal-height rate plans, each independently priced and
// selectable. `items-stretch` is what lets the plan column match the info
// column's height instead of leaving dead space beneath it.
export default function RoomCard({
  room,
  roomsSelected,
  availableForDates,
  index = 0,
}: RoomCardProps) {
  return (
    <div
      style={{ animationDelay: `${index * 90}ms` }}
      className="
        group
        animate-fade-up
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-xl
      "
    >
      <div className="grid items-stretch lg:grid-cols-12">
        <div className="lg:col-span-4">
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
