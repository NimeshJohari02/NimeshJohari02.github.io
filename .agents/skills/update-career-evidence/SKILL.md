---
name: update-career-evidence
description: Update Nimesh OS career claims, work stories, portfolio copy, LinkedIn copy, or resume facts. Use when adding an achievement, metric, title, employer detail, project, or personal-brand statement.
---

# Update career evidence

1. Read `AGENTS.md` and `docs/career-evidence.md`.
2. Identify the evidence class: public source, private source, user-confirmed fact, or proposal.
3. Keep ownership exact. Never turn `co-led`, `reviewed`, or `designed` into `led` or `built`.
4. Ask before adding a new number. Never infer a metric from an implementation detail.
5. Write the smallest public-safe claim: capability, action, and outcome. Remove private names, URLs, identifiers, payloads, and architecture.
6. Update the evidence status, guardrail, and snapshot date in the ledger before updating website or resume copy. Record a source class, never a private source URL or path.
7. Run `npm run check`; it already includes the safety scan and resume build.
8. External publication, push, LinkedIn edits, or Drive replacement requires explicit approval.
