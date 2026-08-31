"use client";

import type { MailStatus } from "@/lib/api";

const LABELS: Record<MailStatus, string> = {
  queued: "Queued",
  sent: "Sent",
  failed: "Failed",
  skipped: "Skipped",
  "dry-run": "Dry Run",
};

const COLORS: Record<MailStatus, { bg: string; fg: string }> = {
  queued: { bg: "#DBEAFE", fg: "#1D4ED8" },
  sent: { bg: "#DCFCE7", fg: "#15803D" },
  failed: { bg: "#FEE2E2", fg: "#B91C1C" },
  skipped: { bg: "#F3F4F6", fg: "#6B7280" },
  "dry-run": { bg: "#EDE9FE", fg: "#6D28D9" },
};

// Small colored pill for a MailLog row's status — same visual language as
// PaymentStatusPill.tsx, kept separate since the two enums are unrelated.
export default function MailStatusPill({ status }: { status: MailStatus }) {
  const color = COLORS[status] ?? COLORS.queued;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: color.bg,
        color: color.fg,
        whiteSpace: "nowrap",
      }}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
