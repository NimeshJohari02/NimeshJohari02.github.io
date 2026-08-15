#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="$repo_dir/public/resume"
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-0}"

command -v tectonic >/dev/null || { echo "tectonic is required" >&2; exit 1; }
command -v pdfinfo >/dev/null || { echo "pdfinfo is required" >&2; exit 1; }

mkdir -p "$output_dir"
tectonic --outdir "$output_dir" "$repo_dir/resume/one-page-resume.tex"
tectonic --outdir "$output_dir" "$repo_dir/resume/two-page-resume.tex"

one_pages="$(pdfinfo "$output_dir/one-page-resume.pdf" | awk '/^Pages:/ { print $2 }')"
two_pages="$(pdfinfo "$output_dir/two-page-resume.pdf" | awk '/^Pages:/ { print $2 }')"

[[ "$one_pages" == 1 ]] || { echo "one-page resume produced $one_pages pages" >&2; exit 1; }
[[ "$two_pages" == 2 ]] || { echo "two-page resume produced $two_pages pages" >&2; exit 1; }

echo "Built one-page-resume.pdf (1 page) and two-page-resume.pdf (2 pages)."
