import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  listMailLogs,
  getMailLog,
  retryMailLogRoute,
  listMailTemplates,
  previewMailTemplate,
  sendTestMail,
  getMailStatus,
} from "../controllers/mailController.js";
import { requireAuth } from "../middleware/auth.js";

export const mailRouter = Router();

// Everything here is admin-only — the delivery log and templates expose
// guest PII (emails, names, messages) and let an admin trigger real sends.
mailRouter.use(requireAuth);

// A tighter limiter on top of app.js's global one, the same way
// /api/payments gets its own — sending mail is more expensive and more
// attractive to abuse (spamming an inbox) than a typical read endpoint.
const testSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many test sends, please try again later" },
});

mailRouter.get("/status", getMailStatus);
mailRouter.get("/templates", listMailTemplates);
mailRouter.get("/preview/:key", previewMailTemplate);
mailRouter.post("/test", testSendLimiter, sendTestMail);

mailRouter.get("/logs", listMailLogs);
mailRouter.get("/logs/:id", getMailLog);
mailRouter.post("/logs/:id/retry", retryMailLogRoute);
