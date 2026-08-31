"use client";

import { useEffect, useRef, useState } from "react";
import { api, type AvailabilityMap } from "@/lib/api";

interface Params {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface Result {
  // slug -> rooms still available for the selected dates. Empty until dates
  // are chosen.
  availability: Record<string, number>;
  loading: boolean;
}

const DEBOUNCE_MS = 300;

// One debounced batch request (GET /rooms/availability) for every room's
// availability over the selected dates — replacing what used to be one
// request per room, re-fired on every date change (an N+1 that also hit an
// unindexed query per room; see backend/src/services/availability.js and
// backend/src/models/Booking.js's compound index). Structured the same way
// hooks/useBookingQuote.ts is: debounced, with a request-id guard so a slow
// earlier response can never clobber a faster later one.
export default function useRoomAvailability({ checkIn, checkOut }: Params): Result {
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const requestId = useRef(0);

  const checkInTime = checkIn?.getTime();
  const checkOutTime = checkOut?.getTime();

  useEffect(() => {
    if (!checkInTime || !checkOutTime) {
      requestId.current += 1;
      setAvailability({});
      return;
    }

    const thisRequest = ++requestId.current;
    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(() => {
      api.rooms
        .availabilityBatch(new Date(checkInTime).toISOString(), new Date(checkOutTime).toISOString(), controller.signal)
        .then((data: AvailabilityMap) => {
          if (requestId.current !== thisRequest) return;
          const map: Record<string, number> = {};
          for (const [slug, counts] of Object.entries(data.rooms)) {
            map[slug] = counts.available;
          }
          setAvailability(map);
        })
        .catch((err) => {
          if (requestId.current !== thisRequest) return;
          if (err instanceof DOMException && err.name === "AbortError") return;
          // Availability is a nice-to-have overlay on the room list, not the
          // list itself — a failed batch read just leaves counts unknown
          // (PriceCard treats `undefined` as "not known yet") rather than
          // blocking the page with its own error state.
          setAvailability({});
        })
        .finally(() => {
          if (requestId.current === thisRequest) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [checkInTime, checkOutTime]);

  return { availability, loading };
}
