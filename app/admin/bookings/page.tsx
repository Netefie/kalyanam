"use client";

import {
  CalendarDays,
  Users,
  BedDouble,
  IndianRupee,
  Plus,
} from "lucide-react";

import BookingFilters from "../components/BookingFilters";
import BookingTable from "../components/BookingTable";
import Pagination from "../components/Pagination";

export default function BookingsPage() {
  return (
    <>
      <div className="bookingsPage">

        {/* Breadcrumb */}

        <div className="breadcrumb">

          <span>Dashboard</span>

          <span>/</span>

          <strong>Bookings</strong>

        </div>

        {/* Header */}

        <div className="header">

          <div>

            <h1>
              Bookings
            </h1>

            <p>
              Manage reservations, check-ins, cancellations and guest bookings.
            </p>

          </div>

          <button className="newBooking">

            <Plus size={18} />

            New Booking

          </button>

        </div>

        {/* Statistics */}

        <section className="statsGrid">

          <StatCard
            icon={<CalendarDays size={24} />}
            title="Today's Bookings"
            value="24"
            subtitle="4 new bookings"
            color="#B68D40"
          />

          <StatCard
            icon={<Users size={24} />}
            title="Guests"
            value="58"
            subtitle="Currently staying"
            color="#6C63FF"
          />

          <StatCard
            icon={<BedDouble size={24} />}
            title="Occupied Rooms"
            value="19"
            subtitle="Out of 24 rooms"
            color="#10B981"
          />

          <StatCard
            icon={<IndianRupee size={24} />}
            title="Today's Revenue"
            value="₹84K"
            subtitle="Estimated revenue"
            color="#F97316"
          />

        </section>

        {/* Filters */}

        <BookingFilters />

        {/* Table */}

        <BookingTable />

<Pagination
  currentPage={1}
  totalPages={12}
  totalItems={128}
  pageSize={10}
/>

      </div>

      <style jsx>{`
        .bookingsPage{
          padding:34px;
          background:#F8F5EF;
          min-height:100vh;
        }

        .breadcrumb{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:14px;
          color:#8b8b8b;
          margin-bottom:24px;
        }

        .breadcrumb strong{
          color:#222;
        }

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:34px;
        }

        .header h1{
          margin:0;
          font-size:42px;
          font-family:var(--font-cormorant);
          color:#222;
        }

        .header p{
          margin-top:8px;
          color:#777;
          font-size:15px;
        }

        .newBooking{
          display:flex;
          align-items:center;
          gap:10px;
          border:none;
          border-radius:14px;
          padding:15px 26px;
          background:#B68D40;
          color:#fff;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:.3s;
          box-shadow:0 15px 35px rgba(182,141,64,.25);
        }

        .newBooking:hover{
          transform:translateY(-2px);
          background:#a57d35;
        }

        .statsGrid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:22px;
          margin-bottom:30px;
        }

        @media(max-width:1100px){

          .statsGrid{
            grid-template-columns:repeat(2,1fr);
          }

        }

        @media(max-width:768px){

          .header{
            flex-direction:column;
            align-items:flex-start;
            gap:20px;
          }

          .statsGrid{
            grid-template-columns:1fr;
          }

        }
      `}</style>

    </>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
}:{
  icon:React.ReactNode;
  title:string;
  value:string;
  subtitle:string;
  color:string;
}){

  return(

    <div
      style={{
        background:"#fff",
        borderRadius:22,
        padding:26,
        display:"flex",
        gap:18,
        alignItems:"center",
        boxShadow:"0 12px 35px rgba(0,0,0,.05)",
      }}
    >

      <div
        style={{
          width:60,
          height:60,
          borderRadius:18,
          background:color,
          color:"#fff",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          flexShrink:0,
        }}
      >
        {icon}
      </div>

      <div>

        <p
          style={{
            margin:0,
            color:"#888",
            fontSize:14,
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin:"8px 0 4px",
            fontSize:32,
            color:"#222",
          }}
        >
          {value}
        </h2>

        <span
          style={{
            color:"#999",
            fontSize:13,
          }}
        >
          {subtitle}
        </span>

      </div>

    </div>

  );
}