"use client";

import { Trash2 } from "lucide-react";
import type { Booking } from "@/lib/api";

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: Booking["status"]) => void;
  onDelete: (id: string) => void;
}

const STATUSES: Booking["status"][] = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "CheckedIn",
  "CheckedOut",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Maps a status to the pill colour class (lowercased, non-alpha stripped).
function statusClass(status: string) {
  return status.toLowerCase().replace(/[^a-z]/g, "");
}

export default function BookingTable({
  bookings,
  loading,
  onStatusChange,
  onDelete,
}: BookingTableProps) {
  return (
    <>
      <div className="tableCard">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Stay</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={8} className="empty">
                  Loading bookings…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const fullName = `${booking.guest.firstName} ${
                  booking.guest.lastName || ""
                }`.trim();

                return (
                  <tr key={booking._id}>

                    <td>{booking.bookingCode}</td>

                    <td>

                      <div className="guest">

                        <div className="avatar">
                          {fullName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4>{fullName}</h4>
                          <p>{booking.guest.phone}</p>
                        </div>

                      </div>

                    </td>

                    <td>{booking.roomName}</td>

                    <td>
                      {formatDate(booking.checkIn)}
                      <br />
                      <span>{formatDate(booking.checkOut)}</span>
                    </td>

                    <td>{booking.adults + booking.children}</td>

                    <td>{formatAmount(booking.amount)}</td>

                    <td>
                      <select
                        className={`status ${statusClass(booking.status)}`}
                        value={booking.status}
                        onChange={(e) =>
                          onStatusChange(
                            booking._id,
                            e.target.value as Booking["status"]
                          )
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s === "CheckedIn"
                              ? "Checked In"
                              : s === "CheckedOut"
                              ? "Checked Out"
                              : s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>

                      <div className="actions">

                        <button
                          title="Delete booking"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete booking ${booking.bookingCode}?`
                              )
                            ) {
                              onDelete(booking._id);
                            }
                          }}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

      <style jsx>{`
        .tableCard{
          background:#fff;
          border-radius:22px;
          overflow:hidden;
          box-shadow:0 12px 35px rgba(0,0,0,.05);
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        thead{
          background:#faf7f2;
        }

        th{
          padding:20px;
          text-align:left;
          color:#666;
          font-size:14px;
          font-weight:600;
          border-bottom:1px solid #ECE4D6;
        }

        td{
          padding:22px 20px;
          border-bottom:1px solid #F2ECE1;
          font-size:15px;
        }

        .empty{
          text-align:center;
          color:#999;
          padding:48px 20px;
        }

        tbody tr{
          transition:.3s;
        }

        tbody tr:hover{
          background:#FCFAF6;
        }

        .guest{
          display:flex;
          align-items:center;
          gap:14px;
        }

        .avatar{
          width:46px;
          height:46px;
          border-radius:50%;
          background:#B68D40;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:700;
        }

        .guest h4{
          margin:0;
          font-size:15px;
        }

        .guest p{
          margin-top:4px;
          color:#888;
          font-size:13px;
        }

        td span{
          color:#999;
          font-size:13px;
        }

        .status{
          padding:8px 14px;
          border-radius:999px;
          font-size:13px;
          font-weight:600;
          border:none;
          cursor:pointer;
          outline:none;
          appearance:none;
        }

        .confirmed{
          background:#DCFCE7;
          color:#15803D;
        }

        .pending{
          background:#FEF3C7;
          color:#B45309;
        }

        .cancelled{
          background:#FEE2E2;
          color:#B91C1C;
        }

        .checkedin{
          background:#DBEAFE;
          color:#1D4ED8;
        }

        .checkedout{
          background:#EDE9FE;
          color:#6D28D9;
        }

        .actions{
          display:flex;
          gap:10px;
        }

        .actions button{
          width:38px;
          height:38px;
          border:none;
          border-radius:10px;
          background:#F8F5EF;
          cursor:pointer;
          transition:.3s;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#555;
        }

        .actions button:hover{
          background:#B91C1C;
          color:#fff;
        }

        @media(max-width:1200px){

          .tableCard{
            overflow:auto;
          }

          table{
            min-width:1100px;
          }

        }
      `}</style>

    </>
  );
}
