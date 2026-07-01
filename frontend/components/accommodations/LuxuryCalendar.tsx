"use client";

import { useEffect, useRef } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface LuxuryCalendarProps {
  open: boolean;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onClose: () => void;
  onApply: () => void;
}

export default function LuxuryCalendar({
  open,
  selected,
  onSelect,
  onClose,
  onApply,
}: LuxuryCalendarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClick
      );
    }

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="calendarOverlay">
        <div
          ref={ref}
          className="calendarPopup"
        >
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={selected}
            onSelect={onSelect}
            disabled={{
              before: new Date(),
            }}
            showOutsideDays
            components={{
              PreviousMonthButton: (props) => (
                <button
                  {...props}
                  className="navButton"
                >
                  <ChevronLeft size={18} />
                </button>
              ),

              NextMonthButton: (props) => (
                <button
                  {...props}
                  className="navButton"
                >
                  <ChevronRight size={18} />
                </button>
              ),
            }}
          />

          <div className="calendarFooter">
            <div className="summary">
              <div>
                <span>Check In</span>

                <strong>
                  {selected?.from
                    ? format(
                        selected.from,
                        "dd MMM yyyy"
                      )
                    : "--"}
                </strong>
              </div>

              <div>
                <span>Check Out</span>

                <strong>
                  {selected?.to
                    ? format(
                        selected.to,
                        "dd MMM yyyy"
                      )
                    : "--"}
                </strong>
              </div>
            </div>

            <button
              className="applyButton"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              APPLY DATES
            </button>
          </div>
        </div>
      </div>

     <style jsx global>{`
  .calendarOverlay {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    z-index: 9999;
    animation: fadeUp 0.28s ease;
  }

  .calendarPopup {
    width: 320px;
    background: #fff;
    border-radius: 18px;
    border: 1px solid #e9dcc3;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.14);
    overflow: hidden;
  }

  /* ---------------- Header ---------------- */

  .rdp {
    margin: 0;
    padding: 28px;
    --rdp-accent-color: #b28a35;
    --rdp-background-color: #f8f5ee;
  }

  .rdp-month_caption {
    justify-content: center;
    margin-bottom: 20px;
  }

  .rdp-caption_label {
    font-size: 28px;
    font-family: "Playfair Display", serif;
    font-weight: 500;
    color: #2c2c2c;
    letter-spacing: 1px;
  }

  .rdp-nav {
    width: 100%;
    position: absolute;
    top: 26px;
    left: 0;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .navButton {
    pointer-events: all;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #e5d5b3;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .25s;
  }

  .navButton:hover {
    background: #b28a35;
    color: white;
    border-color: #b28a35;
  }

  /* ---------------- Week Days ---------------- */

  .rdp-weekday {
    color: #8b8b8b;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding-bottom: 14px;
  }

  /* ---------------- Days ---------------- */

  .rdp-day {
    width: 46px;
    height: 46px;
    font-size: 15px;
    border-radius: 10px;
    transition: .25s;
  }

  .rdp-day_button {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    transition: .25s;
    font-weight: 500;
  }

  .rdp-day:hover .rdp-day_button {
    background: #f8f5ee;
    color: #b28a35;
  }

  .rdp-selected .rdp-day_button {
    background: #b28a35 !important;
    color: white !important;
  }

  .rdp-range_middle .rdp-day_button {
    background: #efe5cf;
    color: #b28a35;
    border-radius: 0;
  }

  .rdp-range_start .rdp-day_button,
  .rdp-range_end .rdp-day_button {
    background: #b28a35;
    color: white;
    border-radius: 10px;
  }

  .rdp-day_today .rdp-day_button {
    border: 1px solid #b28a35;
    color: #b28a35;
  }

  /* ---------------- Footer ---------------- */

  .calendarFooter {
    border-top: 1px solid #ece6d8;
    padding: 22px;
    background: #faf8f4;
  }

  .summary {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .summary span {
    display: block;
    font-size: 11px;
    color: #8d8d8d;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .summary strong {
    color: #2c2c2c;
    font-size: 15px;
    font-weight: 600;
  }

  .applyButton {
    width: 100%;
    height: 52px;
    border: none;
    background: #b28a35;
    color: white;
    letter-spacing: 3px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: .25s;
    border-radius: 10px;
  }

  .applyButton:hover {
    background: #9b772e;
  }

  /* ---------------- Animation ---------------- */

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px) scale(.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* ---------------- Mobile ---------------- */

  @media (max-width:768px){

    .calendarOverlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      display:flex;
      justify-content:center;
      align-items:flex-end;
      padding:20px;
    }

    .calendarPopup{
      width:100%;
      border-radius:22px 22px 0 0;
    }

    .rdp{
      padding:20px;
    }

    .rdp-day{
      width:42px;
      height:42px;
    }

  }
`}</style>
    </>
  );
}