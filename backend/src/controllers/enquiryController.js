import { Enquiry } from "../models/Enquiry.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/enquiries  (public) — reservation popup + contact form.
export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(enquiry);
});

// GET /api/enquiries  (protected) — paginated list for the admin.
export const listEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const { type, status } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

// PATCH /api/enquiries/:id  (protected) — update status.
export const updateEnquiry = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  res.json(enquiry);
});

// DELETE /api/enquiries/:id  (protected)
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  res.json({ success: true });
});
