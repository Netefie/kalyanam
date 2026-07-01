import { Router } from "express";
import {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

export const blogRouter = Router();

// Public reads (optionalAuth lets admins add ?all=true for drafts).
blogRouter.get("/", optionalAuth, listBlogs);
blogRouter.get("/:slug", getBlog);

// Admin-only writes.
blogRouter.post("/", requireAuth, createBlog);
blogRouter.put("/:id", requireAuth, updateBlog);
blogRouter.delete("/:id", requireAuth, deleteBlog);
