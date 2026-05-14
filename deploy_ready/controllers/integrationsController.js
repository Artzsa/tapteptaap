const db = require('../db');

const AVAILABLE_PLATFORMS = [
  'Google Analytics',
  'Facebook Pixel',
  'Twitter/X',
  'Discord Webhook',
  'Slack',
  'Telegram Bot'
];

const getIntegrations = async (req, res) => {
  const userId = req.user.id;

  try {
    const integrations = await new Promise((resolve, reject) => {
      db.all(
        "SELECT id, platform, connected, api_key, webhook_url, created_at FROM integrations WHERE user_id = ? ORDER BY platform ASC",
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Merge with available platforms
    const result = AVAILABLE_PLATFORMS.map(platform => {
      const existing = integrations.find(i => i.platform === platform);
      return existing || {
        id: null,
        platform,
        connected: 0,
        api_key: null,
        webhook_url: null,
        created_at: null
      };
    });

    res.json({ success: true, integrations: result });
  } catch (err) {
    console.error('Get integrations error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to load integrations',
      code: 'DB_READ_FAILED'
    });
  }
};

const connectIntegration = async (req, res) => {
  const userId = req.user.id;
  const { platform, api_key, webhook_url } = req.body;

  if (!platform) {
    return res.status(400).json({
      success: false,
      error: 'Platform is required',
      code: 'MISSING_PLATFORM'
    });
  }

  if (!AVAILABLE_PLATFORMS.includes(platform)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid platform',
      code: 'INVALID_PLATFORM'
    });
  }

  try {
    // Check if already exists
    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM integrations WHERE user_id = ? AND platform = ?",
        [userId, platform],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existing) {
      // Update existing
      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE integrations SET connected = 1, api_key = ?, webhook_url = ? WHERE user_id = ? AND platform = ?",
          [api_key || null, webhook_url || null, userId, platform],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else {
      // Create new
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO integrations (user_id, platform, connected, api_key, webhook_url) VALUES (?, ?, 1, ?, ?)",
          [userId, platform, api_key || null, webhook_url || null],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.json({ success: true, message: `${platform} connected successfully` });
  } catch (err) {
    console.error('Connect integration error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to connect integration',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const disconnectIntegration = async (req, res) => {
  const userId = req.user.id;
  const { platform } = req.body;

  if (!platform) {
    return res.status(400).json({
      success: false,
      error: 'Platform is required',
      code: 'MISSING_PLATFORM'
    });
  }

  try {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE integrations SET connected = 0, api_key = NULL, webhook_url = NULL WHERE user_id = ? AND platform = ?",
        [userId, platform],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ success: true, message: `${platform} disconnected successfully` });
  } catch (err) {
    console.error('Disconnect integration error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect integration',
      code: 'DB_WRITE_FAILED'
    });
  }
};

module.exports = { getIntegrations, connectIntegration, disconnectIntegration };
