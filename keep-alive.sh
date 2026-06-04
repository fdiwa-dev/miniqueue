#!/bin/bash
# Garde MiniQueue en vie + tunnel Cloudflare à jour
# À lancer au démarrage : /home/mehdi/.openclaw/workspace/miniqueue/keep-alive.sh

QUEUE_DIR="/home/mehdi/.openclaw/workspace/miniqueue"
LOG="$QUEUE_DIR/keep-alive.log"

echo "[$(date)] Keep-alive démarré" >> "$LOG"

# 1. Vérifier serveur MiniQueue
if ! curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "[$(date)] Serveur mort, relance..." >> "$LOG"
  cd "$QUEUE_DIR" && node src/index.js &
  sleep 2
fi

# 2. Vérifier tunnel Cloudflare
TUNNEL_PID=$(pgrep -f "cloudflared.*tunnel.*localhost:3000" | head -1)
if [ -z "$TUNNEL_PID" ]; then
  echo "[$(date)] Tunnel mort, relance..." >> "$LOG"
  /tmp/cloudflared tunnel --url http://localhost:3000 > /tmp/cloudflared.log 2>&1 &
  sleep 5
  NEW_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared.log | head -1)
  if [ -n "$NEW_URL" ]; then
    echo "[$(date)] Nouveau tunnel: $NEW_URL" >> "$LOG"
    sed -i "s|https://[a-z0-9-]*\.trycloudflare\.com|$NEW_URL|g" "$QUEUE_DIR/landing/index.html"
    sed -i "s|https://[a-z0-9-]*\.trycloudflare\.com|$NEW_URL|g" "$QUEUE_DIR/docs/index.html"
    cd "$QUEUE_DIR" && git add landing/index.html docs/index.html && git commit -m "auto: mise à jour tunnel Cloudflare" && git push 2>/dev/null
  fi
fi

# 3. Vérifier la page GitHub Pages
if ! curl -sf https://fdiwa-dev.github.io/miniqueue/ > /dev/null 2>&1; then
  echo "[$(date)] GitHub Pages injoignable !" >> "$LOG"
fi

echo "[$(date)] Check terminé" >> "$LOG"
