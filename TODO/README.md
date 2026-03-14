# Project TODO

Actionable items extracted from codebase review (scout kitchen-sink). See `.slowShipper/context/loot/kitchen-sink.md` for full context.

---

## Profile data rules (reference)

**Every profile in `docs/data/smes.json` must have a unique `id` in UUID v4 format.**  
Used in URLs (`profile.html?id=<uuid>`) and for stable color variants. Generate with e.g. `uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`. Full schema and rules: **`AI-HANDOFF.md`**.

---

## TODOs

### Nav: Pricing and About

- **What:** Nav buttons "Pricing" and "About" have no href or pages; only "Experts" works.
- **Where:** `docs/index.html`, `docs/profile.html` (`.app-nav`).
- **Options:** Add Pricing and About pages, or remove/hide the placeholders until needed.

### Search: word or fuzzy matching (optional)

- **What:** Search is substring-only (`fields.indexOf(q)`). No word-boundary or typo tolerance.
- **Where:** `docs/scripts/filters.js` (`matchSme`).
- **Options:** Keep as-is for small roster; later consider word token or fuzzy match if needed.

### Toolchain: lint and format (optional)

- **What:** No ESLint, Prettier, or CI. Quality is manual (run locally, review diffs).
- **Where:** Repo root and `docs/`.
- **Options:** Add e.g. `npm run lint`, `npx prettier --check .` and document in README / slowShipper toolchain.

### i18n: generalize hero title pattern (low priority)

- **What:** Hero title "Meet our experts" is special-cased in `i18n.js` (`initHeroTitle`). Adding more split phrases would need more special cases.
- **Where:** `docs/scripts/i18n.js`, `docs/index.html` (`.hero-title`).
- **Options:** Generalize to a data attribute pattern (e.g. `data-i18n-prefix` / `data-i18n-suffix`) if more such strings appear.

### Theme label: single source of truth (optional)

- **What:** Theme toggle label is updated in both `i18n.js` (applyTranslations) and `ui-interactions.js` (initThemeToggle). DOM change to `#toggleTheme` could break one of them.
- **Where:** `docs/scripts/i18n.js`, `docs/scripts/ui-interactions.js`.
- **Options:** Have one place own the label update; or leave as-is (low risk).

### Anonymization: policy only

- **What:** Anonymization rules (role-based names, generic orgs) are documented in AI-HANDOFF; the app does not validate or redact.
- **Where:** `AI-HANDOFF.md` (Anonymization section).
- **Options:** Keep as process; optionally add a small validation script or checklist for reviewers.

---

## Notes (from kitchen-sink)

### Profile error when id missing: i18n order

- **What:** If profile.html is opened without `?id=`, render-profile.js calls `renderError(shell, t('profile.noId'))`. That runs in the `.then` after `loadI18n()`, so translations are loaded first. No bug.
- **Where:** `docs/scripts/render-profile.js` (run()).
- **Why here:** Confirms error messages are translated; kept as reference for anyone touching profile init or i18n order.
