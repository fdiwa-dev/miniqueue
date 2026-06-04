# Show HN: MiniQueue — Post Draft

## Title (choice of 3):

### Option A (recommended — short & punchy)
> **Show HN: MiniQueue – REST API for job queues, no Redis needed**

### Option B (feature-focused)
> **Show HN: MiniQueue – A zero-config job queue as a REST API (Node.js + SQLite)**

### Option C (pain-point oriented)
> **Show HN: MiniQueue – Job queues without Redis or Docker. Just an API key.**

---

## Description (copy for the "text" field)

I built MiniQueue because every time I needed a simple job queue for a side project, I had to set up Redis, Bull/BullMQ, or some heavy infrastructure. For small projects and MVPs, that's overkill.

MiniQueue is a REST API for job queues. You create a queue, push jobs, and workers pull them — all via HTTP. No Redis, no Docker, no Kafka. Just an API key.

**What it does:**
- POST /api/queues — Create a queue
- POST /api/queues/:id/jobs — Push a job with priority
- POST /api/queues/:id/dequeue — Worker pulls the next job (FIFO + priority)
- POST /api/jobs/:id/complete — Mark done
- GET /api/queues/:id/stats — Real-time dashboard

**What's included:**
- 🔌 SDK (npm install miniqueue-client) — 5 lines to start
- 🖥️ CLI (npx miniqueue) — Create and manage queues from terminal
- 📊 Real-time dashboard (WebSocket-based, see stats live)
- 🐳 Docker support if you want it
- 🆓 Free plan: 2 queues, 500 jobs/day
- 💰 Pro: $5/mo (10 queues, 5K jobs/day)
- 💰 Business: $15/mo (unlimited)

**Why not just use Redis?**
If you already have Redis running, Bull is great. But for serverless, edge, or small deployments where you don't want another service to manage, MiniQueue works out of the box with SQLite behind a REST API.

**Tech:** Node.js + Express + better-sqlite3 (zero deps beyond Express). Runs on a $5 VPS or free tier.

**Links:**
- Try it: https://fdiwa-dev.github.io/miniqueue/
- GitHub: https://github.com/fdiwa-dev/miniqueue
- PH: https://www.producthunt.com/posts/miniqueue
- API (live): https://ide-fathers-likewise-kelly.trycloudflare.com

Happy to answer questions! Would love feedback on what's missing.

---

## Instructions for posting

1. Go to https://news.ycombinator.com/submit
2. Login with username: fdiwa-dev (and its password)
3. Paste the **title** into the title field
4. Paste the **description (text)** into the body field
5. URL field: leave empty (put URL in body instead, or use https://fdiwa-dev.github.io/miniqueue/)
6. Submit!

## Timing recommendation

| Timezone | Best window |
|----------|-------------|
| PDT | 14:00 – 16:00 |
| EDT | 17:00 – 19:00 |
| GMT+1 | 23:00 – 01:00 |

**Why:** At 08:00 PDT (now), the US West Coast is barely awake and the East Coast is in meetings. The best engagement on HN is between 14:00-16:00 PDT when both coasts are active and the "lunch crowd" is browsing. This also avoids the morning flood of posts.

**Alternative:** Post now (08:15 PDT) — you'll catch early risers but might get buried faster. Given this is catchup after a missed PH launch, I'd recommend waiting for the afternoon window.

## Cross-promotion note

- The landing page (GitHub Pages) has **no analytics** (no GA, Plausible, etc.) — so we can't measure PH referral traffic
- Consider adding Plausible or Umami to the landing page before posting to HN
- The PH page is live but Cloudflare-blocked for scraping; we can't verify vote count or comments from here
- The Lemon Squeezy checkout links are in place for Pro ($5) and Business ($15)
