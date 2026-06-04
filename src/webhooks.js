const db = require('./db');

const WEBHOOKS_TABLE = `
  CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    queue_id TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT NOT NULL DEFAULT '["completed","failed"]',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (queue_id) REFERENCES queues(id)
  );
`;

try {
  db.exec(WEBHOOKS_TABLE);
  console.log('📡 Webhooks table ready');
} catch(e) {
  // Table may already exist
}

function createWebhook(queueId, url, events = ['completed', 'failed']) {
  const crypto = require('crypto');
  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO webhooks (id, queue_id, url, events) VALUES (?, ?, ?, ?)'
  ).run(id, queueId, url, JSON.stringify(events));
  return { id, queueId, url, events };
}

function listWebhooks(queueId) {
  const stmt = queueId
    ? db.prepare('SELECT * FROM webhooks WHERE queue_id = ?')
    : db.prepare('SELECT * FROM webhooks');
  return (queueId ? stmt.all(queueId) : stmt.all()).map(w => ({
    ...w,
    events: JSON.parse(w.events)
  }));
}

function deleteWebhook(id) {
  const result = db.prepare('DELETE FROM webhooks WHERE id = ?').run(id);
  return result.changes > 0;
}

function triggerWebhooks(job, event) {
  const hooks = db.prepare('SELECT * FROM webhooks WHERE queue_id = ?').all(job.queue_id);
  for (const hook of hooks) {
    const events = JSON.parse(hook.events);
    if (events.includes(event)) {
      // Fire and forget (async)
      fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'MiniQueue-Webhook/1.0' },
        body: JSON.stringify({ event, job, timestamp: new Date().toISOString() })
      }).catch(err => console.log('Webhook error:', hook.url, err.message));
    }
  }
}

module.exports = { createWebhook, listWebhooks, deleteWebhook, triggerWebhooks };
