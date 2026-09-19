import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Move, Star, Users } from "lucide-react";

import JsonLd from "@/components/common/JsonLd";
import ContactFormSection from "@/components/contact/ContactFormSection";
import RoomCatalogue from "@/components/rooms/RoomCatalogue";
import { formatINR } from "@/lib/pricing";
import { buildAccommodationsUrl } from "@/lib/reservation";
import { getRoomBySlug, getRooms } from "@/lib/rooms";
import {
  breadcrumbSchema,
  jsonLdGraph,
  pageMetadata,
  roomFromRate,
  roomPath,
  roomSchema,
} from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

// One landing page per room type, built from the admin-managed catalogue.
//
// The reason this route exists is that "deluxe room sikar", "super deluxe room
// price" and every other room-level query had nowhere to land: the only page
// that mentioned a room was the booking flow, which renders client-side. This
// gives each room a stable URL, a server-rendered description, its real rates,
// and a HotelRoom/Product node carrying those rates as structured data.

// Prerendered at build time for every room the API knows about. Rooms added
// later still work: `dynamicParams` defaults to true, so an unknown slug is
// rendered on demand and cached, and getRoomBySlug 404s the ones that don't
// exist. That also means a build with the API down produces no room pages
// rather than a failed build (see lib/rooms.ts).
export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata(
  props: PageProps<"/accommodations/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const [room, settings] = await Promise.all([getRoomBySlug(slug), getSiteSettings()]);

  // A slug that doesn't resolve is about to 404 in the page below; returning
  // noindex here keeps a stray link from being indexed in the meantime.
  if (!room) {
    return pageMetadata({
      title: "Room Not Found",
      description: "This room is no longer available.",
      path: roomPath(slug),
      noIndex: true,
      settings,
    });
  }

  const rate = roomFromRate(room);
  const city = settings.city || "Sikar";

  // Built from the room's own fields rather than a generic template, so two
  // rooms never share a description — duplicate meta descriptions across a
  // room set is the classic way these pages end up competing with each other.
  const specs = [room.size, room.bed, room.maxGuests ? `sleeps ${room.maxGuests}` : ""]
    .filter(Boolean)
    .join(", ");

  const description =
    `${room.description?.trim() || `${room.name} at ${settings.hotelName || "Kalyanam Hotel & Resort"}, ${city}.`}` +
    `${specs ? ` ${specs.charAt(0).toUpperCase()}${specs.slice(1)}.` : ""}` +
    `${rate > 0 ? ` From ${formatINR(rate)} per night — book direct.` : " Book direct."}`;

  const image = room.image || room.images?.[0];

  return pageMetadata({
    title: room.name,
    // Meta descriptions are truncated around 160 characters; trimming here
    // means the cut lands on a word rather than mid-sentence.
    description: description.length > 300 ? `${description.slice(0, 297)}…` : description,
    path: roomPath(room.slug),
    // Falls back to the site-wide app/opengraph-image.jpg when the room has no
    // photo of its own.
    ...(image ? { image } : {}),
    settings,
  });
}

export default async function RoomPage(props: PageProps<"/accommodations/[slug]">) {
  const { slug } = await props.params;
  const [room, settings, allRooms] = await Promise.all([
    getRoomBySlug(slug),
    getSiteSettings(),
    getRooms(),
  ]);

  if (!room) notFound();

  const rate = roomFromRate(room);
  const plans = (room.ratePlans ?? []).filter((plan) => plan.active !== false);
  const gallery = [room.image, ...(room.images ?? [])].filter(
    (src, i, all): src is string => Boolean(src) && all.indexOf(src) === i
  );
  const hero = gallery[0];
  const otherRooms = allRooms.filter((r) => r.slug !== room.slug);

  // Straight to the booking flow with this room preselected.
  const bookHref = buildAccommodationsUrl({ roomType: room.slug });

  const specs = [
    room.size && { icon: Move, label: "Room size", value: room.size },
    room.bed && { icon: BedDouble, label: "Bed", value: room.bed },
    room.maxGuests > 0 && {
      icon: Users,
      label: "Sleeps",
      value: `Up to ${room.maxGuests} guests`,
    },
  ].filter(Boolean) as { icon: typeof Move; label: string; value: string }[];

  return (
    <main className="bg-[#FCF8F2]">
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([
            { name: "Rooms & Accommodation", path: "/accommodations" },
            { name: room.name, path: roomPath(room.slug) },
          ]),
          roomSchema(room, settings)
        )}
      />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-[#efe3d3] md:h-[56vh]">
          {hero && (
            // The LCP element on this page, so it is eager and high priority
            // while every other image below stays lazy.
            <img
              src={hero}
              alt={room.name}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <div className="mx-auto max-w-6xl">
            {/* A visible breadcrumb, matching the BreadcrumbList above it.
                Google cross-checks the two, and it gives the room page a link
                back up to the catalogue. */}
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex list-none flex-wrap items-center gap-2 p-0 text-xs text-white/80">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/accommodations" className="hover:text-white">
                    Rooms &amp; Accommodation
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-white">
                  {room.name}
                </li>
              </ol>
            </nav>

            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl text-white md:text-5xl">
              {room.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/90">
              {rate > 0 && (
                <p>
                  <span className="text-xs uppercase tracking-wider">From </span>
                  <span className="text-xl">{formatINR(rate)}</span>
                  <span className="text-xs"> / night</span>
                </p>
              )}

              {/* Rendered only when there is a real rating behind it — the
                  AggregateRating in the JSON-LD is gated on exactly the same
                  condition, so the two can never disagree. */}
              {room.rating > 0 && room.reviews > 0 && (
                <p className="flex items-center gap-1.5">
                  <Star size={16} className="fill-[#e8c07d] text-[#e8c07d]" />
                  <span>{room.rating.toFixed(1)}</span>
                  <span className="text-white/70">
                    ({room.reviews} {room.reviews === 1 ? "review" : "reviews"})
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {room.description && (
              <p className="text-base leading-relaxed text-[#6b533c]">
                {room.description}
              </p>
            )}

            {specs.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[#e4d2bb] pt-8 sm:grid-cols-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#a95038]">
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-[#4f2f16]">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {room.amenities?.length > 0 && (
              <section className="mt-10 border-t border-[#e4d2bb] pt-8">
                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#4f2f16]">
                  Room Amenities
                </h2>
                <ul className="mt-5 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-start gap-2.5 text-sm text-[#6b533c]"
                    >
                      <Check
                        size={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-[#8b5a30]"
                      />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {gallery.length > 1 && (
              <section className="mt-10 border-t border-[#e4d2bb] pt-8">
                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#4f2f16]">
                  Photographs
                </h2>
                <ul className="mt-5 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3">
                  {gallery.slice(1).map((src, i) => (
                    <li
                      key={src}
                      className="aspect-[4/3] overflow-hidden rounded-xl bg-[#efe3d3]"
                    >
                      <img
                        src={src}
                        alt={`${room.name} — photograph ${i + 2}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Rates */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-[#e4d2bb] bg-white p-6 shadow-sm">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#4f2f16]">
                Rates
              </h2>

              <ul className="mt-5 list-none space-y-4 p-0">
                {plans.map((plan) => {
                  const planRate = plan.offerPrice ?? plan.price;
                  // Only a genuine discount, not a plan whose offer price was
                  // left equal to its rack rate.
                  const struck = plan.offerPrice != null && plan.price > plan.offerPrice;

                  // Admins routinely type the cancellation and breakfast terms
                  // into the inclusions themselves ("Non-Refundable", "Free
                  // cancellation"), so stating them again underneath reads as
                  // a stutter. Derive the line from the plan's flags, then drop
                  // whichever halves an inclusion already covers.
                  const inclusions = plan.inclusions ?? [];
                  const covered = (term: string) =>
                    inclusions.some((line) =>
                      line.toLowerCase().includes(term.toLowerCase())
                    );

                  const policy = [
                    plan.refundable ? "Free cancellation" : "Non-refundable",
                    plan.breakfast ? "Breakfast included" : "",
                  ].filter((term) => term && !covered(term));

                  return (
                    <li
                      key={plan.code}
                      className="rounded-xl border border-[#efe3d3] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#a95038]">
                        {plan.label}
                      </p>
                      <h3 className="mt-1 text-base text-[#4f2f16]">{plan.name}</h3>

                      <p className="mt-2">
                        {struck && (
                          <span className="mr-2 text-sm text-[#b9a68f] line-through">
                            {formatINR(plan.price)}
                          </span>
                        )}
                        <span className="text-xl text-[#4f2f16]">
                          {formatINR(planRate)}
                        </span>
                        <span className="text-xs text-[#8a7157]"> / night</span>
                      </p>

                      {inclusions.length > 0 && (
                        <ul className="mt-3 list-none space-y-1.5 p-0">
                          {inclusions.map((line) => (
                            <li
                              key={line}
                              className="flex items-start gap-2 text-xs text-[#6b533c]"
                            >
                              <Check
                                size={13}
                                strokeWidth={2}
                                className="mt-0.5 shrink-0 text-[#8b5a30]"
                              />
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}

                      {policy.length > 0 && (
                        <p className="mt-3 text-xs text-[#8a7157]">
                          {policy.join(" · ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link
                href={bookHref}
                className="mt-6 flex min-h-[52px] items-center justify-center rounded-full bg-[#8b5a30] px-6 text-white transition-colors hover:bg-[#a95038]"
              >
                Check availability &amp; book
              </Link>

              <p className="mt-3 text-center text-xs text-[#8a7157]">
                Rates exclude {settings.taxPercent}% GST. Check-in from{" "}
                {settings.checkInTime}, check-out by {settings.checkOutTime}.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Internal linking between room types — gives each page somewhere to
          pass authority to, and gives a visitor an alternative to bouncing. */}
      <RoomCatalogue
        eyebrow="ALSO AVAILABLE"
        title="Other Rooms"
        rooms={otherRooms}
      />

      <ContactFormSection
        eyebrow="QUESTIONS ABOUT THIS ROOM?"
        title={`Enquire About the ${room.name}`}
        description="Group bookings, an early check-in, an extra bed — tell us what you need and our reservations team will confirm it."
        subject={`${room.name} enquiry`}
      />
    </main>
  );
}
