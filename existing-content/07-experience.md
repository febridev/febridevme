---
section: experience
source: https://febridev.me/#experience
anchor: experience
content_type: timeline (5 entries)
suggested_use: vertical timeline / experience list
migrate: yes (fix dates and copy)
---

# Experience (#experience)

## Verbatim content

**Eyebrow label (H4):** experience

**Heading (H2):** My Journey in the IT Industry

| # | Period | Role | Company | Responsibility (verbatim) |
|---|---|---|---|---|
| 1 | 2012 - 2014 | IT Support | PT.Namasindo Plas | Responsibility for asset IT management and support end user for realiable operational. |
| 2 | 2014 - 2018 | Junior Database Administrator | PT.Namasindo Plas | Responsibility for support custom oracle ebs report, backup and restore management, performance tunning. |
| 3 | 2018 - 2019 | Database Engineer | PT. Indonesia Commodity & Derivatives Exchange | Responsibility for design ERD for product, architechture design for infrasturcutre availability |
| 4 | 2019 - 2023 | Senior Database Administrator | PT. Indodev Niaga Internet | Responsibility for maintain, performance tuning cluster database cluster for HR saas on SEA Area |
| 5 | 2023 | Senior Database Administrator | PT. Bank Aladin Syariah | Responsibility for database cluster at core mobile banking system and core corporate internet banking |

## Migration notes

- **Date conflict:** this section starts in **2012**, while About says the IT career began in **2013**.
- **Stale / open-ended:** the last entry is "2023" with no end date or "Present". Confirm whether the owner is still at PT. Bank Aladin Syariah and whether there is a newer role (the meta description mentions a year as Data Engineer, which does not appear here).
- **Inconsistent with meta description:** "5 years as DBA" vs ~9 years of DBA roles listed (2014-2023).
- Company names have inconsistent spacing ("PT.Namasindo Plas" vs "PT. Indodev Niaga Internet"). Normalize to "PT " or "PT. ".
- Typos left as-is above: "realiable", "tunning", "architechture", "infrasturcutre", repeated "database cluster".
- Entries are task-descriptions only, with no outcomes or metrics. If possible, ask the owner for 1-2 quantified achievements per role (cluster sizes, uptime, performance gains).
- Ideal data shape: `{ start, end, role, company, summary, highlights[] }`, rendered newest-first in the new timeline (the original is oldest-first).
