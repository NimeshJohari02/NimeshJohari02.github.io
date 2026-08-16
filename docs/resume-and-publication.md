# Resume source and publication

## Authoring sources

There are two intentional resume products:

- `resume/one-page-resume.tex`: the concise recruiter version.
- `resume/two-page-resume.tex`: the deeper technical version.

These phone-free TeX files support Nimesh's separate resume-authoring workflow. The two layouts share content manually because their space constraints and bullet selection differ; introduce shared data only if real content drift becomes recurring.

Their current layout, formatting, and structure are canonical references. Resume updates edit these files in place. Temporary copies used for phone injection, compilation, or iteration are disposable and must not replace the canonical sources.

They are not website inputs. Overleaf or a local TeX tool may compile them outside the public-site workflow, but generated PDFs must stay outside `public/`, `dist/`, tracked files, and Git history. Private recruiter PDFs may be generated under ignored `.private/resumes/`; temporary phone-bearing TeX must be created outside the repository and deleted after rendering.

## Website career experience

The public website presents a curated career dossier as native semantic HTML in `src/App.tsx`. It is selectable, searchable, screen-reader-readable, keyboard-operable, responsive, and printable without a PDF viewer or image fallback.

The Vite build must not compile, copy, embed, rasterize, expose, or link a resume PDF or resume image. It must not contain Drive or Bitly recruiter links. The exact user-approved Google Kick Start certificate URL may remain in both TeX sources, but it must not enter the website build. Email is the public direct-contact channel; LinkedIn and GitHub remain public profile links.

Career facts shown in the HTML experience come from `docs/career-evidence.md`. Preserve ownership wording and approved precision; never invent, round, or silently strengthen a claim.

## Private recruiter rendering and distribution

The `update-resume` skill may ask for a phone number in the active chat and pass it through hidden process input to `.agents/skills/update-resume/scripts/render_hr_resumes.py`. The number must never be recovered from old artifacts or stored in tracked files, shell arguments, environment variables, documentation, tests, handoffs, or Git history. The renderer writes only ignored `.private/resumes/*.pdf`; those files are local artifacts, not repository or website content.

Recruiter aliases, destinations, private contact details, and generated PDFs must never appear in the website, public build, tracked files, or Git history.

Uploading or replacing a recruiter file and changing a private alias are separate external actions. Each requires explicit approval and destination readback.

## Public-data boundary

Email is the public contact method. Telephone numbers, recruiter PDFs, credentials, environment values, private evidence links, and company internals are never permitted in the repository.
