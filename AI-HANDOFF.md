# AI Handoff: Adding New SME Profiles

This document is for **AI agents** and **maintainers** who add or update subject-matter expert (SME) profiles. The roster is static: all data lives in **`docs/data/smes.json`**. Adding a new entry there automatically adds a tile on the main roster and a detail page at `profile.html?id=<id>`.

---

## JSON schema (one object per SME)

Each SME is a single object in the **`docs/data/smes.json`** array. Use this schema exactly so the site and filters work.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | **Yes** | UUID v4 (e.g. `"82faefcc-111c-4618-a185-5910c174e185"`). Used in URLs. Generate a new UUID for each profile. |
| `name` | string | **Yes** | Full display name. |
| `title` | string | **Yes** | Job title or role (e.g. "Head of Protocol Research"). |
| `headline` | string | No | One-line positioning (used on profile page). |
| `shortBio` | string | **Yes** | 1–2 sentences for the roster card (keep under ~160 chars for display). |
| `longBio` | string | No | Full bio; paragraphs separated by `\n\n`. Shown on profile page. |
| `history` | array | No | Professional / work history. Each item: `{ "role": "...", "organization": "...", "period": "2020–2023", "description": "..." }`. Shown below bio. |
| `sectors` | string[] | No | High-level sectors (e.g. `["IoT", "SaaS"]`). **Used for the main-page filter chips** and the card sector pill. Keep relevant and consistent so the filter bar stays useful. |
| `tags` | string[] | No | Expertise tags (e.g. `["Rust", "Backend"]`). Shown on cards and profile; used for **search** and for matching when a sector filter is applied. Not shown as filter chips. |
| `keywords` | string[] | No | Extra terms for search (e.g. `["protocol", "L1", "DeFi"]`). |
| `location` | string | No | e.g. "Remote (EU)", "London, UK". |
| `languages` | string[] | No | Spoken languages (e.g. `["English", "Slovak", "Czech"]`). Shown on profile and roster card. |
| `avatar` | string | No | URL or path to image. Empty string if none. |
| `links` | array | No | `[{ "label": "LinkedIn", "url": "https://..." }]`. |
| `engagement` | string[] | No | e.g. `["Advisory", "Fractional", "Hands-on"]`. |
| `createdAt` | string | No | ISO date or YYYY-MM-DD for "recent" sort. |
| `colorVariant` | number | No | **When adding a new person**, assign a permanent color: set to an integer **0–5** (random or chosen). This drives the card top bar and profile avatar colour (teal, blue, violet, amber, rose, cyan). If omitted, the app derives a variant from the profile `id` hash.

- **ID rule**: Generate a random UUID v4 for each new profile (e.g. via `uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`). Must be **unique** in the file.

---

## Example: from PDF text to JSON

**Input (raw PDF copy-paste):**

```
JANE DEE — Head of Protocol Research

Jane has spent eight years in crypto and traditional finance, with a focus on
protocol-level research and tokenomics. She led research at a tier-1 L1 and
has published on MEV, consensus, and incentive design. She advises teams on
economic security and governance and is available for fractional or
project-based engagements.

Expertise: Protocol design, Tokenomics, MEV, Governance. Sectors: Web3, DeFi.
Location: Remote (EU). Links: example.com/jane, @janedee, LinkedIn.
```

**Output (single new entry for `docs/data/smes.json`):**

```json
{
  "id": "c3a1f9e2-7b84-4d56-9e0a-1a2b3c4d5e6f",
  "name": "Jane Dee",
  "title": "Head of Protocol Research",
  "headline": "Web3 protocol design and tokenomics.",
  "shortBio": "Protocol researcher and former quant. Focus on MEV, consensus, and incentive design.",
  "longBio": "Jane has spent eight years in crypto and traditional finance, with a focus on protocol-level research and tokenomics. She led research at a tier-1 L1 and has published on MEV, consensus, and incentive design. She advises teams on economic security and governance and is available for fractional or project-based engagements.",
  "sectors": ["Web3", "DeFi"],
  "tags": ["Protocol design", "Tokenomics", "MEV", "Governance"],
  "keywords": ["protocol", "tokenomics", "MEV", "consensus", "L1", "DeFi", "governance"],
  "location": "Remote (EU)",
  "languages": ["English", "Slovak"],
  "avatar": "",
  "links": [
    { "label": "Website", "url": "https://example.com/jane" },
    { "label": "Twitter", "url": "https://twitter.com/janedee" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/janedee" }
  ],
  "engagement": ["Advisory", "Fractional", "Project-based"],
  "createdAt": "2025-01-15"
}
```

---

## Step-by-step for an AI agent

1. **Receive**: User provides raw text (e.g. copy-pasted from a PDF bio).
2. **Extract**: Parse name, title, bio, expertise, sectors, location, spoken languages, links, and engagement from the text. Infer missing fields or leave as empty string / empty array.
3. **Generate `id`**: Create a new UUID v4 (e.g. `python3 -c "import uuid; print(uuid.uuid4())"`). Must be unique in the file.
4. **Build**: One JSON object matching the schema above. Use double quotes, no trailing commas if the JSON standard in the repo disallows them (the current `smes.json` uses no trailing commas).
5. **Insert**: Add the new object to the **array** in `docs/data/smes.json`:
   - Preserve existing indentation (e.g. 2 spaces).
   - Insert after the last entry: add a comma after the previous object’s `}` and then the new object, then ensure the closing `]` is on its own line.
   - Keep the array sorted if the repo convention is e.g. alphabetical by `id` or by `createdAt` (see README or existing file).
6. **Verify**: Ensure the file is valid JSON (no duplicate keys, no trailing commas before `]` or `}` if the project's linter forbids them).
7. **Color (optional but recommended)**: When adding a new person, set `colorVariant` to a random integer 0–5 so that profile has a permanent, consistent colour on the roster and profile page. If omitted, the site derives one from the profile id.

---

## Filter tags (main page)

- **Filter chips** on the main roster are built from **`sectors` only** (not from `tags`). That keeps the filter bar short and relevant (e.g. IoT, SaaS, Smart energy, B2B).
- **When you add or edit a profile**: the filter chip list is **refreshed automatically** on the next page load—it is derived from the current `docs/data/smes.json`. No extra build step or config file to update.
- **When adding a new profile**: always set **`sectors`** (e.g. 1–3 high-level sectors). That ensures the new profile is filterable and that the main-page filter chips stay complete. Use existing sector values where they fit (e.g. `"IoT"`, `"Smart energy"`, `"SaaS"`) so chips stay consistent; add a new sector only when it’s a distinct category.

---

## Anonymization (real CVs → roster profiles)

When adding profiles derived from **real CVs**, anonymize so that individuals and employers cannot be identified. Apply these rules consistently.

| What | Practice | Example |
|------|----------|--------|
| **Display name** | Do **not** use the person’s real name. Use a **role-based label** that describes their expertise (used as the main display “name” on the roster). | "Embedded Linux & IoT Lead", "Full-Stack & Mobile Developer", "CEO & Business Development Lead" |
| **`id`** | Slug derived from the **role-based name** (lowercase, hyphenated), not from the real name. Must be unique. | `embedded-linux-iot-lead`, `fullstack-mobile-iot-developer`, `ceo-business-development-iot` |
| **Employers / organizations** | Replace real company names with **generic descriptors**. | "Large technology company", "Smart energy & IoT company", "Product company", "Software agency", "B2B SaaS" |
| **Locations** | Use **region or country** only, not cities, campuses, or addresses. | "Nordic", "Central Europe", "Finland" |
| **Education** | Use **generic institution type**, not school or university names. | "University of applied science", "Technical university" |
| **Personal details** | Omit specific courses, institutes, LinkedIn, recommendations, family, and other identifying text. | Do not include "please see my LinkedIn" or named certifications that identify the person. |
| **Bios and history** | Keep **roles, technologies, and responsibilities**; strip names of people, projects, and programs that identify the employer or individual. | Keep "Led EU Horizon 2020 smart city programme" as "Led EU smart city / innovation programme" if the exact programme name is identifying. |

**Summary:** The roster should reflect real skills and experience without allowing identification of the person or their past employers. When in doubt, prefer a more generic formulation.

---

## Localization (UI only)

- **Scope**: Only **UI chrome** is translated (navigation, headings, filter labels, buttons, footer, profile section titles, error messages). SME names, bios, tags, and links in `smes.json` stay in English.
- **Data**: Translations live in **`docs/data/i18n.json`** with top-level keys `en`, `fi`, `sv`. Each language is an object of string keys (e.g. `hero.text`, `filters.title`, `profile.sections.bio`). Use `{{n}}` or `{{id}}` in a string for interpolation; the app replaces them via `t(key, { n: 5 })` etc.
- **Adding or editing UI text**: Edit `docs/data/i18n.json` and add or change the key in all three languages (`en`, `fi`, `sv`). Keep keys in sync across languages. New keys used in HTML (e.g. `data-i18n="my.key"`) or in scripts (`t('my.key')`) will show the translated string once added to i18n.json.

---

## Adding new developers / maintainers

- **Run locally**: From the repo root, run a static server rooted at `docs/` (e.g. `python -m http.server 8080` and open `http://localhost:8080/docs/`, or run from inside `docs/` and open `http://localhost:8080/`). See README.
- **Edit data**: Only `docs/data/smes.json` needs to be edited to add or change profiles. No build step.
- **Reviewing AI edits**: Diff `docs/data/smes.json` for new or changed objects; confirm `id` is unique and required fields are present. Run the site locally and open the new profile URL to spot-check.
