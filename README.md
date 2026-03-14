# SME Roster

A static, mobile-first roster of subject-matter experts (SMEs) with a Bento-lite / Linear-inspired dark UI. Built with plain HTML, CSS, and JavaScript for GitHub Pages—no framework or build step.

## What’s in the repo

- **`docs/`** — Static site (GitHub Pages can serve this folder as the site root).
  - **`index.html`** — Roster grid with keyword/tag filters and search.
  - **`profile.html`** — Detail page for one SME (`?id=<uuid>`).
  - **`data/smes.json`** — Single source of truth for all profiles.
  - **`data/i18n.json`** — UI translations for English, Finnish, and Swedish.
  - **`scripts/`** — Data loading, filters, i18n, and rendering (plain JS modules).
  - **`styles/`** — Base, layout, components, and theme CSS.
  - **`assets/avatars/`**, **`assets/icons/`** — Optional images and icons.

## Run locally

Serve the **`docs`** directory with any static server.

From the repo root:

```bash
# Python 3
python -m http.server 8080
# Then open: http://localhost:8080/docs/

# Or serve from inside docs (then root is the site)
cd docs && python -m http.server 8080
# Then open: http://localhost:8080/
```

Or use Node (e.g. `npx serve docs`) or another static server; ensure the server root is `docs/` so that `data/smes.json` and `scripts/` resolve correctly.

## How the site works

- **Roster (`index.html`)**: Loads `data/smes.json`, renders a card per SME, and builds filter chips from `sectors` and `tags`. Search runs over name, title, keywords, sectors, and tags. Sort options: name (A–Z), recently added, primary sector. Filter state is stored in `localStorage`. Clicking a card goes to `profile.html?id=<id>`.
- **Profile (`profile.html`)**: Reads `id` from the query string, fetches `data/smes.json`, finds the matching SME, and renders header, headline, bio, expertise tags, engagement, and links. If `id` is missing or not found, a short error and link back to the roster are shown.
- **Languages**: UI is available in **English (default), Finnish, and Swedish**. The app detects the browser locale on first visit and stores the user’s choice in `localStorage`. The header language switcher (EN / FI / SV) changes the language for all labels, headings, and messages. SME profile content (names, bios, tags) is not translated and remains in English.

## Adding or editing experts

All profile data lives in **`docs/data/smes.json`**: one JSON object per SME.

**Profile data rules:** Every profile **must** have a unique **`id`** in **UUID v4** format (e.g. `82faefcc-111c-4618-a185-5910c174e185`). The `id` is used in profile URLs and must be unique across the file. Full schema and examples: **`AI-HANDOFF.md`**.

To add someone:

1. Add a new object to the array using the schema and examples in **`AI-HANDOFF.md`**.
2. Generate a new UUID v4 for `id` (e.g. `uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`).
3. Save the file; the roster and `profile.html?id=<id>` will reflect the change after refresh.

For AI-assisted workflow (e.g. pasting PDF bios and generating entries), see **`AI-HANDOFF.md`**.

## Theme and layout

- **Design**: Dark-first, high-contrast “Linear” style with Bento-lite cards and subtle glassmorphism (see `docs/styles/themes.css` and component classes in `docs/styles/components.css`).
- **Responsive**: Single column on small screens; 2–4 columns for the roster grid at larger breakpoints (640px, 1024px). Sticky filter bar; tap-friendly controls.
- **Theme toggle**: Header button switches dark/light and persists in `localStorage`.

To tweak colors or spacing, edit CSS custom properties in **`docs/styles/base.css`** (e.g. `--accent`, `--border-subtle`, `--radius-lg`) and overrides in **`docs/styles/themes.css`**.

## Deploy to GitHub Pages

1. In the repo: **Settings → Pages**.
2. Under “Source”, choose **Deploy from a branch**.
3. Branch: **main** (or your default), folder: **/docs**.
4. Save; the site will be at `https://<username>.github.io/<repo>/`.

## Reviewing AI-generated changes

When an AI (or script) adds profiles by editing `docs/data/smes.json`:

- Review the diff for new or changed objects.
- Confirm each new entry has a **unique `id`** and required fields (`name`, `title`, `shortBio`).
- Run the site locally and open the new `profile.html?id=<new-id>` to verify the profile and roster tile.
