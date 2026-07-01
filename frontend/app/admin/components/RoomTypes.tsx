"use client";

import Image from "next/image";
import {
  BedDouble,
  Users,
  Move,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Star,
} from "lucide-react";

const rooms = [
  {
    id: 1,
    title: "Deluxe Room",
    image: "/rooms/deluxe.jpg",
    guests: 2,
    size: "320 sq.ft",
    price: "₹3,999",
    total: 12,
    available: 5,
    featured: true,
  },
  {
    id: 2,
    title: "Super Deluxe",
    image: "/rooms/super-deluxe.jpg",
    guests: 3,
    size: "420 sq.ft",
    price: "₹5,499",
    total: 10,
    available: 3,
    featured: false,
  },
  {
    id: 3,
    title: "Luxury Suite",
    image: "/rooms/suite.jpg",
    guests: 4,
    size: "650 sq.ft",
    price: "₹8,999",
    total: 6,
    available: 2,
    featured: true,
  },
];

export default function RoomTypes() {
  return (
    <>
      <div className="header">

        <div>

          <h2>Room Types</h2>

          <p>
            Manage room categories available on your website.
          </p>

        </div>

        <button>

          <Plus size={18} />

          Add Room Type

        </button>

      </div>

      <div className="grid">

        {rooms.map((room) => (

          <div
            key={room.id}
            className="card"
          >

            <div className="image">

              <Image
                src={room.image}
                alt={room.title}
                fill
              />

              {room.featured && (

                <div className="featured">

                  <Star
                    size={14}
                    fill="currentColor"
                  />

                  Featured

                </div>

              )}

            </div>

            <div className="content">

              <div className="top">

                <h3>
                  {room.title}
                </h3>

                <span className="price">
                  {room.price}
                </span>

              </div>

              <div className="info">

                <div>

                  <Users size={16} />

                  {room.guests} Guests

                </div>

                <div>

                  <Move size={16} />

                  {room.size}

                </div>

                <div>

                  <BedDouble size={16} />

                  {room.total} Rooms

                </div>

              </div>

              <div className="availability">

                <div>

                  <strong>
                    {room.available}
                  </strong>

                  Available

                </div>

                <div>

                  <strong>
                    {room.total - room.available}
                  </strong>

                  Occupied

                </div>

              </div>

              <div className="actions">

                <button>

                  <Eye size={17} />

                </button>

                <button>

                  <Pencil size={17} />

                </button>

                <button>

                  <Trash2 size={17} />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* PART 2 CSS */}
    </>
  );
}