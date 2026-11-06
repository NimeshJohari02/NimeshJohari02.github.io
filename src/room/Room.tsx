import { useEffect, useRef, useState } from 'react'
import {
  BEANBAG, BEANBAG_EXIT, CAT, depthScale, FLOOR, GALAXY, GALAXY_SCALE, H, HOTSPOTS, NIMESH, NIMESH_IDLE,
  NIMESH_SCALE, NIMESH_WALK, OBSTACLES, RUG, TREE, TREE_BASE, W, type Hotspot, type Perch, type Pt, type Rect,
} from './scene'

type Props = {
  labels: Record<string, string>
  onOpen: (id: string) => void
  onFail: () => void
}

const BASE = import.meta.env.BASE_URL
const CELL = 16
const COLS = Math.ceil(W / CELL)
const ROWS = Math.ceil(H / CELL)
const SPEED = 420
const CAT_SPEED = 300
const REACH = 130
const EXTRA_LABELS: Record<string, string> = { cattree: 'CAT TREE · send Galaxy up', beanbag: 'BEAN BAG · nap time', galaxy: 'GALAXY · pet him' }

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1])
const inRect = ([x, y]: Pt, r: Rect, pad = 0) => x > r[0] - pad && x < r[2] + pad && y > r[1] - pad && y < r[3] + pad

function inPolygon([x, y]: Pt, poly: Pt[]) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Walkability grid: inside the floor polygon with clearance, outside every obstacle. */
const walkable = (() => {
  const grid = new Uint8Array(COLS * ROWS)
  const clear = 18
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p: Pt = [c * CELL + CELL / 2, r * CELL + CELL / 2]
      const ok = [[0, 0], [clear, 0], [-clear, 0], [0, clear], [0, -clear]].every(([dx, dy]) => inPolygon([p[0] + dx, p[1] + dy], FLOOR))
      grid[r * COLS + c] = ok && !OBSTACLES.some((o) => inRect(p, o, clear)) ? 1 : 0
    }
  }
  return grid
})()

const cellOf = ([x, y]: Pt) => Math.min(ROWS - 1, Math.max(0, Math.floor(y / CELL))) * COLS + Math.min(COLS - 1, Math.max(0, Math.floor(x / CELL)))
const centre = (i: number): Pt => [(i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2]
const canStand = (p: Pt) => walkable[cellOf(p)] === 1

function nearestWalkable(p: Pt): Pt {
  if (canStand(p)) return p
  let best = centre(0)
  let bestD = Infinity
  for (let i = 0; i < walkable.length; i++) {
    if (!walkable[i]) continue
    const d = dist(centre(i), p)
    if (d < bestD) { bestD = d; best = centre(i) }
  }
  return best
}

function lineClear(a: Pt, b: Pt) {
  const steps = Math.ceil(dist(a, b) / (CELL / 2))
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    if (!canStand([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])) return false
  }
  return true
}

/** A* over the grid, then string-pulled so characters walk straight lines between corners. */
function findPath(from: Pt, to: Pt): Pt[] {
  const goal = nearestWalkable(to)
  const start = nearestWalkable(from)
  if (lineClear(start, goal)) return [goal]
  const s = cellOf(start)
  const g = cellOf(goal)
  const cost = new Float32Array(walkable.length).fill(Infinity)
  const prev = new Int32Array(walkable.length).fill(-1)
  const open = new Set([s])
  const f = new Float32Array(walkable.length).fill(Infinity)
  cost[s] = 0
  f[s] = dist(centre(s), centre(g))
  while (open.size) {
    let cur = -1
    for (const i of open) if (cur < 0 || f[i] < f[cur]) cur = i
    if (cur === g) break
    open.delete(cur)
    const cx = cur % COLS
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue
        const nx = cx + dx
        const n = cur + dy * COLS + dx
        if (nx < 0 || nx >= COLS || n < 0 || n >= walkable.length || !walkable[n]) continue
        if (dx && dy && (!walkable[cur + dx] || !walkable[cur + dy * COLS])) continue
        const c = cost[cur] + (dx && dy ? 1.414 : 1)
        if (c < cost[n]) {
          cost[n] = c
          prev[n] = cur
          f[n] = c + dist(centre(n), centre(g)) / CELL
          open.add(n)
        }
      }
    }
  }
  if (prev[g] < 0) return [start]
  const cells: Pt[] = []
  for (let i = g; i !== s; i = prev[i]) cells.unshift(centre(i))
  cells[cells.length - 1] = goal
  const path: Pt[] = []
  let anchor = start
  for (let i = 0; i < cells.length; i++) {
    if (i === cells.length - 1 || !lineClear(anchor, cells[i + 1])) {
      path.push(cells[i])
      anchor = cells[i]
    }
  }
  return path
}

type Dir = 'down' | 'up' | 'left' | 'right'
type Person = { pos: Pt; path: Pt[]; dir: Dir; phase: number; arrive?: () => void }

type CatStep =
  | { kind: 'walk'; to: Pt }
  | { kind: 'leap'; to: Pt; depth: number }
  | { kind: 'pose'; frame: number; time: number; face?: boolean }
  | { kind: 'follow'; time: number }
type Cat = {
  pos: Pt; depth: number; perch: Perch | null; flip: boolean; frame: number; phase: number
  queue: CatStep[]; path: Pt[]; leap?: { from: Pt; to: Pt; depth0: number; depth: number; t: number }
  wait: number; followUntil: number; hearts: { x: number; y: number; t: number }[]; bubble: number
}

function rand<T>(items: T[]) { return items[Math.floor(Math.random() * items.length)] }
function randomFloor(): Pt {
  for (;;) {
    const p: Pt = [300 + Math.random() * 1600, 830 + Math.random() * 650]
    if (canStand(p)) return p
  }
}

/** Galaxy's own plans; each starts from wherever he is, leaving a perch first. */
function catPlan(cat: Cat, kind?: 'tree' | 'beanbag' | 'rug' | 'wander'): CatStep[] {
  const steps: CatStep[] = []
  if (cat.perch === BEANBAG) steps.push({ kind: 'leap', to: BEANBAG_EXIT, depth: BEANBAG_EXIT[1] })
  if (cat.perch && TREE.includes(cat.perch)) {
    for (const p of TREE.slice(0, TREE.indexOf(cat.perch)).reverse()) steps.push({ kind: 'leap', to: p.at, depth: p.depth })
    steps.push({ kind: 'leap', to: TREE_BASE, depth: TREE_BASE[1] })
  }
  const pick = kind ?? rand<'tree' | 'beanbag' | 'rug' | 'wander'>(['tree', 'beanbag', 'rug', 'wander', 'wander'])
  if (pick === 'tree') {
    steps.push({ kind: 'walk', to: TREE_BASE })
    for (const p of TREE) steps.push({ kind: 'leap', to: p.at, depth: p.depth }, { kind: 'pose', frame: CAT.sit, time: 0.7 })
    steps.push({ kind: 'pose', frame: CAT.curl, time: 14 + Math.random() * 8 }, { kind: 'pose', frame: CAT.sitFront, time: 3 })
  } else if (pick === 'beanbag') {
    steps.push({ kind: 'walk', to: BEANBAG_EXIT }, { kind: 'leap', to: BEANBAG.at, depth: BEANBAG.depth })
    steps.push({ kind: 'pose', frame: CAT.curl, time: 16 + Math.random() * 10 }, { kind: 'pose', frame: CAT.loaf, time: 3 })
  } else if (pick === 'rug') {
    steps.push({ kind: 'walk', to: RUG }, { kind: 'pose', frame: CAT.lie, time: 9 + Math.random() * 6 }, { kind: 'pose', frame: CAT.groom, time: 3 })
  } else {
    steps.push({ kind: 'walk', to: randomFloor() }, { kind: 'pose', frame: rand([CAT.sit, CAT.sitFront, CAT.loaf]), time: 3 + Math.random() * 4 })
    if (Math.random() < 0.4) steps.push({ kind: 'pose', frame: CAT.stretch, time: 1.6 })
  }
  return steps
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.6, y - s * 1.2, x, y - s * 0.35)
  ctx.bezierCurveTo(x + s * 0.6, y - s * 1.2, x + s * 1.4, y - s * 0.1, x, y + s * 0.9)
  ctx.fill()
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Soft brightened copy of each hotspot so hover reads as light falling on the object. */
function glowLayer(room: HTMLImageElement, r: Rect) {
  const [x0, y0, x1, y1] = r
  const c = document.createElement('canvas')
  c.width = (x1 - x0) / 2
  c.height = (y1 - y0) / 2
  const g = c.getContext('2d')!
  const k = room.naturalWidth / W
  g.drawImage(room, x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k, 0, 0, c.width, c.height)
  g.globalCompositeOperation = 'lighter'
  g.globalAlpha = 0.45
  g.drawImage(c, 0, 0)
  g.globalAlpha = 1
  g.globalCompositeOperation = 'destination-in'
  const grad = g.createRadialGradient(c.width / 2, c.height / 2, 0, c.width / 2, c.height / 2, Math.max(c.width, c.height) / 1.6)
  grad.addColorStop(0.55, 'rgba(0,0,0,1)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, c.width, c.height)
  return c
}

export default function Room({ labels, onOpen, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoverRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(onOpen)
  const promptActionRef = useRef<() => void>(() => {})
  const [hover, setHover] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [moved, setMoved] = useState(false)
  const [touch] = useState(() => matchMedia('(pointer: coarse)').matches)

  useEffect(() => { openRef.current = onOpen }, [onOpen])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let disposed = false
    let raf = 0
    let room: HTMLImageElement
    let nimeshImg: HTMLImageElement
    let galaxyImg: HTMLImageElement
    let backdrop: HTMLCanvasElement
    const glows = new Map<Rect, HTMLCanvasElement>()

    const view = { scale: 1, x: 0, y: 0, w: 0, h: 0, zoomed: false, panned: false }
    const person: Person = { pos: [1060, 890], path: [], dir: 'down', phase: 0 }
    const cat: Cat = {
      pos: [...BEANBAG.at], depth: BEANBAG.depth, perch: BEANBAG, flip: false, frame: CAT.curl, phase: 0,
      queue: [{ kind: 'pose', frame: CAT.curl, time: 9 }, { kind: 'pose', frame: CAT.loaf, time: 2.5 }], path: [],
      wait: 0, followUntil: 0, hearts: [], bubble: 0,
    }
    let hovered: string | null = null
    let near: string | null = null
    const keys = new Set<string>()
    let clock = performance.now()
    let elapsed = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      view.w = innerWidth
      view.h = innerHeight
      canvas.width = Math.round(view.w * dpr)
      canvas.height = Math.round(view.h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const contain = Math.min(view.w / W, view.h / H)
      // Narrow portrait screens get a taller crop that pans with the player instead of a tiny letterbox.
      view.zoomed = view.w / view.h < 0.9
      view.scale = view.zoomed ? Math.min(view.h * 0.7 / H, view.w * 2.6 / W) : contain
      view.y = (view.h - H * view.scale) / 2
      view.x = view.zoomed ? clampCamX(person.pos[0] * view.scale - view.w / 2) : (view.w - W * view.scale) / 2
    }
    const clampCamX = (x: number) => -Math.min(Math.max(x, 0), W * view.scale - view.w)
    const toRoom = (cx: number, cy: number): Pt => [(cx - view.x) / view.scale, (cy - view.y) / view.scale]

    const catFrameRect = (): Rect => {
      const [, , fw, fh] = GALAXY[cat.frame]
      const s = GALAXY_SCALE * depthScale(cat.depth)
      return [cat.pos[0] - (fw * s) / 2, cat.pos[1] - fh * s, cat.pos[0] + (fw * s) / 2, cat.pos[1]]
    }
    const hit = (p: Pt): string | null => {
      if (inRect(p, catFrameRect(), 20)) return 'galaxy'
      let best: Hotspot | null = null
      let area = Infinity
      for (const h of HOTSPOTS) {
        for (const r of h.rects) {
          const a = (r[2] - r[0]) * (r[3] - r[1])
          if (inRect(p, r) && a < area) { best = h; area = a }
        }
      }
      return best?.id ?? null
    }

    const walkTo = (to: Pt, arrive?: () => void) => {
      person.path = findPath(person.pos, to)
      person.arrive = arrive
      view.panned = false
      setMoved(true)
    }
    const petGalaxy = () => {
      cat.queue = [{ kind: 'pose', frame: cat.perch ? CAT.loaf : CAT.sitFront, time: 2.2 }]
      if (!cat.perch) cat.queue.push({ kind: 'follow', time: 9 })
      cat.path = []
      cat.wait = 0
      cat.hearts.push(...[0, 1, 2].map((i) => ({ x: (i - 1) * 26, y: 0, t: -i * 0.25 })))
      cat.bubble = 2.6
    }
    const commandCat = (kind: 'tree' | 'beanbag') => {
      if (cat.leap) return
      cat.queue = catPlan(cat, kind)
      cat.path = []
      cat.wait = 0
    }
    const activate = (id: string) => {
      if (id === 'galaxy') {
        const target: Pt = cat.perch ? (cat.perch === BEANBAG ? BEANBAG_EXIT : TREE_BASE) : [cat.pos[0] + (person.pos[0] < cat.pos[0] ? -110 : 110), cat.pos[1] + 10]
        walkTo(target, petGalaxy)
        return
      }
      const spot = HOTSPOTS.find((h) => h.id === id)!
      walkTo(spot.stand, () => {
        const [x0, y0, x1, y1] = spot.rects[0]
        face([(x0 + x1) / 2 - person.pos[0], (y0 + y1) / 2 - person.pos[1]])
        if (id === 'cattree' || id === 'beanbag') commandCat(id === 'cattree' ? 'tree' : 'beanbag')
        else openRef.current(id)
      })
    }
    promptActionRef.current = () => { if (near) activate(near) }

    const face = ([dx, dy]: Pt) => {
      if (Math.abs(dx) > Math.abs(dy) * 1.3) person.dir = dx < 0 ? 'left' : 'right'
      else person.dir = dy < 0 ? 'up' : 'down'
    }

    const stepPerson = (dt: number) => {
      let vx = 0
      let vy = 0
      if (keys.has('a') || keys.has('arrowleft')) vx -= 1
      if (keys.has('d') || keys.has('arrowright')) vx += 1
      if (keys.has('w') || keys.has('arrowup')) vy -= 1
      if (keys.has('s') || keys.has('arrowdown')) vy += 1
      let moving = false
      if (vx || vy) {
        person.path = []
        person.arrive = undefined
        const len = Math.hypot(vx, vy)
        const nx: Pt = [person.pos[0] + (vx / len) * SPEED * dt, person.pos[1] + (vy / len) * SPEED * 0.8 * dt]
        if (canStand(nx)) person.pos = nx
        else if (canStand([nx[0], person.pos[1]])) person.pos = [nx[0], person.pos[1]]
        else if (canStand([person.pos[0], nx[1]])) person.pos = [person.pos[0], nx[1]]
        face([vx, vy])
        moving = true
      } else if (person.path.length) {
        const target = person.path[0]
        const d = dist(person.pos, target)
        const step = SPEED * dt
        face([target[0] - person.pos[0], target[1] - person.pos[1]])
        if (d <= step) {
          person.pos = [...target]
          person.path.shift()
          if (!person.path.length && person.arrive) {
            const done = person.arrive
            person.arrive = undefined
            done()
          }
        } else {
          person.pos = [person.pos[0] + ((target[0] - person.pos[0]) / d) * step, person.pos[1] + ((target[1] - person.pos[1]) / d) * step]
        }
        moving = true
      }
      person.phase = moving ? person.phase + dt * 7.5 : 0
    }

    const stepCat = (dt: number) => {
      cat.hearts = cat.hearts.map((h) => ({ ...h, t: h.t + dt })).filter((h) => h.t < 1.6)
      cat.bubble = Math.max(0, cat.bubble - dt)
      if (cat.leap) {
        const L = cat.leap
        L.t = Math.min(1, L.t + dt / 0.55)
        const e = L.t < 0.5 ? 2 * L.t * L.t : 1 - Math.pow(-2 * L.t + 2, 2) / 2
        cat.pos = [L.from[0] + (L.to[0] - L.from[0]) * e, L.from[1] + (L.to[1] - L.from[1]) * e - Math.sin(Math.PI * L.t) * 90]
        cat.depth = L.depth0 + (L.depth - L.depth0) * e
        cat.frame = CAT.leap
        if (L.t >= 1) {
          cat.pos = [...L.to]
          cat.depth = L.depth
          cat.leap = undefined
        }
        return
      }
      if (!cat.queue.length) cat.queue = catPlan(cat)
      const step = cat.queue[0]
      if (step.kind === 'pose') {
        cat.frame = step.frame
        cat.wait += dt
        if (cat.wait >= step.time) { cat.wait = 0; cat.queue.shift() }
        return
      }
      if (step.kind === 'leap') {
        cat.flip = step.to[0] < cat.pos[0]
        const perch = [...TREE, BEANBAG].find((p) => p.at === step.to) ?? null
        cat.leap = { from: [...cat.pos], to: step.to, depth0: cat.depth, depth: step.depth, t: 0 }
        cat.perch = perch
        cat.queue.shift()
        return
      }
      let goal: Pt
      if (step.kind === 'follow') {
        cat.wait += dt
        if (cat.wait >= step.time) { cat.wait = 0; cat.queue.shift(); return }
        goal = [person.pos[0] + (cat.pos[0] < person.pos[0] ? -120 : 120), person.pos[1] + 12]
        if (dist(goal, cat.pos) < 60) { cat.frame = CAT.sit; cat.flip = person.pos[0] < cat.pos[0]; cat.path = []; return }
        if (!cat.path.length || dist(cat.path[cat.path.length - 1], goal) > 80) cat.path = findPath(cat.pos, goal)
      } else {
        goal = step.to
        if (!cat.path.length) cat.path = findPath(cat.pos, goal)
      }
      const target = cat.path[0]
      const d = dist(cat.pos, target)
      const move = (step.kind === 'follow' ? CAT_SPEED * 1.25 : CAT_SPEED) * dt
      if (Math.abs(target[0] - cat.pos[0]) > 2) cat.flip = target[0] < cat.pos[0]
      if (d <= move) {
        cat.pos = [...target]
        cat.path.shift()
        if (!cat.path.length && step.kind === 'walk') cat.queue.shift()
      } else {
        cat.pos = [cat.pos[0] + ((target[0] - cat.pos[0]) / d) * move, cat.pos[1] + ((target[1] - cat.pos[1]) / d) * move]
      }
      cat.depth = cat.pos[1]
      cat.phase += dt * 9
      cat.frame = CAT.walk[Math.floor(cat.phase) % 4]
    }

    const drawSprite = (img: HTMLImageElement, rect: number[], feet: Pt, s: number, flip: boolean) => {
      const [sx, sy, sw, sh] = rect
      const w = sw * s
      const h = sh * s
      ctx.save()
      ctx.translate(feet[0], feet[1])
      if (flip) ctx.scale(-1, 1)
      ctx.drawImage(img, sx, sy, sw, sh, -w / 2, -h, w, h)
      ctx.restore()
    }
    const shadow = (p: Pt, rx: number, ry: number, a: number) => {
      ctx.fillStyle = `rgba(10,6,3,${a})`
      ctx.beginPath()
      ctx.ellipse(p[0], p[1] - ry * 0.3, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      ctx.fillStyle = '#060504'
      ctx.fillRect(0, 0, view.w, view.h)
      const cover = Math.max(view.w / backdrop.width, view.h / backdrop.height)
      ctx.globalAlpha = 0.55
      ctx.drawImage(backdrop, (view.w - backdrop.width * cover) / 2, (view.h - backdrop.height * cover) / 2, backdrop.width * cover, backdrop.height * cover)
      ctx.globalAlpha = 1
      ctx.save()
      ctx.translate(view.x, view.y)
      ctx.scale(view.scale, view.scale)
      ctx.drawImage(room, 0, 0, W, H)

      const pulse = 0.65 + Math.sin(elapsed * 3) * 0.2
      for (const id of new Set([hovered, near])) {
        const spot = HOTSPOTS.find((h) => h.id === id)
        if (!spot) continue
        ctx.globalAlpha = id === hovered ? 0.9 : pulse * 0.7
        for (const r of spot.rects) ctx.drawImage(glows.get(r)!, r[0], r[1], r[2] - r[0], r[3] - r[1])
        ctx.globalAlpha = 1
      }

      const ps = NIMESH_SCALE * depthScale(person.pos[1])
      const cs = GALAXY_SCALE * depthScale(cat.depth)
      const actors = [
        { depth: person.pos[1], draw: () => {
          shadow(person.pos, 62 * ps, 15 * ps, 0.42)
          const axis = person.dir === 'left' || person.dir === 'right' ? 'side' : person.dir
          const walk = NIMESH_WALK[axis]
          const frame = person.phase ? walk[Math.floor(person.phase) % walk.length] : NIMESH_IDLE[axis]
          drawSprite(nimeshImg, NIMESH[frame], person.pos, ps, person.dir === 'left')
        } },
        { depth: cat.depth, draw: () => {
          if (!cat.perch && !cat.leap) shadow(cat.pos, 120 * cs, 20 * cs, 0.38)
          drawSprite(galaxyImg, GALAXY[cat.frame], cat.pos, cs, cat.flip)
          const top = catFrameRect()[1]
          ctx.fillStyle = '#ff6b8b'
          for (const h of cat.hearts) {
            if (h.t < 0) continue
            ctx.globalAlpha = 1 - h.t / 1.6
            heart(ctx, cat.pos[0] + h.x + Math.sin(h.t * 6 + h.x) * 8, top - 10 - h.t * 120, 14)
          }
          ctx.globalAlpha = 1
          if (cat.bubble > 0) {
            ctx.globalAlpha = Math.min(1, cat.bubble * 2)
            ctx.font = '600 30px ui-monospace, Menlo, monospace'
            const text = 'mrrp <3'
            const tw = ctx.measureText(text).width
            const bx = cat.pos[0] - tw / 2 - 16
            const by = top - 82
            ctx.fillStyle = 'rgba(12,10,8,.86)'
            ctx.strokeStyle = 'rgba(255,200,140,.7)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(bx, by, tw + 32, 48, 12)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = '#ffe2c4'
            ctx.fillText(text, bx + 16, by + 34)
            ctx.globalAlpha = 1
          }
        } },
      ].sort((a, b) => a.depth - b.depth)
      for (const a of actors) a.draw()
      ctx.restore()
    }

    const frame = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - clock) / 1000, 0.05)
      clock = now
      elapsed += dt
      stepPerson(dt)
      stepCat(dt)
      if (view.zoomed && !view.panned) {
        const target = clampCamX(person.pos[0] * view.scale - view.w / 2)
        view.x += (target - view.x) * Math.min(1, dt * 4)
      }
      let closest: string | null = null
      let best = REACH
      if (!person.path.length) {
        for (const h of HOTSPOTS) {
          const d = dist(person.pos, h.stand)
          if (d < best) { best = d; closest = h.id }
        }
      }
      if (closest !== near) { near = closest; setPrompt(closest) }
      draw()
      raf = requestAnimationFrame(frame)
    }

    let down: { x: number; y: number; t: number; camX: number } | null = null
    const onPointerDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now(), camX: view.x }
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (down && view.zoomed && Math.abs(e.clientX - down.x) > 8) {
        view.x = clampCamX(-(down.camX + e.clientX - down.x))
        view.panned = true
      }
      if (e.pointerType === 'mouse') {
        const id = hit(toRoom(e.clientX, e.clientY))
        if (id !== hovered) {
          hovered = id
          setHover(id)
          canvas.style.cursor = id ? 'pointer' : 'default'
        }
        if (hoverRef.current) hoverRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 14}px)`
      }
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!down) return
      const tap = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8 && performance.now() - down.t < 600
      down = null
      if (!tap) return
      const p = toRoom(e.clientX, e.clientY)
      const id = hit(p)
      if (id) activate(id)
      else if (p[0] > 0 && p[0] < W && p[1] > 0 && p[1] < H) walkTo(p)
    }
    const onPointerLeave = () => { hovered = null; setHover(null) }
    const ignoreKeys = (e: KeyboardEvent) =>
      e.metaKey || e.ctrlKey || e.altKey || document.querySelector('dialog[open]') !== null ||
      (e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(e.target.tagName)))
    const onKeyDown = (e: KeyboardEvent) => {
      if (ignoreKeys(e)) return
      const k = e.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        keys.add(k)
        view.panned = false
        setMoved(true)
        e.preventDefault()
      } else if ((k === 'e' || k === 'enter') && near && !e.repeat) {
        activate(near)
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    const onBlur = () => keys.clear()

    Promise.all([
      loadImage(`${BASE}room/${innerWidth * Math.min(devicePixelRatio || 1, 2) < 1500 ? 'room-sm' : 'room'}.webp`),
      loadImage(`${BASE}room/nimesh.webp`),
      loadImage(`${BASE}room/galaxy.webp`),
    ]).then(([r, n, g]) => {
      if (disposed) return
      room = r
      nimeshImg = n
      galaxyImg = g
      backdrop = document.createElement('canvas')
      backdrop.width = 86
      backdrop.height = 48
      backdrop.getContext('2d')!.drawImage(room, 0, 0, 86, 48)
      for (const h of HOTSPOTS) for (const rect of h.rects) glows.set(rect, glowLayer(room, rect))
      resize()
      addEventListener('resize', resize)
      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('pointerleave', onPointerLeave)
      addEventListener('keydown', onKeyDown)
      addEventListener('keyup', onKeyUp)
      addEventListener('blur', onBlur)
      clock = performance.now()
      raf = requestAnimationFrame(frame)
    }, () => { if (!disposed) onFail() })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      removeEventListener('keydown', onKeyDown)
      removeEventListener('keyup', onKeyUp)
      removeEventListener('blur', onBlur)
    }
  }, [onFail])

  const nameOf = (id: string) => EXTRA_LABELS[id] ?? labels[id]

  return (
    <div className="room">
      <canvas className="room-canvas" ref={canvasRef} aria-hidden="true" />
      {!touch && <div className="room-hover" ref={hoverRef} hidden={!hover} aria-hidden="true">{hover && nameOf(hover)}</div>}
      {prompt && (
        <button type="button" className="room-prompt" onClick={() => promptActionRef.current()}>
          {prompt === 'cattree' || prompt === 'beanbag' ? nameOf(prompt) : `OPEN ${nameOf(prompt)}`} {!touch && <kbd>E</kbd>}
        </button>
      )}
      <p className={`room-hint${moved || prompt ? ' is-hidden' : ''}`} aria-hidden="true">
        {touch ? 'tap to walk · tap things to open · tap Galaxy to pet' : 'click or WASD to walk · click things to open · click Galaxy to pet'}
      </p>
    </div>
  )
}
