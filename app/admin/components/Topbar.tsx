"use client";

import Image from "next/image";
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  return (
    <>
      <header className="topbar">

        {/* Left */}

        <div>


        </div>

        {/* Right */}

        <div className="rightSection">

          {/* Search */}

          <div className="searchBox">

            <Search
              size={18}
              className="searchIcon"
            />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>

          {/* Notification */}

          <button className="iconButton">

            <Bell size={20} />

            <span className="badge">
              3
            </span>

          </button>

          {/* Settings */}

          <button className="iconButton">

            <Settings size={20} />

          </button>

          {/* Profile */}

          <div className="profile">

            <div className="avatar">

              <Image
                src="/admin-avatar.jpg"
                alt="Admin"
                width={44}
                height={44}
              />

            </div>

            <div className="profileInfo">

              <h4>
                Admin
              </h4>

              <span>
                Hotel Manager
              </span>

            </div>

            <ChevronDown size={18} />

          </div>

        </div>

      </header>

      <style jsx>{`
        .topbar{
          height:88px;
          background:#fff;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 35px;
          border-bottom:1px solid #ece7dc;
          position:sticky;
          top:0;
          z-index:100;
        }

        .pageTitle{
          margin:0;
          font-family:var(--font-cormorant);
          font-size:34px;
          color:#222;
        }

        .subtitle{
          margin-top:6px;
          color:#8d8d8d;
          font-size:14px;
        }

        .rightSection{
          display:flex;
          align-items:center;
          gap:18px;
        }

        .searchBox{
          width:320px;
          height:48px;
          border:1px solid #e8dfcf;
          border-radius:14px;
          display:flex;
          align-items:center;
          padding:0 18px;
          background:#faf8f3;
        }

        .searchIcon{
          color:#b68d40;
          margin-right:10px;
        }

        .searchBox input{
          flex:1;
          border:none;
          outline:none;
          background:none;
          font-size:15px;
        }

        .iconButton{
          width:48px;
          height:48px;
          border:none;
          border-radius:14px;
          background:#faf8f3;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          transition:.3s;
        }

        .iconButton:hover{
          background:#b68d40;
          color:#fff;
        }

        .badge{
          position:absolute;
          top:8px;
          right:8px;
          width:18px;
          height:18px;
          border-radius:50%;
          background:#e53935;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:10px;
          font-weight:700;
        }

        .profile{
          display:flex;
          align-items:center;
          gap:12px;
          cursor:pointer;
          padding:6px 10px;
          border-radius:14px;
          transition:.3s;
        }

        .profile:hover{
          background:#faf8f3;
        }

        .avatar{
          width:44px;
          height:44px;
          border-radius:50%;
          overflow:hidden;
          border:2px solid #b68d40;
        }

        .avatar :global(img){
          object-fit:cover;
          width:100%;
          height:100%;
        }

        .profileInfo h4{
          margin:0;
          font-size:15px;
          color:#222;
        }

        .profileInfo span{
          font-size:12px;
          color:#999;
        }

        @media(max-width:992px){

          .topbar{
            padding:0 20px;
          }

          .searchBox{
            display:none;
          }

          .profileInfo{
            display:none;
          }

        }

        @media(max-width:768px){

          .pageTitle{
            font-size:26px;
          }

          .subtitle{
            display:none;
          }

          .topbar{
            height:72px;
          }

        }
      `}</style>

    </>
  );
}