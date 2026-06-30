"use client";

import Link from "next/link";
import { Room } from "./AvailableRooms";

interface Props {
  room: Room;
}

export default function RoomActions({
  room,
}: Props) {
  return (
    <div className="flex gap-3">
      <Link
        href={`/accommodations/${room.slug}`}
      >
        <button
          className="
          border
          border-[#B68D40]
          text-[#B68D40]
          px-5
          py-3
          rounded-lg
          hover:bg-[#B68D40]
          hover:text-white
          transition
        "
        >
          View Details
        </button>
      </Link>

     
    </div>
  );
}