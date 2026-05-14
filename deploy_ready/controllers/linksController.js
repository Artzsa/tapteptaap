const db = require('../db');
const { normalizeLinksPayload, isValidHttpUrl, ALLOWED_PLATFORMS, MAX_LINKS } = require('../middleware/validators');

const updateLinks = async (req, res) => {
  const { links } = req.body;
  const username = req.user.username;

  if (!Array.isArray(links)) {
    return res.status(400).json({
      success: false,
      error: 'Links payload must be an array',
      code: 'INVALID_LINKS'
    });
  }
  if (links.length > MAX_LINKS) {
    return res.status(400).json({
      success: false,
      error: `Maximum ${MAX_LINKS} links are allowed`,
      code: 'TOO_MANY_LINKS'
    });
  }

  const normalizedLinks = normalizeLinksPayload(links);
  const hasBlankEntry = normalizedLinks.some((link) => !link.platform || !link.url);
  if (hasBlankEntry) {
    return res.status(400).json({
      success: false,
      error: 'Each link must include platform and url',
      code: 'INVALID_LINKS'
    });
  }
  const hasUnsupportedPlatform = normalizedLinks.some((link) => !ALLOWED_PLATFORMS.has(link.platform));
  if (hasUnsupportedPlatform) {
    return res.status(400).json({
      success: false,
      error: 'One or more links use unsupported platform',
      code: 'UNSUPPORTED_PLATFORM'
    });
  }
  const hasInvalidUrl = normalizedLinks.some((link) => !isValidHttpUrl(link.url));
  if (hasInvalidUrl) {
    return res.status(400).json({
      success: false,
      error: 'One or more links contain invalid URL',
      code: 'INVALID_LINK_URL'
    });
  }

  const dedupedLinks = normalizedLinks.filter((link, index, arr) =>
    arr.findIndex((candidate) => candidate.platform === link.platform && candidate.url === link.url) === index
  );

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM users WHERE username = ?", [username], (err, row) => {
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

    await new Promise((resolve, reject) => {
      db.run("DELETE FROM links WHERE user_id = ?", [user.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (dedupedLinks.length === 0) {
      return res.json({ success: true });
    }

    const placeholders = dedupedLinks.map(() => "(?, ?, ?)").join(", ");
    const values = [];
    dedupedLinks.forEach(link => {
      values.push(user.id, link.platform, link.url);
    });

    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO links (user_id, platform, url) VALUES ${placeholders}`, values, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update links error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update links',
      code: 'DB_WRITE_FAILED'
    });
  }
};

module.exports = { updateLinks };
