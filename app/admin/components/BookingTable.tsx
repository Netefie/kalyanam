"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const bookings = [
  {
    id: "BK-1001",
    guest: "Rahul Sharma",
    phone: "+91 9876543210",
    room: "Deluxe Room",
    checkIn: "12 Jul 2026",
    checkOut: "15 Jul 2026",
    guests: 2,
    amount: "₹12,500",
    status: "Confirmed",
  },
  {
    id: "BK-1002",
    guest: "Amit Verma",
    phone: "+91 9988776655",
    room: "Suite",
    checkIn: "14 Jul 2026",
    checkOut: "16 Jul 2026",
    guests: 3,
    amount: "₹18,000",
    status: "Pending",
  },
  {
    id: "BK-1003",
    guest: "Priya Singh",
    phone: "+91 9000011111",
    room: "Super Deluxe",
    checkIn: "16 Jul 2026",
    checkOut: "18 Jul 2026",
    guests: 2,
    amount: "₹14,800",
    status: "Cancelled",
  },
];

export default function BookingTable() {
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

            {bookings.map((booking) => (

              <tr key={booking.id}>

                <td>{booking.id}</td>

                <td>

                  <div className="guest">

                    <div className="avatar">

                      {booking.guest.charAt(0)}

                    </div>

                    <div>

                      <h4>{booking.guest}</h4>

                      <p>{booking.phone}</p>

                    </div>

                  </div>

                </td>

                <td>{booking.room}</td>

                <td>

                  {booking.checkIn}

                  <br />

                  <span>
                    {booking.checkOut}
                  </span>

                </td>

                <td>{booking.guests}</td>

                <td>{booking.amount}</td>

                <td>

                  <span
                    className={`status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                </td>

                <td>

                  <div className="actions">

                    <button>

                      <Eye size={17} />

                    </button>

                    <button>

                      <Pencil size={17} />

                    </button>

                    <button>

                      <Trash2 size={17} />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

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
          padding:8px 16px;
          border-radius:999px;
          font-size:13px;
          font-weight:600;
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
        }

        .actions button:hover{
          background:#B68D40;
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