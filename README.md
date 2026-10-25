# FB-02: Febri's portfolio

A grayscale portfolio seen from the cockpit of a white mobile unit. Behind every page is the main
monitor, drawn live with Three.js: a launch catapult, then a canyon, with live instruments over
it. The "Assembly line" section renders the monitor stage by stage and fires the catapult.
Scrolling fast, or holding **Hold to boost**, adds thrust. Design notes: `DESIGN.md`.

## Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview
```

## Edit content

Every visible string and project lives in `src/data/site.ts`. The top of that file lists the
assumptions to replace (name, email, socials, bio, spec sheet, and the three placeholder
projects). Project drawings are generated from each project's `seed`; swap them for real
screenshots when you have them.

## Where things are

| Path | What |
|---|---|
| `src/motion/cockpit.ts` | the view and its driver: hangar, canyon, instruments, per-section states, thrust |
| `src/motion/setup.ts` | loader, blast-door page transition, work preview, nav state |
| `src/engine/` | scroll, reveals, loader, page lifecycle (GSAP + Lenis on one clock) |
| `src/styles/` | tokens, engine foundation, site styles |
| `public/fb02.webp` | still of the cockpit view, shown with reduced motion or without WebGL (re-render with `/?still`) |

## Deploy

Set the real domain in `astro.config.mjs` (`site`), `src/data/site.ts` (`url`) and
`public/robots.txt`, rebuild, then deploy `dist/` to any static host, for example
`npx vercel --prod` or `npx netlify deploy --prod --dir dist`.
