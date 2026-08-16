---
name: update-resume
description: Refresh Nimesh's evidence-backed resume and website career copy. Use when asked to update resume claims, add recent contributions, revise the one-page or two-page TeX resumes, synchronize native HTML career content, or generate private HR-facing PDFs with a transient phone number.
---

# Update Resume

Update public claims from qualified evidence, keep TeX and native HTML aligned, and isolate recruiter-only contact details from Git.

## Hard gates

- Read `AGENTS.md`, `docs/career-evidence.md`, and `docs/resume-and-publication.md` completely before changing claims.
- Invoke `update-career-evidence` and update its ledger before editing TeX or HTML.
- Never copy raw logs, traces, prompts, customer data, task identifiers, internal URLs, credentials, environment values, or private source paths into this repository.
- Never write a phone number into a tracked file, public asset, build output, patch, command argument, environment variable, handoff, checkpoint, or Git history.
- Preserve `resume/one-page-resume.tex` and `resume/two-page-resume.tex` as the canonical formatting references. Edit their content in place; never replace, regenerate, delete, or redesign them unless Nimesh explicitly requests a formatting change.
- Keep website title/copy public-safe. The recruiter TeX designation may differ when `AGENTS.md` explicitly defines that product boundary.
- Ask before adding or changing a number. Preserve `led`, `co-led`, `built`, `reviewed`, and `designed` exactly.
- Treat missing or sampled telemetry as unknown. Never convert absence into zero.

## 1. Discover evidence

At the start of each update:

1. Inventory the tools/connectors available in the current session and the task roots registered by repository or global instructions.
2. Query every relevant, available read-only source whose environment, project, account, and access path can be verified.
3. State which sources were checked, unavailable, irrelevant, or unsafe to query.
4. If unregistered working-task directories may contain contributions, ask one concise question listing the roots already found and requesting any additional locations. Treat supplied locations as session-only; never persist them here.

Consider these source classes whenever available:

- Local repository history, exact diffs, merged/open pull requests, review ownership, and release evidence.
- Explicit task/workspace directories, after their locations and scope are known.
- SigNoz logs/traces for current traffic, reliability, schedule, and performance evidence using environment/resource filters and bounded windows.
- Langfuse for model, prompt, tool, evaluation, and trace evidence only after project identity and a known-trace sentinel resolve; qualify sampling.
- Qdrant collection metadata or indexed exact-filter postconditions; do not export raw customer payloads for resume work.
- AWS read-only deployment/monitoring evidence when needed. Verify account, region, service, and environment first. Label estimates and assumptions; prefer measured values.
- User-confirmed historical facts when current telemetry cannot reconstruct the event.

Do not force every connector into every update. Relevance plus qualified identity controls use; connector availability alone does not.

## 2. Select claims

For each candidate, record privately during the session:

- action and exact ownership;
- shipped, productionized, designed, reviewed, or proposed state;
- outcome and denominator;
- evidence source class and observation window;
- public-safe wording and remaining unknowns.

Prefer leadership, architecture, correctness, reliability, product effect, and measured scale. Remove vanity counts and internal version names when the behavior is more informative. Present proposed new metrics to Nimesh and obtain approval before writing them.

## 3. Update all public artifacts

Apply approved claims in this order:

1. Update `docs/career-evidence.md`, its evidence status, guardrail, and snapshot date.
2. Update `resume/one-page-resume.tex` with only the strongest recruiter scan.
3. Update `resume/two-page-resume.tex` with deeper technical decisions and context.
4. Update the native semantic HTML career experience in `src/App.tsx`; do not add a PDF viewer, download, image, Drive link, or recruiter alias.
5. Check related production stories and summaries for stale or contradictory wording.

## 4. Render phone-free TeX

Load the available PDF skill before authoring PDFs and follow its render/inspection requirements.

- Compile both tracked TeX sources from temporary build directories.
- Treat every copied/intermediate TeX file as disposable and delete it after verification; only the two canonical tracked TeX sources persist.
- Require exactly one page and two pages respectively.
- Extract text and verify headings, selected claims, and absence of stale wording.
- Render every page to images and inspect density, clipping, overlap, blank pages, and link/header layout.
- Keep generated phone-free PDFs outside tracked/public paths; they are verification artifacts, not website inputs.

## 5. Optional HR-facing PDFs

After the public artifacts pass, ask exactly:

> Do you want HR-facing PDFs with a phone number? yes/no

If yes and no number was supplied in the current chat, ask for the exact display string. Do not reuse a number from memory, Git, an old PDF, a task, or another chat.

Run the bundled renderer in a PTY so the number is sent through hidden stdin, never a command argument or environment variable:

```bash
python3 .agents/skills/update-resume/scripts/render_hr_resumes.py
```

Send the user-provided value only when the process prompts. The renderer creates temporary TeX outside the repository, deletes it on exit, and writes only the two recruiter PDFs under ignored `.private/resumes/`.

After rendering:

- verify `.private/resumes/` is ignored;
- verify one/two page counts and rendered pages;
- verify tracked TeX, HTML, docs, Git diff, and Git object inputs remain phone-free;
- never stage `.private/` or copy those PDFs into `public/` or `dist/`.

## 6. Validate and publish

Run:

```bash
python3 .agents/skills/update-resume/scripts/render_hr_resumes.py --self-test
python3 /Users/nimesh/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/update-resume
npm run check
bash scripts/check-public-safety.sh
```

Review the complete staged diff. Commit, push, or update a PR only with explicit authorization, then read back the remote head and PR fields.

Google Drive replacement is a later distribution step: perform it only after Nimesh approves the rendered PDFs and explicitly authorizes the Drive write, then read back the exact destination file.
