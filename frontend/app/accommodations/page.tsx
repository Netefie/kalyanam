import type { Metadata } from "next";

import JsonLd from "@/components/common/JsonLd";
import BookingFlow from "@/components/accommodations/BookingFlow";
import ContactFormSection from "@/components/contact/ContactFormSection";
import RoomCatalogue from "@/components/rooms/RoomCatalogue";
import { formatINR } from "@/lib/pricing";
import { getRooms } from "@/lib/rooms";
import {
  breadcrumbSchema,
  jsonLdGraph,
  pageMetadata,
  roomFromRate,
  roomListSchema,
} from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

// A server component that renders the client booking flow rather than being
// one. It used to be `"use client"` outright, with a sibling layout.tsx holding
// the metadata — which meant two things a search engine cared about were
// impossible: the page could not describe its own rooms (they arrived after
// hydration), and the layout's <head> could not vary with the catalogue.

export async function generateMetadata(): Promise<Metadata> {
  const [settings, rooms] = await Promise.all([getSiteSettings(), getRooms()]);

  // The description carries the real "from" rate and the real room count, so
  // the search snippet answers "how much?" before the click rather than after
  // it. Both come from the admin-managed catalogue, so neither can go stale.
  const rates = rooms.map(roomFromRate).filter((n) => n > 0);
  const from = rates.length ? Math.min(...rates) : 0;
  const city = settings.city || "Sikar";

  const names = rooms.slice(0, 3).map((r) => r.name);
  const roomList = names.length
    ? `${names.join(", ")}${rooms.length > names.length ? " and more" : ""}`
    : "our rooms";

  return pageMetadata({
    title: "Rooms & Accommodation",
    description:
      `Book ${roomList} at ${settings.hotelName || "Kalyanam Hotel & Resort"}, ${city}` +
      `${from > 0 ? ` from ${formatINR(from)} per night` : ""}. ` +
      "Check live availability and reserve direct — air-conditioned rooms, free Wi-Fi and 24x7 room service.",
    path: "/accommodations",
    settings,
  });
}

export default async function AccommodationsPage() {
  const rooms = await getRooms();

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([
            { name: "Rooms & Accommodation", path: "/accommodations" },
          ]),
          // Declares the room links below as one set of alternatives rather
          // than incidental navigation.
          roomListSchema(rooms, "/accommodations")
        )}
      />

      <BookingFlow />

      {/* Server-rendered, and therefore the only part of this route a crawler
          can actually read. Also the internal linking that makes the per-room
          landing pages reachable without a date search. */}
      <RoomCatalogue
        eyebrow="EVERY ROOM WE OFFER"
        title="Browse Our Room Types"
        description="Full details, photographs and rates for each room — or search your dates above to see what's available and book direct."
        rooms={rooms}
      />

      {/* Closing enquiry form, directly above the footer, on every step. */}
      <ContactFormSection
        eyebrow="NEED HELP WITH YOUR STAY?"
        title="Questions About Your Booking?"
        description="Group bookings, special requests, or a question about a room — send us a note and our reservations team will get back to you."
        subject="Accommodation enquiry"
      />
    </>
  );
}
