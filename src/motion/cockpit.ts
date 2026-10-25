// The cockpit: one Three.js scene behind every page, seen from the pilot's seat of FB-02.
// Inputs: the section in view ([data-hangar] anchors), scroll velocity, the boost control,
// the pointer and an idle clock. Outputs: where the unit is (catapult or canyon), how much of
// the main monitor is drawn, the instruments, thrust and the HUD readouts.
import { gsap } from 'gsap';
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DataTexture, DirectionalLight, Euler, Fog, Group,
  HemisphereLight, InstancedMesh, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, MeshToonMaterial,
  NearestFilter, PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, Quaternion, RedFormat, Scene, ShaderMaterial,
  Vector3, WebGLRenderer,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { onPage, onScroll, scrollState, isMobile, isTouch } from '../engine';

type S = {
  pos: number; yaw: number; pitch: number; roll: number; alt: number; x: number; vy: number;
  fills: number; hud: number; door: number; thrust: number; cruise: number; signal: number; wash: number;
};
const KEYS = ['pos', 'yaw', 'pitch', 'roll', 'alt', 'x', 'vy', 'fills', 'hud', 'door', 'thrust', 'cruise', 'signal', 'wash'] as const;
const base: S = { pos: 0, yaw: 0, pitch: 0, roll: 0, alt: 0, x: 0.22, vy: 0, fills: 1, hud: 1, door: 1, thrust: 0, cruise: 0.3, signal: 1, wash: 0 };
const st = (o: Partial<S>): S => ({ ...base, ...o });
const out = (o: Partial<S>): S => st({ pos: 1, cruise: 1, ...o }); // launched: flying the canyon

// Per-section states. yaw/pitch/roll in degrees; x and vy shift the vanishing point (fractions of the view, + = right / up).
const STATES: Record<string, S> = {
  hero: st({}),
  statement: st({ yaw: 7, pitch: 1, x: 0.24, wash: 0.4 }),
  frame: st({ yaw: -5, pitch: 2, x: 0.24, fills: 0, hud: 0, door: 0, wash: 0.05 }),
  armor: st({ yaw: 3, x: 0.24, hud: 0, door: 0, wash: 0.05 }),
  wiring: st({ x: 0.24, door: 0.3, wash: 0.05 }),
  launch: out({ alt: -4, pitch: -3, x: 0.24, thrust: 0.8, wash: 0.05 }),
  work: out({ alt: -6, yaw: 4, roll: 8, x: 0.28, wash: 0.6 }),
  spec: out({ alt: -2, yaw: -6, roll: -6, x: 0.28, wash: 0.55 }),
  pilot: out({ alt: 4, pitch: 5, cruise: 0.7, x: 0.28, wash: 0.35 }),
  contact: out({ alt: 6, pitch: 7, x: 0.28, thrust: 1, wash: 0.45 }),
  case: out({ alt: -8, yaw: 9, roll: 6, x: 0.28, wash: 0.62 }),
  'case-body': out({ alt: -4, yaw: -6, roll: -4, x: 0.28, wash: 0.62 }),
  'case-end': out({ alt: 3, pitch: 4, x: 0.28, thrust: 0.5, wash: 0.35 }),
  lost: out({ alt: -13, pitch: -5, roll: 14, x: 0.2, cruise: 0, hud: 0.7, signal: 0, wash: 0.15 }),
};
const LABELS: Record<string, string> = {
  hero: 'Catapult', statement: 'Standby', frame: 'Wireframe', armor: 'Surfaces', wiring: 'Instruments', launch: 'Launch',
  work: 'Sortie record', spec: 'Spec check', pilot: 'Cruise', contact: 'Next sortie', case: 'Sortie log', 'case-body': 'Sortie log',
  'case-end': 'Return', lost: 'Signal lost',
};

// ?still: the view used to render public/fb02.webp, the no-WebGL fallback.
const still = typeof location !== 'undefined' && new URLSearchParams(location.search).has('still');
const STILL = st({ x: 0.2 });

// Phones: the vanishing point is centered (and raised above the copy in the hero and 404); every other section
// is washed back behind the text.
const mobileTweak = (s: S, key: string): S =>
  key === 'hero' || key === 'lost' ? { ...s, x: 0, vy: 0.2, wash: Math.max(s.wash, 0.25) } : { ...s, x: 0, wash: Math.max(s.wash, 0.72) };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const DEG = Math.PI / 180;

// ---- Hangar: the launch catapult, built from boxes, merged per material ----
const FLOOR = -3.2, TOP = 7.4, W = 8, EXIT = 72, BAY = 8;

const ramp = new DataTexture(new Uint8Array([200, 230, 255]), 3, 1, RedFormat);
ramp.minFilter = ramp.magFilter = NearestFilter;
ramp.needsUpdate = true;
// The 12 edges of a box, directly: EdgesGeometry's angle test costs too much on a slow phone at boot.
const BOX_EDGES = [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 2, 6, 3, 7];
function boxEdges(w: number, h: number, d: number) {
  const c: number[] = [];
  for (const i of BOX_EDGES) c.push(((i & 1) - 0.5) * w, (((i >> 1) & 1) - 0.5) * h, (((i >> 2) & 1) - 0.5) * d);
  return new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array(c), 3));
}

// polygonOffset pushes faces back so the ink edges draw clean instead of z-fighting into dashes.
const toon = (hex: string) => new MeshToonMaterial({ color: hex, gradientMap: ramp, transparent: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });

function buildHangar() {
  const kinds = { panel: toon('#f7f7f5'), frame: toon('#e4e4e1'), dark: toon('#a6a6a3') };
  const parts: Record<keyof typeof kinds, BufferGeometry[]> = { panel: [], frame: [], dark: [] };
  const edges: BufferGeometry[] = [];
  const m4 = new Matrix4(), q = new Quaternion(), one = new Vector3(1, 1, 1);
  const box = (kind: keyof typeof kinds, w: number, h: number, d: number, x: number, y: number, z: number, rz = 0, ry = 0, into = parts[kind], edgeInto = edges) => {
    m4.compose(new Vector3(x, y, z), q.setFromEuler(new Euler(0, ry, rz)), one);
    into.push(new BoxGeometry(w, h, d).applyMatrix4(m4));
    edgeInto.push(boxEdges(w, h, d).applyMatrix4(m4));
  };
  const H = TOP - FLOOR;
  for (let z0 = 6; z0 > -EXIT; z0 -= BAY) {
    const zc = z0 - BAY / 2;
    for (const s of [-1, 1]) {
      box('panel', W - 1, 0.4, BAY - 0.08, s * (W / 2 + 0.5), FLOOR - 0.2, zc); // deck plates either side of the rail
      box('frame', 0.9, H + 0.6, 0.9, s * (W - 0.45), (TOP + FLOOR) / 2, z0); // rib
      box('frame', 0.5, 2.6, 0.5, s * (W - 1.35), TOP - 1.05, z0, s * Math.PI / 4); // knee brace
      box('panel', 0.3, 4.6, BAY - 1.3, s * (W - 0.2), FLOOR + 2.3, zc); // wall, lower
      box('panel', 0.3, 5.1, BAY - 1.3, s * (W - 0.2), 4.45, zc); // wall, upper
      box('frame', 1.7, 0.18, BAY, s * (W - 1.05), 1.75, zc); // catwalk
      box('frame', 0.08, 0.08, BAY, s * (W - 1.85), 2.75, zc); // handrail
      box('dark', 0.5, 0.5, BAY, s * 3, TOP - 0.25, zc); // crane rail
    }
    box('frame', W * 2, 0.9, 0.9, 0, TOP, z0); // rib, top
    box('panel', W * 2, 0.3, BAY - 0.9, 0, TOP + 0.35, zc); // ceiling
    box('panel', 2, 0.4, BAY - 0.08, 0, FLOOR - 0.2, zc); // rail bed
  }
  box('dark', 1, 0.25, EXIT + 6, 0, FLOOR + 0.12, -EXIT / 2 + 3); // catapult rail
  for (let x = -6.4; x <= 6.4; x += 1.6) if (Math.abs(x) > 1) box('dark', 0.45, 0.04, 2.6, x, FLOOR + 0.02, -EXIT + 3.5, 0, Math.PI / 4); // hazard stripes
  for (const s of [-1, 1]) box('frame', 2.4, H + 1.6, 2, s * (W - 1.2), (TOP + FLOOR) / 2 + 0.3, -EXIT); // portal
  box('frame', W * 2, 2.2, 2, 0, TOP - 0.3, -EXIT);

  const root = new Group();
  const meshes: Mesh[] = [];
  for (const k of Object.keys(kinds) as (keyof typeof kinds)[]) {
    const mesh = new Mesh(mergeGeometries(parts[k]), kinds[k]);
    meshes.push(mesh);
    root.add(mesh);
  }
  const edgeMat = new LineBasicMaterial({ color: '#111111', transparent: true, opacity: 0.6 });
  root.add(new LineSegments(mergeGeometries(edges), edgeMat));

  // Blast doors at the exit, sliding into the walls.
  const doors: Group[] = [];
  for (const s of [-1, 1]) {
    const g = new Group();
    const dp: BufferGeometry[] = [], de: BufferGeometry[] = [];
    box('panel', 5.7, TOP - FLOOR - 1.4, 0.6, 0, 0, 0, 0, 0, dp, de);
    for (const y of [-2.2, 0.6, 3.4]) box('frame', 5.2, 0.35, 0.8, 0, y, 0, 0, 0, dp, de);
    const mesh = new Mesh(mergeGeometries(dp), kinds.panel);
    meshes.push(mesh);
    g.add(mesh, new LineSegments(mergeGeometries(de), edgeMat));
    g.position.set(s * 2.85, (TOP + FLOOR) / 2 - 0.7, -EXIT + 0.4);
    g.userData.side = s;
    doors.push(g);
    root.add(g);
  }

  // Guide lights either side of the rail: ink segments that chase toward the exit.
  const LIGHTS = 2 * Math.ceil((EXIT + 6) / 4);
  const lights = new InstancedMesh(new BoxGeometry(0.45, 0.08, 1.1), new MeshBasicMaterial({ color: '#ffffff' }), LIGHTS);
  const lz: number[] = [];
  for (let i = 0; i < LIGHTS; i++) {
    const z = 6 - Math.floor(i / 2) * 4;
    lz.push(z);
    lights.setMatrixAt(i, m4.makeTranslation((i % 2 ? 1 : -1) * 1.5, FLOOR + 0.04, z));
  }
  root.add(lights);
  return { root, meshes, mats: Object.values(kinds), doors, lights, lz };
}

// ---- Canyon: a heightfield drawn on the GPU, one function shared by the lines and the fills ----
const HEIGHT = /* glsl */ `
uniform float uTravel;
uniform float uNear;
uniform float uFar;
float hgt(vec2 p) {
  float n = sin(p.x * 0.045 + sin(p.y * 0.021) * 2.0) * 0.5
          + sin(p.y * 0.037 + p.x * 0.019) * 0.32
          + sin((p.x - p.y) * 0.093) * 0.13
          + sin(p.x * 0.23 + p.y * 0.17) * 0.05;
  float wall = smoothstep(9.0, 52.0, abs(p.x + sin(p.y * 0.012) * 10.0));
  return -21.0 + (n * 0.5 + 0.5) * (2.5 + wall * 34.0) + wall * 8.0;
}
`;
const LINE_VS = HEIGHT + /* glsl */ `
varying float vFog;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  wp.y = hgt(vec2(wp.x, wp.z - uTravel));
  vec4 mv = viewMatrix * wp;
  vFog = smoothstep(uNear, uFar, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const LINE_FS = /* glsl */ `
uniform float uAlpha;
varying float vFog;
void main() { gl_FragColor = vec4(vec3(0.067), uAlpha * (1.0 - vFog)); }`;
const FILL_VS = HEIGHT + /* glsl */ `
varying float vFog;
varying float vLight;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec2 p = vec2(wp.x, wp.z - uTravel);
  wp.y = hgt(p);
  const float e = 1.5;
  vec3 n = normalize(vec3(hgt(p - vec2(e, 0.0)) - hgt(p + vec2(e, 0.0)), 2.0 * e, hgt(p - vec2(0.0, e)) - hgt(p + vec2(0.0, e))));
  vLight = dot(n, normalize(vec3(-0.5, 0.75, 0.45)));
  vec4 mv = viewMatrix * wp;
  vFog = smoothstep(uNear, uFar, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const FILL_FS = /* glsl */ `
uniform float uAlpha;
varying float vFog;
varying float vLight;
void main() {
  float tone = vLight > 0.78 ? 0.975 : vLight > 0.5 ? 0.9 : 0.8; // three cel tones
  gl_FragColor = vec4(vec3(tone), uAlpha * (1.0 - vFog));
}`;

function buildCanyon(mobile: boolean) {
  const SP = mobile ? 4 : 3, HALF = mobile ? 88 : 96, NEAR = 12, FAR = mobile ? 240 : 288;
  const nx = Math.round((HALF * 2) / SP), nz = Math.round((FAR + NEAR) / SP);
  const uniforms = { uTravel: { value: 0 }, uNear: { value: 70 }, uFar: { value: FAR - 20 }, uAlpha: { value: 0.5 } };
  const pts: number[] = [];
  for (let i = 0; i <= nx; i++) for (let j = 0; j < nz; j++) {
    const x = -HALF + i * SP;
    pts.push(x, 0, NEAR - j * SP, x, 0, NEAR - (j + 1) * SP);
  }
  for (let j = 0; j <= nz; j++) for (let i = 0; i < nx; i++) {
    const z = NEAR - j * SP;
    pts.push(-HALF + i * SP, 0, z, -HALF + (i + 1) * SP, 0, z);
  }
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
  const lines = new LineSegments(lineGeo, new ShaderMaterial({ uniforms, vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false }));
  const fillGeo = new PlaneGeometry(HALF * 2, nz * SP, nx, nz).rotateX(-Math.PI / 2).translate(0, 0, NEAR - (nz * SP) / 2);
  const fillU = { ...uniforms, uAlpha: { value: 1 } };
  const fill = new Mesh(fillGeo, new ShaderMaterial({
    uniforms: fillU, vertexShader: FILL_VS, fragmentShader: FILL_FS, transparent: true,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  }));
  lines.renderOrder = 2;
  lines.frustumCulled = fill.frustumCulled = false; // heights come from the shader, so the CPU bounds are wrong
  const root = new Group();
  root.add(fill, lines);
  return { root, fill, fillU, uniforms, SP };
}

// ---- Instruments: drawn in the DOM over the canvas, so they stay crisp and wash with it ----
function buildInstruments(host: HTMLElement) {
  const ticks: string[] = [];
  for (let d = -40; d <= 400; d += 5) {
    const label = d % 10 ? '' : String(((d % 360) + 360) % 360).padStart(3, '0');
    ticks.push(`<i class="${label ? 'is-major' : ''}" style="--d:${d}">${label}</i>`);
  }
  const rungs = [-20, -15, -10, -5, 0, 5, 10, 15, 20]
    .map((d) => `<div class="mon__rung${d < 0 ? ' is-neg' : ''}${d === 0 ? ' is-zero' : ''}" style="--d:${d}">${d ? `<span>${Math.abs(d)}</span><span>${Math.abs(d)}</span>` : ''}</div>`)
    .join('');
  const mon = document.createElement('div');
  mon.className = 'mon';
  mon.innerHTML = `
    <i class="mon__corner"></i><i class="mon__corner"></i><i class="mon__corner"></i><i class="mon__corner"></i>
    <div class="mon__inst" data-inst>
      <div class="mon__hdg"><div class="mon__hdg-tape" data-hdg-tape>${ticks.join('')}</div><b data-hdg>270</b></div>
      <div class="mon__vp">
        <div class="mon__win"><div class="mon__roll" data-roll><div class="mon__ladder" data-ladder>${rungs}</div></div></div>
        <svg class="mon__ret" viewBox="-60 -60 120 120" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle r="26" stroke-dasharray="30.8 10" data-ring />
          <path d="M-38 0h-12M38 0h12M0 -38v-10M0 38v10M-9 0h-6M9 0h6M0 9v6" />
          <circle r="1.6" fill="currentColor" stroke="none" />
          <path d="M-46 -32v-14h14M46 -32v-14h-14M-46 32v14h14M46 32v14h-14" data-lock />
        </svg>
        <div class="mon__tape mon__tape--spd"><span>SPD</span><div class="mon__ticks" data-spd-ticks></div><b data-spd>0000</b></div>
        <div class="mon__tape mon__tape--alt"><span>ALT</span><div class="mon__ticks" data-alt-ticks></div><b data-alt>0000</b></div>
      </div>
    </div>`;
  host.appendChild(mon);
  const q = <T extends Element = HTMLElement>(s: string) => mon.querySelector<T>(s)!;
  return {
    mon, inst: q('[data-inst]'), hdgTape: q('[data-hdg-tape]'), hdg: q('[data-hdg]'), roll: q('[data-roll]'), ladder: q('[data-ladder]'),
    ring: q<SVGElement>('[data-ring]'), lock: q<SVGElement>('[data-lock]'), spd: q('[data-spd]'), alt: q('[data-alt]'),
    spdTicks: q('[data-spd-ticks]'), altTicks: q('[data-alt-ticks]'),
  };
}

// Static on the main monitor: the boot flash and the lost signal.
const STATIC_FS = /* glsl */ `
uniform float uT;
uniform float uA;
float r(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 p = floor(gl_FragCoord.xy / 2.0);
  float n = r(p + floor(uT * 24.0) * 7.31);
  float band = 1.0 - smoothstep(0.0, 0.06, abs(fract(gl_FragCoord.y / 700.0 - uT * 0.35) - 0.5));
  gl_FragColor = vec4(vec3(0.07), uA * n * (0.6 + 0.4 * band));
}`;

export type Cockpit = { boot: (duration?: number) => void };

export function startCockpit(): Promise<Cockpit> {
  const host = document.getElementById('gl')!;
  const mobile = isMobile();
  // No MSAA: it cost half the frame rate on weak GPUs, and the 1px ink edges read as pen lines without it.
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.classList.add('gl-canvas');
  host.appendChild(renderer.domElement);
  const ui = buildInstruments(host);

  const scene = new Scene();
  scene.fog = new Fog('#f2f2f0', 60, 150);
  const camera = new PerspectiveCamera(34, 1, 0.1, 400);
  camera.rotation.order = 'YXZ';
  scene.add(new HemisphereLight('#ffffff', '#6a6a68', 1.1));
  const sun = new DirectionalLight('#ffffff', 2.2);
  sun.position.set(-4, 9, 3);
  scene.add(sun);

  const hangar = buildHangar();
  const canyon = buildCanyon(mobile);
  scene.add(hangar.root, canyon.root);

  // Air: dust drifts at rest and streams past at speed.
  const DUST = mobile ? 140 : 260;
  const dust = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) dust.set([(Math.random() - 0.5) * 18, FLOOR + Math.random() * 10, -Math.random() * 90], i * 3);
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dust, 3));
  const dustPts = new Points(dustGeo, new PointsMaterial({ color: '#6a6a68', size: mobile ? 0.05 : 0.04, transparent: true, opacity: 0.7, depthWrite: false }));
  scene.add(dustPts);

  // Speed lines: ink streaks from the vanishing point, the anime shorthand for acceleration.
  const LINES = 90;
  const lines = new Float32Array(LINES * 6);
  const seeds = Array.from({ length: LINES }, () => ({ a: Math.random() * Math.PI * 2, r: 2.5 + Math.random() * 9, z: -Math.random() * 120, s: 0.6 + Math.random() }));
  const linesGeo = new BufferGeometry();
  linesGeo.setAttribute('position', new BufferAttribute(lines, 3));
  const linesMat = new LineBasicMaterial({ color: '#111111', transparent: true, opacity: 0, depthWrite: false, fog: false });
  const speedLines = new LineSegments(linesGeo, linesMat);
  speedLines.frustumCulled = false;
  scene.add(speedLines);

  const staticU = { uT: { value: 0 }, uA: { value: 0 } };
  const noise = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    uniforms: staticU, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: STATIC_FS,
  }));
  noise.frustumCulled = false;
  noise.renderOrder = 10;
  scene.add(noise);
  if (still) dustPts.visible = false;

  const unlit = new Color('#cfcfcc'), lit = new Color('#111111'), tmp = new Color();

  // ---- State ----
  const cur: S = { ...STATES.hero };
  let target: S = { ...STATES.hero };
  let stage = 'hero';
  let anchors: { y: number; key: string; label: string }[] = [];
  const intro = { boot: still ? 1 : 0 };
  const input = { boost: 0, boostTarget: 0, px: 0, py: 0, tx: 0, ty: 0, vel: 0 };
  let hud: { stage?: HTMLElement | null; sys?: HTMLElement | null; thrust?: HTMLElement | null; root?: HTMLElement | null } = {};
  let last = { stage: '', sys: -1, thrust: -1, spd: -1, alt: -1, hdg: -1, x: -1, vy: -1, ppd: -1, inst: -1 };
  let travel = 0, hangarZ = 0, ppd = 0;

  function measure() {
    const y = scrollState().y;
    anchors = [...document.querySelectorAll<HTMLElement>('[data-hangar]')].map((el) => {
      const r = el.getBoundingClientRect();
      const k = el.dataset.hangar!;
      return { y: r.top + y + r.height / 2, key: k, label: LABELS[k] ?? el.dataset.readout ?? k };
    }).sort((a, b) => a.y - b.y);
  }

  function stateAt(focus: number): S {
    if (still) return STILL;
    const pick = (k: string) => (mobile ? mobileTweak(STATES[k] ?? base, k) : STATES[k] ?? base);
    if (!anchors.length) return pick('hero');
    if (focus <= anchors[0].y) { stage = anchors[0].key; return pick(anchors[0].key); }
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (focus < b.y) {
        const t = smooth((focus - a.y) / (b.y - a.y));
        stage = t < 0.5 ? a.key : b.key;
        const A = pick(a.key), B = pick(b.key);
        const o = {} as S;
        for (const k of KEYS) o[k] = lerp(A[k], B[k], t);
        return o;
      }
    }
    const lastA = anchors[anchors.length - 1];
    stage = lastA.key;
    return pick(lastA.key);
  }

  let baseFov = 34;
  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    baseFov = innerWidth < innerHeight ? 56 : 34;
    measure();
  }
  resize();
  addEventListener('resize', resize);

  if (!isTouch()) addEventListener('pointermove', (e) => { input.tx = e.clientX / innerWidth - 0.5; input.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  onScroll(({ velocity }) => { input.vel = velocity; });

  // Boost control: pointer and keyboard both hold it.
  function wireBoost() {
    const btn = document.querySelector<HTMLButtonElement>('[data-boost]');
    if (!btn || btn.dataset.wired) return;
    btn.dataset.wired = '1';
    const on = () => { input.boostTarget = 1; btn.classList.add('is-on'); };
    const off = () => { input.boostTarget = 0; btn.classList.remove('is-on'); };
    btn.addEventListener('pointerdown', (e) => { btn.setPointerCapture(e.pointerId); on(); });
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); on(); } });
    btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') off(); });
    btn.addEventListener('blur', off);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onPage(() => {
    hud = {
      root: document.querySelector('[data-hud]'),
      stage: document.querySelector('[data-hud-stage]'),
      sys: document.querySelector('[data-hud-sys]'),
      thrust: document.querySelector('[data-hud-thrust]'),
    };
    last = { ...last, stage: '', sys: -1, thrust: -1 };
    wireBoost();
    measure();
    const fonts = () => measure();
    document.fonts.addEventListener('loadingdone', fonts);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    return () => { document.fonts.removeEventListener('loadingdone', fonts); ro.disconnect(); };
  });

  const pad = (n: number, l = 4) => String(Math.max(0, n)).padStart(l, '0');

  // ---- Frame ----
  function frame(time: number) {
    if (document.hidden) return;
    const dr = gsap.ticker.deltaRatio(60);
    const dt = dr / 60;
    const k = 1 - Math.pow(0.94, dr);
    target = stateAt(scrollState().y + innerHeight * 0.5);
    for (const key of KEYS) cur[key] += (target[key] - cur[key]) * k;

    input.px += (input.tx - input.px) * (1 - Math.pow(0.95, dr));
    input.py += (input.ty - input.py) * (1 - Math.pow(0.95, dr));
    input.boost += (input.boostTarget - input.boost) * (1 - Math.pow(input.boostTarget ? 0.9 : 0.95, dr));
    const velThrust = Math.min(1, Math.abs(input.vel) / 28);
    input.vel *= Math.pow(0.9, dr);
    const thrust = Math.min(1, Math.max(cur.thrust, velThrust, input.boost));
    const t = time;

    // Boot: static, then the wireframe, then surfaces, then instruments.
    const boot = intro.boot;
    const fills = cur.fills * clamp01(boot * 2.2 - 0.5);
    const inst = cur.hud * clamp01(boot * 2.5 - 1.4);
    const outside = smooth(clamp01((cur.pos - 0.82) / 0.18));

    // Where the unit is: the hangar slides past during launch; the canyon always flows (the carrier is flying too).
    const speed = 6 + cur.cruise * 22 + thrust * 150;
    travel += speed * dt;
    const hz = cur.pos * (EXIT + 22);
    const hangarSpeed = (hz - hangarZ) / Math.max(dt, 1e-3);
    hangarZ = hz;
    hangar.root.position.z = hz;
    hangar.root.visible = cur.pos < 0.995;
    canyon.uniforms.uTravel.value = travel;
    canyon.root.position.z = travel % canyon.SP;

    for (const g of hangar.doors) g.position.x = g.userData.side * (2.85 + cur.door * 5.9);
    const opaque = fills > 0.999; // opaque draws front to back with early depth; transparent overdraws every layer
    for (const m of hangar.mats) {
      m.opacity = fills;
      if (m.transparent === opaque) { m.transparent = !opaque; m.needsUpdate = true; }
    }
    for (const m of hangar.meshes) m.visible = fills > 0.01;
    canyon.fill.visible = fills > 0.01;
    canyon.fillU.uAlpha.value = fills;

    // Guide lights chase toward the exit: slowly at rest, fast under thrust.
    const chase = t * (2 + thrust * 16);
    for (let i = 0; i < hangar.lz.length; i++) {
      const on = Math.pow(0.5 + 0.5 * Math.sin(hangar.lz[i] * 0.35 + chase), 6);
      hangar.lights.setColorAt(i, tmp.copy(unlit).lerp(lit, on * fills));
    }
    hangar.lights.instanceColor!.needsUpdate = true;

    // Dust rides with the hangar inside and with the air outside.
    const flow = lerp(Math.max(0, hangarSpeed), speed, outside) * dt + 0.004 * dr;
    const dp = dustGeo.attributes.position as BufferAttribute;
    for (let i = 0; i < DUST; i++) {
      let z = dp.getZ(i) + flow;
      if (z > 2) z -= 92;
      dp.setZ(i, z);
      dp.setY(i, dp.getY(i) + Math.sin(t * 0.7 + i) * 0.002 * dr);
    }
    dp.needsUpdate = true;

    for (let i = 0; i < LINES; i++) {
      const L = seeds[i];
      L.z += speed * dt * 1.6 * L.s;
      if (L.z > 4) L.z -= 124;
      const x = Math.cos(L.a) * L.r, y = Math.sin(L.a) * L.r * 0.7;
      const o = i * 6;
      lines[o] = lines[o + 3] = x;
      lines[o + 1] = lines[o + 4] = y;
      lines[o + 2] = L.z;
      lines[o + 5] = L.z - (1 + thrust * 14 * L.s);
    }
    linesGeo.attributes.position.needsUpdate = true;
    linesMat.opacity = still ? 0 : Math.max(0, thrust - 0.12) * 0.5;

    // Camera: the pilot's head. Idle sway, pointer look, thrust shake and a wider view under thrust.
    const shake = thrust * 0.04 + (1 - cur.signal) * 0.01;
    const yaw = cur.yaw + Math.sin(t * 0.13) * 0.8 - input.px * 5;
    const pitch = cur.pitch + Math.sin(t * 0.17) * 0.5 - input.py * 3;
    const roll = cur.roll + Math.sin(t * 0.21) * 0.6 - input.px * 2 + (Math.random() - 0.5) * thrust * 0.6;
    camera.position.set((Math.random() - 0.5) * shake, cur.alt * outside + Math.sin(t * 0.9) * 0.04 + (Math.random() - 0.5) * shake, 0);
    camera.rotation.set(pitch * DEG, yaw * DEG, roll * DEG);
    camera.fov = baseFov + thrust * 9;
    // Shift the frame so the vanishing point sits in the machine's lane.
    camera.filmOffset = -cur.x * 2 * Math.tan((camera.fov * DEG) / 2) * camera.aspect * camera.getFilmWidth();
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[9] = -2 * cur.vy; // vertical lens shift, the same trick upward

    staticU.uT.value = t;
    staticU.uA.value = still ? 0 : (1 - cur.signal) * 0.24 + clamp01(1 - boot * 3) * 0.6;
    noise.visible = staticU.uA.value > 0.005;

    const op = (1 - cur.wash).toFixed(3);
    if (host.style.opacity !== op) host.style.opacity = op;
    renderer.render(scene, camera);

    // Instruments (style writes only when a value moves).
    ppd = (innerHeight / 2 / Math.tan((camera.fov * DEG) / 2)) * Math.tan(DEG);
    if (Math.abs(ppd - last.ppd) > 0.05) { ui.mon.style.setProperty('--ppd', ppd.toFixed(2)); last.ppd = ppd; }
    if (Math.abs(cur.x - last.x) > 0.0005) { ui.mon.style.setProperty('--vx', `${(50 + cur.x * 100).toFixed(2)}%`); last.x = cur.x; }
    if (Math.abs(cur.vy - last.vy) > 0.0005) { ui.mon.style.setProperty('--vy', `${(50 - cur.vy * 100).toFixed(2)}%`); last.vy = cur.vy; }
    const flick = cur.signal < 0.98 || (inst > 0.02 && inst < 0.98) ? (Math.random() > 0.25 ? 1 : 0.35) : 1;
    const instOp = Math.round(inst * flick * 100) / 100;
    if (instOp !== last.inst) { ui.inst.style.opacity = String(instOp); last.inst = instOp; }
    ui.roll.style.rotate = `${roll.toFixed(2)}deg`;
    ui.ladder.style.translate = `0 ${(pitch * ppd).toFixed(1)}px`;
    const hdg = (((270 + yaw) % 360) + 360) % 360;
    ui.hdgTape.style.translate = `${(-hdg * ppd).toFixed(1)}px 0`;
    ui.ring.style.rotate = `${(t * 12) % 360}deg`;
    ui.lock.style.scale = String(1 + thrust * 0.35);
    const spd = Math.round(speed * 18);
    const alt = Math.round((camera.position.y + 21) * 36);
    ui.spdTicks.style.translate = `0 ${((spd % 50) / 50 * 12).toFixed(1)}px`;
    ui.altTicks.style.translate = `0 ${((alt % 50) / 50 * 12).toFixed(1)}px`;
    if (spd !== last.spd) ui.spd.textContent = pad(spd);
    if (alt !== last.alt) ui.alt.textContent = pad(alt);
    const hdgR = Math.round(hdg) % 360;
    if (hdgR !== last.hdg) ui.hdg.textContent = pad(hdgR, 3);

    // HUD panel readouts.
    const sysVal = Math.round(((fills + inst) / 2) * 100);
    const thrustVal = Math.round(thrust * 100);
    const label = anchors.find((a) => a.key === stage)?.label ?? LABELS[stage] ?? 'Catapult';
    if (hud.sys && sysVal !== last.sys) hud.sys.textContent = pad(sysVal, 3);
    if (hud.thrust && thrustVal !== last.thrust) {
      hud.thrust.textContent = pad(thrustVal, 3);
      hud.root?.style.setProperty('--thrust', (thrustVal / 100).toFixed(2));
    }
    if (hud.stage && label !== last.stage) hud.stage.textContent = label;
    last = { ...last, stage: label, sys: sysVal, thrust: thrustVal, spd, alt, hdg: hdgR };
  }

  // Compile shaders (both hangar variants: see `opaque`) and paint once before reporting ready, so the
  // doors open on a finished frame and nothing compiles mid-scroll.
  for (const m of hangar.mats) m.transparent = false;
  renderer.compile(scene, camera);
  frame(0);
  renderer.compile(scene, camera);
  gsap.ticker.add(frame);
  document.documentElement.classList.add('gl-on');

  return Promise.resolve({
    boot(duration = 1.4) {
      gsap.to(intro, { boot: 1, duration, ease: 'power2.out' });
    },
  });
}
