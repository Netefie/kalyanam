"use client";

import Link from "next/link";
import { Room } from "./AvailableRooms";

interface Props {
  room: Room;
}

export default function RoomActions({ room }: Props) {
  return (
    <Link
      href={`/accommodations/${room.slug}`}
      className="text-sm font-medium text-[#B68D40] underline underline-offset-4 transition hover:text-[#9f7b37]"
    >
      More Details
    </Link>
  );
}
