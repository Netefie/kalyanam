import { Router } from "express";
import {
  quoteBooking,
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  cancelBookingAdmin,
  cancelBookingSelf,
  deleteBooking,
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js";

export const bookingRouter = Router();

// Public: authoritative price + availability for the booking flow's review
// step. No inventory is held here — see POST /api/payments/order for that.
bookingRouter.post("/quote", quoteBooking);

// Public: guest self-service cancellation by booking code + email (mirrors
// GET /payments/lookup's auth model).
bookingRouter.post("/cancel", cancelBookingSelf);

// Admin-only: manual/offline booking entry (bypasses payment). The website
// flow creates bookings via POST /api/payments/order instead.
bookingRouter.post("/", requireAuth, createBooking);

// Admin-only management.
bookingRouter.get("/", requireAuth, listBookings);
bookingRouter.get("/:id", requireAuth, getBooking);
bookingRouter.patch("/:id/status", requireAuth, updateBookingStatus);
bookingRouter.post("/:id/cancel", requireAuth, cancelBookingAdmin);
bookingRouter.delete("/:id", requireAuth, deleteBooking);
