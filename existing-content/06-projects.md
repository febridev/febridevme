---
section: projects
source: https://febridev.me/#projects
anchor: projects
content_type: portfolio items (3)
suggested_use: project cards grid (image, title, description, repo link)
migrate: yes (fix links and copy)
---

# Portfolio / Latest Projects (#projects)

## Verbatim content

**Eyebrow label (H4):** Portfolio

**Heading (H2):** Latest Projects

**Intro:** This is my public project on github is little bit more data enginnering project

---

### 1. Berapanih

- **Image:** ![portfolio-1](https://febridev.me/img/portfolio/berapanih.jpg)
- **Description:** Some ETL Project Scrap Price from [Shell Oil Price](https://www.shell.co.id/in_id/pengendara-bermotor/bahan-bakar-shell/how-shell-price-fuel.html) and From [My Pertamina](https://mypertamina.id/fuels-harga) Is Indonesia Oil & Gas Company.
- **Link (label "Github"):** https://github.com/febridev/berapanih
- **Tags (inferred, not on page):** ETL, web scraping, data engineering

---

### 2. DBA Cli Tools

- **Image:** ![portfolio-1](https://febridev.me/img/portfolio/dba-cli.jpg)
- **Description:** CLI tools support your day to day as database administrator
- **Link (label "Github"):** https://github.com/febridev/DBA-Tools-Cli
- **Tags (inferred):** CLI, database administration

---

### 3. Data Talks Club ZoomCamp Project

- **Image:** ![portfolio-1](https://febridev.me/img/portfolio/zoomcamp.jpg)
- **Description:** This is my project to finish zoom camp with Data Talks Club at 2022. My project is related with spotify data set from kaggle for favorite genre popular tracks etc
- **Link (label "Github"):** https://github.com/febridev/DBA-Tools-Cli
- **Tags (inferred):** data engineering, Data Talks Club, Kaggle, Spotify

## Migration notes

- **Likely bug in source:** the ZoomCamp project links to `DBA-Tools-Cli` (same as project 2). It should point to its own repo. **Need the correct URL from the owner before migrating.**
- All three images share the alt text `portfolio-1`. Give each a descriptive alt (e.g. "Berapanih fuel price ETL project preview").
- Copy needs polish: "is little bit more data enginnering project" -> typos ("enginnering"), grammar. "CLI tools support your day to day as database administrator" is also awkward. Left verbatim here.
- Cards have no tech-stack tags, live demos or dates. Adding a stack (e.g. Python, Postgres, Airflow, dbt, whichever are actually used) would help the new version; confirm with the owner rather than guessing.
- Project data is a good fit for a structured array (`title`, `description`, `image`, `repo`, `tags`) so cards can be rendered from data.
