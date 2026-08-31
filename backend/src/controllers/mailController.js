import { MailLog } from "../models/MailLog.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields, isEmail, check } from "../utils/validate.js";
import { listTemplates, getTemplate } from "../emails/templates/index.js";
import { sendMail, retryMailLog, mailStatus } from "../services/mailer.js";
import { env } from "../config/env.js";

const STATUS_KEYS = ["queued", "sent", "failed", "skipped", "dry-run"];

function zeroedStatusCounts() {
  return Object.fromEntries(STATUS_KEYS.map((k) => [k, 0]));
}

// GET /api/mail/logs  (admin) — paginated delivery log, filterable by
// status/template plus free-text search across recipient/subject/template.
// `totals` is the status breakdown for the *current filter*, following the
// same pattern as GET /api/payments's `totals` block.
export const listMailLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const { status, template, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (template) filter.template = template;
  if (search) {
    filter.$or = [
      { to: new RegExp(search, "i") },
      { subject: new RegExp(search, "i") },
      { template: new RegExp(search, "i") },
    ];
  }

  const [items, total, statusAgg] = await Promise.all([
    MailLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      // The list view doesn't need the full rendered body — keeps the
      // payload small; GET /api/mail/logs/:id fetches it for the expanded view.
      .select("-html -text")
      .lean(),
    MailLog.countDocuments(filter),
    MailLog.aggregate([{ $match: filter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const totals = zeroedStatusCounts();
  for (const row of statusAgg) totals[row._id] = row.count;

  res.json({ items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), totals });
});

// GET /api/mail/logs/:id  (admin) — single row including the rendered
// html/text, for an "expand" view in the console.
export const getMailLog = asyncHandler(async (req, res) => {
  const row = await MailLog.findById(req.params.id).lean();
  if (!row) throw new ApiError(404, "Mail log entry not found");
  res.json(row);
});

// POST /api/mail/logs/:id/retry  (admin) — re-sends exactly what's stored
// on the row (see services/mailer.js#retryMailLog for why it doesn't
// re-render from the original booking/enquiry/subscriber).
export const retryMailLogRoute = asyncHandler(async (req, res) => {
  const exists = await MailLog.exists({ _id: req.params.id });
  if (!exists) throw new ApiError(404, "Mail log entry not found");

  const result = await retryMailLog(req.params.id);
  res.json(result);
});

// GET /api/mail/templates  (admin) — registry listing for the gallery.
export const listMailTemplates = asyncHandler(async (req, res) => {
  res.json({ items: listTemplates() });
});

// GET /api/mail/preview/:key  (admin) — renders a template against its own
// sample data. Default response is the raw HTML (dropped into a sandboxed
// iframe by the admin console); ?format=text or ?format=json for the other
// representations.
export const previewMailTemplate = asyncHandler(async (req, res) => {
  const tpl = getTemplate(req.params.key);
  if (!tpl) throw new ApiError(404, `Unknown template "${req.params.key}"`);

  const { subject, html, text } = tpl.build(tpl.sample());

  if (req.query.format === "text") {
    res.type("text/plain").send(text);
    return;
  }
  if (req.query.format === "json") {
    res.json({ subject, html, text });
    return;
  }
  res.type("text/html").send(html);
});

// POST /api/mail/test  (admin) — sends a real email for one template, using
// its own sample data, to an arbitrary address. No dedupeKey: a deliberate
// manual test must never be silently swallowed as a "duplicate" of a real
// send, and an admin should be able to fire it again on demand.
export const sendTestMail = asyncHandler(async (req, res) => {
  requireFields(req.body, ["template", "to"]);
  check(isEmail(req.body.to), "Enter a valid email address");

  const tpl = getTemplate(req.body.template);
  if (!tpl) throw new ApiError(404, `Unknown template "${req.body.template}"`);

  const result = await sendMail({ template: tpl.key, to: req.body.to, data: tpl.sample() });
  res.status(201).json(result);
});

// GET /api/mail/status  (admin) — SMTP health + 24h send counters for the
// console's summary cards.
export const getMailStatus = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const agg = await MailLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const last24h = zeroedStatusCounts();
  for (const row of agg) last24h[row._id] = row.count;

  res.json({
    ...mailStatus(),
    adminTo: env.mail.adminTo || env.mail.user,
    testTo: env.mail.testTo,
    last24h,
  });
});
