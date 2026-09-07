"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Send, XCircle, Ban, CheckCircle2, AlertCircle } from "lucide-react";
import MailLogTable from "../components/MailLogTable";
import TemplatePreview from "../components/TemplatePreview";
import Pagination from "../components/Pagination";
import { api, type MailLog, type MailTemplate, type MailStatusSummary, type Paginated } from "@/lib/api";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["", "queued", "sent", "failed", "skipped", "dry-run"];

export default function EmailsPage() {
  const [tab, setTab] = useState<"activity" | "templates">("activity");

  const [status, setStatus] = useState<MailStatusSummary | null>(null);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);

  const [data, setData] = useState<(Paginated<MailLog> & { totals: Record<string, number> }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(
        await api.mail.logs({
          page,
          limit: PAGE_SIZE,
          status: statusFilter,
          template: templateFilter,
          search: debouncedSearch,
        })
      );
    } catch {
      setError("Failed to load the mail activity log.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, templateFilter, debouncedSearch]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, templateFilter, debouncedSearch]);

  useEffect(() => {
    api.mail.status().then(setStatus).catch(() => setStatus(null));
    api.mail.templates().then((r) => setTemplates(r.items)).catch(() => setTemplates([]));
  }, []);

  return (
    <>
      <div className="emailsPage">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span>/</span>
          <strong>Emails</strong>
        </div>

        <div className="header">
          <div>
            <h1>Emails</h1>
            <p>Every transactional email the site sends — delivery activity, templates, and test sends.</p>
          </div>
        </div>

        {status && (
          <div className={`smtpBanner ${status.smtpVerified ? "ok" : "warn"}`}>
            {status.smtpVerified ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>
              {status.smtpVerified
                ? `SMTP connected — sending as ${status.from}`
                : status.enabled
                ? "SMTP is configured but the last connection check failed. Sends will retry and log as failed."
                : "SMTP is not configured — mail is being recorded but not sent."}
              {status.dryRun && " (MAIL_DRY_RUN is on — nothing is actually delivered.)"}
            </span>
          </div>
        )}

        <div className="statsGrid">
          <StatCard icon={<Send size={22} />} title="Sent (24h)" value={status?.last24h.sent ?? "—"} color="#15803D" />
          <StatCard icon={<Mail size={22} />} title="Queued" value={status?.last24h.queued ?? "—"} color="#1D4ED8" />
          <StatCard icon={<XCircle size={22} />} title="Failed (24h)" value={status?.last24h.failed ?? "—"} color="#B91C1C" />
          <StatCard icon={<Ban size={22} />} title="Skipped (24h)" value={status?.last24h.skipped ?? "—"} color="#6B7280" />
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "activity" ? "active" : ""}`} onClick={() => setTab("activity")}>
            Activity
          </button>
          <button className={`tab ${tab === "templates" ? "active" : ""}`} onClick={() => setTab("templates")}>
            Templates
          </button>
        </div>

        {tab === "activity" ? (
          <>
            <div className="filterCard">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s || "all"} value={s}>
                    {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All statuses"}
                  </option>
                ))}
              </select>

              <select value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)}>
                <option value="">All templates</option>
                {templates.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search recipient or subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {error ? (
              <div className="errorBox">{error}</div>
            ) : (
              <MailLogTable logs={data?.items ?? []} loading={loading} onRetried={loadLogs} />
            )}

            {data && data.total > 0 && (
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                totalItems={data.total}
                pageSize={data.limit}
                onPageChange={setPage}
                itemLabel="emails"
              />
            )}
          </>
        ) : (
          <TemplatePreview templates={templates} defaultTestTo={status?.testTo || ""} />
        )}
      </div>

      <style jsx>{`
        .emailsPage{ padding:34px; background:#F8F5EF; min-height:100vh; }
        .breadcrumb{
          display:flex; align-items:center; gap:10px;
          font-size:14px; color:#8b8b8b; margin-bottom:24px;
        }
        .breadcrumb strong{ color:#222; }
        .header{ margin-bottom:24px; }
        .header h1{ margin:0; font-size:42px; font-family:var(--font-cormorant); color:#222; }
        .header p{ margin-top:8px; color:#777; font-size:15px; }

        .smtpBanner{
          display:flex; align-items:center; gap:10px;
          padding:14px 20px; border-radius:14px; font-size:14px; margin-bottom:22px;
        }
        .smtpBanner.ok{ background:#EEF7F1; color:#1E7A4C; }
        .smtpBanner.warn{ background:#FDF5E6; color:#9A6B1E; }

        .statsGrid{
          display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:26px;
        }

        .tabs{ display:flex; gap:10px; margin-bottom:20px; }
        .tab{
          height:44px; padding:0 22px; border-radius:12px;
          border:1px solid #ECE4D6; background:#fff; color:#666;
          cursor:pointer; font-weight:600; font-size:14px; transition:.3s;
        }
        .tab:hover{ border-color:#B68D40; color:#B68D40; }
        .tab.active{
          background:linear-gradient(90deg,#CDA55A,#B68D40);
          color:#fff; border-color:#B68D40;
        }

        .filterCard{
          background:#fff; padding:18px 22px; border-radius:18px;
          box-shadow:0 12px 35px rgba(0,0,0,.05); margin-bottom:24px;
          display:flex; gap:14px; flex-wrap:wrap;
        }
        .filterCard select, .filterCard input{
          height:44px; border:1px solid #ECE4D6; border-radius:12px;
          padding:0 16px; outline:none; background:#fff; font-size:14px;
        }
        .filterCard input{ flex:1; min-width:220px; }

        .errorBox{
          background:#FDECEC; border:1px solid #F5C6C6; color:#B91C1C;
          padding:20px 24px; border-radius:18px;
        }

        @media(max-width:1100px){
          .statsGrid{ grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:768px){
          .statsGrid{ grid-template-columns:1fr; }
          .filterCard{ flex-direction:column; align-items:stretch; }
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
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: color,
          color: "#fff",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <p style={{ color: "#888", marginBottom: 6, fontSize: 14 }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: 30, color: "#222" }}>{value}</h2>
    </div>
  );
}
