# MiniQueue

Une API de file d'attente (job queue) simple pour développeurs.

## API

```
POST /api/queues          → Créer une queue
GET  /api/queues          → Lister les queues
GET  /api/queues/:id      → Détails + stats
POST /api/queues/:id/jobs → Enqueue un job
POST /api/queues/:id/dequeue → Dequeue le prochain job
GET  /api/queues/:id/jobs → Lister les jobs
GET  /api/queues/:id/stats → Stats de la queue
POST /api/jobs/:id/complete → Marquer complété
POST /api/jobs/:id/fail    → Marquer échoué
POST /api/jobs/:id/cancel  → Annuler
```

## Déploiement

```bash
npm install
npm start
```

## Variables d'environnement

- `PORT` - Port (défaut: 3000)
- `TELEGRAM_BOT_TOKEN` - Token Telegram (optionnel)
- `TELEGRAM_CHAT_ID` - Chat ID Telegram (optionnel)
