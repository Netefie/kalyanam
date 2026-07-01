"use client";

import {
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

interface BookingFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export default function BookingFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
  onApply,
}: BookingFiltersProps) {
  return (
    <>
      <div className="filterCard">

        <div className="grid">

          {/* Search */}

          <div className="field">

            <label>
              Search Guest
            </label>

            <div className="input">

              <Search size={18} />

              <input
                placeholder="Guest name, phone, email, room or booking ID"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />

            </div>

          </div>

          {/* Status */}

          <div className="field">

            <label>
              Booking Status
            </label>

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="CheckedIn">Checked In</option>
              <option value="CheckedOut">Checked Out</option>
            </select>

          </div>

        </div>

        <div className="actions">

          <button className="reset" onClick={onReset}>

            <RotateCcw size={16} />

            Reset

          </button>

          <button className="filter" onClick={onApply}>

            <Filter size={16} />

            Refresh

          </button>

        </div>

      </div>

      <style jsx>{`
        .filterCard{
          background:#fff;
          padding:26px;
          border-radius:22px;
          box-shadow:0 12px 35px rgba(0,0,0,.05);
          margin-bottom:28px;
        }

        .grid{
          display:grid;
          grid-template-columns:2fr 1fr;
          gap:18px;
        }

        .field{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        label{
          font-size:13px;
          color:#777;
          font-weight:600;
        }

        .input{
          height:52px;
          display:flex;
          align-items:center;
          gap:12px;
          border:1px solid #ECE4D6;
          border-radius:14px;
          padding:0 16px;
          background:#fff;
        }

        .input svg{
          color:#B68D40;
        }

        .input input{
          flex:1;
          border:none;
          outline:none;
          background:none;
          font-size:14px;
        }

        select{
          height:52px;
          border:1px solid #ECE4D6;
          border-radius:14px;
          padding:0 16px;
          outline:none;
          background:#fff;
          font-size:14px;
          cursor:pointer;
        }

        .actions{
          display:flex;
          justify-content:flex-end;
          gap:14px;
          margin-top:24px;
        }

        .reset{
          height:48px;
          padding:0 22px;
          border-radius:12px;
          border:1px solid #DDD;
          background:#fff;
          display:flex;
          align-items:center;
          gap:10px;
          cursor:pointer;
          transition:.3s;
        }

        .reset:hover{
          background:#F6F6F6;
        }

        .filter{
          height:48px;
          padding:0 28px;
          border:none;
          border-radius:12px;
          background:#B68D40;
          color:#fff;
          display:flex;
          align-items:center;
          gap:10px;
          cursor:pointer;
          transition:.3s;
        }

        .filter:hover{
          background:#A77C31;
        }

        @media(max-width:768px){

          .grid{
            grid-template-columns:1fr;
          }

          .actions{
            flex-direction:column;
          }

          .reset,
          .filter{
            width:100%;
            justify-content:center;
          }

        }
      `}</style>
    </>
  );
}
