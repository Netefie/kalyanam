"use client";

import { AppWindow, Bath, BedDouble, Move, Users, type LucideIcon } from "lucide-react";

import { Room } from "./AvailableRooms";
import ImageGallery from "./ImageGallery";
import RoomBadge from "./RoomBadge";

interface Props {
  room: Room;
}

// Left-hand column of a room card: the photo and a compact two-column spec
// grid. Rate plans, pricing and the room name all live in the right-hand
// column (RatePlanList), so this stays short enough not to outgrow it.
export default function RoomSummary({ room }: Props) {
  // Derived rather than five hand-written rows, so adding a spec is one line.
  // "City View" / "1 Bathroom" are fixed for now — the RoomType model has no
  // view or bathroom field yet.
  const specs: { icon: LucideIcon; label: string }[] = [
    { icon: Move, label: room.size },
    { icon: Users, label: `Up to ${room.guests} guests` },
    { icon: AppWindow, label: "City View" },
    { icon: BedDouble, label: room.bed },
    { icon: Bath, label: "1 Bathroom" },
  ];

  return (
    <div className="flex h-full flex-col p-6">
      <div className="relative aspect-[8/7] w-full shrink-0">
        <ImageGallery image={room.image} images={room.images} title={room.title} />

        <div className="absolute left-4 top-4 z-10">
          <RoomBadge />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
        {specs.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-sm text-gray-700">
            <Icon size={18} className="shrink-0 text-[#8B5E34]" strokeWidth={1.5} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
