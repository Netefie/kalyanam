import { pageMetadata } from "@/lib/seo";

// Only reachable with a booking reference, so it has nothing to offer a search
// result — noIndex here, plus a Disallow in app/robots.ts. Both are needed: a
// robots.txt Disallow stops the crawl but a URL linked from elsewhere can still
// be indexed url-only, and the noindex tag is what actually keeps it out.

export const metadata = pageMetadata({
  title: "Manage Your Booking",
  description:
    "Look up, review or cancel an existing Kalyanam Hotel & Resort reservation.",
  path: "/manage-booking",
  noIndex: true,
});

export default function ManageBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
