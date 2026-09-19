import Link from "next/link";

import type { Room } from "@/lib/api";
import { formatINR } from "@/lib/pricing";
import { roomFromRate, roomPath } from "@/lib/seo";

// The published room types, rendered on the server.
//
// This exists because of a search problem: /accommodations is a stateful
// booking flow (components/accommodations/BookingFlow.tsx) and the homepage
// section used to fetch through hooks/useRooms.ts, so every room name,
// description and rate arrived after hydration. A crawler fetching the HTML saw
// an empty shell — the entire catalogue, the site's most commercially valuable
// content, was invisible to search. Rendering it here puts it in the served
// markup, and gives every room type a crawlable link to its own landing page.

interface Props {
  rooms: Room[];
  /** Section heading. */
  title?: string;
  eyebrow?: string;
  description?: string;
  /** Extra classes for the wrapping <section>, for per-page background tweaks. */
  className?: string;
}

export default function RoomCatalogue({
  rooms,
  eyebrow = "WHERE YOU'LL STAY",
  title = "Our Rooms & Suites",
  description,
  className = "",
}: Props) {
  // Nothing to show when the catalogue is empty or the API was unreachable at
  // build time. Rendering an empty grid with a heading over it would read as a
  // broken page; omitting the section entirely just leaves the page shorter.
  if (!rooms.length) return null;

  return (
    <section className={`bg-[#FCF8F2] py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10 text-center md:mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-[#a95038]">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[#4f2f16] md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#8a7157]">
              {description}
            </p>
          )}
        </header>

        <ul className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const image = room.image || room.images?.[0];
            const rate = roomFromRate(room);

            return (
              <li
                key={room.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#e4d2bb] bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#efe3d3]">
                  {image && (
                    // Plain <img>: next/image is configured `unoptimized`
                    // (see next.config.ts) and these paths come from the admin
                    // panel, so there is nothing to gain and a layout to lose.
                    // The aspect-ratio box above is what reserves the space.
                    <img
                      src={image}
                      alt={room.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#4f2f16]">
                    {/* The whole card is not a link, but the heading is —
                        so the anchor text a crawler indexes is the room name
                        rather than "View Details". */}
                    <Link
                      href={roomPath(room.slug)}
                      className="transition-colors hover:text-[#a95038]"
                    >
                      {room.name}
                    </Link>
                  </h3>

                  {room.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#8a7157]">
                      {room.description}
                    </p>
                  )}

                  <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#8a7157]">
                    {room.size && (
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Size</dt>
                        <dd>{room.size}</dd>
                      </div>
                    )}
                    {room.bed && (
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Bed</dt>
                        <dd>{room.bed}</dd>
                      </div>
                    )}
                    {room.maxGuests > 0 && (
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Sleeps</dt>
                        <dd>Up to {room.maxGuests} guests</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-auto flex items-end justify-between pt-6">
                    {rate > 0 && (
                      <p className="text-sm text-[#8a7157]">
                        <span className="block text-xs uppercase tracking-wider">
                          From
                        </span>
                        <span className="text-xl text-[#4f2f16]">
                          {formatINR(rate)}
                        </span>
                        <span className="text-xs"> / night</span>
                      </p>
                    )}

                    <Link
                      href={roomPath(room.slug)}
                      className="rounded-full bg-[#8b5a30] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#a95038]"
                    >
                      View room
                      <span className="sr-only"> — {room.name}</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
