"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import type { RoomType } from "./types";

import DateRangePicker from "./DateRangePicker";
import GuestRoomSelector from "./GuestRoomSelector";
import RoomSelector from "./RoomSelector";

import { useBookingContext } from "./context/BookingContext";
import { api } from "@/lib/api";

export default function BookingSearchBar() {
  const { booking, setBooking } =
    useBookingContext();

  // Room list drives the "Room Type" dropdown — loaded from the same API
  // AvailableRooms renders, so a room added/renamed/retired in the admin
  // panel shows up here too instead of drifting from a hardcoded list.
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.rooms
      .list()
      .then((rooms) => {
        if (!cancelled) setRoomTypes(rooms.map((r) => ({ id: r.slug, name: r.name })));
      })
      .catch(() => {
        // The dropdown just stays empty ("Any Room") — AvailableRooms below
        // will surface its own error if the API is genuinely down.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateBooking = (
    data: Partial<typeof booking>
  ) => {
    setBooking((prev) => ({
      ...prev,
      ...data,
    }));
    setSearchError("");
  };

  const handleSearch = () => {
    if (!booking.checkIn) {
      setSearchError("Please select a check-in date.");
      return;
    }

    if (!booking.checkOut) {
      setSearchError("Please select a check-out date.");
      return;
    }

    setSearchError("");
    setBooking((prev) => ({
      ...prev,
      searched: true,
    }));

    document
      .getElementById("available-rooms")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <>
      <section className="booking-search-bar w-full mt-10">

        {searchError && (
          <p className="px-4 pt-3 text-sm font-medium text-red-600 sm:px-6">{searchError}</p>
        )}

        <div className="booking-grid">

          {/* Room */}

          <div className="booking-item">

            <RoomSelector
              rooms={roomTypes}
              value={booking.roomType}
              onChange={(value) =>
                updateBooking({
                  roomType: value,
                })
              }
            />

          </div>

          {/* Dates */}

          <div className="booking-item">

            <DateRangePicker
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              onChange={(checkIn, checkOut) =>
                updateBooking({
                  checkIn,
                  checkOut,
                })
              }
            />

          </div>

          {/* Guests */}

          <div className="booking-item">

            <GuestRoomSelector
              adults={booking.adults}
              children={booking.children}
              rooms={booking.rooms}
              onChange={(values) =>
                updateBooking(values)
              }
            />

          </div>

          {/* Search */}

          <button
            onClick={handleSearch}
            className="searchButton"
          >
            <Search size={20} />

            <span>
              Search
            </span>

          </button>

        </div>

      </section>
            <style jsx>{`
        .booking-search-bar {
          background: #faf8f4;
          border: 1px solid #d7c8aa;
        overflow: visible;
        position: relative;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
        }

        .booking-grid {
          display: grid;
          grid-template-columns: 2.5fr 4fr 3fr 2fr;
          align-items: stretch;
        }

        .booking-item {
          border-right: 1px solid #d7c8aa;
          min-height: 42px;
          display: flex;
          align-items: center;
          background: white;
          transition: background 0.3s ease;
          overflow: visible;
          position: relative;
        }

        .booking-item:hover {
          background: #fcfaf6;
        }

        .searchButton {
          min-height: 42px;
          background: #b28a35;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 20px;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          transition: all 0.35s ease;
        }

        .searchButton:hover {
          background: #9c7628;
        }

        .searchButton:active {
          transform: scale(0.98);
        }
        
        /* =======================
           Large Desktop
        ======================== */

        @media (min-width: 1600px) {
          .booking-grid {
            grid-template-columns: 3fr 4fr 3fr 2fr;
          }

          .booking-item,
          .searchButton {
            min-height: 96px;
          }
        }

        /* =======================
           Laptop
        ======================== */

        @media (max-width: 1280px) {
          .booking-grid {
            grid-template-columns: 3fr 4fr 3fr 2fr;
          }

          .booking-item,
          .searchButton {
            min-height: 84px;
          }

          .searchButton {
            font-size: 13px;
            letter-spacing: 1px;
          }
        }

        /* =======================
           Tablet
        ======================== */

        @media (max-width: 1024px) {
          .booking-grid {
            grid-template-columns: 1fr 1fr;
          }

          .booking-item {
            border-right: none;
            border-bottom: 1px solid #d7c8aa;
          }

          .booking-item:nth-child(1) {
            border-right: 1px solid #d7c8aa;
          }

          .booking-item:nth-child(3) {
            border-right: 1px solid #d7c8aa;
            border-bottom: none;
          }

          .searchButton {
            min-height: 78px;
          }
        }

        /* =======================
           Mobile
        ======================== */

        @media (max-width: 768px) {
          .booking-search-bar {
            border-radius: 12px;
          }

          .booking-grid {
            display: flex;
            flex-direction: column;
          }

          .booking-item {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #d7c8aa;
            min-height: 74px;
          }

          .searchButton {
            width: 100%;
            min-height: 64px;
            font-size: 14px;
            letter-spacing: 1px;
          }
        }

        /* =======================
           Small Mobile
        ======================== */

        @media (max-width: 576px) {
          .booking-search-bar {
            margin-top: 20px;
          }

          .booking-item {
            min-height: 68px;
          }

          .searchButton {
            min-height: 58px;
            font-size: 13px;
            gap: 8px;
          }
        }

        /* =======================
           iPhone SE
        ======================== */

        @media (max-width: 390px) {
          .booking-item {
            min-height: 64px;
          }

          .searchButton {
            min-height: 54px;
            font-size: 12px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </>
  );
}