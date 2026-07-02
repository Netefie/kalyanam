"use client";

import { Trash2, Mail, Phone } from "lucide-react";
import type { Enquiry } from "@/lib/api";

interface EnquiryTableProps {
  enquiries: Enquiry[];
  loading: boolean;
  onStatusChange: (id: string, status: Enquiry["status"]) => void;
  onDelete: (id: string) => void;
}

const STATUSES: Enquiry["status"][] = ["new", "contacted", "closed"];

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EnquiryTable({
  enquiries,
  loading,
  onStatusChange,
  onDelete,
}: EnquiryTableProps) {
  return (
    <>
      <div className="tableCard">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>Contact</th>
              <th>Details</th>
              <th>Status</th>
              <th>Received</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty">Loading enquiries…</td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">No enquiries found.</td>
              </tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e._id}>
                  <td>
                    <span className={`type ${e.type}`}>
                      {e.type === "contact" ? "Contact" : "Reservation"}
                    </span>
                  </td>

                  <td className="name">{e.name || "—"}</td>

                  <td>
                    <div className="contact">
                      {e.email && (
                        <span><Mail size={13} /> {e.email}</span>
                      )}
                      {e.phone && (
                        <span><Phone size={13} /> {e.phone}</span>
                      )}
                      {!e.email && !e.phone && "—"}
                    </div>
                  </td>

                  <td className="details">
                    {e.type === "contact" ? (
                      <>
                        {e.subject && <strong>{e.subject}</strong>}
                        {e.message && <p>{e.message}</p>}
                        {!e.subject && !e.message && "—"}
                      </>
                    ) : (
                      <>
                        <strong>{e.roomType || "Any room"}</strong>
                        <p>
                          {fmtDate(e.checkIn)} → {fmtDate(e.checkOut)}
                          {e.rooms != null && ` · ${e.rooms} room(s)`}
                          {e.adults != null && ` · ${e.adults} adult(s)`}
                        </p>
                      </>
                    )}
                  </td>

                  <td>
                    <select
                      className={`status ${e.status}`}
                      value={e.status}
                      onChange={(ev) =>
                        onStatusChange(e._id, ev.target.value as Enquiry["status"])
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="date">{fmtDate(e.createdAt)}</td>

                  <td>
                    <button
                      title="Delete enquiry"
                      className="deleteBtn"
                      onClick={() => {
                        if (window.confirm("Delete this enquiry?")) onDelete(e._id);
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
        table{ width:100%; border-collapse:collapse; }
        thead{ background:#faf7f2; }
        th{
          padding:18px 20px; text-align:left; color:#666;
          font-size:14px; font-weight:600; border-bottom:1px solid #ECE4D6;
        }
        td{
          padding:20px; border-bottom:1px solid #F2ECE1;
          font-size:14px; vertical-align:top;
        }
        .empty{ text-align:center; color:#999; padding:48px 20px; }
        tbody tr:hover{ background:#FCFAF6; }
        .name{ font-weight:600; color:#222; }

        .type{
          padding:5px 12px; border-radius:999px;
          font-size:12px; font-weight:600;
        }
        .type.contact{ background:#E0E7FF; color:#4338CA; }
        .type.reservation{ background:#FEF3C7; color:#B45309; }

        .contact{ display:flex; flex-direction:column; gap:6px; color:#555; }
        .contact span{ display:flex; align-items:center; gap:6px; }
        .contact :global(svg){ color:#B68D40; flex-shrink:0; }

        .details{ max-width:320px; }
        .details strong{ color:#222; }
        .details p{ margin:4px 0 0; color:#777; font-size:13px; line-height:1.5; }

        .status{
          padding:8px 14px; border-radius:999px;
          font-size:13px; font-weight:600; border:none;
          cursor:pointer; outline:none; appearance:none;
        }
        .status.new{ background:#DBEAFE; color:#1D4ED8; }
        .status.contacted{ background:#FEF3C7; color:#B45309; }
        .status.closed{ background:#DCFCE7; color:#15803D; }

        .date{ color:#888; white-space:nowrap; }

        .deleteBtn{
          width:38px; height:38px; border:none; border-radius:10px;
          background:#F8F5EF; cursor:pointer; transition:.3s;
          display:flex; align-items:center; justify-content:center; color:#555;
        }
        .deleteBtn:hover{ background:#B91C1C; color:#fff; }

        @media(max-width:1200px){
          .tableCard{ overflow:auto; }
          table{ min-width:1000px; }
        }
      `}</style>
    </>
  );
}
