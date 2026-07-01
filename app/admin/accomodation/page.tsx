"use client";

import { useState } from "react";

import {
  Building2,
  BedDouble,
  CheckCircle2,
  Wrench,
  Plus,
} from "lucide-react";

import AccommodationTabs from "../components/AccommodationTabs";
import RoomTypes from "../components/RoomTypes";
import PhysicalRooms from "../components/PhysicalRooms";
import Pricing from "../components/Pricing";
import Amenities from "../components/Amenities";
import Gallery from "../components/Gallery";
import Availability from "../components/Availability";
import Policies from "../components/Policies";

export default function AccommodationPage() {

  const [tab, setTab] = useState("roomTypes");

  return (
    <>
      <div className="page">

        {/* Header */}

        <div className="header">

          <div>

            <h1>
              Accommodation Management
            </h1>

            <p>
              Manage room types, inventory, pricing, amenities,
              gallery, availability and hotel policies.
            </p>

          </div>

          <div className="headerButtons">

            <button className="secondaryBtn">

              <Plus size={18} />

              Add Room

            </button>

            <button className="primaryBtn">

              <Plus size={18} />

              Add Room Type

            </button>

          </div>

        </div>

        {/* Dashboard Cards */}

        <section className="statsGrid">

          <StatCard
            icon={<Building2 size={24} />}
            title="Total Rooms"
            value="42"
            color="#B68D40"
          />

          <StatCard
            icon={<CheckCircle2 size={24} />}
            title="Available"
            value="18"
            color="#22C55E"
          />

          <StatCard
            icon={<BedDouble size={24} />}
            title="Occupied"
            value="21"
            color="#3B82F6"
          />

          <StatCard
            icon={<Wrench size={24} />}
            title="Maintenance"
            value="3"
            color="#EF4444"
          />

        </section>

        {/* Tabs */}

        <AccommodationTabs
          activeTab={tab}
          onChange={setTab}
        />

        {/* Content */}

        <div className="contentCard">

          {tab === "roomTypes" && (
            <RoomTypes />
          )}

          {tab === "physicalRooms" && (
            <PhysicalRooms />
          )}

          {tab === "pricing" && (
            <Pricing />
          )}

          {tab === "amenities" && (
            <Amenities />
          )}

          {tab === "gallery" && (
            <Gallery />
          )}

          {tab === "availability" && (
            <Availability />
          )}

          {tab === "policies" && (
            <Policies />
          )}

        </div>

      </div>

      <style jsx>{`
        .page{
          padding:34px;
          background:#F8F5EF;
          min-height:100vh;
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
          color:#222;
          font-family:var(--font-cormorant);
        }

        .header p{
          margin-top:8px;
          color:#777;
          max-width:700px;
        }

        .headerButtons{
          display:flex;
          gap:14px;
        }

        .primaryBtn,
        .secondaryBtn{

          height:52px;

          border:none;

          border-radius:14px;

          padding:0 24px;

          display:flex;

          align-items:center;

          gap:10px;

          cursor:pointer;

          font-weight:600;

          transition:.3s;

        }

        .primaryBtn{

          background:#B68D40;
          color:#fff;

        }

        .primaryBtn:hover{

          background:#A87D30;

        }

        .secondaryBtn{

          background:#fff;

          border:1px solid #E7DDCC;

        }

        .secondaryBtn:hover{

          background:#F6F3EC;

        }

        .statsGrid{

          display:grid;

          grid-template-columns:repeat(4,1fr);

          gap:22px;

          margin-bottom:30px;

        }

        .contentCard{

          background:#fff;

          border-radius:22px;

          padding:28px;

          margin-top:24px;

          box-shadow:
          0 15px 35px rgba(0,0,0,.05);

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

          .headerButtons{
            width:100%;
            flex-direction:column;
          }

          .primaryBtn,
          .secondaryBtn{
            width:100%;
            justify-content:center;
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
        borderRadius:20,
        padding:24,
        display:"flex",
        alignItems:"center",
        gap:18,
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
            margin:"6px 0 0",
            fontSize:34,
            color:"#222",
          }}
        >
          {value}
        </h2>

      </div>

    </div>

  );

}