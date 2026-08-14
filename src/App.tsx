import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'

type Variant = 'desk' | 'cave' | 'handheld'
type Panel = 'resume' | 'work' | 'projects' | 'legacy' | null

const variants: { id: Variant; label: string }[] = [
  { id: 'desk', label: 'A — 3D CRT desk' },
  { id: 'cave', label: 'B — Pixel nerd cave' },
  { id: 'handheld', label: 'C — Handheld lab' },
]

const DeskScene = lazy(() => import('./DeskScene'))
const base = import.meta.env.BASE_URL

function initialVariant(): Variant {
  const candidate = new URLSearchParams(window.location.search).get('variant')
  return variants.some(({ id }) => id === candidate) ? (candidate as Variant) : 'desk'
}

function App() {
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [panel, setPanel] = useState<Panel>(null)

  const selectVariant = (next: Variant) => {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', next)
    window.history.replaceState({}, '', url)
    setPanel(null)
    setVariant(next)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPanel(null)
        return
      }
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, [contenteditable="true"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const current = variants.findIndex(({ id }) => id === variant)
      const offset = event.key === 'ArrowRight' ? 1 : -1
      selectVariant(variants[(current + offset + variants.length) % variants.length].id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [variant])

  return (
    <main className={`prototype prototype--${variant}`}>
      <a className="skip-link" href="#prototype-content">Skip to portfolio controls</a>
      <header className="system-bar">
        <a className="brand" href="?variant=desk" onClick={(event) => { event.preventDefault(); selectVariant('desk') }}>
          NIMESH//OS
        </a>
        <span className="system-status"><i /> HUMAN-DIRECTED · AI-ACCELERATED</span>
        <nav aria-label="Portfolio shortcuts">
          <button type="button" onClick={() => setPanel('resume')}>F1 RESUME</button>
          <button type="button" onClick={() => setPanel('work')}>WORK.LOG</button>
          <a href="mailto:nimeshjohari95@gmail.com">CONTACT</a>
        </nav>
      </header>

      <section id="prototype-content" className="stage" aria-label={`${variant} portfolio concept`}>
        {variant === 'desk' && (
          <DeskVariant onBoot={() => selectVariant('cave')} onOpen={setPanel} />
        )}
        {variant === 'cave' && (
          <CaveVariant onHandheld={() => selectVariant('handheld')} onOpen={setPanel} />
        )}
        {variant === 'handheld' && (
          <HandheldVariant onExit={() => selectVariant('cave')} onOpen={setPanel} />
        )}
      </section>

      {panel && <InfoPanel panel={panel} onClose={() => setPanel(null)} />}
      {import.meta.env.DEV && (
        <PrototypeSwitcher current={variant} onSelect={selectVariant} />
      )}
    </main>
  )
}

function DeskVariant({ onBoot, onOpen }: { onBoot: () => void; onOpen: (panel: Panel) => void }) {
  const lightweight = useLightweightMode()
  return (
    <div className="desk-variant">
      <img className="desk-poster" src={`${base}concepts/crt-desk.webp`} alt="" />
      {!lightweight && (
        <Suspense fallback={<div className="loading">LOADING LOW-POLY DESK…</div>}>
          <DeskScene />
        </Suspense>
      )}
      <div className="boot-window crt-surface">
        <p className="eyebrow">NIMESH BIOS v02.95</p>
        <h1>NIMESH//OS</h1>
        <dl className="boot-checks">
          <div><dt>BACKEND NERD</dt><dd>DETECTED</dd></div>
          <div><dt>AI POD</dt><dd>ONLINE</dd></div>
          <div><dt>WINDOW TILING</dt><dd>ENFORCED</dd></div>
          <div><dt>COFFEE</dt><dd className="warning">NOT FOUND</dd></div>
        </dl>
        <div className="boot-actions">
          <button type="button" className="primary" onClick={onBoot}>ENTER: BOOT</button>
          <button type="button" onClick={() => onOpen('resume')}>F1: RESUME</button>
          <button type="button" onClick={() => onOpen('legacy')}>LEGACY.HTML</button>
        </div>
      </div>
      <p className="concept-caption">A — Actual WebGL scene with an immediate résumé escape hatch.</p>
    </div>
  )
}

function useLightweightMode() {
  const query = '(max-width: 760px), (prefers-reduced-motion: reduce)'
  const [lightweight, setLightweight] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setLightweight(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return lightweight
}

function CaveVariant({ onHandheld, onOpen }: { onHandheld: () => void; onOpen: (panel: Panel) => void }) {
  return (
    <div className="cave-variant">
      <img src={`${base}concepts/nerd-cave.webp`} alt="Pixel-art developer room with computers, servers, notebooks and project shelves" />
      <div className="cave-shade" />
      <h1 className="cave-title">THE NERD CAVE</h1>
      <button className="hotspot hotspot--resume" type="button" onClick={() => onOpen('resume')}>▣ RESUME.EXE</button>
      <button className="hotspot hotspot--work" type="button" onClick={() => onOpen('work')}>▤ WORK.LOG</button>
      <button className="hotspot hotspot--projects" type="button" onClick={() => onOpen('projects')}>▥ PROJECTS/</button>
      <button className="hotspot hotspot--legacy" type="button" onClick={() => onOpen('legacy')}>▱ PRE_AI.FLOPPY</button>
      <button className="hotspot hotspot--handheld" type="button" onClick={onHandheld}>▦ GLITCH//LAB</button>
      <div className="terminal-strip" aria-live="polite">$ welcome nimesh-os.dev — click an object or type <b>help</b> later_</div>
      <p className="concept-caption">B — Spatial navigation; every hotspot also exists in the keyboard-safe top bar.</p>
    </div>
  )
}

function HandheldVariant({ onExit, onOpen }: { onExit: () => void; onOpen: (panel: Panel) => void }) {
  const [move, setMove] = useState('Choose a diagnostic move.')
  const moves = {
    TRACE: 'Trace found the slow edge: model → tool → retry loop.',
    CACHE: 'Cache hit. Latency lost 38 HP. Numbers are fictional in this prototype.',
    ROLLBACK: 'Rollback restored the last boringly reliable release.',
    'PROMPT TUNE': 'Prompt tuned. Hallucination is confused but not defeated.',
  }

  return (
    <div className="handheld-variant">
      <div className="handheld-device" aria-hidden="true">
        <div className="device-screen">
          <header><b>GLITCH//LAB</b><span>DEV-01</span></header>
          <div className="duel">
            <div className="glitch-creature">▓<i>░</i><i>▒</i></div>
            <strong>VS</strong>
            <div className="latency-creature">⌁⌁⌁<i>BUG</i></div>
          </div>
          <div className="device-meter"><span>GLITCH</span><progress max="100" value="72" /></div>
          <div className="device-meter"><span>LATENCY</span><progress max="100" value="88" /></div>
        </div>
        <div className="device-controls"><span className="dpad">✣</span><span>SELECT</span><span>RUN</span><i>A</i><i>B</i></div>
      </div>
      <section className="diagnostic-console" aria-label="GLITCH LAB controls">
        <p className="eyebrow">GLITCH//LAB · OPTIONAL EASTER EGG</p>
        <h1>LATENCY appeared.</h1>
        <p className="battle-log" aria-live="polite">{move}</p>
        <div className="move-grid">
          {Object.entries(moves).map(([name, result]) => (
            <button type="button" key={name} onClick={() => setMove(result)}>{name}</button>
          ))}
        </div>
        <div className="handheld-actions">
          <button type="button" onClick={() => onOpen('projects')}>PROJECT CARTRIDGES</button>
          <button type="button" className="primary" onClick={onExit}>BACK TO NIMESH//OS</button>
        </div>
      </section>
      <p className="concept-caption">C — Projects become diagnostic cartridges; play is optional.</p>
    </div>
  )
}

function InfoPanel({ panel, onClose }: { panel: Exclude<Panel, null>; onClose: () => void }) {
  const content = {
    resume: {
      title: 'RESUME.EXE',
      body: <><p>AI Pod Tech Lead building agentic AI and distributed backend systems.</p><p>Previously: backend delivery at Freecharge and platform systems at BYJU'S.</p><p className="muted">One-page and two-page PDF slots will connect after the résumé task is finalized.</p></>,
    },
    work: {
      title: 'WORK.LOG',
      body: <ul><li><b>Habuild:</b> AI Pod leadership, production AI, CRM engineering and reliability.</li><li><b>Freecharge:</b> credit-card acquisition and backend delivery.</li><li><b>BYJU'S:</b> catalog, payments, orders, onboarding and chatbot systems.</li></ul>,
    },
    projects: {
      title: 'PROJECTS/',
      body: <ul><li>Artix Linux dotfiles and the window-tiling rabbit hole.</li><li>NotesCLI and small tools built because three clicks were too many.</li><li>Public project laboratory—correctness first, impressive README second.</li></ul>,
    },
    legacy: {
      title: 'LEGACY.HTML · PRE-AI ARTIFACT',
      body: <><p>Built by hand before AI started completing everyone's sentences.</p><p>No agents. No copilots. Just HTML, CSS, Stack Overflow and unreasonable confidence.</p><div className="panel-links"><a className="primary" href="https://nimeshjohari02.github.io/myportfolio/" target="_blank" rel="noreferrer">OPEN ORIGINAL PORTFOLIO ↗</a><a href="https://github.com/NimeshJohari02/myportfolio" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a></div></>,
    },
  }[panel]

  return (
    <div className="panel-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <section className="info-panel crt-surface" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header><h2 id="panel-title">{content.title}</h2><button type="button" aria-label="Close window" onClick={onClose}>×</button></header>
        <div className="panel-body">{content.body}</div>
      </section>
    </div>
  )
}

function PrototypeSwitcher({ current, onSelect }: { current: Variant; onSelect: (variant: Variant) => void }) {
  const currentIndex = variants.findIndex(({ id }) => id === current)
  return (
    <aside className="prototype-switcher" aria-label="Prototype variant switcher">
      <button type="button" aria-label="Previous concept" onClick={() => onSelect(variants[(currentIndex + variants.length - 1) % variants.length].id)}>←</button>
      <span>PROTOTYPE: {variants[currentIndex].label}</span>
      <button type="button" aria-label="Next concept" onClick={() => onSelect(variants[(currentIndex + 1) % variants.length].id)}>→</button>
    </aside>
  )
}

export default App
