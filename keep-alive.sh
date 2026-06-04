#!/bin/bash
# MiniQueue Monitor — vérifie l'état de tous les services
# Appelé par le cron toutes les 10 minutes

API="https://miniqueue.vercel.app"
SITE="https://miniqueue.vercel.app"
GITHUB="https://github.com/fdiwa-dev/miniqueue"
DASHBOARD="https://miniqueue.vercel.app/dashboard"
LOG="/tmp/miniqueue-monitor.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === MiniQueue Health Check ===" > $LOG

# 1. API Health
HTTP=$(curl -s -o /dev/null -w "%{http_code}" $API/api/health --max-time 10 2>/dev/null)
if [ "$HTTP" = "200" ]; then
  echo "✅ API Health: OK (200)" >> $LOG
else
  echo "❌ API Health: ÉCHEC ($HTTP)" >> $LOG
fi

# 2. Homepage
HTTP=$(curl -s -o /dev/null -w "%{http_code}" $SITE/ --max-time 10 2>/dev/null)
if [ "$HTTP" = "200" ]; then
  echo "✅ Homepage: OK (200)" >> $LOG
else
  echo "❌ Homepage: ÉCHEC ($HTTP)" >> $LOG
fi

# 3. Dashboard
HTTP=$(curl -s -o /dev/null -w "%{http_code}" $DASHBOARD --max-time 10 2>/dev/null)
if [ "$HTTP" = "200" ]; then
  echo "✅ Dashboard: OK (200)" >> $LOG
else
  echo "❌ Dashboard: ÉCHEC ($HTTP)" >> $LOG
fi

# 4. Stats
STATS=$(curl -s $API/api/stats --max-time 10 2>/dev/null)
if [ -n "$STATS" ]; then
  echo "✅ Stats: $STATS" >> $LOG
else
  echo "❌ Stats: Pas de réponse" >> $LOG
fi

# 5. GitHub
HTTP=$(curl -s -o /dev/null -w "%{http_code}" $GITHUB --max-time 10 2>/dev/null)
if [ "$HTTP" = "200" ]; then
  echo "✅ GitHub: OK (200)" >> $LOG
else
  echo "❌ GitHub: ÉCHEC ($HTTP)" >> $LOG
fi

echo "---" >> $LOG
echo "Terminé." >> $LOG

# Read stats to show overview
cat $LOG