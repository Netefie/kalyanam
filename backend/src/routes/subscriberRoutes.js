import { Router } from "express";
import {
  createSubscriber,
  listSubscribers,
} from "../controllers/subscriberController.js";
import { requireAuth } from "../middleware/auth.js";

export const subscriberRouter = Router();

// Public: subscribe from the offers popup.
subscriberRouter.post("/", createSubscriber);

// Admin-only: view subscribers.
subscriberRouter.get("/", requireAuth, listSubscribers);
