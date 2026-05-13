const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { updateLinks } = require('../controllers/linksController');

router.post('/profile/links', authMiddleware, updateLinks);

module.exports = router;
