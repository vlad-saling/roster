# Static site (docs/)

<!-- Refined from loot/ by slowShipper refine. Source: tech-stack.md, directory-structure.md, patterns.md, vocabulary.md. -->
<!-- Created: refine | This file grows as the system evolves. -->

## What it does

The docs/ directory is the entire application: a static SME roster and profile site served by GitHub Pages. There is no build step or server runtime. Visitors get a roster grid (filter, search, sort) and detail pages per expert. Data lives in two JSON files; scripts are ES modules loaded by the browser. UI is localized (EN/FI/SV) and theme (dark/light) and filter state persist in localStorage.

## Key files

- `docs/data/smes.json` — Single source of truth for all SME profiles; schema in AI-HANDOFF.
- `docs/data/i18n.json` — UI strings for en, fi, sv.
- `docs/scripts/data.js` — Load and cache smes.json; getSmeById, getColorVariant, path resolution.
- `docs/scripts/filters.js` — Tags/sectors, matchSme, filterAndSort, localStorage for selected tags.
- `docs/scripts/i18n.js` — Load i18n, t(), applyTranslations, lang switcher, initHeroTitle.
- `docs/scripts/render-roster.js` — Roster grid, filter chips, cards, wiring to filters/sort.
- `docs/scripts/render-profile.js` — Profile page: get id from query, fetch SME, escapeHtml, render sections.
- `docs/scripts/ui-interactions.js` — Theme toggle, localStorage theme.
- `docs/styles/base.css`, `layout.css`, `components.css`, `themes.css` — Cascade for layout and theme.

## How it works

1. **Data:** One cached fetch of data/smes.json (path derived from location.pathname). No API.
2. **Roster:** Load data → getFilterChipTags (sectors only) → filterAndSort (query + selected tags + sort) → render cards (DOM); filter state in localStorage.
3. **Profile:** Parse ?id= from URL → getSmeById → render sections (HTML strings with escapeHtml); missing/invalid id shows error and link back.
4. **i18n:** Load i18n.json; detect or restore lang from localStorage/browser; applyTranslations fills data-i18n nodes; hero title special-cased.
5. **Theme:** Body class theme-dark/theme-light from localStorage or prefers-color-scheme; setTheme in ui-interactions.

## Dependencies

- **Depends on:** Browser (fetch, DOM, localStorage, ES modules); docs/data/smes.json and i18n.json at correct paths relative to document.
- **Depended on by:** Nothing (leaf system).

## Known gotchas

- Data path is computed from window.location.pathname so the site works when served from /docs/ or from repo root with different path depth. Don’t hardcode paths.
- docs/CNAME is for GitHub Pages custom domain; if deploying elsewhere, it may need to be ignored or repurposed.
- Theme toggle label is updated in two places (i18n.js and ui-interactions.js); change DOM with care.
- New profiles require a new UUID v4 for id, unique in smes.json; app does not validate.
