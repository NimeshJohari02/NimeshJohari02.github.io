#!/usr/bin/env python3
"""Render recruiter PDFs with a transient phone number outside Git."""

from __future__ import annotations

import argparse
import getpass
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


SOURCES = {
    "one-page-resume.tex": ("Nimesh_Johari_Resume_One_Page.pdf", 1),
    "two-page-resume.tex": ("Nimesh_Johari_Resume_Two_Page.pdf", 2),
}
EMAIL_LINE = r"  \faAt\ \href{mailto:nimeshjohari95@gmail.com}{nimeshjohari95@gmail.com} \\"
PHONE_PATTERN = re.compile(r"^\+?[0-9][0-9 ()-]{6,24}$")


def run(command: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)


def page_count(pdf: Path, pdfinfo: str) -> int:
    result = run([pdfinfo, str(pdf)], cwd=pdf.parent)
    match = re.search(r"^Pages:\s+(\d+)$", result.stdout, flags=re.MULTILINE)
    if result.returncode or not match:
        raise RuntimeError("Could not verify PDF page count")
    return int(match.group(1))


def render(repo: Path, phone: str, *, publish: bool) -> list[Path]:
    if not PHONE_PATTERN.fullmatch(phone):
        raise ValueError("Phone must be a 7-25 character display string using digits, spaces, +, -, or parentheses")

    tectonic = shutil.which("tectonic")
    pdfinfo = shutil.which("pdfinfo")
    pdftotext = shutil.which("pdftotext")
    if not tectonic or not pdfinfo or not pdftotext:
        raise RuntimeError("Required commands missing: tectonic, pdfinfo, and pdftotext")

    ignored_probe = repo / ".private" / "resumes" / "probe.pdf"
    ignored = run(["git", "check-ignore", "-q", "--", str(ignored_probe)], cwd=repo)
    if ignored.returncode != 0:
        raise RuntimeError(".private/resumes is not git-ignored; refusing to render recruiter PDFs")

    verified: list[tuple[Path, Path]] = []
    with tempfile.TemporaryDirectory(prefix="nimesh-hr-resume-") as build_name:
        build = Path(build_name)
        for source_name, (output_name, expected_pages) in SOURCES.items():
            source = repo / "resume" / source_name
            text = source.read_text(encoding="utf-8")
            if r"\faPhone" in text:
                raise RuntimeError(f"Tracked source contains a phone marker: {source_name}")
            if text.count(EMAIL_LINE) != 1:
                raise RuntimeError(f"Expected one canonical email header in {source_name}")

            replacement = EMAIL_LINE.removesuffix(r"\\") + rf"~|~ \faPhone\ {phone} \\"
            temporary_source = build / source_name
            temporary_source.write_text(text.replace(EMAIL_LINE, replacement), encoding="utf-8")

            compiled = run([tectonic, "--keep-logs", "--outdir", str(build), str(temporary_source)], cwd=build)
            pdf = build / source_name.replace(".tex", ".pdf")
            log = build / source_name.replace(".tex", ".log")
            if compiled.returncode != 0 or not pdf.exists():
                raise RuntimeError(f"TeX compilation failed for {source_name}; inspect the phone-free source first")
            if log.exists() and re.search(r"Overfull|Underfull", log.read_text(encoding="utf-8", errors="replace")):
                raise RuntimeError(f"Layout box warning in {source_name}")
            if page_count(pdf, pdfinfo) != expected_pages:
                raise RuntimeError(f"Unexpected page count for {source_name}")

            extracted = run([pdftotext, str(pdf), "-"], cwd=build)
            expected_digits = re.sub(r"\D", "", phone)
            extracted_digits = re.sub(r"\D", "", extracted.stdout)
            if extracted.returncode != 0 or expected_digits not in extracted_digits:
                raise RuntimeError(f"Phone was not recoverable from rendered {source_name}")

            if publish:
                destination = repo / ".private" / "resumes" / output_name
                verified.append((pdf, destination))

        for pdf, destination in verified:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(pdf, destination)

    return [destination for _, destination in verified]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true", help="Render temporary PDFs with a dummy number")
    args = parser.parse_args()

    repo = Path(__file__).resolve().parents[4]
    if args.self_test:
        render(repo, "+00 00000 00000", publish=False)
        print("HR resume renderer self-test passed")
        return 0

    if not sys.stdin.isatty():
        print("Refusing non-interactive phone input; run this command in a PTY", file=sys.stderr)
        return 2
    phone = getpass.getpass("Phone for recruiter PDFs (input hidden): ").strip()
    outputs = render(repo, phone, publish=True)
    for output in outputs:
        print(f"Rendered {output.relative_to(repo)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1) from None
