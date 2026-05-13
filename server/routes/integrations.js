const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getIntegrations, connectIntegration, disconnectIntegration } = require('../controllers/integrationsController');

router.get('/integrations', authMiddleware, getIntegrations);
router.post('/integrations/connect', authMiddleware, connectIntegration);
router.post('/integrations/disconnect', authMiddleware, disconnectIntegration);

module.exports = router;
