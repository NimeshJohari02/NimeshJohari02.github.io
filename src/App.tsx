import { useEffect, useRef, useState } from 'react'
import './App.css'

const panelIds = ['map', 'search', 'resume', 'work', 'stories', 'projects', 'learning', 'nerd', 'voice', 'legacy', 'lab'] as const
type Panel = typeof panelIds[number]
type Story = readonly [tag: string, title: string, body: string]

const links = {
  email: 'mailto:nimeshjohari95@gmail.com',
  github: 'https://github.com/NimeshJohari02',
  leetcodeGrind: 'https://github.com/NimeshJohari02/LeetCodeGrind',
  linkedin: 'https://www.linkedin.com/in/nimeshjohari02/',
} as const

const base = import.meta.env.BASE_URL
const roomImage = `${base}concepts/nerd-cave-billu.webp`
const mobileRoomImage = `${base}concepts/nerd-cave-billu-mobile.webp`
const mobileRoomMedia = '(max-width: 1024px), (hover: none), (pointer: coarse)'

const destinations: { id: Panel; label: string; hint: string; className: string; keywords: string }[] = [
  { id: 'resume', label: 'RESUME.EXE', hint: 'Native career dossier', className: 'resume', keywords: 'career experience education study VIT Vellore 2023 graduate skills achievements LangGraph' },
  { id: 'work', label: 'WORK.LOG', hint: 'Habuild · Freecharge · BYJU\'S', className: 'work', keywords: 'jobs employment backend AI Pod tech lead' },
  { id: 'projects', label: 'PERSONAL.ARTIFACTS', hint: 'Featured builds and the road here', className: 'projects', keywords: 'portfolio GitHub Go Java React NestJS APIs systems' },
  { id: 'learning', label: 'LEARNING/', hint: 'DSA, Java, systems and rabbit holes', className: 'learning', keywords: 'college placements LeetCode C C++ distributed systems' },
  { id: 'nerd', label: 'NERD.STUFF', hint: 'Tiling windows since before it was cool', className: 'nerd', keywords: 'Linux macOS automation AI CLI shortcuts' },
  { id: 'voice', label: 'VOICE.WORKFLOWS', hint: 'Speech-to-text, text-to-speech and terminal agents', className: 'voice', keywords: 'dictation Flow productivity prompts' },
  { id: 'legacy', label: 'LEGACY.HTML', hint: 'The handmade pre-AI website', className: 'legacy', keywords: '2021 portfolio HTML CSS Lights Out BoxMaker' },
  { id: 'stories', label: 'PRODUCTION.STORIES', hint: 'Architecture, launches and the evidence behind them.', className: 'stories', keywords: 'integration cancellation human takeover evaluation cost observability releases correctness retrieval CRM debugging models performance customer insight' },
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
  ['AGENT SYSTEMS', 'From an answer engine to a conversation platform', 'Led the architecture and production launch of a direct CRM-to-agent integration for an AI platform handling 19K+ daily chat turns. The difficult boundary was deciding who could act and who could reply as messages, retries and human operators arrived together. Ordered processing, in-flight cancellation, human takeover, duplicate protection and recovery became part of the conversation model, with a phased rollout and a clear rollback path.'],
  ['PRODUCTION RELIABILITY', 'Put confidence behind the launch', 'Built confidence in the launch through production tracing and broad evaluations of conversation, retrieval and memory quality. Recorded execution errors were under 0.01% for model generations and 0.02% for business tools. Synthetic-fixture testing and receipt-backed action guardrails add checks around the conversations that change something for a member.'],
  ['MODEL ECONOMICS', 'A production platform that earns its model spend', 'The agent platform ran at about $1.4 in model spend per 1,000 answered-or-escalated turns. Overall daily OpenAI model spend was about 36% lower across the rollout. Cost became a first-class production concern alongside quality and reliability, with provider billing grounding the results.'],
  ['CANCELLATION', 'A human reply changes what the system may do', 'Designed cancellation around the difference between generating an answer and changing something for a member. A newer message can replace work before a side effect starts; a human takeover stops the bot from replying. Thread repair and stored-result replay help the next turn recover coherently. The design makes conversation ownership explicit across the services that compute and deliver an answer.'],
  ['01 · OBSERVABILITY', 'The disk that ate the traces', 'Co-led recovery and retention work for self-hosted Langfuse/ClickHouse. Trace storage fell from 175 GiB to 12 GiB without turning observability off.'],
  ['02 · RELEASES', 'Four hundred files apart', 'Led cleanup of a roughly 400-file staging/main divergence and restored a controlled promotion path.'],
  ['03 · CORRECTNESS', 'Shadow first, enforce second', 'Led receipt-backed guardrails that match action claims to same-turn tool outcomes. A 63K-turn audit found 31 unsupported claims before bounded retry and escalation enforcement.'],
  ['04 · RETRIEVAL', 'Memory needs boring machinery', 'Designed asynchronous memory that distills chats into durable facts and episodes, retrieves the relevant pieces into agent context and keeps follow-up work off the chat hot path.'],
  ['05 · CRM', 'Replies must arrive in order', 'Shipped queue-backed multi-response delivery with bounded retries and duplicate-call protection for a high-throughput messaging system.'],
  ['06 · DEBUGGING', 'Follow the whole failure', 'Trace input, routing, tools, state, downstream effects and delivery. Preserve “unknown” when telemetry ends instead of inventing an RCA.'],
  ['07 · MODELS', 'Changing the engine mid-flight', 'Led production model rollouts with centralized routing, capability checks, fail-fast validation, fallbacks and rollback controls, preserving model, provider and prompt provenance.'],
  ['08 · PERFORMANCE', 'One grouped read beats a query fan-out', 'Collapsed repeated eligibility lookups into a grouped query on a high-read path, then used planner and runtime evidence to validate the result.'],
  ['09 · CUSTOMER INSIGHT', 'From 50K+ messages to actionable insight', 'Led production hardening of a customer-insight pipeline processing 50K+ messages/day at peak. It distilled 37K+ non-noise signals into evidence-backed digests, detected issue spikes and supported natural-language analysis through six tools. Code-computed metrics and quote-verified evidence made the output useful for product decisions.'],
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
    const openSearch = (event: KeyboardEvent) => {
      if (!event.repeat && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        window.location.hash = 'search'
      }
    }
    window.addEventListener('hashchange', syncPanel)
    window.addEventListener('keydown', openSearch)
    return () => {
      window.removeEventListener('hashchange', syncPanel)
      window.removeEventListener('keydown', openSearch)
    }
  }, [])

  const closePanel = () => {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setPanel(null)
  }

  return (
    <main className="os-shell">
      <a className="skip-link" href="#map">Skip the room; open the directory</a>

      <header className="system-bar">
        <span className="system-status"><i /> ELEVEN REAL HOTSPOTS · HOVER OPTIONAL · TAB / COMMAND K</span>
        <nav aria-label="Primary navigation">
          <a href="#search" aria-label="Search portfolio, Command or Control K">SEARCH ⌘K</a>
          <a href="#resume">RESUME</a>
          <a href="#stories">PRODUCTION STORIES</a>
          <a href="#projects">PROJECTS</a>
          <a href={links.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
          <a href={links.email}>CONTACT</a>
        </nav>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div className="intro-meta">
          <p className="eyebrow">THE NERD CAVE</p>
          <p className="billu-note">billu bhai -- here, like always &lt;3</p>
        </div>
        <h1 id="page-title">Nimesh Johari</h1>
        <p className="role">AI Pod Tech Lead · Production Agent Systems · Distributed Backends</p>
        <p className="proof">Led a three-person AI Pod from agent architecture to production delivery, with ownership of reliability, evaluation, observability and cost.</p>
        <div className="intro-links">
          <a className="primary" href="#resume">OPEN RESUME</a>
          <a href="#stories">READ PRODUCTION STORIES</a>
          <a href={links.github} target="_blank" rel="noreferrer">VIEW GITHUB ↗</a>
        </div>
      </section>

      <section className="cave" aria-label="Interactive Nerd Cave">
        <div className="scene-frame">
          <div className="scene-layer">
            <picture className="scene-art">
              <source media={mobileRoomMedia} srcSet={mobileRoomImage} />
              <img src={roomImage} alt="Pixel-art developer room with eight interactive objects and Billu Bhai resting on a green chair" />
            </picture>
            <div className="cave-shade" />

            <nav className="desktop-hotspots" aria-label="Objects in the Nerd Cave">
              {destinations.map(({ id, label, hint, className }) => (
                <a className={`hotspot hotspot--${className}`} href={`#${id}`} key={id} aria-label={`${label}: ${hint}`} />
              ))}
              <a className="hotspot hotspot--dock-resume" href="#resume" aria-label="Bottom dock Resume" />
              <a className="hotspot hotspot--dock-projects" href="#projects" aria-label="Bottom dock Projects" />
              <a className="hotspot hotspot--dock-map" href="#map" aria-label="Bottom dock Map" />
            </nav>
          </div>
        </div>
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
        <div className="mobile-room-overview">
          <picture>
            <source media={mobileRoomMedia} srcSet={mobileRoomImage} />
            <img src={roomImage} alt="Complete pixel-art Nerd Cave with eight labeled objects, Billu Bhai on the green chair, and the Galaxy Always Home rug" />
          </picture>
          <nav className="mobile-dock-hotspots" aria-label="Bottom dock controls">
            <a className="hotspot hotspot--dock-resume" href="#resume" aria-label="Bottom dock Resume" />
            <a className="hotspot hotspot--dock-projects" href="#projects" aria-label="Bottom dock Projects" />
            <a className="hotspot hotspot--dock-map" href="#map" aria-label="Bottom dock Map" />
          </nav>
        </div>
      </section>

      {panel && <InfoPanel key={panel} panel={panel} onClose={closePanel} />}
    </main>
  )
}

function InfoPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    ref.current?.showModal()
    ref.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
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
  search: 'SEARCH.EXE · CMD/CTRL + K',
  resume: 'RESUME.EXE · CAREER.LOG',
  work: 'WORK.LOG',
  stories: 'PRODUCTION.STORIES',
  projects: 'PERSONAL.ARTIFACTS · PROJECT HISTORY',
  learning: 'LEARNING/',
  nerd: 'NERD.STUFF',
  voice: 'VOICE.WORKFLOWS',
  legacy: 'LEGACY.HTML · PRE-AI ARTIFACT',
  lab: 'GLITCH//LAB · AFTER HOURS',
}

const panelContent: Record<Panel, React.ReactNode> = {
  map: (
    <div className="directory-grid">
      {destinations.map(({ id, label, hint }) => (
        <a href={`#${id}`} key={id}><b>{label}</b><span>{hint}</span></a>
      ))}
      <a href="#lab"><b>GLITCH//LAB</b><span>Private after-hours experiments</span></a>
    </div>
  ),
  search: <SearchPanel />,
  resume: <ResumePanel />,
  work: (
    <div className="timeline">
      <article><time>2026 — NOW</time><h2>Habuild · AI Pod Tech Lead</h2><p>Led a three-person AI Pod across architecture, delivery, reliability and cost for a production LangGraph platform spanning 30+ tools. Led the architecture and launch of a direct CRM-to-agent integration for an AI platform handling 19K+ daily chat turns, with ordered conversations, in-flight cancellation, human takeover and failure recovery.</p><p>Paired production tracing with conversation, retrieval and memory evaluations. Recorded model-generation errors were under 0.01% and business-tool execution errors under 0.02%, alongside customer-insight and receipt-backed correctness systems.</p></article>
      <article><time>2024 — 2026</time><h2>Freecharge · Senior Software Engineer, Backend</h2><p>Led 3 backend engineers on credit-card acquisition. Built event-driven journeys with SQS, Redis and Elasticsearch; shipped reliability, experimentation and recovery work.</p></article>
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
      <p>Wispr Flow records <strong>217K words</strong> dictated at <strong>161 WPM</strong>, with a <strong>37-day streak</strong>. Speech-to-text handles context dumps, prompts and rough specs.</p>
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

function SearchPanel() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const normalizedQuery = query.trim().toLowerCase()
  const results = destinations.filter(({ label, hint, keywords }) =>
    `${label} ${hint} ${keywords}`.toLowerCase().includes(normalizedQuery),
  )
  const activeResult = results[activeIndex]
  const activeResultId = activeResult ? `search-result-${activeResult.id}` : ''

  useEffect(() => {
    document.getElementById(activeResultId)?.scrollIntoView({ block: 'nearest' })
  }, [activeResultId])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeResult) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      window.location.hash = activeResult.id
    }
  }

  return (
    <section className="search-panel" aria-labelledby="search-label">
      <label id="search-label" htmlFor="portfolio-search">Search portfolio terms</label>
      <input
        aria-activedescendant={activeResultId || undefined}
        aria-autocomplete="list"
        aria-controls={results.length > 0 ? 'search-results' : undefined}
        aria-expanded={results.length > 0}
        autoComplete="off"
        autoFocus
        id="portfolio-search"
        role="combobox"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Try: production stories, AI Pod, projects…"
      />
      <p className="search-status" aria-live="polite">{results.length} result{results.length === 1 ? '' : 's'}</p>
      {results.length > 0 ? (
        <ul className="search-results" id="search-results" role="listbox">
          {results.map(({ id, label, hint }, index) => (
            <li key={id} role="presentation">
              <a
                aria-selected={index === activeIndex}
                href={`#${id}`}
                id={`search-result-${id}`}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <b>{label}</b><span>{hint}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : <p className="search-empty">NO MATCHES. TRY ANOTHER TERM.</p>}
    </section>
  )
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
        <summary>VIEW {stories.length - 3} MORE STORIES ↓</summary>
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
          <li><b>NOW</b><span>AI Pod Tech Lead at Habuild · Led a three-person Pod</span></li>
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
            <li>study.log</li>
            <li>systems.cfg</li>
            <li>achievements.log</li>
          </ol>
        </aside>

        <div className="career-records">
          <details open>
            <summary><span>now-habuild-ai.log</span><small>AI POD TECH LEAD · 2026—NOW</small></summary>
            <div className="career-entry">
              <p>Led a three-person AI Pod across architecture, delivery, model releases, reliability and cost for Habuild's production LangGraph platform spanning 30+ tools.</p>
              <p>Led the architecture and production launch of a direct CRM-to-agent integration for an AI platform handling 19K+ daily chat turns, with in-flight cancellation, human takeover, ordered delivery, duplicate protection and failure recovery.</p>
              <p>Backed the launch with end-to-end production tracing, LLM-as-a-Judge evaluations and synthetic-fixture regression testing. Recorded execution errors were under 0.01% for model generations and 0.02% for business tools; evaluations cover conversation, retrieval and memory quality.</p>
              <p>The agent platform operated at about $1.4 in model spend per 1,000 answered-or-escalated turns. Led a customer-insight pipeline processing 50K+ messages/day at peak, distilling 37K+ signals into evidence-backed digests and productionized <strong>episodic memory</strong>, Qdrant hybrid retrieval with <strong>binary quantization</strong>, and receipt-backed action guardrails.</p>
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
              <p>Led 3 backend engineers on credit-card acquisition and owned design, planning, stakeholder alignment and delivery.</p>
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
            <summary><span>study.log</span><small>VIT VELLORE · B.TECH IT · 2023</small></summary>
            <div className="career-entry">
              <p>Graduated from Vellore Institute of Technology, Vellore, in 2023 with a B.Tech in Information Technology.</p>
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
              <li>Led the architecture and production launch of the direct CRM-to-agent integration for an AI platform handling 19K+ daily chat turns, including cancellation and human takeover.</li>
              <li>Combined production tracing and broad evaluations with recorded execution errors under 0.01% for model generations and 0.02% for business tools.</li>
              <li>Co-led Langfuse and ClickHouse reliability work that reduced storage from 175 GiB to 12 GiB.</li>
              <li>Led cleanup of an approximately 400-file staging/main divergence and restored a controlled release path.</li>
              <li>Led production model rollouts with centralized routing, capability checks, fallbacks and rollback controls.</li>
              <li>Mentored engineers through system-design and code reviews, guiding technical decisions and production delivery.</li>
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
  return (
    <div>
      <p className="lede">After-hours sidequests: private notes, unfinished systems and experiments that keep the curiosity loop running.</p>
      <div className="story-grid">
        <article>
          <p>01 · AGENTIC AI</p>
          <h2>Architecture, experiments, decisions</h2>
          <span>A private workbench connecting agent-system architecture decisions, experiments and learning notes.</span>
        </article>
        <article>
          <p>02 · JAVA FUNDAMENTALS</p>
          <h2>Small builds, big whiteboards</h2>
          <span>Private, messy practice across concurrency, low-level design drills, traffic systems, parking lots and small Java builds.</span>
        </article>
        <article>
          <p>03 · LINUX WORKSPACE</p>
          <h2>The desk is still under construction</h2>
          <span>A long-running workspace archive for AwesomeWM/Lua, Alacritty, Picom, Thunar and terminal configuration tinkering.</span>
        </article>
      </div>
    </div>
  )
}

export default App
