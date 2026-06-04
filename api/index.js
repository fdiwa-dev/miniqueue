// Try dotenv
try { require('dotenv').config(); } catch(e) { /* ignore */ }

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'miniqueue', version: '1.0.0' });
});

// Routes full
const { setupRoutes } = require('../src/routes');
setupRoutes(app);

module.exports = app;
