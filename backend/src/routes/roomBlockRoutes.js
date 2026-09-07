import { Router } from "express";
import { listRoomBlocks, createRoomBlock, deleteRoomBlock } from "../controllers/roomBlockController.js";
import { requireAuth } from "../middleware/auth.js";

export const roomBlockRouter = Router();

// Admin-only — inventory blocks are a back-office tool, not guest-facing.
// The public availability endpoints (routes/roomRoutes.js) already fold
// blocked rooms into what they report as sold out.
roomBlockRouter.use(requireAuth);

roomBlockRouter.get("/", listRoomBlocks);
roomBlockRouter.post("/", createRoomBlock);
roomBlockRouter.delete("/:id", deleteRoomBlock);
