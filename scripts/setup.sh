#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

npm install
npx prisma generate

echo "Project setup complete."
