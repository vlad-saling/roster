# Front-end rules (docs/ static site)

<!-- Refined from loot/ by slowShipper refine. Source: patterns.md, conventions.md, kitchen-sink.md. -->

Scope: `docs/` — HTML, CSS, JavaScript, and data (smes.json, i18n.json). No framework; vanilla ES modules and CSS.

## Data and loading

- Use the single shared data load for roster/profile: `loadSmes()` from data.js (cached fetch of data/smes.json). Path from `window.location.pathname` so it works from any subpath.
- When building HTML that includes user or profile content (e.g. profile page), always pass text through an escape (e.g. createElement + textContent + innerHTML) before inserting into the DOM to avoid XSS. See `escapeHtml` in render-profile.js.

## Theme and i18n

- Theme is applied as a class on `<body>`: `theme-dark` or `theme-light`. Theme-specific styles use selectors like `.theme-dark .sme-card` or `body.theme-dark`. One themes.css; no separate file per theme.
- localStorage keys for persistence: `roster_theme`, `roster_lang`, `roster_filter_tags`. Use the existing keys; don’t invent new ones for the same concerns.
- UI strings: load from data/i18n.json; use `data-i18n="key"` or `data-i18n-placeholder="key"` in HTML; fill with `applyTranslations(root)`. Use `t(key)` or `t(key, { n })` for interpolation. Fallback to `en` if key missing in current lang.

## Filter and display

- Main-page filter chips are built from **sectors** only (not tags), to keep the bar short. Search runs over name, title, headline, shortBio, keywords, sectors, tags (substring, lowercased). Match = passes search (if any) and has at least one selected tag (if any selected).
- Color variant: 0–5 from `sme.colorVariant` if present and valid; else derive stable index from profile `id` (hash mod 6). Use for card class and profile avatar class (sme-card--color-N, profile-avatar--color-N).

## CSS and structure

- BEM-like: block__element, block--modifier (e.g. sme-card__name, chip--filter). Link stylesheets in order: base → layout → components → themes.
- No preprocessor; plain CSS. Custom properties in base.css; theme overrides in themes.css.

## Data (smes.json)

- New profile: assign new UUID v4 to `id` at creation; must be unique in file. No trailing commas in JSON (per AI-HANDOFF). See code-rules.md Profile data and domain-specific-knowledge.md.

## Lessons learned

- **Theme label:** The Dark/Light label is set in both i18n.js (applyTranslations) and ui-interactions.js (initThemeToggle). If you change the DOM for #toggleTheme, update both or refactor to a single owner for the label.
- **Profile init order:** Profile page shows errors via `t('profile.noId')` etc. after `loadI18n()`. Keep that order so error messages are translated; don’t run render before i18n is loaded.
