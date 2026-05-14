const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { getPublicProfile, updateProfile, updateAvatar, updateBackground } = require('../controllers/profileController');

// Public profile (no auth)
router.get('/u/:username', getPublicProfile);

// Protected profile routes
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), updateAvatar);
router.post('/profile/background', authMiddleware, upload.single('background'), updateBackground);

module.exports = router;
