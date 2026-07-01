"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  BedDouble,
  IndianRupee,
} from "lucide-react";

import BookingFilters from "../components/BookingFilters";
import BookingTable from "../components/BookingTable";
import Pagination from "../components/Pagination";
import {
  api,
  type Booking,
  type DashboardStats,
  type Paginated,
} from "@/lib/api";

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const [data, setData] = useState<Paginated<Booking> | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.bookings.list({
        page,
        limit: PAGE_SIZE,
        status,
        search: debouncedSearch,
      });
      setData(res);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Reset to the first page whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(() => setStats(null));
  }, []);

  const handleStatusChange = async (
    id: string,
    next: Booking["status"]
  ) => {
    try {
      await api.bookings.updateStatus(id, next);
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((b) =>
                b._id === id ? { ...b, status: next } : b
              ),
            }
          : prev
      );
      // Stats (occupancy/revenue) may shift with status changes.
      api.dashboard.stats().then(setStats).catch(() => {});
    } catch {
      alert("Could not update the booking status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.bookings.remove(id);
      await loadBookings();
    } catch {
      alert("Could not delete the booking.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
  };

  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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
            <h1>Bookings</h1>
            <p>
              Manage reservations, check-ins, cancellations and guest bookings.
            </p>
          </div>
        </div>

        {/* Statistics */}

        <section className="statsGrid">

          <StatCard
            icon={<CalendarDays size={24} />}
            title="Today's Bookings"
            value={stats ? String(stats.todaysBookings) : "—"}
            subtitle="Created today"
            color="#B68D40"
          />

          <StatCard
            icon={<Users size={24} />}
            title="Guests Staying"
            value={stats ? String(stats.guestsStaying) : "—"}
            subtitle="Currently in-house"
            color="#6C63FF"
          />

          <StatCard
            icon={<BedDouble size={24} />}
            title="Occupied Rooms"
            value={stats ? String(stats.occupiedRooms) : "—"}
            subtitle={stats ? `Out of ${stats.totalRooms} rooms` : ""}
            color="#10B981"
          />

          <StatCard
            icon={<IndianRupee size={24} />}
            title="Today's Revenue"
            value={stats ? money(stats.todaysRevenue) : "—"}
            subtitle="From today's bookings"
            color="#F97316"
          />

        </section>

        {/* Filters */}

        <BookingFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onReset={handleReset}
          onApply={loadBookings}
        />

        {/* Table */}

        {error ? (
          <div className="errorBox">{error}</div>
        ) : (
          <BookingTable
            bookings={data?.items ?? []}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}

        {data && data.total > 0 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalItems={data.total}
            pageSize={data.limit}
            onPageChange={setPage}
          />
        )}

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

        .statsGrid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:22px;
          margin-bottom:30px;
        }

        .errorBox{
          background:#FDECEC;
          border:1px solid #F5C6C6;
          color:#B91C1C;
          padding:20px 24px;
          border-radius:18px;
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
