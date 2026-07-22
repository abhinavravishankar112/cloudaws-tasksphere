const { prisma } = require('../config/database');
const AppError = require('../utils/AppError');

async function ensureDatabaseReady() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    throw new AppError('Database is not ready', 503);
  }
}

module.exports = {
  ensureDatabaseReady
};
