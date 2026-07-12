/**
 * Email service for Ener-G-T-49.
 * Uses a transactional email provider (Resend/SendGrid/Postmark) via HTTP API.
 * Falls back to console.log when no API key is configured (dev mode).
 * Configure with EMAIL_API_KEY and EMAIL_FROM environment variables.
 */

const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@ener-g-t-49.com';
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';
const APP_NAME = 'Ener-G-T-49';

/**
 * Send an email via the configured provider.
 * @param {object} params - { to, subject, html, text }
 * @returns {Promise<object>} - { success, messageId, error }
 */
async function sendEmail({ to, subject, html, text }) {
  // If no API key, log to console (dev mode)
  if (!EMAIL_API_KEY) {
    console.log(`\n📧 [EMAIL DEV] To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body preview: ${(text || html).substring(0, 200)}...\n`);
    return { success: true, messageId: 'dev_' + Date.now() };
  }

  // Resend API (also works with SendGrid-compatible wrappers)
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${EMAIL_FROM}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Email API error: ${err}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error('Email send failed:', err.message);
    return { success: false, error: err.message };
  }
}

// ─── Email Templates ───────────────────────────────────────

function getWelcomeHtml({ name, ageSegment }) {
  const firstSessionTips = {
    teens: 'Start with our 5-minute Deep Breathing session — perfect for exam stress.',
    'young-adults': 'Try EFT Tapping for work anxiety or the Silva Mind Control session for clarity.',
    adults: 'Begin with the EMDR session for emotional processing or our guided meditation.',
  };

  const tip = firstSessionTips[ageSegment] || firstSessionTips.adults;

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,system-ui,BlinkMacSystemFont,sans-serif;background:#f5f0eb;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;padding:40px 20px}
.card{background:#fff;border-radius:16px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.logo{text-align:center;font-size:28px;font-weight:700;color:#1A2A3A;margin-bottom:24px}
h1{font-size:22px;color:#1A2A3A;margin:0 0 8px}
p{color:#4a5568;line-height:1.6;margin:0 0 16px}
.tip{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0}
.tip p{color:#166534;margin:0;font-size:14px}
.cta{display:inline-block;background:linear-gradient(135deg,#2563eb,#22c55e);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;margin:16px 0}
.footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:32px}
</style></head><body>
<div class="container"><div class="card">
<div class="logo">🧘 Ener-G-T-49</div>
<h1>Welcome, ${name}!</h1>
<p>Your 30-day free trial has started. Explore our full library of guided wellness sessions — EMDR, EFT Tapping, Havening, Silva Mind Control, and more.</p>
<div class="tip"><p>💡 <strong>Tip:</strong> ${tip}</p></div>
<a href="${PUBLIC_URL}/dashboard" class="cta">Go to Dashboard</a>
<p style="font-size:13px;color:#9ca3af">Your trial includes full access to all modalities. <a href="${PUBLIC_URL}/pricing" style="color:#2563eb">See pricing</a> to choose a plan when you're ready.</p>
</div><div class="footer">© ${new Date().getFullYear()} Ener-G-T-49. All rights reserved.</div></div></body></html>`;
}

function getTrialReminderHtml({ name, daysLeft }) {
  const urgency = daysLeft <= 1
    ? { title: 'Your trial ends tomorrow!', color: '#dc2626' }
    : { title: `Your trial ends in ${daysLeft} days`, color: '#d97706' };

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,system-ui,BlinkMacSystemFont,sans-serif;background:#f5f0eb;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;padding:40px 20px}
.card{background:#fff;border-radius:16px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
h1{font-size:20px;color:#1A2A3A;margin:0 0 8px}
p{color:#4a5568;line-height:1.6;margin:0 0 12px}
.plans{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}
.plan{flex:1;min-width:120px;background:#f8fafc;border-radius:10px;padding:16px;text-align:center}
.plan .price{font-size:18px;font-weight:700;color:#1A2A3A}
.plan .label{font-size:11px;color:#9ca3af;text-transform:uppercase}
.cta{display:inline-block;background:linear-gradient(135deg,#2563eb,#22c55e);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;margin:12px 0}
.footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:32px}
</style></head><body>
<div class="container"><div class="card">
<h1 style="color:${urgency.color}">⏰ ${urgency.title}</h1>
<p>Hi ${name}, don't lose access to your personalized wellness toolkit.</p>
<div class="plans">
<div class="plan"><div class="price">$9.99</div><div class="label">Monthly</div></div>
<div class="plan"><div class="price">$5.83/mo</div><div class="label">Yearly</div></div>
<div class="plan"><div class="price">$99.99</div><div class="label">Lifetime</div></div>
</div>
<a href="${PUBLIC_URL}/pricing" class="cta">Choose Your Plan</a>
<p style="font-size:13px;color:#9ca3af">Or start from <strong>$7.67/month</strong> with a 3-month plan.</p>
</div><div class="footer">© ${new Date().getFullYear()} Ener-G-T-49</div></div></body></html>`;
}

function getPasswordResetHtml({ name, resetLink }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,system-ui,BlinkMacSystemFont,sans-serif;background:#f5f0eb;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;padding:40px 20px}
.card{background:#fff;border-radius:16px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
h1{font-size:20px;color:#1A2A3A;margin:0 0 8px}
p{color:#4a5568;line-height:1.6;margin:0 0 12px}
.cta{display:inline-block;background:#2563eb;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;margin:16px 0}
.note{background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:12px;font-size:13px;color:#92400e;margin:16px 0}
.footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:32px}
</style></head><body>
<div class="container"><div class="card">
<h1>Reset Your Password</h1>
<p>Hi ${name}, we received a request to reset your password for Ener-G-T-49.</p>
<a href="${resetLink}" class="cta">Reset Password</a>
<div class="note">⚠ This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</div>
</div><div class="footer">© ${new Date().getFullYear()} Ener-G-T-49</div></div></body></html>`;
}

function getPurchaseThankYouHtml({ name, plan }) {
  const planLabels = {
    monthly: 'Monthly',
    '3-month': '3-Month',
    '6-month': '6-Month',
    yearly: 'Yearly',
    lifetime: 'Lifetime',
  };

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,system-ui,BlinkMacSystemFont,sans-serif;background:#f5f0eb;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;padding:40px 20px}
.card{background:#fff;border-radius:16px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
h1{font-size:22px;color:#1A2A3A;margin:0 0 8px}
p{color:#4a5568;line-height:1.6;margin:0 0 12px}
.badge{display:inline-block;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;border-radius:8px;padding:4px 12px;font-size:13px;font-weight:600;margin-bottom:16px}
.cta{display:inline-block;background:linear-gradient(135deg,#2563eb,#22c55e);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;margin:16px 0}
.footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:32px}
</style></head><body>
<div class="container"><div class="card">
<h1>🎉 Thank You, ${name}!</h1>
<div class="badge">${planLabels[plan] || plan} Plan Active</div>
<p>Your subscription is now active. You have full access to all 7 modalities — EMDR, EFT Tapping, Faster EFT, TFT Tapping, Silva Mind Control, Havening, and Deep Breathing.</p>
<a href="${PUBLIC_URL}/dashboard" class="cta">Start Your Next Session</a>
</div><div class="footer">© ${new Date().getFullYear()} Ener-G-T-49</div></div></body></html>`;
}

module.exports = {
  sendEmail,
  getWelcomeHtml,
  getTrialReminderHtml,
  getPasswordResetHtml,
  getPurchaseThankYouHtml,
};