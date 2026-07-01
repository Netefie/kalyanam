import { Router } from "express";
import {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js";

export const bookingRouter = Router();

// Public: create a booking from the website.
bookingRouter.post("/", createBooking);

// Admin-only management.
bookingRouter.get("/", requireAuth, listBookings);
bookingRouter.get("/:id", requireAuth, getBooking);
bookingRouter.patch("/:id/status", requireAuth, updateBookingStatus);
bookingRouter.delete("/:id", requireAuth, deleteBooking);
