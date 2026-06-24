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

// All user routes require authentication
router.use(authenticateToken);

/**
 * GET /api/user/dashboard
 * Returns user dashboard data: progress, session history, favorites, subscription info
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile
    const users = await dbExec(`SELECT * FROM users WHERE id = '${userId}'`);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = users[0];

    // Get session history
    let sessionHistory = [];
    try {
      sessionHistory = await dbExec(`SELECT * FROM session_history WHERE user_id = '${userId}' ORDER BY completed_at DESC`);
    } catch (e) {
      // Table may not exist yet — use empty array
      sessionHistory = [];
    }

    // Get favorites
    let favorites = [];
    try {
      favorites = await dbExec(`SELECT * FROM user_favorites WHERE user_id = '${userId}'`);
    } catch (e) {
      favorites = [];
    }

    // Calculate progress stats
    const totalSessions = sessionHistory.length;
    const uniqueModalities = [...new Set(sessionHistory.map(s => s.modality_id))];
    const totalMinutes = sessionHistory.reduce((sum, s) => sum + (parseInt(s.duration_minutes) || 0), 0);

    // Check trial status
    const trialEnd = new Date(user.trial_end);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
    const trialExpired = trialEnd < now && user.subscription_plan === 'trial';

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        ageSegment: user.age_segment,
        subscriptionPlan: user.subscription_plan,
        trialEnd: user.trial_end,
        trialExpired,
        daysLeft,
        createdAt: user.created_at
      },
      stats: {
        totalSessions,
        uniqueModalities: uniqueModalities.length,
        totalMinutes,
        currentStreak: 0, // Calculated from session history
      },
      sessionHistory,
      favorites: favorites.map(f => f.content_id)
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Server error loading dashboard.' });
  }
});

/**
 * POST /api/user/session/complete
 * Record a completed session in history
 */
router.post('/session/complete', async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId, modalityId, durationMinutes, completed } = req.body;

    if (!contentId || !modalityId) {
      return res.status(400).json({ error: 'contentId and modalityId are required.' });
    }

    const recordId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const duration = durationMinutes || 0;
    const completedAt = new Date().toISOString();

    await dbExec(`
      INSERT INTO session_history (id, user_id, content_id, modality_id, duration_minutes, completed_at)
      VALUES ('${recordId}', '${userId}', '${contentId}', '${modalityId}', ${duration}, '${completedAt}')
    `);

    res.status(201).json({ message: 'Session recorded.', recordId });
  } catch (err) {
    console.error('Session record error:', err);
    res.status(500).json({ error: 'Failed to record session.' });
  }
});

/**
 * POST /api/user/favorites/toggle
 * Toggle a content item as favorite
 */
router.post('/favorites/toggle', async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required.' });
    }

    // Check if already favorited
    const existing = await dbExec(`SELECT * FROM user_favorites WHERE user_id = '${userId}' AND content_id = '${contentId}'`);

    if (existing && existing.length > 0) {
      // Remove favorite
      await dbExec(`DELETE FROM user_favorites WHERE user_id = '${userId}' AND content_id = '${contentId}'`);
      res.json({ message: 'Removed from favorites.', isFavorite: false });
    } else {
      // Add favorite
      const favId = 'fav_' + Date.now();
      await dbExec(`INSERT INTO user_favorites (id, user_id, content_id, created_at) VALUES ('${favId}', '${userId}', '${contentId}', datetime('now'))`);
      res.status(201).json({ message: 'Added to favorites.', isFavorite: true });
    }
  } catch (err) {
    console.error('Favorites error:', err);
    res.status(500).json({ error: 'Failed to update favorites.' });
  }
});

/**
 * GET /api/user/subscription
 * Get subscription details and available plans
 */
router.get('/subscription', async (req, res) => {
  try {
    const users = await dbExec(`SELECT * FROM users WHERE id = '${req.user.id}'`);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = users[0];

    const plans = [
      { id: 'monthly', name: 'Monthly', price: 9.99, period: 'month', popular: false },
      { id: 'quarterly', name: '3 Months', price: 23.00, period: 'quarter', popular: false, savings: '23%' },
      { id: 'semi-annual', name: '6 Months', price: 42.00, period: '6 months', popular: true, savings: '30%' },
      { id: 'annual', name: '1 Year', price: 69.99, period: 'year', popular: false, savings: '42%' },
      { id: 'lifetime', name: 'Lifetime', price: 99.99, period: 'lifetime', popular: false, badge: 'Best Value' },
      { id: 'annual-renewal', name: 'Annual Renewal', price: 50.00, period: 'year', popular: false }
    ];

    const trialEnd = new Date(user.trial_end);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));

    res.json({
      currentPlan: user.subscription_plan,
      trialEnd: user.trial_end,
      daysLeft,
      isTrialing: user.subscription_plan === 'trial',
      trialExpired: trialEnd < now && user.subscription_plan === 'trial',
      availablePlans: plans
    });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/user/subscription/upgrade
 * Upgrade subscription plan (simulated — Stripe integration pending)
 */
router.post('/subscription/upgrade', async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required.' });
    }

    const validPlans = ['monthly', 'quarterly', 'semi-annual', 'annual', 'lifetime', 'annual-renewal'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan.' });
    }

    await dbExec(`UPDATE users SET subscription_plan = '${planId}' WHERE id = '${userId}'`);

    res.json({ message: `Subscription upgraded to ${planId}.`, plan: planId });
  } catch (err) {
    console.error('Upgrade error:', err);
    res.status(500).json({ error: 'Failed to upgrade subscription.' });
  }
});

module.exports = router;