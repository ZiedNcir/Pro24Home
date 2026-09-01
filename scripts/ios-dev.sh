#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
METRO_PID=""

cleanup() {
  if [[ -n "$METRO_PID" ]] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required. Install Node.js, then run npm install." >&2
  exit 1
fi

cd "$PROJECT_ROOT"

echo "Starting Metro on http://127.0.0.1:8081 ..."
npx react-native start --port 8081 &
METRO_PID=$!

ready=false
for _ in {1..30}; do
  if curl --silent --fail http://127.0.0.1:8081/status >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 1
done

if [[ "$ready" != true ]]; then
  echo "Metro did not become ready at http://127.0.0.1:8081 within 30 seconds." >&2
  exit 1
fi

echo "Metro is ready. Launching Pro24Home in the iOS Simulator..."
if [[ -n "${IOS_DEVICE:-}" ]]; then
  npx react-native run-ios --simulator "$IOS_DEVICE"
else
  npx react-native run-ios
fi
