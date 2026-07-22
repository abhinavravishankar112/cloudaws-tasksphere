const logger = require('../config/logger');

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(message, {
    statusCode,
    method: req.method,
    path: req.originalUrl,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
