"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError, type StayQuote } from "@/lib/api";

interface Params {
  roomSlug: string | undefined;
  ratePlanCode: string | undefined;
  checkIn: Date | null;
  checkOut: Date | null;
  rooms: number;
}

interface Result {
  quote: StayQuote | null;
  loading: boolean;
  error: string;
}

const DEBOUNCE_MS = 300;

// Fetches the authoritative price breakdown from POST /bookings/quote
// whenever the room/plan/dates/rooms selection changes, debounced so rapid
// guest-count clicks don't fire a request per click. This is the single
// place the booking flow's numbers come from — BookingSummary and the
// Review & Pay step both call this hook rather than each computing their
// own total (see lib/pricing.ts for why that used to drift from the
// backend's tax-inclusive figure).
export default function useBookingQuote({
  roomSlug,
  ratePlanCode,
  checkIn,
  checkOut,
  rooms,
}: Params): Result {
  const [quote, setQuote] = useState<StayQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Guards against a slow earlier request overwriting a faster later one.
  const requestId = useRef(0);

  const checkInTime = checkIn?.getTime();
  const checkOutTime = checkOut?.getTime();
  const paramsValid = Boolean(roomSlug && checkInTime && checkOutTime);

  useEffect(() => {
    // Nothing to fetch yet — bump requestId so any in-flight response for a
    // now-stale selection is ignored, but don't setState here: the returned
    // `quote`/`error` are derived from `paramsValid` below instead, so an
    // incomplete selection never needs its own render-triggering reset.
    if (!roomSlug || !checkInTime || !checkOutTime) {
      requestId.current += 1;
      return;
    }

    const thisRequest = ++requestId.current;
    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(() => {
      api.bookings
        .quote(
          {
            roomSlug,
            ratePlanCode,
            checkIn: new Date(checkInTime).toISOString(),
            checkOut: new Date(checkOutTime).toISOString(),
            rooms,
          },
          controller.signal
        )
        .then((data) => {
          if (requestId.current !== thisRequest) return;
          setQuote(data);
          setError("");
        })
        .catch((err) => {
          if (requestId.current !== thisRequest) return;
          if (err instanceof DOMException && err.name === "AbortError") return;
          setQuote(null);
          setError(err instanceof ApiError ? err.message : "Could not price this stay.");
        })
        .finally(() => {
          if (requestId.current === thisRequest) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [roomSlug, ratePlanCode, checkInTime, checkOutTime, rooms]);

  if (!paramsValid) {
    return { quote: null, loading: false, error: "" };
  }
  return { quote, loading, error };
}
