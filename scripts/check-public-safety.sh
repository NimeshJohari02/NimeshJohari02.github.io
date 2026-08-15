#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

phone_pattern='(t[e]l:[^}[:space:]]+|[+]91[[:space:]-]*[6-9][0-9]{4}[[:space:]-]?[0-9]{5}|(^|[^0-9])[6-9][0-9]{4}[[:space:]-]?[0-9]{5}([^0-9]|$))'
distribution_link_pattern='https?://(bit[.]ly|drive[.]google[.]com)/[^}[:space:]]+'
approved_certificate_sha256='e857f99abfdfe09a4e0af9ecf8c6d1e33f5fa4a8bee57ddbac9a911b1f49595f'

link_is_approved() {
  case "$1" in
    resume/one-page-resume.tex|resume/two-page-resume.tex) ;;
    *) return 1 ;;
  esac

  [[ "$(printf '%s' "$2" | shasum -a 256 | awk '{print $1}')" == "$approved_certificate_sha256" ]]
}

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

while IFS= read -r match; do
  file_path="${match%%:*}"
  url="${match#*:*}"
  url="${url#*:}"
  if ! link_is_approved "$file_path" "$url"; then
    echo "Unapproved distribution link found. Public repository check failed." >&2
    exit 1
  fi
done < <(rg -n -o --no-heading --hidden -g '!node_modules/**' -g '!.git/**' "$distribution_link_pattern" . | sed 's#^\./##' || true)

if rg -q --hidden -g '!node_modules/**' -g '!.git/**' "$phone_pattern" .; then
  echo "Telephone-shaped content found. Public repository check failed." >&2
  exit 1
fi

while IFS= read -r commit; do
  if git grep -I -q -E "$phone_pattern" "$commit" --; then
    echo "Telephone-shaped content found in reachable Git history." >&2
    exit 1
  fi

  while IFS= read -r match; do
    match="${match#"$commit":}"
    file_path="${match%%:*}"
    url="${match#*:*}"
    url="${url#*:}"
    if ! link_is_approved "$file_path" "$url"; then
      echo "Unapproved distribution link found in reachable Git history." >&2
      exit 1
    fi
  done < <(git grep -I -n -o -E "$distribution_link_pattern" "$commit" -- || true)
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
