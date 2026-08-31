"use client";

import { useState } from "react";
import { RotateCw, ChevronDown, ChevronRight } from "lucide-react";
import { api, type MailLog, type MailLogDetail } from "@/lib/api";
import MailStatusPill from "./MailStatusPill";

interface MailLogTableProps {
  logs: MailLog[];
  loading: boolean;
  onRetried: () => void;
}

function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// A single row, expandable to show the last error and a live preview of
// exactly what was (or would be) sent — fetched on demand since the list
// endpoint omits html/text to keep the page light (see lib/api.ts).
function LogRow({ log, onRetried }: { log: MailLog; onRetried: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<MailLogDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !detail) {
      setLoadingDetail(true);
      try {
        setDetail(await api.mail.getLog(log._id));
      } catch {
        // leave detail null — the expanded panel shows a fallback below
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await api.mail.retry(log._id);
      onRetried();
    } catch {
      alert("Could not retry this email.");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <>
      <tr className="row" onClick={toggle}>
        <td className="expandCell">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </td>
        <td className="template">{log.template}</td>
        <td className="to">{log.to}</td>
        <td className="subject">{log.subject}</td>
        <td>
          <MailStatusPill status={log.status} />
        </td>
        <td className="attempts">{log.attempts}</td>
        <td className="date">{fmtDateTime(log.sentAt || log.createdAt)}</td>
        <td onClick={(e) => e.stopPropagation()}>
          {log.status === "failed" && (
            <button className="retryBtn" onClick={handleRetry} disabled={retrying}>
              <RotateCw size={14} className={retrying ? "spin" : ""} />
              {retrying ? "Retrying…" : "Retry"}
            </button>
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="detailRow">
          <td colSpan={8}>
            {loadingDetail ? (
              <div className="detailLoading">Loading…</div>
            ) : (
              <div className="detailPanel">
                {log.lastError && <div className="lastError">Last error: {log.lastError}</div>}
                {detail?.html ? (
                  <iframe
                    title={`preview-${log._id}`}
                    sandbox=""
                    srcDoc={detail.html}
                    className="previewFrame"
                  />
                ) : (
                  <div className="detailLoading">Preview unavailable.</div>
                )}
              </div>
            )}
          </td>
        </tr>
      )}

      <style jsx>{`
        .row{ cursor:pointer; }
        .row:hover{ background:#FCFAF6; }
        .expandCell{ width:32px; color:#999; }
        .template{ font-weight:600; color:#222; white-space:nowrap; }
        .to{ color:#555; white-space:nowrap; }
        .subject{ color:#666; max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .attempts{ color:#888; text-align:center; }
        .date{ color:#888; white-space:nowrap; }

        .retryBtn{
          display:flex; align-items:center; gap:6px;
          padding:8px 14px; border:none; border-radius:10px;
          background:#F8F5EF; color:#B68D40; font-weight:600; font-size:13px;
          cursor:pointer; transition:.3s;
        }
        .retryBtn:hover:not(:disabled){ background:#B68D40; color:#fff; }
        .retryBtn:disabled{ opacity:.6; cursor:not-allowed; }
        .retryBtn :global(.spin){ animation:spin 1s linear infinite; }
        @keyframes spin{ to{ transform:rotate(360deg); } }

        .detailRow td{ padding:0; border-bottom:1px solid #F2ECE1; }
        .detailPanel{ padding:18px 20px; background:#FAF8F3; }
        .detailLoading{ padding:18px 20px; color:#999; font-size:13px; }
        .lastError{
          margin-bottom:12px; padding:10px 14px; border-radius:10px;
          background:#FDECEC; color:#B91C1C; font-size:13px;
        }
        .previewFrame{
          width:100%; height:480px; border:1px solid #ECE4D6; border-radius:12px; background:#fff;
        }
      `}</style>
    </>
  );
}

export default function MailLogTable({ logs, loading, onRetried }: MailLogTableProps) {
  return (
    <>
      <div className="tableCard">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Template</th>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Sent</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="empty">Loading emails…</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">No emails found.</td>
              </tr>
            ) : (
              logs.map((log) => <LogRow key={log._id} log={log} onRetried={onRetried} />)
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .tableCard{
          background:#fff; border-radius:22px; overflow:hidden;
          box-shadow:0 12px 35px rgba(0,0,0,.05);
        }
        table{ width:100%; border-collapse:collapse; }
        thead{ background:#faf7f2; }
        th{
          padding:18px 16px; text-align:left; color:#666;
          font-size:14px; font-weight:600; border-bottom:1px solid #ECE4D6;
        }
        :global(td){ padding:16px; border-bottom:1px solid #F2ECE1; font-size:14px; vertical-align:middle; }
        .empty{ text-align:center; color:#999; padding:48px 20px; }

        @media(max-width:1200px){
          .tableCard{ overflow:auto; }
          table{ min-width:1000px; }
        }
      `}</style>
    </>
  );
}
