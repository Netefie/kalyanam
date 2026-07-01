"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  BedDouble,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

interface GuestRoomSelectorProps {
  adults: number;
  children: number;
  rooms: number;
  onChange: (data: {
    adults: number;
    children: number;
    rooms: number;
  }) => void;
}

export default function GuestRoomSelector({
  adults,
  children,
  rooms,
  onChange,
}: GuestRoomSelectorProps) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const update = (
    key: "adults" | "children" | "rooms",
    value: number
  ) => {
    onChange({
      adults,
      children,
      rooms,
      [key]: value,
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-full"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full
          h-full
          px-6
          py-3
          flex
          items-center
          justify-between
          hover:bg-[#fcfaf6]
          transition-all
        "
      >
        <div className="flex items-center gap-4">
          <Users
            size={22}
            className="text-[#b28a35]"
          />

          <div className="text-left">
            <p className="text-xs uppercase tracking-[2px] text-gray-500">
              Guests & Rooms
            </p>

            <p className="font-medium text-l text-[#2c2c2c]">
              {adults} Adult{adults > 1 ? "s" : ""}

              {children > 0 &&
                ` • ${children} Child${
                  children > 1 ? "ren" : ""
                }`}

              {` • ${rooms} Room${
                rooms > 1 ? "s" : ""
              }`}
            </p>
          </div>
        </div>

        <div
  style={{
    marginLeft: "auto",
    width: "40px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
  }}
>
  <ChevronDown
    size={18}
    style={{
      transition: "transform 0.3s ease",
      transform: open
        ? "rotate(180deg)"
        : "rotate(0deg)",
    }}
  />
</div>
      </button>

      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            mt-2
            w-340px
            bg-white
            rounded-xl
            border
            border-gray-200
            shadow-2xl
            z-50
            p-5
          "
        >
          <Counter
            icon={<Users size={18} />}
            title="Adults"
            subtitle="Age 13+"
            value={adults}
            min={1}
            max={10}
            onDecrease={() =>
              update("adults", Math.max(1, adults - 1))
            }
            onIncrease={() =>
              update("adults", Math.min(10, adults + 1))
            }
          />

          <div className="border-t my-4" />

          <Counter
            icon={<Users size={18} />}
            title="Children"
            subtitle="Age 0-12"
            value={children}
            min={0}
            max={6}
            onDecrease={() =>
              update(
                "children",
                Math.max(0, children - 1)
              )
            }
            onIncrease={() =>
              update(
                "children",
                Math.min(6, children + 1)
              )
            }
          />

          <div className="border-t my-4" />

          <Counter
            icon={<BedDouble size={18} />}
            title="Rooms"
            subtitle="Select Rooms"
            value={rooms}
            min={1}
            max={5}
            onDecrease={() =>
              update("rooms", Math.max(1, rooms - 1))
            }
            onIncrease={() =>
              update("rooms", Math.min(5, rooms + 1))
            }
          />

          <button
            onClick={() => setOpen(false)}
            className="
              mt-6
              w-full
              bg-[#b28a35]
              hover:bg-[#9d782d]
              text-white
              py-3
              rounded-lg
              font-semibold
              tracking-wide
              transition-all
            "
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

interface CounterProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  min: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function Counter({
  icon,
  title,
  subtitle,
  value,
  min,
  max,
  onDecrease,
  onIncrease,
}: CounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-[#b28a35]">
          {icon}
        </div>

        <div>
          <p className="font-medium text-[#222]">
            {title}
          </p>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={value <= min}
          onClick={onDecrease}
          className="
            w-9
            h-9
            rounded-full
            border
            flex
            items-center
            justify-center
            disabled:opacity-30
            hover:border-[#b28a35]
            transition-all
          "
        >
          <Minus size={15} />
        </button>

        <span className="w-6 text-center font-semibold">
          {value}
        </span>

        <button
          disabled={value >= max}
          onClick={onIncrease}
          className="
            w-9
            h-9
            rounded-full
            border
            flex
            items-center
            justify-center
            disabled:opacity-30
            hover:border-[#b28a35]
            transition-all
          "
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}