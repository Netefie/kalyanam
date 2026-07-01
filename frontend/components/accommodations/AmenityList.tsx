"use client";

import { Check } from "lucide-react";
import { Room } from "./AvailableRooms";

interface Props {
  room: Room;
}

export default function AmenityList({
  room,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {room.breakfast && (
        <Amenity text="Breakfast Included" />
      )}

      {room.cancellation && (
        <Amenity text="Free Cancellation" />
      )}

      <Amenity text="Free WiFi" />

      <Amenity text="Air Conditioning" />

      <Amenity text="Room Service" />

      <Amenity text="Smart TV" />
    </div>
  );
}

function Amenity({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Check
        size={16}
        className="text-green-600"
      />

      <span className="text-sm text-gray-700">
        {text}
      </span>
    </div>
  );
}