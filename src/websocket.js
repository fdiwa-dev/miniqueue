const WebSocket = require('ws');

let wss = null;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    
    // Send initial stats
    sendStats(ws);
    
    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
    });
  });
  
  console.log('📡 WebSocket server ready on /ws');
  return wss;
}

function sendStats(ws) {
  try {
    const db = require('./db');
    const queues = db.prepare('SELECT * FROM queues ORDER BY created_at DESC').all();
    
    const stats = queues.map(q => {
      const counts = {
        pending: db.prepare("SELECT COUNT(*) as c FROM jobs WHERE queue_id = ? AND status = 'pending'").get(q.id).c,
        running: db.prepare("SELECT COUNT(*) as c FROM jobs WHERE queue_id = ? AND status = 'running'").get(q.id).c,
        completed: db.prepare("SELECT COUNT(*) as c FROM jobs WHERE queue_id = ? AND status = 'completed'").get(q.id).c,
        failed: db.prepare("SELECT COUNT(*) as c FROM jobs WHERE queue_id = ? AND status = 'failed'").get(q.id).c
      };
      return { ...q, ...counts };
    });
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'stats', data: { queues: stats, time: new Date().toISOString() } }));
    }
  } catch(e) {
    // Silent fail on serverless
  }
}

function broadcastStats() {
  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      sendStats(client);
    }
  });
}

module.exports = { setupWebSocket, broadcastStats };
