const db = require('./db');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class QueueService {
  /**
   * Create a new queue
   */
  createQueue(name) {
    const id = uuidv4();
    db.prepare('INSERT INTO queues (id, name) VALUES (?, ?)').run(id, name);
    return { id, name };
  }

  /**
   * List all queues
   */
  listQueues() {
    return db.prepare('SELECT * FROM queues ORDER BY created_at DESC').all();
  }

  /**
   * Get a queue by ID
   */
  getQueue(id) {
    return db.prepare('SELECT * FROM queues WHERE id = ?').get(id);
  }

  /**
   * Get a queue by name
   */
  getQueueByName(name) {
    return db.prepare('SELECT * FROM queues WHERE name = ?').get(name);
  }

  /**
   * Delete a queue and all its jobs
   */
  deleteQueue(id) {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM jobs WHERE queue_id = ?').run(id);
      db.prepare('DELETE FROM queues WHERE id = ?').run(id);
    });
    tx();
    return true;
  }

  /**
   * Enqueue a new job
   */
  enqueue(queueId, payload = {}, priority = 0) {
    const queue = this.getQueue(queueId);
    if (!queue) throw new Error('Queue not found');

    const id = uuidv4();
    db.prepare(
      'INSERT INTO jobs (id, queue_id, payload, priority) VALUES (?, ?, ?, ?)'
    ).run(id, queueId, JSON.stringify(payload), priority);
    return { id, queueId, status: 'pending' };
  }

  /**
   * Dequeue the next pending job (FIFO with priority)
   */
  dequeue(queueId) {
    const job = db.prepare(`
      SELECT * FROM jobs
      WHERE queue_id = ? AND status = 'pending'
      ORDER BY priority DESC, created_at ASC
      LIMIT 1
    `).get(queueId);

    if (!job) return null;

    db.prepare(
      "UPDATE jobs SET status = 'running', started_at = datetime('now') WHERE id = ?"
    ).run(job.id);

    return {
      ...job,
      payload: JSON.parse(job.payload),
    };
  }

  /**
   * Complete a job
   */
  completeJob(id, result = {}) {
    db.prepare(
      "UPDATE jobs SET status = 'completed', result = ?, completed_at = datetime('now') WHERE id = ?"
    ).run(JSON.stringify(result), id);
    return this.getJob(id);
  }

  /**
   * Fail a job
   */
  failJob(id, error) {
    db.prepare(
      "UPDATE jobs SET status = 'failed', error = ?, completed_at = datetime('now') WHERE id = ?"
    ).run(error, id);
    return this.getJob(id);
  }

  /**
   * Cancel a job
   */
  cancelJob(id) {
    db.prepare("UPDATE jobs SET status = 'cancelled' WHERE id = ?").run(id);
    return this.getJob(id);
  }

  /**
   * Get a specific job
   */
  getJob(id) {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!job) return null;
    return {
      ...job,
      payload: JSON.parse(job.payload),
      result: job.result ? JSON.parse(job.result) : null,
    };
  }

  /**
   * List jobs in a queue with optional status filter
   */
  listJobs(queueId, status = null, limit = 50, offset = 0) {
    let query = 'SELECT * FROM jobs WHERE queue_id = ?';
    const params = [queueId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY priority DESC, created_at ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const jobs = db.prepare(query).all(...params);
    return jobs.map(job => ({
      ...job,
      payload: JSON.parse(job.payload),
      result: job.result ? JSON.parse(job.result) : null,
    }));
  }

  /**
   * Get queue statistics
   */
  getQueueStats(queueId) {
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM jobs WHERE queue_id = ?').get(queueId).count,
      pending: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE queue_id = ? AND status = 'pending'").get(queueId).count,
      running: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE queue_id = ? AND status = 'running'").get(queueId).count,
      completed: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE queue_id = ? AND status = 'completed'").get(queueId).count,
      failed: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE queue_id = ? AND status = 'failed'").get(queueId).count,
      cancelled: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE queue_id = ? AND status = 'cancelled'").get(queueId).count,
    };
  }
}

module.exports = new QueueService();
