import { Router } from "express";
import {
  listRooms,
  getRoom,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

export const roomRouter = Router();

// Public reads (optionalAuth lets admins add ?all=true for inactive rooms).
roomRouter.get("/", optionalAuth, listRooms);
roomRouter.get("/:slug/availability", getRoomAvailability);
roomRouter.get("/:slug", getRoom);

// Admin-only writes.
roomRouter.post("/", requireAuth, createRoom);
roomRouter.put("/:id", requireAuth, updateRoom);
roomRouter.delete("/:id", requireAuth, deleteRoom);
