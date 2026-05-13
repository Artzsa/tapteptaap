const db = require('../db');
const { validateUsername, validateName, validateEmail, validatePhone, normalizeUsername, normalizeProfilePayload } = require('../middleware/validators');

const getPublicProfile = async (req, res) => {
  const username = normalizeUsername(req.params.username);
  if (!validateUsername(username)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid username format',
      code: 'INVALID_USERNAME'
    });
  }
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, name, username, bio, location, avatar, tags, email, phone, theme, bg_type, bg_value FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const links = await new Promise((resolve, reject) => {
      db.all(
        "SELECT id, platform, url FROM links WHERE user_id = ? ORDER BY id ASC",
        [user.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Track view (fire and forget)
    if (req.query.noTrack !== 'true') {
      db.run(
        "INSERT INTO profile_views (user_id, viewer_ip, viewer_user_agent) VALUES (?, ?, ?)",
        [user.id, req.ip || '', req.get('user-agent') || '']
      );
    }

    user.tags = user.tags ? user.tags.split(',') : [];
    user.links = links || [];
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to load user profile',
      code: 'DB_READ_FAILED'
    });
  }
};

const updateProfile = async (req, res) => {
  const username = req.user.username;
  const profile = normalizeProfilePayload(req.body);
  const { name, bio, location, email, phone, tags: tagsArray, theme, bg_type, bg_value } = profile;
  const tagsString = tagsArray.join(',');

  if (!validateName(name)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid name format',
      code: 'INVALID_NAME'
    });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
      code: 'INVALID_EMAIL'
    });
  }
  if (!validatePhone(phone)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone format',
      code: 'INVALID_PHONE'
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET name = ?, bio = ?, location = ?, tags = ?, email = ?, phone = ?, theme = ?, bg_type = ?, bg_value = ? WHERE username = ?`,
        [name, bio, location, tagsString, email, phone, theme, bg_type, bg_value, username],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file uploaded',
      code: 'NO_FILE_UPLOADED'
    });
  }

  const username = req.user.username;
  const avatarUrl = `/uploads/${req.file.filename}`;

  try {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET avatar = ? WHERE username = ?",
        [avatarUrl, username],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    console.error('Update avatar error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update avatar',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const updateBackground = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file uploaded',
      code: 'NO_FILE_UPLOADED'
    });
  }

  const username = req.user.username;
  const bgUrl = `/uploads/${req.file.filename}`;

  try {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET bg_type = ?, bg_value = ? WHERE username = ?",
        ['image', bgUrl, username],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ success: true, bg_type: 'image', bg_value: bgUrl });
  } catch (err) {
    console.error('Update background error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update background',
      code: 'DB_WRITE_FAILED'
    });
  }
};

module.exports = { getPublicProfile, updateProfile, updateAvatar, updateBackground };
