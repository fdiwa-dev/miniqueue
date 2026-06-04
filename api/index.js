try { require('dotenv').config(); } catch(e) { /* ignore - pas de .env en prod */ }

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Setup routes proprement
try {
  const { setupRoutes } = require('../src/routes');
  setupRoutes(app);
} catch(e) {
  console.error('Routes init error:', e.message);
}

// Health endpoint direct
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'miniqueue', version: '1.0.0' });
});

module.exports = app;
