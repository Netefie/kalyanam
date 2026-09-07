"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import Pagination from "../components/Pagination";
import { api, type Subscriber, type Paginated } from "@/lib/api";

const PAGE_SIZE = 50;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function SubscribersPage() {
  const [data, setData] = useState<Paginated<Subscriber> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await api.subscribers.list({ page, limit: PAGE_SIZE }));
    } catch {
      setError("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="subscribersPage">
      <div className="header">
        <div>
          <h2>Subscribers</h2>
          <p>Newsletter and offer opt-ins from the site popup.</p>
        </div>
      </div>

      {error && <div className="errorBox">{error}</div>}

      {loading ? (
        <p className="muted">Loading subscribers…</p>
      ) : !data || data.items.length === 0 ? (
        <div className="empty">
          <Mail size={30} />
          <p>No subscribers yet.</p>
        </div>
      ) : (
        <>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name || "—"}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || "—"}</td>
                    <td>{s.source}</td>
                    <td>{fmtDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalItems={data.total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="subscribers"
          />
        </>
      )}

      <style jsx>{`
        .subscribersPage {
          padding: 4px;
        }

        .header {
          margin-bottom: 26px;
        }

        .header h2 {
          margin: 0;
          font-size: 34px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .header p {
          margin-top: 6px;
          color: #777;
        }

        .muted {
          color: #999;
          padding: 40px 0;
        }

        .errorBox {
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .empty {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          padding: 60px 20px;
          text-align: center;
          color: #999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .tableWrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          overflow: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th {
          text-align: left;
          padding: 14px 18px;
          color: #888;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
        }

        td {
          padding: 14px 18px;
          border-bottom: 1px solid #f3f0e9;
          color: #333;
          white-space: nowrap;
        }

        tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
