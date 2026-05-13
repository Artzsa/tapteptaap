const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { changePassword, updateAccount, deleteAccount } = require('../controllers/settingsController');

router.put('/settings/password', authMiddleware, changePassword);
router.put('/settings/account', authMiddleware, updateAccount);
router.delete('/settings/account', authMiddleware, deleteAccount);

module.exports = router;
