import { Settings } from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const KEY = "site";

// GET /api/settings  (public) — always returns a document, creating the
// defaults on first access so the site never has to handle a missing config.
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ key: KEY });
  if (!settings) settings = await Settings.create({ key: KEY });
  res.json(settings);
});

// PUT /api/settings  (admin) — upsert the singleton.
export const updateSettings = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  delete update.key; // the singleton key is immutable

  const settings = await Settings.findOneAndUpdate(
    { key: KEY },
    { $set: update },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(settings);
});
