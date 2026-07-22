const prisma = require('../models/prisma/client');

async function connectDatabase() {
  await prisma.$connect();
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
};
