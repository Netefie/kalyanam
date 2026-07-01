# Kalyanam Backend

Lean **Node + Express + MongoDB (Mongoose)** REST API for the Kalyanam hotel /
wedding site. Designed to run cheaply as a **single long-running service** on a
free tier (Render / Railway / Fly.io) against **MongoDB Atlas M0 (free)**.

## Why it's cost-optimized

- **One small process, one small connection pool** (`maxPoolSize: 5`) reused
  across requests — friendly to Atlas M0's connection cap.
- **Stateless JWT auth** — no Redis/session store to run or pay for.
- **`.lean()` reads + pagination + indexes** — less CPU/RAM per request.
- **Minimal dependencies**, `bcryptjs` (pure JS, no native build) → faster,
  cheaper deploys.
- **No build step** (plain ESM) → deploy the source as-is.

## Getting started

```bash
cd backend
cp .env.example .env        # then edit MONGODB_URI + JWT_SECRET
npm install
npm run seed                # creates admin + seeds room types
npm run dev                 # http://localhost:5000
```

- `npm run dev` — start with file watching (`node --watch`)
- `npm start` — production start
- `npm run seed` — create the admin account + seed rooms

Default seeded admin: `admin@kalyanam.com` / `Kalyanam@346` (change via env).

## API

Base URL: `/api`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/auth/login` | – | Login, returns `{ token, admin }` |
| GET | `/auth/me` | ✅ | Current admin |
| PATCH | `/auth/password` | ✅ | Change own password (`currentPassword`, `newPassword`) |
| GET | `/rooms` | – | List active rooms (`?all=true` + auth → include inactive) |
| GET | `/rooms/:slug` | – | Single room |
| GET | `/rooms/:slug/availability` | – | Rooms free for `?checkIn&checkOut` → `{ total, booked, available }` |
| POST | `/rooms` | ✅ | Create room type |
| PUT | `/rooms/:id` | ✅ | Update room type |
| DELETE | `/rooms/:id` | ✅ | Delete room type |
| POST | `/bookings` | – | Create booking (website); priced server-side, blocks overbooking |
| GET | `/bookings` | ✅ | List bookings (`?page&limit&status&search`) |
| GET | `/bookings/:id` | ✅ | Single booking |
| PATCH | `/bookings/:id/status` | ✅ | Update status |
| DELETE | `/bookings/:id` | ✅ | Delete booking |
| POST | `/enquiries` | – | Create enquiry (reservation/contact) |
| GET | `/enquiries` | ✅ | List enquiries (`?page&limit&type&status`) |
| PATCH | `/enquiries/:id` | ✅ | Update status |
| DELETE | `/enquiries/:id` | ✅ | Delete enquiry |
| GET | `/blogs` | – | List published posts (`?page&limit`; `?all=true` + auth → drafts) |
| GET | `/blogs/:slug` | – | Single post |
| POST | `/blogs` | ✅ | Create post |
| PUT | `/blogs/:id` | ✅ | Update post |
| DELETE | `/blogs/:id` | ✅ | Delete post |
| GET | `/settings` | – | Site settings (contact, policies, socials); auto-creates defaults |
| PUT | `/settings` | ✅ | Update site settings |
| GET | `/dashboard/stats` | ✅ | Admin dashboard stat cards |
| GET | `/health` | – | Health check |

Auth: send `Authorization: Bearer <token>`.

## Deploy (free tier)

1. Create a free **MongoDB Atlas M0** cluster, whitelist `0.0.0.0/0` (or the
   host's IP), copy the connection string.
2. Deploy this folder to Render/Railway/Fly with:
   - Build: `npm install`
   - Start: `npm start`
   - Env: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
     (your deployed frontend URL).
3. Run the seed once (locally against the Atlas URI, or a one-off job).
