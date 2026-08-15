#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

phone_pattern='(t[e]l:[^}[:space:]]+|[+]91[[:space:]-]*[6-9][0-9]{4}[[:space:]-]?[0-9]{5}|(^|[^0-9])[6-9][0-9]{4}[[:space:]-]?[0-9]{5}([^0-9]|$))'
distribution_link_pattern='https?://(bit[.]ly|drive[.]google[.]com)/'

if find . \( -path './.git' -o -path './node_modules' \) -prune -o \
  \( -name '.env' -o -name '.env.*' \) -print | grep -q .; then
  echo "Environment file found. Public repository check failed." >&2
  exit 1
fi

if find . \( -path './.git' -o -path './node_modules' \) -prune -o -type f \
  \( -path './public/resume/*' -o -iname '*resume*.pdf' -o -iname '*resume*.png' \
     -o -iname '*resume*.jpg' -o -iname '*resume*.jpeg' -o -iname '*resume*.webp' \
     -o -iname '*resume*.avif' \) -print -quit | grep -q .; then
  echo "Generated resume artifact found. The website must remain native HTML." >&2
  exit 1
fi

if rg -q --hidden -g '!node_modules/**' -g '!.git/**' \
  "$distribution_link_pattern" .; then
  echo "Private distribution link found. Public repository check failed." >&2
  exit 1
fi

if rg -q --hidden -g '!node_modules/**' -g '!.git/**' "$phone_pattern" .; then
  echo "Telephone-shaped content found. Public repository check failed." >&2
  exit 1
fi

while IFS= read -r commit; do
  if git grep -I -q -E "$phone_pattern" "$commit" --; then
    echo "Telephone-shaped content found in reachable Git history." >&2
    exit 1
  fi

  if git grep -I -q -E "$distribution_link_pattern" "$commit" --; then
    echo "Private distribution link found in reachable Git history." >&2
    exit 1
  fi
done < <(git rev-list --all)

if git rev-list --objects --all | awk '$2 ~ /^public\/resume\// || $2 ~ /(^|\/)[^\/]*resume[^\/]*\.(pdf|png|jpg|jpeg|webp|avif)$/ { found=1 } END { exit !found }'; then
  echo "Resume artifact found in reachable Git history." >&2
  exit 1
fi

if rg -q --hidden -g '!node_modules/**' -g '!.git/**' \
  '(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|(?i)(api[_-]?key|secret|password|access[_-]?token)[[:space:]]*[:=][[:space:]]*["'\''`][^"'\''`[:space:]]{8,})' .; then
  echo "Secret-shaped content found. Inspect before publication." >&2
  exit 1
fi

echo "Public safety scan passed."
