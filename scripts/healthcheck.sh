#!/bin/sh
# scripts/healthcheck.sh — Script de healthcheck simples
# Verifica se um endpoint HTTP está respondendo com status 200
# Uso: ./healthcheck.sh [url] [path]

URL="${1:-http://localhost:3000}"
PATH="${2:-/api/health}"

# Tenta com curl primeiro, depois wget como fallback
if command -v curl >/dev/null 2>&1; then
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${URL}${PATH}" 2>/dev/null || echo "000")
elif command -v wget >/dev/null 2>&1; then
  if wget -q -O- "${URL}${PATH}" >/dev/null 2>&1; then
    STATUS=200
  else
    STATUS=000
  fi
else
  echo "Error: curl or wget not found" >&2
  exit 1
fi

# Retorna exit code 0 se OK, 1 se erro
if [ "${STATUS}" = "200" ]; then
  exit 0
else
  exit 1
fi