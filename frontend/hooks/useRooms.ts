"use client";

import { useEffect, useState } from "react";

import { api, type Room } from "@/lib/api";

// The public room catalogue (GET /rooms — active rooms, featured first), for
// the components outside the booking flow that used to hardcode Deluxe and
// Super Deluxe: the homepage rooms section and hero booking bar, and the
// navbar's reservation popup. A room added, renamed or retired in the admin
// panel now shows up in all three.
//
// Up to three of them mount on the homepage at once, so the request is shared:
// one in-flight/settled promise per page load. A failed fetch is dropped from
// the cache so the next component to mount retries instead of inheriting the
// error.
let cached: Promise<Room[]> | null = null;

function loadRooms(): Promise<Room[]> {
  if (!cached) {
    cached = api.rooms.list().catch((err) => {
      cached = null;
      throw err;
    });
  }
  return cached;
}

// `enabled` defers the request until it's actually needed — the navbar popup
// is mounted on every page but only needs rooms once it's opened.
export default function useRooms(enabled = true) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    loadRooms()
      .then((data) => {
        if (!cancelled) setRooms(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { rooms, loading, error };
}
