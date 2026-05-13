const db = require('../db');
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required',
      code: 'MISSING_FIELDS'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters',
      code: 'WEAK_PASSWORD'
    });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT password FROM users WHERE username = ?", [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
        code: 'WRONG_PASSWORD'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await new Promise((resolve, reject) => {
      db.run("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const updateAccount = async (req, res) => {
  const { email, name } = req.body;
  const username = req.user.username;

  try {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET email = ?, name = ? WHERE username = ?",
        [email, name, username],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ success: true, message: 'Account updated successfully' });
  } catch (err) {
    console.error('Update account error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update account',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const username = req.user.username;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required to delete account',
      code: 'MISSING_PASSWORD'
    });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT id, password FROM users WHERE username = ?", [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Password is incorrect',
        code: 'WRONG_PASSWORD'
      });
    }

    const userId = user.id;

    // Delete all related data
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM links WHERE user_id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM profile_views WHERE user_id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM link_clicks WHERE user_id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM password_resets WHERE user_id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM integrations WHERE user_id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      code: 'DB_WRITE_FAILED'
    });
  }
};

module.exports = { changePassword, updateAccount, deleteAccount };
