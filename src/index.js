require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./routes');
const notifier = require('./telegram');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Setup API routes
setupRoutes(app);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MiniQueue running on http://0.0.0.0:${PORT}`);
  notifier.send(`🚀 <b>MiniQueue</b> est en ligne !\nPort: ${PORT}\nAPI: http://localhost:${PORT}/api`);
});
