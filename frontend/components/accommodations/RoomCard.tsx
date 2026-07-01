"use client";

import {
  Star,
  Users,
  BedDouble,
  Bath,
  Move,
  MapPin,
} from "lucide-react";

import { Room } from "./AvailableRooms";
import PriceCard from "./PriceCard";
import AmenityList from "./AmenityList";
import ImageGallery from "./ImageGallery";
import RoomActions from "./RoomActions";
import RoomBadge from "./RoomBadge";

interface RoomCardProps {
  room: Room;
  nights: number;
  roomsSelected: number;
  availableForDates?: number;
}

export default function RoomCard({
  room,
  nights,
  roomsSelected,
  availableForDates,
}: RoomCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        border
        border-gray-200
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
      "
    >
      {/* Header */}

      <div className="grid lg:grid-cols-12">
        {/* LEFT */}

        <div className="relative lg:col-span-4">
          <ImageGallery
            image={room.image}
            title={room.title}
          />

          <div className="absolute top-5 left-5">
            <RoomBadge />
          </div>
        </div>

        {/* RIGHT */}

        <div className="lg:col-span-8 p-7">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-family:'Cormorant Garamond'serif font-semibold text-[#222]">
                  {room.title}
                </h2>

                <div className="flex items-center gap-1 text-[#F5A623]">
                  <Star
                    size={18}
                    fill="currentColor"
                  />

                  <span className="font-medium text-gray-700">
                    {room.rating}
                  </span>

                  <span className="text-gray-400">
                    ({room.reviews})
                  </span>
                </div>
              </div>

              <p className="mt-4 leading-7 text-gray-600">
                {room.description}
              </p>

              <div className="mt-7">
                <AmenityList room={room} />
              </div>
            </div>

            {/* PRICE */}

            <div className="w-280px shrink-0">
              <PriceCard
                room={room}
                nights={nights}
                roomsSelected={roomsSelected}
                availableForDates={availableForDates}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="border-t border-gray-200 px-7 py-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Room Info */}

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <Move
                size={18}
                className="text-[#B68D40]"
              />
              <span>{room.size}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users
                size={18}
                className="text-[#B68D40]"
              />
              <span>
                Up to {room.guests} Guest
                {room.guests > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <BedDouble
                size={18}
                className="text-[#B68D40]"
              />
              <span>{room.bed}</span>
            </div>

            <div className="flex items-center gap-2">
              <Bath
                size={18}
                className="text-[#B68D40]"
              />
              <span>1 Bathroom</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-[#B68D40]"
              />
              <span>City View</span>
            </div>
          </div>

          {/* Actions */}

          <RoomActions room={room} />
        </div>
      </div>
    </div>
  );
}