---
section: meta-seo
source: https://febridev.me/ (<head>)
content_type: metadata
suggested_use: site-wide SEO config (layout head / metadata API)
migrate: yes, with fixes
---

# Meta & SEO

## Verbatim content

| Field | Value |
|---|---|
| title | FebriDev |
| og:title / twitter:title | FebriDev - Database Administrator and Data Engineer |
| description / og:description / twitter:description | FebriDev - Professional Database Administrator with 5 years of experience and 1 year as a Data Engineer. Also skilled in website development. |
| keywords | Database Administrator, Data Engineer, Web Developer, Website Development, febridev, febriyant, febridev.me |
| author | febriyant |
| robots | index, follow |
| og:type | website |
| og:url / twitter:url | https://febridev.me |
| og:image | images/logo.png |
| twitter:card | summary_large_image |
| twitter:image | URL_to_your_preview_image |
| viewport | width=device-width, initial-scale=1.0 |

## Migration notes

- `twitter:image` is still a **placeholder** (`URL_to_your_preview_image`). Replace with a real absolute URL.
- `og:image` is a **relative path** (`images/logo.png`). Social crawlers need an absolute URL, e.g. `https://febridev.me/images/logo.png` (note the hero image path uses `/img/`, not `/images/`, so confirm the real asset location).
- The description says "5 years as DBA and 1 year as Data Engineer", but the Experience section lists ~9 years as DBA (2014-2023). **Description is stale; update it.** See `07-experience.md`.
- Consider adding a canonical URL and a dedicated 1200x630 OG image.
