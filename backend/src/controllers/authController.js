import { Admin } from "../models/Admin.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // passwordHash is select:false on the schema, so pull it in explicitly.
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );

  // Same generic message whether the email or password is wrong, so we don't
  // reveal which accounts exist.
  const ok = admin && (await admin.comparePassword(password));
  if (!ok) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ sub: admin._id.toString(), role: admin.role });

  res.json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// GET /api/auth/me  (protected)
export const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.sub).lean();
  if (!admin) throw new ApiError(404, "Admin not found");
  res.json({ id: admin._id, name: admin.name, email: admin.email, role: admin.role });
});

// PATCH /api/auth/password  (protected) — change own password.
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }
  if (String(newPassword).length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  const admin = await Admin.findById(req.admin.sub).select("+passwordHash");
  if (!admin) throw new ApiError(404, "Admin not found");

  const ok = await admin.comparePassword(currentPassword);
  if (!ok) throw new ApiError(401, "Current password is incorrect");

  admin.password = newPassword; // hashed by the pre-validate hook
  await admin.save();

  res.json({ success: true });
});
