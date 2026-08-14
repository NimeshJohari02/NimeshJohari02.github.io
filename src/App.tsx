import { useEffect, useRef, useState } from 'react'
import './App.css'

const panelIds = ['map', 'resume', 'work', 'stories', 'projects', 'learning', 'nerd', 'voice', 'legacy', 'lab'] as const
type Panel = typeof panelIds[number]

const base = import.meta.env.BASE_URL

const destinations: { id: Panel; label: string; hint: string; className: string }[] = [
  { id: 'resume', label: 'RESUME.EXE', hint: 'The useful PDF stuff', className: 'resume' },
  { id: 'work', label: 'WORK.LOG', hint: 'Habuild · Freecharge · BYJU\'S', className: 'work' },
  { id: 'projects', label: 'PROJECTS/', hint: 'Public things I have built', className: 'projects' },
  { id: 'learning', label: 'LEARNING/', hint: 'DSA, Java, systems and rabbit holes', className: 'learning' },
  { id: 'nerd', label: 'NERD.STUFF', hint: 'Tiling windows since before it was cool', className: 'nerd' },
  { id: 'voice', label: 'VOICE.WORKFLOWS', hint: 'I talk to computers. A lot.', className: 'voice' },
  { id: 'legacy', label: 'LEGACY.HTML', hint: 'The handmade pre-AI website', className: 'legacy' },
  { id: 'stories', label: 'PRODUCTION.STORIES', hint: 'Things broke. I followed the evidence.', className: 'stories' },
]

const artworkControls = [
  ['terminal', 'nerd', 'Terminal: nerd stuff'],
  ['logs', 'work', 'Logs: work history'],
  ['achievements', 'stories', 'Achievements: production stories'],
  ['about', 'resume', 'About Nimesh'],
  ['settings', 'nerd', 'Settings: tools and workflows'],
  ['dock-resume', 'resume', 'Resume'],
  ['dock-projects', 'projects', 'Projects'],
  ['dock-map', 'map', 'Map'],
] as const

const projects = [
  ['ARTIX DOTFILES', 'BSPWM, XMonad, Polybar, Neovim and years of refusing to place windows by hand.', 'https://github.com/NimeshJohari02/artix-dotfiles'],
  ['NOTESCLI', 'A focused command-line notes app, built because three clicks felt excessive.', 'https://github.com/NimeshJohari02/NotesCLI'],
  ['LIGHTS OUT', 'A small React game. Not every repository needs to become a startup.', 'https://github.com/NimeshJohari02/LightsOutReact'],
  ['BOXMAKER', 'It makes a useless div. No regrets.', 'https://github.com/NimeshJohari02/BoxMaker'],
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
        <a className="brand" href="./" aria-label="Nimesh OS home">NIMESH//OS</a>
        <span className="system-status"><i /> HUMAN-DIRECTED · AI-ACCELERATED</span>
        <nav aria-label="Primary navigation">
          <a href="#resume">RESUME</a>
          <a href="#work">WORK.LOG</a>
          <a href="#map">EXPLORE</a>
          <a href="mailto:nimeshjohari95@gmail.com">CONTACT</a>
        </nav>
      </header>

      <section className="cave" aria-labelledby="cave-title">
        <img src={`${base}concepts/nerd-cave.webp`} alt="" />
        <div className="cave-shade" />
        <div className="cave-heading">
          <p>NIMESH JOHARI · AI POD TECH LEAD</p>
          <h1 id="cave-title">THE NERD CAVE</h1>
        </div>

        <div className="desktop-hotspots" aria-label="Objects in the Nerd Cave">
          {destinations.map(({ id, label, hint, className }) => (
            <a className={`hotspot hotspot--${className}`} href={`#${id}`} key={id}>
              <span>{label}<small>{hint}</small></span>
            </a>
          ))}
          {artworkControls.map(([className, target, label]) => (
            <a className={`artwork-control artwork-control--${className}`} href={`#${target}`} aria-label={label} key={className} />
          ))}
        </div>

        <nav className="mobile-directory" aria-label="Nerd Cave directory">
          <p>ROOM DIRECTORY</p>
          {destinations.map(({ id, label, hint }) => (
            <a href={`#${id}`} key={id}><b>{label}</b><span>{hint}</span></a>
          ))}
        </nav>

        <div className="terminal-strip">
          <span>$ 8 objects online</span>
          <span>click the room or open <a href="#map">EXPLORE</a>_</span>
        </div>
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
        <p id="panel-title">{panelTitles[panel]}</p>
        <button type="button" aria-label="Close window" onClick={() => ref.current?.close()}>ESC ×</button>
      </header>
      <div className="panel-body">{panelContent[panel]}</div>
    </dialog>
  )
}

const panelTitles: Record<Panel, string> = {
  map: 'MAP.EXE · EVERYTHING WORKS WITHOUT THE MAP TOO',
  resume: 'RESUME.EXE',
  work: 'WORK.LOG',
  stories: 'PRODUCTION.STORIES',
  projects: 'PROJECTS/',
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
  resume: (
    <div className="resume-panel">
      <p className="lede">AI Pod Tech Lead. Backend engineer. Friendly Neighborhood AI Prompt Tuner.</p>
      <p>I build production agent systems, distributed backends and the boring reliability machinery that keeps both useful.</p>
      <div className="panel-links">
        <a href="https://www.linkedin.com/in/nimeshjohari02/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
        <a href="https://github.com/NimeshJohari02" target="_blank" rel="noreferrer">GITHUB ↗</a>
      </div>
    </div>
  ),
  work: (
    <div className="timeline">
      <article><time>2026 — NOW</time><h2>Habuild · AI Pod Tech Lead</h2><p>Lead a three-developer Pod across agent architecture, delivery, PR quality, model evaluation, observability, cost and production reliability.</p><p>Started in the CRM engineering Pod, working on ordered messaging, retries, duplicate prevention, caching, search and recovery before moving into AI.</p></article>
      <article><time>2024 — 2026</time><h2>Freecharge · Senior Software Engineer, Backend</h2><p>Led 3–4 backend engineers on credit-card acquisition. Built event-driven journeys with SQS, Redis and Elasticsearch; shipped reliability, experimentation and recovery work.</p></article>
      <article><time>2022 — 2024</time><h2>BYJU'S · Member of Technical Staff 1</h2><p>Built Java/Spring Boot catalog, payment and order services, then onboarding and chatbot workflows that made common support problems self-serve.</p></article>
    </div>
  ),
  stories: (
    <div className="story-grid">
      <article><p>01 · OBSERVABILITY</p><h2>The disk that ate the traces</h2><span>Co-led recovery and retention work for self-hosted Langfuse/ClickHouse. Trace storage fell from 175 GiB to 12 GiB without turning observability off.</span></article>
      <article><p>02 · RELEASES</p><h2>Four hundred files apart</h2><span>Led cleanup of a roughly 400-file staging/main divergence and restored a controlled promotion path.</span></article>
      <article><p>03 · CORRECTNESS</p><h2>An AI answer is not proof</h2><span>Hardened agent flows around validation, tool identity, ambiguous outcomes and authoritative readback before claiming that an action succeeded.</span></article>
      <article><p>04 · RETRIEVAL</p><h2>Memory needs boring machinery</h2><span>Worked across durable workers, lifecycle controls and hybrid retrieval—not just prompts—to make memory and knowledge dependable.</span></article>
      <article><p>05 · CRM</p><h2>Replies must arrive in order</h2><span>Shipped queue-backed multi-response delivery with bounded retries and duplicate-call protection for a high-throughput messaging system.</span></article>
      <article><p>06 · DEBUGGING</p><h2>Follow the whole failure</h2><span>Trace input, routing, tools, state, downstream effects and delivery. Preserve “unknown” when telemetry ends instead of inventing an RCA.</span></article>
      <article><p>07 · MODELS</p><h2>Changing the engine mid-flight</h2><span>Rolled GPT-5.6 Luna through the production agent runtime with capability checks, fallback boundaries and model identity in observability.</span></article>
      <article><p>08 · PERFORMANCE</p><h2>One grouped read beats a query fan-out</h2><span>Collapsed repeated eligibility lookups into a grouped query on a high-read path, then used planner and runtime evidence to validate the result.</span></article>
      <article><p>09 · MIGRATION</p><h2>Deletion comes last</h2><span>Designed migration gates around one serving authority, effect-free shadowing, idempotency, canaries, rollback and proof before retirement.</span></article>
      <article><p>10 · ENGINEERING SYSTEMS</p><h2>Review the code that will actually run</h2><span>Introduced AI-assisted exact-head review gates inside the Pod and led cleanup of release drift before adding more features.</span></article>
    </div>
  ),
  projects: (
    <div className="project-list">
      {projects.map(([name, description, url]) => (
        <a href={url} target="_blank" rel="noreferrer" key={name}><b>{name} ↗</b><span>{description}</span></a>
      ))}
      <p className="muted">Older experiments stay visible. Bigger systems get showcased only after they build, run and survive an honest review.</p>
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
        <li>Linux and macOS windows tile themselves. Manually arranging them feels like packet loss.</li>
        <li>I built this portfolio's ancestor by hand and kept it alive as evidence.</li>
        <li>I use AI heavily, review its code, test its claims and argue with its prompts.</li>
        <li>New model, weird CLI, better shortcut? I will probably try it before lunch.</li>
      </ul>
      <div className="panel-links"><a href="#lab">OPEN GLITCH//LAB →</a></div>
    </div>
  ),
  voice: (
    <div>
      <p className="lede">Typing is optional. Thinking is not.</p>
      <p>I use speech-to-text to dump context fast, text-to-speech to review long material, and terminal agents to turn rough intent into something testable. The loop is simple: talk, inspect, correct, run.</p>
      <p>The machine accelerates the hands. I still own the judgment.</p>
    </div>
  ),
  legacy: (
    <div>
      <p className="lede">Before AI completed everyone's sentences, I completed my own divs.</p>
      <p>This is the portfolio I wrote by hand: old values, old CSS, honest origin story. It stays exactly where it is.</p>
      <div className="panel-links">
        <a className="primary" href="https://nimeshjohari02.github.io/myportfolio/" target="_blank" rel="noreferrer">OPEN THE 2021 SITE ↗</a>
        <a href="https://github.com/NimeshJohari02/myportfolio" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a>
      </div>
    </div>
  ),
  lab: <GlitchLab />,
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
