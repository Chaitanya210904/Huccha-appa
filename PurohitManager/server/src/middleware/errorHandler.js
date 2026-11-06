import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error on ${req.method} ${req.url}: ${err.message}`);

  // Return clean, priest-friendly JSON response without ugly stack traces
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "An unexpected error occurred. Please try again."
  });
}

