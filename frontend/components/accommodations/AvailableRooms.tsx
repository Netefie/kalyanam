"use client";

import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { useBookingContext } from "./context/BookingContext";
import { api, type Room as ApiRoom } from "@/lib/api";

export interface Room {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
  offerPrice: number;
  rating: number;
  reviews: number;
  size: string;
  guests: number;
  bed: string;
  breakfast: boolean;
  cancellation: boolean;
  available: boolean;
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
    price: r.price,
    offerPrice: r.offerPrice ?? r.price,
    rating: r.rating,
    reviews: r.reviews,
    size: r.size,
    guests: r.maxGuests,
    bed: r.bed,
    breakfast: r.breakfast,
    cancellation: r.cancellation,
    available: r.availableRooms > 0,
  };
}

export default function AvailableRooms() {
  const { booking, nights } = useBookingContext();

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

    // Guest capacity
    if (booking.adults > room.guests) {
      return false;
    }

    return true;
  });

  return (
    <section className="py-8 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-4">

          <h2
            className="text-4xl text-[#2d2d2d]"
            style={{
              fontFamily: "Cormorant Garamond",
            }}
          >
            Available Rooms
          </h2>

          <p className="text-gray-500 mt-2">
            {loading
              ? "Loading rooms…"
              : `${filteredRooms.length} room${
                  filteredRooms.length !== 1 ? "s" : ""
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
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights}
                roomsSelected={booking.rooms}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
