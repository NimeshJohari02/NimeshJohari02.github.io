#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

if find . \( -path './.git' -o -path './node_modules' \) -prune -o \
  \( -name '.env' -o -name '.env.*' \) -print | grep -q .; then
  echo "Environment file found. Public repository check failed." >&2
  exit 1
fi

if rg -n --hidden \
  -g '!node_modules/**' -g '!dist/**' -g '!.git/**' -g '!public/resume/*.pdf' \
  '(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|(?i)(api[_-]?key|secret|password|access[_-]?token)[[:space:]]*[:=][[:space:]]*["'\''`][^"'\''`[:space:]]{8,})' .; then
  echo "Secret-shaped content found. Inspect before publication." >&2
  exit 1
fi

echo "Public safety scan passed."
