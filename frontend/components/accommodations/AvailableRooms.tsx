"use client";

import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { useBookingContext } from "./context/BookingContext";
import useRoomAvailability from "@/hooks/useRoomAvailability";
import { api, type Room as ApiRoom, type RatePlan } from "@/lib/api";

export type { RatePlan };

export interface Room {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  offerPrice: number;
  ratePlans: RatePlan[];
  rating: number;
  reviews: number;
  size: string;
  guests: number;
  bed: string;
  breakfast: boolean;
  cancellation: boolean;
}

// Map the backend room shape onto the shape this UI already expects, so none
// of the downstream components (RoomCard, PriceCard, BookingSummary, ...) need
// to change.
function mapRoom(r: ApiRoom, index: number): Room {
  return {
    id: index + 1,
    slug: r.slug,
    title: r.name,
    description: r.description,
    image: r.image,
    images: r.images ?? [],
    price: r.price,
    offerPrice: r.offerPrice ?? r.price,
    ratePlans: r.ratePlans,
    rating: r.rating,
    reviews: r.reviews,
    size: r.size,
    guests: r.maxGuests,
    bed: r.bed,
    breakfast: r.breakfast,
    cancellation: r.cancellation,
  };
}

export default function AvailableRooms() {
  const { booking } = useBookingContext();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.rooms
      .list()
      .then((data) => {
        if (!cancelled) setRooms(data.map(mapRoom));
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load rooms right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // slug -> rooms still available for the selected dates — one batch
  // request for every room instead of one request per room (see
  // hooks/useRoomAvailability.ts).
  const { availability } = useRoomAvailability({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
  });

  const filteredRooms = rooms.filter((room) => {
    // Before search show all rooms
    if (!booking.searched) return true;

    // Filter by room type
    if (
      booking.roomType &&
      booking.roomType !== room.slug
    ) {
      return false;
    }

    // Guest capacity — a room's `guests` cap applies per room, so a party of
    // 4 booking 2 rooms of a 2-guest room fits. Comparing against a single
    // room's capacity regardless of `rooms` requested used to hide every
    // room for exactly this case ("No Rooms Available" for a family that
    // would fit fine across two doubles). Children count toward capacity
    // too — a 2+2 family used to pass this check against a 2-guest room
    // simply because only `adults` was compared.
    if (booking.adults + booking.children > room.guests * booking.rooms) {
      return false;
    }

    return true;
  });

  // Once dates are picked, "available" means rooms that can actually take
  // this booking's room count — a room already sold out for the range
  // shouldn't inflate the headline count even though it still shows in the
  // list (as "Sold Out", so the guest can see it and pick different dates).
  const availableCount = booking.searched && (booking.checkIn || booking.checkOut)
    ? filteredRooms.filter((room) => {
        const forDates = availability[room.slug];
        return forDates === undefined || forDates >= booking.rooms;
      }).length
    : filteredRooms.length;

  return (
    <section id="available-rooms" className="py-8 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-4">

          <h2 className="font-cormorant text-4xl text-[#2d2d2d]">
            Available Rooms
          </h2>

          <p className="text-gray-500 mt-2">
            {loading
              ? "Loading rooms…"
              : `${availableCount} room${
                  availableCount !== 1 ? "s" : ""
                } available for your selected dates.`}
          </p>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <h3 className="text-2xl font-semibold text-[#222]">
              Something went wrong
            </h3>
            <p className="mt-3 text-gray-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
            Fetching available rooms…
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <h3 className="text-2xl font-semibold text-[#222]">
              No Rooms Available
            </h3>

            <p className="mt-3 text-gray-500">
              Please change your dates or guest count.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredRooms.map((room, index) => (
              <RoomCard
                key={room.slug}
                room={room}
                index={index}
                roomsSelected={booking.rooms}
                availableForDates={availability[room.slug]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
