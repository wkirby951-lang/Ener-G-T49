# Ener-G-T-49 Custom Domain Setup Guide

This guide walks through configuring a custom domain (e.g., `app.ener-g-t-49.com` or `energyt49.com`) for the Ener-G-T-49 wellness app.

---

## 1. Prerequisites

- A domain name purchased from a registrar (Namecheap, Cloudflare, Google Domains, GoDaddy, etc.)
- Access to the registrar's DNS settings
- The server's public IP address (provided by hosting platform)

## 2. DNS Configuration

### Option A: Apex Domain (e.g., `energyt49.com`)

Create an **A record** pointing to the server's IP:

| Type | Name | Value |
|------|------|-------|
| A    | `@`  | `<SERVER_IP>` |

### Option B: Subdomain (e.g., `app.energyt49.com`)

Create a **CNAME record** pointing to the current app URL:

| Type  | Name | Value |
|-------|------|-------|
| CNAME | `app` | `b28f96d2ef0082eac5936061a8050bd9.ctonew.app` |

### Option C: Behind Cloudflare (recommended for SSL)

1. Add your domain to Cloudflare
2. Set DNS records per Option A or B above
3. Enable **Proxy (orange cloud)** for SSL/HTTPS
4. In SSL/TLS settings, set to **Full (strict)**

> **DNS propagation** can take 5 minutes to 48 hours. Typically 15–30 minutes with modern DNS providers.

## 3. SSL/TLS Certificate

### Using Cloudflare (easiest)
- Cloudflare provides automatic SSL certificates for proxied domains
- No additional setup needed

### Using Let's Encrypt (standalone server)
```bash
# Install certbot
sudo apt install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate files are at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

> The app's Express server does not handle SSL termination directly. Use a reverse proxy (nginx, Caddy, Cloudflare Tunnel) to handle HTTPS.

## 4. Environment Variables

Copy `.env.example` to `.env` and update the following:

```bash
# Required
PUBLIC_URL=https://yourdomain.com          # Your custom domain URL
FRONTEND_URL=https://yourdomain.com        # Frontend origin
PORT=3000                                   # Server port (internal)

# Optional
JWT_SECRET=<change-this-to-a-random-string> # Already set, but can be rotated
```

## 5. Server Configuration

The app is already configured to handle custom domains:

- ✅ **CORS** is set to the `FRONTEND_URL` environment variable (defaults to `http://localhost:5173` in dev)
- ✅ **Trust proxy** is enabled (`app.set('trust proxy', 1)`) for reverse proxy scenarios
- ✅ **All internal links** use relative paths (no hardcoded domains)
- ✅ **API calls** use relative URLs (e.g., `/api/auth/login`)
- ✅ **Stripe payment links** are Stripe-hosted and work from any domain
- ✅ **Auth tokens** (JWT) are domain-agnostic

### If using a reverse proxy (nginx, Cloudflare Tunnel)

The server automatically handles:

```js
// In server/index.js
app.set('trust proxy', 1); // Trust first proxy
```

This ensures correct IP detection and protocol forwarding.

## 6. Verification

### Check DNS resolution
```bash
nslookup yourdomain.com
dig yourdomain.com
```

### Check the app is serving
```bash
curl -I https://yourdomain.com/api/health
# Expected: HTTP/2 200, response includes {"status":"ok","version":"1.0.0",...}
```

### Check the frontend loads
```bash
curl -s https://yourdomain.com/ | grep "Ener-G-T-49"
# Expected: Title tag contains "Ener-G-T-49 — Unified Wellness"
```

### Use the config endpoint
```bash
curl https://yourdomain.com/api/config
# Returns: { "domain": "yourdomain.com", "version": "1.0.0", ... }
```

## 7. Update Published URL

After verifying the domain works, update the app settings:

1. In the hosting platform, set the custom domain to your new URL
2. Update the `PUBLIC_URL` environment variable
3. Restart the server

## 8. Troubleshooting

### Issue: "Blocked request" error
- If using a reverse proxy, some frameworks reject unknown hosts
- This app accepts all hostnames, so this shouldn't occur
- If it does, check that `trust proxy` is enabled

### Issue: Stripe checkout returns to wrong domain
- Stripe uses the return URL from the payment link configuration
- Update the Stripe dashboard payment links to use your new domain as the return URL

### Issue: Mixed content warnings (HTTP on HTTPS page)
- Ensure all external resources use `https://`
- The app uses relative URLs, so this only applies to external CDN resources

### Issue: DNS not resolving
- Wait for propagation (check with `dig` at different DNS servers)
- Verify the record type (A for apex, CNAME for subdomain)
- Check for typos in the DNS record values

### Issue: "Your connection is not private"
- SSL certificate is not yet valid or has expired
- If using Let's Encrypt, run `sudo certbot renew`
- If using Cloudflare, ensure proxy is enabled (orange cloud)

---

## Quick Reference

| Step | What | Estimated Time |
|------|------|----------------|
| 1 | Purchase domain | 5 minutes |
| 2 | Configure DNS | 5 minutes |
| 3 | Set up SSL | 10 minutes (Cloudflare) to 30 minutes (Let's Encrypt) |
| 4 | Update .env | 2 minutes |
| 5 | Restart server | 1 minute |
| 6 | Verify | 5 minutes |
| **Total** | | **~30 minutes** |