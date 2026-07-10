const express = require('express');
const router = express.Router();

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
 * POST /api/newsletter
 * Subscribe an email to the newsletter
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    // Check if already subscribed
    const existing = await dbExec(`SELECT * FROM newsletter_subscribers WHERE email = '${email}'`);
    if (existing && existing.length > 0) {
      return res.json({ message: 'Already subscribed!', subscribed: true });
    }

    const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const createdAt = new Date().toISOString();

    // Create the table if it doesn't exist
    await dbExec(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);

    await dbExec(`INSERT INTO newsletter_subscribers (id, email, created_at) VALUES ('${id}', '${email}', '${createdAt}')`);

    res.status(201).json({ message: 'Successfully subscribed!', subscribed: true });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

module.exports = router;