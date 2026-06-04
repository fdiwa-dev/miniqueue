try { require('dotenv').config(); } catch(e) { /* ignore */ }

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Health endpoint first (no deps needed)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'miniqueue', version: '1.0.0' });
});

// Try to setup full routes, fallback gracefully
try {
  const { setupRoutes } = require('../src/routes');
  setupRoutes(app);
} catch(e) {
  console.log('ROUTES ERROR:', e.message);
}

module.exports = app;
