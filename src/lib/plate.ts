// Generated technical sheets: honest procedural covers for projects without imagery.
// Same seed, same drawing. Strokes use currentColor so the plate follows the ink.

const rng = (seed: number) => {
  let a = Math.floor(seed * 99991) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const f = (n: number) => n.toFixed(1);
const W = 800;
const H = 1000;

function dim(x1: number, x2: number, y: number, label: string) {
  const a = 8;
  return `<g class="p-dim">
    <line x1="${f(x1)}" y1="${f(y - 18)}" x2="${f(x1)}" y2="${f(y + 6)}"/>
    <line x1="${f(x2)}" y1="${f(y - 18)}" x2="${f(x2)}" y2="${f(y + 6)}"/>
    <line x1="${f(x1)}" y1="${f(y)}" x2="${f(x2)}" y2="${f(y)}"/>
    <path d="M${f(x1)} ${f(y)}l${a} -3v6zM${f(x2)} ${f(y)}l-${a} -3v6z" class="p-fill"/>
    <text x="${f((x1 + x2) / 2)}" y="${f(y - 8)}" text-anchor="middle">${label}</text>
  </g>`;
}

function centerCross(cx: number, cy: number, r: number) {
  return `<g class="p-center">
    <line x1="${f(cx - r)}" y1="${f(cy)}" x2="${f(cx + r)}" y2="${f(cy)}"/>
    <line x1="${f(cx)}" y1="${f(cy - r)}" x2="${f(cx)}" y2="${f(cy + r)}"/>
  </g>`;
}

function hatch(id: string) {
  return `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="9" class="p-thin"/></pattern>`;
}

// A flange seen from the front, with its section to the side.
function flange(r: () => number, id: string) {
  const cx = 300, cy = 400;
  const R = 150 + r() * 40;
  const rin = R * (0.32 + r() * 0.12);
  const rb = (R + rin) / 2 + 10;
  const n = 4 + Math.floor(r() * 5) * 2;
  const rot = r() * Math.PI;
  let holes = '';
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    holes += `<circle cx="${f(cx + Math.cos(a) * rb)}" cy="${f(cy + Math.sin(a) * rb)}" r="${f(9 + r() * 4)}"/>`;
  }
  const t = 46 + r() * 30;
  const sx = 560;
  return `${hatch(id)}
    <circle cx="${cx}" cy="${cy}" r="${f(R)}" class="p-bold"/>
    <circle cx="${cx}" cy="${cy}" r="${f(rin)}"/>
    <circle cx="${cx}" cy="${cy}" r="${f(rb)}" class="p-center"/>
    ${holes}${centerCross(cx, cy, R + 30)}
    <rect x="${sx}" y="${f(cy - R)}" width="${f(t)}" height="${f(R - rin)}" fill="url(#${id})" class="p-bold"/>
    <rect x="${sx}" y="${f(cy + rin)}" width="${f(t)}" height="${f(R - rin)}" fill="url(#${id})" class="p-bold"/>
    <rect x="${f(sx + t)}" y="${f(cy - rin * 0.7)}" width="${f(t * 0.6)}" height="${f(rin * 1.4)}"/>
    <line x1="${sx - 30}" y1="${cy}" x2="${f(sx + t * 1.6 + 30)}" y2="${cy}" class="p-center"/>
    ${dim(cx - R, cx + R, cy + R + 60, `Ø${Math.round(R * 2)}`)}
    ${dim(sx, sx + t, cy + R + 60, `${Math.round(t)}`)}`;
}

// A thruster bell: side profile and its rings from behind.
function nozzle(r: () => number, id: string) {
  const x = 120, y = 230;
  const len = 330 + r() * 80;
  const throat = 40 + r() * 20;
  const exit = 130 + r() * 50;
  const k = 0.35 + r() * 0.3;
  const top = `M${x} ${f(y + 160 - throat - 40)} L${x + 70} ${f(y + 160 - throat)} C${f(x + 70 + len * k)} ${f(y + 160 - throat)} ${f(x + len * 0.8)} ${f(y + 160 - exit)} ${f(x + 70 + len)} ${f(y + 160 - exit)}`;
  const bottom = top.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, a, b) => `${a} ${f(2 * (y + 160) - parseFloat(b))}`);
  const rx = 560, ry = 690;
  let rings = '';
  for (let i = 0; i < 4; i++) rings += `<circle cx="${rx}" cy="${ry}" r="${f(exit * (0.35 + i * 0.22))}"${i === 3 ? ' class="p-bold"' : ''}/>`;
  return `${hatch(id)}
    <path d="${top}" class="p-bold" fill="none"/>
    <path d="${bottom}" class="p-bold" fill="none"/>
    <line x1="${f(x + 70 + len)}" y1="${f(y + 160 - exit)}" x2="${f(x + 70 + len)}" y2="${f(y + 160 + exit)}"/>
    <rect x="${x - 50}" y="${f(y + 160 - throat - 40)}" width="50" height="${f((throat + 40) * 2)}" fill="url(#${id})" class="p-bold"/>
    <line x1="${x - 80}" y1="${y + 160}" x2="${f(x + len + 110)}" y2="${y + 160}" class="p-center"/>
    ${rings}${centerCross(rx, ry, exit + 30)}
    ${dim(x + 70, x + 70 + len, y + 160 + exit + 50, `${Math.round(len)}`)}
    ${dim(rx - exit, rx + exit, ry + exit + 50, `Ø${Math.round(exit * 2)}`)}`;
}

// A bracket plate with cut corners and a hole pattern.
function bracket(r: () => number, id: string) {
  const x = 110, y = 170;
  const w = 460 + r() * 100, h = 380 + r() * 120;
  const c = 40 + r() * 40;
  const outline = `M${f(x + c)} ${y} H${f(x + w - c)} L${f(x + w)} ${f(y + c)} V${f(y + h - c)} L${f(x + w - c)} ${f(y + h)} H${f(x + c)} L${x} ${f(y + h - c)} V${f(y + c)} Z`;
  const cols = 2 + Math.floor(r() * 3), rows = 2 + Math.floor(r() * 2);
  let holes = '';
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const hx = x + c + 30 + (i * (w - 2 * c - 60)) / Math.max(1, cols - 1);
      const hy = y + c + 30 + (j * (h - 2 * c - 60)) / Math.max(1, rows - 1);
      holes += `<circle cx="${f(hx)}" cy="${f(hy)}" r="14"/>${centerCross(hx, hy, 24)}`;
    }
  const sw = w * (0.3 + r() * 0.15), sh = h * 0.28;
  return `${hatch(id)}
    <path d="${outline}" class="p-bold" fill="none"/>
    <rect x="${f(x + w / 2 - sw / 2)}" y="${f(y + h / 2 - sh / 2)}" width="${f(sw)}" height="${f(sh)}" fill="url(#${id})"/>
    ${holes}
    <rect x="${f(x + w + 50)}" y="${y}" width="22" height="${f(h)}" fill="url(#${id})" class="p-bold"/>
    ${dim(x, x + w, y + h + 60, `${Math.round(w)}`)}`;
}

let uid = 0; // a page can show the same plate twice (index thumb + preview): pattern ids must differ

export function plateSvg(seed: number, code: string, title: string, sheet: string, kind?: number) {
  const r = rng(seed);
  const id = `h${Math.round(seed * 1000)}-${uid++}`;
  const kinds = [flange, nozzle, bracket];
  const pick = Math.floor(r() * kinds.length);
  const draw = kinds[(kind ?? pick) % kinds.length](r, id);
  let grid = '';
  for (let gx = 40; gx < W; gx += 40) grid += `<line x1="${gx}" y1="20" x2="${gx}" y2="${H - 20}"/>`;
  for (let gy = 40; gy < H; gy += 40) grid += `<line x1="20" y1="${gy}" x2="${W - 20}" y2="${gy}"/>`;
  const by = H - 150;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <g class="p-grid">${grid}</g>
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" class="p-bold" fill="none"/>
  <g class="p-draw" fill="none">${draw}</g>
  <g class="p-block">
    <rect x="${W - 380}" y="${by}" width="360" height="130" class="p-paper p-bold"/>
    <line x1="${W - 380}" y1="${by + 46}" x2="${W - 20}" y2="${by + 46}"/>
    <line x1="${W - 200}" y1="${by + 46}" x2="${W - 200}" y2="${by + 130}"/>
    <line x1="${W - 380}" y1="${by + 88}" x2="${W - 20}" y2="${by + 88}"/>
    <text x="${W - 364}" y="${by + 32}" class="p-title">${title}</text>
    <text x="${W - 364}" y="${by + 74}">Unit FB-02</text>
    <text x="${W - 184}" y="${by + 74}">Sheet ${sheet}</text>
    <text x="${W - 364}" y="${by + 116}">${code}</text>
    <text x="${W - 184}" y="${by + 116}">Scale 1:${2 + Math.floor(r() * 6)}</text>
  </g>
</svg>`;
}
