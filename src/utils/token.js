const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(payload) {
  if (!env.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function verifyAccessToken(token) {
  if (!env.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
