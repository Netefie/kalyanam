"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import "react-day-picker/dist/style.css";
import { api } from "@/lib/api";

// "2026-09-10" for a calendar cell's Date — date-fns's format() reads local
// wall-clock fields (not UTC), so this always matches the day the guest
// sees regardless of their timezone, which is what the backend's own
// hotel-day-anchored keys represent (see backend/src/utils/dates.js#toDayKey).
const toDayKey = (date: Date) => format(date, "yyyy-MM-dd");

interface LuxuryCalendarProps {
  open: boolean;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onClose: () => void;
  onApply: () => void;
  // The room type currently filtered on ("" = any room) and how many rooms
  // the guest wants — together they decide which calendar days show as
  // sold out. Optional so this component still works anywhere a caller
  // doesn't have that context yet.
  roomSlug?: string;
  roomsRequested?: number;
}

export default function LuxuryCalendar({
  open,
  selected,
  onSelect,
  onClose,
  onApply,
  roomSlug,
  roomsRequested = 1,
}: LuxuryCalendarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState<Date>(selected?.from ?? new Date());

  // Days in the visible month where every relevant room (the selected room
  // type, or — with "Any Room" — every active room) has fewer rooms free
  // than the guest wants. Refetched whenever the visible month, the room
  // filter, or the room count changes.
  const [soldOutDays, setSoldOutDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const from = startOfMonth(month);
    const to = endOfMonth(month);

    api.rooms
      .availabilityCalendar(from.toISOString(), to.toISOString(), roomSlug || undefined)
      .then((res) => {
        if (cancelled) return;
        // A day is sold out only when *every* returned room type is sold
        // out on it — with no room filter that's every active room; with
        // one selected, the response has just that one.
        const dayCounts = new Map<string, number>(); // date key -> rooms still short of every room type checked
        const totalRooms = res.rooms.length;
        if (totalRooms === 0) {
          setSoldOutDays(new Set());
          return;
        }
        for (const room of res.rooms) {
          for (const day of room.days) {
            if (day.available < roomsRequested) {
              dayCounts.set(day.date, (dayCounts.get(day.date) || 0) + 1);
            }
          }
        }
        const soldOut = new Set<string>();
        for (const [date, count] of dayCounts) {
          if (count >= totalRooms) soldOut.add(date);
        }
        setSoldOutDays(soldOut);
      })
      .catch(() => {
        if (!cancelled) setSoldOutDays(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [open, month, roomSlug, roomsRequested]);

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
            // Renders prev/caption/next as siblings inside .rdp-month, so the
            // month reads "‹ September 2026 ›". Without it the chevrons live in
            // a separate .rdp-nav container that has to be absolutely positioned
            // over the caption, which pinned them to the popup's outer edges.
            navLayout="around"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={onSelect}
            disabled={[
              { before: new Date() },
              (date: Date) => soldOutDays.has(toDayKey(date)),
            ]}
            modifiers={{ soldOut: (date: Date) => soldOutDays.has(toDayKey(date)) }}
            modifiersClassNames={{ soldOut: "rdp-day_sold_out" }}
            showOutsideDays
            components={{
              // props.className carries rdp-button_previous / rdp-button_next,
              // which is what navLayout="around" keys its positioning off — so
              // it has to be kept, not replaced, or both chevrons collapse to
              // the same spot.
              PreviousMonthButton: ({ className, ...props }) => (
                <button
                  {...props}
                  className={`${className ?? ""} navButton`}
                >
                  <ChevronLeft size={18} />
                </button>
              ),

              NextMonthButton: ({ className, ...props }) => (
                <button
                  {...props}
                  className={`${className ?? ""} navButton`}
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
    /* Anchored bottom-to-top: the booking bar sits at the foot of the hero, so
       a downward panel opened straight into the fold. */
    bottom: calc(100% + 12px);
    left: 0;
    /* Never let the popover run past the right edge of the page — under zoom
       the anchor can sit close enough to it that a left-aligned 320px panel
       would hang off, and it would be clipped rather than scrollable. */
    max-width: calc(100vw - 24px);
    z-index: 9999;
    animation: fadeUp 0.28s ease;
  }

  .calendarPopup {
    /* 7 day cells (7 x 46px) + .rdp's 24px side padding. Anything narrower
       clips the last column. */
    width: 380px;
    max-width: 100%;
    /* Opening upward means the growth direction is toward the top of the
       screen, so on a short viewport the header would be the part that goes
       out of reach. Scroll internally instead. */
    max-height: calc(100svh - 140px);
    background: #fff;
    border-radius: 18px;
    border: 1px solid #e9dcc3;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.14);
    /* x hidden keeps the rounded corners clipping; y auto lets the max-height
       above actually scroll rather than truncate. */
    overflow: hidden auto;
  }

  /* ---------------- Header ---------------- */

  /* .rdp-root, not .rdp — v10 names the root rdp-root, so the old .rdp
     rule here never matched anything and its padding was never applied. */
  .rdp-root {
    margin: 0;
    padding: 20px;
    /* The mobile sheet is full-bleed and much wider than the grid, which
       otherwise sits hard against the left edge. */
    display: flex;
    justify-content: center;
    --rdp-accent-color: #b28a35;
    --rdp-background-color: #f8f5ee;
    /* Must match .navButton below: navLayout="around" reserves exactly this
       much inline margin on the caption for the two absolute chevrons. */
    --rdp-nav_button-width: 36px;
    /* One knob for the day cell, so the mobile clamp below only has to set
       this rather than restate every width/height. */
    --cell: 46px;
  }

  /* navLayout="around" positions the chevrons at the caption's inline edges
     itself (see .rdp-root[data-nav-layout="around"] in the library stylesheet),
     so all that's left here is the gap under the header. */
  .rdp-month_caption {
    margin-bottom: 20px;
  }

  .rdp-caption_label {
    font-size: 28px;
    font-family: "Playfair Display", serif;
    font-weight: 500;
    color: #2c2c2c;
    letter-spacing: 1px;
  }

  .navButton {
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
    width: var(--cell);
    height: var(--cell);
    font-size: 15px;
    border-radius: 10px;
    transition: .25s;
  }

  .rdp-day_button {
    width: calc(var(--cell) - 4px);
    height: calc(var(--cell) - 4px);
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

  /* Sold out: every room type is fully booked/blocked this day for the
     requested room count. Struck through and muted rather than merely
     disabled-looking, so it reads as "unavailable" rather than "outside
     the bookable range" the way a past date does. */
  .rdp-day_sold_out .rdp-day_button {
    color: #c7bda7;
    text-decoration: line-through;
    text-decoration-color: #c7bda7;
  }

  .rdp-day_sold_out:hover .rdp-day_button {
    background: transparent;
    color: #c7bda7;
    cursor: not-allowed;
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
      max-width:none;
    }

    .calendarPopup{
      width:100%;
      /* A fixed bottom sheet sits outside page scroll, so a calendar taller
         than the viewport had its top pushed out of reach. Cap it to the
         space inside the backdrop padding and scroll internally. */
      max-height:calc(100dvh - 40px);
      overflow-y:auto;
      overscroll-behavior:contain;
      border-radius:22px 22px 0 0;
    }

    /* 28px is wider than the sheet once both 36px chevrons are beside it:
       "September 2026" alone is ~218px, and at 320px there are only ~222px to
       share between all three. */
    .rdp-caption_label{
      font-size: clamp(18px, 5.5vw, 28px);
    }

    .rdp-root{
      padding:20px;
      /* The sheet is (100dvw - 40px) wide and this adds 20px of padding each
         side, so seven cells have to fit in 100dvw - 80px. Below ~360px that
         is narrower than 46px a cell, and the last column used to be clipped. */
      --cell: min(46px, calc((100dvw - 80px) / 7));
    }

  }
`}</style>
    </>
  );
}