# QA Mapping

<!-- Refined from loot/ by slowShipper refine. Source: directory-structure.md, vocabulary.md, patterns.md. -->

Path and keyword rules for `ship-qa-scenarios`. First match wins for path prefixes.

## 1. File filter rules

Patterns to ignore when deriving QA focus from a diff (build artifacts, assets).

```
- .git/
- .slowShipper/
- node_modules/
- *.lock
- *.png, *.jpg, *.svg, *.woff2, *.webp
- *.min.js
- docs/assets/
- docs/CNAME
```

## 2. Path prefix → Area

| Path prefix | Area |
|-------------|------|
| docs/data/smes.json | Profile data / SME schema |
| docs/data/i18n.json | UI translations (i18n) |
| docs/scripts/ | Roster and profile logic (JS) |
| docs/styles/ | Layout, components, themes (CSS) |
| docs/index.html | Roster page |
| docs/profile.html | Profile page |
| README.md, AI-HANDOFF.md | Docs / schema / process |
| TODO/ | Project TODOs |

## 3. Keyword/path → QA focus

| Condition (path or filename contains) | Bullet |
|--------------------------------------|--------|
| smes.json, profile, id, UUID | Profile data: unique id (UUID v4), required fields, schema. |
| i18n, translation, data-i18n, t( | UI strings: keys in en/fi/sv; applyTranslations; no hardcoded labels. |
| filters, search, matchSme, sector | Filter and search: sector chips, substring search, localStorage. |
| theme, theme-dark, theme-light | Theme: body class, themes.css, toggle label. |
| escapeHtml, innerHTML | XSS: user/profile content must be escaped before DOM insert. |
| render-profile, render-roster | Init order: i18n before render; data load shared. |
