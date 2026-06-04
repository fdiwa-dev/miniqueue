const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || (process.env.VERCEL ? '/tmp/miniqueue.db' : path.join(__dirname, '..', 'data', 'miniqueue.db'));

// Ensure data directory exists
const fs = require('fs');
try {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch(e) {
  console.log('DB mkdir error:', e.message);
}

// Try-catch for better-sqlite3 (native module may fail on some platforms)
let db = null;
try {
  db = new Database(DB_PATH);
  console.log('DB opened at:', DB_PATH);
} catch(e) {
  console.log('DB open error:', e.message);
  // Export mock DB that returns empty/fake data
  db = {
    prepare: () => ({
      run: () => ({}),
      get: () => null,
      all: () => [],
    }),
    transaction: (fn) => fn,
    pragma: () => {},
    exec: () => {},
  };
}

if (db && db.exec) {
  try {
    // Enable WAL mode
    db.pragma('journal_mode = WAL');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS queues (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        queue_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK(status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
        payload TEXT NOT NULL DEFAULT '{}',
        result TEXT DEFAULT NULL,
        error TEXT DEFAULT NULL,
        priority INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        started_at TEXT DEFAULT NULL,
        completed_at TEXT DEFAULT NULL,
        FOREIGN KEY (queue_id) REFERENCES queues(id)
      );

      CREATE INDEX IF NOT EXISTS idx_jobs_queue_status
        ON jobs(queue_id, status, priority DESC, created_at ASC);

      CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        key TEXT NOT NULL UNIQUE,
        rate_limit INTEGER DEFAULT 100,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  } catch(e) {
    console.log('DB init error:', e.message);
  }
}

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS queues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    queue_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK(status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    payload TEXT NOT NULL DEFAULT '{}',
    result TEXT DEFAULT NULL,
    error TEXT DEFAULT NULL,
    priority INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    started_at TEXT DEFAULT NULL,
    completed_at TEXT DEFAULT NULL,
    FOREIGN KEY (queue_id) REFERENCES queues(id)
  );

  CREATE INDEX IF NOT EXISTS idx_jobs_queue_status
    ON jobs(queue_id, status, priority DESC, created_at ASC);

  CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    rate_limit INTEGER DEFAULT 100,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
