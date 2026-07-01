import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me, changePassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

// Tight limiter on login specifically to blunt brute-force attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

authRouter.post("/login", loginLimiter, login);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/password", requireAuth, changePassword);
