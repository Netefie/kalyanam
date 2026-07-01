import { Blog } from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/blogs           (public) — published posts, paginated
// GET /api/blogs?all=true  (admin)  — includes drafts
export const listBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const includeDrafts = req.query.all === "true" && req.admin;
  const filter = includeDrafts ? {} : { status: "published" };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

// GET /api/blogs/:slug  (public)
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).lean();
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json(blog);
});

// POST /api/blogs  (admin)
export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
});

// PUT /api/blogs/:id  (admin)
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  // Assign then save (rather than findByIdAndUpdate) so the pre-validate
  // hook handles slug/publishedAt on status changes.
  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
});

// DELETE /api/blogs/:id  (admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json({ success: true });
});
