const axios = require('axios');

class MiniQueue {
  /**
   * @param {string} baseUrl - L'URL de l'API MiniQueue
   * @param {string} apiKey - Ta clé API (optionnel)
   */
  constructor(baseUrl, apiKey = null) {
    this.client = axios.create({
      baseURL: baseUrl.replace(/\/$/, ''),
      headers: apiKey ? { 'X-API-Key': apiKey } : {},
      timeout: 10000,
    });
  }

  // ========== HEALTH ==========

  /** Vérifier que l'API est en ligne */
  async health() {
    const res = await this.client.get('/api/health');
    return res.data;
  }

  // ========== QUEUES ==========

  /** Créer une nouvelle file d'attente */
  async createQueue(name) {
    const res = await this.client.post('/api/queues', { name });
    return res.data;
  }

  /** Lister toutes les files d'attente */
  async listQueues() {
    const res = await this.client.get('/api/queues');
    return res.data;
  }

  /** Obtenir une file d'attente avec ses statistiques */
  async getQueue(id) {
    const res = await this.client.get(`/api/queues/${id}`);
    return res.data;
  }

  /** Supprimer une file d'attente */
  async deleteQueue(id) {
    const res = await this.client.delete(`/api/queues/${id}`);
    return res.data;
  }

  // ========== JOBS ==========

  /** Ajouter un job dans la file */
  async enqueue(queueId, payload = {}, priority = 0) {
    const res = await this.client.post(`/api/queues/${queueId}/jobs`, { payload, priority });
    return res.data;
  }

  /** Récupérer et verrouiller le prochain job disponible */
  async dequeue(queueId) {
    const res = await this.client.post(`/api/queues/${queueId}/dequeue`);
    return res.data;
  }

  /** Lister les jobs d'une file */
  async listJobs(queueId, { status = null, limit = 50, offset = 0 } = {}) {
    const params = { limit, offset };
    if (status) params.status = status;
    const res = await this.client.get(`/api/queues/${queueId}/jobs`, { params });
    return res.data;
  }

  /** Obtenir les statistiques d'une file */
  async getStats(queueId) {
    const res = await this.client.get(`/api/queues/${queueId}/stats`);
    return res.data;
  }

  /** Obtenir un job par son ID */
  async getJob(jobId) {
    const res = await this.client.get(`/api/jobs/${jobId}`);
    return res.data;
  }

  /** Marquer un job comme complété */
  async completeJob(jobId, result = {}) {
    const res = await this.client.post(`/api/jobs/${jobId}/complete`, { result });
    return res.data;
  }

  /** Marquer un job comme échoué */
  async failJob(jobId, error) {
    const res = await this.client.post(`/api/jobs/${jobId}/fail`, { error });
    return res.data;
  }

  /** Annuler un job */
  async cancelJob(jobId) {
    const res = await this.client.post(`/api/jobs/${jobId}/cancel`);
    return res.data;
  }
}

module.exports = MiniQueue;
