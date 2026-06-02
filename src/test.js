#!/usr/bin/env node
/**
 * MiniQueue - Test automatisé
 * Vérifie que tous les endpoints fonctionnent
 */
require('dotenv').config();

const axios = require('axios');
const BASE = `http://localhost:${process.env.PORT || 3000}`;
const client = axios.create({ baseURL: BASE, timeout: 5000 });

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n📋 MiniQueue — Test Suite\n');

  // 1. Health check
  await test('Health check', async () => {
    const res = await client.get('/api/health');
    if (res.data.status !== 'ok') throw new Error('Status not ok');
  });

  // 2. Récupérer ou créer une clé API
  let API_KEY;
  await test('Get or create API key', async () => {
    // Try to list existing keys
    const listRes = await client.get('/api/admin/keys');
    if (listRes.data && listRes.data.length > 0) {
      API_KEY = listRes.data[0].key;
      // Check if key is stored in env or print it
      return;
    }
    // Create new key
    const res = await client.post('/api/admin/keys', { name: 'test-key' });
    API_KEY = res.data.key;
    if (!API_KEY) throw new Error('No key returned');
  });

  if (!API_KEY) {
    console.log('\n❌ Impossible de récupérer une clé API. Les tests suivants sont ignorés.\n');
    process.exit(1);
  }

  const authed = axios.create({
    baseURL: BASE,
    headers: { 'X-API-Key': API_KEY },
    timeout: 5000,
  });

  // 3. Créer une queue
  let queueId;
  await test('Create queue', async () => {
    const res = await authed.post('/api/queues', { name: 'test-queue' });
    queueId = res.data.id;
    if (!queueId) throw new Error('No queue id');
  });

  // 4. Lister les queues
  await test('List queues', async () => {
    const res = await authed.get('/api/queues');
    if (!Array.isArray(res.data)) throw new Error('Not an array');
  });

  // 5. Enqueue job
  let highJobId;
  await test('Enqueue job (priority 5)', async () => {
    const res = await authed.post(`/api/queues/${queueId}/jobs`, {
      payload: { task: 'test', value: 42 },
      priority: 5,
    });
    highJobId = res.data.id;
    if (res.data.status !== 'pending') throw new Error('Status not pending');
  });

  // 6. Enqueue un job basse priorité
  await test('Enqueue job (priority 1)', async () => {
    const res = await authed.post(`/api/queues/${queueId}/jobs`, {
      payload: { task: 'low' },
      priority: 1,
    });
    if (res.data.status !== 'pending') throw new Error('Status not pending');
  });

  // 7. Dequeue (doit prendre la priorité 5 d'abord)
  let dequeued;
  await test('Dequeue respects priority', async () => {
    const res = await authed.post(`/api/queues/${queueId}/dequeue`);
    dequeued = res.data;
    if (dequeued.priority !== 5) throw new Error(`Expected priority 5, got ${dequeued.priority}`);
    if (dequeued.payload.task !== 'test') throw new Error('Wrong task');
  });

  // 8. Complete job
  await test('Complete job', async () => {
    const res = await authed.post(`/api/jobs/${dequeued.id}/complete`, {
      result: { processed: true },
    });
    if (res.data.status !== 'completed') throw new Error('Status not completed');
  });

  // 9. Stats
  await test('Queue stats', async () => {
    const res = await authed.get(`/api/queues/${queueId}/stats`);
    if (res.data.completed < 1) throw new Error('Expected at least 1 completed');
    if (res.data.pending < 1) throw new Error('Expected at least 1 pending');
  });

  // 10. Enqueue + Fail
  await test('Enqueue/fail a job', async () => {
    const enq = await authed.post(`/api/queues/${queueId}/jobs`, {
      payload: { task: 'will-fail' },
    });
    const deq = await authed.post(`/api/queues/${queueId}/dequeue`);
    if (!deq.data || deq.status === 204) throw new Error('No job to dequeue');
    const res = await authed.post(`/api/jobs/${deq.data.id}/fail`, { error: 'Something went wrong' });
    if (res.data.status !== 'failed') throw new Error('Status not failed');
  });

  // 11. Cancel a job
  await test('Cancel a job', async () => {
    const enq = await authed.post(`/api/queues/${queueId}/jobs`, {
      payload: { task: 'will-cancel' },
    });
    const res = await authed.post(`/api/jobs/${enq.data.id}/cancel`);
    if (res.data.status !== 'cancelled') throw new Error('Status not cancelled');
  });

  // 12. Rate limiting
  await test('Rate limit headers present', async () => {
    const res = await authed.post(`/api/queues/${queueId}/jobs`, {
      payload: { task: 'rate-test' },
    });
    if (!res.headers['x-ratelimit-limit']) throw new Error('No rate limit header');
  });

  // 13. Supprimer la queue
  await test('Delete queue', async () => {
    const res = await authed.delete(`/api/queues/${queueId}`);
    if (!res.data.success) throw new Error('Delete failed');
  });

  // Résultat
  console.log(`\n${'='.repeat(40)}`);
  console.log(`✅ ${passed} tests réussis`);
  if (failed > 0) console.log(`❌ ${failed} tests échoués`);
  console.log(`${'='.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
