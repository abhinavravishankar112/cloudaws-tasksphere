#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

docker compose up -d --build
docker compose exec -T app npx prisma migrate deploy

echo "Deployment complete."
