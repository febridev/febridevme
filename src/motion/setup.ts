// Global motion for FB-02: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  addLoaderTask, ease, isTouch, onPage, onScroll, prefersReducedMotion, scrollToTarget, setLoaderExit, setLoaderFormat, setTransition,
} from '../engine';
import type { Cockpit } from './cockpit';

const webgl = () => {
  if (prefersReducedMotion()) return false;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
};

// Loader rows flip to OK as their real task finishes.
const check = (name: string) => {
  const row = document.querySelector<HTMLElement>(`[data-check="${name}"]`);
  if (!row) return;
  row.classList.add('is-ok');
  row.querySelector('b')!.textContent = 'OK';
};

let cockpit: Promise<Cockpit | null> = Promise.resolve(null);
let doorsOpen!: () => void;
const opened = new Promise<void>((r) => (doorsOpen = r));
let noGl = false;

function loadCockpit() {
  // Astro swaps <html> attributes on navigation: restore the flags this module owns.
  document.addEventListener('astro:after-swap', () => {
    const h = document.documentElement.classList;
    h.add('is-loaded');
    if (noGl) h.add('no-gl');
  });
  if (!webgl()) {
    noGl = true;
    document.documentElement.classList.add('no-gl');
    ['frame', 'lights'].forEach(check);
    return;
  }
  cockpit = import('./cockpit')
    // Arriving late (slow network): build the scene after the doors open, so its setup can't stall them.
    .then((mod) => { check('frame'); return performance.now() > 1400 ? opened.then(() => mod.startCockpit()) : mod.startCockpit(); })
    .then((h) => { check('lights'); return h; })
    .catch((err) => {
      console.warn('Cockpit view unavailable', err);
      noGl = true;
      document.documentElement.classList.add('no-gl');
      return null;
    });
  addLoaderTask(cockpit);
}

// Blast doors: two panels meet at a seam, then part. Used by the loader and every navigation.
const doors = (root: ParentNode, sel: string) => [root.querySelector(`${sel}="top"]`), root.querySelector(`${sel}="bottom"]`)];
let nextTitle = '';

function transitions() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    // Roll links hold their label twice: read the first copy only.
    nextTitle = a?.dataset.title || a?.querySelector('span span')?.textContent || a?.querySelector('span:not(:empty)')?.textContent || a?.textContent?.trim() || '';
  }, true);
  setTransition({
    leave: (c) => {
      const [top, bottom] = doors(c, '[data-cdoor');
      const label = c.querySelector('[data-curtain-label]');
      if (label) label.textContent = nextTitle ? `Docking: ${nextTitle}` : 'Docking';
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(top, { yPercent: -101 }, { yPercent: 0, duration: 0.7, ease: ease.inOut }, 0)
        .fromTo(bottom, { yPercent: 101 }, { yPercent: 0, duration: 0.7, ease: ease.inOut }, 0)
        .fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.35);
    },
    enter: (c) => {
      const [top, bottom] = doors(c, '[data-cdoor');
      return gsap.timeline()
        .to(c.querySelector('[data-curtain-label]'), { autoAlpha: 0, duration: 0.15 })
        .to(top, { yPercent: -101, duration: 0.8, ease: ease.inOut }, 0.1)
        .to(bottom, { yPercent: 101, duration: 0.8, ease: ease.inOut }, 0.1)
        .set(c, { autoAlpha: 0 });
    },
  });
}

function loader() {
  if (document.documentElement.classList.contains('booted-before')) {
    document.getElementById('loader')?.remove(); // runLoader skips; the monitor boots when it arrives
    document.documentElement.classList.add('is-loaded');
    doorsOpen();
    cockpit.then((c) => c?.boot());
    return;
  }
  try { sessionStorage.setItem('fb02-booted', '1'); } catch {}
  setLoaderFormat((p) => String(Math.round(p)).padStart(3, '0'));
  document.fonts.ready.then(() => check('type'));
  setLoaderExit((root) => {
    const [top, bottom] = doors(root, '[data-door');
    cockpit.then((c) => c?.boot());
    // A slow device has already waited: open faster so the whole loader stays near 2.6 s.
    const d = performance.now() > 2000 ? 0.32 : 0.6;
    return gsap.timeline()
      .to(top, { yPercent: -101, duration: d, ease: ease.inOut }, 0)
      .to(bottom, { yPercent: 101, duration: d, ease: ease.inOut }, 0)
      .call(doorsOpen);
  });
}

// Work index: the plate follows the pointer on desktop. Touch shows the inline thumbnails.
function indexPreview() {
  onPage(() => {
    const list = document.querySelector('[data-index]');
    const box = document.querySelector<HTMLElement>('.preview');
    if (!list || !box || isTouch() || prefersReducedMotion()) return;
    const plates = [...box.querySelectorAll<HTMLElement>('[data-plate]')];
    const x = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
    const rot = gsap.quickTo(box, 'rotate', { duration: 0.8, ease: 'power3.out' });
    let lastX = 0, px = 0, py = 0, open = false, minX = 0;
    let cur: HTMLElement | null = null;
    // The plate sits right of the hovered title, never on it.
    const place = () => x(Math.max(px + 40, minX));
    const move = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY;
      place(); y(py); rot(gsap.utils.clamp(-8, 8, (px - lastX) * 0.4)); lastX = px;
    };
    const show = (e: Event) => {
      cur = e.currentTarget as HTMLElement;
      if (e instanceof PointerEvent) { px = e.clientX; py = e.clientY; y(py); }
      const slug = cur.dataset.preview;
      minX = (cur.querySelector('.index__title > span')?.getBoundingClientRect().right ?? 0) + 48; // clear of the title, its hover shift and the tilt
      if (e.type !== 'focus') place();
      plates.forEach((p) => p.classList.toggle('is-on', p.dataset.plate === slug));
      if (e.type === 'focus') { const r = cur.getBoundingClientRect(); x(r.right - r.width * 0.25); y(r.top + r.height / 2); }
      if (!open) gsap.fromTo(box, { autoAlpha: 0, clipPath: 'inset(50% 0% 50% 0%)' }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: ease.out, overwrite: 'auto' });
      open = true;
    };
    const hide = () => {
      if (!open) return;
      open = false;
      gsap.to(box, { clipPath: 'inset(50% 0% 50% 0%)', autoAlpha: 0, duration: 0.35, ease: ease.inOut, overwrite: 'auto' }); // a quick pass must not let the open tween finish last
    };
    const links = [...list.querySelectorAll<HTMLAnchorElement>('a[data-preview]')];
    links.forEach((a) => { a.addEventListener('pointerenter', show); a.addEventListener('focus', show); a.addEventListener('blur', hide); });
    list.addEventListener('pointerleave', hide);
    addEventListener('pointermove', move, { passive: true });
    // Rows slide away under a still pointer without any pointer event: check the hovered row itself.
    const off = onScroll(() => {
      if (!open || !cur) return;
      const r = cur.getBoundingClientRect();
      if (document.activeElement !== cur && (px < r.left || px > r.right || py < r.top || py > r.bottom)) hide();
      else if (r.bottom < 0 || r.top > innerHeight) hide();
    });
    return () => { removeEventListener('pointermove', move); off(); };
  });
}

// Links to a section of the page already open (/#work on home) glide there instead of
// reloading the page, and hand keyboard focus to the section.
function inPageLinks() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    history.replaceState(history.state, '', a.hash);
    scrollToTarget(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }, true);
}

// Header steps aside while scrolling down; nav marks the section in view on the home page.
function frameAndSpy() {
  let last = 0, up = 0;
  const h = () => document.documentElement.classList;
  onScroll(({ y }) => {
    const d = y - last;
    last = y;
    if (Math.abs(d) > 400) { up = 0; h().remove('frame-away'); } // a jump (back button, anchor): show the frame
    else if (d > 0) { up = 0; if (y > 160) h().add('frame-away'); }
    else if (d < 0 && (up -= d) > 90) h().remove('frame-away'); // small corrections keep it away
    if (y <= 160) h().remove('frame-away');
    h().toggle('frame-band', y > 160);
  });
  onPage(({ path }) => {
    up = 0;
    document.documentElement.classList.remove('frame-away');
    if (path !== '/') return;
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
    links.forEach((l) => {
      const section = document.getElementById(l.dataset.spy!);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section, start: 'top 55%', end: 'bottom 45%',
        onToggle: (s) => (s.isActive ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current')),
      });
    });
  });
}

// CTA: a panel slides across from the pointer's side and locks.
function ctaFill() {
  onPage(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const off: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-fill]').forEach((btn) => {
      const fill = btn.querySelector<HTMLElement>('[class$="__fill"]');
      if (!fill) return;
      const side = (e: PointerEvent | null) => {
        if (!e) return 'left';
        const r = btn.getBoundingClientRect();
        return e.clientX - r.left < r.width / 2 ? 'left' : 'right';
      };
      const closed = (s: string) => (s === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)');
      const open = (e: PointerEvent | null) => {
        btn.classList.add('is-filled');
        gsap.fromTo(fill, { clipPath: closed(side(e)) }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: ease.out, overwrite: 'auto' });
      };
      const close = (e: PointerEvent | null) => {
        btn.classList.remove('is-filled');
        gsap.to(fill, { clipPath: closed(side(e) === 'left' ? 'left' : 'right'), duration: 0.45, ease: ease.out, overwrite: 'auto' });
      };
      const enter = (e: PointerEvent) => open(e);
      const leave = (e: PointerEvent) => close(e);
      const focus = () => btn.matches(':focus-visible') && open(null);
      const blur = () => close(null);
      btn.addEventListener('pointerenter', enter); btn.addEventListener('pointerleave', leave);
      btn.addEventListener('focus', focus); btn.addEventListener('blur', blur);
      off.push(() => {
        btn.removeEventListener('pointerenter', enter); btn.removeEventListener('pointerleave', leave);
        btn.removeEventListener('focus', focus); btn.removeEventListener('blur', blur);
      });
    });
    return () => off.forEach((f) => f());
  });
}

export function setupMotion() {
  loadCockpit();
  loader();
  transitions();
  indexPreview();
  frameAndSpy();
  inPageLinks();
  ctaFill();
}
