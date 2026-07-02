import { Subscriber } from "../models/Subscriber.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields, isEmail, check } from "../utils/validate.js";

// POST /api/subscribers  (public) — from the "exclusive offers" popup.
// Upsert by email so re-subscribing just refreshes details instead of erroring.
export const createSubscriber = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email"]);
  check(isEmail(req.body.email), "A valid email address is required");

  const email = req.body.email.toLowerCase();
  const { name = "", phone = "", source } = req.body;

  const subscriber = await Subscriber.findOneAndUpdate(
    { email },
    { $set: { name, phone, ...(source ? { source } : {}) }, $setOnInsert: { email } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, subscriber });
});

// GET /api/subscribers  (admin) — paginated list.
export const listSubscribers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));

  const [items, total] = await Promise.all([
    Subscriber.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Subscriber.countDocuments(),
  ]);

  res.json({ items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});
