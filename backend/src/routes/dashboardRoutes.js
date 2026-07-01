import { Router } from "express";
import { getStats } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", requireAuth, getStats);
