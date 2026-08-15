---
name: build-resumes
description: Edit, compile, verify, or publish the Nimesh OS one-page and two-page LaTeX resumes or their website and Drive links.
---

# Build resumes

1. Read `AGENTS.md`, `docs/career-evidence.md`, and `docs/resume-and-publication.md`.
2. Edit only the affected canonical TeX source or sources. Keep shared facts consistent across both variants; do not edit generated PDFs.
3. Preserve the existing macros, icons, A4 layout, and deliberate one-page/two-page differences.
4. Run `npm run resume:build`; page counts must remain one and two.
5. Render changed PDFs to images and inspect every page for clipping, overlap, missing icons, and unreadable density.
6. Run `npm run check`; it already includes the safety scan and resume build.
7. Drive upload, deployment, and push are separate external actions requiring explicit approval and readback.
