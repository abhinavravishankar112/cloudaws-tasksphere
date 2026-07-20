#!/usr/bin/env bash
set -euo pipefail

dnf update -y
dnf install -y docker docker-compose-plugin git nginx
systemctl enable --now docker
systemctl enable --now nginx
usermod -aG docker ec2-user || true
