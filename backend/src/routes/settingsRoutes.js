import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAuth } from "../middleware/auth.js";

export const settingsRouter = Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", requireAuth, updateSettings);
