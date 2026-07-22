const asyncHandler = require('../utils/asyncHandler');
const healthService = require('../services/health.service');

function buildHealthResponse(mode) {
  return {
    success: true,
    status: 'ok',
    mode,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}

const live = asyncHandler(async (_req, res) => {
  res.status(200).json(buildHealthResponse('live'));
});

const ready = asyncHandler(async (_req, res) => {
  await healthService.ensureDatabaseReady();
  res.status(200).json({
    ...buildHealthResponse('ready'),
    database: 'connected'
  });
});

module.exports = {
  live,
  ready
};
