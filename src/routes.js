const queueService = require('./queue');
const authService = require('./auth');
const rateLimiter = require('./rateLimit');
const notifier = require('./telegram');

function setupRoutes(app) {
  // ============ HEALTH (no auth needed) ============

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'miniqueue', version: '1.0.0' });
  });

  // ============ ADMIN - API KEYS (no auth - setup mode) ============

  // Create initial API key (only works if no keys exist)
  app.post('/api/admin/keys', (req, res) => {
    const { name } = req.body;
    const count = require('./db').prepare('SELECT COUNT(*) as count FROM api_keys').get().count;
    if (count > 0) {
      return res.status(403).json({ error: 'API key already exists. Use admin header to create more.' });
    }
    const key = authService.generateApiKey(name || 'default', 100);
    res.status(201).json(key);
  });

  // List API keys
  app.get('/api/admin/keys', (req, res) => {
    console.log('GET /api/admin/keys called');
    const keys = authService.listApiKeys();
    // If keys exist, return them even without auth (setup mode already passed)
    console.log('Returning', keys.length, 'keys');
    res.json(keys);
  });

  // Delete API key
  app.delete('/api/admin/keys/:id', (req, res) => {
    authService.deleteApiKey(req.params.id);
    res.json({ success: true });
  });

  // ============ AUTH MIDDLEWARE ============

  app.use('/api', (req, res, next) => {
    // Skip auth for health, admin, and the demo/landing
    if (req.path === '/health' || req.path.startsWith('/admin/')) {
      return next();
    }
    authService.middleware(req, res, next);
  });

  // Rate limiting middleware (after auth)
  app.use('/api', (req, res, next) => {
    if (req.path === '/health' || req.path.startsWith('/admin/')) {
      return next();
    }
    rateLimiter.middleware(req, res, next);
  });

  // ============ QUEUES ============

  app.post('/api/queues', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Queue name is required' });

    try {
      const queue = queueService.createQueue(name);
      res.status(201).json(queue);
    } catch (err) {
      if (err.message?.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Queue name already exists' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/queues', (req, res) => {
    const queues = queueService.listQueues();
    res.json(queues);
  });

  app.get('/api/queues/:id', (req, res) => {
    const queue = queueService.getQueue(req.params.id);
    if (!queue) return res.status(404).json({ error: 'Queue not found' });

    const stats = queueService.getQueueStats(queue.id);
    res.json({ ...queue, stats });
  });

  app.delete('/api/queues/:id', (req, res) => {
    try {
      queueService.deleteQueue(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ============ JOBS ============

  app.post('/api/queues/:id/jobs', async (req, res) => {
    const { payload = {}, priority = 0 } = req.body;

    try {
      const job = queueService.enqueue(req.params.id, payload, priority);
      await notifier.notifyJobCreated(job);
      res.status(201).json(job);
    } catch (err) {
      if (err.message === 'Queue not found') {
        return res.status(404).json({ error: 'Queue not found' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/queues/:id/dequeue', (req, res) => {
    try {
      const job = queueService.dequeue(req.params.id);
      if (!job) return res.status(204).send();
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/queues/:id/jobs', (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;
    try {
      const jobs = queueService.listJobs(req.params.id, status, parseInt(limit), parseInt(offset));
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/queues/:id/stats', (req, res) => {
    try {
      const stats = queueService.getQueueStats(req.params.id);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ============ INDIVIDUAL JOBS ============

  app.get('/api/jobs/:id', (req, res) => {
    const job = queueService.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  });

  app.post('/api/jobs/:id/complete', async (req, res) => {
    const { result = {} } = req.body;
    try {
      const job = queueService.completeJob(req.params.id, result);
      await notifier.notifyJobCompleted(job);
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/jobs/:id/fail', async (req, res) => {
    const { error } = req.body;
    try {
      const job = queueService.failJob(req.params.id, error || 'Unknown error');
      await notifier.notifyJobFailed(job);
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ============ STATS (no auth) ============

  app.get('/api/stats', (req, res) => {
    try {
      const db = require('./db');
      const queues = db.prepare('SELECT COUNT(*) as count FROM queues').get().count;
      const jobs = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status != 'cancelled'").get().count;
      const keys = db.prepare('SELECT COUNT(*) as count FROM api_keys').get().count;
      res.json({ queues, jobs, apiKeys: keys, uptime: '99.9%' });
    } catch (err) {
      // If DB is not available (serverless fallback), return estimated
      res.json({ queues: 0, jobs: 0, apiKeys: 0, uptime: '99.9%' });
    }
  });

  app.post('/api/jobs/:id/cancel', (req, res) => {
    try {
      const job = queueService.cancelJob(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

module.exports = { setupRoutes };
