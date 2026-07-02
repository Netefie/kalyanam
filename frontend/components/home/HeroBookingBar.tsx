"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  Users,
  ChevronDown,
  Check,
  Minus,
  Plus,
} from "lucide-react";

import LuxuryCalendar from "@/components/accommodations/LuxuryCalendar";
import { buildAccommodationsUrl } from "@/lib/reservation";

const roomTypes = [
  { id: "deluxe-room", name: "Deluxe" },
  { id: "super-deluxe-room", name: "Super Deluxe" },
];

export default function HeroBookingBar() {
  const router = useRouter();

  const [roomType, setRoomType] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  // Dates come straight from the calendar range — single source of truth so
  // the label always reflects the current selection.
  const checkIn = range?.from ?? null;
  const checkOut = range?.to ?? null;
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [roomOpen, setRoomOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [error, setError] = useState("");

  const roomRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Close the room / guests popovers on outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) {
        setRoomOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const selectedRoomName =
    roomTypes.find((r) => r.id === roomType)?.name || "Select Room";

  const dateLabel =
    checkIn && checkOut
      ? `${format(checkIn, "dd MMM")} — ${format(checkOut, "dd MMM")}`
      : "Check-in • Check-out";

  const guestSummary = `${rooms} Room${rooms > 1 ? "s" : ""}, ${adults} Adult${
    adults > 1 ? "s" : ""
  }${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}`;

  const handleBook = () => {
    setError("");
    if (!checkIn || !checkOut) {
      setError("Please select your check-in and check-out dates.");
      return;
    }
    router.push(
      buildAccommodationsUrl({
        roomType: roomType || undefined,
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
      })
    );
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-7xl">
      <div className="backdrop-blur-xl bg-[#5d5048]/75 border border-white/20 rounded-2xl shadow-2xl p-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

          {/* Room */}
          <div ref={roomRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setRoomOpen((v) => !v);
                setGuestsOpen(false);
              }}
              className="w-full flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <Building2 size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Room
                  </p>
                  <p className="text-lg">{selectedRoomName}</p>
                </div>
              </div>
              <ChevronDown
                className={`transition-transform ${roomOpen ? "rotate-180" : ""}`}
              />
            </button>

            {roomOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-xl border border-white/20 bg-[#4a3f38]/95 backdrop-blur-xl p-2 shadow-2xl">
                {roomTypes.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRoomType(r.id);
                      setRoomOpen(false);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-white transition hover:bg-white/10"
                  >
                    <span>{r.name}</span>
                    {roomType === r.id && <Check size={18} className="text-[#d8b46b]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCalOpen(true);
                setRoomOpen(false);
                setGuestsOpen(false);
              }}
              className="w-full flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <CalendarDays size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Date
                  </p>
                  <p className="text-lg">{dateLabel}</p>
                </div>
              </div>
              <ChevronDown />
            </button>

            <LuxuryCalendar
              open={calOpen}
              selected={range}
              onSelect={setRange}
              onClose={() => setCalOpen(false)}
              onApply={() => setCalOpen(false)}
            />
          </div>

          {/* Guests */}
          <div ref={guestsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setGuestsOpen((v) => !v);
                setRoomOpen(false);
              }}
              className="w-full flex items-center justify-between px-6 h-20 border border-white/30 rounded-xl text-white hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <Users size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Guests
                  </p>
                  <p className="text-lg truncate">{guestSummary}</p>
                </div>
              </div>
              <ChevronDown
                className={`transition-transform ${guestsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {guestsOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[280px] rounded-xl border border-white/20 bg-[#4a3f38]/95 backdrop-blur-xl p-5 shadow-2xl">
                <GuestRow
                  label="Adults"
                  value={adults}
                  min={1}
                  onChange={setAdults}
                />
                <div className="my-3 h-px bg-white/10" />
                <GuestRow
                  label="Children"
                  value={children}
                  min={0}
                  onChange={setChildren}
                />
                <div className="my-3 h-px bg-white/10" />
                <GuestRow label="Rooms" value={rooms} min={1} onChange={setRooms} />
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleBook}
            className="h-20 rounded-xl bg-[#d8b46b] text-black font-semibold text-lg hover:bg-[#e5c47c] transition flex items-center justify-center tracking-wide"
          >
            BOOK NOW
          </button>

        </div>

        {error && (
          <p className="mt-2 rounded-md bg-red-500/85 px-3 py-2 text-sm text-white">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function GuestRow({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between text-white">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition hover:border-[#d8b46b] disabled:opacity-30"
        >
          <Minus size={15} />
        </button>
        <span className="w-5 text-center font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition hover:border-[#d8b46b]"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
