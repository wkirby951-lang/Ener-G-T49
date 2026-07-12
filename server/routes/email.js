const express = require('express');
const router = express.Router();
const { sendEmail, getWelcomeHtml, getTrialReminderHtml, getPasswordResetHtml, getPurchaseThankYouHtml } = require('../email');
const { authenticateToken } = require('../middleware/auth');

// ─── Helper: Execute team-db ──────────────────────────────
function dbExec(sql) {
  const { execSync } = require('child_process');
  try {
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf-8', timeout: 10000 });
    const jsonStart = result.indexOf('[');
    const jsonEnd = result.lastIndexOf(']');
    if (jsonStart >= 0 && jsonEnd >= 0) return JSON.parse(result.substring(jsonStart, jsonEnd + 1));
    const objStart = result.indexOf('{');
    const objEnd = result.lastIndexOf('}');
    if (objStart >= 0 && objEnd >= 0) return JSON.parse(result.substring(objStart, objEnd + 1));
    return [];
  } catch (err) {
    return [];
  }
}

function dbExecSingle(sql) {
  const { execSync } = require('child_process');
  try {
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf-8', timeout: 10000 });
    return result;
  } catch (err) {
    return '';
  }
}

// ─── POST /api/email/welcome ──────────────────────────────
router.post('/welcome', authenticateToken, async (req, res) => {
  try {
    const { email, name, ageSegment } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required.' });

    const html = getWelcomeHtml({ name: name || 'there', ageSegment: ageSegment || 'adults' });
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Ener-G-T-49 — Your 30-Day Trial Awaits',
      html,
    });

    if (result.success) {
      logEmail(req.user.id, 'welcome', result.messageId);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/email/trial-reminder ───────────────────────
router.post('/trial-reminder', authenticateToken, async (req, res) => {
  try {
    const { email, name, daysLeft } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required.' });

    const html = getTrialReminderHtml({ name: name || 'there', daysLeft: daysLeft || 5 });
    const result = await sendEmail({
      to: email,
      subject: daysLeft <= 1
        ? '⏰ Your Ener-G-T-49 trial ends tomorrow!'
        : `⏰ Your Ener-G-T-49 trial ends in ${daysLeft} days`,
      html,
    });

    if (result.success) {
      logEmail(req.user.id, `trial-reminder-${daysLeft}`, result.messageId);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/email/password-reset (admin endpoint) ──────
router.post('/password-reset', async (req, res) => {
  try {
    const { email, name, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Email and token required.' });

    const resetLink = `${req.protocol}://${req.hostname}/reset-password?token=${token}`;
    const html = getPasswordResetHtml({ name: name || 'there', resetLink });
    const result = await sendEmail({
      to: email,
      subject: 'Reset Your Ener-G-T-49 Password',
      html,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/email/post-purchase ────────────────────────
router.post('/post-purchase', authenticateToken, async (req, res) => {
  try {
    const { email, name, plan } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required.' });

    const html = getPurchaseThankYouHtml({ name: name || 'there', plan: plan || 'monthly' });
    const result = await sendEmail({
      to: email,
      subject: '🎉 Welcome to Ener-G-T-49 Premium — Your Subscription is Active!',
      html,
    });

    if (result.success) {
      logEmail(req.user.id, 'purchase-thankyou', result.messageId);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/email/check-trial-reminders ─────────────────
// Scheduled endpoint: checks all trial users and sends reminders
router.get('/check-trial-reminders', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const reminders = [];

    // Find users whose trial is ending in ~5 days or ~1 day
    const users = dbExec("SELECT id, email, name, age_segment, created_at, subscription_plan FROM users WHERE subscription_plan = 'trial'");

    for (const user of (users || [])) {
      const createdDate = new Date(user.created_at);
      const trialEnd = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));

      if (daysLeft === 5 || daysLeft === 1) {
        const html = getTrialReminderHtml({ name: user.name || user.email, daysLeft });
        const result = await sendEmail({
          to: user.email,
          subject: daysLeft === 1 ? '⏰ Your trial ends tomorrow!' : `⏰ Your trial ends in ${daysLeft} days`,
          html,
        });
        if (result.success) {
          logEmail(user.id, `trial-reminder-${daysLeft}`, result.messageId);
          reminders.push({ userId: user.id, daysLeft });
        }
      }
    }

    res.json({ checked: (users || []).length, remindersSent: reminders.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Helper: Log email to DB ──────────────────────────────
function logEmail(userId, type, messageId) {
  const id = 'email_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const safeUserId = (userId || '').replace(/'/g, "''");
  const safeType = type.replace(/'/g, "''");
  const now = new Date().toISOString();
  dbExecSingle(`INSERT INTO email_logs (id, user_id, email_type, sent_at, status) VALUES ('${id}', '${safeUserId}', '${safeType}', '${now}', 'sent')`);
}

module.exports = router;