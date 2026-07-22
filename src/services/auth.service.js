const { prisma } = require('../config/database');
const AppError = require('../utils/AppError');
const { comparePassword, hashPassword } = require('../utils/password');
const { signAccessToken } = require('../utils/token');

function sanitizeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function registerUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword
    }
  });

  const token = signAccessToken({ sub: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token
  };
}

async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signAccessToken({ sub: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token
  };
}

module.exports = {
  registerUser,
  loginUser
};
