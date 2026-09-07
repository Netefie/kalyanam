import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component (it reads the live cancellation window from
// GET /settings), so the route's metadata lives here.

export const metadata = pageMetadata({
  title: "Cancellation Policy",
  description:
    "The cancellation terms for bookings at Kalyanam Hotel & Resort — the free-cancellation window, " +
    "how to cancel a reservation and when a refund is issued automatically.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
