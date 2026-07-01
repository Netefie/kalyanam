# Kalyanam

Hotel & wedding venue website with a public site + admin panel (Next.js) and a
lean Node + MongoDB API.

## Structure

```
kalyanam/
├── frontend/   Next.js app — public site + /admin panel (talks to the API)
└── backend/    Node + Express + MongoDB (Mongoose) REST API
```

Each app has its own `package.json` and is installed/run independently.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env          # set MONGODB_URI (Atlas free M0) + JWT_SECRET
npm install
npm run seed                  # creates admin + seeds room types
npm run dev                   # http://localhost:5000
```

See [backend/README.md](backend/README.md) for the full API reference and the
cost-optimization notes (single lean service, Atlas M0, stateless JWT).

> **macOS note:** port 5000 is used by AirPlay Receiver. If the backend can't
> bind to it, run on another port (`PORT=5055 npm run dev`) and set
> `NEXT_PUBLIC_API_URL` in the frontend to match.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL to the backend URL
npm install
npm run dev                    # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin/login`
(default seeded admin — `admin@kalyanam.com` / `Kalyanam@346`).

## What talks to what

- Public booking flow (`/accommodations`) → `POST /api/bookings` (priced server-side)
- Reservation popup + contact form → `POST /api/enquiries`
- Admin login → `POST /api/auth/login` (JWT stored client-side; route-guarded)
- Admin bookings / rooms / dashboard → the corresponding protected `/api/*` routes

## Deploy

- **Backend:** Render / Railway / Fly.io free tier + MongoDB Atlas M0. Build
  `npm install`, start `npm start`, set `NODE_ENV=production`, `MONGODB_URI`,
  `JWT_SECRET`, `CORS_ORIGIN` (your frontend URL).
- **Frontend:** Vercel / Netlify. Set `NEXT_PUBLIC_API_URL` to the deployed
  backend URL.
