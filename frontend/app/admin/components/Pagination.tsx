"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

// Build a compact page list with ellipses, e.g. [1, "...", 4, 5, 6, "...", 12].
function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "bookings",
}: PaginationProps) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPages(currentPage, totalPages);

  return (
    <>
      <div className="pagination">

        <div className="left">

          <span>
            Showing{" "}
            <strong>{from}</strong>
            {" - "}
            <strong>{to}</strong>
            {" "}of{" "}
            <strong>{totalItems}</strong>
            {" "}{itemLabel}
          </span>

        </div>

        <div className="right">

          <button
            className="navBtn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={18} />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="dots">
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`page ${p === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="navBtn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
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

        .navBtn:disabled{
          opacity:.45;
          cursor:not-allowed;
        }

        .navBtn:disabled:hover{
          background:#F7F4EE;
          color:#555;
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
