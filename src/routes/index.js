const express = require('express');
const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const taskRoutes = require('./task.routes');
const { authenticateRequest } = require('../middleware/auth.middleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/tasks', authenticateRequest, taskRoutes);

module.exports = router;
