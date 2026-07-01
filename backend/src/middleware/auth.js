import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/token.js";

// Stateless JWT guard — no session store to run or pay for. Attaches the
// decoded admin payload to `req.admin`.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    req.admin = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

// Populates `req.admin` when a valid token is present but never rejects the
// request. Lets a single public endpoint return richer data to admins.
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.admin = verifyToken(token);
    } catch {
      // Ignore an invalid token on optional routes — treat as anonymous.
    }
  }
  next();
}
