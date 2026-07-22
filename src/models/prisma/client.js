const { PrismaClient } = require('@prisma/client');
const env = require('../../config/env');

const prisma = globalThis.prisma || new PrismaClient({
  log: env.nodeEnv === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error']
});

if (env.nodeEnv !== 'production') {
  globalThis.prisma = prisma;
}

module.exports = prisma;
