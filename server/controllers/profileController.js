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
    const user = await db.get(
      "SELECT id, name, username, bio, location, avatar, tags, email, phone, theme, bg_type, bg_value FROM users WHERE username = $1",
      [username]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const links = await db.all(
      "SELECT id, platform, url FROM links WHERE user_id = $1 ORDER BY id ASC",
      [user.id]
    );

    // Track view (fire and forget)
    if (req.query.noTrack !== 'true') {
      db.run(
        "INSERT INTO profile_views (user_id, viewer_ip, viewer_user_agent) VALUES ($1, $2, $3)",
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
    const result = await db.run(
      `UPDATE users SET name = $1, bio = $2, location = $3, tags = $4, email = $5, phone = $6, theme = $7, bg_type = $8, bg_value = $9 WHERE username = $10`,
      [name, bio, location, tagsString, email, phone, theme, bg_type, bg_value, username]
    );

    if (result.rowCount === 0) {
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
    await db.run(
      "UPDATE users SET avatar = $1 WHERE username = $2",
      [avatarUrl, username]
    );

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
    await db.run(
      "UPDATE users SET bg_type = $1, bg_value = $2 WHERE username = $3",
      ['image', bgUrl, username]
    );

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
