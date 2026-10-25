---
section: navigation
source: https://febridev.me/ (header)
anchor: none (global)
content_type: navigation
suggested_use: header / navbar component
migrate: yes
---

# Navigation

## Verbatim content

**Brand / logo text:** Febridev_  (links to `#home`)

| Label | Target | Type |
|---|---|---|
| Home | `#home` | in-page anchor |
| About Me | `#about` | in-page anchor |
| Projects | `#projects` | in-page anchor |
| Experience | `#experience` | in-page anchor |
| Blog | https://medium.com/@febriyant_ | external (Medium) |

## Migration notes

- Anchor IDs map to the section files: `home` -> `03-hero.md`, `about` -> `04-about.md`, `projects` -> `06-projects.md`, `experience` -> `07-experience.md`.
- Blog is an external link to Medium. If the new site gets its own blog, this becomes an internal route; otherwise keep it external with `rel="noopener"`.
- The brand text uses a trailing underscore ("Febridev_") as a terminal-cursor motif. Keep it if the new design preserves that style.
