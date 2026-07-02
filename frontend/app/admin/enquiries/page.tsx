"use client";

import { useCallback, useEffect, useState } from "react";
import EnquiryTable from "../components/EnquiryTable";
import Pagination from "../components/Pagination";
import { api, type Enquiry, type Paginated } from "@/lib/api";

const PAGE_SIZE = 20;

const TYPE_TABS = [
  { id: "", label: "All" },
  { id: "contact", label: "Contact Us" },
  { id: "reservation", label: "Reservations" },
];

export default function EnquiriesPage() {
  const [data, setData] = useState<Paginated<Enquiry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [type, setType] = useState("contact");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await api.enquiries.list({ page, limit: PAGE_SIZE, type, status }));
    } catch {
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [page, type, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [type, status]);

  const handleStatusChange = async (id: string, next: Enquiry["status"]) => {
    try {
      await api.enquiries.updateStatus(id, next);
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((e) => (e._id === id ? { ...e, status: next } : e)) }
          : prev
      );
    } catch {
      alert("Could not update the enquiry status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.enquiries.remove(id);
      await load();
    } catch {
      alert("Could not delete the enquiry.");
    }
  };

  return (
    <>
      <div className="enquiriesPage">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span>/</span>
          <strong>Enquiries</strong>
        </div>

        <div className="header">
          <div>
            <h1>Enquiries</h1>
            <p>Contact-us messages and reservation requests from your website.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filterCard">
          <div className="tabs">
            {TYPE_TABS.map((t) => (
              <button
                key={t.id}
                className={`tab ${type === t.id ? "active" : ""}`}
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <select
            className="statusSelect"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {error ? (
          <div className="errorBox">{error}</div>
        ) : (
          <EnquiryTable
            enquiries={data?.items ?? []}
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
            itemLabel="enquiries"
          />
        )}
      </div>

      <style jsx>{`
        .enquiriesPage{ padding:34px; background:#F8F5EF; min-height:100vh; }
        .breadcrumb{
          display:flex; align-items:center; gap:10px;
          font-size:14px; color:#8b8b8b; margin-bottom:24px;
        }
        .breadcrumb strong{ color:#222; }
        .header{ margin-bottom:30px; }
        .header h1{
          margin:0; font-size:42px;
          font-family:var(--font-cormorant); color:#222;
        }
        .header p{ margin-top:8px; color:#777; font-size:15px; }

        .filterCard{
          background:#fff; padding:18px 22px; border-radius:18px;
          box-shadow:0 12px 35px rgba(0,0,0,.05); margin-bottom:24px;
          display:flex; justify-content:space-between; align-items:center;
          gap:16px; flex-wrap:wrap;
        }
        .tabs{ display:flex; gap:10px; flex-wrap:wrap; }
        .tab{
          height:44px; padding:0 20px; border-radius:12px;
          border:1px solid #ECE4D6; background:#fff; color:#666;
          cursor:pointer; font-weight:600; font-size:14px; transition:.3s;
        }
        .tab:hover{ border-color:#B68D40; color:#B68D40; }
        .tab.active{
          background:linear-gradient(90deg,#CDA55A,#B68D40);
          color:#fff; border-color:#B68D40;
        }
        .statusSelect{
          height:44px; border:1px solid #ECE4D6; border-radius:12px;
          padding:0 16px; outline:none; background:#fff; cursor:pointer; font-size:14px;
        }
        .errorBox{
          background:#FDECEC; border:1px solid #F5C6C6; color:#B91C1C;
          padding:20px 24px; border-radius:18px;
        }
        @media(max-width:768px){
          .filterCard{ flex-direction:column; align-items:stretch; }
          .statusSelect{ width:100%; }
        }
      `}</style>
    </>
  );
}
