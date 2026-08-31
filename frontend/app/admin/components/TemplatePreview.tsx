"use client";

import { useEffect, useMemo, useState } from "react";
import { Send, Smartphone, Monitor, Loader2 } from "lucide-react";
import { api, ApiError, type MailTemplate } from "@/lib/api";

interface TemplatePreviewProps {
  templates: MailTemplate[];
  defaultTestTo: string;
}

// Gallery of every registered template (left) + a live rendered preview
// (right), dropped into a sandboxed iframe via srcDoc — the preview
// endpoint requires admin auth, so it's fetched with the bearer token
// rather than used directly as an <iframe src>, which couldn't carry it.
export default function TemplatePreview({ templates, defaultTestTo }: TemplatePreviewProps) {
  const [selectedKey, setSelectedKey] = useState(templates[0]?.key ?? "");
  const [html, setHtml] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const [testTo, setTestTo] = useState(defaultTestTo);
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const grouped = useMemo(() => {
    const guest = templates.filter((t) => t.audience === "guest");
    const staff = templates.filter((t) => t.audience === "staff");
    return { guest, staff };
  }, [templates]);

  useEffect(() => {
    if (!selectedKey) return;
    let cancelled = false;
    setLoadingPreview(true);
    setSendMessage("");
    api.mail
      .previewHtml(selectedKey)
      .then((h) => {
        if (!cancelled) setHtml(h);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

  const handleSendTest = async () => {
    if (!testTo) return;
    setSending(true);
    setSendMessage("");
    try {
      await api.mail.sendTest(selectedKey, testTo);
      setSendMessage(`Sent to ${testTo}.`);
    } catch (err) {
      setSendMessage(err instanceof ApiError ? err.message : "Could not send test email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap">
      <div className="list">
        <div className="groupLabel">Guest Emails</div>
        {grouped.guest.map((t) => (
          <TemplateCard key={t.key} template={t} active={t.key === selectedKey} onClick={() => setSelectedKey(t.key)} />
        ))}

        <div className="groupLabel">Staff Alerts</div>
        {grouped.staff.map((t) => (
          <TemplateCard key={t.key} template={t} active={t.key === selectedKey} onClick={() => setSelectedKey(t.key)} />
        ))}
      </div>

      <div className="previewPane">
        <div className="previewToolbar">
          <div className="viewportToggle">
            <button
              className={viewport === "desktop" ? "active" : ""}
              onClick={() => setViewport("desktop")}
              title="Desktop width"
            >
              <Monitor size={16} />
            </button>
            <button
              className={viewport === "mobile" ? "active" : ""}
              onClick={() => setViewport("mobile")}
              title="Mobile width"
            >
              <Smartphone size={16} />
            </button>
          </div>

          <div className="sendTest">
            <input
              type="email"
              placeholder="send test to…"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
            />
            <button onClick={handleSendTest} disabled={sending || !testTo}>
              {sending ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
              {sending ? "Sending…" : "Send Test"}
            </button>
          </div>
        </div>

        {sendMessage && <div className="sendMessage">{sendMessage}</div>}

        <div className={`frameWrap ${viewport}`}>
          {loadingPreview ? (
            <div className="loading">Rendering…</div>
          ) : html ? (
            <iframe title="template-preview" sandbox="" srcDoc={html} className="frame" />
          ) : (
            <div className="loading">Preview unavailable.</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .wrap{ display:grid; grid-template-columns:280px 1fr; gap:20px; align-items:start; }

        .list{
          background:#fff; border-radius:18px; padding:14px;
          box-shadow:0 10px 30px rgba(0,0,0,.05);
          /* Cap to the space actually on screen, so a zoomed-in (short) viewport
             does not leave the bottom of the list below the fold. */
          max-height:min(720px, max(220px, calc(100dvh - 200px))); overflow-y:auto;
        }
        .groupLabel{
          font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
          color:#a99f8c; padding:14px 10px 8px;
        }

        .previewPane{
          background:#fff; border-radius:18px; padding:18px;
          box-shadow:0 10px 30px rgba(0,0,0,.05);
        }
        .previewToolbar{
          display:flex; justify-content:space-between; align-items:center;
          gap:16px; flex-wrap:wrap; margin-bottom:14px;
        }
        .viewportToggle{ display:flex; gap:6px; background:#F7F4EE; padding:4px; border-radius:10px; }
        .viewportToggle button{
          width:36px; height:34px; border:none; border-radius:8px; background:transparent;
          color:#888; cursor:pointer; display:flex; align-items:center; justify-content:center;
        }
        .viewportToggle button.active{ background:#B68D40; color:#fff; }

        .sendTest{ display:flex; gap:8px; }
        .sendTest input{
          height:38px; padding:0 14px; border:1px solid #ECE4D6; border-radius:10px;
          outline:none; font-size:13px; min-width:220px;
        }
        .sendTest button{
          display:flex; align-items:center; gap:6px; height:38px; padding:0 16px;
          border:none; border-radius:10px; background:#B68D40; color:#fff;
          font-weight:600; font-size:13px; cursor:pointer; transition:.3s; white-space:nowrap;
        }
        .sendTest button:hover:not(:disabled){ background:#956124; }
        .sendTest button:disabled{ opacity:.6; cursor:not-allowed; }
        .sendTest :global(.spin){ animation:spin 1s linear infinite; }
        @keyframes spin{ to{ transform:rotate(360deg); } }

        .sendMessage{
          margin-bottom:14px; padding:10px 14px; border-radius:10px;
          background:#FAF5EB; color:#8a6d1f; font-size:13px;
        }

        .frameWrap{
          border:1px solid #ECE4D6; border-radius:14px; overflow:hidden; background:#F8F5EF;
          display:flex; justify-content:center; padding:20px;
        }
        .frame{
          width:100%; height:640px; max-height:max(280px, calc(100dvh - 260px));
          border:none; background:#fff; border-radius:8px;
        }
        /* max-width so the 390px mobile preview shrinks rather than pushing the
           pane wider than the page when the browser is zoomed in. */
        .frameWrap.mobile .frame{ width:390px; max-width:100%; }
        .loading{ padding:60px 20px; color:#999; text-align:center; width:100%; }

        @media(max-width:900px){
          .wrap{ grid-template-columns:1fr; }
          .list{ max-height:260px; }
        }
      `}</style>
    </div>
  );
}

function TemplateCard({
  template,
  active,
  onClick,
}: {
  template: MailTemplate;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="cardLabel">{template.label}</div>
      <div className="cardDesc">{template.description}</div>

      <style jsx>{`
        .card{
          display:block; width:100%; text-align:left; padding:12px 12px;
          border:none; border-radius:12px; background:transparent; cursor:pointer;
          margin-bottom:2px; transition:.2s;
        }
        .card:hover{ background:#FAF5EB; }
        .card.active{ background:#B68D40; }
        .cardLabel{ font-weight:600; font-size:14px; color:#222; }
        .card.active .cardLabel{ color:#fff; }
        .cardDesc{ font-size:12px; color:#888; margin-top:3px; line-height:1.4; }
        .card.active .cardDesc{ color:#F6ECD8; }
      `}</style>
    </button>
  );
}
