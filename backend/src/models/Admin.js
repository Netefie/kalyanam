import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Never selected by default so the hash can't leak through generic reads.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

// Convenience: set `admin.password = "..."` and it gets hashed on save.
adminSchema.virtual("password").set(function (value) {
  this._plainPassword = value;
});

// Hash on `validate` (which Mongoose runs *before* `save`) so the required
// passwordHash is populated by the time validation checks it.
adminSchema.pre("validate", async function (next) {
  if (!this._plainPassword) return next();
  this.passwordHash = await bcrypt.hash(this._plainPassword, 10);
  this._plainPassword = undefined;
  next();
});

adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const Admin = mongoose.model("Admin", adminSchema);
