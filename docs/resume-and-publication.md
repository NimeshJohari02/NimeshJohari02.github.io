# Resume source and publication

## Authoring sources

There are two intentional resume products:

- `resume/one-page-resume.tex`: the concise recruiter version.
- `resume/two-page-resume.tex`: the deeper technical version.

These phone-free TeX files support Nimesh's separate resume-authoring workflow. The two layouts share content manually because their space constraints and bullet selection differ; introduce shared data only if real content drift becomes recurring.

They are not website inputs. Overleaf or a local TeX tool may compile them outside the public-site workflow, but generated PDFs must stay outside `public/`, `dist/`, tracked files, and Git history.

## Website career experience

The public website presents a curated career dossier as native semantic HTML in `src/App.tsx`. It is selectable, searchable, screen-reader-readable, keyboard-operable, responsive, and printable without a PDF viewer or image fallback.

The Vite build must not compile, copy, embed, rasterize, expose, or link a resume PDF or resume image. It must not contain Drive or Bitly recruiter links. The exact user-approved Google Kick Start certificate URL may remain in both TeX sources, but it must not enter the website build. Email is the public direct-contact channel; LinkedIn and GitHub remain public profile links.

Career facts shown in the HTML experience come from `docs/career-evidence.md`. Preserve ownership wording and approved precision; never invent, round, or silently strengthen a claim.

## Private recruiter distribution

Recruiter PDFs are managed and versioned privately outside this repository. Their aliases, destinations, files, and private contact details must never appear in the repository, website, documentation, tests, generated bundle, or Git history.

Uploading or replacing a recruiter file and changing a private alias are separate external actions. Each requires explicit approval and destination readback.

## Public-data boundary

Email is the public contact method. Telephone numbers, recruiter PDFs, credentials, environment values, private evidence links, and company internals are never permitted in the repository.
