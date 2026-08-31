"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, IndianRupee, TrendingUp, RotateCcw as RefundIcon } from "lucide-react";

import Pagination from "../components/Pagination";
import PaymentStatusPill from "../components/PaymentStatusPill";
import BookingDetailDrawer from "../components/BookingDetailDrawer";
import { api, type Booking, type Paginated } from "@/lib/api";

const PAGE_SIZE = 15;

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Result = Paginated<Booking> & { totals: { collected: number; refunded: number; net: number } };

// Dedicated transaction ledger — everything that went through Razorpay
// (bookings without an orderId, i.e. offline/admin entries, are out of
// scope here; they show up in Bookings instead). BookingTable/Drawer stay
// booking-centric; this page is money-centric: search, date range, running
// totals.
export default function PaymentsPage() {
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.payments.list({
        page,
        limit: PAGE_SIZE,
        status,
        search: debouncedSearch,
        from,
        to,
      });
      setData(res as Result);
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch, from, to]);

  const handleUpdated = (updated: Booking) => {
    setData((prev) =>
      prev ? { ...prev, items: prev.items.map((b) => (b._id === updated._id ? updated : b)) } : prev
    );
    setSelected(updated);
    load();
  };

  return (
    <>
      <div className="paymentsPage">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span>/</span>
          <strong>Payments</strong>
        </div>

        <div className="header">
          <div>
            <h1>Payments</h1>
            <p>Every transaction processed through Razorpay — collected, refunded, and pending.</p>
          </div>
        </div>

        <section className="statsGrid">
          <StatCard
            icon={<IndianRupee size={22} />}
            title="Collected"
            value={data ? money(data.totals.collected) : "—"}
            color="#10B981"
          />
          <StatCard
            icon={<RefundIcon size={22} />}
            title="Refunded"
            value={data ? money(data.totals.refunded) : "—"}
            color="#B91C1C"
          />
          <StatCard
            icon={<TrendingUp size={22} />}
            title="Net"
            value={data ? money(data.totals.net) : "—"}
            color="#B68D40"
          />
        </section>

        <div className="filterCard">
          <div className="grid">
            <div className="field">
              <label>Search</label>
              <div className="input">
                <Search size={18} />
                <input
                  placeholder="Booking ID, guest, payment/order ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="created">Awaiting Payment</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">Partially Refunded</option>
              </select>
            </div>

            <div className="field">
              <label>From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div className="field">
              <label>To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        {error ? (
          <div className="errorBox">{error}</div>
        ) : (
          <div className="tableCard">
            <table>
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Guest</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Refunded</th>
                  <th>Status</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="empty">
                      Loading transactions…
                    </td>
                  </tr>
                ) : (data?.items.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  data!.items.map((b) => (
                    <tr key={b._id} className="clickableRow" onClick={() => setSelected(b)}>
                      <td>{b.bookingCode}</td>
                      <td>
                        {b.guest.firstName} {b.guest.lastName}
                      </td>
                      <td>{formatDate(b.createdAt)}</td>
                      <td>{money(b.pricing?.total ?? b.amount)}</td>
                      <td>{money(b.payment.amountPaid)}</td>
                      <td>{b.payment.refundedAmount > 0 ? money(b.payment.refundedAmount) : "—"}</td>
                      <td>
                        <PaymentStatusPill status={b.payment.status} />
                      </td>
                      <td className="mono">{b.payment.paymentId || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > 0 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalItems={data.total}
            pageSize={data.limit}
            onPageChange={setPage}
          />
        )}
      </div>

      {selected && (
        <BookingDetailDrawer booking={selected} onClose={() => setSelected(null)} onUpdated={handleUpdated} />
      )}

      <style jsx>{`
        .paymentsPage {
          padding: 34px;
          background: #f8f5ef;
          min-height: 100vh;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #8b8b8b;
          margin-bottom: 24px;
        }

        .breadcrumb strong {
          color: #222;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          margin: 0;
          font-size: 42px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .header p {
          margin-top: 8px;
          color: #777;
          font-size: 15px;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-bottom: 28px;
        }

        .filterCard {
          background: #fff;
          padding: 24px;
          border-radius: 22px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 13px;
          color: #777;
          font-weight: 600;
        }

        .input {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #ece4d6;
          border-radius: 12px;
          padding: 0 14px;
          background: #fff;
        }

        .input svg {
          color: #b68d40;
        }

        .input input {
          flex: 1;
          border: none;
          outline: none;
          background: none;
          font-size: 14px;
        }

        select,
        input[type="date"] {
          height: 48px;
          border: 1px solid #ece4d6;
          border-radius: 12px;
          padding: 0 14px;
          outline: none;
          background: #fff;
          font-size: 14px;
        }

        .errorBox {
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 20px 24px;
          border-radius: 18px;
        }

        .tableCard {
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        thead {
          background: #faf7f2;
        }

        th {
          padding: 18px;
          text-align: left;
          color: #666;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid #ece4d6;
        }

        td {
          padding: 18px;
          border-bottom: 1px solid #f2ece1;
          font-size: 14px;
        }

        .mono {
          font-family: monospace;
          font-size: 12px;
          color: #888;
        }

        .empty {
          text-align: center;
          color: #999;
          padding: 48px 20px;
        }

        .clickableRow {
          cursor: pointer;
          transition: 0.2s;
        }

        .clickableRow:hover {
          background: #fcfaf6;
        }

        @media (max-width: 1100px) {
          .statsGrid {
            grid-template-columns: 1fr;
          }
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: 24,
        display: "flex",
        gap: 16,
        alignItems: "center",
        boxShadow: "0 12px 35px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: "#888", fontSize: 13 }}>{title}</p>
        <h2 style={{ margin: "6px 0 0", fontSize: 26, color: "#222" }}>{value}</h2>
      </div>
    </div>
  );
}
