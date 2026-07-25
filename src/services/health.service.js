const { prisma } = require('../config/database');
const AppError = require('../utils/AppError');

async function ensureDatabaseReady() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  ensureDatabaseReady
};
