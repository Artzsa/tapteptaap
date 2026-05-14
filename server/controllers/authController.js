const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { validateUsername, validatePassword, validateName, normalizeUsername, normalizeName } = require('../middleware/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';

const register = async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = req.body?.password;
  const name = normalizeName(req.body?.name);
  
  const validationErrors = {};
  if (!validateUsername(username)) {
    validationErrors.username = 'Username harus 3-30 karakter dan hanya boleh huruf, angka, atau underscore (_).';
  }
  if (!validatePassword(password)) {
    validationErrors.password = 'Password harus 8-128 karakter.';
  }
  if (!validateName(name)) {
    validationErrors.name = 'Nama harus 2-80 karakter.';
  }

  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Data registrasi tidak valid',
      code: 'INVALID_REGISTER_PAYLOAD',
      details: validationErrors
    });
  }

  try {
    const row = await db.get("SELECT id FROM users WHERE username = $1", [username]);

    if (row) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken',
        code: 'USERNAME_TAKEN'
      });
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const bio = "Welcome to my VibeTape profile!";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      "INSERT INTO users (username, password, name, bio, avatar, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [username, hashedPassword, name, bio, avatar, ""]
    );

    const newUserId = result.rows[0].id;

    return res.json({
      success: true,
      message: "User registered successfully",
      user: { id: newUserId, username, name }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process registration',
      code: 'REGISTER_FAILED',
      details: err.message
    });
  }
};

const login = async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = req.body?.password;

  if (!validateUsername(username) || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid login payload',
      code: 'INVALID_LOGIN_PAYLOAD'
    });
  }

  try {
    const user = await db.get("SELECT id, username, name, password FROM users WHERE username = $1", [username]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    let isValidPassword = false;

    if (typeof user.password === 'string' && user.password.startsWith('$2')) {
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      isValidPassword = password === user.password;
      if (isValidPassword) {
        const migratedHash = await bcrypt.hash(password, 10);
        await db.run("UPDATE users SET password = $1 WHERE id = $2", [migratedHash, user.id]);
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process login',
      code: 'LOGIN_FAILED',
      details: err.message
    });
  }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  
  if (!username || typeof username !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Username is required',
      code: 'MISSING_USERNAME'
    });
  }

  try {
    const user = await db.get("SELECT id, username, name FROM users WHERE username = $1", [username.toLowerCase().trim()]);

    // Always return success to prevent username enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If the username exists, a reset link has been generated.'
      });
    }

    // Generate reset token (valid for 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Invalidate old tokens
    await db.run("UPDATE password_resets SET used = 1 WHERE user_id = $1 AND used = 0", [user.id]);

    // Insert new token
    await db.run(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    // In production, send email. For now, return token directly.
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
    console.log(`[Password Reset] Token for ${username}: ${token}`);

    return res.json({
      success: true,
      message: 'If the username exists, a reset link has been generated.',
      // In development, return the token so user can reset
      ...(process.env.NODE_ENV !== 'production' && { resetToken: token, resetUrl })
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request',
      code: 'FORGOT_PASSWORD_FAILED'
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Reset token is required',
      code: 'MISSING_TOKEN'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({
      success: false,
      error: 'Password must be 8-128 characters',
      code: 'INVALID_PASSWORD'
    });
  }

  try {
    // Find valid token
    const resetRecord = await db.get(
      "SELECT id, user_id, expires_at, used FROM password_resets WHERE token = $1",
      [token]
    );

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token',
        code: 'INVALID_TOKEN'
      });
    }

    if (resetRecord.used === 1) {
      return res.status(400).json({
        success: false,
        error: 'Reset token has already been used',
        code: 'TOKEN_USED'
      });
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Reset token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and mark token as used
    await db.run("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, resetRecord.user_id]);
    await db.run("UPDATE password_resets SET used = 1 WHERE id = $1", [resetRecord.id]);

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      code: 'RESET_PASSWORD_FAILED'
    });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
