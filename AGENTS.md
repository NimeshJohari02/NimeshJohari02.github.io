# Nimesh OS agent guide

This repository is the public source for Nimesh Johari's portfolio and resume artifacts.

## Read first

- `docs/career-evidence.md` before changing career claims.
- `docs/resume-and-publication.md` before changing resume links, TeX, or PDFs.
- `docs/hosting.md` before changing deployment, repository visibility, DNS, or domains.

## Public boundary

- Publish capabilities, outcomes, and personal projects. Do not publish company internals, private evidence, task identifiers, logs, traces, private links, credentials, environment files, or proprietary architecture.
- Never invent or round a number without Nimesh's approval. Preserve ownership words exactly: `led`, `co-led`, `built`, `reviewed`, and `designed` are not interchangeable.
- Public title: `AI Pod Tech Lead`. Do not add `SDE 3`. Do not append `SDE 2` to the public title.
- Nimesh joined Habuild in February 2026, worked first in the CRM engineering Pod, and then moved to the AI Pod. Do not describe this as customer-support work.
- The telephone number in the resume is intentionally public. Everything else still follows the public boundary.

## Resume contract

- `resume/one-page-resume.tex` and `resume/two-page-resume.tex` are the editable sources.
- `public/resume/*.pdf` are generated artifacts. Never edit a PDF directly.
- Run `npm run resume:build` after any TeX change. It must produce exactly one and two pages respectively.
- Drive links are distribution mirrors, not editable sources. Uploading/replacing Drive files is a separate external action requiring approval.

## Change discipline

- Keep the retro Nerd Cave accessible without requiring hover, function keys, or pixel-perfect pointer use.
- Prefer native browser features, current dependencies, and the smallest correct change.
- Run `npm run check` before committing.
- Do not purchase a domain, create a remote repository, change repository visibility, deploy, or push without explicit approval.
