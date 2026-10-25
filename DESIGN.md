# FB-02: design notes

## Brief

- **Subject:** Febri, frontend developer (name inferred from the account handle `febridev`; placeholder).
- **Audience:** studios and product teams hiring a frontend / creative developer.
- **Job:** get hired for interface and motion work.
- **Owner's asks:** white and grayscale base; a dynamic mecha background in the spirit of
  anime mobile suits; all content overlaid on top; 3D that can be accelerated; mechanical taste;
  a loader while content loads.
- **Revision 2 (owner):** no robot character on the page. The background is the pilot's view:
  the cockpit's main monitor and its instruments.
- **Assumptions:** see the top of `src/data/site.ts`. Every project is a fictional placeholder.

## Concepts

| | Idea | Anchor | Signature | O / F / Fe / P |
|---|---|---|---|---|
| A. Name | **Unit FB-02.** The site is the manual for a white mobile unit named after its builder: F and B from Febri, 02 from February, the month the name comes from | the name Febri derives from *Februari* | a real-time 3D unit stands behind every page | 4 / 5 / 4 / 2 |
| B. Process | **The assembly line.** Building interfaces like building a kit: frame, armor, wiring, launch. Scrolling the process section strips the unit to its inner frame and bolts it back together | how a frontend developer actually works (structure, components, motion, ship) | scroll-driven exploded view | 4 / 4 / 4 / 3 |
| C. Formal | **Technical drawing.** Everything is an orthographic sheet: dimension lines, callouts, title blocks | engineering manuals | the page draws itself in line | 3 / 3 / 5 / 4 |

**Pick A as the identity, with B as its signature moment.** A gives the name a machine; B gives
the machine something true to do (the four stages are how the work is done). C is stolen for
detail only: project plates are drawn as technical sheets with title blocks.

## Concept card (revision 2: pilot's view)

```
Idea:        The site is the view from the cockpit of FB-02, a white mobile unit named after its builder.
Metaphor:    the main monitor of a mobile suit cockpit, from the catapult to open sky.
Signature:   a real-time 3D view (Three.js) behind all content, with live instruments drawn over it
             (boresight, pitch ladder, heading, speed and altitude tapes). The "Assembly line"
             renders the monitor in the order the work is done: wireframe (Frame), surfaces (Armor),
             instruments (Wiring), then the catapult fires and the view leaves the hangar for a
             canyon (Launch). Scroll speed, or holding "Boost", adds thrust: speed lines, a wider
             lens, shake, and the tapes spin.
Emotion:     the first 3 seconds feel like blast doors opening onto a catapult and a bright exit.
Motion verb: lock and release: heavy parts move fast, then stop hard (expo), with no bounce.
Screenshot:  the catapult in one-point perspective, the reticle on the open door, "Febri" on the left.
```

## Art direction

**Palette (grayscale only, by role)**

| Role | Hex | Use |
|---|---|---|
| ground | `#f2f2f0` | hangar wall: page background |
| ink | `#111111` | text, ink lines of the view, instruments |
| muted | `#5a5a58` | secondary text (6.4:1 on ground) |
| line | `rgb(17 17 17 / .14)` | hairlines, grid |
| ghost | `#e1e1de` | the giant backdrop type |
| curtain | `#1a1a1a` | the blast doors (loader and page transition) |

The view: hangar panels `#f7f7f5`, structure `#e4e4e1`, rail `#a6a6a3`, canyon in three cel tones
(97%, 90%, 80% white), ink lines `#111`. Light tones keep body copy above AA where it crosses the
view. No hue anywhere.

**Type**

- Archivo (variable, width 62 to 125). Display: width 125, weight 800, tracking -0.04em, the
  model-kit box lettering. Text and UI: width 100, weight 400 and 500.
- Martian Mono: only for live data (HUD readouts, loader checks, spec values). Never for
  decorative labels.

**Grid and rhythm.** 12 columns. Content lives on columns 1 to 8; columns 9 to 12 are the
machine's lane, where the vanishing point, the reticle and the HUD sit. Hanging lines: col 1 and col 5.
Section moods: hero (full viewport), statement (airy), assembly (four 90svh chapters), work
(tight rows), spec (normal), pilot (airy), launch (full viewport).

**Shape.** Radius 0 everywhere. Corners are cut (`clip-path` chamfer) on the boost button and
plates only: machined, not rounded.

**Motion.** `expo.out` for entrances, `expo.inOut` for doors. Heavy things (the view, doors)
0.8 to 1.2 s; UI 0.3 to 0.5 s. The view's state is damped (lerp 0.06 per frame) so it moves
with mass.

## Composition plan

```
HERO (poster)
┌──────────────────────────────────────────────────────┐
│Febri FB-02                          Work Pilot Contact│
│ catapult in one-point perspective   [270] heading    │
│Febri (h1, xl)              SPD  ⌜ ◎ ⌝  ALT           │
│Frontend developer.            ───door───             │
│statement 3 lines              rail → exit            │
│                                         SYSTEMS 100% │
│Scroll to run the line          [Hold to boost] THRUST│
└──────────────────────────────────────────────────────┘
STATEMENT (statement): one paragraph at t-l across cols 1-8
ASSEMBLY (sticky narrative): 4 chapters on cols 1-6, the monitor renders up and the catapult fires
WORK (index list): rows on cols 1-9, plate preview follows the pointer
SPEC (data/facts): two-column spec sheet with mono values
PILOT (asymmetric pair): bio on cols 5-9, portrait slot as a plate on 1-4
LAUNCH (footer as finale): "Write to Febri" mega, full thrust and a climb out of the canyon
```

Case page: title block hero (xl title, meta grid), hero plate, context / idea in an asymmetric
pair, craft plates with captions, outcome statement, next project as a full-width door.

404: "Signal lost": the unit is down in the canyon, banked, with static over the monitor.

## Genericness test

- A generic build would put a spinning robot over a dark gradient with neon. Changed: white
  hangar, grayscale technical illustration (flat-shaded solids plus ink edge lines), no glow.
- A generic loader is a percentage. Changed: a boot check whose rows are the real loading tasks
  (typefaces, geometry, lights), printed on the blast doors that open into the hero.
- Generic "accelerate" would be a speed slider. Changed: scroll velocity and a hold-to-boost
  control drive the same thrust value, read out live in the HUD.

## Decisions

- The view is procedural (no model file): the hangar is boxes merged into four draw calls; the
  canyon is one heightfield computed in the vertex shader, so it flows forever at no CPU cost.
- Instruments are DOM inside `#gl`: crisp text, washed with the canvas, transform-only updates.
- Reduced motion / no WebGL: a still of the catapult view (`public/fb02.webp`) fills the hero;
  no loader theatrics; everything readable.
- Idle: the pilot's head sways, the guide lights chase toward the exit, dust drifts, the canyon
  keeps flowing (the carrier is moving). Pauses with the tab.
