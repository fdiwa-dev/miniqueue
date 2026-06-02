#!/usr/bin/env node

const axios = require('axios');
const readline = require('readline');

const API_URL = process.env.MINIQUEUE_URL || 'http://localhost:3000';
const API_KEY = process.env.MINIQUEUE_KEY || null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = axios.create({
  baseURL: API_URL,
  headers: API_KEY ? { 'X-API-Key': API_KEY } : {},
  timeout: 10000,
});

function help() {
  console.log(`
📋 MiniQueue CLI

Usage:
  miniqueue <command> [options]

Commands:
  health                    Check API status
  queue:create <name>       Create a queue
  queue:list                List all queues
  queue:get <id>            Get queue details
  queue:delete <id>         Delete a queue
  job:add <queue-id>        Add a job (interactive)
  job:list <queue-id>       List jobs in a queue
  job:get <job-id>          Get job details
  stats <queue-id>          Get queue statistics
  key:create <name>         Create API key (admin)
  key:list                  List API keys (admin)

Examples:
  miniqueue health
  miniqueue queue:create my-queue
  MINIQUEUE_KEY=mq_... miniqueue queue:list
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const param = args[1];

  if (!cmd || cmd === 'help') return help();

  try {
    switch (cmd) {
      case 'health': {
        const res = await client.get('/api/health');
        console.log('✅', res.data.status, '—', res.data.service, res.data.version);
        break;
      }
      case 'queue:create': {
        if (!param) return console.log('❌ Nom de queue requis');
        const res = await client.post('/api/queues', { name: param });
        console.log('✅ Queue créée:', res.data.name, `(${res.data.id.slice(0, 8)}...)`);
        break;
      }
      case 'queue:list': {
        const res = await client.get('/api/queues');
        if (res.data.length === 0) return console.log('📭 Aucune queue');
        for (const q of res.data) {
          console.log(`📦 ${q.name} (${q.id.slice(0, 8)}...) — ${q.created_at}`);
        }
        break;
      }
      case 'queue:get': {
        if (!param) return console.log('❌ ID de queue requis');
        const res = await client.get(`/api/queues/${param}`);
        console.log(`📦 ${res.data.name}`);
        console.log(`Status: ${res.data.stats.pending} pending · ${res.data.stats.running} running · ${res.data.stats.completed} done`);
        break;
      }
      case 'queue:delete': {
        if (!param) return console.log('❌ ID de queue requis');
        await client.delete(`/api/queues/${param}`);
        console.log('🗑️ Queue supprimée');
        break;
      }
      case 'job:add': {
        if (!param) return console.log('❌ ID de queue requis');
        const payload = args[2] ? JSON.parse(args[2]) : { task: 'manual' };
        const priority = parseInt(args[3]) || 0;
        const res = await client.post(`/api/queues/${param}/jobs`, { payload, priority });
        console.log('📥 Job ajouté:', res.data.id.slice(0, 8), '...', `(priority: ${priority})`);
        break;
      }
      case 'job:list': {
        if (!param) return console.log('❌ ID de queue requis');
        const res = await client.get(`/api/queues/${param}/jobs`);
        if (res.data.length === 0) return console.log('📭 Aucun job');
        for (const j of res.data) {
          console.log(`  ${j.status === 'completed' ? '✅' : j.status === 'failed' ? '❌' : j.status === 'running' ? '🔄' : '⏳'} ${j.id.slice(0, 8)}... — ${j.status} (p${j.priority})`);
        }
        break;
      }
      case 'job:get': {
        if (!param) return console.log('❌ ID de job requis');
        const res = await client.get(`/api/jobs/${param}`);
        console.log(`📄 Job ${res.data.id.slice(0, 8)}...`);
        console.log(`  Status: ${res.data.status}`);
        console.log(`  Payload: ${JSON.stringify(res.data.payload)}`);
        if (res.data.result) console.log(`  Result: ${JSON.stringify(res.data.result)}`);
        if (res.data.error) console.log(`  Error: ${res.data.error}`);
        break;
      }
      case 'stats': {
        if (!param) return console.log('❌ ID de queue requis');
        const res = await client.get(`/api/queues/${param}/stats`);
        console.log('📊 Statistiques:');
        console.log(`  Total:     ${res.data.total}`);
        console.log(`  Pending:   ${res.data.pending}`);
        console.log(`  Running:   ${res.data.running}`);
        console.log(`  Completed: ${res.data.completed}`);
        console.log(`  Failed:    ${res.data.failed}`);
        console.log(`  Cancelled: ${res.data.cancelled}`);
        break;
      }
      case 'key:create': {
        if (!param) return console.log('❌ Nom de clé requis');
        const res = await client.post('/api/admin/keys', { name: param });
        console.log('🔑 Clé créée:', res.data.key);
        break;
      }
      case 'key:list': {
        const res = await client.get('/api/admin/keys');
        for (const k of res.data) {
          console.log(`🔑 ${k.name} — limit: ${k.rate_limit}/jour`);
        }
        break;
      }
      default:
        console.log('❌ Commande inconnue:', cmd);
        help();
    }
  } catch (err) {
    if (err.response) {
      console.log('❌', err.response.data.error || err.response.statusText);
    } else {
      console.log('❌', err.message);
    }
  }
}

main().then(() => process.exit(0));
