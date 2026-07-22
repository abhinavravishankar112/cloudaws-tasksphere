const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/token');

function authenticateRequest(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authorization token is required', 401));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email
    };
    return next();
  } catch (_error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

module.exports = {
  authenticateRequest
};
