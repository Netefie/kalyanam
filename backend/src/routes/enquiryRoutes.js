import { Router } from "express";
import {
  createEnquiry,
  listEnquiries,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { requireAuth } from "../middleware/auth.js";

export const enquiryRouter = Router();

// Public: submit a reservation/contact enquiry.
enquiryRouter.post("/", createEnquiry);

// Admin-only.
enquiryRouter.get("/", requireAuth, listEnquiries);
enquiryRouter.patch("/:id", requireAuth, updateEnquiry);
enquiryRouter.delete("/:id", requireAuth, deleteEnquiry);
