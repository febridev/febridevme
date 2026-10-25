---
project: febridev.me content migration
source_site: https://febridev.me/
scraped: 2026-10-21
site_type: single-page personal portfolio (one HTML page, in-page anchors)
owner: Febriyant (febridev)
---

# FebriDev content map (for the new version)

This folder holds the content of the current site, split by section. Each file has front matter (`section`, `anchor`, `suggested_use`, `migrate`), the **verbatim** original content, and **Migration notes** that flag typos, stale facts and broken links. The original text is NOT corrected inside the "Verbatim content" blocks; fixes are suggested in the notes.

## Section map

| File | Section | Anchor | Suggested use in new site | Priority |
|---|---|---|---|---|
| `01-meta-seo.md` | Meta & SEO | head | Site-wide metadata | High (fix placeholders) |
| `02-navigation.md` | Navigation | global | Navbar | High |
| `03-hero.md` | Hero | `#home` | Landing hero | High |
| `04-about.md` | About Me | `#about` | Bio section | High (rewrite) |
| `05-social-links.md` | Follow Me | `#about` | Social icons / contact | Medium |
| `06-projects.md` | Latest Projects (3) | `#projects` | Project cards | High (fix link) |
| `07-experience.md` | Experience (5) | `#experience` | Timeline | High (fix dates) |
| `08-footer.md` | Footer | global | Footer | Low |

## Suggested page order for the new version

Navbar -> Hero -> About (+ social links) -> Projects -> Experience -> (new: Contact) -> Footer

## Content issues to resolve before/while migrating

1. **ZoomCamp project repo link is wrong** (points to `DBA-Tools-Cli`). Need the correct URL. (`06-projects.md`)
2. **Career start year conflict:** About says 2013, Experience says 2012.
3. **Stale summary:** meta description says "5 years DBA + 1 year Data Engineer"; timeline shows ~9 years of DBA roles and no Data Engineer role after 2023. Confirm the current role/title.
4. **Last job has no end date** ("2023"). Confirm current status.
5. **About copy uses second person** ("you bring...") and should be first person.
6. **Placeholder / relative values in SEO:** `twitter:image` is `URL_to_your_preview_image`; `og:image` is relative.
7. **Typos** across the site (e.g. "Surfe", "enginnering", "realiable", "tunning", "architechture", "infrasturcutre").
8. **Footer** lacks year and owner name.
9. **Missing content worth adding:** contact email/form, skills/tech stack, project tags, CV download.

## Assets referenced (not downloaded)

| Asset | URL |
|---|---|
| Hero portrait | https://febridev.me/img/personal1.jpeg |
| Project: Berapanih | https://febridev.me/img/portfolio/berapanih.jpg |
| Project: DBA CLI | https://febridev.me/img/portfolio/dba-cli.jpg |
| Project: ZoomCamp | https://febridev.me/img/portfolio/zoomcamp.jpg |
| OG image (relative, as written) | images/logo.png |

## Agent guidance

- Treat "Verbatim content" as the source of truth for wording; treat "Migration notes" as suggestions that need the owner's confirmation before being applied as facts.
- Do not invent facts (skills, metrics, dates) that are not in these files. Ask the owner instead.
- Keep data-shaped content (projects, experience, social links) as structured data (array/JSON/frontmatter) so the new UI can render it from one place.
