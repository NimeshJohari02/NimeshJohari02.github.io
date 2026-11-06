/** Room plate geometry in source pixels of public/room/room.webp (2752x1536). */
export const W = 2752
export const H = 1536

export type Pt = [number, number]
export type Rect = [number, number, number, number] // x0, y0, x1, y1

/** Open floor the characters may stand on (feet position). */
export const FLOOR: Pt[] = [
  [700, 960], [720, 822], [1150, 818], [1640, 806], [1785, 835], [1790, 1095], [1860, 1110], [1860, 1300],
  [1600, 1320], [1600, 1490], [1290, 1490], [1290, 1222], [980, 1222], [960, 1110], [700, 1082], [500, 1110],
  [330, 1195], [240, 1185], [300, 1005], [560, 1000],
]
/** Furniture footprints inside FLOOR. */
export const OBSTACLES: Rect[] = [[770, 955, 1190, 1172]]

export type Hotspot = { id: string; rects: Rect[]; stand: Pt }
/** Clickable furniture; ids match panel hashes except the Galaxy-only cattree and beanbag. */
export const HOTSPOTS: Hotspot[] = [
  { id: 'resume', rects: [[690, 360, 1110, 815]], stand: [900, 860] },
  { id: 'work', rects: [[1130, 220, 1365, 812]], stand: [1250, 860] },
  { id: 'map', rects: [[1380, 150, 1750, 455]], stand: [1520, 860] },
  { id: 'projects', rects: [[1790, 60, 2160, 800]], stand: [1745, 880] },
  { id: 'nerd', rects: [[1990, 450, 2380, 840], [1830, 600, 2100, 1080]], stand: [1765, 1000] },
  { id: 'lab', rects: [[2330, 700, 2700, 1300]], stand: [1845, 1180] },
  { id: 'voice', rects: [[1900, 1120, 2250, 1400]], stand: [1840, 1260] },
  { id: 'legacy', rects: [[985, 1225, 1285, 1536]], stand: [1330, 1420] },
  { id: 'stories', rects: [[2080, 1395, 2300, 1520], [2400, 1170, 2752, 1536]], stand: [1580, 1300] },
  { id: 'learning', rects: [[760, 880, 1200, 1180]], stand: [1250, 1060] },
  { id: 'cattree', rects: [[300, 170, 700, 960]], stand: [690, 1010] },
  { id: 'beanbag', rects: [[420, 1110, 990, 1500]], stand: [760, 1092] },
]

/** Where Galaxy can sit off the floor; depth is the floor y used for scale and draw order. */
export type Perch = { at: Pt; depth: number }
export const TREE: Perch[] = [
  { at: [560, 735], depth: 960 },
  { at: [512, 505], depth: 960 },
  { at: [466, 230], depth: 960 },
]
export const TREE_BASE: Pt = [650, 1000]
export const BEANBAG: Perch = { at: [705, 1240], depth: 1320 }
export const BEANBAG_EXIT: Pt = [760, 1092]
export const RUG: Pt = [1650, 1300]

/** Atlas rects [x, y, w, h]; feet sit at the bottom centre of each frame. */
export const NIMESH = [[0, 0, 210, 560], [212, 0, 208, 561], [422, 0, 230, 553], [654, 0, 212, 562], [868, 0, 214, 560], [1084, 0, 214, 559], [1300, 0, 217, 560], [1519, 0, 209, 557], [1730, 0, 269, 546], [2001, 0, 277, 537], [2280, 0, 278, 534], [2560, 0, 207, 556]]
export const NIMESH_WALK = { down: [0, 1, 2, 3], up: [4, 5, 6, 7], side: [8, 9, 10] }
export const NIMESH_IDLE = { down: 11, up: 4, side: 8 }

export const GALAXY = [[0, 0, 343, 253], [345, 0, 350, 247], [697, 0, 346, 244], [1045, 0, 350, 224], [1397, 0, 248, 354], [1647, 0, 161, 354], [1810, 0, 219, 274], [2031, 0, 347, 245], [2380, 0, 350, 260], [2732, 0, 308, 344], [3042, 0, 280, 349], [3324, 0, 348, 202]]
export const CAT = { walk: [0, 1, 2, 3], sit: 4, sitFront: 5, loaf: 6, curl: 7, leap: 8, stretch: 9, groom: 10, lie: 11 }

/** Sprite scale at a floor depth: mild perspective, deeper (higher y) is closer and larger. */
export const depthScale = (y: number) => 1 + (y - 820) * 0.00024
export const NIMESH_SCALE = 1.1
export const GALAXY_SCALE = 0.62
