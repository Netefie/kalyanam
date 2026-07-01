"use client";

import {
  BedDouble,
  Building2,
  IndianRupee,
  Sparkles,
  Images,
  CalendarDays,
  ScrollText,
} from "lucide-react";

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  {
    id: "roomTypes",
    title: "Room Types",
    icon: BedDouble,
  },
  {
    id: "physicalRooms",
    title: "Physical Rooms",
    icon: Building2,
  },
  {
    id: "pricing",
    title: "Pricing",
    icon: IndianRupee,
  },
  {
    id: "amenities",
    title: "Amenities",
    icon: Sparkles,
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: Images,
  },
  {
    id: "availability",
    title: "Availability",
    icon: CalendarDays,
  },
  {
    id: "policies",
    title: "Policies",
    icon: ScrollText,
  },
];

export default function AccommodationTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <>
      <div className="tabs">

        {tabs.map((tab) => {

          const Icon = tab.icon;

          return (

            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`tab ${
                activeTab === tab.id
                  ? "active"
                  : ""
              }`}
            >

              <Icon size={18} />

              <span>
                {tab.title}
              </span>

            </button>

          );

        })}

      </div>

      <style jsx>{`
        .tabs{

          display:flex;
          gap:16px;
          flex-wrap:wrap;

        }

        .tab{

          height:52px;

          border:none;

          border-radius:14px;

          padding:0 24px;

          display:flex;

          align-items:center;

          gap:10px;

          background:#fff;

          color:#666;

          cursor:pointer;

          transition:.3s;

          border:1px solid #ECE4D6;

          font-size:15px;

          font-weight:600;

        }

        .tab:hover{

          background:#FCFAF6;

          border-color:#B68D40;

          color:#B68D40;

        }

        .tab.active{

          background:linear-gradient(
            90deg,
            #CDA55A,
            #B68D40
          );

          color:white;

          border-color:#B68D40;

          box-shadow:
          0 15px 35px rgba(182,141,64,.25);

        }

        @media(max-width:768px){

          .tabs{

            overflow-x:auto;

            flex-wrap:nowrap;

            padding-bottom:8px;

          }

          .tabs::-webkit-scrollbar{
            display:none;
          }

          .tab{

            flex-shrink:0;

          }

        }
      `}</style>

    </>
  );
}