import { breadcrumbSchema, jsonLdGraph, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";

// page.tsx is a client component (the whole booking flow is stateful), and
// `metadata` is server-only — so the route's <head> is defined here instead.

export const metadata = pageMetadata({
  title: "Rooms & Accommodation",
  description:
    "Book a Deluxe or Super Deluxe room at Kalyanam Hotel & Resort, Sikar. Check live availability " +
    "and reserve direct — air-conditioned rooms, free Wi-Fi and 24x7 room service.",
  path: "/accommodations",
});

export default function AccommodationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([{ name: "Rooms & Accommodation", path: "/accommodations" }])
        )}
      />
      {children}
    </>
  );
}
