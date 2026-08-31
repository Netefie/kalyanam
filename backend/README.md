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
| POST | `/subscribers` | – | Subscribe (offers popup); upserts by email |
| GET | `/subscribers` | ✅ | List subscribers |
| GET | `/mail/status` | ✅ | SMTP health + 24h send counters |
| GET | `/mail/templates` | ✅ | Registry of every mail template |
| GET | `/mail/preview/:key` | ✅ | Renders a template against its sample data (`?format=text\|json`) |
| POST | `/mail/test` | ✅ | Sends a real test email for one template (`{ template, to }`) |
| GET | `/mail/logs` | ✅ | Delivery log (`?page&limit&status&template&search`) |
| GET | `/mail/logs/:id` | ✅ | Single log row, including the rendered html/text |
| POST | `/mail/logs/:id/retry` | ✅ | Re-sends exactly what a failed row rendered |
| GET | `/dashboard/stats` | ✅ | Admin dashboard stat cards |
| GET | `/health` | – | Health check |

Auth: send `Authorization: Bearer <token>`.

## Email

Transactional email (`src/emails/`, `src/services/mailer.js`) runs on Gmail
SMTP via an app password — not the account password (generate one at
https://myaccount.google.com/apppasswords, requires 2-Step Verification on
the sending account). Fill in `SMTP_*` / `MAIL_*` in `.env`; leave `SMTP_HOST`
blank to run with mail fully disabled — bookings, enquiries and subscribers
all still work, sends just log as `skipped`.

- **Templates** live in `src/emails/templates/` (14: guest lifecycle mail —
  booking confirmed/cancelled/reminder/post-stay, hold-expiring, payment
  failed, refund processed, enquiry received, subscriber welcome — plus 5
  internal staff alerts) and share one component system
  (`src/emails/components.js`, `theme.js`, `render.js`) so brand styling and
  plaintext-body derivation live in one place.
- **`services/notifications.js`** is the single map from a business event
  (a booking confirmed, an enquiry submitted, ...) to who gets emailed with
  which template — controllers call `onBookingConfirmed(booking)` etc.
  rather than composing mail themselves.
- **`services/mailScheduler.js`** sends the three time-based emails (pre-
  arrival reminder, post-stay thank-you, hold-expiring warning) on a
  10-minute sweep, the same pattern as `services/bookingSweeper.js`.
- **Delivery** is logged to the `MailLog` collection (status, attempts,
  last error, messageId) and is idempotent per event via a unique
  `dedupeKey` — the Razorpay webhook and the browser's `/verify` call can
  both attempt to confirm the same booking, and only one email goes out.
  Transient SMTP failures retry with backoff (1s/4s/16s); permanent ones
  (bad credentials, a rejected recipient) don't.
- **Admin console** at `/admin/emails` (frontend) — delivery log with
  retry, a live template gallery with per-template preview and "send test".
- **Gmail's free-tier sending cap is ~500 recipients/day** — comfortably
  enough for this site's volume, but worth knowing before adding any bulk
  newsletter-style feature on top of this system.

Run `npm run test:mail` for a full render/dedupe/retry/scheduler check with
no real sends, or `npm run test:mail -- --live` to also deliver all 14
templates for real (to `MAIL_TEST_TO`, or `--to=<email>`) — see
`scripts/test-mail.mjs`.

## Deploy (free tier)

1. Create a free **MongoDB Atlas M0** cluster, whitelist `0.0.0.0/0` (or the
   host's IP), copy the connection string.
2. Deploy this folder to Render/Railway/Fly with:
   - Build: `npm install`
   - Start: `npm start`
   - Env: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
     (your deployed frontend URL), `SITE_URL` (same URL — used for email CTA
     links), and `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/
     `MAIL_FROM`/`MAIL_ADMIN_TO` for email (see "Email" above).
3. Run the seed once (locally against the Atlas URI, or a one-off job).
