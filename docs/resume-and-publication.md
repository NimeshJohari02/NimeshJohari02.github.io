# Resume source and publication

## Source of truth

There are two intentional resume products:

- `resume/one-page-resume.tex`: the concise recruiter version.
- `resume/two-page-resume.tex`: the deeper technical version.

These TeX files are the only editable resume sources. Generated PDFs under `public/resume/` are outputs, not parallel documents. The two layouts currently share content manually because their space constraints and bullet selection differ; a shared data abstraction should be introduced only if real content drift becomes recurring.

## Build and verification

Run:

```bash
npm run resume:build
```

The script uses Tectonic, writes both PDFs to `public/resume/`, and rejects page-count drift. Visual changes should also be rendered to images and inspected before publication.

The canonical sources were captured on 15 August 2026 after normalizing the AI role title to `AI Pod Tech Lead`:

- One page: SHA-256 `2c039ca93d1c9381f3bf98b5a9dd80630c2aa82ca13a8db6ddcf740c4e28655c`
- Two page: SHA-256 `293a324f049e4152164e122f4bbd3e074d058f0bdbdc5e47edc305b8da977832`

## Website and Drive

The website serves repository-built PDFs so code controls the rendered artifact. The existing Google Drive files remain shareable mirrors:


Replacing a Drive file is a manual external publication step. After replacement, open both links in a signed-out browser and verify the correct page count and download access. A future embedded viewer should use the browser's native PDF support; a custom PDF-viewer dependency is unnecessary.

## Public-data decision

The email address and telephone number in the TeX sources are intentionally public resume contact details. Credentials, environment values, private evidence links, and company internals are never permitted.
