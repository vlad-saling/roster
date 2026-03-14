# Project Technical Overview

<!-- Refined from loot/ by slowShipper refine. Source: tech-stack.md, directory-structure.md, dependencies.md, kitchen-sink.md. -->

## Tech stack

| Layer | Technology | Version / notes |
|-------|-------------|-----------------|
| Markup | HTML5 | Semantic sections, aria-* where used |
| Styles | CSS | Vanilla; custom properties in base.css, theme overrides in themes.css |
| Script | JavaScript | ES modules; no transpilation; modern browser |
| Data | JSON | docs/data/smes.json (profiles), docs/data/i18n.json (translations) |
| Build | None | Static only; edit files and commit |
| Tests | None | Manual; run locally, review diffs |
| Lint/format | None | By convention; optional to add (see Toolchain) |
| CI/CD | None | Deploy: GitHub Pages, branch main, folder /docs |

## Repository structure

```
repo-root/
├── README.md, AI-HANDOFF.md   # Project and AI/maintainer docs
├── TODO/README.md             # Actionable TODOs (nav, search, toolchain, i18n, anonymization)
├── .slowShipper/              # slowShipper config and context (not part of site)
└── docs/                      # Site root (GitHub Pages)
    ├── index.html             # Roster grid: filters, search, sort, cards → profile
    ├── profile.html           # SME detail (?id=<uuid>)
    ├── CNAME                  # Optional custom domain for GitHub Pages
    ├── data/
    │   ├── smes.json          # All SME profiles (schema in AI-HANDOFF)
    │   └── i18n.json         # UI strings: en, fi, sv
    ├── scripts/               # ES modules
    │   ├── data.js            # loadSmes, getSmeById, getColorVariant
    │   ├── filters.js         # Tags, matchSme, filterAndSort, localStorage
    │   ├── i18n.js            # loadI18n, t(), applyTranslations, lang switcher
    │   ├── render-roster.js   # Grid, filter chips, cards
    │   ├── render-profile.js  # Profile page, escapeHtml, sections
    │   └── ui-interactions.js # Theme toggle, localStorage
    ├── styles/                # base → layout → components → themes
    │   ├── base.css, layout.css, components.css, themes.css
    └── assets/                # images, avatars, icons
```

## Environments / base URLs

| Environment | URL / access |
|-------------|--------------|
| Local | Serve `docs/` (e.g. `python -m http.server 8080` from repo root → http://localhost:8080/docs/; or `cd docs && python -m http.server 8080` → http://localhost:8080/) |
| Production | GitHub Pages: https://&lt;username&gt;.github.io/&lt;repo&gt;/; optional custom domain via docs/CNAME |

## Supported platforms

- Web (static); mobile-first responsive. No iOS/Android app, no server runtime.

## Key dependencies

| Dependency | Role in this project |
|------------|----------------------|
| None (vanilla stack) | No package.json, no CDN libs; browser APIs only (fetch, DOM, localStorage, ES modules). |
| docs/data/smes.json | Single source of truth for profiles; schema in AI-HANDOFF. Missing/invalid JSON → runtime error. |
| docs/data/i18n.json | UI translations (en, fi, sv); missing keys fall back to en. |

## High-risk areas / known gaps

- **Nav: Pricing and About** — Buttons with no href or target pages; only Experts works. Product decision: add pages, remove, or keep as placeholders.
- **Profile data** — Changes to `smes.json` affect roster and profile URLs; ensure unique UUID v4 per new profile (see domain-specific-knowledge.md).

## Toolchain

| Task | Command | Notes |
|------|---------|-------|
| Build | (none) | Static site |
| Run locally | `python -m http.server 8080` (root) or `cd docs && python -m http.server 8080` | |
| Lint / format | (none) | Optional: add e.g. npm run lint, prettier; document in README and slowShipper toolchain when added. |
| Deploy | GitHub Settings → Pages → branch main, folder /docs | |

**Search:** Substring-only in filters.js (`matchSme`). No word-boundary or fuzzy match; acceptable for small roster; optional to enhance later.

## Build and deploy

- **Build:** None; edit files and commit.
- **Run locally:** Serve `docs/` with any static server (see above).
- **Test:** Manual; open roster and profile URLs; check filters and i18n.
- **Deploy:** GitHub Pages from branch main, folder /docs; optional CNAME in docs/ for custom domain.
