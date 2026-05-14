const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { trackClick, getAnalytics } = require('../controllers/analyticsController');

// Public click tracking
router.post('/analytics/click', trackClick);

// Protected analytics
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
