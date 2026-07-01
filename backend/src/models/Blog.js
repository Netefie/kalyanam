import mongoose from "mongoose";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Kalyanam" },
    tags: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

// Auto-derive a slug from the title when one isn't supplied, and stamp
// publishedAt the first time a post goes live.
blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Blog = mongoose.model("Blog", blogSchema);
