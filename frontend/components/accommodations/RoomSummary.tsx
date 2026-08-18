"use client";

import { ReactNode } from "react";
import { Star, BedDouble, Bath, Move, MapPin } from "lucide-react";

import { Room } from "./AvailableRooms";
import ImageGallery from "./ImageGallery";
import RoomBadge from "./RoomBadge";
import AmenityList from "./AmenityList";
import RoomActions from "./RoomActions";

interface Props {
  room: Room;
}

// Left-hand info column of a room card: photo, title/rating, specs and
// amenities. Rendered once per room, independent of how many rate plans it
// sells — the plans themselves are rendered by RatePlanList.
export default function RoomSummary({ room }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[4/3] w-full shrink-0">
        <ImageGallery image={room.image} title={room.title} />
        <div className="absolute left-5 top-5">
          <RoomBadge />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h2
          className="text-2xl font-semibold text-[#222]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          {room.title}
        </h2>

        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1 text-[#F5A623]">
            <Star size={14} fill="currentColor" />
            <span className="font-medium text-gray-700">{room.rating}</span>
            <span className="text-gray-400">({room.reviews})</span>
          </span>

          <span>
            Max {room.guests} Guest{room.guests > 1 ? "s" : ""}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">{room.description}</p>

        <div className="mt-5 space-y-3 text-sm text-gray-700">
          <SpecRow icon={<Move size={17} className="text-[#B68D40]" />} text={room.size} />
          <SpecRow icon={<BedDouble size={17} className="text-[#B68D40]" />} text={room.bed} />
          <SpecRow icon={<Bath size={17} className="text-[#B68D40]" />} text="1 Bathroom" />
          <SpecRow icon={<MapPin size={17} className="text-[#B68D40]" />} text="City View" />
        </div>

        <div className="mt-5">
          <AmenityList />
        </div>

        <div className="mt-auto pt-6">
          <RoomActions room={room} />
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}
