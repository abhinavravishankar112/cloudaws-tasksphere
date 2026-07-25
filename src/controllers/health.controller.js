const asyncHandler = require('../utils/asyncHandler');
const healthService = require('../services/health.service');

function buildHealthResponse(mode) {
  return {
    success: true,
    status: 'ok',
    message: 'API connected successfully',
    mode,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}

const live = asyncHandler(async (_req, res) => {
  res.status(200).json(buildHealthResponse('live'));
});

const ready = asyncHandler(async (_req, res) => {
  const isDbReady = await healthService.ensureDatabaseReady();
  res.status(200).json({
    ...buildHealthResponse('ready'),
    database: isDbReady ? 'connected' : 'disconnected'
  });
});

module.exports = {
  live,
  ready
};
