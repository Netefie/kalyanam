"use client";

import { useState, useRef, useEffect } from "react";
import { BedDouble, ChevronDown, Check } from "lucide-react";
import { RoomType } from "./types";

interface RoomSelectorProps {
  rooms: RoomType[];
  value: string;
  onChange: (value: string) => void;
}

export default function RoomSelector({
  rooms,
  value,
  onChange,
}: RoomSelectorProps) {
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const selectedRoom = rooms.find(
    (room) => room.id === value
  );

  return (
    <>
      <div
        ref={wrapperRef}
        className="roomSelector"
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="selectorButton"
        >
          <div className="selectorContent">
            <BedDouble
              size={22}
              className="roomIcon"
            />

            <div className="textContent">
              <p className="label">
                Room Type
              </p>

              <p className="value">
                {selectedRoom
                  ? selectedRoom.name
                  : "Select Room"}
              </p>
            </div>
          </div>

          <div className="arrowWrapper">
  <ChevronDown
    size={18}
    className={`arrow ${open ? "rotate" : ""}`}
  />
</div>
        </button>

        {open && (
          <div className="dropdown">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onChange(room.id);
                  setOpen(false);
                }}
                className="dropdownItem"
              >
                <span className="roomName">
                  {room.name}
                </span>

                {room.id === value && (
                  <Check
                    size={18}
                    className="checkIcon"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .roomSelector {
          position: relative;
          height: 100%;
        }

       .selectorButton {
  width: 100%;
  height: 100%;
  padding: 1px 18px;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
}


.arrowWrapper {
  margin-left: auto;
  width: 38px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


        .selectorButton:hover {
          background: #fcfaf6;
        }

        .selectorContent {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

        .roomIcon {
          color: #b28a35;
          flex-shrink: 0;
        }

        .textContent {
          text-align: left;
        }

        .label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #6b7280;
          margin: 0 0 4px;
        }

        .value {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          font-family: "Lato", sans-serif;
          color: #2c2c2c;
        }

        .arrow {
  transition: transform 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

        .dropdown {
          position: absolute;
          left: 0;
          top: calc(100% + 8px);
          width: 100%;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          z-index: 100;
        }

        .dropdownItem {
          width: 100%;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .dropdownItem:hover {
          background: #faf8f4;
        }

        .roomName {
          font-size: 15px;
          color: #333;
        }

        .checkIcon {
          color: #b28a35;
        }

        @media (max-width: 768px) {
          .selectorButton {
            padding: 12px 18px;
          }

          .selectorContent {
            gap: 12px;
          }

          .label {
            font-size: 10px;
          }

          .value {
            font-size: 14px;
          }

          .dropdownItem {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
}