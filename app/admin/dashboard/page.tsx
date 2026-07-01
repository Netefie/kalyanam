"use client";

import {
  CalendarCheck,
  BedDouble,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard">

        {/* Stats */}

        <div className="statsGrid">

          <StatCard
            icon={<CalendarCheck size={24} />}
            title="Total Bookings"
            value="148"
            color="#B68D40"
          />

          <StatCard
            icon={<BedDouble size={24} />}
            title="Rooms"
            value="18"
            color="#3B82F6"
          />

          <StatCard
            icon={<FileText size={24} />}
            title="Blogs"
            value="24"
            color="#10B981"
          />

          <StatCard
            icon={<MessageSquare size={24} />}
            title="Enquiries"
            value="12"
            color="#F97316"
          />

        </div>

        {/* Grid */}

        <div className="contentGrid">

          {/* Recent Bookings */}

          <div className="card">

            <div className="cardHeader">

              <h3>Recent Bookings</h3>

              <button>View All</button>

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

                <tr>

                  <td>Rahul Sharma</td>

                  <td>Deluxe Room</td>

                  <td>
                    <span className="status confirmed">
                      Confirmed
                    </span>
                  </td>

                </tr>

                <tr>

                  <td>Priya Singh</td>

                  <td>Super Deluxe</td>

                  <td>
                    <span className="status pending">
                      Pending
                    </span>
                  </td>

                </tr>

                <tr>

                  <td>Amit Verma</td>

                  <td>Deluxe Room</td>

                  <td>
                    <span className="status cancelled">
                      Cancelled
                    </span>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          {/* Quick Overview */}

          <div className="card">

            <h3>Quick Overview</h3>

            <div className="overview">

              <OverviewItem
                icon={<TrendingUp size={20} />}
                title="Revenue"
                value="₹2,48,000"
              />

              <OverviewItem
                icon={<Clock size={20} />}
                title="Today's Check-ins"
                value="18"
              />

              <OverviewItem
                icon={<CalendarCheck size={20} />}
                title="Today's Check-outs"
                value="11"
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

        .cardHeader button{
          background:#B68D40;
          color:#fff;
          border:none;
          padding:8px 16px;
          border-radius:8px;
          cursor:pointer;
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