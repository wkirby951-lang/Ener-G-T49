const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * Helper: execute team-db SQL and parse JSON response
 */
async function dbExec(sql) {
  const { execSync } = require('child_process');
  try {
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { 
      encoding: 'utf-8',
      timeout: 10000
    });
    const jsonStart = result.indexOf('[');
    const jsonEnd = result.lastIndexOf(']');
    if (jsonStart >= 0 && jsonEnd >= 0) {
      return JSON.parse(result.substring(jsonStart, jsonEnd + 1));
    }
    const objStart = result.indexOf('{');
    const objEnd = result.lastIndexOf('}');
    if (objStart >= 0 && objEnd >= 0) {
      return JSON.parse(result.substring(objStart, objEnd + 1));
    }
    return [];
  } catch (err) {
    console.error('DB Error:', err.message);
    return [];
  }
}

/**
 * POST /api/analytics/track
 * Log an analytics event. Public endpoint for page views, auth optional for user events.
 * Body: { eventName, eventData, pageUrl, sessionId }
 */
router.post('/track', async (req, res) => {
  try {
    const { eventName, eventData, pageUrl, sessionId } = req.body;
    if (!eventName) {
      return res.status(400).json({ error: 'eventName is required.' });
    }

    const eventId = 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const userId = req.user?.id || 'anonymous';
    const userAgent = req.headers['user-agent'] || '';
    const timestamp = new Date().toISOString();
    const safeEventName = eventName.replace(/'/g, "''");
    const safeEventData = JSON.stringify(eventData || {}).replace(/'/g, "''");
    const safePageUrl = (pageUrl || '').replace(/'/g, "''");
    const safeSessionId = (sessionId || '').replace(/'/g, "''");
    const safeUserAgent = userAgent.replace(/'/g, "''");

    await dbExec(`
      INSERT INTO analytics_events (id, user_id, event_name, event_data, session_id, page_url, user_agent, timestamp)
      VALUES ('${eventId}', '${userId}', '${safeEventName}', '${safeEventData}', '${safeSessionId}', '${safePageUrl}', '${safeUserAgent}', '${timestamp}')
    `);

    res.status(201).json({ message: 'Event tracked.', eventId });
  } catch (err) {
    console.error('Analytics track error:', err);
    res.status(500).json({ error: 'Failed to track event.' });
  }
});

/**
 * GET /api/analytics/summary
 * Returns aggregate analytics summary (auth required for now)
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    // Total users
    const users = await dbExec('SELECT COUNT(*) as total FROM users');
    const totalUsers = users[0]?.total || 0;

    // Active users today (from analytics events)
    const today = new Date().toISOString().split('T')[0];
    const activeToday = await dbExec(`
      SELECT COUNT(DISTINCT user_id) as count FROM analytics_events 
      WHERE timestamp LIKE '${today}%' AND user_id != 'anonymous'
    `);
    const activeUsersToday = activeToday[0]?.count || 0;

    // Sessions this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const sessionsThisWeek = await dbExec(`
      SELECT COUNT(*) as count FROM session_history 
      WHERE completed_at >= '${weekAgo}'
    `);
    const weeklySessions = sessionsThisWeek[0]?.count || 0;

    // Top modalities
    const topModalities = await dbExec(`
      SELECT modality_id, COUNT(*) as count FROM session_history 
      GROUP BY modality_id ORDER BY count DESC LIMIT 5
    `);

    // Average session duration
    const avgDuration = await dbExec(`
      SELECT AVG(duration_minutes) as avg FROM session_history
    `);
    const averageDuration = Math.round((avgDuration[0]?.avg || 0) * 10) / 10;

    // Conversion rate (users who upgraded from trial)
    const paidUsers = await dbExec(`
      SELECT COUNT(*) as count FROM users WHERE subscription_plan != 'trial'
    `);
    const conversionRate = totalUsers > 0 
      ? Math.round((paidUsers[0]?.count || 0) / totalUsers * 100 * 10) / 10 
      : 0;

    // Recent events (last 50)
    const recentEvents = await dbExec(`
      SELECT event_name, COUNT(*) as count FROM analytics_events 
      GROUP BY event_name ORDER BY count DESC
    `);

    res.json({
      summary: {
        totalUsers,
        activeUsersToday,
        weeklySessions,
        averageDurationMinutes: averageDuration,
        conversionRate: conversionRate + '%',
        topModalities: topModalities || [],
        eventBreakdown: recentEvents || [],
      }
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ error: 'Failed to load analytics summary.' });
  }
});

module.exports = router;