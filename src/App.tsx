import { useEffect, useRef, useState } from 'react'
import './App.css'

const panelIds = ['map', 'resume', 'work', 'stories', 'projects', 'learning', 'nerd', 'voice', 'legacy', 'lab'] as const
type Panel = typeof panelIds[number]
type Story = readonly [tag: string, title: string, body: string]

const links = {
  email: 'mailto:nimeshjohari95@gmail.com',
  github: 'https://github.com/NimeshJohari02',
  leetcodeGrind: 'https://github.com/NimeshJohari02/LeetCodeGrind',
  linkedin: 'https://www.linkedin.com/in/nimeshjohari02/',
} as const

const base = import.meta.env.BASE_URL

const destinations: { id: Panel; label: string; hint: string; className: string }[] = [
  { id: 'resume', label: 'RESUME.EXE', hint: 'Native career dossier', className: 'resume' },
  { id: 'work', label: 'WORK.LOG', hint: 'Habuild · Freecharge · BYJU\'S', className: 'work' },
  { id: 'projects', label: 'PERSONAL.ARTIFACTS', hint: 'Featured builds and the road here', className: 'projects' },
  { id: 'learning', label: 'LEARNING/', hint: 'DSA, Java, systems and rabbit holes', className: 'learning' },
  { id: 'nerd', label: 'NERD.STUFF', hint: 'Tiling windows since before it was cool', className: 'nerd' },
  { id: 'voice', label: 'VOICE.WORKFLOWS', hint: 'Speech-to-text, text-to-speech and terminal agents', className: 'voice' },
  { id: 'legacy', label: 'LEGACY.HTML', hint: 'The handmade pre-AI website', className: 'legacy' },
  { id: 'stories', label: 'PRODUCTION.STORIES', hint: 'Things broke. The evidence told the story.', className: 'stories' },
]

const featuredProjects = [
  {
    name: 'E2E AGENTIC CHAT',
    period: '2026 · CODING-AGENT EXPERIMENT',
    description: 'A human-directed coding-agent experiment that built a local NestJS support-chat POC with FAQ routing, pgvector search, model-provider switching, Docker and human-agent paths.',
    context: 'LOCAL POC · NOT DEPLOYED',
    url: 'https://github.com/NimeshJohari02/E2E-Chat-Agentic',
  },
  {
    name: 'DAWAI APP',
    period: '2026 · AI PRODUCT POC',
    description: 'An AI-assisted medicine-reminder experiment with prescription parsing, schedule generation, family profiles and browser notifications.',
    context: 'LOCAL POC · NOT DEPLOYED',
    url: 'https://github.com/NimeshJohari02/dawai-app',
  },
  {
    name: 'LOG INGESTOR PIPELINE',
    period: '2023 · SYSTEMS PIPELINE',
    description: 'A Go service that accepts logs, writes them locally and routes them through Logstash into Elasticsearch and Kibana to explore ingestion and observability.',
    context: 'GO · ELK · LOCAL SYSTEMS BUILD',
    url: 'https://github.com/NimeshJohari02/log-ingestor-pipeline',
  },
  {
    name: 'YOUTUBE API TASK',
    period: '2022 · API + SEARCH',
    description: 'A scheduled YouTube ingestion service with API polling, Elasticsearch-backed search, pagination, Docker and Kibana.',
    context: 'NODE.JS · ELASTICSEARCH · COLLEGE PROJECT',
    url: 'https://github.com/NimeshJohari02/Youtube-Api-Task',
  },
] as const

const buildHistory = [
  { period: 'MAR 2020', name: 'HTMLTRY', description: 'The first webpage: raw HTML and CSS, before frameworks became the default.', url: 'https://github.com/NimeshJohari02/HTMLtry' },
  { period: 'JUL 2020', name: 'BOXMAKER', description: 'An early React state-and-forms exercise that creates configurable boxes.', url: 'https://github.com/NimeshJohari02/BoxMaker' },
  { period: 'JUL 2020', name: 'LIGHTS OUT REACT', description: 'A course-era React implementation of the Lights Out puzzle.', url: 'https://github.com/NimeshJohari02/LightsOutReact' },
  { period: 'OCT 2021', name: 'GOLANG REST API', description: 'A native Go API exploring JWT authentication, MongoDB, GridFS uploads and user/post routes.', url: 'https://github.com/NimeshJohari02/Golang-RestAPI' },
  { period: 'JAN 2024', name: 'GRPC GOLANG ARCHITECTURE', description: 'A small Go and Protocol Buffers client/server for ticket purchases, receipts and seat allocation.', url: 'https://github.com/NimeshJohari02/grpc-golang-architecture' },
  { period: 'OCT 2025', name: 'RATE LIMITER', description: 'Spring Boot implementations of fixed-window, leaky-bucket and token-bucket rate limiting for comparing their trade-offs.', url: 'https://github.com/NimeshJohari02/rate-limiter' },
] as const

const stories: Story[] = [
  ['01 · OBSERVABILITY', 'The disk that ate the traces', 'Co-led recovery and retention work for self-hosted Langfuse/ClickHouse. Trace storage fell from 175 GiB to 12 GiB without turning observability off.'],
  ['02 · RELEASES', 'Four hundred files apart', 'Led cleanup of a roughly 400-file staging/main divergence and restored a controlled promotion path.'],
  ['03 · CORRECTNESS', 'Shadow first, enforce second', 'Led receipt-backed guardrails that match action claims to same-turn tool outcomes. A 63K-turn audit found 31 unsupported claims before bounded retry and escalation enforcement.'],
  ['04 · RETRIEVAL', 'Memory needs boring machinery', 'Designed asynchronous memory that distills chats into durable facts and episodes, retrieves the relevant pieces into agent context and keeps follow-up work off the chat hot path.'],
  ['05 · CRM', 'Replies must arrive in order', 'Shipped queue-backed multi-response delivery with bounded retries and duplicate-call protection for a high-throughput messaging system.'],
  ['06 · DEBUGGING', 'Follow the whole failure', 'Trace input, routing, tools, state, downstream effects and delivery. Preserve “unknown” when telemetry ends instead of inventing an RCA.'],
  ['07 · MODELS', 'Changing the engine mid-flight', 'Led model changes across 14 runtime slots with capability checks, fail-fast validation, fallback boundaries and model, provider and prompt identity in observability.'],
  ['08 · PERFORMANCE', 'One grouped read beats a query fan-out', 'Collapsed repeated eligibility lookups into a grouped query on a high-read path, then used planner and runtime evidence to validate the result.'],
  ['09 · CUSTOMER INSIGHT', 'Ten thousand signals need evidence', 'Led production hardening of hourly customer-insight digests with code-computed metrics, quote-verified evidence, real-time spike detection and six-tool natural-language analysis.'],
  ['10 · ENGINEERING SYSTEMS', 'Review the code that will actually run', 'Introduced AI-assisted exact-head review gates inside the Pod and led cleanup of release drift before adding more features.'],
]

function panelFromHash(): Panel | null {
  const hash = window.location.hash.slice(1) as Panel
  return panelIds.includes(hash) ? hash : null
}

function App() {
  const [panel, setPanel] = useState<Panel | null>(panelFromHash)

  useEffect(() => {
    const syncPanel = () => setPanel(panelFromHash())
    window.addEventListener('hashchange', syncPanel)
    return () => window.removeEventListener('hashchange', syncPanel)
  }, [])

  const closePanel = () => {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setPanel(null)
  }

  return (
    <main className="os-shell">
      <a className="skip-link" href="#map">Skip the room; open the directory</a>

      <header className="system-bar">
        <span className="system-status"><i /> EIGHT REAL HOTSPOTS · HOVER OPTIONAL · TAB WORKS</span>
        <nav aria-label="Primary navigation">
          <a href="#resume">RESUME</a>
          <a href="#stories">PRODUCTION STORIES</a>
          <a href="#projects">PROJECTS</a>
          <a href={links.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
          <a href={links.email}>CONTACT</a>
        </nav>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">THE NERD CAVE</p>
        <h1 id="page-title">Nimesh Johari</h1>
        <p className="role">AI Pod Tech Lead · Production Agent Systems · Distributed Backends</p>
        <p className="proof">Leading a three-developer AI Pod across architecture, delivery, reliability, evaluation, observability and cost.</p>
        <div className="intro-links">
          <a className="primary" href="#resume">OPEN RESUME</a>
          <a href="#stories">READ PRODUCTION STORIES</a>
          <a href={links.github} target="_blank" rel="noreferrer">VIEW GITHUB ↗</a>
        </div>
      </section>

      <section className="cave" aria-label="Interactive Nerd Cave">
        <img className="directory-background" src={`${base}concepts/nerd-cave-billu.webp`} alt="" />
        <div className="scene-frame">
          <div className="scene-layer">
            <img src={`${base}concepts/nerd-cave-billu.webp`} alt="Pixel-art developer room with eight interactive objects and Billu Bhai resting on a green chair" />
            <div className="cave-shade" />

            <nav className="desktop-hotspots" aria-label="Objects in the Nerd Cave">
              {destinations.map(({ id, label, hint, className }) => (
                <a className={`hotspot hotspot--${className}`} href={`#${id}`} key={id} aria-label={`${label}: ${hint}`} />
              ))}
            </nav>
          </div>
        </div>
        <p className="billu-note">billu bhai -- here, like always &lt;3</p>

        <nav className="directory" id="map" aria-label="Nerd Cave directory">
          <p>ROOM DIRECTORY</p>
          {destinations.map(({ id, label, hint }) => (
            <a href={`#${id}`} key={id}><b>{label}</b><span>{hint}</span></a>
          ))}
          <div className="directory-socials">
            <a href={links.email}>EMAIL</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
            <a href={links.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
          </div>
        </nav>
      </section>

      {panel && <InfoPanel panel={panel} onClose={closePanel} />}
    </main>
  )
}

function InfoPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="info-panel crt-surface"
      aria-labelledby="panel-title"
      onClose={onClose}
      onMouseDown={(event) => { if (event.target === event.currentTarget) ref.current?.close() }}
    >
      <header>
        <h2 id="panel-title">{panelTitles[panel]}</h2>
        <button type="button" aria-label="Close window" onClick={() => ref.current?.close()}>ESC ×</button>
      </header>
      <div className="panel-body">{panelContent[panel]}</div>
    </dialog>
  )
}

const panelTitles: Record<Panel, string> = {
  map: 'MAP.EXE · EVERYTHING WORKS WITHOUT THE MAP TOO',
  resume: 'RESUME.EXE · CAREER.LOG',
  work: 'WORK.LOG',
  stories: 'PRODUCTION.STORIES',
  projects: 'PERSONAL.ARTIFACTS · PROJECT HISTORY',
  learning: 'LEARNING/',
  nerd: 'NERD.STUFF',
  voice: 'VOICE.WORKFLOWS',
  legacy: 'LEGACY.HTML · PRE-AI ARTIFACT',
  lab: 'GLITCH//LAB',
}

const panelContent: Record<Panel, React.ReactNode> = {
  map: (
    <div className="directory-grid">
      {destinations.map(({ id, label, hint }) => (
        <a href={`#${id}`} key={id}><b>{label}</b><span>{hint}</span></a>
      ))}
      <a href="#lab"><b>GLITCH//LAB</b><span>A tiny incident-response toy</span></a>
    </div>
  ),
  resume: <ResumePanel />,
  work: (
    <div className="timeline">
      <article><time>2026 — NOW</time><h2>Habuild · AI Pod Tech Lead</h2><p>Lead a three-developer Pod across architecture, delivery, PR quality, reliability and cost for a legacy-to-LangGraph AI platform spanning 30+ tools and 48K+ daily user queries.</p><p>Productionized customer-insight, conversational-memory and receipt-backed correctness systems after starting in CRM engineering on ordered messaging, retries, caching, search and recovery.</p></article>
      <article><time>2024 — 2026</time><h2>Freecharge · Senior Software Engineer, Backend</h2><p>Led 3–4 backend engineers on credit-card acquisition. Built event-driven journeys with SQS, Redis and Elasticsearch; shipped reliability, experimentation and recovery work.</p></article>
      <article><time>2022 — 2024</time><h2>BYJU'S · Member of Technical Staff 1</h2><p>Built Java/Spring Boot catalog, payment and order services, then onboarding and chatbot workflows that made common support problems self-serve.</p></article>
    </div>
  ),
  stories: <StoriesPanel />,
  projects: <ProjectsPanel />,
  learning: (
    <div>
      <p className="lede">College placements are anxious. Code became the coping mechanism.</p>
      <p>The archive keeps DSA implementations, C/C++ exercises and early web experiments so the learning trail stays honest. Current rabbit holes include Java internals, distributed systems, agent evaluation and whatever broke in production this week.</p>
      <p>The learning loop: run the thing, break the thing, understand why it broke and leave useful notes.</p>
      <div className="panel-links"><a className="primary" href={links.leetcodeGrind} target="_blank" rel="noreferrer">OPEN LEETCODE GRIND ↗</a></div>
    </div>
  ),
  nerd: (
    <div>
      <p className="lede">Tiny annoyances attract unreasonable automation.</p>
      <ul className="plain-list">
        <li>Years of Linux tiling window managers made keyboard navigation the default. macOS now tiles itself too; manually arranging windows feels like packet loss.</li>
        <li>This portfolio's hand-built ancestor stays alive as evidence.</li>
        <li>I use AI heavily, review its code, test its claims and argue with its prompts.</li>
        <li>New model, weird CLI, better shortcut? Probably tested before lunch.</li>
      </ul>
      <div className="panel-links"><a href="#lab">OPEN GLITCH//LAB →</a></div>
    </div>
  ),
  voice: (
    <div>
      <p className="lede">A keyboard is occasionally the slow fallback path.</p>
      <p>Flow currently records <strong>154 WPM</strong>—top <strong>0.1%</strong>—with <strong>126,503 words</strong> dictated across <strong>45 apps</strong>. Speech-to-text handles context dumps, prompts and rough specs.</p>
      <p>Text-to-speech handles long rereads; the diff still gets inspected, tests still run and judgment stays manual.</p>
    </div>
  ),
  legacy: (
    <div>
      <p className="lede">Before AI completed everyone's sentences, I completed my own divs.</p>
      <p>The 2021 portfolio was written by hand: old values, old CSS, honest origin story. It stays exactly where it is.</p>
      <div className="panel-links">
        <a className="primary" href="https://nimeshjohari02.github.io/myportfolio/" target="_blank" rel="noreferrer">OPEN THE 2021 SITE ↗</a>
        <a href="https://github.com/NimeshJohari02/myportfolio" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a>
        <a href="https://github.com/NimeshJohari02/LightsOutReact" target="_blank" rel="noreferrer">LIGHTS OUT ↗</a>
        <a href="https://github.com/NimeshJohari02/BoxMaker" target="_blank" rel="noreferrer">BOXMAKER ↗</a>
      </div>
    </div>
  ),
  lab: <GlitchLab />,
}

function ProjectsPanel() {
  return (
    <div className="projects-panel">
      <section aria-labelledby="featured-builds-title">
        <div className="project-section-heading">
          <div>
            <p>~/projects/featured</p>
            <h3 id="featured-builds-title">FEATURED.BUILDS</h3>
          </div>
          <span>04 SELECTED</span>
        </div>
        <p className="project-intro">Systems, APIs and agent experiments—shown for what they were built to explore.</p>
        <div className="featured-project-grid">
          {featuredProjects.map(({ name, period, description, context, url }) => (
            <a className="featured-project" href={url} target="_blank" rel="noreferrer" key={name}>
              <time>{period}</time>
              <h4>{name}</h4>
              <p>{description}</p>
              <span>{context}</span>
              <b>VIEW REPOSITORY ↗</b>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="build-history-title">
        <div className="project-section-heading">
          <div>
            <p>~/projects/history</p>
            <h3 id="build-history-title">BUILD.HISTORY</h3>
          </div>
          <span>START → NOW</span>
        </div>
        <p className="project-intro">The trail from a first webpage through React exercises, backend systems and later architecture experiments.</p>
        <ol className="build-history">
          {buildHistory.map(({ period, name, description, url }) => (
            <li key={name}>
              <time>{period}</time>
              <a href={url} target="_blank" rel="noreferrer">
                <b>{name} ↗</b>
                <span>{description}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function StoriesPanel() {
  const renderStory = ([tag, title, body]: Story) => (
    <article key={tag}><p>{tag}</p><h2>{title}</h2><span>{body}</span></article>
  )

  return (
    <div className="stories-panel">
      <div className="story-grid">{stories.slice(0, 3).map(renderStory)}</div>
      <details>
        <summary>VIEW 7 MORE STORIES ↓</summary>
        <div className="story-grid">{stories.slice(3).map(renderStory)}</div>
      </details>
    </div>
  )
}

function ResumePanel() {
  return (
    <div className="career-log">
      <div className="career-status">
        <span><i /> CAREER.LOG</span>
        <span>STATUS: OPEN TO CONVERSATIONS</span>
      </div>

      <section className="career-scan" aria-labelledby="career-scan-title">
        <p className="career-path">~/quick-scan</p>
        <h3 id="career-scan-title">AI Pod Tech Lead · Backend engineer · Friendly Neighborhood AI Prompt Tuner</h3>
        <p>Production agent systems, distributed backends and the boring reliability machinery that keeps both useful.</p>
        <ul className="career-facts">
          <li><b>NOW</b><span>Leading a three-developer AI Pod at Habuild</span></li>
          <li><b>FOCUS</b><span>Agent systems, distributed backends, reliability</span></li>
          <li><b>PATH</b><span>BYJU'S → Freecharge → Habuild</span></li>
        </ul>
      </section>

      <div className="career-browser">
        <aside className="career-tree" aria-label="Career file tree">
          <p>~/career/</p>
          <ol>
            <li>now-habuild-ai.log</li>
            <li>2026-habuild-crm.log</li>
            <li>2024-freecharge.log</li>
            <li>2022-byjus.log</li>
            <li>systems.cfg</li>
            <li>achievements.log</li>
          </ol>
        </aside>

        <div className="career-records">
          <details open>
            <summary><span>now-habuild-ai.log</span><small>AI POD TECH LEAD · 2026—NOW</small></summary>
            <div className="career-entry">
              <p>Lead three developers across architecture, delivery, review quality, reliability and cost for Habuild's legacy-to-LangGraph AI platform spanning 30+ tools and 48K+ daily user queries.</p>
              <p>Led an AI customer-insight pipeline analyzing 10K+ daily signals; productionized conversational memory, hybrid retrieval and receipt-backed mutation guardrails.</p>
            </div>
          </details>

          <details>
            <summary><span>2026-habuild-crm.log</span><small>CRM ENGINEERING · FROM FEB 2026</small></summary>
            <div className="career-entry">
              <p>Started at Habuild in the CRM engineering Pod, building ordered multi-response messaging over SQS with retries, duplicate prevention, caching, search, escalation and recovery.</p>
            </div>
          </details>

          <details>
            <summary><span>2024-freecharge.log</span><small>SENIOR SOFTWARE ENGINEER · 2024—2026</small></summary>
            <div className="career-entry">
              <p>Led 3–4 backend engineers on credit-card acquisition and owned design, planning, stakeholder alignment and delivery.</p>
              <p>Shipped event-driven journeys and reliability controls with SQS, Redis, MongoDB and Elasticsearch; brought 27% of drop-off users back and reduced organization-lookup latency by approximately 60%.</p>
            </div>
          </details>

          <details>
            <summary><span>2022-byjus.log</span><small>MEMBER OF TECHNICAL STAFF 1 · 2022—2024</small></summary>
            <div className="career-entry">
              <p>Built Java and Spring Boot catalog, order, payment and cancellation services, plus onboarding and support automation using Node.js, TypeScript and Python.</p>
              <p>Shipped APIs supporting 200 requests/second, self-serve automation that reduced technical-support queries by 40%, and database work that made reads approximately 38% faster.</p>
            </div>
          </details>

          <details>
            <summary><span>systems.cfg</span><small>SYSTEMS IN USE</small></summary>
            <div className="career-entry career-columns">
              <p><b>AGENTS</b><span>LangGraph, prompts, routing, tools, memory, evaluation, observability</span></p>
              <p><b>BACKENDS</b><span>Java, Python, TypeScript, SQS, Redis, MongoDB, PostgreSQL, Elasticsearch</span></p>
              <p><b>OPERATIONS</b><span>Evidence-first debugging, safe migrations, review gates, production reliability</span></p>
            </div>
          </details>

          <details>
            <summary><span>achievements.log</span><small>SELECTED SYSTEM OUTCOMES</small></summary>
            <ul className="career-entry plain-list">
              <li>Co-led Langfuse and ClickHouse reliability work that reduced storage from 175 GiB to 12 GiB.</li>
              <li>Led cleanup of an approximately 400-file staging/main divergence and restored a controlled release path.</li>
              <li>Led model changes across 14 runtime slots with capability, rollout and observability guardrails.</li>
              <li>Trained 200+ colleagues on Claude Code and AI-assisted workflows.</li>
            </ul>
          </details>
        </div>
      </div>

      <div className="panel-links">
        <a className="primary" href={links.email}>EMAIL</a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
        <a href={links.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
      </div>
    </div>
  )
}

function GlitchLab() {
  const [result, setResult] = useState('LATENCY appeared. Choose a diagnostic move.')
  const moves = {
    TRACE: 'Trace found the slow edge. Suspicion is now evidence.',
    CACHE: 'Cache checked. It was innocent this time.',
    ROLLBACK: 'Last boringly reliable release restored.',
    'PROMPT TUNE': 'Prompt improved. Hallucination remains undefeated, but annoyed.',
  }

  return (
    <div className="glitch-lab">
      <div className="duel" aria-hidden="true"><span>▓░▒</span><b>VS</b><span>⌁BUG⌁</span></div>
      <p className="battle-log" aria-live="polite">{result}</p>
      <div className="move-grid">
        {Object.entries(moves).map(([move, message]) => (
          <button type="button" key={move} onClick={() => setResult(message)}>{move}</button>
        ))}
      </div>
    </div>
  )
}

export default App
