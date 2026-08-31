// Thin, typed client for the Kalyanam backend API.
// Works in both client and server components (only the token helpers below
// touch localStorage, and they guard against SSR).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const TOKEN_KEY = "kalyanam_admin_token";

/* ------------------------------- token store ------------------------------ */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/* --------------------------------- errors --------------------------------- */

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/* --------------------------------- request -------------------------------- */

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach the admin bearer token
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // 204 / empty bodies
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.error || res.statusText, data?.details);
  }
  return data as T;
}

// Like request(), but for an endpoint that returns a raw body (text/html or
// text/plain) instead of JSON — GET /mail/preview/:key is the only one.
// request() would fail here: it always JSON.parses the response body.
async function requestText(path: string, options: RequestOptions = {}): Promise<string> {
  const { method = "GET", auth = false, signal } = options;

  const headers: Record<string, string> = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${path}`, { method, headers, signal });
  const text = await res.text();
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return text;
}

/* --------------------------------- types ---------------------------------- */

// A sellable rate for a room ("Room Only", "Room with Breakfast", ...).
// Mirrors backend/src/models/RoomType.js's ratePlanSchema.
export interface RatePlan {
  code: string;
  name: string;
  label: string;
  price: number;
  offerPrice?: number;
  breakfast: boolean;
  refundable: boolean;
  inclusions: string[];
  active?: boolean;
}

export interface Room {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  offerPrice?: number;
  // Always populated by the API (falls back to a single derived plan when
  // the room has none configured) — see backend/src/services/ratePlans.js.
  ratePlans: RatePlan[];
  size: string;
  bed: string;
  maxGuests: number;
  amenities: string[];
  breakfast: boolean;
  cancellation: boolean;
  rating: number;
  reviews: number;
  // Total physical rooms of this type. There is no static "available" count
  // stored alongside it — availability always depends on a date range and
  // is computed live (see api.rooms.availability / api.rooms.availabilityCalendar
  // and backend/src/services/availability.js).
  totalRooms: number;
  featured: boolean;
  active: boolean;
}

// One room type's live availability over a date range — the shape both
// GET /rooms/availability and GET /rooms/:slug/availability return per room.
// Mirrors backend/src/services/availability.js#getAvailableCount.
export interface RoomAvailability {
  total: number;
  booked: number;
  blocked: number;
  available: number;
}

// GET /rooms/availability response — one batch read for every active room
// over a shared date range, keyed by slug. Replaces issuing one request per
// room on every date change — see hooks/useRoomAvailability.ts.
export interface AvailabilityMap {
  checkIn: string;
  checkOut: string;
  rooms: Record<string, RoomAvailability>;
}

// One day's availability — GET /rooms/availability/calendar's per-room,
// per-day breakdown, used by the date picker (sold-out days) and the admin
// Availability calendar grid.
export interface DailyAvailability {
  date: string; // "YYYY-MM-DD"
  total: number;
  booked: number;
  blocked: number;
  available: number;
}

export interface RoomAvailabilityCalendar {
  slug: string;
  name: string;
  totalRooms: number;
  days: DailyAvailability[];
}

export interface AvailabilityCalendarResponse {
  from: string;
  to: string;
  rooms: RoomAvailabilityCalendar[];
}

// Mirrors backend/src/models/RoomBlock.js — an admin-created hold on
// inventory that isn't a guest booking (maintenance, an owner stay, a group
// hold), consuming stock the same way a booking does.
export interface RoomBlock {
  _id: string;
  roomType: string;
  from: string;
  to: string;
  rooms: number;
  reason: string;
  createdAt: string;
}

// Mirrors backend/src/models/Settings.js's singleton document.
export interface SiteSettings {
  key: string;
  hotelName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  taxPercent: number;
  currency: string;
  cancellationWindowHours: number;
  socials: { instagram: string; facebook: string; youtube: string };
  policies: { cancellation: string; houseRules: string };
}

export interface GuestInput {
  title?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  specialRequest?: string;
}

// The full price breakdown snapshot stored on a booking — mirrors
// backend/src/models/Booking.js's pricingSchema. Also what
// POST /bookings/quote and POST /payments/order return the numeric fields
// of, so the UI never has to re-derive a total from raw room prices.
export interface PricingBreakdown {
  nightlyRate: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  currency: string;
}

export interface RefundEntry {
  refundId: string;
  amount: number;
  status: string;
  reason: string;
  createdAt: string;
}

export type PaymentStatus =
  | "created"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

// Mirrors backend/src/models/Booking.js's paymentSchema — the money
// lifecycle, kept separate from the booking's stay-lifecycle `status`.
export interface PaymentInfo {
  provider: string;
  status: PaymentStatus;
  orderId?: string;
  paymentId?: string;
  method?: string;
  cardLast4?: string;
  amountPaid: number;
  currency: string;
  paidAt?: string;
  failureReason?: string;
  attempts: number;
  refunds: RefundEntry[];
  refundedAmount: number;
}

export interface Booking {
  _id: string;
  bookingCode: string;
  guest: Required<GuestInput>;
  roomType: string;
  roomName: string;
  ratePlanCode?: string;
  ratePlanName?: string;
  nightlyRate?: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  amount: number;
  pricing: PricingBreakdown;
  payment: PaymentInfo;
  holdExpiresAt?: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "CheckedIn" | "CheckedOut" | "Expired";
  source: "website" | "admin";
  checkedInAt?: string;
  checkedOutAt?: string;
  cancellation?: { at?: string; reason: string; by: "guest" | "staff" | "" };
  notifications?: { needsAttentionAt?: string };
  createdAt: string;
}

// POST /bookings/quote response — the authoritative price + availability for
// a room/plan/dates/rooms selection. See lib/pricing.ts for why the browser
// never re-derives these numbers itself.
export interface StayQuote {
  roomSlug: string;
  roomName: string;
  nights: number;
  rooms: number;
  plan: { code: string; name: string; label: string };
  nightlyRate: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  currency: string;
  availability: { total: number; booked: number; available: number };
}

export interface PaymentOrderResponse {
  booking: Booking;
  order: { id: string; amount: number; currency: string };
  keyId: string;
  holdExpiresAt: string;
  prefill: { name: string; email: string; contact: string };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  todaysBookings: number;
  todaysRevenue: number; // collected only (payment.status paid/partially_refunded)
  pendingRevenue: number; // created today, not yet paid
  refundedToday: number;
  guestsStaying: number;
  occupiedRooms: number;
  totalRooms: number;
}

export interface Enquiry {
  _id: string;
  type: "contact" | "reservation";
  name: string;
  email: string;
  phone: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  subject?: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

// Mirrors backend/src/models/Subscriber.js — a newsletter / "exclusive
// offers" opt-in from the site popup.
export interface Subscriber {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  createdAt: string;
}

// Mirrors backend/src/models/MailLog.js's status enum.
export type MailStatus = "queued" | "sent" | "failed" | "skipped" | "dry-run";

// One row in the admin Emails console's activity log. `html`/`text` are
// only included when fetching a single row (GET /mail/logs/:id) — see
// MailLogDetail — the list endpoint omits them to keep the page light.
export interface MailLog {
  _id: string;
  template: string;
  to: string;
  subject: string;
  status: MailStatus;
  attempts: number;
  lastError: string;
  messageId: string;
  dedupeKey?: string;
  refs?: { booking?: string; enquiry?: string; subscriber?: string };
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MailLogDetail extends MailLog {
  html: string;
  text: string;
}

// Mirrors backend/src/emails/templates/index.js's registry listing.
export interface MailTemplate {
  key: string;
  label: string;
  description: string;
  audience: "guest" | "staff";
}

export interface MailStatusSummary {
  enabled: boolean;
  dryRun: boolean;
  smtpVerified: boolean;
  queueDepth: number;
  host: string;
  from: string;
  adminTo: string;
  testTo: string;
  last24h: Record<MailStatus, number>;
}

/* ----------------------------------- api ---------------------------------- */

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; admin: AdminUser }>("/auth/login", {
        method: "POST",
        body: { email, password },
      }),
    me: () => request<AdminUser>("/auth/me", { auth: true }),
  },

  rooms: {
    list: () => request<Room[]>("/rooms"),
    listAll: () => request<Room[]>("/rooms?all=true", { auth: true }),
    get: (slug: string) => request<Room>(`/rooms/${slug}`),
    availability: (slug: string, checkIn: string, checkOut: string) =>
      request<{ slug: string } & RoomAvailability>(
        `/rooms/${slug}/availability?checkIn=${encodeURIComponent(
          checkIn
        )}&checkOut=${encodeURIComponent(checkOut)}`
      ),
    // One batch read for every active room over a shared date range — see
    // hooks/useRoomAvailability.ts, which replaced the former per-room
    // fan-out with this single request.
    availabilityBatch: (checkIn: string, checkOut: string, signal?: AbortSignal) =>
      request<AvailabilityMap>(
        `/rooms/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`,
        { signal }
      ),
    // Per-day availability across a range, for the date picker's sold-out
    // days and the admin Availability calendar grid.
    availabilityCalendar: (from: string, to: string, slug?: string) => {
      const qs = new URLSearchParams({ from, to, ...(slug ? { slug } : {}) }).toString();
      return request<AvailabilityCalendarResponse>(`/rooms/availability/calendar?${qs}`);
    },
    create: (data: Partial<Room>) =>
      request<Room>("/rooms", { method: "POST", body: data, auth: true }),
    update: (id: string, data: Partial<Room>) =>
      request<Room>(`/rooms/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/rooms/${id}`, { method: "DELETE", auth: true }),
  },

  // Admin-only inventory blocks (maintenance, an owner stay, a group hold) —
  // backs the Availability calendar's block/unblock actions.
  roomBlocks: {
    list: (params: { roomType?: string; from?: string; to?: string } = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]
      ).toString();
      return request<{ items: RoomBlock[] }>(`/room-blocks${qs ? `?${qs}` : ""}`, { auth: true });
    },
    create: (data: { roomType: string; from: string; to: string; rooms: number; reason?: string }) =>
      request<RoomBlock>("/room-blocks", { method: "POST", body: data, auth: true }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/room-blocks/${id}`, { method: "DELETE", auth: true }),
  },

  bookings: {
    // Authoritative price + availability for the review step — the browser
    // never computes tax/total itself. See hooks/useBookingQuote.ts.
    quote: (
      data: {
        roomSlug?: string;
        roomId?: string;
        ratePlanCode?: string;
        checkIn: string;
        checkOut: string;
        rooms: number;
      },
      signal?: AbortSignal
    ) => request<StayQuote>("/bookings/quote", { method: "POST", body: data, signal }),

    // Admin-only: manual/offline booking entry (bypasses payment). The
    // website flow creates bookings via api.payments.order instead.
    create: (data: {
      guest: GuestInput;
      roomSlug?: string;
      roomId?: string;
      ratePlanCode?: string;
      checkIn: string;
      checkOut: string;
      adults: number;
      children: number;
      rooms: number;
    }) => request<Booking>("/bookings", { method: "POST", body: data, auth: true }),

    list: (
      params: {
        page?: number;
        limit?: number;
        status?: string;
        paymentStatus?: string;
        search?: string;
      } = {}
    ) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]
      ).toString();
      return request<Paginated<Booking>>(`/bookings${qs ? `?${qs}` : ""}`, { auth: true });
    },
    get: (id: string) => request<Booking>(`/bookings/${id}`, { auth: true }),
    updateStatus: (id: string, status: Booking["status"]) =>
      request<Booking>(`/bookings/${id}/status`, {
        method: "PATCH",
        body: { status },
        auth: true,
      }),
    // Admin cancellation — `refund` is required whenever the booking has a
    // captured, unrefunded payment (see backend/src/services/bookingLifecycle.js).
    cancelAdmin: (id: string, data: { reason?: string; refund?: { amount?: number; reason?: string } } = {}) =>
      request<Booking>(`/bookings/${id}/cancel`, { method: "POST", body: data, auth: true }),
    // Guest self-service cancellation by booking code + email — same pairing
    // as api.payments.lookup, so a leaked code alone can't cancel someone
    // else's stay.
    cancel: (data: { code: string; email: string; reason?: string }) =>
      request<Booking>("/bookings/cancel", { method: "POST", body: data }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/bookings/${id}`, { method: "DELETE", auth: true }),
  },

  payments: {
    // Prices the stay, holds the room, and opens a Razorpay order. The
    // returned `keyId` is Razorpay's public key id (safe to expose) — the
    // secret never leaves the backend.
    order: (data: {
      guest: GuestInput;
      roomSlug?: string;
      roomId?: string;
      ratePlanCode?: string;
      checkIn: string;
      checkOut: string;
      adults: number;
      children: number;
      rooms: number;
    }) => request<PaymentOrderResponse>("/payments/order", { method: "POST", body: data }),

    // Called right after Razorpay Checkout returns. The backend
    // independently re-verifies with Razorpay before confirming anything.
    verify: (data: {
      bookingId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) =>
      request<{ booking: Booking; status: "paid" | "failed" | "processing" }>(
        "/payments/verify",
        { method: "POST", body: data }
      ),

    // Guest self-service receipt lookup — both the code and email must
    // match the booking, so a leaked code alone can't expose someone else's
    // stay.
    lookup: (code: string, email: string) =>
      request<Booking>(
        `/payments/lookup?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`
      ),

    list: (
      params: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
        from?: string;
        to?: string;
      } = {}
    ) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]
      ).toString();
      return request<Paginated<Booking> & { totals: { collected: number; refunded: number; net: number } }>(
        `/payments${qs ? `?${qs}` : ""}`,
        { auth: true }
      );
    },

    refund: (bookingId: string, data: { amount?: number; reason?: string } = {}) =>
      request<Booking>(`/payments/${bookingId}/refund`, { method: "POST", body: data, auth: true }),
  },

  enquiries: {
    create: (data: Record<string, unknown>) =>
      request("/enquiries", { method: "POST", body: data }),
    list: (params: { page?: number; limit?: number; type?: string; status?: string } = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v != null && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return request<Paginated<Enquiry>>(`/enquiries${qs ? `?${qs}` : ""}`, {
        auth: true,
      });
    },
    updateStatus: (id: string, status: Enquiry["status"]) =>
      request<Enquiry>(`/enquiries/${id}`, {
        method: "PATCH",
        body: { status },
        auth: true,
      }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/enquiries/${id}`, { method: "DELETE", auth: true }),
  },

  dashboard: {
    stats: () => request<DashboardStats>("/dashboard/stats", { auth: true }),
  },

  subscribers: {
    create: (data: { name?: string; email: string; phone?: string }) =>
      request<{ success: boolean }>("/subscribers", { method: "POST", body: data }),
    list: (params: { page?: number; limit?: number } = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v != null)
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return request<Paginated<Subscriber>>(`/subscribers${qs ? `?${qs}` : ""}`, { auth: true });
    },
  },

  // The site-wide singleton (GST, check-in/out times, contact, policies,
  // cancellation window) — read publicly, written by admin. See
  // backend/src/models/Settings.js.
  settings: {
    get: () => request<SiteSettings>("/settings"),
    update: (data: Partial<SiteSettings>) =>
      request<SiteSettings>("/settings", { method: "PUT", body: data, auth: true }),
  },

  mail: {
    status: () => request<MailStatusSummary>("/mail/status", { auth: true }),

    templates: () => request<{ items: MailTemplate[] }>("/mail/templates", { auth: true }),

    // Raw HTML for a sandboxed-iframe preview (srcDoc), or the plaintext
    // body — the endpoint requires admin auth, so it can't just be handed
    // to an <iframe src="..."> directly.
    previewHtml: (key: string) => requestText(`/mail/preview/${encodeURIComponent(key)}`, { auth: true }),
    previewText: (key: string) =>
      requestText(`/mail/preview/${encodeURIComponent(key)}?format=text`, { auth: true }),

    logs: (
      params: { page?: number; limit?: number; status?: string; template?: string; search?: string } = {}
    ) => {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v != null && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return request<Paginated<MailLog> & { totals: Record<MailStatus, number> }>(
        `/mail/logs${qs ? `?${qs}` : ""}`,
        { auth: true }
      );
    },

    getLog: (id: string) => request<MailLogDetail>(`/mail/logs/${id}`, { auth: true }),

    retry: (id: string) =>
      request<{ queued?: boolean; alreadySent?: boolean }>(`/mail/logs/${id}/retry`, {
        method: "POST",
        auth: true,
      }),

    sendTest: (template: string, to: string) =>
      request<{ queued?: boolean; skipped?: boolean }>("/mail/test", {
        method: "POST",
        body: { template, to },
        auth: true,
      }),
  },
};
