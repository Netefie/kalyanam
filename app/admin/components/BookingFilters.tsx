"use client";

import {
  Search,
  CalendarDays,
  Filter,
  RotateCcw,
} from "lucide-react";

export default function BookingFilters() {
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
                placeholder="Guest name, phone or email"
              />

            </div>

          </div>

          {/* Check In */}

          <div className="field">

            <label>
              Check In
            </label>

            <div className="input">

              <CalendarDays size={18} />

              <input type="date" />

            </div>

          </div>

          {/* Check Out */}

          <div className="field">

            <label>
              Check Out
            </label>

            <div className="input">

              <CalendarDays size={18} />

              <input type="date" />

            </div>

          </div>

          {/* Room */}

          <div className="field">

            <label>
              Room Type
            </label>

            <select>

              <option>
                All Rooms
              </option>

              <option>
                Deluxe Room
              </option>

              <option>
                Super Deluxe
              </option>

              <option>
                Suite
              </option>

            </select>

          </div>

          {/* Status */}

          <div className="field">

            <label>
              Booking Status
            </label>

            <select>

              <option>
                All
              </option>

              <option>
                Confirmed
              </option>

              <option>
                Pending
              </option>

              <option>
                Cancelled
              </option>

              <option>
                Checked In
              </option>

            </select>

          </div>

        </div>

        <div className="actions">

          <button className="reset">

            <RotateCcw size={16} />

            Reset

          </button>

          <button className="filter">

            <Filter size={16} />

            Filter

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
          grid-template-columns:
          2fr
          1fr
          1fr
          1fr
          1fr;
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

        @media(max-width:1200px){

          .grid{
            grid-template-columns:
            repeat(2,1fr);
          }

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