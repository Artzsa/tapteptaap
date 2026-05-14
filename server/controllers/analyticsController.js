const db = require('../db');
const { validateUsername, normalizeUsername, sanitizeText, isValidHttpUrl, ALLOWED_PLATFORMS } = require('../middleware/validators');

const formatTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.abs(pct).toFixed(1);
  return `${pct >= 0 ? '+' : '-'}${rounded}%`;
};

const trackClick = async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const platform = sanitizeText(req.body?.platform, 30);
  const url = sanitizeText(req.body?.url, 500);
  const source = sanitizeText(req.body?.source, 50) || 'public_profile';

  if (!validateUsername(username)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid username format',
      code: 'INVALID_USERNAME'
    });
  }
  if (!platform || !ALLOWED_PLATFORMS.has(platform)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported platform',
      code: 'UNSUPPORTED_PLATFORM'
    });
  }
  if (!isValidHttpUrl(url)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format',
      code: 'INVALID_LINK_URL'
    });
  }

  try {
    const user = await db.get("SELECT id FROM users WHERE username = $1", [username]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    await db.run(
      "INSERT INTO link_clicks (user_id, platform, url, source) VALUES ($1, $2, $3, $4)",
      [user.id, platform, url, source]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Track click error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record click',
      code: 'DB_WRITE_FAILED'
    });
  }
};

const getAnalytics = async (req, res) => {
  const username = req.user.username;
  const days = Number(req.query.days) > 0 ? Math.min(Number(req.query.days), 90) : 30;

  try {
    const user = await db.get("SELECT id FROM users WHERE username = $1", [username]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const userId = user.id;

    // Run all analytics queries in parallel
    const [
      viewsCurrent,
      viewsPrevious,
      clicksCurrent,
      clicksPrevious,
      uniqueCurrent,
      uniquePrevious,
      topLinksRows,
      timelineRows,
      recentRows
    ] = await Promise.all([
      // Current period views
      db.get(
        `SELECT COUNT(*) as count FROM profile_views WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Previous period views
      db.get(
        `SELECT COUNT(*) as count FROM profile_views WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '${days * 2} days' AND viewed_at < NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Current period clicks
      db.get(
        `SELECT COUNT(*) as count FROM link_clicks WHERE user_id = $1 AND clicked_at >= NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Previous period clicks
      db.get(
        `SELECT COUNT(*) as count FROM link_clicks WHERE user_id = $1 AND clicked_at >= NOW() - INTERVAL '${days * 2} days' AND clicked_at < NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Current period unique visitors
      db.get(
        `SELECT COUNT(DISTINCT viewer_ip) as count FROM profile_views WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Previous period unique visitors
      db.get(
        `SELECT COUNT(DISTINCT viewer_ip) as count FROM profile_views WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '${days * 2} days' AND viewed_at < NOW() - INTERVAL '${days} days'`,
        [userId]
      ),
      // Top links
      db.all(
        `SELECT platform, COUNT(*) as clicks
         FROM link_clicks
         WHERE user_id = $1 AND clicked_at >= NOW() - INTERVAL '${days} days'
         GROUP BY platform
         ORDER BY clicks DESC
         LIMIT 5`,
        [userId]
      ),
      // Timeline
      db.all(
        `SELECT CAST(viewed_at AS DATE) as day, COUNT(*) as views
         FROM profile_views
         WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '${days} days'
         GROUP BY day
         ORDER BY day ASC`,
        [userId]
      ),
      // Recent activity
      db.all(
        `SELECT platform, source, clicked_at
         FROM link_clicks
         WHERE user_id = $1 AND clicked_at >= NOW() - INTERVAL '${days} days'
         ORDER BY clicked_at DESC
         LIMIT 10`,
        [userId]
      )
    ]);

    const totalViews = Number(viewsCurrent.count || 0);
    const totalClicks = Number(clicksCurrent.count || 0);
    const uniqueVisitors = Number(uniqueCurrent.count || 0);
    const clickRate = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    return res.json({
      success: true,
      periodDays: days,
      stats: {
        totalViews,
        totalClicks,
        uniqueVisitors,
        clickRate
      },
      trends: {
        totalViews: formatTrend(totalViews, Number(viewsPrevious.count || 0)),
        totalClicks: formatTrend(totalClicks, Number(clicksPrevious.count || 0)),
        uniqueVisitors: formatTrend(uniqueVisitors, Number(uniquePrevious.count || 0)),
        clickRate: `${clickRate}%`
      },
      topLinks: (topLinksRows || []).map((row) => ({
        platform: row.platform,
        clicks: Number(row.clicks || 0)
      })),
      timeline: (timelineRows || []).map((row) => ({
        day: row.day,
        views: Number(row.views || 0)
      })),
      recentActivity: (recentRows || []).map((row) => ({
        platform: row.platform,
        source: row.source || 'unknown',
        clickedAt: row.clicked_at
      }))
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to load analytics',
      code: 'DB_READ_FAILED'
    });
  }
};

module.exports = { trackClick, getAnalytics };
