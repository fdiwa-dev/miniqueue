# MiniQueue Client SDK

Client JavaScript officiel pour MiniQueue.

## Installation

```bash
npm install miniqueue-client
```

## Utilisation

```javascript
const MiniQueue = require('miniqueue-client');

const mq = new MiniQueue('http://localhost:3000');

// Créer une queue
const queue = await mq.createQueue('emails');

// Enqueue un job
const job = await mq.enqueue(queue.id, {
  task: 'send_email',
  to: 'user@example.com',
  template: 'welcome'
}, 5);

// Dequeue et traiter
const nextJob = await mq.dequeue(queue.id);
if (nextJob) {
  console.log('Traitement:', nextJob.payload.task);
  await mq.completeJob(nextJob.id, { sent: true });
}

// Statistiques
const stats = await mq.getStats(queue.id);
console.log(`${stats.completed} jobs complétés`);
```
