#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:?Set DOMAIN before running this script}"
EMAIL="${EMAIL:?Set EMAIL before running this script}"

sudo certbot --nginx -d "$DOMAIN" -m "$EMAIL" --agree-tos --no-eff-email --redirect
