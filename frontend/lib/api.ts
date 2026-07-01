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

/* --------------------------------- types ---------------------------------- */

export interface Room {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  offerPrice?: number;
  size: string;
  bed: string;
  maxGuests: number;
  amenities: string[];
  breakfast: boolean;
  cancellation: boolean;
  rating: number;
  reviews: number;
  totalRooms: number;
  availableRooms: number;
  featured: boolean;
  active: boolean;
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

export interface Booking {
  _id: string;
  bookingCode: string;
  guest: Required<GuestInput>;
  roomType: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  amount: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "CheckedIn" | "CheckedOut";
  source: "website" | "admin";
  createdAt: string;
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
  todaysRevenue: number;
  guestsStaying: number;
  occupiedRooms: number;
  totalRooms: number;
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
      request<{ slug: string; total: number; booked: number; available: number }>(
        `/rooms/${slug}/availability?checkIn=${encodeURIComponent(
          checkIn
        )}&checkOut=${encodeURIComponent(checkOut)}`
      ),
    create: (data: Partial<Room>) =>
      request<Room>("/rooms", { method: "POST", body: data, auth: true }),
    update: (id: string, data: Partial<Room>) =>
      request<Room>(`/rooms/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/rooms/${id}`, { method: "DELETE", auth: true }),
  },

  bookings: {
    create: (data: {
      guest: GuestInput;
      roomSlug?: string;
      roomId?: string;
      checkIn: string;
      checkOut: string;
      adults: number;
      children: number;
      rooms: number;
    }) => request<Booking>("/bookings", { method: "POST", body: data }),

    list: (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]
      ).toString();
      return request<Paginated<Booking>>(`/bookings${qs ? `?${qs}` : ""}`, { auth: true });
    },
    updateStatus: (id: string, status: Booking["status"]) =>
      request<Booking>(`/bookings/${id}/status`, {
        method: "PATCH",
        body: { status },
        auth: true,
      }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/bookings/${id}`, { method: "DELETE", auth: true }),
  },

  enquiries: {
    create: (data: Record<string, unknown>) =>
      request("/enquiries", { method: "POST", body: data }),
    list: (params: { page?: number; limit?: number; type?: string; status?: string } = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]
      ).toString();
      return request<Paginated<Record<string, unknown>>>(`/enquiries${qs ? `?${qs}` : ""}`, {
        auth: true,
      });
    },
  },

  dashboard: {
    stats: () => request<DashboardStats>("/dashboard/stats", { auth: true }),
  },
};
