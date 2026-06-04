const db = require('./db');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

class AuthMiddleware {
  /**
   * Generate a new API key
   */
  generateApiKey(name, rateLimit = 100) {
    const id = uuidv4();
    const key = `mq_${crypto.randomBytes(24).toString('hex')}`;
    db.prepare(
      'INSERT INTO api_keys (id, name, key, rate_limit) VALUES (?, ?, ?, ?)'
    ).run(id, name, key, rateLimit);
    return { id, name, key, rate_limit: rateLimit };
  }

  /**
   * Validate an API key and return key info
   */
  validateApiKey(key) {
    return db.prepare('SELECT * FROM api_keys WHERE key = ?').get(key);
  }

  /**
   * List all API keys
   */
  listApiKeys() {
    return db.prepare('SELECT id, name, rate_limit, created_at FROM api_keys').all();
  }

  /**
   * Delete an API key
   */
  deleteApiKey(id) {
    db.prepare('DELETE FROM api_keys WHERE id = ?').run(id);
  }

  /**
   * Express middleware to require API key
   * If no keys exist yet, allow access (setup mode)
   */
  middleware(req, res, next) {
    // Setup mode: if no API keys exist, allow all
    const count = db.prepare('SELECT COUNT(*) as count FROM api_keys').get().count;
    if (count === 0) return next();

    // Check API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required. Set X-API-Key header.' });
    }

    const keyInfo = this.validateApiKey(apiKey);
    if (!keyInfo) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // Attach key info to request
    req.apiKeyInfo = keyInfo;
    next();
  }
}

module.exports = new AuthMiddleware();
