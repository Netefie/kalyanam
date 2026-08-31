import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  lookupBooking,
  listPayments,
  refundBooking,
} from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

export const paymentRouter = Router();

// Public — the guest-facing payment flow.
paymentRouter.post("/order", createPaymentOrder);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/lookup", lookupBooking);

// Razorpay → us. Signature-verified in the controller (see app.js for the
// raw-body mount this route needs).
paymentRouter.post("/webhook", handleWebhook);

// Admin-only.
paymentRouter.get("/", requireAuth, listPayments);
paymentRouter.post("/:bookingId/refund", requireAuth, refundBooking);
