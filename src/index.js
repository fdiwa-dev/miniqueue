require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { setupRoutes } = require('./routes');
const { setupWebSocket } = require('./websocket');
const notifier = require('./telegram');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir les fichiers statiques (landing page, demo, etc.)
app.use(express.static(__dirname + '/..'));

// Setup API routes
setupRoutes(app);

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
try {
  setupWebSocket(server);
} catch(e) {
  console.log('WebSocket setup skipped:', e.message);
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MiniQueue running on http://0.0.0.0:${PORT}`);
  console.log(`📡 WebSocket ready on ws://0.0.0.0:${PORT}/ws`);
  notifier.send(`🚀 <b>MiniQueue</b> est en ligne !\nPort: ${PORT}\nAPI: http://localhost:${PORT}/api`);
});
