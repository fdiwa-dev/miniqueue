// Try dotenv
try { require('dotenv').config(); } catch(e) { /* ignore */ }

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const BASE = path.resolve(__dirname, '..');
app.use(express.static(BASE));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(BASE, 'index.html'));
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(BASE, 'demo', 'index.html'));
});

// Serve Status Page tool
app.get('/status-page', (req, res) => {
  res.sendFile(path.join(BASE, 'status-page.html'));
});

// Redirect /status to status-page
app.get('/status', (req, res) => {
  res.redirect('/status-page');
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'miniqueue', version: '1.0.0' });
});

// Routes full (with fallback for serverless)
try {
  const { setupRoutes } = require('../src/routes');
  setupRoutes(app);
  console.log('✅ Routes initialized');
} catch(e) {
  console.log('❌ Routes error:', e.message);
  app.get('/api/status', (req, res) => {
    res.json({ status: 'degraded', error: e.message, version: '1.0.0' });
  });
}

module.exports = app;
