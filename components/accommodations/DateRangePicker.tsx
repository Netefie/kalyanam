"use client";

import { CalendarDays } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import LuxuryCalendar from "./LuxuryCalendar";

interface DateRangePickerProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (
    checkIn: Date | null,
    checkOut: Date | null
  ) => void;
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>({
    from: checkIn ?? undefined,
    to: checkOut ?? undefined,
  });

  useEffect(() => {
    setRange({
      from: checkIn ?? undefined,
      to: checkOut ?? undefined,
    });
  }, [checkIn, checkOut]);

  

  const formattedCheckIn = checkIn
    ? format(checkIn, "dd MMM yyyy")
    : "Select Date";

  const formattedCheckOut = checkOut
    ? format(checkOut, "dd MMM yyyy")
    : "Select Date";

  return (
    <>
      <div className="dateGrid">

        {/* CHECK IN */}

        <div
          className="dateItem borderRight"
          onClick={() => setOpen(true)}
        >
          <div className="dateField">

            <CalendarDays
              size={18}
              className="icon"
            />

            <div>

              <p className="label">
                Check In
              </p>

              <p className="dateValue">
                {formattedCheckIn}
              </p>

            </div>

          </div>
        </div>

        {/* CHECK OUT */}

        <div
          className="dateItem"
          onClick={() => setOpen(true)}
        >
          <div className="dateField">

            <CalendarDays
              size={18}
              className="icon"
            />

            <div>

              <p className="label">
                Check Out
              </p>

              <p className="dateValue">
                {formattedCheckOut}
              </p>

            </div>

           

          </div>
        </div>
      </div>

      <LuxuryCalendar
        open={open}
        selected={range}
        onClose={() => setOpen(false)}
        onSelect={(value) =>
          setRange(value)
        }
        onApply={() => {
          onChange(
            range?.from ?? null,
            range?.to ?? null
          );
        }}
      />

      <style jsx>{`
  .dateGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
    position: relative;
  }

  .dateItem {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 38px;
    cursor: pointer;
    transition: background .3s ease;
    min-height: 72px;
  }

  .dateItem:hover {
    background: #fcfaf6;
  }

  .borderRight {
    border-right: 1px solid #d7c8aa;
  }

  .dateField {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .icon {
    color: #b28a35;
    flex-shrink: 0;
  }

  .label {
    margin: 0;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8a8a8a;
    font-weight: 500;
  }

  .dateValue {
    margin: 4px 0 0;
    font-size: 15px;
    font-weight: 500;
    color: #2c2c2c;
    transition: color .25s;
  }

  .dateItem:hover .dateValue {
    color: #b28a35;
  }

  .nightCount {
    margin-left: auto;
    background: rgba(178,138,53,.08);
    color: #b28a35;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* Popup Position */

  :global(.calendarOverlay) {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    z-index: 9999;
  }

  @media (max-width:1024px){

    .dateItem{
      padding:0 18px;
    }

    .nightCount{
      display:none;
    }

  }

  @media (max-width:768px){

    .dateGrid{
      grid-template-columns:1fr;
    }

    .borderRight{
      border-right:none;
      border-bottom:1px solid #d7c8aa;
    }

    .dateItem{
      min-height:68px;
      padding:14px 18px;
    }

    .dateValue{
      font-size:14px;
    }

    .label{
      font-size:10px;
    }

    :global(.calendarOverlay){
      position:fixed;
      inset:0;
      display:flex;
      justify-content:center;
      align-items:flex-end;
      background:rgba(0,0,0,.45);
      padding:16px;
    }
  }

  @media (max-width:480px){

    .dateItem{
      padding:12px 16px;
    }

    .dateValue{
      font-size:13px;
    }

  }
`}</style>
    </>
  );
}