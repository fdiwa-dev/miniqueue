<div align="center">
  <h1>🚀 MiniQueue</h1>
  <p><strong>Simple job queue API. No Redis needed. Just curl.</strong></p>

  <p>
    <a href="https://miniqueue.vercel.app">
      <img src="https://img.shields.io/badge/Live-API-2563eb?style=flat-square" alt="Live API">
    </a>
    <a href="https://miniqueue.vercel.app/dashboard">
      <img src="https://img.shields.io/badge/Dashboard-Live-16a34a?style=flat-square" alt="Dashboard">
    </a>
    <a href="https://github.com/fdiwa-dev/miniqueue/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
    </a>
    <a href="https://dev.to/fdiwadev/miniqueue-a-job-queue-api-that-doesnt-need-redis-18n0">
      <img src="https://img.shields.io/badge/Dev.to-Article-333?style=flat-square" alt="Dev.to">
    </a>
  </p>
</div>

---

## ✨ Pourquoi MiniQueue ?

Tu as besoin d'une file d'attente pour tes jobs ? D'habitude c'est Redis + Bull + configuration. Pour un side project, c'est souvent trop lourd.

**MiniQueue** résout ça : une API REST simple, sans Redis, prête en 30 secondes.

```bash
# Créer une queue
curl -X POST https://miniqueue.vercel.app/api/queues \
  -H "Content-Type: application/json" \
  -d '{"name":"mon-projet"}'

# Ajouter un job
curl -X POST https://miniqueue.vercel.app/api/queues/mon-projet/jobs \
  -H "Content-Type: application/json" \
  -d '{"payload":{"action":"send_email"}}'

# Voir les jobs
curl https://miniqueue.vercel.app/api/queues/mon-projet/jobs
```

## 🎯 Features

| Feature | Description |
|---------|-------------|
| **📦 Queues** | Créez et gérez plusieurs files d'attente |
| **⚡ Jobs** | Enqueue, status, complete, fail, cancel |
| **🔢 Priorité** | Système de priorité intégré |
| **🔐 Auth** | API keys avec rate limiting |
| **📊 Dashboard** | Interface temps réel pour monitorer |
| **💾 SQLite** | Zéro dépendance externe |
| **📦 SDK** | Client Node.js prêt à l'emploi |
| **🖥️ CLI** | `npx miniqueue` |

## 📦 Stack

```
Backend:  Node.js + Express
Database: better-sqlite3 (SQLite)
Deploy:   Vercel (serverless)
Auth:     API keys + rate limiting
```

## 🚀 Démarrer

### Option 1 : Utiliser l'API en ligne

```bash
# 1. Obtenir une clé API
curl -X POST https://miniqueue.vercel.app/api/admin/keys \
  -H "Content-Type: application/json" \
  -d '{"name":"ma-cle"}'

# 2. Sauvegarder la clé retournée
export API_KEY="votre-cle-ici"

# 3. Créer une queue
curl -X POST https://miniqueue.vercel.app/api/queues \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"emails"}'

# 4. Ajouter des jobs
curl -X POST https://miniqueue.vercel.app/api/queues/emails/jobs \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"payload":{"to":"user@example.com","subject":"Hello!"}}'
```

### Option 2 : Déploiement local

```bash
git clone https://github.com/fdiwa-dev/miniqueue.git
cd miniqueue
npm install
npm start
# → http://localhost:3000
```

## 📋 Référence API

### Queues

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/queues` | Créer une queue |
| `GET` | `/api/queues` | Lister les queues |
| `GET` | `/api/queues/:id` | Détails d'une queue |
| `DELETE` | `/api/queues/:id` | Supprimer une queue (avec ses jobs) |

### Jobs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/queues/:id/jobs` | Enqueue un job |
| `GET` | `/api/queues/:id/jobs` | Lister les jobs d'une queue |
| `GET` | `/api/jobs/:id` | Détails d'un job |
| `POST` | `/api/jobs/:id/complete` | Marquer complété |
| `POST` | `/api/jobs/:id/fail` | Marquer échoué |
| `POST` | `/api/jobs/:id/cancel` | Annuler un job |

### Stats

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/stats` | Stats globales |
| `GET` | `/api/queues/:id/stats` | Stats d'une queue |

### Auth

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/admin/keys` | Créer une clé API |
| `GET` | `/api/keys` | Lister les clés |
| `DELETE` | `/api/keys/:id` | Supprimer une clé |

### Health

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/health` | Health check |

## 💰 Pricing

| Plan | Prix | Jobs/jour | Queues | Support |
|------|------|-----------|--------|---------|
| 🆓 Free | Gratuit | 1 000 | 3 | Community |
| 🚀 Pro | $5/mois | 10 000 | 10 | Email |
| 💼 Business | $15/mois | 100 000 | Illimité | Prioritaire |

🔗 [Voir les plans](https://miniqueue.lemonsqueezy.com)

## 🧪 SDK & CLI

```bash
# CLI
npx miniqueue

# SDK (bientôt)
npm install miniqueue
```

## 📝 Articles

- [MiniQueue: A Job Queue API That Doesn't Need Redis](https://dev.to/fdiwadev/miniqueue-a-job-queue-api-that-doesnt-need-redis-18n0) — Dev.to

## 🤝 Contribuer

Les PRs sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) (à venir).

## 📄 License

MIT — fait avec ❤️ par [Fdiwa](https://github.com/fdiwa-dev)
