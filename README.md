# Ener-G-T-49 — Unified Wellness Platform

The first unified wellness app combining **EMDR, EFT Tapping, Faster EFT, TFT Tapping, Silva Mind Control, Havening, and Deep Breathing Meditation** into one guided platform.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express v5 + JWT auth
- **Database:** SQLite (via Turbo/team-db)
- **Payments:** Stripe-ready (configurable provider)

## Quick Start

### Prerequisites
- Node.js 20+
- NPM

### Install & Run

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Build frontend
cd ../client && npm run build

# Run server (serves both API and frontend)
cd ../server && npm start
```

The app will be available at **http://localhost:3000**

### Development

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend (with hot reload)
cd client && npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account (30-day trial) |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| GET | `/api/content/modalities` | No | List all modalities |
| GET | `/api/content/library` | No | Browse content library |
| GET | `/api/content/by-modality` | No | Content grouped by modality |
| GET | `/api/content/:id` | No | Get specific content item |
| GET | `/api/user/dashboard` | Yes | User dashboard data |
| POST | `/api/user/session/complete` | Yes | Record completed session |
| POST | `/api/user/favorites/toggle` | Yes | Toggle content favorite |
| GET | `/api/user/subscription` | Yes | Subscription details |
| POST | `/api/user/subscription/upgrade` | Yes | Upgrade subscription |

## Project Structure

```
ener-g-t-49/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React contexts (auth)
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API client
│   │   └── App.jsx      # Root with router
│   └── dist/            # Production build
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── data/            # Content loader
│   └── index.js         # Entry point
├── content/             # Wellness session scripts (MD)
├── design/              # Brand assets
└── README.md
```

## Modalities
1. EMDR — Eye Movement Desensitization and Reprocessing
2. EFT Tapping — Emotional Freedom Technique
3. Faster EFT — Accelerated tapping
4. TFT Tapping — Thought Field Therapy
5. Silva Mind Control — Alpha-state visualization
6. Havening — Touch-based trauma clearing
7. Deep Breathing — Structured breathwork

## Pricing
| Plan | Price | Period |
|------|-------|--------|
| Monthly | $9.99 | /month |
| 3 Months | $23 | $7.67/mo |
| 6 Months | $42 | $7/mo |
| Annual | $69.99 | $5.83/mo |
| Lifetime | $99.99 | One-time |
| Annual Renewal | $50 | /year |
| A La Carte | $5 | per download |

## Target Audience
- **Teens (14–18):** School stress, social anxiety, exam pressure
- **Young Adults (19–36):** Career stress, burnout, relationships
- **Adults (37–65+):** Chronic stress, grief, life transitions

---

*For educational purposes only. Not a substitute for professional care.*
