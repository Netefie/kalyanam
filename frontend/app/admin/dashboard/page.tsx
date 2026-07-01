"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  BedDouble,
  DoorOpen,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { api, type Booking, type DashboardStats } from "@/lib/api";

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/[^a-z]/g, "");
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Booking[]>([]);
  const [enquiryCount, setEnquiryCount] = useState<number | null>(null);

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(() => setStats(null));
    api.bookings
      .list({ limit: 5 })
      .then((res) => setRecent(res.items))
      .catch(() => setRecent([]));
    api.enquiries
      .list({ limit: 1 })
      .then((res) => setEnquiryCount(res.total))
      .catch(() => setEnquiryCount(null));
  }, []);

  const show = (v: number | null | undefined) =>
    v === null || v === undefined ? "—" : String(v);

  return (
    <>
      <div className="dashboard">

        {/* Stats */}

        <div className="statsGrid">

          <StatCard
            icon={<CalendarCheck size={24} />}
            title="Today's Bookings"
            value={show(stats?.todaysBookings)}
            color="#B68D40"
          />

          <StatCard
            icon={<BedDouble size={24} />}
            title="Total Rooms"
            value={show(stats?.totalRooms)}
            color="#3B82F6"
          />

          <StatCard
            icon={<DoorOpen size={24} />}
            title="Occupied Rooms"
            value={show(stats?.occupiedRooms)}
            color="#10B981"
          />

          <StatCard
            icon={<MessageSquare size={24} />}
            title="Enquiries"
            value={show(enquiryCount)}
            color="#F97316"
          />

        </div>

        {/* Grid */}

        <div className="contentGrid">

          {/* Recent Bookings */}

          <div className="card">

            <div className="cardHeader">
              <h3>Recent Bookings</h3>
            </div>

            <table>

              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: "#999" }}>
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  recent.map((b) => (
                    <tr key={b._id}>
                      <td>
                        {`${b.guest.firstName} ${b.guest.lastName || ""}`.trim()}
                      </td>
                      <td>{b.roomName}</td>
                      <td>
                        <span className={`status ${statusClass(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* Quick Overview */}

          <div className="card">

            <h3>Quick Overview</h3>

            <div className="overview">

              <OverviewItem
                icon={<TrendingUp size={20} />}
                title="Today's Revenue"
                value={stats ? money(stats.todaysRevenue) : "—"}
              />

              <OverviewItem
                icon={<Users size={20} />}
                title="Guests Staying"
                value={show(stats?.guestsStaying)}
              />

              <OverviewItem
                icon={<DoorOpen size={20} />}
                title="Occupied Rooms"
                value={show(stats?.occupiedRooms)}
              />

            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        .dashboard{
          display:flex;
          flex-direction:column;
          gap:28px;
        }

        .statsGrid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:20px;
        }

        .contentGrid{
          display:grid;
          grid-template-columns:2fr 1fr;
          gap:20px;
        }

        .card{
          background:#fff;
          border-radius:18px;
          padding:25px;
          box-shadow:0 10px 30px rgba(0,0,0,.05);
        }

        .cardHeader{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
        }

        .cardHeader h3{
          margin:0;
          font-size:22px;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          text-align:left;
          padding:14px 0;
          border-bottom:1px solid #eee;
          color:#777;
          font-size:14px;
        }

        td{
          padding:18px 0;
          border-bottom:1px solid #f3f3f3;
        }

        .status{
          padding:6px 12px;
          border-radius:50px;
          font-size:12px;
          font-weight:600;
        }

        .confirmed{
          background:#dcfce7;
          color:#15803d;
        }

        .pending{
          background:#fef3c7;
          color:#b45309;
        }

        .cancelled{
          background:#fee2e2;
          color:#b91c1c;
        }

        .checkedin{
          background:#dbeafe;
          color:#1d4ed8;
        }

        .checkedout{
          background:#ede9fe;
          color:#6d28d9;
        }

        .overview{
          display:flex;
          flex-direction:column;
          gap:18px;
          margin-top:20px;
        }

        @media(max-width:1100px){
          .statsGrid{
            grid-template-columns:repeat(2,1fr);
          }

          .contentGrid{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:768px){
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
  color,
}:{
  icon:React.ReactNode;
  title:string;
  value:string;
  color:string;
}){

  return(
    <div
      style={{
        background:"#fff",
        borderRadius:18,
        padding:24,
        boxShadow:"0 10px 30px rgba(0,0,0,.05)",
      }}
    >

      <div
        style={{
          width:55,
          height:55,
          borderRadius:14,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          background:color,
          color:"#fff",
          marginBottom:18,
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color:"#888",
          marginBottom:8,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin:0,
          fontSize:34,
          color:"#222",
        }}
      >
        {value}
      </h2>

    </div>
  );
}

function OverviewItem({
  icon,
  title,
  value,
}:{
  icon:React.ReactNode;
  title:string;
  value:string;
}){

  return(

    <div
      style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"15px 18px",
        borderRadius:14,
        background:"#faf8f3",
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          gap:12,
        }}
      >
        {icon}

        <span>{title}</span>

      </div>

      <strong>{value}</strong>

    </div>

  );

}
