import { useEffect, useRef, useState } from 'react'
import './App.css'

const panelIds = ['map', 'resume', 'work', 'stories', 'projects', 'learning', 'nerd', 'voice', 'legacy', 'lab'] as const
type Panel = typeof panelIds[number]
type Story = readonly [tag: string, title: string, body: string]

const links = {
  email: 'mailto:nimeshjohari95@gmail.com',
  github: 'https://github.com/NimeshJohari02',
  linkedin: 'https://www.linkedin.com/in/nimeshjohari02/',
} as const

const base = import.meta.env.BASE_URL

const destinations: { id: Panel; label: string; hint: string; className: string }[] = [
  { id: 'resume', label: 'RESUME.EXE', hint: 'Native career dossier', className: 'resume' },
  { id: 'work', label: 'WORK.LOG', hint: 'Habuild · Freecharge · BYJU\'S', className: 'work' },
  { id: 'projects', label: 'PERSONAL.ARTIFACTS', hint: 'Useful tools, old experiments, honest context', className: 'projects' },
  { id: 'learning', label: 'LEARNING/', hint: 'DSA, Java, systems and rabbit holes', className: 'learning' },
  { id: 'nerd', label: 'NERD.STUFF', hint: 'Tiling windows since before it was cool', className: 'nerd' },
  { id: 'voice', label: 'VOICE.WORKFLOWS', hint: 'I talk to computers. A lot.', className: 'voice' },
  { id: 'legacy', label: 'LEGACY.HTML', hint: 'The handmade pre-AI website', className: 'legacy' },
  { id: 'stories', label: 'PRODUCTION.STORIES', hint: 'Things broke. I followed the evidence.', className: 'stories' },
]

const projects = [
  ['ARTIX DOTFILES', 'BSPWM, XMonad, Polybar, Neovim and years of refusing to place windows by hand.', 'https://github.com/NimeshJohari02/artix-dotfiles'],
  ['NOTESCLI', 'A focused command-line notes app, built because three clicks felt excessive.', 'https://github.com/NimeshJohari02/NotesCLI'],
]

const stories: Story[] = [
  ['01 · OBSERVABILITY', 'The disk that ate the traces', 'Co-led recovery and retention work for self-hosted Langfuse/ClickHouse. Trace storage fell from 175 GiB to 12 GiB without turning observability off.'],
  ['02 · RELEASES', 'Four hundred files apart', 'Led cleanup of a roughly 400-file staging/main divergence and restored a controlled promotion path.'],
  ['03 · CORRECTNESS', 'An AI answer is not proof', 'Hardened agent flows around validation, tool identity, ambiguous outcomes and authoritative readback before claiming that an action succeeded.'],
  ['04 · RETRIEVAL', 'Memory needs boring machinery', 'Worked across durable workers, lifecycle controls and hybrid retrieval—not just prompts—to make memory and knowledge dependable.'],
  ['05 · CRM', 'Replies must arrive in order', 'Shipped queue-backed multi-response delivery with bounded retries and duplicate-call protection for a high-throughput messaging system.'],
  ['06 · DEBUGGING', 'Follow the whole failure', 'Trace input, routing, tools, state, downstream effects and delivery. Preserve “unknown” when telemetry ends instead of inventing an RCA.'],
  ['07 · MODELS', 'Changing the engine mid-flight', 'Rolled GPT-5.6 Luna through the production agent runtime with capability checks, fallback boundaries and model identity in observability.'],
  ['08 · PERFORMANCE', 'One grouped read beats a query fan-out', 'Collapsed repeated eligibility lookups into a grouped query on a high-read path, then used planner and runtime evidence to validate the result.'],
  ['09 · MIGRATION', 'Deletion comes last', 'Designed migration gates around one serving authority, effect-free shadowing, idempotency, canaries, rollback and proof before retirement.'],
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
          <a href={links.email}>CONTACT</a>
        </nav>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">THE NERD CAVE</p>
        <h1 id="page-title">Nimesh Johari</h1>
        <p className="role">AI Pod Tech Lead · Production Agent Systems · Distributed Backends</p>
        <p className="proof">I lead a three-developer AI Pod across architecture, delivery, reliability, evaluation, observability and cost.</p>
        <div className="intro-links">
          <a className="primary" href="#resume">OPEN RESUME</a>
          <a href="#stories">READ PRODUCTION STORIES</a>
        </div>
      </section>

      <section className="cave" aria-label="Interactive Nerd Cave">
        <img className="directory-background" src={`${base}concepts/nerd-cave.webp`} alt="" />
        <div className="scene-frame">
          <div className="scene-layer">
            <img src={`${base}concepts/nerd-cave.webp`} alt="Pixel-art developer room with eight interactive objects" />
            <div className="cave-shade" />

            <nav className="desktop-hotspots" aria-label="Objects in the Nerd Cave">
              {destinations.map(({ id, label, hint, className }) => (
                <a className={`hotspot hotspot--${className}`} href={`#${id}`} key={id} aria-label={`${label}: ${hint}`} />
              ))}
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
  projects: 'PERSONAL.ARTIFACTS',
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
      <article><time>2026 — NOW</time><h2>Habuild · AI Pod Tech Lead</h2><p>Lead a three-developer Pod across agent architecture, delivery, PR quality, model evaluation, observability, cost and production reliability.</p><p>Started in the CRM engineering Pod, working on ordered messaging, retries, duplicate prevention, caching, search and recovery before moving into AI.</p></article>
      <article><time>2024 — 2026</time><h2>Freecharge · Senior Software Engineer, Backend</h2><p>Led 3–4 backend engineers on credit-card acquisition. Built event-driven journeys with SQS, Redis and Elasticsearch; shipped reliability, experimentation and recovery work.</p></article>
      <article><time>2022 — 2024</time><h2>BYJU'S · Member of Technical Staff 1</h2><p>Built Java/Spring Boot catalog, payment and order services, then onboarding and chatbot workflows that made common support problems self-serve.</p></article>
    </div>
  ),
  stories: <StoriesPanel />,
  projects: (
    <div className="project-list">
      {projects.map(([name, description, url]) => (
        <a href={url} target="_blank" rel="noreferrer" key={name}><b>{name} ↗</b><span>{description}</span></a>
      ))}
      <p className="muted">These are personal artifacts, not inflated case studies. Larger public projects join them only after they build, run and survive an honest review.</p>
    </div>
  ),
  learning: (
    <div>
      <p className="lede">College placements are anxious. My coping mechanism was code.</p>
      <p>I kept DSA implementations, C/C++ exercises and early web experiments so the learning trail stays honest. Current rabbit holes include Java internals, distributed systems, agent evaluation and whatever broke in production this week.</p>
      <p>I learn by running the thing, breaking the thing, reading why it broke, and leaving notes for future me.</p>
    </div>
  ),
  nerd: (
    <div>
      <p className="lede">I automate tiny annoyances with unreasonable enthusiasm.</p>
      <ul className="plain-list">
        <li>Years of Linux tiling window managers made keyboard navigation the default. macOS now tiles itself too; manually arranging windows feels like packet loss.</li>
        <li>I built this portfolio's ancestor by hand and kept it alive as evidence.</li>
        <li>I use AI heavily, review its code, test its claims and argue with its prompts.</li>
        <li>New model, weird CLI, better shortcut? I will probably try it before lunch.</li>
      </ul>
      <div className="panel-links"><a href="#lab">OPEN GLITCH//LAB →</a></div>
    </div>
  ),
  voice: (
    <div>
      <p className="lede">A keyboard is occasionally the slow fallback path.</p>
      <p>Flow currently clocks me at <strong>154 WPM</strong>—top <strong>0.1%</strong>—with <strong>126,503 words</strong> dictated across <strong>45 apps</strong>. I use speech-to-text for context dumps, prompts and rough specs.</p>
      <p>Text-to-speech handles long rereads; then I inspect the diff, run the tests and keep the judgment manual.</p>
    </div>
  ),
  legacy: (
    <div>
      <p className="lede">Before AI completed everyone's sentences, I completed my own divs.</p>
      <p>This is the portfolio I wrote by hand: old values, old CSS, honest origin story. It stays exactly where it is.</p>
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
        <p>I build production agent systems, distributed backends and the boring reliability machinery that keeps both useful.</p>
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
              <p>Lead three developers across agent architecture, delivery, review quality, model evaluation, observability, cost and production reliability.</p>
              <p>Productionized a LangGraph multi-agent platform across prompts, routing, tools, memory, evaluation and observability.</p>
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
            <summary><span>systems.cfg</span><small>WHAT I BUILD WITH</small></summary>
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
              <li>Rolled GPT-5.6 Luna into the production agent runtime with capability and observability guardrails.</li>
              <li>Trained 200+ colleagues on Claude Code and AI-assisted workflows.</li>
            </ul>
          </details>
        </div>
      </div>

      <div className="panel-links">
        <a className="primary" href={links.email}>EMAIL ME</a>
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
