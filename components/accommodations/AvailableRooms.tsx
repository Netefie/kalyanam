"use client";

import RoomCard from "./RoomCard";
import { useBookingContext } from "./context/BookingContext";

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

const rooms: Room[] = [
  {
    id: 1,
    slug: "deluxe-room",
    title: "Deluxe Room",
    description:
      "Elegantly designed rooms with modern interiors, premium amenities and scenic resort views.",
    image: "/rooms/deluxe.png",
    price: 5499,
    offerPrice: 4699,
    rating: 4.8,
    reviews: 214,
    size: "320 sq.ft",
    guests: 2,
    bed: "King Bed",
    breakfast: true,
    cancellation: true,
    available: true,
  },
  {
    id: 2,
    slug: "super-deluxe-room",
    title: "Super Deluxe Room",
    description:
      "Spacious luxury accommodation perfect for families and leisure travellers.",
    image: "/rooms/deluxe.png",
    price: 7499,
    offerPrice: 6599,
    rating: 4.9,
    reviews: 189,
    size: "420 sq.ft",
    guests: 3,
    bed: "King Bed",
    breakfast: true,
    cancellation: true,
    available: true,
  },
  ];

export default function AvailableRooms() {
  const { booking, nights } = useBookingContext();
  console.log("Booking:", booking);

console.log("Rooms:", rooms);
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
            {filteredRooms.length} room
            {filteredRooms.length !== 1 ? "s" : ""} available
            for your selected dates.
          </p>
        </div>

        {filteredRooms.length === 0 ? (
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