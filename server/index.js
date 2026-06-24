const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    app: 'Ener-G-T-49 Wellness Platform',
    timestamp: new Date().toISOString()
  });
});

// ─── Serve Static Frontend (production) ─────────────────────
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// SPA fallback: serve index.html for all non-API routes
app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ─── Start Server ───────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Ener-G-T-49 API server running on http://0.0.0.0:${PORT}`);
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;