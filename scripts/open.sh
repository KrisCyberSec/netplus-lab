#!/usr/bin/env bash
# Idempotent launcher: reuse a running dev server or start one, then open the browser.
# Usage: npm run open   |   ./scripts/open.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-5173}"
HOST="${HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}/"
cd "$ROOT"

is_up() {
  curl -sf -o /dev/null --connect-timeout 1 --max-time 1 "$URL" 2>/dev/null
}

open_browser() {
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  else
    echo "Open this URL: $URL"
  fi
}

if is_up; then
  open_browser
  echo "Already running → $URL"
  exit 0
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies…"
  npm install
fi

LOG="${TMPDIR:-/tmp}/netplus-lab-dev.log"
PID_FILE="${TMPDIR:-/tmp}/netplus-lab-dev.pid"

# Detach so this script can exit while Vite keeps running
nohup npm run dev -- --host "$HOST" --port "$PORT" >"$LOG" 2>&1 &
echo $! >"$PID_FILE"

for _ in $(seq 1 50); do
  if is_up; then
    open_browser
    echo "Started → $URL (pid $(cat "$PID_FILE"))"
    exit 0
  fi
  # Fail fast if the process already died
  if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    break
  fi
  sleep 0.1
done

echo "Dev server failed to become ready at $URL" >&2
echo "Log: $LOG" >&2
tail -n 30 "$LOG" >&2 || true
exit 1
