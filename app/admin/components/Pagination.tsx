"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 12,
  totalItems = 128,
  pageSize = 10,
}: PaginationProps) {
  return (
    <>
      <div className="pagination">

        <div className="left">

          <span>
            Showing{" "}
            <strong>
              {(currentPage - 1) * pageSize + 1}
            </strong>

            {" - "}

            <strong>
              {Math.min(
                currentPage * pageSize,
                totalItems
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {totalItems}
            </strong>

            {" "}bookings

          </span>

        </div>

        <div className="right">

          <button className="navBtn">

            <ChevronLeft size={18} />

          </button>

          <button className="page active">
            1
          </button>

          <button className="page">
            2
          </button>

          <button className="page">
            3
          </button>

          <button className="page">
            4
          </button>

          <span className="dots">
            ...
          </span>

          <button className="page">
            {totalPages}
          </button>

          <button className="navBtn">

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

      <style jsx>{`
        .pagination{
          margin-top:24px;
          background:#fff;
          border-radius:18px;
          padding:18px 24px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          box-shadow:0 10px 30px rgba(0,0,0,.05);
        }

        .left span{
          color:#666;
          font-size:14px;
        }

        .left strong{
          color:#222;
        }

        .right{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .page,
        .navBtn{

          width:42px;
          height:42px;

          border:none;

          border-radius:12px;

          background:#F7F4EE;

          cursor:pointer;

          transition:.3s;

          display:flex;

          align-items:center;

          justify-content:center;

          font-weight:600;

          color:#555;

        }

        .page:hover,
        .navBtn:hover{

          background:#B68D40;
          color:#fff;

        }

        .active{

          background:#B68D40;
          color:#fff;

          box-shadow:
          0 10px 25px
          rgba(182,141,64,.30);

        }

        .dots{
          color:#999;
          padding:0 6px;
        }

        @media(max-width:768px){

          .pagination{

            flex-direction:column;
            gap:18px;

          }

          .right{

            flex-wrap:wrap;
            justify-content:center;

          }

        }
      `}</style>

    </>
  );
}