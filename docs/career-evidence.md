# Public career evidence

This is the publishable claim ledger for the portfolio, LinkedIn, GitHub profile, and resumes. It is intentionally smaller than the private evidence archive. The private archive contains internal links and operational detail that must not enter a public repository.

Snapshot date: 15 August 2026.

## Habuild

| Public claim | Ownership | Evidence status | Publication guardrail |
|---|---|---|---|
| AI Pod Tech Lead, leading three developers across agent architecture, delivery, review quality, model evaluation, observability, cost, and production reliability. | Led | Formally communicated leadership; user-confirmed team size. | Use `AI Pod Tech Lead` publicly. Do not add a higher engineering level. |
| Joined the CRM engineering Pod in February 2026 before moving to the AI Pod. | Built and operated | Resume and user-confirmed timeline. | Always say `CRM engineering Pod`; this was engineering work, not customer support. |
| Worked on ordered multi-response messaging over SQS, retries, duplicate prevention, caching, search, escalation, and recovery; replaced three high-value routes reported at 96--100% failure. | Built and operated | Resume plus private engineering evidence. | Describe the capability; omit private service names, payload details, and test-count vanity metrics. |
| Productionized a LangGraph multi-agent platform across prompts, routing, tools, memory, evaluation, and observability. | Led | Resume plus private engineering evidence. | Do not publish private topology, credentials, tenant data, or internal URLs. |
| Led production model changes across 14 runtime slots with centralized assignments, capability validation, API/worker fail-fast checks, fallback and rollback boundaries, and model/provider/prompt provenance. | Led | User-confirmed production model rollout plus private evidence. | Do not reduce this to one model variant or invent quality, token, latency, or cost improvement percentages. |
| Reduced self-hosted Langfuse and ClickHouse storage from 175 GiB to 12 GiB through system-log cleanup, retention, and trace-volume controls. | Co-led | User-approved numbers and ownership wording. | Keep `co-led`; do not imply sole ownership. |
| Productionized hybrid Qdrant retrieval with dense question/answer vectors, sparse BM25, HNSW tuning, binary quantization, and reciprocal-rank fusion; designed and hardened asynchronous Memory V3 worker ownership, idempotency, stale-event controls, MemoryDB coordination, and fail-open recall. | Led, built, and designed | Private implementation, review, and runtime evidence. | Publish technical decisions and invariants, not private schemas, prompts, exact endpoints, or tenant data. |
| Reduced matched legacy AI-chat logs from 84,674 to 417 by removing redundant/noisy emitters while preserving observation traceability and query-level debugging. | Led and built | Controlled matched-window validation. | State that the approximately USD 14/day saving was a target unless realized billing evidence is available. |
| Replaced a repeated-SELECT 6 x N eligibility-hydration read path with one grouped aggregate query on a workflow associated with approximately 40 million reads. | Reviewed and delivered | Private source and performance evidence. | Keep `associated with` and `approximately`; do not invent a latency or cost improvement. |
| Led cleanup of an approximately 400-file staging/main divergence and restored a controlled release path. | Led | User-confirmed plus private repository evidence. | `Approximately 400 files` is the approved precision. |
| Introduced AI-assisted PR review gates in the AI Pod. | Led | User-confirmed rollout scope. | Do not claim company-wide enforcement. |
| Trained 200+ colleagues, mostly support staff, on Claude Code and AI-assisted workflows. | Led training | User-confirmed audience and count. | This is training/adoption work, not product-user scale. |

## Freecharge

| Public claim | Ownership | Evidence status | Publication guardrail |
|---|---|---|---|
| Senior Software Engineer, Backend, February 2024 to January 2026. | Role | Resume. | Keep dates aligned with the canonical resume. |
| Led 3–4 backend engineers on the credit-card acquisition journey and owned design, planning, stakeholder alignment, and delivery. | Led | Resume. | Do not broaden this to an organization-wide management role. |
| Built event-driven journeys and reliability controls using SQS, Redis, MongoDB, Elasticsearch, and BullMQ. | Built | Resume. | Technical detail is public-safe; internal service names are not. |
| Shipped UTM-instrumented drop-off retargeting that brought 27% of dropped users back into the credit-card application journey. | Built | Resume metric plus user-confirmed attribution. | Keep this separate from the 32% A/B experimentation outcome. |
| Validated Elasticsearch against PostgreSQL full-text search for lakhs-scale organization matching, reducing lookup latency by approximately 60% in the proof of concept. | Built and evaluated | Resume metric plus user-confirmed benchmark scope. | This is a workload-specific POC result, not a universal PostgreSQL-versus-Elasticsearch claim. |
| Built BullMQ pre/post-check pipelines with read-before-write retry guards around non-idempotent third-party writes and background cache preloading for slow banking APIs. | Built | User-confirmed architecture and correctness boundary. | Never describe the retry path as blind resubmission of non-idempotent writes. |
| Designed stateless A/B experimentation for card recommendations using deterministic application bucketing, improving application-funnel efficiency by 32%. | Designed and built | Resume metric plus user-confirmed attribution. | Keep this separate from the 27% drop-off-retargeting outcome. |
| Led shared service-template migration with linting and security checks, reducing review time by 50%. | Led | Resume metric. | Do not describe this as a company-wide platform unless separately verified. |

## BYJU'S

| Public claim | Ownership | Evidence status | Publication guardrail |
|---|---|---|---|
| Member of Technical Staff 1, September 2022 to January 2024. | Role | Resume. | Keep the formal title. |
| Extended an inherited customer-management service through adapter patterns and minimal-change integration to onboard acquired school businesses during incremental strangler-pattern retirement of legacy systems. | Built and operated | User-confirmed project ownership. | Omit internal repository names, layoffs, proprietary topology, and acquired-business identifiers. |
| Built Node.js, NestJS, and Spring Boot APIs across parent-facing catalog, payment, and order flows on a multi-brand platform operating at approximately 200 requests/second. | Built | Contemporaneously recorded resume scale, externally plausible but no longer independently verifiable. | Keep `approximately`, scope it to the aggregated parent-facing platform, and do not present it as freshly verified telemetry. |
| Built the API-contract and proxy layer for a Haptik-based self-service assistant, partnering with product on conversational flows and reducing technical-support queries by 40%. | Built | Resume metric plus user-confirmed ownership boundary. | Describe self-service/query reduction, not workforce consequences or proprietary conversational logic. |
| Improved PostgreSQL read performance by approximately 38% through ORM-query analysis, simple/composite index selection, and query-planner inspection. | Built | Contemporaneously recorded resume metric plus user-confirmed technical method. | Preserve `approximately`; the historical benchmark cannot now be reconstructed. |

## Personal identity

- Friendly Neighborhood AI Prompt Tuner: playful personal tagline, not a formal job title.
- Google Kick Start 2021 Round G global rank 6995: user-approved public achievement backed by a public certificate link. The exact certificate URL may appear only in both TeX resume sources, not in the website build.
- Uses AI heavily while reviewing code, testing claims, and owning the final judgment.
- Uses speech-to-text, text-to-speech, terminal agents, Linux/macOS tiling workflows, and small automations as practical productivity tools.
- The original hand-built pre-AI portfolio remains part of the public history.

## Evidence boundary

The source snapshot used to derive this ledger has SHA-256 `d396cd9886bf0fe8e332977a8e8ee0c486adf032c1d6461a6496e9158b299b85`. It remains private because it contains internal task manifests and operational evidence. Future changes must update this ledger from verified evidence; they must not copy the private archive into this repository.
