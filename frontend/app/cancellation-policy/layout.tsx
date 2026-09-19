import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

// page.tsx is a client component (it reads the live cancellation window from
// GET /settings), so the route's metadata lives here.

// Settings-aware so a renamed hotel rebrands this page's share card too.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return pageMetadata({
    title: "Cancellation Policy",
    description:
      "The cancellation terms for bookings at Kalyanam Hotel & Resort — the free-cancellation window, " +
      "how to cancel a reservation and when a refund is issued automatically.",
    path: "/cancellation-policy",
    settings,
  });
}

export default function CancellationPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
