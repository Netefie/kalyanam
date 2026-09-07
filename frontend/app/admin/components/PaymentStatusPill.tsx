"use client";

import type { PaymentStatus } from "@/lib/api";

const LABELS: Record<PaymentStatus, string> = {
  created: "Awaiting Payment",
  authorized: "Authorized",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partial Refund",
};

const COLORS: Record<PaymentStatus, { bg: string; fg: string }> = {
  created: { bg: "#FEF3C7", fg: "#B45309" },
  authorized: { bg: "#DBEAFE", fg: "#1D4ED8" },
  paid: { bg: "#DCFCE7", fg: "#15803D" },
  failed: { bg: "#FEE2E2", fg: "#B91C1C" },
  refunded: { bg: "#EDE9FE", fg: "#6D28D9" },
  partially_refunded: { bg: "#FFE4D5", fg: "#C2410C" },
};

// Small colored pill for a booking's payment.status — separate from the
// booking-status pill (Pending/Confirmed/...) since the two lifecycles are
// independent (see backend/src/models/Booking.js).
export default function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  const color = COLORS[status] ?? COLORS.created;
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
