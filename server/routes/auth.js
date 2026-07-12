const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authenticateToken } = require('../middleware/auth');
const { sendEmail, getWelcomeHtml, getPasswordResetHtml } = require('../email');

const router = express.Router();
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

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
    // team-db returns JSON on stdout — may have trailing text
    const jsonStart = result.indexOf('[');
    const jsonEnd = result.lastIndexOf(']');
    if (jsonStart >= 0 && jsonEnd >= 0) {
      return JSON.parse(result.substring(jsonStart, jsonEnd + 1));
    }
    // Try object
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
 * POST /api/auth/signup
 * Creates a new user account with a 30-day free trial
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, ageSegment } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existing = await dbExec(`SELECT email FROM users WHERE email = '${email}'`);
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a simple UUID-like ID
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

    // Subscription plan: default to free trial (30 days)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    const trialEndStr = trialEnd.toISOString();

    // Insert user into team-db (the shared database)
    // Use a safe email (escape single quotes)
    const safeEmail = email.replace(/'/g, "''");
    const safeName = (fullName || '').replace(/'/g, "''");
    const safeAgeSegment = (ageSegment || '').replace(/'/g, "''");

    await dbExec(`
      INSERT INTO users (id, email, password_hash, full_name, age_segment, subscription_plan, trial_end, created_at)
      VALUES ('${userId}', '${safeEmail}', '${hashedPassword}', '${safeName}', '${safeAgeSegment}', 'trial', '${trialEndStr}', datetime('now'))
    `);

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email: safeEmail },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully! Your 30-day free trial has started.',
      token,
      user: {
        id: userId,
        email: safeEmail,
        fullName: safeName,
        ageSegment: safeAgeSegment,
        subscriptionPlan: 'trial',
        trialEnd: trialEndStr
      }
    });

    // Send welcome email (fire-and-forget, non-blocking)
    sendEmail({
      to: safeEmail,
      subject: 'Welcome to Ener-G-T-49 — Your 30-Day Trial Awaits',
      html: getWelcomeHtml({ name: safeName || safeEmail, ageSegment: safeAgeSegment }),
    }).then((result) => {
      if (result.success) {
        dbExec(`INSERT INTO email_logs (id, user_id, email_type, sent_at, status) VALUES ('email_${Date.now()}', '${userId}', 'welcome', datetime('now'), 'sent')`);
      }
    }).catch(() => {});
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const safeEmail = email.replace(/'/g, "''");
    const users = await dbExec(`SELECT * FROM users WHERE email = '${safeEmail}'`);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Check if trial has expired
    const trialEnd = new Date(user.trial_end);
    const now = new Date();
    const trialExpired = trialEnd < now && user.subscription_plan === 'trial';

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        ageSegment: user.age_segment,
        subscriptionPlan: user.subscription_plan,
        trialEnd: user.trial_end,
        trialExpired
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

/**
 * GET /api/auth/me
 * Returns the current user's profile
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await dbExec(`SELECT * FROM users WHERE id = '${req.user.id}'`);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = users[0];

    const trialEnd = new Date(user.trial_end);
    const now = new Date();
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
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Placeholder — in production, this would send a reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const safeEmail = email.replace(/'/g, "''");
    const users = await dbExec(`SELECT id FROM users WHERE email = '${safeEmail}'`);
    
    if (!users || users.length === 0) {
      // Don't reveal whether the email exists
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { id: users[0].id, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send password reset email (fire-and-forget)
    sendEmail({
      to: email,
      subject: 'Reset Your Ener-G-T-49 Password',
      html: getPasswordResetHtml({
        name: email,
        resetLink: `${PUBLIC_URL || req.protocol + '://' + req.hostname}/reset-password?token=${resetToken}`,
      }),
    }).catch(() => {});

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In dev mode, return the token for testing
      ...(process.env.NODE_ENV !== 'production' && { resetToken })
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using a valid reset token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbExec(`UPDATE users SET password_hash = '${hashedPassword}' WHERE id = '${decoded.id}'`);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired reset token.' });
  }
});

module.exports = router;