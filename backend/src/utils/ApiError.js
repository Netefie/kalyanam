// Lightweight typed error so controllers can throw meaningful HTTP statuses
// (e.g. `throw new ApiError(404, "Room not found")`) and the central error
// handler can turn them into clean JSON responses.
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
