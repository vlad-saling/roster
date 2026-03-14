# Code Rules — Master Index

<!-- Refined from loot/ by slowShipper refine. Source: conventions.md, patterns.md. -->

This file is the entry point for all code rules. The review commands read this index and ask the user which rule sets to load for the current review.

## Rule files

| File | Scope | Summary |
|------|-------|---------|
| `general.md` | All code | Universal rules: correctness, security, naming, structure, testing, comments. |
| `frontend.md` | docs/ (HTML, CSS, JS, data) | Static site: data fetch, escapeHtml, BEM, theme, filters, localStorage; conventions; lessons learned. |

This project is front-end only (static site); no backend rule file.

## Conventions (this project)

- **File naming:** Kebab-case for scripts and styles (e.g. `render-roster.js`, `ui-interactions.js`). Lowercase HTML and JSON.
- **JS:** camelCase for variables/functions; ALL_CAPS for storage keys and numeric constants (e.g. `STORAGE_KEY`, `NUM_COLOR_VARIANTS`). Prefixes: `get*`, `load*`, `render*`, `init*`. ES modules, named exports only, relative `./*.js` imports.
- **CSS:** BEM-like block__element, block--modifier. Custom properties in base.css; overrides in themes.css. Order: base → layout → components → themes.
- **Data:** SME `id` = UUID v4, unique; no trailing commas in smes.json (per AI-HANDOFF). i18n keys dot notation; interpolation `{{n}}` via `t(key, { n })`.

## Profile data (smes.json)

- **UUID on creation:** When adding a new SME profile to `docs/data/smes.json`, assign a new **UUID v4** to `id`. The id is fixed at creation; do not reuse or derive from other profiles. Generate with e.g. `uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`. The `id` must be **unique** in the file. See also `domain-specific-knowledge.md` and **AI-HANDOFF.md**.

## Adding a new rule file

1. Create a new `.md` file in this directory named after the domain (e.g. `testing.md`, `api.md`, `mobile.md`).
2. Add a row to the table above with the filename, scope, and a one-line summary.
3. Inside the new file, list rules as actionable statements — things an AI or developer should always/never do when working in that area.
4. Each file can have a "Lessons learned" section at the bottom for project-specific gotchas discovered during reviews.
