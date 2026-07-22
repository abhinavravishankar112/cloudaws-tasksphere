#!/usr/bin/env bash
set -euo pipefail

sudo certbot renew --quiet
sudo systemctl reload nginx
